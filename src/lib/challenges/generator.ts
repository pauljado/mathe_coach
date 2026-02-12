import { randomUUID } from "node:crypto";

import type { ChallengePayload, ConcreteFamily, FunctionFamily, GeneratedFunction } from "@/types/challenge";
import { DEFAULT_X_RANGE, DEFAULT_Y_RANGE, sampleFunctionPoints } from "@/lib/challenges/sampler";

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

function chooseFamily(requested: FunctionFamily): ConcreteFamily {
  if (requested !== "all") {
    return requested;
  }
  const allFamilies: ConcreteFamily[] = ["polynomial", "trigonometric", "exponential", "rational"];
  return allFamilies[randomInt(0, allFamilies.length - 1)];
}

function signedText(value: number): string {
  return `${value >= 0 ? "+" : "-"} ${Math.abs(value)}`;
}

function signedLatex(value: number): string {
  return `${value >= 0 ? "+" : "-"} ${Math.abs(value)}`;
}

function polynomial(): GeneratedFunction {
  if (Math.random() > 0.5) {
    const a = randomNonZeroInt(-3, 3);
    const b = randomInt(-5, 5);
    const c = randomInt(-6, 6);
    const displayText = `f(x) = ${a}x^2 ${signedText(b)}x ${signedText(c)}`;
    const promptLatex = `f(x) = ${a}x^{2} ${signedLatex(b)}x ${signedLatex(c)}`;

    return {
      family: "polynomial",
      displayText,
      promptLatex,
      evaluate: (x) => a * x * x + b * x + c
    };
  }

  const a = randomNonZeroInt(-2, 2);
  const b = randomNonZeroInt(-5, 5);
  const displayText = `f(x) = ${a}x^3 ${signedText(b)}x`;
  const promptLatex = `f(x) = ${a}x^{3} ${signedLatex(b)}x`;

  return {
    family: "polynomial",
    displayText,
    promptLatex,
    evaluate: (x) => a * x * x * x + b * x
  };
}

function trigonometric(): GeneratedFunction {
  const trig = Math.random() > 0.5 ? "sin" : "cos";
  const a = randomNonZeroInt(-4, 4);
  const b = randomNonZeroInt(1, 3);
  const c = randomInt(-3, 3);
  const d = randomInt(-3, 3);
  const displayText = `f(x) = ${a}${trig}(${b}x ${signedText(c)}) ${signedText(d)}`;
  const promptLatex = `f(x) = ${a}\\${trig}\\left(${b}x ${signedLatex(c)}\\right) ${signedLatex(d)}`;

  return {
    family: "trigonometric",
    displayText,
    promptLatex,
    evaluate: (x) => {
      const angle = b * x + c;
      const base = trig === "sin" ? Math.sin(angle) : Math.cos(angle);
      return a * base + d;
    }
  };
}

function exponential(): GeneratedFunction {
  const a = randomNonZeroInt(-3, 3);
  const bases = [2, 3, 0.5];
  const b = bases[randomInt(0, bases.length - 1)];
  const c = randomInt(-2, 2);
  const d = randomInt(-4, 4);
  const shiftText = `${c >= 0 ? "-" : "+"} ${Math.abs(c)}`;
  const shiftLatex = `${c >= 0 ? "-" : "+"} ${Math.abs(c)}`;
  const displayText = `f(x) = ${a}*${b}^(x ${shiftText}) ${signedText(d)}`;
  const promptLatex = `f(x) = ${a}\\cdot ${b}^{\\left(x ${shiftLatex}\\right)} ${signedLatex(d)}`;

  return {
    family: "exponential",
    displayText,
    promptLatex,
    evaluate: (x) => a * Math.pow(b, x - c) + d
  };
}

function rational(): GeneratedFunction {
  const a = randomNonZeroInt(-3, 3);
  const b = randomInt(-6, 6);
  const c = randomNonZeroInt(-3, 3);
  const d = randomNonZeroInt(-6, 6);
  const displayText = `f(x) = (${a}x ${signedText(b)}) / (${c}x ${signedText(d)})`;
  const promptLatex = `f(x) = \\frac{${a}x ${signedLatex(b)}}{${c}x ${signedLatex(d)}}`;

  return {
    family: "rational",
    displayText,
    promptLatex,
    evaluate: (x) => {
      const denominator = c * x + d;
      if (Math.abs(denominator) < 0.1) {
        return null;
      }
      return (a * x + b) / denominator;
    }
  };
}

function generatorForFamily(family: ConcreteFamily): GeneratedFunction {
  switch (family) {
    case "polynomial":
      return polynomial();
    case "trigonometric":
      return trigonometric();
    case "exponential":
      return exponential();
    case "rational":
      return rational();
  }
}

export function createGraphingChallenge(requestedFamily: FunctionFamily): ChallengePayload {
  const family = chooseFamily(requestedFamily);
  const generated = generatorForFamily(family);
  const graphPoints = sampleFunctionPoints(generated.evaluate, DEFAULT_X_RANGE, DEFAULT_Y_RANGE);

  return {
    challengeId: randomUUID(),
    family: generated.family,
    promptLatex: generated.promptLatex,
    displayText: generated.displayText,
    graphPoints,
    xRange: DEFAULT_X_RANGE,
    yRange: DEFAULT_Y_RANGE
  };
}
