import { useState, useEffect } from "react";
import { COLORS, FONT, styles, fadeStyle } from "./components/SharedStyles";
import { T } from "./data/translations";
import { NEEDS, NEED_IDS, NEED_ACCENTS } from "./data/needs";
import { allAnswered, loadProgress, saveProgress, clearProgress, purgeLegacyKeys } from "./data/scoring";
import {
  getSharedDataFromUrl,
  getResumeDataFromUrl,
  decodeProfile,
  buildShareUrl,
} from "./lib/shareLink";
import { initConsent, trackPageView, trackLanguageChanged, track } from "./lib/analytics";

import Disclaimer from "./components/Disclaimer";
import Quiz from "./components/Quiz";
import EmailGate from "./components/EmailGate";
import Results from "./components/Results";
import SharedView from "./components/SharedView";
import ShareModal from "./components/ShareModal";
import CookieBanner from "./components/CookieBanner";
import PrivacyModal from "./components/PrivacyModal";

// Purge legacy localStorage once at module load (before React mounts).
purgeLegacyKeys();

// Shared / Resume URL parsing — runs once.
const sharedProfileData = (() => {
  const encoded = getSharedDataFromUrl();
  return encoded ? decodeProfile(encoded) : null;
})();

const resumeData = (() => {
  const encoded = getResumeDataFromUrl();
  return encoded ? decodeProfile(encoded) : null;
})();

// Screen state machine:
//   welcome → disclaimer → quiz → gate → results
// If email already captured (resumed or just submitted), gate is skipped.

