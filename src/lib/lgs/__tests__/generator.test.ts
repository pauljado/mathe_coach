import { describe, expect, it } from "vitest";

import { createLgsChallenge, normalizeLgsSize } from "@/lib/lgs/generator";

function solveResidual(coefficients: number[][], solution: number[], rhs: number[]): number[] {
  return coefficients.map((row, rowIndex) => {
    const leftValue = row.reduce((sum, value, colIndex) => sum + value * solution[colIndex]!, 0);
    return leftValue - rhs[rowIndex]!;
  });
}

describe("lgs generator", () => {
  it("normalizes unsupported sizes to default", () => {
    expect(normalizeLgsSize("4")).toBe(4);
    expect(normalizeLgsSize("9")).toBe(3);
    expect(normalizeLgsSize(null)).toBe(3);
  });

  it("creates a challenge payload with consistent matrix dimensions", () => {
    const challenge = createLgsChallenge(3);

    expect(challenge.size).toBe(3);
    expect(challenge.initialMatrix).toHaveLength(3);
    expect(challenge.initialMatrix[0]).toHaveLength(4);
    expect(challenge.targetZeroMask).toHaveLength(3);
    expect(challenge.targetZeroMask[2]?.[0]).toBe(true);
    expect(challenge.targetZeroMask[0]?.[2]).toBe(false);
  });

  it("returns a valid solution that satisfies the generated system", () => {
    const challenge = createLgsChallenge(4);
    const coefficients = challenge.initialMatrix.map((row) => row.slice(0, challenge.size));
    const rhs = challenge.initialMatrix.map((row) => row[challenge.size]!);
    const residual = solveResidual(coefficients, challenge.solution, rhs);

    expect(residual.every((value) => Math.abs(value) < 1e-8)).toBe(true);
  });
});
