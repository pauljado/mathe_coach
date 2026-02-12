import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "GraphQuest",
  description: "A lightweight math sketching challenge app"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <header className="site-header">
          <div className="container nav-shell">
            <Link href="/" className="brand">
              GraphQuest
            </Link>
            <nav aria-label="Main navigation" className="main-nav">
              <Link href="/challenge/graphing">Challenge</Link>
              <Link href="/profile">Profile</Link>
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
