import type { ConcreteFamily } from "@/types/challenge";

export type BadgeCode = "FIRST_TRY" | "TEN_ATTEMPTS" | "ACCURACY_70" | "FAMILY_EXPLORER";

export const BADGE_DETAILS: Record<BadgeCode, { label: string; description: string }> = {
  FIRST_TRY: {
    label: "First Try",
    description: "Complete your first sketch challenge."
  },
  TEN_ATTEMPTS: {
    label: "Ten Attempts",
    description: "Log 10 total graphing attempts."
  },
  ACCURACY_70: {
    label: "Steady Accuracy",
    description: "Reach at least 70% accuracy after 20 attempts."
  },
  FAMILY_EXPLORER: {
    label: "Family Explorer",
    description: "Try at least one graph in every function family."
  }
};

export function xpForAttempt(isCorrect: boolean): number {
  return isCorrect ? 10 : 4;
}

export function levelFromXp(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 25)) + 1;
}

export function xpToNextLevel(totalXp: number): number {
  const level = levelFromXp(totalXp);
  const nextThreshold = Math.pow(level, 2) * 25;
  return Math.max(0, nextThreshold - totalXp);
}

export function badgesForStats(input: {
  attempts: number;
  correct: number;
  familiesAttempted: ConcreteFamily[];
}): BadgeCode[] {
  const badges: BadgeCode[] = [];
  const { attempts, correct, familiesAttempted } = input;

  if (attempts >= 1) badges.push("FIRST_TRY");
  if (attempts >= 10) badges.push("TEN_ATTEMPTS");

  if (attempts >= 20) {
    const accuracy = attempts === 0 ? 0 : (correct / attempts) * 100;
    if (accuracy >= 70) {
      badges.push("ACCURACY_70");
    }
  }

  const set = new Set(familiesAttempted);
  if (
    set.has("polynomial") &&
    set.has("trigonometric") &&
    set.has("exponential") &&
    set.has("rational")
  ) {
    badges.push("FAMILY_EXPLORER");
  }

  return badges;
}
