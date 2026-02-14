"use client";

import { useEffect, useMemo, useState } from "react";

import { BadgeGrid } from "@/components/BadgeGrid";

type ChallengeType = "graphing" | "trigonometry" | "lgs";

type ProfileSummary = {
  displayName: string;
  totals: {
    attempts: number;
    correct: number;
    wrong: number;
    accuracy: number;
  };
  challengeBreakdown: Record<ChallengeType, { attempts: number; correct: number; wrong: number; accuracy: number }>;
  gamification: {
    xp: number;
    level: number;
    xpToNext: number;
  };
  badges: Array<{ code: string; label: string; description: string; unlockedAt: string }>;
  attemptsByFamily: Record<string, number>;
  attemptsByTrigCategory: Record<string, number>;
  attemptsByLgsMode: Record<string, number>;
  recentAttempts: Array<{
    id: string;
    challengeType: ChallengeType;
    topic: string;
    prompt: string;
    promptSecondary: string | null;
    userAnswer: string | null;
    isCorrect: boolean;
    xpAwarded: number;
    createdAt: string;
  }>;
};

function humanizeTopic(topic: string): string {
  return topic
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ProfilePage() {
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType>("graphing");
  const [showAttemptStats, setShowAttemptStats] = useState(false);

  async function loadSummary() {
    setLoading(true);
    const response = await fetch("/api/profile/summary", { method: "GET" });
    const payload = (await response.json()) as ProfileSummary;
    setSummary(payload);
    setLoading(false);
  }

  useEffect(() => {
    void loadSummary();
  }, []);

  const xpProgress = useMemo(() => {
    if (!summary) {
      return 0;
    }

    const level = summary.gamification.level;
    const currentThreshold = Math.pow(level - 1, 2) * 25;
    const nextThreshold = Math.pow(level, 2) * 25;
    const segment = Math.max(1, nextThreshold - currentThreshold);
    return ((summary.gamification.xp - currentThreshold) / segment) * 100;
  }, [summary]);

  const selectedBreakdown = useMemo(() => {
    if (!summary) {
      return { attempts: 0, correct: 0, wrong: 0, accuracy: 0 };
    }

    return summary.challengeBreakdown[selectedChallenge];
  }, [selectedChallenge, summary]);

  const filteredRecentAttempts = useMemo(() => {
    if (!summary) {
      return [];
    }

    return summary.recentAttempts.filter((attempt) => attempt.challengeType === selectedChallenge);
  }, [selectedChallenge, summary]);

  if (loading || !summary) {
    return (
      <section className="card loading-card">
        <h1>Profile</h1>
        <p>Loading progress...</p>
      </section>
    );
  }

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card profile-header">
        <h1>{summary.displayName}</h1>
        <p className="muted">Track your graphing, trigonometry, and LGS progress with shared XP.</p>
      </div>

      <div className="grid grid-3">
        <article className="card stat-card">
          <h2>Level {summary.gamification.level}</h2>
          <p>{summary.gamification.xp} XP total</p>
          <div className="meter" aria-label="XP progress to next level">
            <div className="meter-fill" style={{ width: `${Math.min(100, Math.max(0, xpProgress))}%` }} />
          </div>
          <p className="muted">{summary.gamification.xpToNext} XP to next level</p>
        </article>

        <article className="card stat-card">
          <h2>Overall Accuracy</h2>
          <p className="stat-big">{summary.totals.accuracy}%</p>
          <p className="muted">
            {summary.totals.correct} correct / {summary.totals.attempts} attempts
          </p>
        </article>

        <article className="card stat-card">
          <h2>Overall Attempts</h2>
          <p className="stat-big">{summary.totals.attempts}</p>
          <p className="muted">Wrong answers: {summary.totals.wrong}</p>
        </article>
      </div>

      <div className="card badges-section">
        <h2>Badges</h2>
        <BadgeGrid badges={summary.badges} />
      </div>

      <details className="card further-stats">
        <summary>Further stats</summary>
        <div className="further-controls">
          <label>
            <span className="muted">Challenge</span>
            <select
              value={selectedChallenge}
              onChange={(event) => setSelectedChallenge(event.target.value as ChallengeType)}
              aria-label="Select challenge for detailed stats"
            >
              <option value="graphing">Graphing challenge</option>
              <option value="trigonometry">Trigonometry flashcards</option>
              <option value="lgs">Gaussian elimination</option>
            </select>
          </label>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowAttemptStats((current) => !current)}
            aria-expanded={showAttemptStats}
          >
            {showAttemptStats ? "Hide attempt boxes" : "Show attempt boxes"}
          </button>
        </div>

        <div className="card split-summary-card">
          <h2>
            {selectedChallenge === "graphing"
              ? "Graphing"
              : selectedChallenge === "trigonometry"
                ? "Trigonometry"
                : "Gaussian Elimination"} Summary
          </h2>
          <p className="muted">
            Accuracy: {selectedBreakdown.accuracy}% ({selectedBreakdown.correct} correct / {selectedBreakdown.attempts} attempts)
          </p>
          <p className="muted">Wrong answers: {selectedBreakdown.wrong}</p>
        </div>

        {selectedChallenge === "graphing" && showAttemptStats ? (
          <div className="grid grid-2">
            <article className="card family-card">
              <h2>Attempts by Family</h2>
              {Object.keys(summary.attemptsByFamily).length === 0 ? (
                <p className="muted">No attempts yet.</p>
              ) : (
                <ul className="plain-list">
                  {Object.entries(summary.attemptsByFamily).map(([family, count]) => (
                    <li key={family}>
                      <span>{humanizeTopic(family)}</span>
                      <strong>{count}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="card family-card">
              <h2>Recent Graphing Attempts</h2>
              {filteredRecentAttempts.length === 0 ? (
                <p className="muted">Start your first graphing challenge to populate this feed.</p>
              ) : (
                <ul className="plain-list attempts-list">
                  {filteredRecentAttempts.map((attempt) => (
                    <li key={attempt.id}>
                      <div>
                        <strong>{humanizeTopic(attempt.topic)}</strong>
                        <p className="muted">{attempt.prompt}</p>
                      </div>
                      <div>
                        <span className={attempt.isCorrect ? "result-good" : "result-bad"}>
                          {attempt.isCorrect ? "Correct" : "Wrong"}
                        </span>
                        <p className="muted">+{attempt.xpAwarded} XP</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>
        ) : null}

        {selectedChallenge === "trigonometry" && showAttemptStats ? (
          <div className="grid grid-2">
            <article className="card family-card">
              <h2>Attempts by Category</h2>
              {Object.keys(summary.attemptsByTrigCategory).length === 0 ? (
                <p className="muted">No attempts yet.</p>
              ) : (
                <ul className="plain-list">
                  {Object.entries(summary.attemptsByTrigCategory).map(([category, count]) => (
                    <li key={category}>
                      <span>{humanizeTopic(category)}</span>
                      <strong>{count}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="card family-card">
              <h2>Recent Trigonometry Attempts</h2>
              {filteredRecentAttempts.length === 0 ? (
                <p className="muted">Start your first flashcard attempt to populate this feed.</p>
              ) : (
                <ul className="plain-list attempts-list">
                  {filteredRecentAttempts.map((attempt) => (
                    <li key={attempt.id}>
                      <div>
                        <strong>{humanizeTopic(attempt.topic)}</strong>
                        <p className="muted">{attempt.prompt}</p>
                        {attempt.promptSecondary ? <p className="muted">{attempt.promptSecondary}</p> : null}
                        {attempt.userAnswer ? <p className="muted">Your answer: {attempt.userAnswer}</p> : null}
                      </div>
                      <div>
                        <span className={attempt.isCorrect ? "result-good" : "result-bad"}>
                          {attempt.isCorrect ? "Correct" : "Wrong"}
                        </span>
                        <p className="muted">+{attempt.xpAwarded} XP</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>
        ) : null}

        {selectedChallenge === "lgs" && showAttemptStats ? (
          <div className="grid grid-2">
            <article className="card family-card">
              <h2>Attempts by Mode</h2>
              {Object.keys(summary.attemptsByLgsMode).length === 0 ? (
                <p className="muted">No attempts yet.</p>
              ) : (
                <ul className="plain-list">
                  {Object.entries(summary.attemptsByLgsMode).map(([mode, count]) => (
                    <li key={mode}>
                      <span>{humanizeTopic(mode)}</span>
                      <strong>{count}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="card family-card">
              <h2>Recent LGS Attempts</h2>
              {filteredRecentAttempts.length === 0 ? (
                <p className="muted">Start your first LGS challenge to populate this feed.</p>
              ) : (
                <ul className="plain-list attempts-list">
                  {filteredRecentAttempts.map((attempt) => (
                    <li key={attempt.id}>
                      <div>
                        <strong>{humanizeTopic(attempt.topic)}</strong>
                        <p className="muted">{attempt.prompt}</p>
                        {attempt.userAnswer ? <p className="muted">Solved values: {attempt.userAnswer}</p> : null}
                      </div>
                      <div>
                        <span className={attempt.isCorrect ? "result-good" : "result-bad"}>
                          {attempt.isCorrect ? "Correct" : "Wrong"}
                        </span>
                        <p className="muted">+{attempt.xpAwarded} XP</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>
        ) : null}
      </details>
    </section>
  );
}
