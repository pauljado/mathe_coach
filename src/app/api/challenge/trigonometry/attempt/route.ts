import { NextResponse } from "next/server";

import { BADGE_DETAILS, allBadgesForStats, levelFromXp, xpForAttempt } from "@/lib/gamification/progress";
import { getOrCreateProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { getTrigCardById } from "@/lib/trigonometry/deck";
import type { ConcreteFamily } from "@/types/challenge";
import { trigCategories, type TrigCategory } from "@/types/trigonometry";

const VALID_FAMILIES = new Set<ConcreteFamily>([
  "polynomial",
  "trigonometric",
  "exponential",
  "rational"
]);
const VALID_TRIG_CATEGORIES = new Set<TrigCategory>(trigCategories);

type AttemptBody = {
  challengeId?: string;
  cardId?: string;
  userAnswer?: string;
  isCorrect?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as AttemptBody;
  const userAnswer = body.userAnswer?.trim();

  if (!body.challengeId || !body.cardId || typeof body.isCorrect !== "boolean" || !userAnswer) {
    return NextResponse.json({ error: "Invalid attempt payload" }, { status: 400 });
  }

  const card = getTrigCardById(body.cardId);
  if (!card) {
    return NextResponse.json({ error: "Unknown card id" }, { status: 400 });
  }

  const profile = await getOrCreateProfile();
  const xpAwarded = xpForAttempt(body.isCorrect);

  await prisma.$transaction(async (tx) => {
    await tx.trigFlashcardAttempt.create({
      data: {
        profileId: profile.id,
        challengeId: body.challengeId!,
        cardId: body.cardId!,
        category: card.category,
        promptEn: card.promptEn,
        promptDe: card.promptDe,
        answerEn: card.answerEn,
        answerDe: card.answerDe,
        userAnswer,
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

  const [graphAttempts, trigAttempts] = await Promise.all([
    prisma.graphAttempt.findMany({
      where: { profileId: profile.id },
      select: { family: true, isCorrect: true }
    }),
    prisma.trigFlashcardAttempt.findMany({
      where: { profileId: profile.id },
      select: { category: true, isCorrect: true }
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
