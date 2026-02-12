import { describe, expect, it } from "vitest";

import { badgesForStats, levelFromXp, xpForAttempt, xpToNextLevel } from "@/lib/gamification/progress";

describe("gamification", () => {
  it("awards expected xp", () => {
    expect(xpForAttempt(true)).toBe(10);
    expect(xpForAttempt(false)).toBe(4);
  });

  it("calculates levels", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(25)).toBe(2);
    expect(levelFromXp(100)).toBe(3);
  });

  it("calculates xp to next level", () => {
    expect(xpToNextLevel(0)).toBe(25);
    expect(xpToNextLevel(25)).toBe(75);
  });

  it("unlocks badge sets correctly", () => {
    const badges = badgesForStats({
      attempts: 20,
      correct: 15,
      familiesAttempted: ["polynomial", "trigonometric", "exponential", "rational"]
    });

    expect(badges).toEqual(
      expect.arrayContaining(["FIRST_TRY", "TEN_ATTEMPTS", "ACCURACY_70", "FAMILY_EXPLORER"])
    );
  });
});
