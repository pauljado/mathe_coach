import { randomUUID } from "node:crypto";

import { lgsSizes, type AugmentedMatrix, type LgsChallengePayload, type LgsSize } from "@/types/lgs";

const MAX_ABS_ENTRY = 48;
const VARIABLE_POOL = ["x", "y", "z", "w"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNonZeroInt(min: number, max: number): number {
  let value = 0;
  while (value === 0) {
    value = randomInt(min, max);
  }
  return value;
}

function randomFrom<T>(input: T[]): T {
  return input[randomInt(0, input.length - 1)]!;
}

function deepCopy(matrix: AugmentedMatrix): AugmentedMatrix {
  return matrix.map((row) => [...row]);
}

function multiplyMatrixVector(coefficients: number[][], vector: number[]): number[] {
  return coefficients.map((row) =>
    row.reduce((sum, value, index) => sum + value * vector[index]!, 0)
  );
}

function buildTargetZeroMask(size: number): boolean[][] {
  return Array.from({ length: size }, (_, rowIndex) =>
    Array.from({ length: size }, (_, colIndex) => rowIndex > colIndex)
  );
}

function buildUpperTriangular(size: number): number[][] {
  const matrix: number[][] = [];

  for (let row = 0; row < size; row += 1) {
    const nextRow: number[] = [];
    for (let col = 0; col < size; col += 1) {
      if (col < row) {
        nextRow.push(0);
      } else if (col === row) {
        nextRow.push(randomNonZeroInt(-5, 5));
      } else {
        nextRow.push(randomInt(-4, 4));
      }
    }
    matrix.push(nextRow);
  }

  return matrix;
}

function applyScrambleOperations(matrix: AugmentedMatrix): AugmentedMatrix {
  const scrambled = deepCopy(matrix);
  const rowCount = scrambled.length;
  const operationCount = rowCount * 2 + 2;

  for (let operation = 0; operation < operationCount; operation += 1) {
    const source = randomInt(0, rowCount - 1);
    let target = randomInt(0, rowCount - 1);
    while (target === source) {
      target = randomInt(0, rowCount - 1);
    }

    const factor = randomFrom([-2, -1, 1, 2]);
    for (let col = 0; col < rowCount + 1; col += 1) {
      scrambled[target]![col] = scrambled[target]![col]! + factor * scrambled[source]![col]!;
    }
  }

  if (Math.random() > 0.45) {
    const first = randomInt(0, rowCount - 1);
    let second = randomInt(0, rowCount - 1);
    while (first === second) {
      second = randomInt(0, rowCount - 1);
    }
    [scrambled[first], scrambled[second]] = [scrambled[second]!, scrambled[first]!];
  }

  return scrambled;
}

function isMatrixWithinRange(matrix: AugmentedMatrix): boolean {
  return matrix.every((row) => row.every((value) => Math.abs(value) <= MAX_ABS_ENTRY));
}

function generateSolvableAugmentedMatrix(size: number): { matrix: AugmentedMatrix; solution: number[] } {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const solution = Array.from({ length: size }, () => randomInt(-5, 5));
    const coefficients = buildUpperTriangular(size);
    const rhs = multiplyMatrixVector(coefficients, solution);
    const triangular = coefficients.map((row, rowIndex) => [...row, rhs[rowIndex]!]);
    const scrambled = applyScrambleOperations(triangular);

    if (!isMatrixWithinRange(scrambled)) {
      continue;
    }

    return {
      matrix: scrambled,
      solution
    };
  }

  const fallbackSolution = Array.from({ length: size }, (_, index) => index + 1);
  const fallbackCoefficients = buildUpperTriangular(size);
  const fallbackRhs = multiplyMatrixVector(fallbackCoefficients, fallbackSolution);
  return {
    matrix: fallbackCoefficients.map((row, rowIndex) => [...row, fallbackRhs[rowIndex]!]),
    solution: fallbackSolution
  };
}

export function normalizeLgsSize(rawSize: string | null): LgsSize {
  const parsed = Number(rawSize ?? "");
  return lgsSizes.includes(parsed as LgsSize) ? (parsed as LgsSize) : lgsSizes[0];
}

function chooseSize(requestedSize?: LgsSize): LgsSize {
  if (requestedSize && lgsSizes.includes(requestedSize)) {
    return requestedSize;
  }

  return randomFrom([...lgsSizes]);
}

export function createLgsChallenge(requestedSize?: LgsSize): LgsChallengePayload {
  const size = chooseSize(requestedSize);
  const { matrix, solution } = generateSolvableAugmentedMatrix(size);

  return {
    challengeId: randomUUID(),
    size,
    variableNames: VARIABLE_POOL.slice(0, size),
    matrixLabel: `${size}x${size} lineares Gleichungssystem`,
    initialMatrix: matrix,
    targetZeroMask: buildTargetZeroMask(size),
    solution
  };
}
