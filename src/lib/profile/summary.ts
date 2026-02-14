export type GraphAttemptSummary = {
  id: number;
  family: string;
  functionText: string;
  isCorrect: boolean;
  xpAwarded: number;
  createdAt: Date;
};

export type TrigAttemptSummary = {
  id: number;
  category: string;
  promptEn: string;
  promptDe: string;
  userAnswer: string;
  isCorrect: boolean;
  xpAwarded: number;
  createdAt: Date;
};

export type ChallengeStats = {
  attempts: number;
  correct: number;
  wrong: number;
  accuracy: number;
};

export type SummaryRecentAttempt = {
  id: string;
  challengeType: "graphing" | "trigonometry";
  topic: string;
  prompt: string;
  promptSecondary: string | null;
  userAnswer: string | null;
  isCorrect: boolean;
  xpAwarded: number;
  createdAt: Date;
};

function createStats(attempts: number, correct: number): ChallengeStats {
  return {
    attempts,
    correct,
    wrong: Math.max(0, attempts - correct),
    accuracy: attempts === 0 ? 0 : Number(((correct / attempts) * 100).toFixed(1))
  };
}

export function summarizePracticeData(input: {
  graphAttempts: GraphAttemptSummary[];
  trigAttempts: TrigAttemptSummary[];
  recentLimit?: number;
}) {
  const { graphAttempts, trigAttempts } = input;
  const recentLimit = input.recentLimit ?? 15;

  const graphingCorrect = graphAttempts.filter((attempt) => attempt.isCorrect).length;
  const trigCorrect = trigAttempts.filter((attempt) => attempt.isCorrect).length;

  const challengeBreakdown = {
    graphing: createStats(graphAttempts.length, graphingCorrect),
    trigonometry: createStats(trigAttempts.length, trigCorrect)
  };

  const totals = createStats(
    graphAttempts.length + trigAttempts.length,
    graphingCorrect + trigCorrect
  );

  const attemptsByFamily = graphAttempts.reduce<Record<string, number>>((acc, attempt) => {
    acc[attempt.family] = (acc[attempt.family] ?? 0) + 1;
    return acc;
  }, {});

  const attemptsByTrigCategory = trigAttempts.reduce<Record<string, number>>((acc, attempt) => {
    acc[attempt.category] = (acc[attempt.category] ?? 0) + 1;
    return acc;
  }, {});

  const recentAttempts = [
    ...graphAttempts.map<SummaryRecentAttempt>((attempt) => ({
      id: `graph-${attempt.id}`,
      challengeType: "graphing",
      topic: attempt.family,
      prompt: attempt.functionText,
      promptSecondary: null,
      userAnswer: null,
      isCorrect: attempt.isCorrect,
      xpAwarded: attempt.xpAwarded,
      createdAt: attempt.createdAt
    })),
    ...trigAttempts.map<SummaryRecentAttempt>((attempt) => ({
      id: `trig-${attempt.id}`,
      challengeType: "trigonometry",
      topic: attempt.category,
      prompt: attempt.promptEn,
      promptSecondary: attempt.promptDe,
      userAnswer: attempt.userAnswer,
      isCorrect: attempt.isCorrect,
      xpAwarded: attempt.xpAwarded,
      createdAt: attempt.createdAt
    }))
  ]
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
    .slice(0, recentLimit);

  return {
    totals,
    challengeBreakdown,
    attemptsByFamily,
    attemptsByTrigCategory,
    recentAttempts
  };
}
