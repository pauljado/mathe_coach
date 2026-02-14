import { describe, expect, it } from "vitest";

import { summarizePracticeData } from "@/lib/profile/summary";

describe("summarizePracticeData", () => {
  it("builds overall and split stats for mixed challenge attempts", () => {
    const graphAttempts = [
      {
        id: 1,
        family: "polynomial",
        functionText: "f(x)=x^2",
        isCorrect: true,
        xpAwarded: 10,
        createdAt: new Date("2026-02-10T10:00:00.000Z")
      },
      {
        id: 2,
        family: "trigonometric",
        functionText: "f(x)=sin(x)",
        isCorrect: false,
        xpAwarded: 4,
        createdAt: new Date("2026-02-10T11:00:00.000Z")
      }
    ];

    const trigAttempts = [
      {
        id: 3,
        category: "core_identities",
        promptEn: "State sin^2 + cos^2.",
        promptDe: "Nenne sin^2 + cos^2.",
        userAnswer: "1",
        isCorrect: true,
        xpAwarded: 10,
        createdAt: new Date("2026-02-10T12:00:00.000Z")
      },
      {
        id: 4,
        category: "unit_circle_angles",
        promptEn: "sin(pi/6)=?",
        promptDe: "sin(pi/6)=?",
        userAnswer: "0.4",
        isCorrect: false,
        xpAwarded: 4,
        createdAt: new Date("2026-02-10T13:00:00.000Z")
      }
    ];

    const summary = summarizePracticeData({ graphAttempts, trigAttempts, recentLimit: 4 });

    expect(summary.totals).toEqual({ attempts: 4, correct: 2, wrong: 2, accuracy: 50 });
    expect(summary.challengeBreakdown.graphing).toEqual({
      attempts: 2,
      correct: 1,
      wrong: 1,
      accuracy: 50
    });
    expect(summary.challengeBreakdown.trigonometry).toEqual({
      attempts: 2,
      correct: 1,
      wrong: 1,
      accuracy: 50
    });

    expect(summary.attemptsByFamily).toEqual({ polynomial: 1, trigonometric: 1 });
    expect(summary.attemptsByTrigCategory).toEqual({ core_identities: 1, unit_circle_angles: 1 });

    expect(summary.recentAttempts).toHaveLength(4);
    expect(summary.recentAttempts[0]?.id).toBe("trig-4");
    expect(summary.recentAttempts[0]?.challengeType).toBe("trigonometry");
    expect(summary.recentAttempts[0]?.userAnswer).toBe("0.4");
    expect(summary.recentAttempts[3]?.id).toBe("graph-1");
  });
});
