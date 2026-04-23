import { QUESTIONS, ANSWER_VALUES } from "./questions";
import { NEED_IDS } from "./needs";

// answers: { [questionId:number]: "yes" | "partly" | "no" }
export function scoreAnswers(answers) {
  const scores = Object.fromEntries(NEED_IDS.map((id) => [id, 0]));
  QUESTIONS.forEach((q) => {
    const v = answers?.[q.id];
    if (!v) return;
    scores[q.need] += ANSWER_VALUES[v] ?? 0;
  });
  return scores;
}

// Returns all 6 needs sorted by score descending: [{ id, score }]
export function rankedNeeds(answers) {
  const scores = scoreAnswers(answers);
  const order = Object.fromEntries(NEED_IDS.map((id, i) => [id, i]));
  return NEED_IDS
    .map((id) => ({ id, score: scores[id] }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return order[a.id] - order[b.id]; // stable tie-break by declaration order
    });
}

export function topThree(answers) {
  return rankedNeeds(answers).slice(0, 3);
}

export function allAnswered(answers) {
  return QUESTIONS.every((q) => !!answers?.[q.id]);
}

// localStorage
const STORAGE_KEY = "auto-coach-kit-progress";

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* noop */
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

// Purge legacy Talent Trap keys on first load (one-shot)
export function purgeLegacyKeys() {
  const legacy = [
    "escape-kit-progress",
    "escape-kit-m3-reflections",
    "talent-trap-result",
  ];
  legacy.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      /* noop */
    }
  });
}
