export const lgsSizes = [3, 4] as const;
export type LgsSize = (typeof lgsSizes)[number];

export const lgsModes = ["strategy", "hardcore"] as const;
export type LgsMode = (typeof lgsModes)[number];

export type AugmentedMatrix = number[][];

export type LgsChallengePayload = {
  challengeId: string;
  size: LgsSize;
  variableNames: string[];
  matrixLabel: string;
  initialMatrix: AugmentedMatrix;
  targetZeroMask: boolean[][];
  solution: number[];
};
