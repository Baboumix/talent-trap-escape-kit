// ══════════════════════════════════════════
// Share Link — encode/decode profile data into URL
// Zero backend: profile data travels in the URL itself
// URL-safe base64 encoding of compact JSON
// ══════════════════════════════════════════

const VERSION = 1;

// Compact the profile data into minimal keys to keep URLs short
function compactProfile(progress, firstName, lang) {
  const d = { v: VERSION, n: firstName || "", l: lang || "fr" };

  if (progress.module1) {
    d.m1 = {
      s: progress.module1.signalCount,
      t: progress.module1.tensionProfile,
      a: progress.module1.archetype,
    };
    // Optionally include ratings (compact: array of 10 numbers)
    if (progress.module1.ratings) {
      const ids = ["sunday_anxiety", "boreout", "invisibility", "impostor", "physical", "retreat", "quiet_quit", "identity", "meaning", "cynicism"];
      d.m1.r = ids.map((id) => progress.module1.ratings[id] || 0);
    }
  }

  if (progress.module2) {
    d.m2 = {
      p: progress.module2.profile,
      sc: progress.module2.score,
      v: progress.module2.verdict,
    };
    if (progress.module2.sat && progress.module2.imp) {
      const needIds = ["stability", "stimulation", "recognition", "belonging", "growth", "impact"];
      d.m2.sa = needIds.map((id) => progress.module2.sat[id] || 0);
      d.m2.im = needIds.map((id) => progress.module2.imp[id] || 0);
    }
  }

  if (progress.module3?.reflections) {
    d.m3 = { r: progress.module3.reflections };
  }

  return d;
}

function expandProfile(compact) {
  if (!compact || compact.v !== VERSION) return null;

  const progress = { module1: null, module2: null, module3: null };
  const sigIds = ["sunday_anxiety", "boreout", "invisibility", "impostor", "physical", "retreat", "quiet_quit", "identity", "meaning", "cynicism"];
  const needIds = ["stability", "stimulation", "recognition", "belonging", "growth", "impact"];

  if (compact.m1) {
    progress.module1 = {
      signalCount: compact.m1.s,
      tensionProfile: compact.m1.t,
      archetype: compact.m1.a,
      ratings: compact.m1.r
        ? Object.fromEntries(sigIds.map((id, i) => [id, compact.m1.r[i] || 0]))
        : {},
    };
  }

  if (compact.m2) {
    progress.module2 = {
      profile: compact.m2.p,
      score: compact.m2.sc,
      verdict: compact.m2.v,
      sat: compact.m2.sa
        ? Object.fromEntries(needIds.map((id, i) => [id, compact.m2.sa[i] || 0]))
        : {},
      imp: compact.m2.im
        ? Object.fromEntries(needIds.map((id, i) => [id, compact.m2.im[i] || 0]))
        : {},
    };
  }

  if (compact.m3) {
    progress.module3 = { reflections: compact.m3.r || {} };
  }

  return {
    progress,
    firstName: compact.n || "",
    lang: compact.l || "fr",
  };
}

// URL-safe base64 (replaces +/= with -_. and removes padding)
function urlSafeEncode(str) {
  // Use TextEncoder + btoa to handle Unicode properly
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function urlSafeDecode(encoded) {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - encoded.length % 4) % 4);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

// ── Public API ──

export function encodeProfile(progress, firstName, lang) {
  const compact = compactProfile(progress, firstName, lang);
  const json = JSON.stringify(compact);
  return urlSafeEncode(json);
}

export function decodeProfile(encoded) {
  const json = urlSafeDecode(encoded);
  if (!json) return null;
  try {
    const compact = JSON.parse(json);
    return expandProfile(compact);
  } catch {
    return null;
  }
}

export function buildShareUrl(progress, firstName, lang) {
  const encoded = encodeProfile(progress, firstName, lang);
  const base = typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : "https://kit.monexpansion.com";
  return `${base}/p/${encoded}`;
}

export function buildResumeUrl(progress, firstName, lang) {
  const encoded = encodeProfile(progress, firstName, lang);
  const base = typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : "https://kit.monexpansion.com";
  return `${base}/resume/${encoded}`;
}

// Get encoded data from current URL path (returns null if not on /p/ or /resume/ route)
export function getSharedDataFromUrl() {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/p\/(.+)$/);
  if (!match) return null;
  return match[1];
}

export function getResumeDataFromUrl() {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/resume\/(.+)$/);
  if (!match) return null;
  return match[1];
}
