import type { ConcreteFamily } from "@/types/challenge";
import type { LgsMode } from "@/types/lgs";
import type { TrigCategory } from "@/types/trigonometry";

export type BadgeCode =
  | "FIRST_TRY"
  | "TEN_ATTEMPTS"
  | "ACCURACY_70"
  | "FAMILY_EXPLORER"
  | "TRIG_FIRST_TRY"
  | "TRIG_TEN_ATTEMPTS"
  | "TRIG_ACCURACY_75"
  | "TRIG_CATEGORY_EXPLORER"
  | "LGS_FIRST_TRY"
  | "LGS_TEN_ATTEMPTS"
  | "LGS_ACCURACY_75"
  | "LGS_MODE_EXPLORER";

export const BADGE_DETAILS: Record<BadgeCode, { label: string; description: string }> = {
  FIRST_TRY: {
    label: "Erster Versuch",
    description: "Schliesse deine erste Graphen-Aufgabe ab."
  },
  TEN_ATTEMPTS: {
    label: "Zehn Versuche",
    description: "Absolviere 10 Graphen-Versuche."
  },
  ACCURACY_70: {
    label: "Stabile Genauigkeit",
    description: "Erreiche mindestens 70% Genauigkeit nach 20 Versuchen."
  },
  FAMILY_EXPLORER: {
    label: "Familien-Explorer",
    description: "Teste mindestens einen Graphen in jeder Funktionsfamilie."
  },
  TRIG_FIRST_TRY: {
    label: "Trig-Erstversuch",
    description: "Schliesse deine erste Trigonometrie-Karte ab."
  },
  TRIG_TEN_ATTEMPTS: {
    label: "Trig-Zehn",
    description: "Absolviere 10 Trigonometrie-Karten."
  },
  TRIG_ACCURACY_75: {
    label: "Trig-Genauigkeit",
    description: "Erreiche mindestens 75% Trigonometrie-Genauigkeit nach 20 Versuchen."
  },
  TRIG_CATEGORY_EXPLORER: {
    label: "Trig-Kategorien-Explorer",
    description: "Teste mindestens eine Karte in jeder Trigonometrie-Kategorie."
  },
  LGS_FIRST_TRY: {
    label: "Nullenjaeger",
    description: "Schliesse deine erste Gauß-Aufgabe ab."
  },
  LGS_TEN_ATTEMPTS: {
    label: "Zeilenoperator",
    description: "Absolviere 10 Gauß-Aufgaben."
  },
  LGS_ACCURACY_75: {
    label: "Stufenform-Profi",
    description: "Erreiche mindestens 75% LGS-Genauigkeit nach 20 Versuchen."
  },
  LGS_MODE_EXPLORER: {
    label: "Modus-Explorer",
    description: "Schliesse mindestens je eine LGS-Aufgabe in Strategie und Selbst-rechnen ab."
  }
};

export function xpForAttempt(isCorrect: boolean): number {
  return isCorrect ? 10 : 4;
}

export function levelFromXp(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 25)) + 1;
}

export function xpToNextLevel(totalXp: number): number {
  const level = levelFromXp(totalXp);
  const nextThreshold = Math.pow(level, 2) * 25;
  return Math.max(0, nextThreshold - totalXp);
}

export function badgesForStats(input: {
  attempts: number;
  correct: number;
  familiesAttempted: ConcreteFamily[];
}): BadgeCode[] {
  const badges: BadgeCode[] = [];
  const { attempts, correct, familiesAttempted } = input;

  if (attempts >= 1) badges.push("FIRST_TRY");
  if (attempts >= 10) badges.push("TEN_ATTEMPTS");

  if (attempts >= 20) {
    const accuracy = attempts === 0 ? 0 : (correct / attempts) * 100;
    if (accuracy >= 70) {
      badges.push("ACCURACY_70");
    }
  }

  const set = new Set(familiesAttempted);
  if (
    set.has("polynomial") &&
    set.has("trigonometric") &&
    set.has("exponential") &&
    set.has("rational")
  ) {
    badges.push("FAMILY_EXPLORER");
  }

  return badges;
}

export function trigBadgesForStats(input: {
  attempts: number;
  correct: number;
  categoriesAttempted: TrigCategory[];
}): BadgeCode[] {
  const badges: BadgeCode[] = [];
  const { attempts, correct, categoriesAttempted } = input;

  if (attempts >= 1) badges.push("TRIG_FIRST_TRY");
  if (attempts >= 10) badges.push("TRIG_TEN_ATTEMPTS");

  if (attempts >= 20) {
    const accuracy = attempts === 0 ? 0 : (correct / attempts) * 100;
    if (accuracy >= 75) {
      badges.push("TRIG_ACCURACY_75");
    }
  }

  const set = new Set(categoriesAttempted);
  if (
    set.has("unit_circle_angles") &&
    set.has("core_identities") &&
    set.has("angle_sum_difference") &&
    set.has("double_half_angle") &&
    set.has("product_sum_transforms") &&
    set.has("inverse_trig_ranges") &&
    set.has("applied_forms")
  ) {
    badges.push("TRIG_CATEGORY_EXPLORER");
  }

  return badges;
}

export function lgsBadgesForStats(input: {
  attempts: number;
  correct: number;
  modesAttempted: LgsMode[];
}): BadgeCode[] {
  const badges: BadgeCode[] = [];
  const { attempts, correct, modesAttempted } = input;

  if (attempts >= 1) badges.push("LGS_FIRST_TRY");
  if (attempts >= 10) badges.push("LGS_TEN_ATTEMPTS");

  if (attempts >= 20) {
    const accuracy = attempts === 0 ? 0 : (correct / attempts) * 100;
    if (accuracy >= 75) {
      badges.push("LGS_ACCURACY_75");
    }
  }

  const set = new Set(modesAttempted);
  if (set.has("strategy") && set.has("hardcore")) {
    badges.push("LGS_MODE_EXPLORER");
  }

  return badges;
}

export function allBadgesForStats(input: {
  graphing: {
    attempts: number;
    correct: number;
    familiesAttempted: ConcreteFamily[];
  };
  trigonometry: {
    attempts: number;
    correct: number;
    categoriesAttempted: TrigCategory[];
  };
  lgs: {
    attempts: number;
    correct: number;
    modesAttempted: LgsMode[];
  };
}): BadgeCode[] {
  return [
    ...badgesForStats(input.graphing),
    ...trigBadgesForStats(input.trigonometry),
    ...lgsBadgesForStats(input.lgs)
  ];
}
