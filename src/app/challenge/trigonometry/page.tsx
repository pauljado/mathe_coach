"use client";

import { useEffect, useMemo, useState } from "react";
import { BlockMath } from "react-katex";

import {
  trigCategories,
  type TrigCategory,
  type TrigChallengePayload
} from "@/types/trigonometry";

type AttemptResponse = {
  xpAwarded: number;
  newTotalXp: number;
  newLevel: number;
  newBadges: Array<{ code: string; label: string; description: string }>;
};

const categoryLabels: Record<TrigCategory, string> = {
  unit_circle_angles: "Einheitskreis-Winkel",
  core_identities: "Grundidentitaeten",
  angle_sum_difference: "Summen- und Differenzwinkel",
  double_half_angle: "Doppel- und Halbwinkel",
  product_sum_transforms: "Produkt-Summen-Umformungen",
  inverse_trig_ranges: "Wertebereiche inverser Funktionen",
  applied_forms: "Anwendungsformen"
};

export default function TrigonometryChallengePage() {
  const [selectedCategories, setSelectedCategories] = useState<TrigCategory[]>([...trigCategories]);
  const [challenge, setChallenge] = useState<TrigChallengePayload | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("Lade Karte...");
  const [latestReward, setLatestReward] = useState<AttemptResponse | null>(null);

  const categoryOptions = useMemo(() => trigCategories, []);

  async function loadNextChallenge(categories: TrigCategory[]) {
    setLoading(true);
    setRevealed(false);
    setAnswerInput("");
    setStatus("Lade Karte...");

    const categoryQuery = encodeURIComponent(categories.join(","));
    const response = await fetch(`/api/challenge/trigonometry/next?categories=${categoryQuery}`, {
      method: "GET"
    });
    const payload = (await response.json()) as TrigChallengePayload;

    setChallenge(payload);
    setLoading(false);
    setStatus(`Neue Karte aus ${categoryLabels[payload.category]} bereit.`);
  }

  useEffect(() => {
    void loadNextChallenge(selectedCategories);
  }, [selectedCategories]);

  function toggleCategory(category: TrigCategory) {
    setSelectedCategories((current) => {
      if (current.includes(category)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter((item) => item !== category);
      }

      const next = [...current, category];
      return categoryOptions.filter((item) => next.includes(item));
    });
  }

  async function submitResult(isCorrect: boolean) {
    if (!challenge || !answerInput.trim()) {
      return;
    }

    setLoading(true);

    const response = await fetch("/api/challenge/trigonometry/attempt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        challengeId: challenge.challengeId,
        cardId: challenge.cardId,
        userAnswer: answerInput,
        isCorrect
      })
    });

    const result = (await response.json()) as AttemptResponse;
    setLatestReward(result);

    await loadNextChallenge(selectedCategories);
    setStatus(isCorrect ? "Als korrekt markiert. Naechste Karte geladen." : "Als falsch markiert. Naechste Karte geladen.");
  }

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card challenge-shell trig-shell">
        <div className="challenge-top-row">
          <h1>Trigonometrie-Karteikarten</h1>
          <p className="muted">Aktives Erinnern</p>
        </div>

        <p className="muted">
          Gib zuerst deine Antwort ein, decke dann um und vergleiche mit der Musterloesung.
        </p>

        <div className="category-chip-wrap" role="group" aria-label="Trigonometrie-Kategorien waehlen">
          {categoryOptions.map((category) => {
            const selected = selectedCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                className={`category-chip ${selected ? "category-chip-active" : ""}`}
                onClick={() => toggleCategory(category)}
                aria-pressed={selected}
                disabled={loading && !challenge}
              >
                {categoryLabels[category]}
              </button>
            );
          })}
        </div>

        <div className={`flashcard-stage ${revealed ? "flashcard-stage-flipped" : ""}`}>
          <div className="flashcard-inner">
            <article className="flashcard-face flashcard-front" aria-hidden={revealed}>
              {challenge ? (
                <>
                  <h2>{categoryLabels[challenge.category]}</h2>
                  <p className="muted">{challenge.promptDe}</p>
                  <div className="function-display" aria-label={`Kartentext ${challenge.promptDe}`}>
                    <BlockMath math={challenge.promptLatex} />
                  </div>
                </>
              ) : null}

              <label className="answer-field" htmlFor="trig-answer-input">
                <span>Deine Antwort</span>
                <textarea
                  id="trig-answer-input"
                  value={answerInput}
                  onChange={(event) => setAnswerInput(event.target.value)}
                  placeholder="Formel, Identitaet, Wert oder kurze Erklaerung eingeben"
                  rows={4}
                  disabled={loading || revealed}
                />
              </label>

              <div className="actions-row">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setRevealed(true)}
                  disabled={loading || !challenge || !answerInput.trim() || revealed}
                >
                  Karte umdrehen
                </button>
              </div>
            </article>

            <article className="flashcard-face flashcard-back" aria-hidden={!revealed}>
              {challenge ? (
                <>
                  <h2>Antwort vergleichen</h2>
                  <div className="answer-compare-grid">
                    <div className="answer-panel">
                      <h3>Deine Antwort</h3>
                      <p>{answerInput}</p>
                    </div>
                    <div className="answer-panel answer-panel-solution">
                      <h3>Musterloesung</h3>
                      <p className="muted">{challenge.answerDe}</p>
                      <div className="function-display">
                        <BlockMath math={challenge.answerLatex} />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </article>
          </div>
        </div>

        {revealed ? (
          <div className="actions-row">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => void submitResult(true)}
              disabled={loading}
            >
              Korrekt
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => void submitResult(false)}
              disabled={loading}
            >
              Falsch
            </button>
          </div>
        ) : null}
      </div>

      {latestReward ? (
        <div className="card reward-card" aria-live="polite">
          <p>
            +{latestReward.xpAwarded} XP erhalten. Level {latestReward.newLevel}, insgesamt {latestReward.newTotalXp} XP.
          </p>
          {latestReward.newBadges.length > 0 ? (
            <p>Neue Badges: {latestReward.newBadges.map((badge) => badge.label).join(", ")}</p>
          ) : null}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </section>
  );
}
