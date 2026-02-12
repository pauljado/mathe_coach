import type { Point } from "@/types/challenge";

export const DEFAULT_X_RANGE: [number, number] = [-10, 10];
export const DEFAULT_Y_RANGE: [number, number] = [-10, 10];

export function sampleFunctionPoints(
  evaluate: (x: number) => number | null,
  xRange: [number, number] = DEFAULT_X_RANGE,
  yRange: [number, number] = DEFAULT_Y_RANGE,
  step = 0.1
): Point[] {
  const points: Point[] = [];
  const ySpan = yRange[1] - yRange[0];
  const minVisible = yRange[0] - ySpan * 2;
  const maxVisible = yRange[1] + ySpan * 2;

  for (let x = xRange[0]; x <= xRange[1] + 1e-8; x += step) {
    const xRounded = Number(x.toFixed(3));
    const y = evaluate(xRounded);

    if (y === null || Number.isNaN(y) || !Number.isFinite(y)) {
      points.push({ x: xRounded, y: null });
      continue;
    }

    const clampedY = Math.min(maxVisible, Math.max(minVisible, y));
    points.push({ x: xRounded, y: Number(clampedY.toFixed(3)) });
  }

  return points;
}
