export const functionFamilies = [
  "all",
  "polynomial",
  "trigonometric",
  "exponential",
  "rational"
] as const;

export type FunctionFamily = (typeof functionFamilies)[number];
export type ConcreteFamily = Exclude<FunctionFamily, "all">;

export type GeneratedFunction = {
  family: ConcreteFamily;
  displayText: string;
  promptLatex: string;
  evaluate: (x: number) => number | null;
};

export type Point = {
  x: number;
  y: number | null;
};

export type ChallengePayload = {
  challengeId: string;
  family: ConcreteFamily;
  promptLatex: string;
  displayText: string;
  graphPoints: Point[];
  xRange: [number, number];
  yRange: [number, number];
};
