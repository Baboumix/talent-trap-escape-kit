import { useState, useEffect } from "react";
import { COLORS, FONT, styles, fadeStyle } from "./SharedStyles";
import { SIGNALS, SIGNAL_LABELS, getTensionProfile, getDominantArchetype, getTopSignals, getSignalCount } from "../data/signals";
import EmailGate from "./EmailGate";
import ConfirmModal from "./ConfirmModal";

const M1_TEXT = {
  fr: {
    intro_sur: "MODULE 1",
    intro_title: "Le Miroir",
    intro_sub: "5 minutes pour savoir si ton talent te piège.",
    intro_hook: "Le piège ne crie pas. Il chuchote. Il se manifeste dans les petites choses.",
    intro_cta: "Commencer →",
    back: "← Retour",
    signal_q: "Tu te reconnais ?",
    next: "Signal suivant →",
    see_result: "Voir mon profil →",
    result_label: "TON PROFIL DE TENSION",
    signals_detected: "signaux détectés sur 10",
    archetype_label: "TON ARCHÉTYPE",
    top_signals: "Tes signaux les plus forts",
    next_module: "Découvrir pourquoi →",
    next_module_sub: "Module 2 : cartographie les besoins qui te retiennent.",
    next_module_later: "Me l'envoyer dans 2 jours",
    book_cta: "Approfondir avec le livre →",
    book_sub: "Les 10 signaux expliqués en profondeur, avec les histoires complètes de Hong, Sofia et Emma.",
    email_sent: "✉️ Ton résultat vient d'être envoyé sur ton email.",
  },
  en: {
    intro_sur: "MODULE 1",
    intro_title: "The Mirror",
    intro_sub: "5 minutes to know if your talent is trapping you.",
    intro_hook: "The trap doesn't scream. It whispers. It shows up in the small things.",
    intro_cta: "Start →",
    back: "← Back",
    signal_q: "Do you recognize yourself?",
    next: "Next signal →",
    see_result: "See my profile →",
    result_label: "YOUR TENSION PROFILE",
    signals_detected: "signals detected out of 10",
    archetype_label: "YOUR ARCHETYPE",
    top_signals: "Your strongest signals",
    next_module: "Discover why →",
    next_module_sub: "Module 2: map the needs that keep you stuck.",
    next_module_later: "Send it to me in 2 days",
    book_cta: "Go deeper with the book →",
    book_sub: "The 10 signals explained in depth, with Hong, Sofia and Emma's full stories.",
    email_sent: "✉️ Your result was just sent to your email.",
  },
};

const SAT_COLORS_5 = ["#61CE70", "#A3E635", "#b8b8b8", "#FF8A54", "#FE6C63"];

