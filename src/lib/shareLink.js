// Share Link — encode/decode Auto-Coach Kit quiz answers into URL.
// Zero backend: data travels in the URL itself (URL-safe base64 of compact JSON).

import { QUESTIONS } from "../data/questions";

const VERSION = 2; // bump: v1 was Talent Trap schema (modules), v2 is Auto-Coach (answers)
const ANSWER_CODES = { yes: 2, partly: 1, no: 0 };
const ANSWER_DECODE = { 2: "yes", 1: "partly", 0: "no" };

function compactAnswers(answers) {
  // Preserve question order from QUESTIONS list; "_" = unanswered (should not happen
  // for a completed quiz, but we keep positions aligned).
  return QUESTIONS.map((q) => {
    const v = answers?.[q.id];
    return v === undefined ? "_" : String(ANSWER_CODES[v]);
  }).join("");
}

function expandAnswers(str) {
  if (typeof str !== "string") return {};
  const out = {};
  QUESTIONS.forEach((q, i) => {
    const ch = str[i];
    if (ch === "_" || ch === undefined) return;
    const decoded = ANSWER_DECODE[parseInt(ch, 10)];
    if (decoded) out[q.id] = decoded;
  });
  return out;
}

function urlSafeEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function urlSafeDecode(encoded) {
  try {
    const base64 =
      encoded.replace(/-/g, "+").replace(/_/g, "/") +
      "=".repeat((4 - (encoded.length % 4)) % 4);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export function encodeProfile(answers, firstName, lang) {
  const compact = {
    v: VERSION,
    n: firstName || "",
    l: lang || "fr",
    a: compactAnswers(answers || {}),
  };
  return urlSafeEncode(JSON.stringify(compact));
}

export function decodeProfile(encoded) {
  const json = urlSafeDecode(encoded);
  if (!json) return null;
  try {
    const compact = JSON.parse(json);
    if (compact.v !== VERSION) return null;
    return {
      answers: expandAnswers(compact.a),
      firstName: compact.n || "",
      lang: compact.l || "fr",
    };
  } catch {
    return null;
  }
}

function baseUrl() {
  return typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : "https://kit.monexpansion.com";
}

export function buildShareUrl(answers, firstName, lang) {
  return `${baseUrl()}/p/${encodeProfile(answers, firstName, lang)}`;
}

export function buildResumeUrl(answers, firstName, lang) {
  return `${baseUrl()}/resume/${encodeProfile(answers, firstName, lang)}`;
}

export function getSharedDataFromUrl() {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/p\/(.+)$/);
  return match ? match[1] : null;
}

export function getResumeDataFromUrl() {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/resume\/(.+)$/);
  return match ? match[1] : null;
}
