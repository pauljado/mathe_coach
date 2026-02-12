import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { BADGE_DETAILS, levelFromXp, xpToNextLevel } from "@/lib/gamification/progress";
import { getOrCreateProfile } from "@/lib/profile";

export async function GET() {
  const profile = await getOrCreateProfile();

  const [attempts, badges] = await Promise.all([
    prisma.graphAttempt.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true,
        family: true,
        functionText: true,
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

  const attemptCount = await prisma.graphAttempt.count({ where: { profileId: profile.id } });
  const correctCount = await prisma.graphAttempt.count({
    where: { profileId: profile.id, isCorrect: true }
  });

  const attemptsByFamilyRows = await prisma.graphAttempt.groupBy({
    by: ["family"],
    where: { profileId: profile.id },
    _count: {
      _all: true
    }
  });

  const attemptsByFamily = attemptsByFamilyRows.reduce<Record<string, number>>((acc, row) => {
    acc[row.family] = row._count._all;
    return acc;
  }, {});

  const accuracy = attemptCount === 0 ? 0 : Number(((correctCount / attemptCount) * 100).toFixed(1));

  return NextResponse.json({
    displayName: profile.displayName,
    totals: {
      attempts: attemptCount,
      correct: correctCount,
      wrong: Math.max(0, attemptCount - correctCount),
      accuracy
    },
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
    attemptsByFamily,
    recentAttempts: attempts
  });
}
