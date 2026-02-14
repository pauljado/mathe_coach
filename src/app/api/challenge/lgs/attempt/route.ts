import { NextResponse } from "next/server";

import { BADGE_DETAILS, allBadgesForStats, levelFromXp, xpForAttempt } from "@/lib/gamification/progress";
import { getOrCreateProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import type { ConcreteFamily } from "@/types/challenge";
import { lgsModes, type LgsMode } from "@/types/lgs";
import { trigCategories, type TrigCategory } from "@/types/trigonometry";

const VALID_FAMILIES = new Set<ConcreteFamily>([
  "polynomial",
  "trigonometric",
  "exponential",
  "rational"
]);
const VALID_TRIG_CATEGORIES = new Set<TrigCategory>(trigCategories);
const VALID_LGS_MODES = new Set<LgsMode>(lgsModes);

type AttemptBody = {
  challengeId?: string;
  matrixLabel?: string;
  systemSize?: number;
  mode?: string;
  operationCount?: number;
  solvedValues?: number[];
  isCorrect?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as AttemptBody;

  const solvedValuesValid =
    Array.isArray(body.solvedValues) &&
    body.solvedValues.every((value) => typeof value === "number" && Number.isFinite(value));

  if (
    !body.challengeId ||
    !body.matrixLabel ||
    !body.systemSize ||
    !Number.isInteger(body.systemSize) ||
    typeof body.operationCount !== "number" ||
    body.operationCount < 0 ||
    !body.mode ||
    !VALID_LGS_MODES.has(body.mode as LgsMode) ||
    typeof body.isCorrect !== "boolean" ||
    !solvedValuesValid ||
    body.solvedValues!.length !== body.systemSize
  ) {
    return NextResponse.json({ error: "Invalid attempt payload" }, { status: 400 });
  }

  const profile = await getOrCreateProfile();
  const xpAwarded = xpForAttempt(body.isCorrect);

  await prisma.$transaction(async (tx) => {
    await tx.lgsAttempt.create({
      data: {
        profileId: profile.id,
        challengeId: body.challengeId!,
        matrixLabel: body.matrixLabel!,
        systemSize: body.systemSize!,
        mode: body.mode!,
        operationCount: Math.floor(body.operationCount!),
        solvedValues: JSON.stringify(body.solvedValues),
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

  const [graphAttempts, trigAttempts, lgsAttempts] = await Promise.all([
    prisma.graphAttempt.findMany({
      where: { profileId: profile.id },
      select: { family: true, isCorrect: true }
    }),
    prisma.trigFlashcardAttempt.findMany({
      where: { profileId: profile.id },
      select: { category: true, isCorrect: true }
    }),
    prisma.lgsAttempt.findMany({
      where: { profileId: profile.id },
      select: { mode: true, isCorrect: true }
    })
  ]);

  const graphingAttempts = graphAttempts.length;
  const graphingCorrect = graphAttempts.filter((attempt) => attempt.isCorrect).length;
  const familiesAttempted = graphAttempts
    .map((attempt) => attempt.family)
    .filter((family): family is ConcreteFamily => VALID_FAMILIES.has(family as ConcreteFamily));

  const trigAttemptCount = trigAttempts.length;
  const trigCorrect = trigAttempts.filter((attempt) => attempt.isCorrect).length;
  const categoriesAttempted = trigAttempts
    .map((attempt) => attempt.category)
    .filter(
      (category): category is TrigCategory =>
        VALID_TRIG_CATEGORIES.has(category as TrigCategory)
    );

  const lgsAttemptCount = lgsAttempts.length;
  const lgsCorrect = lgsAttempts.filter((attempt) => attempt.isCorrect).length;
  const modesAttempted = lgsAttempts
    .map((attempt) => attempt.mode)
    .filter((mode): mode is LgsMode => VALID_LGS_MODES.has(mode as LgsMode));

  const nowBadges = allBadgesForStats({
    graphing: {
      attempts: graphingAttempts,
      correct: graphingCorrect,
      familiesAttempted
    },
    trigonometry: {
      attempts: trigAttemptCount,
      correct: trigCorrect,
      categoriesAttempted
    },
    lgs: {
      attempts: lgsAttemptCount,
      correct: lgsCorrect,
      modesAttempted
    }
  });

  const existingBadges = await prisma.badgeUnlock.findMany({
    where: { profileId: profile.id },
    select: { badgeCode: true }
  });
  const existingSet = new Set(existingBadges.map((badge) => badge.badgeCode));

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
