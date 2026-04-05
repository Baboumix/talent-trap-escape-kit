import { useState, useEffect, useCallback } from "react";
import { COLORS, FONT, styles, fadeStyle } from "./components/SharedStyles";
import ModuleHub from "./components/ModuleHub";
import Module1 from "./components/Module1";
import Module2 from "./components/Module2";
import Module3 from "./components/Module3";
import Results from "./components/Results";
import CookieBanner from "./components/CookieBanner";
import PrivacyModal from "./components/PrivacyModal";
import SharedView from "./components/SharedView";
import ShareModal from "./components/ShareModal";
import { initConsent, trackPageView, trackModuleStarted, trackModuleCompleted, trackLanguageChanged, track } from "./lib/analytics";
import { getSharedDataFromUrl, decodeProfile, buildShareUrl } from "./lib/shareLink";

const LS_KEY = "escape-kit-progress";

function loadProgress() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveProgressToLS(p) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch { /* noop */ }
}

const WELCOME_TEXT = {
  fr: {
    surtitre: "TALENT TRAP ESCAPE KIT",
    h1_1: "Ton talent te ",
    h1_prop: "propulse",
    h1_2: " ou te ",
    h1_piege: "pi\u00e8ge",
    h1_q: " ?",
    sub: "3 modules pour diagnostiquer, cartographier et trouver ta direction.",
    cta: "Faire mon check-up \u2192",
    continue_cta: "Continuer mon parcours \u2192",
    restart: "Recommencer \u00e0 z\u00e9ro",
    footer: "Bas\u00e9 sur les Six Besoins Humains Essentiels \u00b7 Robbins-Madanes Training",
    footer2: "Julien Klein \u00b7 Coach certifi\u00e9 RMT \u00b7 monexpansion.com",
  },
  en: {
    surtitre: "TALENT TRAP ESCAPE KIT",
    h1_1: "Is your talent ",
    h1_prop: "propelling",
    h1_2: " you or ",
    h1_piege: "trapping",
    h1_q: " you?",
    sub: "3 modules to diagnose, map, and find your direction.",
    cta: "Take the check-up \u2192",
    continue_cta: "Continue my journey \u2192",
    restart: "Start over",
    footer: "Based on the Six Core Human Needs \u00b7 Robbins-Madanes Training",
    footer2: "Julien Klein \u00b7 RMT Certified Coach \u00b7 monexpansion.com",
  },
};

// Check for shared profile URL at module load (before React mounts)
const sharedProfileData = (() => {
  const encoded = getSharedDataFromUrl();
  return encoded ? decodeProfile(encoded) : null;
})();

