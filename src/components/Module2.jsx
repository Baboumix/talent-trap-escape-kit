import { useState, useEffect } from "react";
import { COLORS, FONT, styles, fadeStyle } from "./SharedStyles";
import { T, NEED_IDS, NEED_NAMES, DEEP } from "../data/translations";
import { DEFS, HD } from "../data/content";
import {
  getScore, getVerdict, topGaps, topStrengths, vigilanceNeeds,
  getPatterns, getSolutions, getClosingQuestion, getExplanation,
} from "../data/scoring";

const M2_TEXT = {
  fr: {
    intro_sur: "MODULE 2",
    intro_title: "La Carte",
    intro_sub: "Cartographie les 6 besoins essentiels qui dirigent tes décisions.",
    intro_hook: "Derrière chaque frustration au travail, il y a un besoin non comblé. Identifie lesquels.",
    intro_cta: "Commencer →",
    back: "← Retour",
    step1_label: "Étape 1",
    step1_title: "Ta situation actuelle.",
    step1_sub: "Choisis ce qui décrit le mieux ta réalité.",
    next_need: "Besoin suivant →",
    see_result: "Voir mon résultat →",
    res_label: "TON RÉSULTAT",
    score_label: "Score d'alignement",
    biggest_gap: "Plus gros décalage",
    essential: "essentiel",
    important_w: "important",
    sec_gaps: "Là où ça coince",
    sec_gaps_sub: "Plus un besoin est important et insatisfait, plus le piège se resserre.",
    missing: "CE QUI MANQUE",
    at_risk: "À RISQUE",
    sec_works: "Ce qui fonctionne",
    sec_vigil: "Zone de vigilance",
    vigil_text: "n'est pas en danger, mais garde un œil dessus.",
    sec_surface: "Ce qui se passe sous la surface",
    healthy: "Sain",
    destructive: "Destructif",
    sec_why: "Pourquoi tu es là",
    sec_observe: "Ce qu'on observe",
    sec_pistes: "Pistes pour améliorer ton alignement",
    today: "Aujourd'hui :",
    objective: "L'objectif :",
    sec_question: "La question à garder avec toi",
    step_badge: "ÉTAPE 3 SUR 3",
    module3_title: "Termine ton parcours",
    module3_sub: "Identifie ta direction organique — ton vrai talent, pas celui du CV.",
    module3_cta: "Continuer vers La Boussole →",
    module3_time: "15 min",
    explore_label: "Ou explore plus tard",
    esc_lab_title: "Escape Lab",
    esc_lab_sub: "Cohorte de 12, 3 mois, live avec Julien.",
    esc_lab_cta: "Découvrir →",
    esc_now_title: "Escape Now!",
    esc_now_sub: "4 sessions 1:1 avec Julien.",
    esc_now_cta: "Réserver un appel →",
    tidycal: "https://tidycal.com/julienklein/decouverte",
    tension_label: "Profil de tension (Module 1)",
    signals_label: "signaux détectés",
    email_sent: "✉️ Ton résultat vient d'être envoyé sur ton email.",
  },
  en: {
    intro_sur: "MODULE 2",
    intro_title: "The Map",
    intro_sub: "Map the 6 essential needs that drive your decisions.",
    intro_hook: "Behind every frustration at work, there's an unmet need. Identify which ones.",
    intro_cta: "Start \u2192",
    back: "\u2190 Back",
    step1_label: "Step 1",
    step1_title: "Your current situation.",
    step1_sub: "Pick what best describes your reality.",
    next_need: "Next need \u2192",
    see_result: "See my result \u2192",
    res_label: "YOUR RESULT",
    score_label: "Alignment score",
    biggest_gap: "Biggest gap",
    essential: "essential",
    important_w: "important",
    sec_gaps: "Where it breaks down",
    sec_gaps_sub: "The more important and unsatisfied a need is, the tighter the trap.",
    missing: "WHAT'S MISSING",
    at_risk: "AT RISK",
    sec_works: "What's working",
    sec_vigil: "Watch zone",
    vigil_text: "isn't in danger, but keep an eye on it.",
    sec_surface: "What's happening underneath",
    healthy: "Healthy",
    destructive: "Destructive",
    sec_why: "Why you're here",
    sec_observe: "What we typically observe",
    sec_pistes: "Steps to improve your alignment",
    today: "Today:",
    objective: "The goal:",
    sec_question: "The question to sit with",
    step_badge: "STEP 3 OF 3",
    module3_title: "Finish your journey",
    module3_sub: "Identify your organic direction — your real talent, not the resume one.",
    module3_cta: "Continue to The Compass \u2192",
    module3_time: "15 min",
    explore_label: "Or explore later",
    esc_lab_title: "Escape Lab",
    esc_lab_sub: "Cohort of 12, 3 months, live with Julien.",
    esc_lab_cta: "Discover \u2192",
    esc_now_title: "Escape Now!",
    esc_now_sub: "4 sessions 1:1 with Julien.",
    esc_now_cta: "Book a call \u2192",
    tidycal: "https://tidycal.com/julienklein/discovery",
    tension_label: "Tension profile (Module 1)",
    signals_label: "signals detected",
    email_sent: "✉️ Your result was just sent to your email.",
  },
};

