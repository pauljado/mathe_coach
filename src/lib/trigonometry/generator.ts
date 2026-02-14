import { randomUUID } from "node:crypto";

import { getTrigDeckByCategories } from "@/lib/trigonometry/deck";
import { trigCategories, type TrigCategory, type TrigChallengePayload } from "@/types/trigonometry";

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

export function normalizeTrigCategories(rawCategories: string[]): TrigCategory[] {
  const categorySet = new Set(trigCategories);
  const cleaned = rawCategories
    .map((item) => item.trim())
    .filter((item): item is TrigCategory => categorySet.has(item as TrigCategory));

  return Array.from(new Set(cleaned));
}

export function createTrigonometryChallenge(requestedCategories: TrigCategory[]): TrigChallengePayload {
  const deck = getTrigDeckByCategories(requestedCategories);
  const fallbackDeck = deck.length > 0 ? deck : getTrigDeckByCategories([]);
  const chosen = fallbackDeck[randomInt(fallbackDeck.length)];

  return {
    challengeId: randomUUID(),
    cardId: chosen.id,
    category: chosen.category,
    promptLatex: chosen.promptLatex,
    answerLatex: chosen.answerLatex,
    promptEn: chosen.promptEn,
    promptDe: chosen.promptDe,
    answerEn: chosen.answerEn,
    answerDe: chosen.answerDe
  };
}
