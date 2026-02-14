export const trigCategories = [
  "unit_circle_angles",
  "core_identities",
  "angle_sum_difference",
  "double_half_angle",
  "product_sum_transforms",
  "inverse_trig_ranges",
  "applied_forms"
] as const;

export type TrigCategory = (typeof trigCategories)[number];

export type TrigDifficulty = "core" | "advanced";

export type TrigCard = {
  id: string;
  category: TrigCategory;
  difficulty: TrigDifficulty;
  promptLatex: string;
  answerLatex: string;
  promptEn: string;
  promptDe: string;
  answerEn: string;
  answerDe: string;
  aliases: string[];
};

export type TrigChallengePayload = {
  challengeId: string;
  cardId: string;
  category: TrigCategory;
  promptLatex: string;
  answerLatex: string;
  promptEn: string;
  promptDe: string;
  answerEn: string;
  answerDe: string;
};
