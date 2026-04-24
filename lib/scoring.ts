import { MODIFIERS, QUESTIONS } from "./content";
import type {
  AnswerValue,
  DiagnosticResult,
  ModifierKey,
  Scores,
  StatutPro,
  VerdictKey,
} from "./types";

/**
 * Sum raw scores per dimension. Unanswered questions count as 0.
 */
export function computeScores(
  answers: Record<number, AnswerValue>,
): Scores {
  const scores: Scores = { ancrage: 0, circulation: 0, sens: 0 };
  for (const q of QUESTIONS) {
    const v = answers[q.id] ?? 0;
    scores[q.dimension] += v;
  }
  return scores;
}

/**
 * Apply the verdict decision tree.
 * Order matters — first match wins.
 */
export function computeVerdict(
  scores: Scores,
  statutPro: StatutPro,
): VerdictKey {
  const { ancrage, circulation, sens } = scores;

  if (ancrage >= 10 && (circulation >= 8 || sens >= 8)) {
    return "coince";
  }
  if (circulation >= 10 && sens >= 8 && ancrage < 10) {
    return "epuise";
  }
  if (
    sens >= 10 &&
    ancrage >= 8 &&
    statutPro === "patron-manager"
  ) {
    return "perdu";
  }
  const allMid =
    ancrage >= 6 &&
    ancrage <= 10 &&
    circulation >= 6 &&
    circulation <= 10 &&
    sens >= 6 &&
    sens <= 10;
  if (allMid) return "transition";

  const allLow = ancrage <= 5 && circulation <= 5 && sens <= 5;
  if (allLow) return "expansion";

  return "transition";
}

/**
 * Evaluate all 8 modifiers against the answers + statut.
 * Returns the list of triggered modifier keys in declaration order.
 */
export function computeModifiers(
  answers: Record<number, AnswerValue>,
  statutPro: StatutPro,
): ModifierKey[] {
  const keys: ModifierKey[] = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"];
  return keys.filter((k) => MODIFIERS[k].trigger(answers, statutPro));
}

export function computeDiagnostic(
  answers: Record<number, AnswerValue>,
  statutPro: StatutPro,
): DiagnosticResult {
  const scores = computeScores(answers);
  const verdict = computeVerdict(scores, statutPro);
  const modifiers = computeModifiers(answers, statutPro);
  return { scores, verdict, modifiers };
}

/**
 * Deterministic shuffle so the question order stays stable across renders
 * for a given seed (used to interleave dimensions without randomness
 * changing every reload).
 */
export function interleavedQuestions() {
  // Round-robin: a1, c1, s1, a2, c2, s2, …
  const ancrage = QUESTIONS.filter((q) => q.dimension === "ancrage");
  const circulation = QUESTIONS.filter((q) => q.dimension === "circulation");
  const sens = QUESTIONS.filter((q) => q.dimension === "sens");
  const out: typeof QUESTIONS = [];
  for (let i = 0; i < 8; i++) {
    if (ancrage[i]) out.push(ancrage[i]);
    if (circulation[i]) out.push(circulation[i]);
    if (sens[i]) out.push(sens[i]);
  }
  return out;
}
