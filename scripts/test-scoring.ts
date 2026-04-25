// Quick sanity check for scoring logic.
// Run: npm run test:scoring

import { computeDiagnostic } from "../lib/scoring.ts";
import type {
  AnswerValue,
  ModifierKey,
  Need,
  StatutPro,
  VerdictKey,
} from "../lib/types.ts";

const NEED_QUESTION_IDS: Record<
  Need,
  { intensity: [number, number]; satPos: number; satNeg: number }
> = {
  certitude: { intensity: [1, 2], satPos: 3, satNeg: 4 },
  variete: { intensity: [5, 6], satPos: 7, satNeg: 8 },
  signifiance: { intensity: [9, 10], satPos: 11, satNeg: 12 },
  connexion: { intensity: [13, 14], satPos: 15, satNeg: 16 },
  croissance: { intensity: [17, 18], satPos: 19, satNeg: 20 },
  contribution: { intensity: [21, 22], satPos: 23, satNeg: 24 },
};

const ZEROS = (): Record<number, AnswerValue> =>
  Object.fromEntries(Array.from({ length: 24 }, (_, i) => [i + 1, 0]));

const ALL = (v: AnswerValue): Record<number, AnswerValue> =>
  Object.fromEntries(Array.from({ length: 24 }, (_, i) => [i + 1, v]));

function setNeed(
  answers: Record<number, AnswerValue>,
  need: Need,
  opts: { intensity: AnswerValue; satPos: AnswerValue; satNeg: AnswerValue },
): Record<number, AnswerValue> {
  const ids = NEED_QUESTION_IDS[need];
  answers[ids.intensity[0]] = opts.intensity;
  answers[ids.intensity[1]] = opts.intensity;
  answers[ids.satPos] = opts.satPos;
  answers[ids.satNeg] = opts.satNeg;
  return answers;
}

type Case = {
  name: string;
  answers: Record<number, AnswerValue>;
  statutPro: StatutPro;
  expectVerdict: VerdictKey;
  expectTalent?: number;
  expectModifiers?: ModifierKey[];
};

// piège for need N: intensity 2/2, satPos 0, satNeg 2 → intensity=4, satisfaction=0
function piegeOnly(need: Need, statutPro: StatutPro = "salarie"): Case {
  const a = ZEROS();
  setNeed(a, need, { intensity: 2, satPos: 0, satNeg: 2 });
  return { name: `${need} piège isolé`, answers: a, statutPro, expectVerdict: "" as VerdictKey };
}

// sain for need N: intensity 2/2, satPos 2, satNeg 0 → intensity=4, satisfaction=4
function sainOnly(need: Need, statutPro: StatutPro = "salarie"): Case {
  const a = ZEROS();
  setNeed(a, need, { intensity: 2, satPos: 2, satNeg: 0 });
  return { name: `${need} sain isolé`, answers: a, statutPro, expectVerdict: "" as VerdictKey };
}

