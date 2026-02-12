import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getOrCreateProfile } from "@/lib/profile";
import { BADGE_DETAILS, badgesForStats, levelFromXp, xpForAttempt } from "@/lib/gamification/progress";
import type { ConcreteFamily } from "@/types/challenge";

const VALID_FAMILIES = new Set<ConcreteFamily>([
  "polynomial",
  "trigonometric",
  "exponential",
  "rational"
]);

type AttemptBody = {
  challengeId?: string;
  family?: string;
  displayText?: string;
  isCorrect?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as AttemptBody;

  if (
    !body.challengeId ||
    !body.displayText ||
    typeof body.isCorrect !== "boolean" ||
    !body.family ||
    !VALID_FAMILIES.has(body.family as ConcreteFamily)
  ) {
    return NextResponse.json({ error: "Invalid attempt payload" }, { status: 400 });
  }

  const profile = await getOrCreateProfile();
  const xpAwarded = xpForAttempt(body.isCorrect);

  await prisma.$transaction(async (tx) => {
    await tx.graphAttempt.create({
      data: {
        profileId: profile.id,
        challengeId: body.challengeId!,
        family: body.family!,
        functionText: body.displayText!,
        isCorrect: body.isCorrect!,
        xpAwarded
      }
    });

    await tx.profile.update({
      where: { id: profile.id },
      data: {
        totalXp: {
          increment: xpAwarded
        }
      }
    });
  });

  const attempts = await prisma.graphAttempt.findMany({
    where: { profileId: profile.id },
    select: { family: true, isCorrect: true }
  });

  const totalAttempts = attempts.length;
  const correct = attempts.filter((attempt) => attempt.isCorrect).length;
  const familiesAttempted = attempts.map((attempt) => attempt.family as ConcreteFamily);
  const nowBadges = badgesForStats({
    attempts: totalAttempts,
    correct,
    familiesAttempted
  });

  const existingBadges = await prisma.badgeUnlock.findMany({
    where: { profileId: profile.id },
    select: { badgeCode: true }
  });
  const existingSet = new Set(existingBadges.map((b) => b.badgeCode));

  const newBadges = nowBadges.filter((badge) => !existingSet.has(badge));
  if (newBadges.length > 0) {
    await prisma.badgeUnlock.createMany({
      data: newBadges.map((badge) => ({
        profileId: profile.id,
        badgeCode: badge
      }))
    });
  }

  const updatedProfile = await prisma.profile.findUniqueOrThrow({ where: { id: profile.id } });

  return NextResponse.json({
    xpAwarded,
    newTotalXp: updatedProfile.totalXp,
    newLevel: levelFromXp(updatedProfile.totalXp),
    newBadges: newBadges.map((code) => ({
      code,
      ...BADGE_DETAILS[code]
    }))
  });
}
