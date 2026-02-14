import { describe, expect, it } from "vitest";

import { createTrigonometryChallenge, normalizeTrigCategories } from "@/lib/trigonometry/generator";
import { trigCategories } from "@/types/trigonometry";

describe("trigonometry generator", () => {
  it("normalizes category query values", () => {
    const result = normalizeTrigCategories([
      "unit_circle_angles",
      "unit_circle_angles",
      "unknown_category",
      " core_identities "
    ]);

    expect(result).toEqual(["unit_circle_angles", "core_identities"]);
  });

  it("respects selected categories when generating a challenge", () => {
    const challenge = createTrigonometryChallenge(["double_half_angle"]);

    expect(challenge.category).toBe("double_half_angle");
    expect(challenge.cardId.startsWith("double_half_angle_")).toBe(true);
  });

  it("falls back to full deck when no category is provided", () => {
    const challenge = createTrigonometryChallenge([]);

    expect(trigCategories).toContain(challenge.category);
    expect(challenge.promptEn.length).toBeGreaterThan(0);
    expect(challenge.promptDe.length).toBeGreaterThan(0);
    expect(challenge.answerEn.length).toBeGreaterThan(0);
    expect(challenge.answerDe.length).toBeGreaterThan(0);
    expect(challenge.promptLatex.length).toBeGreaterThan(0);
    expect(challenge.answerLatex.length).toBeGreaterThan(0);
  });
});