const cases: Case[] = [
  // 1. All zero → no need active → suspendu, talent fallback 5/10
  {
    name: "Tout à 0 (aucun besoin actif)",
    answers: ALL(0),
    statutPro: "salarie",
    expectVerdict: "suspendu",
    expectTalent: 5,
    expectModifiers: [],
  },
  // 2. All Yes → contradictions, sat=2 partout → transition (top=certitude, intensity=4, sat=2)
  {
    name: "Tout à 2 (contradictoire, sat=2 partout)",
    answers: ALL(2),
    statutPro: "salarie",
    expectVerdict: "transition",
  },
  // 3. All Plutôt (1) → intensity=2 < 3 → suspendu
  {
    name: "Tout à 1 (intensité moyenne, aucun dominant)",
    answers: ALL(1),
    statutPro: "salarie",
    expectVerdict: "suspendu",
  },
  // 4. Certitude piège isolé → coince + m1
  {
    ...piegeOnly("certitude"),
    expectVerdict: "coince",
    expectTalent: 0,
    expectModifiers: ["m1"],
  },
  // 5. Certitude sain isolé → ancre, talent 10
  {
    ...sainOnly("certitude"),
    expectVerdict: "ancre",
    expectTalent: 10,
  },
  // 6. Variete piège isolé → disperse + m4 (intensité var + répétition + routine)
  {
    ...piegeOnly("variete"),
    expectVerdict: "disperse",
    expectTalent: 0,
    expectModifiers: ["m4"],
  },
  // 7. Variete sain isolé → explorateur
  {
    ...sainOnly("variete"),
    expectVerdict: "explorateur",
    expectTalent: 10,
  },
  // 8. Signifiance piège → egoique + m2
  {
    ...piegeOnly("signifiance"),
    expectVerdict: "egoique",
    expectTalent: 0,
    expectModifiers: ["m2"],
  },
  // 9. Signifiance sain → reconnu
  {
    ...sainOnly("signifiance"),
    expectVerdict: "reconnu",
    expectTalent: 10,
  },
  // 10. Connexion piège → loyal + m6
  {
    ...piegeOnly("connexion"),
    expectVerdict: "loyal",
    expectTalent: 0,
    expectModifiers: ["m6"],
  },
  // 11. Connexion sain → connecte
  {
    ...sainOnly("connexion"),
    expectVerdict: "connecte",
    expectTalent: 10,
  },
  // 12. Croissance piège → epuise + m8 (vision floue)
  {
    ...piegeOnly("croissance"),
    expectVerdict: "epuise",
    expectTalent: 0,
    expectModifiers: ["m8"],
  },
  // 13. Croissance sain → expansion
  {
    ...sainOnly("croissance"),
    expectVerdict: "expansion",
    expectTalent: 10,
  },
  // 14. Contribution piège → perdu + m5
  {
    ...piegeOnly("contribution"),
    expectVerdict: "perdu",
    expectTalent: 0,
    expectModifiers: ["m5"],
  },
  // 15. Contribution sain → service
  {
    ...sainOnly("contribution"),
    expectVerdict: "service",
    expectTalent: 10,
  },
  // 16. Patron-manager Contribution piège + isolement (m7 leader accidentel)
  (() => {
    const a = ZEROS();
    setNeed(a, "contribution", { intensity: 2, satPos: 0, satNeg: 2 });
    setNeed(a, "connexion", { intensity: 2, satPos: 0, satNeg: 2 });
    return {
      name: "Patron-manager Contribution + Connexion piège",
      answers: a,
      statutPro: "patron-manager" as StatutPro,
      // Top need ties: certitude order, but contribution=4 and connexion=4. NEED_ORDER tie → certitude wins? No, certitude has intensity 0. Order: contribution comes after connexion, but both have intensity 4. NEED_ORDER index: connexion=3, contribution=5. Sort by intensity desc, tie by NEED_ORDER index asc → connexion first.
      expectVerdict: "loyal" as VerdictKey,
      expectModifiers: ["m5", "m6", "m7"] as ModifierKey[],
    };
  })(),
];

let pass = 0;
let fail = 0;
for (const c of cases) {
  const res = computeDiagnostic(c.answers, c.statutPro);
  const okVerdict = res.verdict === c.expectVerdict;
  const okTalent =
    c.expectTalent === undefined ? true : res.talentScore === c.expectTalent;
  const okMods =
    c.expectModifiers === undefined
      ? true
      : JSON.stringify(res.modifiers.sort()) ===
        JSON.stringify([...c.expectModifiers].sort());
  const ok = okVerdict && okTalent && okMods;
  const intensities = Object.entries(res.needScores)
    .map(([k, v]) => `${k.slice(0, 3)}=${v.intensity}/${v.satisfaction}`)
    .join(" ");
  console.log(
    `${ok ? "✓" : "✗"} ${c.name}`,
    `\n  ${intensities}`,
    `\n  verdict: ${res.verdict} (attendu ${c.expectVerdict})`,
    `\n  talent: ${res.talentScore}/10${c.expectTalent !== undefined ? ` (attendu ${c.expectTalent})` : ""}`,
    `\n  modifiers: ${res.modifiers.join(", ") || "aucun"}${c.expectModifiers ? ` (attendu ${c.expectModifiers.join(", ") || "aucun"})` : ""}`,
    `\n  dominants: ${res.dominantNeeds.join(", ")}`,
  );
  if (ok) pass++;
  else fail++;
}
console.log(`\n${pass}/${pass + fail} tests passés.`);
process.exit(fail === 0 ? 0 : 1);
