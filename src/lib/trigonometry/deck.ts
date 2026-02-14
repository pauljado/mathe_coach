import type { TrigCard, TrigCategory } from "@/types/trigonometry";

type CategorySeed = Omit<TrigCard, "id" | "category">;

function createCategoryCards(category: TrigCategory, seeds: CategorySeed[]): TrigCard[] {
  return seeds.map((seed, index) => ({
    ...seed,
    id: `${category}_${String(index + 1).padStart(2, "0")}`,
    category
  }));
}

const unitCircleAngles = createCategoryCards("unit_circle_angles", [
  {
    difficulty: "core",
    promptLatex: "\\sin(0) = ?",
    answerLatex: "\\sin(0) = 0",
    promptEn: "Recall sin at 0° (0 rad).",
    promptDe: "Merke dir sin bei 0° (0 rad).",
    answerEn: "sin(0°) = sin(0) = 0",
    answerDe: "sin(0°) = sin(0) = 0",
    aliases: ["sin 0"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos(0) = ?",
    answerLatex: "\\cos(0) = 1",
    promptEn: "Recall cos at 0° (0 rad).",
    promptDe: "Merke dir cos bei 0° (0 rad).",
    answerEn: "cos(0°) = cos(0) = 1",
    answerDe: "cos(0°) = cos(0) = 1",
    aliases: ["cos 0"]
  },
  {
    difficulty: "core",
    promptLatex: "\\tan(0) = ?",
    answerLatex: "\\tan(0) = 0",
    promptEn: "Recall tan at 0° (0 rad).",
    promptDe: "Merke dir tan bei 0° (0 rad).",
    answerEn: "tan(0°) = tan(0) = 0",
    answerDe: "tan(0°) = tan(0) = 0",
    aliases: ["tan 0"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin\\left(\\frac{\\pi}{6}\\right) = ?",
    answerLatex: "\\sin\\left(\\frac{\\pi}{6}\\right) = \\frac{1}{2}",
    promptEn: "Recall sin at 30° (pi/6).",
    promptDe: "Merke dir sin bei 30° (pi/6).",
    answerEn: "sin(30°) = sin(pi/6) = 1/2",
    answerDe: "sin(30°) = sin(pi/6) = 1/2",
    aliases: ["sin 30", "sin pi/6"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos\\left(\\frac{\\pi}{6}\\right) = ?",
    answerLatex: "\\cos\\left(\\frac{\\pi}{6}\\right) = \\frac{\\sqrt{3}}{2}",
    promptEn: "Recall cos at 30° (pi/6).",
    promptDe: "Merke dir cos bei 30° (pi/6).",
    answerEn: "cos(30°) = cos(pi/6) = sqrt(3)/2",
    answerDe: "cos(30°) = cos(pi/6) = sqrt(3)/2",
    aliases: ["cos 30", "cos pi/6"]
  },
  {
    difficulty: "core",
    promptLatex: "\\tan\\left(\\frac{\\pi}{6}\\right) = ?",
    answerLatex: "\\tan\\left(\\frac{\\pi}{6}\\right) = \\frac{1}{\\sqrt{3}}",
    promptEn: "Recall tan at 30° (pi/6).",
    promptDe: "Merke dir tan bei 30° (pi/6).",
    answerEn: "tan(30°) = tan(pi/6) = 1/sqrt(3)",
    answerDe: "tan(30°) = tan(pi/6) = 1/sqrt(3)",
    aliases: ["tan 30", "tan pi/6"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin\\left(\\frac{\\pi}{4}\\right) = ?",
    answerLatex: "\\sin\\left(\\frac{\\pi}{4}\\right) = \\frac{\\sqrt{2}}{2}",
    promptEn: "Recall sin at 45° (pi/4).",
    promptDe: "Merke dir sin bei 45° (pi/4).",
    answerEn: "sin(45°) = sin(pi/4) = sqrt(2)/2",
    answerDe: "sin(45°) = sin(pi/4) = sqrt(2)/2",
    aliases: ["sin 45", "sin pi/4"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos\\left(\\frac{\\pi}{4}\\right) = ?",
    answerLatex: "\\cos\\left(\\frac{\\pi}{4}\\right) = \\frac{\\sqrt{2}}{2}",
    promptEn: "Recall cos at 45° (pi/4).",
    promptDe: "Merke dir cos bei 45° (pi/4).",
    answerEn: "cos(45°) = cos(pi/4) = sqrt(2)/2",
    answerDe: "cos(45°) = cos(pi/4) = sqrt(2)/2",
    aliases: ["cos 45", "cos pi/4"]
  },
  {
    difficulty: "core",
    promptLatex: "\\tan\\left(\\frac{\\pi}{4}\\right) = ?",
    answerLatex: "\\tan\\left(\\frac{\\pi}{4}\\right) = 1",
    promptEn: "Recall tan at 45° (pi/4).",
    promptDe: "Merke dir tan bei 45° (pi/4).",
    answerEn: "tan(45°) = tan(pi/4) = 1",
    answerDe: "tan(45°) = tan(pi/4) = 1",
    aliases: ["tan 45", "tan pi/4"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin\\left(\\frac{\\pi}{3}\\right) = ?",
    answerLatex: "\\sin\\left(\\frac{\\pi}{3}\\right) = \\frac{\\sqrt{3}}{2}",
    promptEn: "Recall sin at 60° (pi/3).",
    promptDe: "Merke dir sin bei 60° (pi/3).",
    answerEn: "sin(60°) = sin(pi/3) = sqrt(3)/2",
    answerDe: "sin(60°) = sin(pi/3) = sqrt(3)/2",
    aliases: ["sin 60", "sin pi/3"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos\\left(\\frac{\\pi}{3}\\right) = ?",
    answerLatex: "\\cos\\left(\\frac{\\pi}{3}\\right) = \\frac{1}{2}",
    promptEn: "Recall cos at 60° (pi/3).",
    promptDe: "Merke dir cos bei 60° (pi/3).",
    answerEn: "cos(60°) = cos(pi/3) = 1/2",
    answerDe: "cos(60°) = cos(pi/3) = 1/2",
    aliases: ["cos 60", "cos pi/3"]
  },
  {
    difficulty: "core",
    promptLatex: "\\tan\\left(\\frac{\\pi}{3}\\right) = ?",
    answerLatex: "\\tan\\left(\\frac{\\pi}{3}\\right) = \\sqrt{3}",
    promptEn: "Recall tan at 60° (pi/3).",
    promptDe: "Merke dir tan bei 60° (pi/3).",
    answerEn: "tan(60°) = tan(pi/3) = sqrt(3)",
    answerDe: "tan(60°) = tan(pi/3) = sqrt(3)",
    aliases: ["tan 60", "tan pi/3"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin\\left(\\frac{\\pi}{2}\\right) = ?",
    answerLatex: "\\sin\\left(\\frac{\\pi}{2}\\right) = 1",
    promptEn: "Recall sin at 90° (pi/2).",
    promptDe: "Merke dir sin bei 90° (pi/2).",
    answerEn: "sin(90°) = sin(pi/2) = 1",
    answerDe: "sin(90°) = sin(pi/2) = 1",
    aliases: ["sin 90", "sin pi/2"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos\\left(\\frac{\\pi}{2}\\right) = ?",
    answerLatex: "\\cos\\left(\\frac{\\pi}{2}\\right) = 0",
    promptEn: "Recall cos at 90° (pi/2).",
    promptDe: "Merke dir cos bei 90° (pi/2).",
    answerEn: "cos(90°) = cos(pi/2) = 0",
    answerDe: "cos(90°) = cos(pi/2) = 0",
    aliases: ["cos 90", "cos pi/2"]
  },
  {
    difficulty: "core",
    promptLatex: "(QII)\\;\\sin x,\\cos x,\\tan x:\\; ?",
    answerLatex: "\\sin x > 0,\\;\\cos x < 0,\\;\\tan x < 0",
    promptEn: "Give the signs of sin, cos, tan in quadrant II.",
    promptDe: "Gib die Vorzeichen von sin, cos, tan im 2. Quadranten an.",
    answerEn: "Quadrant II: sin positive, cos negative, tan negative.",
    answerDe: "2. Quadrant: sin positiv, cos negativ, tan negativ.",
    aliases: ["ASTC", "quadrant signs"]
  },
  {
    difficulty: "core",
    promptLatex: "(QIII)\\;\\sin x,\\cos x,\\tan x:\\; ?",
    answerLatex: "\\sin x < 0,\\;\\cos x < 0,\\;\\tan x > 0",
    promptEn: "Give the signs of sin, cos, tan in quadrant III.",
    promptDe: "Gib die Vorzeichen von sin, cos, tan im 3. Quadranten an.",
    answerEn: "Quadrant III: sin negative, cos negative, tan positive.",
    answerDe: "3. Quadrant: sin negativ, cos negativ, tan positiv.",
    aliases: ["ASTC", "quadrant signs"]
  },
  {
    difficulty: "core",
    promptLatex: "(QIV)\\;\\sin x,\\cos x,\\tan x:\\; ?",
    answerLatex: "\\sin x < 0,\\;\\cos x > 0,\\;\\tan x < 0",
    promptEn: "Give the signs of sin, cos, tan in quadrant IV.",
    promptDe: "Gib die Vorzeichen von sin, cos, tan im 4. Quadranten an.",
    answerEn: "Quadrant IV: sin negative, cos positive, tan negative.",
    answerDe: "4. Quadrant: sin negativ, cos positiv, tan negativ.",
    aliases: ["ASTC", "quadrant signs"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin(x + 2\\pi) = ?",
    answerLatex: "\\sin(x + 2\\pi) = \\sin x",
    promptEn: "State the 2pi periodicity identity for sin.",
    promptDe: "Gib die 2pi-Periodizitaet von sin an.",
    answerEn: "sin(x + 2pi) = sin(x)",
    answerDe: "sin(x + 2pi) = sin(x)",
    aliases: ["sin period"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos(x + 2\\pi) = ?",
    answerLatex: "\\cos(x + 2\\pi) = \\cos x",
    promptEn: "State the 2pi periodicity identity for cos.",
    promptDe: "Gib die 2pi-Periodizitaet von cos an.",
    answerEn: "cos(x + 2pi) = cos(x)",
    answerDe: "cos(x + 2pi) = cos(x)",
    aliases: ["cos period"]
  },
  {
    difficulty: "core",
    promptLatex: "\\tan(x + \\pi) = ?",
    answerLatex: "\\tan(x + \\pi) = \\tan x",
    promptEn: "State the pi periodicity identity for tan.",
    promptDe: "Gib die pi-Periodizitaet von tan an.",
    answerEn: "tan(x + pi) = tan(x)",
    answerDe: "tan(x + pi) = tan(x)",
    aliases: ["tan period"]
  }
]);

const coreIdentities = createCategoryCards("core_identities", [
  {
    difficulty: "core",
    promptLatex: "\\sin^2 x + \\cos^2 x = ?",
    answerLatex: "\\sin^2 x + \\cos^2 x = 1",
    promptEn: "State the fundamental Pythagorean identity.",
    promptDe: "Nenne die grundlegende pythagoreische Identitaet.",
    answerEn: "sin^2(x) + cos^2(x) = 1",
    answerDe: "sin^2(x) + cos^2(x) = 1",
    aliases: ["Pythagorean identity"]
  },
  {
    difficulty: "core",
    promptLatex: "1 + \\tan^2 x = ?",
    answerLatex: "1 + \\tan^2 x = \\sec^2 x",
    promptEn: "State the identity involving tan and sec.",
    promptDe: "Nenne die Identitaet mit tan und sec.",
    answerEn: "1 + tan^2(x) = sec^2(x)",
    answerDe: "1 + tan^2(x) = sec^2(x)",
    aliases: ["tan sec identity"]
  },
  {
    difficulty: "core",
    promptLatex: "1 + \\cot^2 x = ?",
    answerLatex: "1 + \\cot^2 x = \\csc^2 x",
    promptEn: "State the identity involving cot and csc.",
    promptDe: "Nenne die Identitaet mit cot und csc.",
    answerEn: "1 + cot^2(x) = csc^2(x)",
    answerDe: "1 + cot^2(x) = csc^2(x)",
    aliases: ["cot csc identity"]
  },
  {
    difficulty: "core",
    promptLatex: "\\tan x = ?",
    answerLatex: "\\tan x = \\frac{\\sin x}{\\cos x}",
    promptEn: "Express tan with sin and cos.",
    promptDe: "Schreibe tan mit sin und cos.",
    answerEn: "tan(x) = sin(x)/cos(x)",
    answerDe: "tan(x) = sin(x)/cos(x)",
    aliases: ["quotient identity"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cot x = ?",
    answerLatex: "\\cot x = \\frac{\\cos x}{\\sin x}",
    promptEn: "Express cot with cos and sin.",
    promptDe: "Schreibe cot mit cos und sin.",
    answerEn: "cot(x) = cos(x)/sin(x)",
    answerDe: "cot(x) = cos(x)/sin(x)",
    aliases: ["quotient identity"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sec x = ?",
    answerLatex: "\\sec x = \\frac{1}{\\cos x}",
    promptEn: "Express sec as reciprocal.",
    promptDe: "Schreibe sec als Kehrwert.",
    answerEn: "sec(x) = 1/cos(x)",
    answerDe: "sec(x) = 1/cos(x)",
    aliases: ["reciprocal identity"]
  },
  {
    difficulty: "core",
    promptLatex: "\\csc x = ?",
    answerLatex: "\\csc x = \\frac{1}{\\sin x}",
    promptEn: "Express csc as reciprocal.",
    promptDe: "Schreibe csc als Kehrwert.",
    answerEn: "csc(x) = 1/sin(x)",
    answerDe: "csc(x) = 1/sin(x)",
    aliases: ["reciprocal identity"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cot x = ?\\;\\text{(using tan)}",
    answerLatex: "\\cot x = \\frac{1}{\\tan x}",
    promptEn: "Express cot with tan.",
    promptDe: "Schreibe cot mit tan.",
    answerEn: "cot(x) = 1/tan(x)",
    answerDe: "cot(x) = 1/tan(x)",
    aliases: ["cot reciprocal"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin(-x) = ?",
    answerLatex: "\\sin(-x) = -\\sin x",
    promptEn: "State the odd/even identity for sin.",
    promptDe: "Nenne die Symmetrieidentitaet fuer sin.",
    answerEn: "sin(-x) = -sin(x)",
    answerDe: "sin(-x) = -sin(x)",
    aliases: ["odd sin"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos(-x) = ?",
    answerLatex: "\\cos(-x) = \\cos x",
    promptEn: "State the odd/even identity for cos.",
    promptDe: "Nenne die Symmetrieidentitaet fuer cos.",
    answerEn: "cos(-x) = cos(x)",
    answerDe: "cos(-x) = cos(x)",
    aliases: ["even cos"]
  },
  {
    difficulty: "core",
    promptLatex: "\\tan(-x) = ?",
    answerLatex: "\\tan(-x) = -\\tan x",
    promptEn: "State the odd/even identity for tan.",
    promptDe: "Nenne die Symmetrieidentitaet fuer tan.",
    answerEn: "tan(-x) = -tan(x)",
    answerDe: "tan(-x) = -tan(x)",
    aliases: ["odd tan"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin(\\pi - x) = ?",
    answerLatex: "\\sin(\\pi - x) = \\sin x",
    promptEn: "Reflect sin around pi.",
    promptDe: "Spiegelungsidentitaet von sin um pi.",
    answerEn: "sin(pi - x) = sin(x)",
    answerDe: "sin(pi - x) = sin(x)",
    aliases: ["supplementary angle"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos(\\pi - x) = ?",
    answerLatex: "\\cos(\\pi - x) = -\\cos x",
    promptEn: "Reflect cos around pi.",
    promptDe: "Spiegelungsidentitaet von cos um pi.",
    answerEn: "cos(pi - x) = -cos(x)",
    answerDe: "cos(pi - x) = -cos(x)",
    aliases: ["supplementary angle"]
  },
  {
    difficulty: "core",
    promptLatex: "\\tan(\\pi - x) = ?",
    answerLatex: "\\tan(\\pi - x) = -\\tan x",
    promptEn: "Reflect tan around pi.",
    promptDe: "Spiegelungsidentitaet von tan um pi.",
    answerEn: "tan(pi - x) = -tan(x)",
    answerDe: "tan(pi - x) = -tan(x)",
    aliases: ["supplementary angle"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin(\\pi + x) = ?",
    answerLatex: "\\sin(\\pi + x) = -\\sin x",
    promptEn: "Shift sin by pi.",
    promptDe: "Verschiebung von sin um pi.",
    answerEn: "sin(pi + x) = -sin(x)",
    answerDe: "sin(pi + x) = -sin(x)",
    aliases: ["pi shift"]
  },
  {
    difficulty: "core",
    promptLatex: "\\tan(\\pi + x) = ?",
    answerLatex: "\\tan(\\pi + x) = \\tan x",
    promptEn: "Shift tan by pi.",
    promptDe: "Verschiebung von tan um pi.",
    answerEn: "tan(pi + x) = tan(x)",
    answerDe: "tan(pi + x) = tan(x)",
    aliases: ["pi shift"]
  }
]);

const angleSumDifference = createCategoryCards("angle_sum_difference", [
  {
    difficulty: "core",
    promptLatex: "\\sin(a+b) = ?",
    answerLatex: "\\sin(a+b) = \\sin a\\cos b + \\cos a\\sin b",
    promptEn: "State the sine addition theorem.",
    promptDe: "Nenne den Additionssatz fuer sin.",
    answerEn: "sin(a+b) = sin(a)cos(b) + cos(a)sin(b)",
    answerDe: "sin(a+b) = sin(a)cos(b) + cos(a)sin(b)",
    aliases: ["sine addition formula"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin(a-b) = ?",
    answerLatex: "\\sin(a-b) = \\sin a\\cos b - \\cos a\\sin b",
    promptEn: "State the sine subtraction theorem.",
    promptDe: "Nenne den Subtraktionssatz fuer sin.",
    answerEn: "sin(a-b) = sin(a)cos(b) - cos(a)sin(b)",
    answerDe: "sin(a-b) = sin(a)cos(b) - cos(a)sin(b)",
    aliases: ["sine subtraction formula"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos(a+b) = ?",
    answerLatex: "\\cos(a+b) = \\cos a\\cos b - \\sin a\\sin b",
    promptEn: "State the cosine addition theorem.",
    promptDe: "Nenne den Additionssatz fuer cos.",
    answerEn: "cos(a+b) = cos(a)cos(b) - sin(a)sin(b)",
    answerDe: "cos(a+b) = cos(a)cos(b) - sin(a)sin(b)",
    aliases: ["cosine addition formula"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos(a-b) = ?",
    answerLatex: "\\cos(a-b) = \\cos a\\cos b + \\sin a\\sin b",
    promptEn: "State the cosine subtraction theorem.",
    promptDe: "Nenne den Subtraktionssatz fuer cos.",
    answerEn: "cos(a-b) = cos(a)cos(b) + sin(a)sin(b)",
    answerDe: "cos(a-b) = cos(a)cos(b) + sin(a)sin(b)",
    aliases: ["cosine subtraction formula"]
  },
  {
    difficulty: "core",
    promptLatex: "\\tan(a+b) = ?",
    answerLatex: "\\tan(a+b)=\\frac{\\tan a+\\tan b}{1-\\tan a\\tan b}",
    promptEn: "State the tangent addition theorem.",
    promptDe: "Nenne den Additionssatz fuer tan.",
    answerEn: "tan(a+b) = (tan a + tan b) / (1 - tan a tan b)",
    answerDe: "tan(a+b) = (tan a + tan b) / (1 - tan a tan b)",
    aliases: ["tangent addition formula"]
  },
  {
    difficulty: "core",
    promptLatex: "\\tan(a-b) = ?",
    answerLatex: "\\tan(a-b)=\\frac{\\tan a-\\tan b}{1+\\tan a\\tan b}",
    promptEn: "State the tangent subtraction theorem.",
    promptDe: "Nenne den Subtraktionssatz fuer tan.",
    answerEn: "tan(a-b) = (tan a - tan b) / (1 + tan a tan b)",
    answerDe: "tan(a-b) = (tan a - tan b) / (1 + tan a tan b)",
    aliases: ["tangent subtraction formula"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\cot(a+b) = ?",
    answerLatex: "\\cot(a+b)=\\frac{\\cot a\\cot b-1}{\\cot a+\\cot b}",
    promptEn: "State the cotangent addition theorem.",
    promptDe: "Nenne den Additionssatz fuer cot.",
    answerEn: "cot(a+b) = (cot a cot b - 1) / (cot a + cot b)",
    answerDe: "cot(a+b) = (cot a cot b - 1) / (cot a + cot b)",
    aliases: ["cot addition formula"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\cot(a-b) = ?",
    answerLatex: "\\cot(a-b)=\\frac{\\cot a\\cot b+1}{\\cot b-\\cot a}",
    promptEn: "State the cotangent subtraction theorem.",
    promptDe: "Nenne den Subtraktionssatz fuer cot.",
    answerEn: "cot(a-b) = (cot a cot b + 1) / (cot b - cot a)",
    answerDe: "cot(a-b) = (cot a cot b + 1) / (cot b - cot a)",
    aliases: ["cot subtraction formula"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin a\\cos b + \\cos a\\sin b = ?",
    answerLatex: "\\sin(a+b)",
    promptEn: "Compress this expression into one trig function.",
    promptDe: "Fasse diesen Ausdruck zu einer trigonometrischen Funktion zusammen.",
    answerEn: "sin(a+b)",
    answerDe: "sin(a+b)",
    aliases: ["reverse addition theorem"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin a\\cos b - \\cos a\\sin b = ?",
    answerLatex: "\\sin(a-b)",
    promptEn: "Compress this expression into one trig function.",
    promptDe: "Fasse diesen Ausdruck zu einer trigonometrischen Funktion zusammen.",
    answerEn: "sin(a-b)",
    answerDe: "sin(a-b)",
    aliases: ["reverse subtraction theorem"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos a\\cos b - \\sin a\\sin b = ?",
    answerLatex: "\\cos(a+b)",
    promptEn: "Compress this expression into one trig function.",
    promptDe: "Fasse diesen Ausdruck zu einer trigonometrischen Funktion zusammen.",
    answerEn: "cos(a+b)",
    answerDe: "cos(a+b)",
    aliases: ["reverse cosine addition"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos a\\cos b + \\sin a\\sin b = ?",
    answerLatex: "\\cos(a-b)",
    promptEn: "Compress this expression into one trig function.",
    promptDe: "Fasse diesen Ausdruck zu einer trigonometrischen Funktion zusammen.",
    answerEn: "cos(a-b)",
    answerDe: "cos(a-b)",
    aliases: ["reverse cosine subtraction"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin 75^\\circ = ?",
    answerLatex: "\\sin 75^\\circ = \\frac{\\sqrt{6}+\\sqrt{2}}{4}",
    promptEn: "Exact value of sin(75 deg).",
    promptDe: "Exakter Wert von sin(75 Grad).",
    answerEn: "sin(75 deg) = (sqrt(6)+sqrt(2))/4",
    answerDe: "sin(75 Grad) = (sqrt(6)+sqrt(2))/4",
    aliases: ["sin(45+30)"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos 15^\\circ = ?",
    answerLatex: "\\cos 15^\\circ = \\frac{\\sqrt{6}+\\sqrt{2}}{4}",
    promptEn: "Exact value of cos(15 deg).",
    promptDe: "Exakter Wert von cos(15 Grad).",
    answerEn: "cos(15 deg) = (sqrt(6)+sqrt(2))/4",
    answerDe: "cos(15 Grad) = (sqrt(6)+sqrt(2))/4",
    aliases: ["cos(45-30)"]
  }
]);

const doubleHalfAngle = createCategoryCards("double_half_angle", [
  {
    difficulty: "core",
    promptLatex: "\\sin(2x) = ?",
    answerLatex: "\\sin(2x) = 2\\sin x\\cos x",
    promptEn: "State the sine double-angle identity.",
    promptDe: "Nenne die Doppelwinkelformel fuer sin.",
    answerEn: "sin(2x) = 2 sin(x) cos(x)",
    answerDe: "sin(2x) = 2 sin(x) cos(x)",
    aliases: ["double angle sine"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos(2x) = ?\\;\\text{(difference form)}",
    answerLatex: "\\cos(2x) = \\cos^2 x - \\sin^2 x",
    promptEn: "State cos(2x) as cos^2 minus sin^2.",
    promptDe: "Schreibe cos(2x) als cos^2 minus sin^2.",
    answerEn: "cos(2x) = cos^2(x) - sin^2(x)",
    answerDe: "cos(2x) = cos^2(x) - sin^2(x)",
    aliases: ["double angle cosine"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos(2x) = ?\\;\\text{(cos-only form)}",
    answerLatex: "\\cos(2x) = 2\\cos^2 x - 1",
    promptEn: "State cos(2x) with cos only.",
    promptDe: "Schreibe cos(2x) nur mit cos.",
    answerEn: "cos(2x) = 2cos^2(x) - 1",
    answerDe: "cos(2x) = 2cos^2(x) - 1",
    aliases: ["double angle cosine"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos(2x) = ?\\;\\text{(sin-only form)}",
    answerLatex: "\\cos(2x) = 1 - 2\\sin^2 x",
    promptEn: "State cos(2x) with sin only.",
    promptDe: "Schreibe cos(2x) nur mit sin.",
    answerEn: "cos(2x) = 1 - 2sin^2(x)",
    answerDe: "cos(2x) = 1 - 2sin^2(x)",
    aliases: ["double angle cosine"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\tan(2x) = ?",
    answerLatex: "\\tan(2x)=\\frac{2\\tan x}{1-\\tan^2 x}",
    promptEn: "State the tangent double-angle identity.",
    promptDe: "Nenne die Doppelwinkelformel fuer tan.",
    answerEn: "tan(2x) = 2tan(x)/(1 - tan^2(x))",
    answerDe: "tan(2x) = 2tan(x)/(1 - tan^2(x))",
    aliases: ["double angle tangent"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin^2\\left(\\frac{x}{2}\\right) = ?",
    answerLatex: "\\sin^2\\left(\\frac{x}{2}\\right)=\\frac{1-\\cos x}{2}",
    promptEn: "State the half-angle identity for sin^2(x/2).",
    promptDe: "Nenne die Halbwinkelformel fuer sin^2(x/2).",
    answerEn: "sin^2(x/2) = (1 - cos x)/2",
    answerDe: "sin^2(x/2) = (1 - cos x)/2",
    aliases: ["half-angle sine"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos^2\\left(\\frac{x}{2}\\right) = ?",
    answerLatex: "\\cos^2\\left(\\frac{x}{2}\\right)=\\frac{1+\\cos x}{2}",
    promptEn: "State the half-angle identity for cos^2(x/2).",
    promptDe: "Nenne die Halbwinkelformel fuer cos^2(x/2).",
    answerEn: "cos^2(x/2) = (1 + cos x)/2",
    answerDe: "cos^2(x/2) = (1 + cos x)/2",
    aliases: ["half-angle cosine"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\tan\\left(\\frac{x}{2}\\right) = ?\\;\\text{(sin/cos form)}",
    answerLatex: "\\tan\\left(\\frac{x}{2}\\right)=\\frac{\\sin x}{1+\\cos x}",
    promptEn: "State tan(x/2) using sin x and cos x.",
    promptDe: "Schreibe tan(x/2) mit sin x und cos x.",
    answerEn: "tan(x/2) = sin(x)/(1 + cos(x))",
    answerDe: "tan(x/2) = sin(x)/(1 + cos(x))",
    aliases: ["half-angle tangent"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\tan\\left(\\frac{x}{2}\\right) = ?\\;\\text{(alternate form)}",
    answerLatex: "\\tan\\left(\\frac{x}{2}\\right)=\\frac{1-\\cos x}{\\sin x}",
    promptEn: "State the alternate tan(x/2) identity.",
    promptDe: "Nenne die alternative Formel fuer tan(x/2).",
    answerEn: "tan(x/2) = (1 - cos(x))/sin(x)",
    answerDe: "tan(x/2) = (1 - cos(x))/sin(x)",
    aliases: ["half-angle tangent"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin^2 x = ?\\;\\text{(using cos 2x)}",
    answerLatex: "\\sin^2 x = \\frac{1-\\cos(2x)}{2}",
    promptEn: "Power-reduction formula for sin^2(x).",
    promptDe: "Potenzreduktionsformel fuer sin^2(x).",
    answerEn: "sin^2(x) = (1 - cos(2x))/2",
    answerDe: "sin^2(x) = (1 - cos(2x))/2",
    aliases: ["power reduction"]
  },
  {
    difficulty: "core",
    promptLatex: "\\cos^2 x = ?\\;\\text{(using cos 2x)}",
    answerLatex: "\\cos^2 x = \\frac{1+\\cos(2x)}{2}",
    promptEn: "Power-reduction formula for cos^2(x).",
    promptDe: "Potenzreduktionsformel fuer cos^2(x).",
    answerEn: "cos^2(x) = (1 + cos(2x))/2",
    answerDe: "cos^2(x) = (1 + cos(2x))/2",
    aliases: ["power reduction"]
  },
  {
    difficulty: "core",
    promptLatex: "1-\\cos x = ?",
    answerLatex: "1-\\cos x = 2\\sin^2\\left(\\frac{x}{2}\\right)",
    promptEn: "Rewrite 1 - cos(x) with half-angle.",
    promptDe: "Schreibe 1 - cos(x) mit Halbwinkel um.",
    answerEn: "1 - cos(x) = 2sin^2(x/2)",
    answerDe: "1 - cos(x) = 2sin^2(x/2)",
    aliases: ["half-angle rearrangement"]
  },
  {
    difficulty: "core",
    promptLatex: "1+\\cos x = ?",
    answerLatex: "1+\\cos x = 2\\cos^2\\left(\\frac{x}{2}\\right)",
    promptEn: "Rewrite 1 + cos(x) with half-angle.",
    promptDe: "Schreibe 1 + cos(x) mit Halbwinkel um.",
    answerEn: "1 + cos(x) = 2cos^2(x/2)",
    answerDe: "1 + cos(x) = 2cos^2(x/2)",
    aliases: ["half-angle rearrangement"]
  },
  {
    difficulty: "core",
    promptLatex: "\\sin x = ?\\;\\text{(with }x/2\\text{)}",
    answerLatex: "\\sin x = 2\\sin\\left(\\frac{x}{2}\\right)\\cos\\left(\\frac{x}{2}\\right)",
    promptEn: "Rewrite sin(x) using half-angle factors.",
    promptDe: "Schreibe sin(x) mit Halbwinkelfaktoren.",
    answerEn: "sin(x) = 2sin(x/2)cos(x/2)",
    answerDe: "sin(x) = 2sin(x/2)cos(x/2)",
    aliases: ["double-angle rearrangement"]
  }
]);

const productSumTransforms = createCategoryCards("product_sum_transforms", [
  {
    difficulty: "advanced",
    promptLatex: "\\sin a\\sin b = ?",
    answerLatex: "\\sin a\\sin b = \\frac{1}{2}\\left[\\cos(a-b)-\\cos(a+b)\\right]",
    promptEn: "Product-to-sum for sin a sin b.",
    promptDe: "Produkt-zu-Summe fuer sin a sin b.",
    answerEn: "sin(a)sin(b) = 1/2[cos(a-b) - cos(a+b)]",
    answerDe: "sin(a)sin(b) = 1/2[cos(a-b) - cos(a+b)]",
    aliases: ["product-to-sum"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\cos a\\cos b = ?",
    answerLatex: "\\cos a\\cos b = \\frac{1}{2}\\left[\\cos(a-b)+\\cos(a+b)\\right]",
    promptEn: "Product-to-sum for cos a cos b.",
    promptDe: "Produkt-zu-Summe fuer cos a cos b.",
    answerEn: "cos(a)cos(b) = 1/2[cos(a-b) + cos(a+b)]",
    answerDe: "cos(a)cos(b) = 1/2[cos(a-b) + cos(a+b)]",
    aliases: ["product-to-sum"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\sin a\\cos b = ?",
    answerLatex: "\\sin a\\cos b = \\frac{1}{2}\\left[\\sin(a+b)+\\sin(a-b)\\right]",
    promptEn: "Product-to-sum for sin a cos b.",
    promptDe: "Produkt-zu-Summe fuer sin a cos b.",
    answerEn: "sin(a)cos(b) = 1/2[sin(a+b) + sin(a-b)]",
    answerDe: "sin(a)cos(b) = 1/2[sin(a+b) + sin(a-b)]",
    aliases: ["product-to-sum"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\cos a\\sin b = ?",
    answerLatex: "\\cos a\\sin b = \\frac{1}{2}\\left[\\sin(a+b)-\\sin(a-b)\\right]",
    promptEn: "Product-to-sum for cos a sin b.",
    promptDe: "Produkt-zu-Summe fuer cos a sin b.",
    answerEn: "cos(a)sin(b) = 1/2[sin(a+b) - sin(a-b)]",
    answerDe: "cos(a)sin(b) = 1/2[sin(a+b) - sin(a-b)]",
    aliases: ["product-to-sum"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\sin a + \\sin b = ?",
    answerLatex: "\\sin a + \\sin b = 2\\sin\\left(\\frac{a+b}{2}\\right)\\cos\\left(\\frac{a-b}{2}\\right)",
    promptEn: "Sum-to-product for sin a + sin b.",
    promptDe: "Summe-zu-Produkt fuer sin a + sin b.",
    answerEn: "sin a + sin b = 2sin((a+b)/2)cos((a-b)/2)",
    answerDe: "sin a + sin b = 2sin((a+b)/2)cos((a-b)/2)",
    aliases: ["sum-to-product"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\sin a - \\sin b = ?",
    answerLatex: "\\sin a - \\sin b = 2\\cos\\left(\\frac{a+b}{2}\\right)\\sin\\left(\\frac{a-b}{2}\\right)",
    promptEn: "Sum-to-product for sin a - sin b.",
    promptDe: "Differenz-zu-Produkt fuer sin a - sin b.",
    answerEn: "sin a - sin b = 2cos((a+b)/2)sin((a-b)/2)",
    answerDe: "sin a - sin b = 2cos((a+b)/2)sin((a-b)/2)",
    aliases: ["sum-to-product"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\cos a + \\cos b = ?",
    answerLatex: "\\cos a + \\cos b = 2\\cos\\left(\\frac{a+b}{2}\\right)\\cos\\left(\\frac{a-b}{2}\\right)",
    promptEn: "Sum-to-product for cos a + cos b.",
    promptDe: "Summe-zu-Produkt fuer cos a + cos b.",
    answerEn: "cos a + cos b = 2cos((a+b)/2)cos((a-b)/2)",
    answerDe: "cos a + cos b = 2cos((a+b)/2)cos((a-b)/2)",
    aliases: ["sum-to-product"]
  },
  {
    difficulty: "advanced",
    promptLatex: "\\cos a - \\cos b = ?",
    answerLatex: "\\cos a - \\cos b = -2\\sin\\left(\\frac{a+b}{2}\\right)\\sin\\left(\\frac{a-b}{2}\\right)",
    promptEn: "Sum-to-product for cos a - cos b.",
    promptDe: "Differenz-zu-Produkt fuer cos a - cos b.",
    answerEn: "cos a - cos b = -2sin((a+b)/2)sin((a-b)/2)",
    answerDe: "cos a - cos b = -2sin((a+b)/2)sin((a-b)/2)",
    aliases: ["sum-to-product"]
  },
  {
    difficulty: "advanced",
    promptLatex: "2\\sin a\\cos b = ?",
    answerLatex: "2\\sin a\\cos b = \\sin(a+b)+\\sin(a-b)",
    promptEn: "Expand 2 sin a cos b into a sum.",
    promptDe: "Schreibe 2 sin a cos b als Summe.",
    answerEn: "2sin a cos b = sin(a+b) + sin(a-b)",
    answerDe: "2sin a cos b = sin(a+b) + sin(a-b)",
    aliases: ["reverse product-to-sum"]
  },
  {
    difficulty: "advanced",
    promptLatex: "2\\cos a\\cos b = ?",
    answerLatex: "2\\cos a\\cos b = \\cos(a+b)+\\cos(a-b)",
    promptEn: "Expand 2 cos a cos b into a sum.",
    promptDe: "Schreibe 2 cos a cos b als Summe.",
    answerEn: "2cos a cos b = cos(a+b) + cos(a-b)",
    answerDe: "2cos a cos b = cos(a+b) + cos(a-b)",
    aliases: ["reverse product-to-sum"]
  }
]);

const inverseTrigRanges = createCategoryCards("inverse_trig_ranges", [
  {
    difficulty: "core",
    promptLatex: "\\operatorname{range}(\\arcsin x) = ?",
    answerLatex: "\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]",
    promptEn: "Principal value range of arcsin.",
    promptDe: "Hauptwertbereich von arcsin.",
    answerEn: "arcsin(x) in [-pi/2, pi/2]",
    answerDe: "arcsin(x) in [-pi/2, pi/2]",
    aliases: ["arcsin range"]
  },
  {
    difficulty: "core",
    promptLatex: "\\operatorname{range}(\\arccos x) = ?",
    answerLatex: "[0, \\pi]",
    promptEn: "Principal value range of arccos.",
    promptDe: "Hauptwertbereich von arccos.",
    answerEn: "arccos(x) in [0, pi]",
    answerDe: "arccos(x) in [0, pi]",
    aliases: ["arccos range"]
  },
  {
    difficulty: "core",
    promptLatex: "\\operatorname{range}(\\arctan x) = ?",
    answerLatex: "\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)",
    promptEn: "Principal value range of arctan.",
    promptDe: "Hauptwertbereich von arctan.",
    answerEn: "arctan(x) in (-pi/2, pi/2)",
    answerDe: "arctan(x) in (-pi/2, pi/2)",
    aliases: ["arctan range"]
  },
  {
    difficulty: "core",
    promptLatex: "\\arcsin(1) = ?",
    answerLatex: "\\frac{\\pi}{2}",
    promptEn: "Exact value of arcsin(1).",
    promptDe: "Exakter Wert von arcsin(1).",
    answerEn: "arcsin(1) = pi/2",
    answerDe: "arcsin(1) = pi/2",
    aliases: ["inverse trig exact"]
  },
  {
    difficulty: "core",
    promptLatex: "\\arccos(0) = ?",
    answerLatex: "\\frac{\\pi}{2}",
    promptEn: "Exact value of arccos(0).",
    promptDe: "Exakter Wert von arccos(0).",
    answerEn: "arccos(0) = pi/2",
    answerDe: "arccos(0) = pi/2",
    aliases: ["inverse trig exact"]
  },
  {
    difficulty: "core",
    promptLatex: "\\arctan(1) = ?",
    answerLatex: "\\frac{\\pi}{4}",
    promptEn: "Exact value of arctan(1).",
    promptDe: "Exakter Wert von arctan(1).",
    answerEn: "arctan(1) = pi/4",
    answerDe: "arctan(1) = pi/4",
    aliases: ["inverse trig exact"]
  },
  {
    difficulty: "core",
    promptLatex: "\\arcsin\\left(\\frac{\\sqrt{3}}{2}\\right) = ?",
    answerLatex: "\\frac{\\pi}{3}",
    promptEn: "Exact value of arcsin(sqrt(3)/2).",
    promptDe: "Exakter Wert von arcsin(sqrt(3)/2).",
    answerEn: "arcsin(sqrt(3)/2) = pi/3",
    answerDe: "arcsin(sqrt(3)/2) = pi/3",
    aliases: ["inverse trig exact"]
  },
  {
    difficulty: "core",
    promptLatex: "\\arccos(-1) = ?",
    answerLatex: "\\pi",
    promptEn: "Exact value of arccos(-1).",
    promptDe: "Exakter Wert von arccos(-1).",
    answerEn: "arccos(-1) = pi",
    answerDe: "arccos(-1) = pi",
    aliases: ["inverse trig exact"]
  }
]);

const appliedForms = createCategoryCards("applied_forms", [
  {
    difficulty: "core",
    promptLatex: "f(x)=a\\sin(b(x-c))+d\\;\\Rightarrow\\;\\text{Amplitude}=?",
    answerLatex: "|a|",
    promptEn: "In a sin model, what is the amplitude?",
    promptDe: "Was ist bei einem sin-Modell die Amplitude?",
    answerEn: "Amplitude is |a|.",
    answerDe: "Die Amplitude ist |a|.",
    aliases: ["sinus model"]
  },
  {
    difficulty: "core",
    promptLatex: "f(x)=a\\sin(b(x-c))+d\\;\\Rightarrow\\;\\text{Period}=?",
    answerLatex: "\\frac{2\\pi}{|b|}",
    promptEn: "In a sin/cos model, what is the period?",
    promptDe: "Was ist bei einem sin/cos-Modell die Periode?",
    answerEn: "Period is 2pi/|b|.",
    answerDe: "Periode ist 2pi/|b|.",
    aliases: ["period formula"]
  },
  {
    difficulty: "advanced",
    promptLatex: "T=\\frac{2\\pi}{|b|}\\;\\Rightarrow\\; b=?",
    answerLatex: "|b|=\\frac{2\\pi}{T}",
    promptEn: "Solve for |b| from period T.",
    promptDe: "Loese |b| aus der Periode T.",
    answerEn: "|b| = 2pi / T",
    answerDe: "|b| = 2pi / T",
    aliases: ["period inversion"]
  },
  {
    difficulty: "core",
    promptLatex: "f(x)=a\\sin(b(x-c))+d\\;\\Rightarrow\\;\\text{Midline}=?",
    answerLatex: "y=d",
    promptEn: "What is the midline of the sinusoid?",
    promptDe: "Was ist die Mittellinie der Sinuskurve?",
    answerEn: "The midline is y = d.",
    answerDe: "Die Mittellinie ist y = d.",
    aliases: ["vertical shift"]
  },
  {
    difficulty: "core",
    promptLatex: "f(x)=a\\sin(b(x-c))+d\\;\\Rightarrow\\;f_{\\max}=?",
    answerLatex: "d+|a|",
    promptEn: "Maximum value of the sinusoid.",
    promptDe: "Maximalwert der Sinuskurve.",
    answerEn: "Maximum is d + |a|.",
    answerDe: "Maximum ist d + |a|.",
    aliases: ["sinusoid max"]
  },
  {
    difficulty: "core",
    promptLatex: "f(x)=a\\sin(b(x-c))+d\\;\\Rightarrow\\;f_{\\min}=?",
    answerLatex: "d-|a|",
    promptEn: "Minimum value of the sinusoid.",
    promptDe: "Minimalwert der Sinuskurve.",
    answerEn: "Minimum is d - |a|.",
    answerDe: "Minimum ist d - |a|.",
    aliases: ["sinusoid min"]
  },
  {
    difficulty: "core",
    promptLatex: "f(x)=a\\tan(b(x-c))+d\\;\\Rightarrow\\;\\text{Period}=?",
    answerLatex: "\\frac{\\pi}{|b|}",
    promptEn: "Period formula for tangent model.",
    promptDe: "Periodenformel fuer ein Tangensmodell.",
    answerEn: "Period is pi/|b|.",
    answerDe: "Periode ist pi/|b|.",
    aliases: ["tangent period"]
  },
  {
    difficulty: "advanced",
    promptLatex: "a\\sin(\\omega x+\\varphi)\\;\\Rightarrow\\;\\omega=?",
    answerLatex: "\\omega=\\text{angular frequency coefficient of }x",
    promptEn: "What is angular frequency in a sin model?",
    promptDe: "Was ist die Kreisfrequenz in einem Sinusmodell?",
    answerEn: "Angular frequency is omega, the coefficient of x in the phase.",
    answerDe: "Kreisfrequenz ist omega, der Koeffizient vor x in der Phase.",
    aliases: ["angular frequency"]
  },
  {
    difficulty: "advanced",
    promptLatex: "A\\cos x + B\\sin x = R\\sin(x+\\phi),\\;R=?",
    answerLatex: "R=\\sqrt{A^2+B^2}",
    promptEn: "In harmonic combination form, what is R?",
    promptDe: "Was ist R bei der harmonischen Kombination?",
    answerEn: "R = sqrt(A^2 + B^2)",
    answerDe: "R = sqrt(A^2 + B^2)",
    aliases: ["phasor form"]
  },
  {
    difficulty: "advanced",
    promptLatex: "f(x)=a\\sin(b(x-c))+d\\;\\Rightarrow\\;\\text{phase shift}=?",
    answerLatex: "c\\;\\text{(shift right if }b>0\\text{)}",
    promptEn: "What is the phase shift in this parameterization?",
    promptDe: "Was ist der Phasenversatz in dieser Parametrisierung?",
    answerEn: "Phase shift is c units to the right (for b > 0).",
    answerDe: "Phasenverschiebung ist c nach rechts (fuer b > 0).",
    aliases: ["horizontal shift"]
  }
]);

const trigDeck = [
  ...unitCircleAngles,
  ...coreIdentities,
  ...angleSumDifference,
  ...doubleHalfAngle,
  ...productSumTransforms,
  ...inverseTrigRanges,
  ...appliedForms
] as const satisfies TrigCard[];

const trigCardIndex = new Map<string, TrigCard>(trigDeck.map((card) => [card.id, card]));

export const TRIG_DECK: TrigCard[] = [...trigDeck];

export function getTrigCardById(cardId: string): TrigCard | undefined {
  return trigCardIndex.get(cardId);
}

export function getTrigDeckByCategories(categories: TrigCategory[]): TrigCard[] {
  if (categories.length === 0) {
    return TRIG_DECK;
  }

  const categorySet = new Set(categories);
  return TRIG_DECK.filter((card) => categorySet.has(card.category));
}
