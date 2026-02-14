import { describe, expect, it } from "vitest";

import {
  allBadgesForStats,
  badgesForStats,
  lgsBadgesForStats,
  levelFromXp,
  trigBadgesForStats,
  xpForAttempt,
  xpToNextLevel
} from "@/lib/gamification/progress";

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

  it("unlocks trigonometry badge sets correctly", () => {
    const badges = trigBadgesForStats({
      attempts: 20,
      correct: 16,
      categoriesAttempted: [
        "unit_circle_angles",
        "core_identities",
        "angle_sum_difference",
        "double_half_angle",
        "product_sum_transforms",
        "inverse_trig_ranges",
        "applied_forms"
      ]
    });

    expect(badges).toEqual(
      expect.arrayContaining([
        "TRIG_FIRST_TRY",
        "TRIG_TEN_ATTEMPTS",
        "TRIG_ACCURACY_75",
        "TRIG_CATEGORY_EXPLORER"
      ])
    );
  });

  it("combines graphing and trigonometry badges", () => {
    const badges = allBadgesForStats({
      graphing: {
        attempts: 1,
        correct: 1,
        familiesAttempted: ["polynomial"]
      },
      trigonometry: {
        attempts: 1,
        correct: 1,
        categoriesAttempted: ["core_identities"]
      },
      lgs: {
        attempts: 1,
        correct: 1,
        modesAttempted: ["strategy"]
      }
    });

    expect(badges).toEqual(
      expect.arrayContaining(["FIRST_TRY", "TRIG_FIRST_TRY", "LGS_FIRST_TRY"])
    );
  });

  it("unlocks lgs badge sets correctly", () => {
    const badges = lgsBadgesForStats({
      attempts: 20,
      correct: 16,
      modesAttempted: ["strategy", "hardcore"]
    });

    expect(badges).toEqual(
      expect.arrayContaining([
        "LGS_FIRST_TRY",
        "LGS_TEN_ATTEMPTS",
        "LGS_ACCURACY_75",
        "LGS_MODE_EXPLORER"
      ])
    );
  });
});