export default function App() {
  const [lang, setLang] = useState(sharedProfileData?.lang || "fr");
  const [screen, setScreen] = useState("welcome");
  const [progress, setProgress] = useState({ module1: null, module2: null, module3: null });
  const [userData, setUserData] = useState({ email: null, firstName: null });
  const [hydrated, setHydrated] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // If we're viewing a shared profile, render that view in isolation
  if (sharedProfileData) {
    return (
      <div style={{ background: COLORS.bg, color: COLORS.textPrimary, fontFamily: FONT, minHeight: "100vh", position: "relative" }}>
        <SharedView data={sharedProfileData} />
        <button
          onClick={() => setShowPrivacy(true)}
          style={{
            position: "fixed", bottom: "8px", left: "12px", zIndex: 90,
            background: "transparent", border: "none",
            color: COLORS.textMuted, fontSize: "10px",
            cursor: "pointer", fontFamily: FONT,
            textDecoration: "underline", padding: "4px 8px", opacity: 0.6,
          }}
        >
          {sharedProfileData.lang === "en" ? "Privacy" : "Confidentialité"}
        </button>
        {showPrivacy && <PrivacyModal lang={sharedProfileData.lang} onClose={() => setShowPrivacy(false)} />}
      </div>
    );
  }

  // Load saved progress on mount
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setProgress(saved.progress || { module1: null, module2: null, module3: null });
      if (saved.userData) setUserData(saved.userData);
      if (saved.lang) setLang(saved.lang);
    }
    setHydrated(true);
  }, []);

  // Save progress whenever it changes — but only after hydration
  useEffect(() => {
    if (!hydrated) return;
    saveProgressToLS({ progress, userData, lang });
  }, [progress, userData, lang, hydrated]);

  // Keep <html lang> in sync with current language
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Initialize GA4 Consent Mode on first mount
  useEffect(() => { initConsent(); }, []);

  // Listen for "show privacy" events from any component
  useEffect(() => {
    const handler = () => setShowPrivacy(true);
    window.addEventListener("show-privacy", handler);
    return () => window.removeEventListener("show-privacy", handler);
  }, []);

  // Track page view on screen change
  useEffect(() => { trackPageView(screen, { lang }); }, [screen, lang]);

  // Simple screen transition — modules handle their own fade internally
  const goScreen = (s) => { setScreen(s); window.scrollTo(0, 0); };

  const hasSomeProgress = progress.module1 || progress.module2 || progress.module3;
  const completedModules = [progress.module1, progress.module2, progress.module3].filter(Boolean).length;

  // ── Module completion handlers ──

  const handleModule1Complete = useCallback((data, navigate) => {
    if (data.email) {
      setUserData((prev) => ({ ...prev, email: data.email, firstName: data.firstName }));
    }
    const moduleData = {
      ratings: data.ratings,
      signalCount: data.signalCount,
      tensionProfile: data.tensionProfile,
      archetype: data.archetype,
    };
    setProgress((prev) => ({ ...prev, module1: moduleData }));
    trackModuleCompleted(1, { signal_count: data.signalCount, tension_profile: data.tensionProfile, archetype: data.archetype });
    if (navigate) {
      goScreen("hub");
    }
  }, []);

  const handleModule2Complete = useCallback((data, navigate) => {
    setProgress((prev) => ({ ...prev, module2: data }));
    trackModuleCompleted(2, { score: data.score, verdict: data.verdict, profile: data.profile });
    if (navigate) {
      goScreen("hub");
    }
  }, []);

  const handleModule3Complete = useCallback((data, navigate) => {
    setProgress((prev) => ({ ...prev, module3: data }));
    trackModuleCompleted(3, {});
    if (navigate) {
      // Module 3 is the last one — go directly to the full Results page
      goScreen("results");
    }
  }, []);

  const goToHub = () => goScreen("hub");

  const handleSelectModule = (num) => {
    trackModuleStarted(num);
    goScreen(`module${num}`);
  };

  const handleLangChange = (newLang) => {
    if (newLang === lang) return;
    trackLanguageChanged(lang, newLang);
    setLang(newLang);
  };

  const handleReset = () => {
    setProgress({ module1: null, module2: null, module3: null });
    setUserData({ email: null, firstName: null });
    try { localStorage.removeItem(LS_KEY); } catch { /* noop */ }
    try { localStorage.removeItem("escape-kit-m3-reflections"); } catch { /* noop */ }
    try { localStorage.removeItem("talent-trap-result"); } catch { /* noop */ }
    setScreen("welcome");
  };

  const tw = WELCOME_TEXT[lang];

  return (
    <div style={{ background: COLORS.bg, color: COLORS.textPrimary, fontFamily: FONT, minHeight: "100vh", position: "relative" }}>

      {/* ── Top bar LEFT: Parcours button (not on welcome) ── */}
      {screen !== "welcome" && (
        <div style={{ position: "fixed", top: 12, left: 20, zIndex: 200 }}>
          <button
            onClick={goToHub}
            title={lang === "fr" ? "Retour au parcours" : "Back to journey"}
            aria-label={lang === "fr" ? "Retour au parcours" : "Back to journey"}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: screen === "hub" ? `${COLORS.coral}18` : "transparent",
              color: screen === "hub" ? COLORS.coral : COLORS.textSecondary,
              border: `1px solid ${screen === "hub" ? `${COLORS.coral}40` : COLORS.border}`,
              borderRadius: "8px", padding: "4px 10px", fontSize: "12px",
              fontWeight: 600, cursor: "pointer", fontFamily: FONT,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (screen !== "hub") {
                e.currentTarget.style.background = `${COLORS.coral}12`;
                e.currentTarget.style.color = COLORS.coral;
                e.currentTarget.style.borderColor = `${COLORS.coral}40`;
              }
            }}
            onMouseLeave={(e) => {
              if (screen !== "hub") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = COLORS.textSecondary;
                e.currentTarget.style.borderColor = COLORS.border;
              }
            }}
          >
            <span style={{ fontSize: "13px" }}>🎯</span>
            <span className="share-label">
              {lang === "fr" ? "Parcours" : "Journey"}
            </span>
          </button>
        </div>
      )}

      {/* ── Top bar RIGHT: Share + Language switch ── */}
      <div style={{ position: "fixed", top: 12, right: 20, zIndex: 200, display: "flex", gap: "8px", alignItems: "center" }}>
        {/* Share button — visible when Module 1 is complete */}
        {progress.module1 && (
          <button
            onClick={() => { track("share_opened", { location: "topbar" }); setShowShare(true); }}
            title={lang === "fr" ? "Partager mon profil" : "Share my profile"}
            aria-label={lang === "fr" ? "Partager mon profil" : "Share my profile"}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: `${COLORS.coral}18`,
              color: COLORS.coral,
              border: `1px solid ${COLORS.coral}40`,
              borderRadius: "8px", padding: "4px 10px", fontSize: "12px",
              fontWeight: 600, cursor: "pointer", fontFamily: FONT,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${COLORS.coral}30`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${COLORS.coral}18`; }}
          >
            <span style={{ fontSize: "13px" }}>🔗</span>
            <span style={{ display: "inline-block" }} className="share-label">
              {lang === "fr" ? "Partager" : "Share"}
            </span>
          </button>
        )}

        {/* Language switch */}
        <div style={{ display: "flex", gap: "4px" }}>
          {["fr", "en"].map((l) => (
            <button key={l}
              onClick={() => handleLangChange(l)}
              style={{
                background: lang === l ? COLORS.coral : "transparent",
                color: lang === l ? "#fff" : COLORS.textMuted,
                border: `1px solid ${lang === l ? COLORS.coral : COLORS.border}`,
                borderRadius: "8px", padding: "4px 10px", fontSize: "12px",
                fontWeight: 700, cursor: "pointer", fontFamily: FONT,
                textTransform: "uppercase", transition: "all 0.2s",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── Global progress bar ── */}
      {screen !== "welcome" && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 150, height: "3px", background: "#1a1a1a" }}>
          <div style={{
            height: "100%",
            width: `${(completedModules / 3) * 100}%`,
            background: COLORS.coralGradient,
            transition: "width 0.5s ease",
            borderRadius: "0 2px 2px 0",
          }} />
        </div>
      )}

      {/* ── WELCOME ── */}
      {screen === "welcome" && (
        <div style={{ ...styles.page, ...fadeStyle(true) }}>
          <div style={{ maxWidth: 560, textAlign: "center" }}>
            <div style={{ ...styles.surtitre, marginBottom: "16px" }}>{tw.surtitre}</div>
            <h1 style={{ fontSize: "clamp(32px,8vw,52px)", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.1, margin: "0 0 16px", fontFamily: FONT }}>
              {tw.h1_1}
              <span style={{ background: COLORS.coralGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {tw.h1_prop}
              </span>
              {tw.h1_2}
              <span style={{ background: COLORS.coralGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {tw.h1_piege}
              </span>
              {tw.h1_q}
            </h1>
            <p style={{ fontSize: "16px", color: COLORS.textSecondary, margin: "0 0 32px", lineHeight: 1.6 }}>{tw.sub}</p>

            {hasSomeProgress ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
                <button style={styles.btn} onClick={goToHub}>
                  {tw.continue_cta}
                </button>
                <button style={styles.btnGhost} onClick={handleReset}>
                  {tw.restart}
                </button>
              </div>
            ) : (
              <button style={styles.btn} onClick={goToHub}>
                {tw.cta}
              </button>
            )}

            <p style={{ fontSize: "12px", color: COLORS.textMuted, marginTop: "48px", lineHeight: 1.5 }}>
              {tw.footer}<br />{tw.footer2}
            </p>
          </div>
        </div>
      )}

      {/* ── HUB ── */}
      {screen === "hub" && (
        <ModuleHub
          lang={lang}
          progress={progress}
          onSelectModule={handleSelectModule}
          onViewResults={() => goScreen("results")}
        />
      )}

      {/* ── MODULE 1 ── */}
      {screen === "module1" && (
        <Module1
          lang={lang}
          savedData={progress.module1}
          onComplete={handleModule1Complete}
          onBack={goToHub}
        />
      )}

      {/* ── MODULE 2 ── */}
      {screen === "module2" && (
        <Module2
          lang={lang}
          savedData={progress.module2}
          module1Data={progress.module1}
          userData={userData}
          onComplete={handleModule2Complete}
          onBack={goToHub}
        />
      )}

      {/* ── MODULE 3 ── */}
      {screen === "module3" && (
        <Module3
          lang={lang}
          savedData={progress.module3}
          module1Data={progress.module1}
          module2Data={progress.module2}
          userData={userData}
          onComplete={handleModule3Complete}
          onBack={goToHub}
        />
      )}

      {/* ── RESULTS ── */}
      {screen === "results" && (
        <Results lang={lang} progress={progress} firstName={userData.firstName} onBack={goToHub} />
      )}

      {/* Cookie Banner (Loi 25 / Consent Mode v2) */}
      <CookieBanner lang={lang} />

      {/* Privacy footer link (always visible) */}
      <button
        onClick={() => setShowPrivacy(true)}
        style={{
          position: "fixed", bottom: "8px", left: "12px", zIndex: 90,
          background: "transparent", border: "none",
          color: COLORS.textMuted, fontSize: "10px",
          cursor: "pointer", fontFamily: FONT,
          textDecoration: "underline", padding: "4px 8px",
          opacity: 0.6,
        }}
      >
        {lang === "fr" ? "Confidentialité" : "Privacy"}
      </button>

      {/* Privacy Modal */}
      {showPrivacy && <PrivacyModal lang={lang} onClose={() => setShowPrivacy(false)} />}

      {/* Share Modal (global, accessible from top bar) */}
      {showShare && (
        <ShareModal
          lang={lang}
          url={buildShareUrl(progress, userData.firstName, lang)}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
