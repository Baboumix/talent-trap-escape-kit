import { NEED_IDS, DEEP, T } from "./translations";
import { PATTERNS, SOLUTIONS, EXPLANATIONS, CL_Q } from "./content";

export function getData(sat, imp) {
  return NEED_IDS.map((id) => ({
    id,
    sat: sat[id] || 3,
    imp: imp[id] || 2,
    gap: (imp[id] || 2) * (5 - (sat[id] || 3)),
  }));
}

export function getScore(sat, imp) {
  const d = getData(sat, imp);
  let tw = 0, mx = 0;
  d.forEach((n) => { tw += n.sat * n.imp; mx += 5 * n.imp; });
  return Math.round((tw / mx) * 100);
}

export function getVerdict(sat, imp, lang) {
  const sc = getScore(sat, imp);
  const d = getData(sat, imp);
  const t = T[lang];
  const essSuf = d.some((n) => n.imp === 3 && n.sat <= 2);
  const deepSuf = DEEP.some((id) => (sat[id] || 3) <= 2 && (imp[id] || 2) >= 2);
  if (essSuf || deepSuf || sc < 50) return { level: "trap", title: t.v_trap, sub: t.v_trap_sub, color: "#FE6B63" };
  if (sc < 72) return { level: "mis", title: t.v_mis, sub: t.v_mis_sub, color: "#FF8A54" };
  return { level: "ok", title: t.v_ok, sub: t.v_ok_sub, color: "#4ADE80" };
}

export function topGaps(sat, imp) {
  return getData(sat, imp).filter((n) => n.gap > 0).sort((a, b) => b.gap - a.gap).slice(0, 3);
}

export function topStrengths(sat, imp) {
  return getData(sat, imp).filter((n) => n.sat >= 4 && n.imp >= 2).sort((a, b) => b.sat * b.imp - a.sat * a.imp).slice(0, 2);
}

export function vigilanceNeeds(sat, imp) {
  return getData(sat, imp).filter((n) => n.sat === 3 || (n.sat === 4 && n.imp === 3)).slice(0, 2);
}

export function getPatterns(profile, sat, imp, lang) {
  const r = [];
  topGaps(sat, imp).forEach((n) => {
    const k = `${profile}-${n.id}`;
    if (PATTERNS[lang][k]) r.push(...PATTERNS[lang][k]);
  });
  return r.slice(0, 3);
}

export function getSolutions(profile, sat, imp, lang) {
  const r = [];
  topGaps(sat, imp).forEach((n) => {
    const k = `${profile}-${n.id}`;
    if (SOLUTIONS[lang][k]) r.push(...SOLUTIONS[lang][k]);
  });
  return r.slice(0, 3);
}

export function getClosingQuestion(profile, sat, imp, lang) {
  const tg = topGaps(sat, imp)[0];
  return tg ? CL_Q[lang][`${profile}-${tg.id}`] || "" : "";
}

export function getExplanation(profile, sat, imp, lang) {
  const v = getVerdict(sat, imp, lang);
  const lk = v.level === "trap" ? "trap" : v.level === "mis" ? "mis" : "ok";
  return EXPLANATIONS[lang][lk][profile];
}

// localStorage persistence
const STORAGE_KEY = "talent-trap-result";

export function saveResult(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, date: new Date().toISOString().split("T")[0] }));
  } catch { /* noop */ }
}

export function loadResult() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearResult() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
}
