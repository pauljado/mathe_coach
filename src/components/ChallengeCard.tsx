import Link from "next/link";

type ChallengeCardProps = {
  title: string;
  description: string;
  href?: string;
  status: "active" | "soon";
};

export function ChallengeCard({ title, description, href, status }: ChallengeCardProps) {
  const content = (
    <article className="card challenge-card" aria-label={title}>
      <div className="challenge-header">
        <h3>{title}</h3>
        <span className={`pill ${status === "active" ? "pill-active" : "pill-soon"}`}>
          {status === "active" ? "Bereit" : "Demnaechst"}
        </span>
      </div>
      <p className="muted">{description}</p>
      <div className="challenge-footer">
        {status === "active" ? <span className="btn btn-primary">Aufgabe starten</span> : <span className="btn btn-outline">Geplant</span>}
      </div>
    </article>
  );

  if (status === "active" && href) {
    return (
      <Link href={href} className="challenge-link">
        {content}
      </Link>
    );
  }

  return content;
}
