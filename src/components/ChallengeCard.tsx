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
          {status === "active" ? "Ready" : "Coming soon"}
        </span>
      </div>
      <p className="muted">{description}</p>
      <div className="challenge-footer">
        {status === "active" ? <span className="btn btn-primary">Start Challenge</span> : <span className="btn btn-outline">Planned</span>}
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
