import { MODIFIERS, NEED_ORDER, QUESTIONS } from "./content";
import type {
  AnswerValue,
  DiagnosticResult,
  ModifierKey,
  Need,
  NeedScore,
  NeedScores,
  SatisfactionStatus,
  StatutPro,
  VerdictKey,
} from "./types";

const VERDICT_BY_NEED_AND_STATE: Record<
  Need,
  { sain: VerdictKey; piege: VerdictKey }
> = {
  certitude: { sain: "ancre", piege: "coince" },
  variete: { sain: "explorateur", piege: "disperse" },
  signifiance: { sain: "reconnu", piege: "egoique" },
  connexion: { sain: "connecte", piege: "loyal" },
  croissance: { sain: "expansion", piege: "epuise" },
  contribution: { sain: "service", piege: "perdu" },
};

function statusFromSatisfaction(satisfaction: number): SatisfactionStatus {
  if (satisfaction <= 1) return "verrouille";
  if (satisfaction === 2) return "sous-influence";
  return "satisfait";
}

/**
 * Per-need intensity (0-4) and satisfaction (0-4).
 * Intensity = sum of 2 intensity questions (raw 0-2 each).
 * Satisfaction = (positive question) + (2 - negative question), so 0-4.
 */
export function computeNeedScores(
  answers: Record<number, AnswerValue>,
): NeedScores {
  const init = (): NeedScore => ({
    intensity: 0,
    satisfaction: 0,
    status: "sous-influence",
  });
  const out: NeedScores = {
    certitude: init(),
    variete: init(),
    signifiance: init(),
    connexion: init(),
    croissance: init(),
    contribution: init(),
  };

  for (const q of QUESTIONS) {
    const v = answers[q.id] ?? 0;
    if (q.kind === "intensity") {
      out[q.need].intensity += v;
    } else if (q.kind === "satisfaction-positive") {
      out[q.need].satisfaction += v;
    } else {
      // satisfaction-negative: invert (Yes = compensation = unsatisfied)
      out[q.need].satisfaction += 2 - v;
    }
  }

  for (const n of NEED_ORDER) {
    out[n].status = statusFromSatisfaction(out[n].satisfaction);
  }
  return out;
}

/**
 * Top 3 needs by intensity, ties broken by NEED_ORDER.
 */
export function computeDominantNeeds(needScores: NeedScores): Need[] {
  return [...NEED_ORDER]
    .sort((a, b) => {
      const di = needScores[b].intensity - needScores[a].intensity;
      if (di !== 0) return di;
      return NEED_ORDER.indexOf(a) - NEED_ORDER.indexOf(b);
    })
    .slice(0, 3);
}

/**
 * Talent /10, weighted by intensity:
 *   sum(intensity_i * satisfaction_i) / sum(intensity_i * 4) * 10
 * Falls back to 5/10 if no need has any intensity (degenerate case).
 */
export function computeTalentScore(needScores: NeedScores): number {
  let weighted = 0;
  let total = 0;
  for (const n of NEED_ORDER) {
    const s = needScores[n];
    weighted += s.intensity * s.satisfaction;
    total += s.intensity * 4;
  }
  if (total === 0) return 5;
  return Math.round((weighted / total) * 10);
}

/**
 * Verdict decision:
 *   - if no need has intensity >= 3 → "suspendu" (no clearly dominant need)
 *   - else look at the top need (by intensity, NEED_ORDER ties):
 *       satisfaction >= 3 → sain verdict for that need
 *       satisfaction <= 1 → piège verdict for that need
 *       satisfaction == 2 → "transition"
 */
export function computeVerdict(
  needScores: NeedScores,
  _statutPro: StatutPro,
): VerdictKey {
  const dominants = computeDominantNeeds(needScores);
  const top = dominants[0];
  const topScore = needScores[top];
  if (topScore.intensity < 3) return "suspendu";
  if (topScore.satisfaction >= 3) return VERDICT_BY_NEED_AND_STATE[top].sain;
  if (topScore.satisfaction <= 1) return VERDICT_BY_NEED_AND_STATE[top].piege;
  return "transition";
}

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
  const needScores = computeNeedScores(answers);
  const dominantNeeds = computeDominantNeeds(needScores);
  const talentScore = computeTalentScore(needScores);
  const verdict = computeVerdict(needScores, statutPro);
  const modifiers = computeModifiers(answers, statutPro);
  return { needScores, dominantNeeds, talentScore, verdict, modifiers };
}

/**
 * Round-robin interleaving: cycles through the 6 needs in declaration order
 * for each question slot. With 4 questions per need (intensity, intensity,
 * sat+, sat-), the user sees intensity questions first, then satisfaction
 * questions, with the 6 needs alternating throughout.
 */
export function interleavedQuestions() {
  const byNeed: Record<Need, typeof QUESTIONS> = {
    certitude: [],
    variete: [],
    signifiance: [],
    connexion: [],
    croissance: [],
    contribution: [],
  };
  for (const q of QUESTIONS) {
    byNeed[q.need].push(q);
  }
  const out: typeof QUESTIONS = [];
  for (let i = 0; i < 4; i++) {
    for (const n of NEED_ORDER) {
      const q = byNeed[n][i];
      if (q) out.push(q);
    }
  }
  return out;
}