export default function Module1({ lang, onComplete, onBack, savedData }) {
  const [phase, setPhase] = useState(savedData ? "result" : "intro"); // intro | signals | result
  const [sigIdx, setSigIdx] = useState(0);
  const [ratings, setRatings] = useState(savedData?.ratings || {});
  const [vis, setVis] = useState(false);
  const [unlocked, setUnlocked] = useState(!!savedData);
  const [showLaterModal, setShowLaterModal] = useState(false);
  const [savedFirstName, setSavedFirstName] = useState(null);

  const t = M1_TEXT[lang];
  const signals = SIGNALS[lang];
  const labels = SIGNAL_LABELS[lang];
  const currentSignal = signals[sigIdx];

  useEffect(() => {
    setVis(false);
    const ti = setTimeout(() => setVis(true), 30);
    return () => clearTimeout(ti);
  }, [phase, sigIdx]);

  const fade = (fn) => { setVis(false); setTimeout(fn, 250); };

  const nextSignal = () => {
    fade(() => {
      if (sigIdx < 9) setSigIdx(sigIdx + 1);
      else setPhase("result");
      window.scrollTo(0, 0);
    });
  };

  const prevSignal = () => {
    fade(() => {
      if (sigIdx > 0) setSigIdx(sigIdx - 1);
      else setPhase("intro");
      window.scrollTo(0, 0);
    });
  };

  const handleUnlock = (userData) => {
    setUnlocked(true);
    setSavedFirstName(userData.firstName);
    const tension = getTensionProfile(ratings, lang);
    const archetype = getDominantArchetype(ratings, lang);
    // Save to parent
    onComplete({
      ratings,
      signalCount: getSignalCount(ratings),
      tensionProfile: tension.key,
      archetype: archetype.key,
      ...userData,
    }, false); // false = don't navigate away yet
  };

  const goToModule2 = () => {
    onComplete({
      ratings,
      signalCount: getSignalCount(ratings),
      tensionProfile: getTensionProfile(ratings, lang).key,
      archetype: getDominantArchetype(ratings, lang).key,
    }, true); // true = navigate to hub/next
  };

  const hasRated = ratings[currentSignal?.id] !== undefined;

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <div style={{ ...styles.page, ...fadeStyle(vis) }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ ...styles.surtitre, marginBottom: "12px" }}>{t.intro_sur}</div>
          <h1 style={{ fontSize: "clamp(36px,8vw,52px)", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.1, margin: "0 0 8px", fontFamily: FONT }}>
            {t.intro_title}
          </h1>
          <div style={{ width: "40px", height: "3px", background: COLORS.coral, margin: "16px auto", borderRadius: "2px" }} />
          <p style={{ fontSize: "18px", color: COLORS.textSecondary, margin: "0 0 12px", lineHeight: 1.6 }}>{t.intro_sub}</p>
          <p style={{ fontSize: "15px", color: COLORS.textTertiary, margin: "0 0 36px", lineHeight: 1.6, fontStyle: "italic" }}>
            {t.intro_hook}
          </p>
          <button style={styles.btn} onClick={() => fade(() => { setPhase("signals"); window.scrollTo(0, 0); })}>
            {t.intro_cta}
          </button>
        </div>
      </div>
    );
  }

  // ── SIGNALS ──
  if (phase === "signals") {
    return (
      <div style={{ ...styles.page, ...fadeStyle(vis) }}>
        {/* Back button */}
        <button onClick={prevSignal} style={{ ...styles.btnGhost, position: "fixed", top: 12, left: 20, zIndex: 100 }}>
          {t.back}
        </button>
        {/* Counter */}
        <div style={{ position: "fixed", top: 14, right: 20, fontSize: "13px", color: COLORS.textMuted, zIndex: 100 }}>
          {sigIdx + 1}/10
        </div>

        <div style={{ maxWidth: 520, width: "100%" }}>
          {/* Progress dots */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "24px", justifyContent: "center" }}>
            {signals.map((_, i) => (
              <div key={i} style={{
                width: i === sigIdx ? "20px" : "8px", height: "8px", borderRadius: "4px",
                background: i < sigIdx ? COLORS.green : i === sigIdx ? COLORS.coral : "#333",
                transition: "all 0.3s",
              }} />
            ))}
          </div>

          {/* Signal card */}
          <div style={{ ...styles.cardAccent, marginBottom: "24px" }}>
            <div style={{ fontSize: "12px", color: COLORS.coral, fontWeight: 700, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Signal {sigIdx + 1}
            </div>
            <div style={{ fontSize: "13px", color: COLORS.textSecondary, fontWeight: 600, marginBottom: "16px" }}>
              {currentSignal.label}
            </div>
            <p style={{ fontSize: "17px", color: COLORS.textPrimary, lineHeight: 1.7, margin: "0 0 16px", fontWeight: 500 }}>
              {currentSignal.statement}
            </p>
            <p style={{ fontSize: "13px", color: COLORS.textTertiary, lineHeight: 1.6, margin: 0, fontStyle: "italic", borderLeft: `2px solid ${COLORS.border}`, paddingLeft: "12px" }}>
              {currentSignal.scene}
            </p>
          </div>

          {/* Rating */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: COLORS.textPrimary, marginBottom: "14px", textAlign: "center" }}>
              {t.signal_q}
            </div>
            <div style={{ display: "flex", gap: "4px", borderRadius: "12px", overflow: "hidden" }}>
              {labels.map((level, i) => {
                const on = ratings[currentSignal.id] === level.v;
                const c = SAT_COLORS_5[i];
                return (
                  <div key={level.v}
                    onClick={() => setRatings((p) => ({ ...p, [currentSignal.id]: level.v }))}
                    style={{
                      flex: 1, padding: on ? "16px 2px" : "12px 2px", cursor: "pointer", textAlign: "center",
                      background: on ? c : `${c}25`, transition: "all 0.2s",
                      borderRadius: i === 0 ? "12px 0 0 12px" : i === 4 ? "0 12px 12px 0" : "0",
                    }}>
                    <div style={{
                      fontSize: on ? "12px" : "11px", fontWeight: on ? 700 : 500,
                      color: on ? "#fff" : "#ffffff", lineHeight: 1.3, transition: "all 0.2s",
                    }}>
                      {level.short}
                    </div>
                  </div>
                );
              })}
            </div>
            {ratings[currentSignal.id] && (
              <div style={{ textAlign: "center", marginTop: "8px", fontSize: "13px", color: SAT_COLORS_5[ratings[currentSignal.id] - 1], fontWeight: 600 }}>
                {labels[ratings[currentSignal.id] - 1].label}
              </div>
            )}
          </div>

          {/* Continue */}
          <div style={{ textAlign: "center" }}>
            <button style={hasRated ? styles.btn : styles.btnDisabled} onClick={() => hasRated && nextSignal()}>
              {sigIdx < 9 ? t.next : t.see_result}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if (phase === "result") {
    const tension = getTensionProfile(ratings, lang);
    const archetype = getDominantArchetype(ratings, lang);
    const topSigs = getTopSignals(ratings, lang);
    const signalCount = getSignalCount(ratings);

    return (
      <div style={{ ...styles.pageTop, ...fadeStyle(vis), position: "relative" }}>
        {showLaterModal && <ConfirmModal lang={lang} firstName={savedFirstName} onClose={() => setShowLaterModal(false)} />}
        <div style={{ maxWidth: 580, width: "100%", position: "relative" }}>

          {/* Email gate overlay */}
          {!unlocked && (
            <EmailGate
              lang={lang}
              onUnlock={handleUnlock}
              moduleData={{ module: 1, signalCount, tensionProfile: tension.key, archetype: archetype.key }}
              emailData={{
                module: 1,
                signalCount,
                tensionLabel: tension.label,
                tensionSub: tension.sub,
                tensionColor: tension.color,
                archetypeLabel: archetype.label,
                archetypeDesc: archetype.desc,
                archetypeIcon: archetype.icon,
              }}
            />
          )}

          {/* Results (blurred if locked) */}
          <div style={{ filter: unlocked ? "none" : "blur(8px)", pointerEvents: unlocked ? "auto" : "none", transition: "filter 0.5s ease" }}>

            {/* Email sent banner */}
            {unlocked && (
              <div style={{
                fontSize: "12px", color: COLORS.green, textAlign: "center",
                padding: "10px 14px", background: `${COLORS.green}12`, borderRadius: "10px",
                border: `1px solid ${COLORS.green}30`, marginBottom: "16px",
              }}>
                {t.email_sent}
              </div>
            )}

            {/* Tension profile */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ ...styles.surtitre, marginBottom: "12px" }}>{t.result_label}</div>
              <h2 style={{ fontSize: "clamp(28px,6vw,38px)", fontWeight: 800, color: tension.color, margin: "0 0 8px", fontFamily: FONT }}>
                {tension.label}
              </h2>
              <div style={{ fontSize: "48px", fontWeight: 800, color: tension.color, marginBottom: "4px" }}>
                {signalCount}<span style={{ fontSize: "18px", color: COLORS.textTertiary }}>/10</span>
              </div>
              <div style={{ fontSize: "13px", color: COLORS.textSecondary }}>{t.signals_detected}</div>
            </div>

            {/* Tension bar */}
            <div style={{ ...styles.card, marginBottom: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: 1.7, marginBottom: "16px" }}>
                {tension.sub}
              </div>
              <div style={{ position: "relative", height: "12px", borderRadius: "6px", background: "#1a1a1a", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${(signalCount / 10) * 100}%`,
                  borderRadius: "6px",
                  background: signalCount <= 3 ? COLORS.greenGradient : signalCount <= 6 ? `linear-gradient(90deg, #f59e0b, ${COLORS.orange})` : `linear-gradient(90deg, #dc2626, ${COLORS.coral})`,
                  transition: "width 1s cubic-bezier(0.22,1,0.36,1)",
                }} />
              </div>
            </div>

            {/* Archetype */}
            <div style={{ ...styles.cardAccent, marginBottom: "16px", textAlign: "center" }}>
              <div style={{ ...styles.sectionTitle, color: COLORS.coral }}>{t.archetype_label}</div>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{archetype.icon}</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "4px" }}>
                {archetype.label}
              </div>
              <div style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: 1.7 }}>
                {archetype.desc}
              </div>
            </div>

            {/* Top signals */}
            {topSigs.length > 0 && (
              <div style={{ ...styles.card, marginBottom: "16px" }}>
                <div style={styles.sectionTitle}>{t.top_signals}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {topSigs.map((sig) => {
                    const val = ratings[sig.id];
                    const c = SAT_COLORS_5[val - 1];
                    return (
                      <div key={sig.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "8px", height: "8px", borderRadius: "50%", background: c, flexShrink: 0,
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.textPrimary }}>{sig.label}</div>
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: c }}>
                          {labels[val - 1].label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA to Module 2 */}
            <div style={{ ...styles.card, marginBottom: "16px", textAlign: "center", background: "#0f0f1a", border: `1px solid #2a2a3a` }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "8px" }}>
                {t.next_module_sub}
              </div>
              <button style={{ ...styles.btn, marginBottom: "12px" }} onClick={goToModule2}>
                {t.next_module}
              </button>
              <div>
                <button style={styles.btnGhost} onClick={() => setShowLaterModal(true)}>{t.next_module_later}</button>
              </div>
            </div>

            {/* Book CTA */}
            <div style={{ ...styles.card, textAlign: "center", marginBottom: "16px" }}>
              <img
                src={lang === "fr" ? "/book-fr.png" : "/book-en.png"}
                alt={lang === "fr" ? "Le Piège du Talent" : "The Talent Trap"}
                style={{ maxWidth: "140px", width: "100%", height: "auto", marginBottom: "16px", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))" }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div style={{ fontSize: "14px", color: COLORS.textSecondary, marginBottom: "12px", lineHeight: 1.6 }}>
                {t.book_sub}
              </div>
              <a href={lang === "fr" ? "https://www.monexpansion.com/#livre" : "https://www.monexpansion.com/en/talent-trap/#livre"} target="_blank" rel="noopener noreferrer"
                style={{ ...styles.btnOutline, display: "inline-block", textDecoration: "none" }}>
                {t.book_cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
