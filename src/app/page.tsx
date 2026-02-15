import Link from "next/link";

import { ChallengeCard } from "@/components/ChallengeCard";

export default function HomePage() {
  return (
    <section className="grid" style={{ gap: "1.25rem" }}>
      <div className="card hero">
        <p className="hero-kicker">Mathe-Training</p>
        <h1>Trainiere deine Intuition Schritt fuer Schritt.</h1>
        <p className="muted">
          Waehle ein Thema, loese die Aufgabe und verfolge deinen Fortschritt mit XP und Badges.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/challenge/graphing">
            Graphen starten
          </Link>
          <Link className="btn btn-outline" href="/challenge/trigonometry">
            Trigonometrie starten
          </Link>
          <Link className="btn btn-outline" href="/challenge/lgs">
            LGS-Solver starten
          </Link>
          <Link className="btn btn-outline" href="/profile">
            Profil anzeigen
          </Link>
        </div>
      </div>

      <div>
        <h2>Aufgaben</h2>
        <div className="grid grid-3">
          <ChallengeCard
            title="Graphen-Aufgabe"
            description="Skizziere Polynom-, Trigonometrie-, Exponential- und rationale Funktionen."
            href="/challenge/graphing"
            status="active"
          />
          <ChallengeCard
            title="Trigonometrie-Karteikarten"
            description="Wiederhole Identitaeten, exakte Werte und Theoreme im Karteikartenmodus."
            href="/challenge/trigonometry"
            status="active"
          />
          <ChallengeCard
            title="Interaktiver LGS-Solver"
            description="Nutze Zeilenoperationen, jage Nullen und loese per Rueckwaertseinsetzen."
            href="/challenge/lgs"
            status="active"
          />
        </div>
      </div>
    </section>
  );
}
