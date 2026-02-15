import type { Point } from "@/types/challenge";

type GraphCanvasProps = {
  points: Point[];
  xRange: [number, number];
  yRange: [number, number];
};

const WIDTH = 720;
const HEIGHT = 420;
const TICK_SIZE = 6;

function toSvgX(x: number, [xMin, xMax]: [number, number]): number {
  return ((x - xMin) / (xMax - xMin)) * WIDTH;
}

function toSvgY(y: number, [yMin, yMax]: [number, number]): number {
  return HEIGHT - ((y - yMin) / (yMax - yMin)) * HEIGHT;
}

function buildPaths(points: Point[], xRange: [number, number], yRange: [number, number]): string[] {
  const segments: string[] = [];
  let current = "";

  for (const point of points) {
    if (point.y === null) {
      if (current.trim()) {
        segments.push(current.trim());
      }
      current = "";
      continue;
    }

    const x = toSvgX(point.x, xRange);
    const y = toSvgY(point.y, yRange);

    current += current ? ` L ${x} ${y}` : `M ${x} ${y}`;
  }

  if (current.trim()) {
    segments.push(current.trim());
  }

  return segments;
}

function createTicks([min, max]: [number, number], divisions = 10): number[] {
  const span = max - min;
  const roughStep = span / divisions;
  const power = Math.pow(10, Math.floor(Math.log10(Math.abs(roughStep) || 1)));
  const normalized = roughStep / power;

  let nice = 1;
  if (normalized > 1 && normalized <= 2) nice = 2;
  else if (normalized > 2 && normalized <= 5) nice = 5;
  else if (normalized > 5) nice = 10;

  const step = nice * power;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];

  for (let value = start; value <= max + 1e-8; value += step) {
    ticks.push(Number(value.toFixed(3)));
  }

  return ticks;
}

export function GraphCanvas({ points, xRange, yRange }: GraphCanvasProps) {
  const xAxisY = toSvgY(0, yRange);
  const yAxisX = toSvgX(0, xRange);
  const paths = buildPaths(points, xRange, yRange);
  const xTicks = createTicks(xRange, 10);
  const yTicks = createTicks(yRange, 10);
  const xAxisVisible = xAxisY >= 0 && xAxisY <= HEIGHT;
  const yAxisVisible = yAxisX >= 0 && yAxisX <= WIDTH;

  return (
    <div className="card graph-card">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Aufgedeckter Funktionsgraph"
        className="graph-svg"
      >
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#f8fbff" />

        {Array.from({ length: 11 }, (_, i) => i).map((index) => {
          const gx = (WIDTH / 10) * index;
          const gy = (HEIGHT / 10) * index;
          return (
            <g key={index}>
              <line x1={gx} y1={0} x2={gx} y2={HEIGHT} stroke="#dce9fb" strokeWidth="1" />
              <line x1={0} y1={gy} x2={WIDTH} y2={gy} stroke="#dce9fb" strokeWidth="1" />
            </g>
          );
        })}

        <line x1={0} y1={xAxisY} x2={WIDTH} y2={xAxisY} stroke="#6779a4" strokeWidth="2" />
        <line x1={yAxisX} y1={0} x2={yAxisX} y2={HEIGHT} stroke="#6779a4" strokeWidth="2" />

        {xTicks.map((tick) => {
          const x = toSvgX(tick, xRange);
          const yBase = xAxisVisible ? xAxisY : HEIGHT - 18;
          return (
            <g key={`x-${tick}`}>
              <line x1={x} y1={yBase - TICK_SIZE} x2={x} y2={yBase + TICK_SIZE} stroke="#445272" strokeWidth="1.5" />
              {tick !== 0 ? (
                <text x={x} y={yBase + 18} textAnchor="middle" className="axis-label">
                  {tick}
                </text>
              ) : null}
            </g>
          );
        })}

        {yTicks.map((tick) => {
          const y = toSvgY(tick, yRange);
          const xBase = yAxisVisible ? yAxisX : 18;
          return (
            <g key={`y-${tick}`}>
              <line x1={xBase - TICK_SIZE} y1={y} x2={xBase + TICK_SIZE} y2={y} stroke="#445272" strokeWidth="1.5" />
              {tick !== 0 ? (
                <text x={xBase - 10} y={y + 4} textAnchor="end" className="axis-label">
                  {tick}
                </text>
              ) : null}
            </g>
          );
        })}

        {paths.map((path, index) => (
          <path
            key={index}
            d={path}
            fill="none"
            stroke="#005fcc"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </div>
  );
}
