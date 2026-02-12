import { describe, expect, it } from "vitest";

import { sampleFunctionPoints } from "@/lib/challenges/sampler";

describe("sampleFunctionPoints", () => {
  it("returns null around rational discontinuity", () => {
    const points = sampleFunctionPoints((x) => {
      if (Math.abs(x - 1) < 0.2) {
        return null;
      }
      return 1 / (x - 1);
    }, [-2, 2], [-10, 10], 0.1);

    const nullCount = points.filter((point) => point.y === null).length;
    expect(nullCount).toBeGreaterThan(0);
  });
});
