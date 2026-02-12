"use client";

import { useEffect, useMemo, useState } from "react";

import { BadgeGrid } from "@/components/BadgeGrid";

type ProfileSummary = {
  displayName: string;
  totals: {
    attempts: number;
    correct: number;
    wrong: number;
    accuracy: number;
  };
  gamification: {
    xp: number;
    level: number;
    xpToNext: number;
  };
  badges: Array<{ code: string; label: string; description: string; unlockedAt: string }>;
  attemptsByFamily: Record<string, number>;
  recentAttempts: Array<{
    id: number;
    family: string;
    functionText: string;
    isCorrect: boolean;
    xpAwarded: number;
    createdAt: string;
  }>;
};

export default function ProfilePage() {
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState("graphing");
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
        <p className="muted">Track your graph sketching progress and achievements.</p>
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
          <h2>Accuracy</h2>
          <p className="stat-big">{summary.totals.accuracy}%</p>
          <p className="muted">
            {summary.totals.correct} correct / {summary.totals.attempts} attempts
          </p>
        </article>

        <article className="card stat-card">
          <h2>Attempts</h2>
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
              onChange={(event) => setSelectedChallenge(event.target.value)}
              aria-label="Select challenge for detailed stats"
            >
              <option value="graphing">Graphing challenge</option>
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
                      <span>{family}</span>
                      <strong>{count}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="card family-card">
              <h2>Recent Attempts</h2>
              {summary.recentAttempts.length === 0 ? (
                <p className="muted">Start your first challenge to populate this feed.</p>
              ) : (
                <ul className="plain-list attempts-list">
                  {summary.recentAttempts.map((attempt) => (
                    <li key={attempt.id}>
                      <div>
                        <strong>{attempt.family}</strong>
                        <p className="muted">{attempt.functionText}</p>
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
