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
  const map: Record<string, string> = {
    polynomial: "Polynom",
    trigonometric: "Trigonometrisch",
    exponential: "Exponential",
    rational: "Rational",
    strategy: "Strategie",
    hardcore: "Selbst rechnen",
    unit_circle_angles: "Einheitskreis-Winkel",
    core_identities: "Grundidentitaeten",
    angle_sum_difference: "Summen- und Differenzwinkel",
    double_half_angle: "Doppel- und Halbwinkel",
    product_sum_transforms: "Produkt-Summen-Umformungen",
    inverse_trig_ranges: "Wertebereiche inverser Funktionen",
    applied_forms: "Anwendungsformen"
  };

  if (map[topic]) {
    return map[topic];
  }

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
        <h1>Profil</h1>
        <p>Fortschritt wird geladen...</p>
      </section>
    );
  }

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card profile-header">
        <h1>{summary.displayName}</h1>
        <p className="muted">Verfolge deinen Fortschritt in Graphen, Trigonometrie und LGS mit gemeinsamem XP.</p>
      </div>

      <div className="grid grid-3">
        <article className="card stat-card">
          <h2>Level {summary.gamification.level}</h2>
          <p>{summary.gamification.xp} XP insgesamt</p>
          <div className="meter" aria-label="XP-Fortschritt bis zum naechsten Level">
            <div className="meter-fill" style={{ width: `${Math.min(100, Math.max(0, xpProgress))}%` }} />
          </div>
          <p className="muted">{summary.gamification.xpToNext} XP bis zum naechsten Level</p>
        </article>

        <article className="card stat-card">
          <h2>Gesamtgenauigkeit</h2>
          <p className="stat-big">{summary.totals.accuracy}%</p>
          <p className="muted">
            {summary.totals.correct} korrekt / {summary.totals.attempts} Versuche
          </p>
        </article>

        <article className="card stat-card">
          <h2>Gesamtversuche</h2>
          <p className="stat-big">{summary.totals.attempts}</p>
          <p className="muted">Falsche Antworten: {summary.totals.wrong}</p>
        </article>
      </div>

      <div className="card badges-section">
        <h2>Abzeichen</h2>
        <BadgeGrid badges={summary.badges} />
      </div>

      <details className="card further-stats">
        <summary>Weitere Statistiken</summary>
        <div className="further-controls">
          <label>
            <span className="muted">Bereich</span>
            <select
              value={selectedChallenge}
              onChange={(event) => setSelectedChallenge(event.target.value as ChallengeType)}
              aria-label="Bereich fuer Detailstatistik waehlen"
            >
              <option value="graphing">Graphen-Aufgabe</option>
              <option value="trigonometry">Trigonometrie-Karteikarten</option>
              <option value="lgs">Gauss-Verfahren</option>
            </select>
          </label>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowAttemptStats((current) => !current)}
            aria-expanded={showAttemptStats}
          >
            {showAttemptStats ? "Detailboxen ausblenden" : "Detailboxen einblenden"}
          </button>
        </div>

        <div className="card split-summary-card">
          <h2>
            {selectedChallenge === "graphing"
              ? "Graphen"
              : selectedChallenge === "trigonometry"
                ? "Trigonometrie"
                : "Gauss-Verfahren"} Uebersicht
          </h2>
          <p className="muted">
            Genauigkeit: {selectedBreakdown.accuracy}% ({selectedBreakdown.correct} korrekt / {selectedBreakdown.attempts} Versuche)
          </p>
          <p className="muted">Falsche Antworten: {selectedBreakdown.wrong}</p>
        </div>

        {selectedChallenge === "graphing" && showAttemptStats ? (
          <div className="grid grid-2">
            <article className="card family-card">
              <h2>Versuche nach Familie</h2>
              {Object.keys(summary.attemptsByFamily).length === 0 ? (
                <p className="muted">Noch keine Versuche.</p>
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
              <h2>Letzte Graphen-Versuche</h2>
              {filteredRecentAttempts.length === 0 ? (
                <p className="muted">Starte deine erste Graphen-Aufgabe, um diese Liste zu fuellen.</p>
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
                          {attempt.isCorrect ? "Korrekt" : "Falsch"}
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
              <h2>Versuche nach Kategorie</h2>
              {Object.keys(summary.attemptsByTrigCategory).length === 0 ? (
                <p className="muted">Noch keine Versuche.</p>
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
              <h2>Letzte Trigonometrie-Versuche</h2>
              {filteredRecentAttempts.length === 0 ? (
                <p className="muted">Starte deinen ersten Kartenversuch, um diese Liste zu fuellen.</p>
              ) : (
                <ul className="plain-list attempts-list">
                  {filteredRecentAttempts.map((attempt) => (
                    <li key={attempt.id}>
                      <div>
                        <strong>{humanizeTopic(attempt.topic)}</strong>
                        <p className="muted">{attempt.prompt}</p>
                        {attempt.userAnswer ? <p className="muted">Deine Antwort: {attempt.userAnswer}</p> : null}
                      </div>
                      <div>
                        <span className={attempt.isCorrect ? "result-good" : "result-bad"}>
                          {attempt.isCorrect ? "Korrekt" : "Falsch"}
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
              <h2>Versuche nach Modus</h2>
              {Object.keys(summary.attemptsByLgsMode).length === 0 ? (
                <p className="muted">Noch keine Versuche.</p>
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
              <h2>Letzte LGS-Versuche</h2>
              {filteredRecentAttempts.length === 0 ? (
                <p className="muted">Starte deine erste LGS-Aufgabe, um diese Liste zu fuellen.</p>
              ) : (
                <ul className="plain-list attempts-list">
                  {filteredRecentAttempts.map((attempt) => (
                    <li key={attempt.id}>
                      <div>
                        <strong>{humanizeTopic(attempt.topic)}</strong>
                        <p className="muted">{attempt.prompt}</p>
                        {attempt.userAnswer ? <p className="muted">Geloeste Werte: {attempt.userAnswer}</p> : null}
                      </div>
                      <div>
                        <span className={attempt.isCorrect ? "result-good" : "result-bad"}>
                          {attempt.isCorrect ? "Korrekt" : "Falsch"}
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
