type Badge = {
  code: string;
  label: string;
  description: string;
  unlockedAt: string;
};

type BadgeGridProps = {
  badges: Badge[];
};

function BadgeIcon({ code }: { code: string }) {
  if (code === "FIRST_TRY") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="currentColor" />
        <path d="M8 12.5l2.4 2.4L16.5 9" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (code === "TEN_ATTEMPTS") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="7" width="16" height="12" rx="2" fill="currentColor" />
        <path d="M8 4h8v4H8z" fill="#fff" />
      </svg>
    );
  }

  if (code === "ACCURACY_70") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l8 3v6c0 5.2-3.3 8.1-8 9-4.7-.9-8-3.8-8-9V6l8-3z" fill="currentColor" />
        <path d="M8.5 12.5l2.1 2.2 4.8-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l3 6 6 .9-4.3 4.2 1 6-5.7-3-5.7 3 1-6L3 8.9 9 8z" fill="currentColor" />
    </svg>
  );
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  if (badges.length === 0) {
    return <p className="muted">Noch keine Badges freigeschaltet. Loese Aufgaben fuer dein erstes Badge.</p>;
  }

  return (
    <div className="grid grid-3">
      {badges.map((badge) => (
        <article key={badge.code} className={`card badge-card badge-${badge.code.toLowerCase()}`}>
          <div className="badge-title">
            <span className="badge-icon" aria-hidden="true">
              <BadgeIcon code={badge.code} />
            </span>
            <h3>{badge.label}</h3>
          </div>
          <p>{badge.description}</p>
          <p className="badge-meta">Freigeschaltet am {new Date(badge.unlockedAt).toLocaleDateString()}</p>
        </article>
      ))}
    </div>
  );
}
