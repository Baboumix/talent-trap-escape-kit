import { useState, useEffect } from "react";
import { COLORS, FONT, styles, fadeStyle } from "./SharedStyles";
import { DIRECTION } from "../data/direction";

const LS_KEY = "escape-kit-m3-reflections";

function loadReflections() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveReflections(r) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(r)); } catch { /* noop */ }
}

export default function Module3({ lang, onComplete, onBack, savedData, module1Data, module2Data, userData }) {
  const [phase, setPhase] = useState(savedData ? "result" : "intro");
  const [qIdx, setQIdx] = useState(0);
  const [reflections, setReflections] = useState(savedData?.reflections || loadReflections());
  const [vis, setVis] = useState(false);

  const d = DIRECTION[lang];
  const questions = d.questions;
  const currentQ = questions[qIdx];

  useEffect(() => {
    setVis(false);
    const ti = setTimeout(() => setVis(true), 30);
    return () => clearTimeout(ti);
  }, [phase, qIdx]);

  // Send result email on arrival at result phase
  useEffect(() => {
    if (phase !== "result" || !userData?.email || savedData) return;
    const tensionData = module1Data ? {
      tensionLabel: module1Data.tensionProfile,
      signalCount: module1Data.signalCount,
    } : { tensionLabel: "—", signalCount: 0 };
    const scoreData = module2Data ? {
      score: module2Data.score,
      verdict: module2Data.verdict,
    } : { score: 0, verdict: "—" };
    fetch("/api/send-result-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userData.email,
        firstName: userData.firstName,
        lang,
        module: 3,
        ...tensionData,
        ...scoreData,
      }),
    }).catch(() => {});
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const fade = (fn) => { setVis(false); setTimeout(fn, 250); };

  const updateReflection = (id, value) => {
    const next = { ...reflections, [id]: value };
    setReflections(next);
    saveReflections(next);
  };

  const completeModule = () => {
    onComplete({ reflections }, true);
  };

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <div style={{ ...styles.page, ...fadeStyle(vis) }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ ...styles.surtitre, marginBottom: "12px" }}>{d.moduleLabel}</div>
          <h1 style={{ fontSize: "clamp(36px,8vw,52px)", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.1, margin: "0 0 8px", fontFamily: FONT }}>
            {d.moduleTitle}
          </h1>
          <div style={{ width: "40px", height: "3px", background: COLORS.coral, margin: "16px auto", borderRadius: "2px" }} />
          <p style={{ fontSize: "16px", color: COLORS.textSecondary, margin: "0 0 24px", lineHeight: 1.7 }}>
            {d.moduleSub}
          </p>

          {/* Digital vs Organic visual */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", textAlign: "left" }}>
            <div style={{ ...styles.card, flex: 1 }}>
              <div style={{ fontSize: "20px", marginBottom: "8px" }}>💻</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "4px" }}>{d.digitalTitle}</div>
              <div style={{ fontSize: "13px", color: COLORS.textTertiary, lineHeight: 1.5 }}>{d.digitalDesc}</div>
            </div>
            <div style={{ ...styles.cardAccent, flex: 1 }}>
              <div style={{ fontSize: "20px", marginBottom: "8px" }}>🌱</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: COLORS.coral, marginBottom: "4px" }}>{d.organicTitle}</div>
              <div style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: 1.5 }}>{d.organicDesc}</div>
            </div>
          </div>

          <p style={{ fontSize: "14px", color: COLORS.textTertiary, margin: "0 0 8px", lineHeight: 1.6, fontStyle: "italic" }}>
            {d.digitalVsOrganic}
          </p>
          <p style={{ fontSize: "15px", color: COLORS.textSecondary, margin: "0 0 32px", lineHeight: 1.6, fontWeight: 600 }}>
            {d.introHook}
          </p>

          <button style={styles.btn} onClick={() => fade(() => { setPhase("questions"); window.scrollTo(0, 0); })}>
            {d.introCta}
          </button>
          <div style={{ marginTop: "16px" }}>
            <button style={styles.btnGhost} onClick={onBack}>{d.backBtn}</button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUESTIONS ──
  if (phase === "questions") {
    return (
      <div style={{ ...styles.page, ...fadeStyle(vis) }}>
        {/* Back */}
        <button onClick={() => fade(() => {
          if (qIdx > 0) setQIdx(qIdx - 1);
          else setPhase("intro");
          window.scrollTo(0, 0);
        })} style={{ ...styles.btnGhost, position: "fixed", top: 12, left: 20, zIndex: 100 }}>
          {d.backBtn}
        </button>
        {/* Counter */}
        <div style={{ position: "fixed", top: 14, right: 20, fontSize: "13px", color: COLORS.textMuted, zIndex: 100 }}>
          {qIdx + 1}/5
        </div>

        <div style={{ maxWidth: 520, width: "100%" }}>
          {/* Progress dots */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "32px", justifyContent: "center" }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                width: i === qIdx ? "20px" : "8px", height: "8px", borderRadius: "4px",
                background: i < qIdx ? COLORS.green : i === qIdx ? COLORS.coral : "#333",
                transition: "all 0.3s",
              }} />
            ))}
          </div>

          {/* Question */}
          <h2 style={{
            fontSize: "clamp(22px,5vw,28px)", fontWeight: 800, color: COLORS.textPrimary,
            textAlign: "center", margin: "0 0 20px", fontFamily: FONT, lineHeight: 1.3,
          }}>
            {currentQ.question}
          </h2>

          {/* Example from the book */}
          <div style={{
            ...styles.card, marginBottom: "20px",
            borderLeft: `3px solid ${COLORS.coral}`, paddingLeft: "20px",
          }}>
            {currentQ.exampleAuthor && (
              <div style={{ fontSize: "11px", color: COLORS.coral, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                {currentQ.exampleAuthor}
              </div>
            )}
            <p style={{ fontSize: "14px", color: COLORS.textSecondary, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
              {currentQ.example}
            </p>
          </div>

          {/* Textarea */}
          <textarea
            value={reflections[currentQ.id] || ""}
            onChange={(e) => updateReflection(currentQ.id, e.target.value)}
            placeholder={currentQ.placeholder}
            rows={4}
            style={{
              width: "100%", padding: "16px", borderRadius: "16px",
              border: `1px solid ${COLORS.border}`, background: COLORS.bgCard,
              color: COLORS.textPrimary, fontSize: "15px", lineHeight: 1.6,
              outline: "none", fontFamily: FONT, resize: "vertical",
              boxSizing: "border-box", minHeight: "120px",
            }}
          />

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "24px" }}>
            <button style={styles.btnGhost} onClick={() => fade(() => {
              if (qIdx < 4) setQIdx(qIdx + 1);
              else setPhase("result");
              window.scrollTo(0, 0);
            })}>
              {d.skipBtn}
            </button>
            <button style={styles.btn} onClick={() => fade(() => {
              if (qIdx < 4) setQIdx(qIdx + 1);
              else setPhase("result");
              window.scrollTo(0, 0);
            })}>
              {qIdx < 4 ? d.continueBtn : d.continueBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if (phase === "result") {
    // Determine insight based on module2 verdict
    const verdictLevel = module2Data?.verdict || "mis";
    const insight = verdictLevel === "trap" ? d.digitalInsightTrap
      : verdictLevel === "ok" ? d.digitalInsightOk
      : d.digitalInsightMis;

    const hasReflections = Object.values(reflections).some((v) => v && v.trim());

    return (
      <div style={{ ...styles.pageTop, ...fadeStyle(vis) }}>
        <div style={{ maxWidth: 580, width: "100%" }}>

          {/* Email sent banner */}
          {userData?.email && !savedData && (
            <div style={{
              fontSize: "12px", color: COLORS.green, textAlign: "center",
              padding: "10px 14px", background: `${COLORS.green}12`, borderRadius: "10px",
              border: `1px solid ${COLORS.green}30`, marginBottom: "16px",
            }}>
              {d.emailSent}
            </div>
          )}

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ ...styles.surtitre, marginBottom: "12px" }}>{d.resultLabel}</div>
            <h2 style={{ fontSize: "clamp(28px,6vw,36px)", fontWeight: 800, color: COLORS.textPrimary, margin: "0 0 8px", fontFamily: FONT }}>
              {d.resultTitle}
            </h2>
            <p style={{ fontSize: "16px", color: COLORS.textSecondary, margin: 0, lineHeight: 1.6 }}>
              {d.resultSub}
            </p>
          </div>

          {/* Module 1 recap */}
          {module1Data && (
            <div style={{ ...styles.card, marginBottom: "12px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: module1Data.signalCount <= 3 ? COLORS.greenDim : module1Data.signalCount <= 6 ? COLORS.orangeDim : COLORS.coralDim,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0,
              }}>
                👁️
              </div>
              <div>
                <div style={{ fontSize: "11px", color: COLORS.textTertiary, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                  {d.recapModule1}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary }}>
                  {module1Data.signalCount}/10
                </div>
              </div>
            </div>
          )}

          {/* Module 2 recap */}
          {module2Data && (
            <div style={{ ...styles.card, marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: module2Data.score >= 72 ? COLORS.greenDim : module2Data.score >= 50 ? COLORS.orangeDim : COLORS.coralDim,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0,
              }}>
                🧭
              </div>
              <div>
                <div style={{ fontSize: "11px", color: COLORS.textTertiary, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                  {d.recapModule2}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary }}>
                  {module2Data.score}%
                </div>
              </div>
            </div>
          )}

          {/* Digital vs Organic insight */}
          <div style={{ ...styles.cardAccent, marginBottom: "16px" }}>
            <div style={styles.sectionTitle}>{d.digitalInsightTitle}</div>
            <p style={{ fontSize: "15px", color: COLORS.textSecondary, lineHeight: 1.7, margin: 0 }}>
              {insight}
            </p>
          </div>

          {/* Reflections displayed back */}
          {hasReflections && (
            <div style={{ ...styles.card, marginBottom: "16px" }}>
              <div style={styles.sectionTitle}>{d.reflectionsTitle}</div>
              {questions.map((q) => {
                const answer = reflections[q.id];
                if (!answer || !answer.trim()) return null;
                return (
                  <div key={q.id} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: "13px", color: COLORS.coral, fontWeight: 600, marginBottom: "6px" }}>
                      {q.question}
                    </div>
                    <div style={{ fontSize: "15px", color: COLORS.textPrimary, lineHeight: 1.6, fontStyle: "italic" }}>
                      {answer}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Closing reflection */}
          <div style={{
            ...styles.cardAccent, marginBottom: "24px", textAlign: "center",
            padding: "32px 24px",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧭</div>
            <p style={{
              fontSize: "18px", fontWeight: 700, color: COLORS.textPrimary,
              lineHeight: 1.5, margin: 0, fontStyle: "italic",
            }}>
              {d.closingReflection}
            </p>
          </div>

          {/* PRIMARY CTA — Complete journey, go to full Results */}
          <div style={{
            marginBottom: "32px",
            background: `linear-gradient(135deg, ${COLORS.coral}15, ${COLORS.coral}08)`,
            border: `2px solid ${COLORS.coral}`,
            borderRadius: "20px",
            padding: "24px 20px",
            textAlign: "center",
            boxShadow: `0 8px 32px ${COLORS.coral}20`,
          }}>
            {/* Badge */}
            <div style={{
              display: "inline-block",
              fontSize: "10px", fontWeight: 800, letterSpacing: "1.5px",
              color: "#fff", background: COLORS.coral,
              padding: "4px 12px", borderRadius: "12px",
              marginBottom: "12px",
            }}>
              {d.completeBadge}
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "6px", fontFamily: FONT }}>
              {d.completeTitle}
            </div>
            <div style={{ fontSize: "14px", color: COLORS.textSecondary, marginBottom: "18px", lineHeight: 1.5 }}>
              {d.completeSub}
            </div>
            <button style={{ ...styles.btn, width: "100%", maxWidth: "320px" }} onClick={completeModule}>
              {d.completeCta}
            </button>
          </div>

          {/* SECONDARY: Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "16px",
          }}>
            <div style={{ flex: 1, height: "1px", background: COLORS.border }} />
            <div style={{
              fontSize: "10px", color: COLORS.textMuted,
              textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600,
            }}>
              {d.exploreLabel}
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
              <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>{d.escLabTitle}</div>
              <div style={{ fontSize: "11px", color: COLORS.textSecondary, lineHeight: 1.4 }}>{d.escLabSub}</div>
              <div style={{ fontSize: "11px", color: COLORS.coral, fontWeight: 600, marginTop: "4px" }}>{d.escLabCta}</div>
            </a>

            {/* Escape Now */}
            <a href={d.tidycal} target="_blank" rel="noopener noreferrer"
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
              <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>{d.escNowTitle}</div>
              <div style={{ fontSize: "11px", color: COLORS.textSecondary, lineHeight: 1.4 }}>{d.escNowSub}</div>
              <div style={{ fontSize: "11px", color: COLORS.coral, fontWeight: 600, marginTop: "4px" }}>{d.escNowCta}</div>
            </a>
          </div>

          {/* Book */}
          <div style={{ ...styles.card, marginBottom: "16px", textAlign: "center" }}>
            <img
              src={lang === "fr" ? "/book-fr.png" : "/book-en.png"}
              alt={lang === "fr" ? "Le Piège du Talent" : "The Talent Trap"}
              style={{ maxWidth: "140px", width: "100%", height: "auto", marginBottom: "16px", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))" }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "4px" }}>{d.bookTitle}</div>
            <div style={{ fontSize: "13px", color: COLORS.textSecondary, marginBottom: "14px", lineHeight: 1.6 }}>{d.bookSub}</div>
            <a href={lang === "fr" ? "https://www.monexpansion.com/#livre" : "https://www.monexpansion.com/en/talent-trap/#livre"} target="_blank" rel="noopener noreferrer"
              style={{ ...styles.btnOutline, display: "inline-block", textDecoration: "none" }}>
              {d.bookCta}
            </a>
          </div>

        </div>
      </div>
    );
  }

  return null;
}
