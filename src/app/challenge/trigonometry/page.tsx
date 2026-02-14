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
  unit_circle_angles: "Unit Circle Angles",
  core_identities: "Core Identities",
  angle_sum_difference: "Angle Sum/Difference",
  double_half_angle: "Double/Half Angle",
  product_sum_transforms: "Product-Sum Transforms",
  inverse_trig_ranges: "Inverse Trig Ranges",
  applied_forms: "Applied Forms"
};

export default function TrigonometryChallengePage() {
  const [selectedCategories, setSelectedCategories] = useState<TrigCategory[]>([...trigCategories]);
  const [challenge, setChallenge] = useState<TrigChallengePayload | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("Loading flashcard...");
  const [latestReward, setLatestReward] = useState<AttemptResponse | null>(null);

  const categoryOptions = useMemo(() => trigCategories, []);

  async function loadNextChallenge(categories: TrigCategory[]) {
    setLoading(true);
    setRevealed(false);
    setAnswerInput("");
    setStatus("Loading flashcard...");

    const categoryQuery = encodeURIComponent(categories.join(","));
    const response = await fetch(`/api/challenge/trigonometry/next?categories=${categoryQuery}`, {
      method: "GET"
    });
    const payload = (await response.json()) as TrigChallengePayload;

    setChallenge(payload);
    setLoading(false);
    setStatus(`New ${categoryLabels[payload.category]} card ready.`);
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
    setStatus(isCorrect ? "Marked correct. Next flashcard loaded." : "Marked wrong. Next flashcard loaded.");
  }

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card challenge-shell trig-shell">
        <div className="challenge-top-row">
          <h1>Trigonometry Flashcards</h1>
          <p className="muted">EN/DE active recall</p>
        </div>

        <p className="muted">
          Type your answer first, flip the card, compare with the canonical identity/value, then self-mark.
        </p>

        <div className="category-chip-wrap" role="group" aria-label="Select trigonometry categories">
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
                  <p className="muted">{challenge.promptEn}</p>
                  <p className="muted">{challenge.promptDe}</p>
                  <div className="function-display" aria-label={`Card prompt ${challenge.promptEn}`}>
                    <BlockMath math={challenge.promptLatex} />
                  </div>
                </>
              ) : null}

              <label className="answer-field" htmlFor="trig-answer-input">
                <span>Your answer / Deine Antwort</span>
                <textarea
                  id="trig-answer-input"
                  value={answerInput}
                  onChange={(event) => setAnswerInput(event.target.value)}
                  placeholder="Type formula, identity, value, or explanation"
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
                  Flip Card
                </button>
              </div>
            </article>

            <article className="flashcard-face flashcard-back" aria-hidden={!revealed}>
              {challenge ? (
                <>
                  <h2>Compare Answers</h2>
                  <div className="answer-compare-grid">
                    <div className="answer-panel">
                      <h3>Your answer</h3>
                      <p>{answerInput}</p>
                    </div>
                    <div className="answer-panel answer-panel-solution">
                      <h3>Canonical solution</h3>
                      <p className="muted">{challenge.answerEn}</p>
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
              Marked Correct
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => void submitResult(false)}
              disabled={loading}
            >
              Marked Wrong
            </button>
          </div>
        ) : null}
      </div>

      {latestReward ? (
        <div className="card reward-card" aria-live="polite">
          <p>
            +{latestReward.xpAwarded} XP earned. Level {latestReward.newLevel}, total {latestReward.newTotalXp} XP.
          </p>
          {latestReward.newBadges.length > 0 ? (
            <p>New badges: {latestReward.newBadges.map((badge) => badge.label).join(", ")}</p>
          ) : null}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </section>
  );
}
