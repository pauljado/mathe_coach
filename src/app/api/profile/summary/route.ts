import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { BADGE_DETAILS, levelFromXp, xpToNextLevel } from "@/lib/gamification/progress";
import { getOrCreateProfile } from "@/lib/profile";
import { summarizePracticeData } from "@/lib/profile/summary";

export async function GET() {
  const profile = await getOrCreateProfile();

  const [graphAttempts, trigAttempts, badges] = await Promise.all([
    prisma.graphAttempt.findMany({
      where: { profileId: profile.id },
      select: {
        id: true,
        family: true,
        functionText: true,
        isCorrect: true,
        xpAwarded: true,
        createdAt: true
      }
    }),
    prisma.trigFlashcardAttempt.findMany({
      where: { profileId: profile.id },
      select: {
        id: true,
        category: true,
        promptEn: true,
        promptDe: true,
        userAnswer: true,
        isCorrect: true,
        xpAwarded: true,
        createdAt: true
      }
    }),
    prisma.badgeUnlock.findMany({
      where: { profileId: profile.id },
      orderBy: { unlockedAt: "asc" },
      select: {
        badgeCode: true,
        unlockedAt: true
      }
    })
  ]);

  const summary = summarizePracticeData({
    graphAttempts,
    trigAttempts,
    recentLimit: 15
  });

  return NextResponse.json({
    displayName: profile.displayName,
    totals: summary.totals,
    challengeBreakdown: summary.challengeBreakdown,
    gamification: {
      xp: profile.totalXp,
      level: levelFromXp(profile.totalXp),
      xpToNext: xpToNextLevel(profile.totalXp)
    },
    badges: badges.map((badge) => ({
      code: badge.badgeCode,
      unlockedAt: badge.unlockedAt,
      ...(BADGE_DETAILS[badge.badgeCode as keyof typeof BADGE_DETAILS] ?? {
        label: badge.badgeCode,
        description: "Unlocked achievement"
      })
    })),
    attemptsByFamily: summary.attemptsByFamily,
    attemptsByTrigCategory: summary.attemptsByTrigCategory,
    recentAttempts: summary.recentAttempts
  });
}
