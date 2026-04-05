// ══════════════════════════════════════════
// GA4 Analytics wrapper with Consent Mode v2
// ══════════════════════════════════════════
//
// Usage:
//   import { track, grantConsent, denyConsent, hasConsent } from "./lib/analytics";
//   track("module_completed", { module_num: 1, score: 7 });
//
// GA4 Measurement ID is set via env at build time: VITE_GA_MEASUREMENT_ID
// If unset, analytics becomes a no-op (safe for dev and preview).
// ══════════════════════════════════════════

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const CONSENT_KEY = "escape-kit-consent";

function isBrowser() {
  return typeof window !== "undefined";
}

// Push to dataLayer — creates it if not present
function push(...args) {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

// Load GA4 script once — called after consent is granted
let gaLoaded = false;
function loadGA() {
  if (gaLoaded || !GA_ID || !isBrowser()) return;
  gaLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  push("js", new Date());
  push("config", GA_ID, {
    send_page_view: false, // We'll send page_view manually with proper screen names
    anonymize_ip: true,
  });
}

// ── Consent API ──

export function hasConsent() {
  if (!isBrowser()) return false;
  return localStorage.getItem(CONSENT_KEY) === "granted";
}

export function consentStatus() {
  if (!isBrowser()) return "unknown";
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === "granted") return "granted";
  if (v === "denied") return "denied";
  return "unknown";
}

export function initConsent() {
  // Default to denied — will be upgraded when user clicks accept
  push("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
  // Load GA4 with denied state — GA respects consent and won't set cookies
  loadGA();

  // If user previously granted, upgrade
  if (hasConsent()) {
    push("consent", "update", { analytics_storage: "granted" });
  }
}

export function grantConsent() {
  if (!isBrowser()) return;
  localStorage.setItem(CONSENT_KEY, "granted");
  push("consent", "update", { analytics_storage: "granted" });
  loadGA();
}

export function denyConsent() {
  if (!isBrowser()) return;
  localStorage.setItem(CONSENT_KEY, "denied");
  push("consent", "update", { analytics_storage: "denied" });
}

// ── Event tracking ──

export function track(eventName, params = {}) {
  if (!isBrowser()) return;
  push("event", eventName, params);
}

export function trackPageView(screenName, extra = {}) {
  track("page_view", {
    page_title: `Escape Kit · ${screenName}`,
    page_location: window.location.href,
    screen_name: screenName,
    ...extra,
  });
}

export function trackModuleStarted(moduleNum) {
  track("module_started", { module_num: moduleNum });
}

export function trackModuleCompleted(moduleNum, data) {
  track("module_completed", {
    module_num: moduleNum,
    ...data,
  });
}

export function trackEmailSubmitted(moduleNum, lang) {
  track("email_submitted", { module_num: moduleNum, lang });
}

export function trackCtaClick(destination, location) {
  track("cta_click", { destination, location });
}

export function trackLanguageChanged(from, to) {
  track("language_changed", { from, to });
}