export default function Module2({ lang, onComplete, onBack, savedData, module1Data, userData }) {
  const [phase, setPhase] = useState(savedData ? "result" : "intro");
  const [profile, setProfile] = useState(savedData?.profile || null);
  const [needIdx, setNeedIdx] = useState(0);
  const [sat, setSat] = useState(savedData?.sat || {});
  const [imp, setImp] = useState(savedData?.imp || {});
  const [vis, setVis] = useState(false);

  const t = M2_TEXT[lang];
  const tLang = T[lang];
  const needNames = NEED_NAMES[lang];
  const currentNeed = NEED_IDS[needIdx];

  useEffect(() => {
    setVis(false);
    const ti = setTimeout(() => setVis(true), 30);
    return () => clearTimeout(ti);
  }, [phase, needIdx]);

  // Send result email on arrival at result phase
  useEffect(() => {
    if (phase !== "result" || !userData?.email || savedData) return;
    const score = getScore(sat, imp);
    const verdict = getVerdict(sat, imp, lang);
    const gaps = topGaps(sat, imp).slice(0, 3);
    const gapsForEmail = gaps.map((g) => ({
      name: NEED_NAMES[lang][g.id],
      status: tLang.sat[g.sat - 1].label,
    }));
    fetch("/api/send-result-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userData.email,
        firstName: userData.firstName,
        lang,
        module: 2,
        score,
        verdict: verdict.title,
        verdictSub: verdict.sub,
        verdictColor: verdict.color,
        topGaps: gapsForEmail,
      }),
    }).catch(() => {});
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const fade = (fn) => { setVis(false); setTimeout(fn, 250); };

  const goToModule3 = () => {
    const score = getScore(sat, imp);
    const verdict = getVerdict(sat, imp, lang);
    onComplete({ profile, sat, imp, score, verdict: verdict.level }, true);
  };

  const hasRatedBoth = sat[currentNeed] !== undefined && imp[currentNeed] !== undefined;

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
          <button style={styles.btn} onClick={() => fade(() => { setPhase("profile"); window.scrollTo(0, 0); })}>
            {t.intro_cta}
          </button>
          <div style={{ marginTop: "16px" }}>
            <button style={styles.btnGhost} onClick={onBack}>{t.back}</button>
          </div>
        </div>
      </div>
    );
  }

  // ── PROFILE SELECTION ──
  if (phase === "profile") {
    const profiles = tLang.profiles;
    return (
      <div style={{ ...styles.page, ...fadeStyle(vis) }}>
        <button onClick={onBack} style={{ ...styles.btnGhost, position: "fixed", top: 12, left: 20, zIndex: 100 }}>
          {t.back}
        </button>
        <div style={{ maxWidth: 520, width: "100%" }}>
          <div style={{ ...styles.surtitre, marginBottom: "4px", textAlign: "center" }}>{t.step1_label}</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: COLORS.textPrimary, textAlign: "center", margin: "0 0 4px", fontFamily: FONT }}>
            {t.step1_title}
          </h2>
          <p style={{ fontSize: "14px", color: COLORS.textSecondary, textAlign: "center", margin: "0 0 24px" }}>{t.step1_sub}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {profiles.map((p) => {
              const sel = profile === p.id;
              return (
                <div key={p.id}
                  onClick={() => {
                    setProfile(p.id);
                    setTimeout(() => fade(() => { setPhase("needs"); window.scrollTo(0, 0); }), 300);
                  }}
                  style={{
                    ...styles.card,
                    cursor: "pointer",
                    borderColor: sel ? COLORS.coral : COLORS.border,
                    transition: "all 0.3s",
                    display: "flex", alignItems: "center", gap: "16px",
                  }}
                >
                  <div style={{ fontSize: "28px", flexShrink: 0 }}>{p.icon}</div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary }}>{p.label}</div>
                    <div style={{ fontSize: "13px", color: COLORS.textSecondary, marginTop: "2px" }}>{p.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── NEEDS RATING ──
  if (phase === "needs") {
    const isDeep = DEEP.includes(currentNeed);
    const def = DEFS[lang]?.[profile]?.[currentNeed] || "";

    return (
      <div style={{ ...styles.page, ...fadeStyle(vis) }}>
        {/* Back */}
        <button onClick={() => fade(() => {
          if (needIdx > 0) setNeedIdx(needIdx - 1);
          else setPhase("profile");
          window.scrollTo(0, 0);
        })} style={{ ...styles.btnGhost, position: "fixed", top: 12, left: 20, zIndex: 100 }}>
          {t.back}
        </button>
        {/* Counter */}
        <div style={{ position: "fixed", top: 14, right: 20, fontSize: "13px", color: COLORS.textMuted, zIndex: 100 }}>
          {needIdx + 1}/6
        </div>

        <div style={{ maxWidth: 520, width: "100%" }}>
          {/* Progress dots */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "24px", justifyContent: "center" }}>
            {NEED_IDS.map((_, i) => (
              <div key={i} style={{
                width: i === needIdx ? "20px" : "8px", height: "8px", borderRadius: "4px",
                background: i < needIdx ? COLORS.green : i === needIdx ? COLORS.coral : "#333",
                transition: "all 0.3s",
              }} />
            ))}
          </div>

          {/* Deep need tag */}
          {isDeep && (
            <div style={{ textAlign: "center", marginBottom: "12px" }}>
              <span style={{ ...styles.tag, color: COLORS.coral, background: COLORS.coralDim }}>
                {tLang.deep_tag}
              </span>
            </div>
          )}

          {/* Need name */}
          <h2 style={{ fontSize: "clamp(28px,6vw,36px)", fontWeight: 800, color: COLORS.textPrimary, textAlign: "center", margin: "0 0 12px", fontFamily: FONT }}>
            {needNames[currentNeed]}
          </h2>

          {/* Definition */}
          <div style={{ ...styles.card, marginBottom: "24px" }}>
            <p style={{ fontSize: "15px", color: COLORS.textSecondary, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
              {def}
            </p>
          </div>

          {/* Importance */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: COLORS.textPrimary, marginBottom: "12px", textAlign: "center" }}>
              {tLang.imp_q}
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              {tLang.imp.map((level) => {
                const on = imp[currentNeed] === level.v;
                const c = COLORS.impColors[level.v - 1];
                return (
                  <div key={level.v}
                    onClick={() => setImp((p) => ({ ...p, [currentNeed]: level.v }))}
                    style={{
                      flex: 1, maxWidth: "140px", padding: on ? "18px 8px" : "14px 8px",
                      cursor: "pointer", textAlign: "center",
                      background: on ? c : `${c}20`, borderRadius: "16px",
                      border: `1px solid ${on ? c : "transparent"}`,
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: on ? "14px" : "13px", fontWeight: on ? 700 : 500, color: on ? "#fff" : c, transition: "all 0.2s" }}>
                      {level.label}
                    </div>
                    <div style={{ fontSize: "11px", color: on ? "#ffffffaa" : COLORS.textMuted, marginTop: "2px" }}>
                      {level.sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Satisfaction */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: COLORS.textPrimary, marginBottom: "12px", textAlign: "center" }}>
              {tLang.sat_q}
            </div>
            <div style={{ display: "flex", gap: "4px", borderRadius: "12px", overflow: "hidden" }}>
              {tLang.sat.map((level, i) => {
                const on = sat[currentNeed] === level.v;
                const c = COLORS.satColors[i];
                return (
                  <div key={level.v}
                    onClick={() => setSat((p) => ({ ...p, [currentNeed]: level.v }))}
                    style={{
                      flex: 1, padding: on ? "16px 2px" : "12px 2px",
                      cursor: "pointer", textAlign: "center",
                      background: on ? c : `${c}25`, transition: "all 0.2s",
                      borderRadius: i === 0 ? "12px 0 0 12px" : i === 4 ? "0 12px 12px 0" : "0",
                    }}
                  >
                    <div style={{
                      fontSize: on ? "12px" : "11px", fontWeight: on ? 700 : 500,
                      color: "#ffffff", lineHeight: 1.3, transition: "all 0.2s",
                    }}>
                      {level.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue */}
          <div style={{ textAlign: "center" }}>
            <button
              style={hasRatedBoth ? styles.btn : styles.btnDisabled}
              onClick={() => hasRatedBoth && fade(() => {
                if (needIdx < 5) setNeedIdx(needIdx + 1);
                else setPhase("result");
                window.scrollTo(0, 0);
              })}
            >
              {needIdx < 5 ? t.next_need : t.see_result}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if (phase === "result") {
    const score = getScore(sat, imp);
    const verdict = getVerdict(sat, imp, lang);
    const gaps = topGaps(sat, imp);
    const strengths = topStrengths(sat, imp);
    const vigils = vigilanceNeeds(sat, imp);
    const patterns = getPatterns(profile, sat, imp, lang);
    const solutions = getSolutions(profile, sat, imp, lang);
    const closingQ = getClosingQuestion(profile, sat, imp, lang);
    const explanation = getExplanation(profile, sat, imp, lang);
    const bigGap = gaps[0];

    return (
      <div style={{ ...styles.pageTop, ...fadeStyle(vis), position: "relative" }}>
        <div style={{ maxWidth: 580, width: "100%" }}>

          {/* Email sent banner */}
          {userData?.email && !savedData && (
            <div style={{
              fontSize: "12px", color: COLORS.green, textAlign: "center",
              padding: "10px 14px", background: `${COLORS.green}12`, borderRadius: "10px",
              border: `1px solid ${COLORS.green}30`, marginBottom: "16px",
            }}>
              {t.email_sent}
            </div>
          )}

          {/* Module 1 summary (if data available) */}
          {module1Data && (
            <div style={{ ...styles.card, marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px", background: "#0f0f0f" }}>
              <div style={{ fontSize: "28px" }}>
                {module1Data.signalCount <= 3 ? "\u2705" : module1Data.signalCount <= 6 ? "\u26a0\ufe0f" : "\ud83d\udea8"}
              </div>
              <div>
                <div style={{ fontSize: "11px", color: COLORS.textTertiary, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                  {t.tension_label}
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: COLORS.textPrimary }}>
                  {module1Data.signalCount}/10 {t.signals_label}
                </div>
              </div>
            </div>
          )}

          {/* Score header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ ...styles.surtitre, marginBottom: "12px" }}>{t.res_label}</div>
            <div style={{ fontSize: "72px", fontWeight: 800, color: verdict.color, lineHeight: 1, marginBottom: "4px" }}>
              {score}<span style={{ fontSize: "24px", color: COLORS.textTertiary }}>%</span>
            </div>
            <div style={{ fontSize: "13px", color: COLORS.textSecondary, marginBottom: "16px" }}>{t.score_label}</div>
            <h2 style={{ fontSize: "clamp(24px,5vw,32px)", fontWeight: 800, color: verdict.color, margin: "0 0 8px", fontFamily: FONT }}>
              {verdict.title}
            </h2>
            <p style={{ fontSize: "14px", color: COLORS.textSecondary, margin: 0, lineHeight: 1.6 }}>{verdict.sub}</p>
          </div>

          {/* Biggest gap */}
          {bigGap && (
            <div style={{ ...styles.cardAccent, marginBottom: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: COLORS.textTertiary, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: "8px" }}>
                {t.biggest_gap}
              </div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: COLORS.coral }}>
                {needNames[bigGap.id]}
              </div>
              <div style={{ fontSize: "13px", color: COLORS.textSecondary, marginTop: "4px" }}>
                {bigGap.imp === 3 ? t.essential : t.important_w} &middot; {tLang.sat[bigGap.sat - 1].label}
              </div>
            </div>
          )}

          {/* Gaps */}
          {gaps.length > 0 && (
            <div style={{ ...styles.card, marginBottom: "16px" }}>
              <div style={styles.sectionTitle}>{t.sec_gaps}</div>
              <p style={{ fontSize: "13px", color: COLORS.textTertiary, margin: "0 0 14px" }}>{t.sec_gaps_sub}</p>
              {gaps.map((n) => {
                const hd = HD[lang]?.[profile]?.[n.id];
                return (
                  <div key={n.id} style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: `1px solid ${COLORS.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: COLORS.coral }}>{needNames[n.id]}</span>
                      <span style={{ ...styles.tag, color: n.sat <= 2 ? COLORS.coral : COLORS.orange, background: n.sat <= 2 ? COLORS.coralDim : COLORS.orangeDim }}>
                        {n.sat <= 2 ? t.missing : t.at_risk}
                      </span>
                    </div>
                    {/* Sat bar */}
                    <div style={{ position: "relative", height: "8px", borderRadius: "4px", background: "#1a1a1a", marginBottom: "8px" }}>
                      <div style={{
                        position: "absolute", left: 0, top: 0, bottom: 0,
                        width: `${(n.sat / 5) * 100}%`, borderRadius: "4px",
                        background: COLORS.satColors[n.sat - 1],
                      }} />
                    </div>
                    {hd && (
                      <div style={{ fontSize: "13px", color: COLORS.textTertiary, lineHeight: 1.5 }}>
                        <span style={{ color: COLORS.coral }}>{hd.d}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Strengths */}
          {strengths.length > 0 && (
            <div style={{ ...styles.card, marginBottom: "16px" }}>
              <div style={styles.sectionTitle}>{t.sec_works}</div>
              {strengths.map((n) => {
                const hd = HD[lang]?.[profile]?.[n.id];
                return (
                  <div key={n.id} style={{ marginBottom: "10px" }}>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: COLORS.green }}>{needNames[n.id]}</div>
                    {hd && <div style={{ fontSize: "13px", color: COLORS.textTertiary, marginTop: "2px" }}>{hd.h}</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Vigilance */}
          {vigils.length > 0 && (
            <div style={{ ...styles.card, marginBottom: "16px" }}>
              <div style={styles.sectionTitle}>{t.sec_vigil}</div>
              {vigils.map((n) => (
                <div key={n.id} style={{ fontSize: "14px", color: COLORS.textSecondary, marginBottom: "6px" }}>
                  <span style={{ fontWeight: 600, color: COLORS.orange }}>{needNames[n.id]}</span> {t.vigil_text}
                </div>
              ))}
            </div>
          )}

          {/* Under the surface */}
          <div style={{ ...styles.card, marginBottom: "16px" }}>
            <div style={styles.sectionTitle}>{t.sec_surface}</div>
            {NEED_IDS.map((id) => {
              const hd = HD[lang]?.[profile]?.[id];
              if (!hd) return null;
              return (
                <div key={id} style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "4px" }}>{needNames[id]}</div>
                  <div style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
                    <div style={{ flex: 1, padding: "8px 12px", borderRadius: "12px", background: COLORS.greenDim, color: COLORS.green }}>
                      <span style={{ fontWeight: 600 }}>{t.healthy}:</span> {hd.h}
                    </div>
                    <div style={{ flex: 1, padding: "8px 12px", borderRadius: "12px", background: COLORS.coralDim, color: COLORS.coral }}>
                      <span style={{ fontWeight: 600 }}>{t.destructive}:</span> {hd.d}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Why you're here */}
          {explanation && (
            <div style={{ ...styles.cardAccent, marginBottom: "16px" }}>
              <div style={styles.sectionTitle}>{t.sec_why}</div>
              <p style={{ fontSize: "15px", color: COLORS.textSecondary, lineHeight: 1.7, margin: 0 }}>{explanation}</p>
            </div>
          )}

          {/* Patterns */}
          {patterns.length > 0 && (
            <div style={{ ...styles.card, marginBottom: "16px" }}>
              <div style={styles.sectionTitle}>{t.sec_observe}</div>
              {patterns.map((p, i) => (
                <div key={i} style={{ fontSize: "14px", color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: "8px", paddingLeft: "12px", borderLeft: `2px solid ${COLORS.border}` }}>
                  {p}
                </div>
              ))}
            </div>
          )}

          {/* Solutions */}
          {solutions.length > 0 && (
            <div style={{ ...styles.card, marginBottom: "16px" }}>
              <div style={styles.sectionTitle}>{t.sec_pistes}</div>
              {solutions.map((s, i) => (
                <div key={i} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: i < solutions.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <div style={{ fontSize: "13px", color: COLORS.textTertiary, marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600 }}>{t.today}</span> {s.b}
                  </div>
                  <div style={{ fontSize: "14px", color: COLORS.green, fontWeight: 600 }}>
                    <span style={{ fontWeight: 600 }}>{t.objective}</span> {s.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Closing question */}
          {closingQ && (
            <div style={{ ...styles.cardAccent, marginBottom: "16px", textAlign: "center" }}>
              <div style={styles.sectionTitle}>{t.sec_question}</div>
              <p style={{ fontSize: "18px", fontWeight: 700, color: COLORS.textPrimary, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
                {closingQ}
              </p>
            </div>
          )}

          {/* PRIMARY CTA — Module 3 (Next step in journey) */}
          <div style={{
            marginBottom: "32px",
            background: `linear-gradient(135deg, ${COLORS.coral}15, ${COLORS.coral}08)`,
            border: `2px solid ${COLORS.coral}`,
            borderRadius: "20px",
            padding: "24px 20px",
            textAlign: "center",
            position: "relative",
            boxShadow: `0 8px 32px ${COLORS.coral}20`,
          }}>
            {/* Step badge */}
            <div style={{
              display: "inline-block",
              fontSize: "10px", fontWeight: 800, letterSpacing: "1.5px",
              color: "#fff", background: COLORS.coral,
              padding: "4px 12px", borderRadius: "12px",
              marginBottom: "12px",
            }}>
              {t.step_badge}
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "6px", fontFamily: FONT }}>
              {t.module3_title}
            </div>
            <div style={{ fontSize: "14px", color: COLORS.textSecondary, marginBottom: "4px", lineHeight: 1.5 }}>
              {t.module3_sub}
            </div>
            <div style={{ fontSize: "11px", color: COLORS.textMuted, marginBottom: "18px", letterSpacing: "0.5px" }}>
              ⏱ {t.module3_time}
            </div>
            <button style={{ ...styles.btn, width: "100%", maxWidth: "320px" }} onClick={goToModule3}>
              {t.module3_cta}
            </button>
          </div>

          {/* SECONDARY: Divider + explore later */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "16px",
          }}>
            <div style={{ flex: 1, height: "1px", background: COLORS.border }} />
            <div style={{
              fontSize: "10px", color: COLORS.textMuted,
              textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600,
            }}>
              {t.explore_label}
            </div>
            <div style={{ flex: 1, height: "1px", background: COLORS.border }} />
          </div>

          {/* SECONDARY CTAs — Escape Lab + Escape Now side by side */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "16px",
          }}>
            {/* Escape Lab */}
            <a href={lang === "fr" ? "https://monexpansion.com/fr/escape-lab/" : "https://monexpansion.com/en/escape-lab/"}
               target="_blank" rel="noopener noreferrer"
               style={{
                 background: COLORS.bgCard,
                 border: `1px solid ${COLORS.border}`,
                 borderRadius: "14px",
                 padding: "14px 12px",
                 textAlign: "center",
                 textDecoration: "none",
                 display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                 transition: "all 0.2s",
               }}>
              <div style={{ fontSize: "20px" }}>🧪</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>{t.esc_lab_title}</div>
              <div style={{ fontSize: "11px", color: COLORS.textSecondary, lineHeight: 1.4 }}>{t.esc_lab_sub}</div>
              <div style={{ fontSize: "11px", color: COLORS.coral, fontWeight: 600, marginTop: "4px" }}>{t.esc_lab_cta}</div>
            </a>

            {/* Escape Now */}
            <a href={t.tidycal} target="_blank" rel="noopener noreferrer"
               style={{
                 background: COLORS.bgCard,
                 border: `1px solid ${COLORS.border}`,
                 borderRadius: "14px",
                 padding: "14px 12px",
                 textAlign: "center",
                 textDecoration: "none",
                 display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                 transition: "all 0.2s",
               }}>
              <div style={{ fontSize: "20px" }}>🚀</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>{t.esc_now_title}</div>
              <div style={{ fontSize: "11px", color: COLORS.textSecondary, lineHeight: 1.4 }}>{t.esc_now_sub}</div>
              <div style={{ fontSize: "11px", color: COLORS.coral, fontWeight: 600, marginTop: "4px" }}>{t.esc_now_cta}</div>
            </a>
          </div>

        </div>
      </div>
    );
  }

  return null;
}
