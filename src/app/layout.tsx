import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "GraphQuest",
  description: "Eine kompakte Mathe-Lernapp mit interaktiven Aufgaben"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <a className="skip-link" href="#main-content">
          Direkt zum Inhalt springen
        </a>
        <header className="site-header">
          <div className="container nav-shell">
            <Link href="/" className="brand">
              GraphQuest
            </Link>
            <nav aria-label="Hauptnavigation" className="main-nav">
              <Link href="/challenge/graphing">Graphen</Link>
              <Link href="/challenge/trigonometry">Trigonometrie</Link>
              <Link href="/challenge/lgs">LGS-Trainer</Link>
              <Link href="/profile">Profil</Link>
            </nav>
          </div>
        </header>
        <main id="main-content" className="container main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
