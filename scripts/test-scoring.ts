// Quick sanity check for scoring logic.
// Run: npm run test:scoring

import { computeDiagnostic } from "../lib/scoring.ts";
import type { AnswerValue, StatutPro, VerdictKey } from "../lib/types.ts";

const allAnswered = (v: AnswerValue): Record<number, AnswerValue> =>
  Object.fromEntries(Array.from({ length: 24 }, (_, i) => [i + 1, v]));

const buildAnswers = (
  fn: (i: number) => AnswerValue,
): Record<number, AnswerValue> =>
  Object.fromEntries(Array.from({ length: 24 }, (_, i) => [i + 1, fn(i)]));

type Case = {
  name: string;
  answers: Record<number, AnswerValue>;
  statutPro: StatutPro;
  expect: VerdictKey;
};

const cases: Case[] = [
  {
    name: "Tout à 2 (Oui fermes), salarié",
    answers: allAnswered(2),
    statutPro: "salarie",
    expect: "coince",
  },
  {
    name: "Tout à 0 (Non), salarié",
    answers: allAnswered(0),
    statutPro: "salarie",
    expect: "expansion",
  },
  {
    name: "Tout à 1 (Plutôt), salarié",
    answers: allAnswered(1),
    statutPro: "salarie",
    expect: "transition",
  },
  {
    name: "Ancrage haut, reste bas, salarié",
    answers: buildAnswers((i) => (i < 8 ? 2 : 0)),
    statutPro: "salarie",
    expect: "transition",
  },
  {
    name: "Circulation + Sens hauts, Ancrage bas, freelance",
    answers: buildAnswers((i) => (i < 8 ? 0 : 2)),
    statutPro: "freelance",
    expect: "epuise",
  },
  {
    name: "Sens + Ancrage hauts, patron-manager",
    answers: buildAnswers((i) => (i < 8 ? 1 : i < 16 ? 0 : 2)),
    statutPro: "patron-manager",
    expect: "perdu",
  },
];

let pass = 0;
let fail = 0;
for (const c of cases) {
  const res = computeDiagnostic(c.answers, c.statutPro);
  const ok = res.verdict === c.expect;
  console.log(
    `${ok ? "✓" : "✗"} ${c.name}`,
    `\n  scores: A=${res.scores.ancrage} C=${res.scores.circulation} S=${res.scores.sens}`,
    `\n  verdict: ${res.verdict} (attendu ${c.expect})`,
    `\n  modifiers: ${res.modifiers.join(", ") || "aucun"}`,
  );
  if (ok) pass++;
  else fail++;
}
console.log(`\n${pass}/${pass + fail} tests passés.`);
process.exit(fail === 0 ? 0 : 1);
