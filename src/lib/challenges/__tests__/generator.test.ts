import { describe, expect, it } from "vitest";

import { createGraphingChallenge } from "@/lib/challenges/generator";

describe("createGraphingChallenge", () => {
  it("returns requested family when specific family is chosen", () => {
    const challenge = createGraphingChallenge("polynomial");

    expect(challenge.family).toBe("polynomial");
    expect(challenge.graphPoints.length).toBeGreaterThan(0);
  });

  it("returns a valid family for all", () => {
    const challenge = createGraphingChallenge("all");
    expect(["polynomial", "trigonometric", "exponential", "rational"]).toContain(
      challenge.family
    );
  });
});
