import { describe, expect, it } from "vitest";

import { TRIG_DECK } from "@/lib/trigonometry/deck";
import { trigCategories } from "@/types/trigonometry";

describe("TRIG_DECK", () => {
  it("has a launch deck size in the expected range", () => {
    expect(TRIG_DECK.length).toBeGreaterThanOrEqual(90);
    expect(TRIG_DECK.length).toBeLessThanOrEqual(95);
  });

  it("has unique card ids", () => {
    const ids = TRIG_DECK.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains only valid categories and required bilingual fields", () => {
    const categorySet = new Set(trigCategories);

    for (const card of TRIG_DECK) {
      expect(categorySet.has(card.category)).toBe(true);
      expect(card.promptEn.trim().length).toBeGreaterThan(0);
      expect(card.promptDe.trim().length).toBeGreaterThan(0);
      expect(card.answerEn.trim().length).toBeGreaterThan(0);
      expect(card.answerDe.trim().length).toBeGreaterThan(0);
      expect(card.promptLatex.trim().length).toBeGreaterThan(0);
      expect(card.answerLatex.trim().length).toBeGreaterThan(0);
      expect(Array.isArray(card.aliases)).toBe(true);
    }
  });

  it("covers each configured trigonometry category", () => {
    const seen = new Set(TRIG_DECK.map((card) => card.category));

    for (const category of trigCategories) {
      expect(seen.has(category)).toBe(true);
    }
  });

  it("matches the planned category card counts", () => {
    const counts = TRIG_DECK.reduce<Record<string, number>>((acc, card) => {
      acc[card.category] = (acc[card.category] ?? 0) + 1;
      return acc;
    }, {});

    expect(counts).toEqual({
      unit_circle_angles: 20,
      core_identities: 16,
      angle_sum_difference: 14,
      double_half_angle: 14,
      product_sum_transforms: 10,
      inverse_trig_ranges: 8,
      applied_forms: 10
    });
  });
});
