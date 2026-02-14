import Link from "next/link";

import { ChallengeCard } from "@/components/ChallengeCard";

export default function HomePage() {
  return (
    <section className="grid" style={{ gap: "1.25rem" }}>
      <div className="card hero">
        <p className="hero-kicker">Math sketch practice</p>
        <h1>Train graph intuition one function at a time.</h1>
        <p className="muted">
          Pick a topic, sketch on paper, reveal the graph, and track your progress with XP and badges.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/challenge/graphing">
            Start Graphing Challenge
          </Link>
          <Link className="btn btn-outline" href="/challenge/trigonometry">
            Start Trigonometry Flashcards
          </Link>
          <Link className="btn btn-outline" href="/profile">
            View Profile
          </Link>
        </div>
      </div>

      <div>
        <h2>Challenges</h2>
        <div className="grid grid-3">
          <ChallengeCard
            title="Graphing Challenge"
            description="Sketch polynomial, trig, exponential, and rational functions by hand."
            href="/challenge/graphing"
            status="active"
          />
          <ChallengeCard
            title="Trigonometry Flashcards"
            description="Recall identities, exact values, and theorem forms in EN/DE flashcard mode."
            href="/challenge/trigonometry"
            status="active"
          />
          <ChallengeCard
            title="Word Problem Lab"
            description="Translate real-world prompts into mathematical models."
            status="soon"
          />
        </div>
      </div>
    </section>
  );
}