export default function App() {
  const [lang, setLang] = useState(
    sharedProfileData?.lang || resumeData?.lang || "fr"
  );
  const [screen, setScreen] = useState(resumeData ? "results" : "welcome");
  const [answers, setAnswers] = useState(resumeData?.answers || {});
  const [userData, setUserData] = useState(
    resumeData
      ? { email: null, firstName: resumeData.firstName }
      : { email: null, firstName: null }
  );
  const [hydrated, setHydrated] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // ─── Shared profile view (read-only) ───
  if (sharedProfileData) {
    return (
      <div
        style={{
          background: COLORS.bg,
          color: COLORS.textPrimary,
          fontFamily: FONT,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <SharedView data={sharedProfileData} />
        <button
          onClick={() => setShowPrivacy(true)}
          style={{
            position: "fixed",
            bottom: "8px",
            left: "12px",
            zIndex: 90,
            background: "transparent",
            border: "none",
            color: COLORS.textMuted,
            fontSize: "10px",
            cursor: "pointer",
            fontFamily: FONT,
            textDecoration: "underline",
            padding: "4px 8px",
            opacity: 0.6,
          }}
        >
          {sharedProfileData.lang === "en" ? "Privacy" : "Confidentialité"}
        </button>
        {showPrivacy && (
          <PrivacyModal
            lang={sharedProfileData.lang}
            onClose={() => setShowPrivacy(false)}
          />
        )}
      </div>
    );
  }

  // ─── Load saved progress ───
  useEffect(() => {
    if (resumeData) {
      // Clean URL after resume (remove /resume/...)
      window.history.replaceState(null, "", "/");
      setHydrated(true);
      return;
    }
    const saved = loadProgress();
    if (saved) {
      if (saved.answers) setAnswers(saved.answers);
      if (saved.userData) setUserData(saved.userData);
      if (saved.lang) setLang(saved.lang);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist progress.
  useEffect(() => {
    if (!hydrated) return;
    saveProgress({ answers, userData, lang });
  }, [answers, userData, lang, hydrated]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    initConsent();
  }, []);

  useEffect(() => {
    const handler = () => setShowPrivacy(true);
    window.addEventListener("show-privacy", handler);
    return () => window.removeEventListener("show-privacy", handler);
  }, []);

  useEffect(() => {
    trackPageView(screen, { lang });
  }, [screen, lang]);

  const goScreen = (s) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  const handleLangChange = (newLang) => {
    if (newLang === lang) return;
    trackLanguageChanged(lang, newLang);
    setLang(newLang);
  };

  const handleReset = () => {
    setAnswers({});
    setUserData({ email: null, firstName: null });
    clearProgress();
    setScreen("welcome");
  };

  const handleQuizComplete = (finalAnswers) => {
    setAnswers(finalAnswers);
    track("quiz_completed", { total: Object.keys(finalAnswers).length });
    // If email already captured, skip gate.
    goScreen(userData.email ? "results" : "gate");
  };

  const handleEmailUnlock = ({ email, firstName }) => {
    setUserData({ email, firstName });
    track("email_captured");
    goScreen("results");
  };

  const hasProgress = Object.keys(answers).length > 0;
  const finished = allAnswered(answers);

  const t = T[lang];

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.textPrimary,
        fontFamily: FONT,
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* ── Top bar RIGHT: Share + Language switch ── */}
      <div
        style={{
          position: "fixed",
          top: 12,
          right: 20,
          zIndex: 200,
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {finished && (
          <button
            onClick={() => {
              track("share_opened", { location: "topbar" });
              setShowShare(true);
            }}
            title={lang === "fr" ? "Partager mon top 3" : "Share my top 3"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: `${COLORS.coral}18`,
              color: COLORS.coral,
              border: `1px solid ${COLORS.coral}40`,
              borderRadius: "8px",
              padding: "4px 10px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${COLORS.coral}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${COLORS.coral}18`;
            }}
          >
            <span style={{ fontSize: "13px" }}>🔗</span>
            <span className="share-label">
              {lang === "fr" ? "Partager" : "Share"}
            </span>
          </button>
        )}

        <div style={{ display: "flex", gap: "4px" }}>
          {["fr", "en"].map((l) => (
            <button
              key={l}
              onClick={() => handleLangChange(l)}
              style={{
                background: lang === l ? COLORS.coral : "transparent",
                color: lang === l ? "#fff" : COLORS.textMuted,
                border: `1px solid ${lang === l ? COLORS.coral : COLORS.border}`,
                borderRadius: "8px",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: FONT,
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── WELCOME ── */}
      {screen === "welcome" && (
        <div
          style={{
            ...styles.pageTop,
            ...fadeStyle(true),
            paddingTop: "80px",
          }}
        >
          <div style={{ maxWidth: 640, textAlign: "center" }}>
            {/* Brand */}
            <div style={{ ...styles.surtitre, marginBottom: "16px" }}>
              {t.brand}
            </div>

            {/* Hero */}
            <h1
              style={{
                fontSize: "clamp(36px,8vw,56px)",
                fontWeight: 800,
                color: COLORS.textPrimary,
                lineHeight: 1.1,
                margin: "0 0 16px",
                fontFamily: FONT,
              }}
            >
              {t.hero_h1_a}
              <span
                style={{
                  background: COLORS.coralGradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.hero_h1_b}
              </span>
            </h1>
            <p
              style={{
                fontSize: "17px",
                color: COLORS.textSecondary,
                margin: "0 0 32px",
                lineHeight: 1.6,
              }}
            >
              {t.hero_sub}
            </p>

            {hasProgress && !finished ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "40px",
                }}
              >
                <button
                  style={styles.btn}
                  onClick={() => goScreen("quiz")}
                >
                  {t.hero_continue}
                </button>
                <button style={styles.btnGhost} onClick={handleReset}>
                  {t.hero_restart}
                </button>
              </div>
            ) : finished ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "40px",
                }}
              >
                <button
                  style={styles.btn}
                  onClick={() =>
                    goScreen(userData.email ? "results" : "gate")
                  }
                >
                  {lang === "fr" ? "Voir mon résultat →" : "See my result →"}
                </button>
                <button style={styles.btnGhost} onClick={handleReset}>
                  {t.hero_restart}
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: "40px" }}>
                <button style={styles.btn} onClick={() => goScreen("disclaimer")}>
                  {t.hero_cta}
                </button>
                <p
                  style={{
                    fontSize: "12px",
                    color: COLORS.textMuted,
                    marginTop: "20px",
                  }}
                >
                  {t.hero_resumed}
                </p>
              </div>
            )}

            {/* ─── Context section ─── */}
            <div style={{ marginTop: "24px", textAlign: "left" }}>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: COLORS.textPrimary,
                  margin: "0 0 8px",
                  fontFamily: FONT,
                  textAlign: "center",
                }}
              >
                {t.context_title}
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: COLORS.textTertiary,
                  lineHeight: 1.6,
                  margin: "0 0 20px",
                  textAlign: "center",
                }}
              >
                {t.context_intro}
              </p>

              {/* Tiles grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {NEED_IDS.map((id) => {
                  const d = NEEDS[id][lang];
                  const a = NEED_ACCENTS[id];
                  return (
                    <div
                      key={id}
                      style={{
                        background: `linear-gradient(135deg, ${a.color}14, ${a.color}06)`,
                        border: `1px solid ${a.color}38`,
                        borderRadius: "14px",
                        padding: "14px 14px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "20px",
                          lineHeight: 1,
                        }}
                      >
                        {a.emoji}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                          color: COLORS.textPrimary,
                          fontFamily: FONT,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {d.name}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: COLORS.textSecondary,
                          lineHeight: 1.45,
                        }}
                      >
                        {d.short}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p
                style={{
                  fontSize: "13px",
                  color: COLORS.textSecondary,
                  lineHeight: 1.65,
                  margin: 0,
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                {t.context_body}
              </p>
            </div>

            {/* Credits */}
            <p
              style={{
                fontSize: "11px",
                color: COLORS.textMuted,
                margin: "24px 0 0",
                lineHeight: 1.6,
              }}
            >
              {t.footer_credit}
              <br />
              {t.footer_author}
            </p>
          </div>
        </div>
      )}

      {/* ── DISCLAIMER ── */}
      {screen === "disclaimer" && (
        <Disclaimer
          lang={lang}
          onAccept={() => goScreen("quiz")}
          onBack={() => goScreen("welcome")}
        />
      )}

      {/* ── QUIZ ── */}
      {screen === "quiz" && (
        <Quiz
          lang={lang}
          savedAnswers={answers}
          onComplete={handleQuizComplete}
          onBack={() => goScreen("disclaimer")}
        />
      )}

      {/* ── EMAIL GATE (blurred) ── */}
      {screen === "gate" && (
        <div style={{ position: "relative", minHeight: "100vh" }}>
          {/* Blurred preview of results */}
          <div
            style={{
              filter: "blur(8px)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <Results
              lang={lang}
              answers={answers}
              firstName=""
              onBack={() => {}}
            />
          </div>
          <EmailGate
            lang={lang}
            answers={answers}
            onUnlock={handleEmailUnlock}
          />
        </div>
      )}

      {/* ── RESULTS ── */}
      {screen === "results" && (
        <Results
          lang={lang}
          answers={answers}
          firstName={userData.firstName}
          onBack={() => goScreen("welcome")}
        />
      )}

      {/* Cookie Banner */}
      <CookieBanner lang={lang} />

      {/* Privacy footer link */}
      <button
        onClick={() => setShowPrivacy(true)}
        style={{
          position: "fixed",
          bottom: "8px",
          left: "12px",
          zIndex: 90,
          background: "transparent",
          border: "none",
          color: COLORS.textMuted,
          fontSize: "10px",
          cursor: "pointer",
          fontFamily: FONT,
          textDecoration: "underline",
          padding: "4px 8px",
          opacity: 0.6,
        }}
      >
        {lang === "fr" ? "Confidentialité" : "Privacy"}
      </button>

      {showPrivacy && (
        <PrivacyModal lang={lang} onClose={() => setShowPrivacy(false)} />
      )}

      {showShare && (
        <ShareModal
          lang={lang}
          url={buildShareUrl(answers, userData.firstName, lang)}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
