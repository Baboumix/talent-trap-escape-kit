import { useState, useEffect, useCallback } from "react";
import { T, NEED_IDS, NEED_NAMES, DEEP } from "./data/translations";
import { DEFS, HD } from "./data/content";
import {
  getScore, getVerdict, topGaps, topStrengths, vigilanceNeeds,
  getPatterns, getSolutions, getClosingQuestion, getExplanation,
  saveResult, loadResult,
} from "./data/scoring";

const CORAL = "linear-gradient(135deg, #FE6B63, #FF8A54)";
const SAT_COLORS = ["#FE6B63", "#FF8A54", "#888", "#A3E635", "#4ADE80"];
const IMP_COLORS = ["#666", "#FF8A54", "#FE6B63"];
const IMP_SIZES = [40, 56, 72];

export default function App() {
  const [lang, setLang] = useState("fr");
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(null);
  const [needIdx, setNeedIdx] = useState(0);
  const [sat, setSat] = useState({});
  const [imp, setImp] = useState({});
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [vis, setVis] = useState(true);
  const [prevResult, setPrevResult] = useState(null);

  const t = T[lang];
  const nn = NEED_NAMES[lang];
  const nid = NEED_IDS[needIdx];

  // Check localStorage on mount
  useEffect(() => {
    const saved = loadResult();
    if (saved) setPrevResult(saved);
  }, []);

  // Fade transition helper
  const fadeTo = useCallback((nextStep) => {
    setVis(false);
    setTimeout(() => { setStep(nextStep); window.scrollTo(0, 0); }, 250);
  }, []);

  useEffect(() => {
    setVis(false);
    const ti = setTimeout(() => setVis(true), 60);
    return () => clearTimeout(ti);
  }, [step, needIdx]);

  const selProfile = (id) => {
    setProfile(id);
    setSat({});
    setImp({});
    setNeedIdx(0);
    setVis(false);
    setTimeout(() => { setStep(2); window.scrollTo(0, 0); }, 350);
  };

  const nextNeed = () => {
    setVis(false);
    setTimeout(() => {
      if (needIdx < 5) setNeedIdx(needIdx + 1);
      else { setStep(3); window.scrollTo(0, 0); }
    }, 250);
  };

  const prevNeed = () => {
    setVis(false);
    setTimeout(() => {
      if (needIdx > 0) setNeedIdx(needIdx - 1);
      else { setStep(1); window.scrollTo(0, 0); }
    }, 200);
  };

  const submitEmail = () => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      setEmailErr(t.gate_err);
      return;
    }
    setEmailErr("");
    setUnlocked(true);
    // Save result to localStorage
    saveResult({ lang, profile, satisfaction: sat, importance: imp, score: getScore(sat, imp), verdict: getVerdict(sat, imp, lang).level });
    // TODO: webhook call for email capture
  };

  const restorePrevResult = () => {
    if (!prevResult) return;
    setLang(prevResult.lang || "fr");
    setProfile(prevResult.profile);
    setSat(prevResult.satisfaction || {});
    setImp(prevResult.importance || {});
    setUnlocked(true);
    setStep(3);
  };

  const canContinue = sat[nid] !== undefined && imp[nid] !== undefined;

  // Shared styles
  const card = { background: "#141414", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "20px", textAlign: "left" };
  const btnStyle = { background: CORAL, color: "#fff", border: "none", borderRadius: "8px", padding: "14px 32px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',system-ui,sans-serif" };
  const btnOff = { ...btnStyle, opacity: 0.3, cursor: "not-allowed" };
  const page = {
    minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: step === 3 ? "flex-start" : "center",
    padding: step === 3 ? "56px 20px 48px" : "24px 20px",
    opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(16px)",
    transition: "opacity 0.35s, transform 0.35s",
  };

  return (
    <div style={{ background: "#0A0A0A", color: "#E0E0E0", fontFamily: "'DM Sans',system-ui,sans-serif", minHeight: "100vh" }}>
      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: "#1a1a1a", zIndex: 100 }}>
        <div style={{ height: "100%", width: `${step === 2 ? ((1 + needIdx / 6) / 3) * 100 : (step / 3) * 100}%`, background: CORAL, transition: "width 0.5s" }} />
      </div>

      {/* Lang switch */}
      <div style={{ position: "fixed", top: 12, right: step === 2 ? "60px" : "20px", zIndex: 200, display: "flex", gap: "4px", background: "#1a1a1a", borderRadius: "6px", padding: "2px" }}>
        {["fr", "en"].map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding: "4px 10px", borderRadius: "4px", border: "none",
            background: lang === l ? "#FE6B63" : "transparent",
            color: lang === l ? "#fff" : "#888",
            fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
          }}>{l}</button>
        ))}
      </div>

      {/* Back button (step 2) */}
      {step === 2 && (
        <button onClick={prevNeed} style={{ position: "fixed", top: 12, left: 20, fontSize: "13px", color: "#555", background: "none", border: "none", cursor: "pointer", zIndex: 100, fontFamily: "inherit" }}>
          {t.back}
        </button>
      )}
      {step === 2 && <div style={{ position: "fixed", top: 14, right: "100px", fontSize: "13px", color: "#444", zIndex: 100 }}>{needIdx + 1}/6</div>}

      {/* ═══ WELCOME ═══ */}
      {step === 0 && (
        <div style={page}>
          <div style={{ maxWidth: 520, textAlign: "center" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#FE6B63", marginBottom: "16px", textTransform: "uppercase", fontWeight: 600 }}>{t.surtitre}</div>
            <h1 style={{ fontSize: "clamp(32px,7vw,48px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px" }}>
              {t.h1_1}<span style={{ backgroundImage: CORAL, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.h1_prop}</span>
              {t.h1_2}<span style={{ backgroundImage: CORAL, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.h1_piege}</span>
              <span style={{ backgroundImage: CORAL, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.h1_q}</span>
            </h1>
            <p style={{ fontSize: "16px", color: "#999", margin: "0 0 32px" }}>{t.sub}</p>

            {/* Previous result prompt */}
            {prevResult && (
              <div style={{ ...card, marginBottom: "24px", textAlign: "center" }}>
                <p style={{ fontSize: "14px", color: "#ccc", marginBottom: "12px" }}>
                  {t.prev_result_msg.replace("{date}", new Date(prevResult.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" }))}
                </p>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button style={{ ...btnStyle, padding: "10px 20px", fontSize: "13px" }} onClick={restorePrevResult}>{t.prev_result_view}</button>
                  <button style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 600, background: "transparent", color: "#FE6B63", border: "1px solid #FE6B63", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}
                    onClick={() => { setPrevResult(null); fadeTo(1); }}>{t.prev_result_redo}</button>
                </div>
              </div>
            )}

            {!prevResult && <button style={btnStyle} onClick={() => fadeTo(1)}>{t.cta_start}</button>}
            <p style={{ fontSize: "12px", color: "#444", marginTop: "28px", lineHeight: 1.5 }}>{t.footer}<br />{t.footer2}</p>
          </div>
        </div>
      )}

      {/* ═══ STEP 1: PROFILE ═══ */}
      {step === 1 && (
        <div style={page}>
          <div style={{ maxWidth: 560, width: "100%" }}>
            <p style={{ fontSize: "13px", color: "#FE6B63", marginBottom: "8px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>{t.step1_label}</p>
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>{t.step1_title}</h2>
            <p style={{ fontSize: "14px", color: "#888", margin: "0 0 24px" }}>{t.step1_sub}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {t.profiles.map((p) => (
                <div key={p.id} onClick={() => selProfile(p.id)} style={{ ...card, cursor: "pointer", transition: "all 0.3s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FE6B63"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    <span style={{ fontSize: "28px" }}>{p.icon}</span>
                    <div>
                      <div style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{p.label}</div>
                      <div style={{ fontSize: "14px", color: "#999", lineHeight: 1.5 }}>{p.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 2: NEEDS ═══ */}
      {step === 2 && profile && (
        <div style={page}>
          <div style={{ maxWidth: 520, width: "100%" }}>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "20px", justifyContent: "center" }}>
              {NEED_IDS.map((id, i) => (
                <div key={id} style={{
                  width: i === needIdx ? "24px" : "8px", height: "8px", borderRadius: "4px",
                  background: i < needIdx ? "#4ADE80" : i === needIdx ? "#FE6B63" : "#333",
                  transition: "all 0.3s",
                }} />
              ))}
            </div>

            {/* Need name + deep tag */}
            <div style={{ textAlign: "center", marginBottom: "12px" }}>
              {DEEP.includes(nid) && (
                <span style={{ fontSize: "10px", color: "#FF8A54", fontWeight: 700, background: "#FF8A5420", padding: "3px 10px", borderRadius: "4px", display: "inline-block", marginBottom: "8px" }}>
                  {t.deep_tag}
                </span>
              )}
              <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#FE6B63", margin: "0", textTransform: "uppercase", letterSpacing: "2px" }}>{nn[nid]}</h2>
            </div>

            {/* Definition */}
            <p style={{ fontSize: "15px", color: "#ccc", lineHeight: 1.7, margin: "0 0 24px" }}>{DEFS[lang][profile][nid]}</p>

            {/* IMPORTANCE */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>{t.imp_q}</div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "flex-end" }}>
                {t.imp.map((level, i) => {
                  const on = imp[nid] === level.v;
                  const c = IMP_COLORS[i];
                  return (
                    <div key={level.v} onClick={() => setImp((p) => ({ ...p, [nid]: level.v }))} style={{ cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                      <div style={{
                        width: `${IMP_SIZES[i]}px`, height: `${IMP_SIZES[i]}px`, borderRadius: "50%", margin: "0 auto 8px",
                        border: on ? `3px solid ${c}` : "2px solid #333",
                        background: on ? `${c}20` : "#111",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                        boxShadow: on ? `0 0 16px ${c}30` : "none",
                      }}>
                        <div style={{ width: `${IMP_SIZES[i] * 0.4}px`, height: `${IMP_SIZES[i] * 0.4}px`, borderRadius: "50%", background: on ? c : "#333", transition: "all 0.2s" }} />
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: on ? 700 : 400, color: on ? c : "#888" }}>{level.label}</div>
                      <div style={{ fontSize: "10px", color: "#555" }}>{level.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SATISFACTION */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>{t.sat_q}</div>
              <div style={{ display: "flex", gap: "3px", borderRadius: "8px", overflow: "hidden" }}>
                {t.sat.map((level, i) => {
                  const on = sat[nid] === level.v;
                  const c = SAT_COLORS[i];
                  return (
                    <div key={level.v} onClick={() => setSat((p) => ({ ...p, [nid]: level.v }))} style={{
                      flex: 1, padding: on ? "14px 2px" : "10px 2px", cursor: "pointer", textAlign: "center",
                      background: on ? c : `${c}20`, transition: "all 0.2s",
                    }}>
                      <div style={{ fontSize: on ? "11px" : "10px", fontWeight: on ? 700 : 400, color: on ? "#fff" : i === 2 ? "#bbb" : c, lineHeight: 1.3, transition: "all 0.2s" }}>
                        {level.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              {sat[nid] && (
                <div style={{ textAlign: "center", marginTop: "6px", fontSize: "12px", color: SAT_COLORS[sat[nid] - 1], fontWeight: 600 }}>
                  {t.sat[sat[nid] - 1].label}
                </div>
              )}
            </div>

            {/* Continue button */}
            <div style={{ textAlign: "center" }}>
              <button style={canContinue ? btnStyle : btnOff} onClick={() => canContinue && nextNeed()}>
                {needIdx < 5 ? t.next_need : t.see_result}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: RESULTS ═══ */}
      {step === 3 && (
        <div style={page}>
          <div style={{ maxWidth: 580, width: "100%", position: "relative" }}>

            {/* EMAIL GATE OVERLAY */}
            {!unlocked && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "120px" }}>
                <div style={{ background: "#0A0A0Aee", backdropFilter: "blur(4px)", borderRadius: "16px", padding: "32px 24px", maxWidth: 400, width: "100%", textAlign: "center", border: "1px solid #2a2a2a" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>&#x1F4CA;</div>
                  <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>{t.gate_title}</h2>
                  <p style={{ fontSize: "14px", color: "#888", margin: "0 0 20px" }}>{t.gate_sub}</p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailErr(""); }}
                      onKeyDown={(e) => e.key === "Enter" && submitEmail()}
                      placeholder="ton@email.com"
                      style={{ flex: 1, padding: "14px 16px", borderRadius: "8px", border: emailErr ? "1px solid #FE6B63" : "1px solid #333", background: "#141414", color: "#fff", fontSize: "15px", outline: "none", fontFamily: "inherit" }} />
                    <button style={btnStyle} onClick={submitEmail}>{t.gate_btn}</button>
                  </div>
                  {emailErr && <p style={{ fontSize: "13px", color: "#FE6B63", marginTop: "4px" }}>{emailErr}</p>}
                  <p style={{ fontSize: "12px", color: "#555", marginTop: "12px" }}>{t.gate_spam}</p>
                </div>
              </div>
            )}

            {/* RESULTS (blurred if locked) */}
            <div style={{ filter: unlocked ? "none" : "blur(8px)", pointerEvents: unlocked ? "auto" : "none", transition: "filter 0.5s ease" }}>
              <Results lang={lang} t={t} nn={nn} sat={sat} imp={imp} profile={profile} btnStyle={btnStyle} card={card} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ RESULTS COMPONENT ═══
function Results({ lang, t, nn, sat, imp, profile, btnStyle, card }) {
  const v = getVerdict(sat, imp, lang);
  const sc = getScore(sat, imp);
  const tg = topGaps(sat, imp);
  const hasGaps = tg.length > 0;
  const str = topStrengths(sat, imp);
  const vig = vigilanceNeeds(sat, imp);
  const pat = getPatterns(profile, sat, imp, lang);
  const sol = getSolutions(profile, sat, imp, lang);
  const cq = getClosingQuestion(profile, sat, imp, lang);
  const expl = getExplanation(profile, sat, imp, lang);
  const pd = t.profiles.find((p) => p.id === profile);
  const today = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      {/* Verdict */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <p style={{ fontSize: "13px", color: "#FE6B63", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>{t.res_label}</p>
        <h2 style={{ fontSize: "clamp(26px,5vw,34px)", fontWeight: 800, color: v.color, margin: "0 0 4px" }}>{v.title}</h2>
      </div>

      {/* Score */}
      <div style={{ ...card, marginBottom: "12px", textAlign: "center" }}>
        <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{t.score_label}</div>
        <div style={{ fontSize: "42px", fontWeight: 800, color: v.color }}>{sc}<span style={{ fontSize: "20px", color: "#888" }}>/100</span></div>
        <div style={{ fontSize: "12px", color: "#777", marginTop: "8px" }}>{v.sub}</div>
        {tg.length > 0 && (
          <div style={{ fontSize: "12px", color: "#FE6B63", marginTop: "6px", fontWeight: 600 }}>
            {t.biggest_gap}: {nn[tg[0].id]} ({tg[0].imp === 3 ? t.essential : t.important_w}, {T[lang].sat[tg[0].sat - 1].label.toLowerCase()})
          </div>
        )}
      </div>

      {/* Gap bars */}
      {hasGaps && (
        <div style={{ ...card, marginBottom: "12px", padding: "24px 20px" }}>
          <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>{t.sec_gaps}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {tg.map((n) => {
              const pct = (n.sat / 5) * 100;
              const c = n.sat <= 2 ? "#FE6B63" : n.sat <= 3 ? "#FF8A54" : "#4ADE80";
              return (
                <div key={n.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{nn[n.id]}</span>
                      {n.imp === 3 && <span style={{ fontSize: "10px", color: "#FE6B63", fontWeight: 700, background: "#FE6B6320", padding: "2px 6px", borderRadius: "4px" }}>{t.essential.toUpperCase()}</span>}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: c }}>{T[lang].sat[n.sat - 1].label}</span>
                  </div>
                  <div style={{ position: "relative", height: "28px", borderRadius: "6px", background: "#1a1a1a", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: "6px", background: n.sat <= 2 ? "linear-gradient(90deg,#dc2626,#FE6B63)" : n.sat <= 3 ? "linear-gradient(90deg,#f59e0b,#FF8A54)" : "linear-gradient(90deg,#22c55e,#4ADE80)", transition: "width 1s cubic-bezier(0.22,1,0.36,1)" }} />
                    {(100 - pct) > 15 && n.sat <= 3 && (
                      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${100 - pct}%`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: c, opacity: 0.8 }}>{n.sat <= 2 ? t.missing : t.at_risk}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "16px", padding: "12px", background: "#1a0f0f", borderRadius: "8px", border: "1px solid #2a1a1a" }}>
            <div style={{ fontSize: "12px", color: "#999" }}>{t.sec_gaps_sub}</div>
          </div>
        </div>
      )}

      {/* OK verdict: strengths + vigilance */}
      {v.level === "ok" && (
        <>
          {str.length > 0 && (
            <div style={{ ...card, marginBottom: "12px", background: "#0f1a0f", border: "1px solid #2a3a2a" }}>
              <div style={{ fontSize: "11px", color: "#4ADE80", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", fontWeight: 600 }}>{t.sec_works}</div>
              {str.map((n) => (
                <div key={n.id} style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.6, padding: "6px 0 6px 16px", borderLeft: "2px solid #4ADE80", marginBottom: "8px" }}>
                  <strong>{nn[n.id]}</strong> — {T[lang].sat[n.sat - 1].label}
                </div>
              ))}
            </div>
          )}
          {vig.length > 0 && (
            <div style={{ ...card, marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", color: "#FF8A54", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", fontWeight: 600 }}>{t.sec_vigil}</div>
              {vig.map((n) => (
                <div key={n.id} style={{ fontSize: "14px", color: "#bbb", lineHeight: 1.6, padding: "6px 0 6px 16px", borderLeft: "2px solid #FF8A54", marginBottom: "8px" }}>
                  <strong>{nn[n.id]}</strong> {t.vigil_text}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Healthy / Destructive */}
      {hasGaps && (
        <div style={{ ...card, marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>{t.sec_surface}</div>
          {tg.map((n) => (
            <div key={n.id} style={{ marginBottom: "14px", padding: "12px", background: "#0a0a0a", borderRadius: "8px", border: "1px solid #222" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{nn[n.id]}</div>
              <div style={{ fontSize: "13px", color: "#4ADE80", marginBottom: "4px", display: "flex", gap: "6px" }}>
                <span>&#x2726;</span><span>{t.healthy} : {HD[lang][profile][n.id].h}</span>
              </div>
              <div style={{ fontSize: "13px", color: "#FE6B63", display: "flex", gap: "6px" }}>
                <span>&#x2726;</span><span>{t.destructive} : {HD[lang][profile][n.id].d}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Why you're here */}
      <div style={{ ...card, marginBottom: "12px" }}>
        <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>{t.sec_why}</div>
        <div style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.7 }}>{expl}</div>
      </div>

      {/* Patterns */}
      {pat.length > 0 && (
        <div style={{ ...card, marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>{t.sec_observe}</div>
          {pat.map((p, i) => (
            <div key={i} style={{ fontSize: "14px", color: "#bbb", lineHeight: 1.6, padding: "6px 0 6px 16px", borderLeft: "2px solid #FE6B63", marginBottom: "8px" }}>{p}</div>
          ))}
        </div>
      )}

      {/* Solutions */}
      {sol.length > 0 && (
        <div style={{ ...card, marginBottom: "12px", background: "#0f1a0f", border: "1px solid #2a3a2a" }}>
          <div style={{ fontSize: "11px", color: "#4ADE80", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", fontWeight: 600 }}>{t.sec_pistes}</div>
          {sol.map((s, i) => (
            <div key={i} style={{ marginBottom: "14px", padding: "12px", background: "#0a140a", borderRadius: "8px", border: "1px solid #1a2a1a" }}>
              <div style={{ fontSize: "13px", color: "#FE6B63", marginBottom: "6px", display: "flex", gap: "6px" }}>
                <span>&#x2197;</span><span><strong>{t.today}</strong> {s.b}</span>
              </div>
              <div style={{ fontSize: "13px", color: "#4ADE80", display: "flex", gap: "6px" }}>
                <span>&#x2192;</span><span><strong>{t.objective}</strong> {s.a}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Closing question */}
      {v.level !== "ok" && cq && (
        <div style={{ ...card, marginBottom: "16px", borderColor: "#FE6B63", background: "#1a1010" }}>
          <div style={{ fontSize: "11px", color: "#FE6B63", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", fontWeight: 600 }}>{t.sec_question}</div>
          <div style={{ fontSize: "16px", color: "#fff", lineHeight: 1.6, fontStyle: "italic" }}>"{cq}"</div>
        </div>
      )}

      {/* Share card */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", textAlign: "center" }}>{t.share_label}</div>
        <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: CORAL }} />
          <div style={{ fontSize: "10px", color: "#666", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>TALENT TRAP ESCAPE KIT &middot; {today}</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: v.color, marginBottom: "4px" }}>{v.title}</div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: v.color, marginBottom: "4px" }}>{sc}<span style={{ fontSize: "16px", color: "#888" }}>/100</span></div>
          <div style={{ fontSize: "14px", color: "#888", marginBottom: "16px" }}>{pd?.icon} {pd?.label}</div>
          <div style={{ fontSize: "12px", color: "#FE6B63", fontWeight: 600, marginBottom: "4px" }}>{t.share_link}</div>
          <div style={{ fontSize: "10px", color: "#555" }}>monexpansion.com &middot; Julien Klein &middot; RMT</div>
        </div>
      </div>

      {/* 90 days */}
      <div style={{ ...card, marginBottom: "16px", background: "#0f0f1a", border: "1px solid #2a2a3a", textAlign: "center" }}>
        <div style={{ fontSize: "20px", marginBottom: "8px" }}>&#x1F4C5;</div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{t.d90_title}</div>
        <div style={{ fontSize: "13px", color: "#999", lineHeight: 1.6 }}>{t.d90_sub}</div>
      </div>

      {/* DOUBLE CTA */}
      {v.level !== "ok" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "48px" }}>
          {/* Escape Lab (primary) */}
          <div style={{ ...card, textAlign: "center", background: "#111", border: "1px solid #333" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{t.esc_lab_title}</div>
            <div style={{ fontSize: "13px", color: "#999", marginBottom: "16px" }}>{t.esc_lab_sub}</div>
            <a href={lang === "fr" ? "https://monexpansion.com/fr/escape-lab/" : "https://monexpansion.com/fr/escape-lab/"} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", ...btnStyle, textDecoration: "none" }}>{t.esc_lab_cta}</a>
          </div>
          {/* Escape Now (secondary) */}
          <div style={{ ...card, textAlign: "center", background: "#1a1010", border: "1px solid #FE6B6340" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{t.esc_now_title}</div>
            <div style={{ fontSize: "13px", color: "#999", marginBottom: "16px" }}>{t.esc_now_sub}</div>
            <a href={t.tidycal} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "transparent", color: "#FE6B63", border: "1px solid #FE6B63", borderRadius: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, textDecoration: "none", fontFamily: "inherit" }}>{t.esc_now_cta}</a>
          </div>
          <p style={{ fontSize: "12px", color: "#444", textAlign: "center", lineHeight: 1.5 }}>{t.esc_footer}<br />{t.footer2}</p>
        </div>
      ) : (
        <div style={{ ...card, textAlign: "center", background: "#111", border: "1px solid #333", marginBottom: "48px" }}>
          <p style={{ fontSize: "15px", color: "#ddd", lineHeight: 1.6, margin: "0 0 16px" }}>{t.esc_ok_text}</p>
          <a href="https://monexpansion.com/fr/escape-lab/" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", ...btnStyle, textDecoration: "none" }}>{t.esc_lab_cta}</a>
          <p style={{ fontSize: "12px", color: "#444", marginTop: "12px", lineHeight: 1.5 }}>{t.esc_footer}<br />{t.footer2}</p>
        </div>
      )}
    </>
  );
}
