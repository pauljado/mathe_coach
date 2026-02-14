# GraphQuest Math Teaching App

Lightweight Next.js + Prisma app for graph sketching practice and trigonometry recall.

## Features

- Accessible landing page with challenge selection.
- Graphing challenge with random function families:
  - Polynomial
  - Trigonometric
  - Exponential
  - Rational
- Trigonometry flashcard challenge with bilingual EN/DE prompts for:
  - unit-circle values
  - identities and angle theorems
  - inverse trig ranges
  - applied sinusoid forms
- Paper-sketch workflow:
  1. Read prompt
  2. Sketch on paper
  3. Reveal graph
  4. Self-assess correct/wrong
  5. Auto-load next function
- Profile progress with:
  - XP and level progression
  - Accuracy and attempt totals
  - Family breakdown
  - Badge unlocks

## Setup

1. Install Node.js 20+.
2. Install deps:

```bash
npm install
```

3. Create env file:

```bash
cp .env.example .env
```

4. Create SQLite DB and Prisma client:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

5. Start app:

```bash
npm run dev
```

## API Endpoints

- `GET /api/challenge/next?family=all|polynomial|trigonometric|exponential|rational`
- `POST /api/challenge/attempt`
- `GET /api/challenge/trigonometry/next?categories=<csv>`
- `POST /api/challenge/trigonometry/attempt`
- `GET /api/profile/summary`

## Testing

```bash
npm run test
```
