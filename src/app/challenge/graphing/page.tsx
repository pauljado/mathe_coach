"use client";

import { useEffect, useMemo, useState } from "react";
import { BlockMath } from "react-katex";

import { GraphCanvas } from "@/components/GraphCanvas";
import { functionFamilies, type ChallengePayload, type FunctionFamily } from "@/types/challenge";

type AttemptResponse = {
  xpAwarded: number;
  newTotalXp: number;
  newLevel: number;
  newBadges: Array<{ code: string; label: string; description: string }>;
};

const familyLabels: Record<FunctionFamily, string> = {
  all: "All families",
  polynomial: "Polynomial",
  trigonometric: "Trigonometric",
  exponential: "Exponential",
  rational: "Rational"
};

export default function GraphingChallengePage() {
  const [family, setFamily] = useState<FunctionFamily>("all");
  const [challenge, setChallenge] = useState<ChallengePayload | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("Loading challenge...");
  const [latestReward, setLatestReward] = useState<AttemptResponse | null>(null);

  const familyOptions = useMemo(() => functionFamilies, []);

  async function loadNextChallenge(chosenFamily: FunctionFamily) {
    setLoading(true);
    setRevealed(false);
    setStatus("Loading challenge...");

    const response = await fetch(`/api/challenge/next?family=${chosenFamily}`, {
      method: "GET"
    });
    const payload = (await response.json()) as ChallengePayload;

    setChallenge(payload);
    setLoading(false);
    setStatus(`New ${payload.family} challenge ready. Sketch on paper first.`);
  }

  useEffect(() => {
    void loadNextChallenge(family);
  }, [family]);

  async function submitResult(isCorrect: boolean) {
    if (!challenge) {
      return;
    }

    setLoading(true);
    const response = await fetch("/api/challenge/attempt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        challengeId: challenge.challengeId,
        family: challenge.family,
        displayText: challenge.displayText,
        isCorrect
      })
    });

    const result = (await response.json()) as AttemptResponse;
    setLatestReward(result);

    await loadNextChallenge(family);
    setStatus(isCorrect ? "Marked correct. Next challenge loaded." : "Marked wrong. Next challenge loaded.");
  }

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card challenge-shell">
        <div className="challenge-top-row">
          <h1>Graphing Challenge</h1>
          <label>
            <span className="muted">Function family</span>
            <br />
            <select
              value={family}
              onChange={(event) => setFamily(event.target.value as FunctionFamily)}
              aria-label="Select function family"
            >
              {familyOptions.map((item) => (
                <option key={item} value={item}>
                  {familyLabels[item]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="muted">
          Prompt: sketch the function on paper before revealing the graph.
        </p>

        {challenge ? (
          <div className="function-display" aria-label={`Current function ${challenge.displayText}`}>
            <BlockMath math={challenge.promptLatex} />
          </div>
        ) : null}

        <div className="actions-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setRevealed(true)}
            disabled={loading || !challenge || revealed}
          >
            I completed my sketch
          </button>
        </div>

        {revealed && challenge ? (
          <>
            <GraphCanvas points={challenge.graphPoints} xRange={challenge.xRange} yRange={challenge.yRange} />
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
          </>
        ) : null}
      </div>

      {latestReward ? (
        <div className="card reward-card" aria-live="polite">
          <p>
            +{latestReward.xpAwarded} XP earned. Level {latestReward.newLevel}, total {latestReward.newTotalXp} XP.
          </p>
          {latestReward.newBadges.length > 0 ? (
            <p>
              New badges: {latestReward.newBadges.map((badge) => badge.label).join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </section>
  );
}
