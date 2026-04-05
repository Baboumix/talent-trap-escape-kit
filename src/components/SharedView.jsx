import { useEffect, useState } from "react";
import { COLORS, FONT, styles, fadeStyle } from "./SharedStyles";
import { T, NEED_NAMES } from "../data/translations";
import { getScore, getVerdict, topGaps } from "../data/scoring";
import { TENSION_PROFILES, ARCHETYPES, SIGNALS, SIGNAL_LABELS } from "../data/signals";
import { DIRECTION } from "../data/direction";

const S_TEXT = {
  fr: {
    surtitre: "PROFIL PARTAGÉ",
    title_pre: "",
    title_has: " a partagé son profil d'expansion",
    title_anon: "Profil d'expansion partagé",
    sub: "Une personne qui te connaît t'a envoyé son diagnostic. Prends un moment. Lis. Tu peux confirmer ou nuancer.",

    sec_tension: "Profil de tension",
    signals_of: "sur 10 signaux",
    sec_archetype: "Archétype",
    sec_top_signals: "Signaux les plus forts",

    sec_needs: "Carte des besoins",
    sec_gaps: "Là où ça coince",

    sec_reflections: "Ses réflexions",
    no_reflection: "—",

    prompt_title: "Qu'est-ce que ça t'évoque ?",
    prompt_body: "Ce profil correspond-il à ce que tu vois de cette personne ? Est-ce qu'il y a quelque chose qui te surprend, que tu confirmes, ou que tu vois différemment ? Dis-lui.",

    own_title: "Toi aussi, fais ton diagnostic",
    own_sub: "5 minutes pour le Module 1. 28 minutes pour les 3 modules complets.",
    own_cta: "Commencer mon diagnostic →",

    footer: "Basé sur les Six Besoins Humains Essentiels · Robbins-Madanes Training",
    footer2: "Julien Klein · monexpansion.com",
  },
  en: {
    surtitre: "SHARED PROFILE",
    title_pre: "",
    title_has: " shared their expansion profile",
    title_anon: "Shared expansion profile",
    sub: "Someone who knows you sent you their diagnostic. Take a moment. Read. You can confirm or nuance it.",

    sec_tension: "Tension profile",
    signals_of: "out of 10 signals",
    sec_archetype: "Archetype",
    sec_top_signals: "Strongest signals",

    sec_needs: "Needs map",
    sec_gaps: "Where it breaks down",

    sec_reflections: "Their reflections",
    no_reflection: "—",

    prompt_title: "What does this evoke for you?",
    prompt_body: "Does this profile match what you see of this person? Is there something that surprises you, that you confirm, or that you see differently? Tell them.",

    own_title: "Take your own diagnostic",
    own_sub: "5 minutes for Module 1. 28 minutes for all 3 modules.",
    own_cta: "Start my diagnostic →",

    footer: "Based on the Six Core Human Needs · Robbins-Madanes Training",
    footer2: "Julien Klein · monexpansion.com",
  },
};

export default function SharedView({ data }) {
  const [vis, setVis] = useState(false);
  const { progress, firstName, lang } = data;
  const t = S_TEXT[lang] || S_TEXT.fr;
  const tLang = T[lang];
  const d = DIRECTION[lang];

  useEffect(() => {
    const ti = setTimeout(() => setVis(true), 30);
    return () => clearTimeout(ti);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Extract module data
  const { module1, module2, module3 } = progress;

  const tension = module1 ? TENSION_PROFILES[lang][module1.tensionProfile] : null;
  const archetype = module1 ? ARCHETYPES[lang][module1.archetype] : null;
  const signals = SIGNALS[lang];
  const sigLabels = SIGNAL_LABELS[lang];
  const topSigs = module1?.ratings
    ? signals.filter((s) => (module1.ratings[s.id] || 0) >= 3)
      .sort((a, b) => (module1.ratings[b.id] || 0) - (module1.ratings[a.id] || 0))
      .slice(0, 3)
    : [];

  const verdict = module2 ? getVerdict(module2.sat || {}, module2.imp || {}, lang) : null;
  const gaps = module2 ? topGaps(module2.sat || {}, module2.imp || {}).slice(0, 3) : [];

  const reflections = module3?.reflections || {};
  const hasReflections = Object.values(reflections).some((v) => v?.trim());

  const section = { ...styles.card, marginBottom: "16px" };
  const sectionLabel = {
    fontSize: "10px", color: COLORS.coral, fontWeight: 700,
    letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px",
  };

  const goHome = () => { window.location.href = "/"; };

  return (
    <div style={{ ...styles.pageTop, ...fadeStyle(vis) }}>
      <div style={{ maxWidth: 620, width: "100%" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ ...styles.surtitre, marginBottom: "12px" }}>{t.surtitre}</div>
          <h1 style={{ fontSize: "clamp(24px,5vw,32px)", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.2, margin: "0 0 12px", fontFamily: FONT }}>
            {firstName ? (
              <>
                <span style={{ background: COLORS.coralGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {firstName}
                </span>
                {t.title_has}
              </>
            ) : t.title_anon}
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.textSecondary, margin: 0, lineHeight: 1.6 }}>{t.sub}</p>
        </div>

        {/* Module 1 — Tension */}
        {module1 && tension && archetype && (
          <div style={section}>
            <div style={sectionLabel}>{t.sec_tension}</div>

            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ fontSize: "22px", fontWeight: 800, color: tension.color, marginBottom: "4px", fontFamily: FONT }}>
                {tension.label}
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: tension.color, lineHeight: 1 }}>
                {module1.signalCount}<span style={{ fontSize: "13px", color: COLORS.textTertiary }}>/10</span>
              </div>
              <div style={{ fontSize: "11px", color: COLORS.textSecondary, marginTop: "4px" }}>{t.signals_of}</div>
            </div>

            {/* Archetype */}
            <div style={{
              padding: "14px", background: `${COLORS.coral}08`, borderRadius: "12px",
              border: `1px solid ${COLORS.borderAccent}`, textAlign: "center",
              marginBottom: topSigs.length > 0 ? "14px" : 0,
            }}>
              <div style={{ fontSize: "10px", color: COLORS.coral, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                {t.sec_archetype}
              </div>
              <div style={{ fontSize: "24px", marginBottom: "4px" }}>{archetype.icon}</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "4px" }}>
                {archetype.label}
              </div>
              <div style={{ fontSize: "12px", color: COLORS.textSecondary, lineHeight: 1.5 }}>
                {archetype.desc}
              </div>
            </div>

            {/* Top signals */}
            {topSigs.length > 0 && (
              <>
                <div style={{ fontSize: "11px", color: COLORS.textTertiary, fontWeight: 600, marginBottom: "8px" }}>
                  {t.sec_top_signals}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {topSigs.map((sig) => {
                    const val = module1.ratings[sig.id];
                    const c = val >= 4 ? COLORS.coral : COLORS.orange;
                    return (
                      <div key={sig.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c, flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: "12px", color: COLORS.textPrimary, fontWeight: 600 }}>{sig.label}</div>
                        <div style={{ fontSize: "10px", color: c, fontWeight: 700 }}>{sigLabels[val - 1]?.label || ""}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Module 2 — Needs */}
        {module2 && verdict && (
          <div style={section}>
            <div style={sectionLabel}>{t.sec_needs}</div>

            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: verdict.color, lineHeight: 1 }}>
                {module2.score}<span style={{ fontSize: "13px", color: COLORS.textTertiary }}>/100</span>
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: verdict.color, marginTop: "6px", fontFamily: FONT }}>
                {verdict.title}
              </div>
            </div>

            {/* Gaps */}
            {gaps.length > 0 && (
              <>
                <div style={{ fontSize: "11px", color: COLORS.textTertiary, fontWeight: 600, marginBottom: "10px" }}>
                  {t.sec_gaps}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {gaps.map((n) => {
                    const pct = (n.sat / 5) * 100;
                    const c = n.sat <= 2 ? COLORS.coral : n.sat <= 3 ? COLORS.orange : COLORS.green;
                    return (
                      <div key={n.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: COLORS.textPrimary }}>{NEED_NAMES[lang][n.id]}</span>
                          <span style={{ fontSize: "10px", fontWeight: 600, color: c }}>{tLang.sat[n.sat - 1].label}</span>
                        </div>
                        <div style={{ position: "relative", height: "5px", borderRadius: "3px", background: "#1a1a1a", overflow: "hidden" }}>
                          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: "3px", background: c }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Module 3 — Reflections (the emotional core) */}
        {hasReflections && (
          <div style={{ ...section, borderColor: COLORS.borderAccent }}>
            <div style={sectionLabel}>{t.sec_reflections}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {d.questions.map((q, i) => {
                const answer = reflections[q.id]?.trim();
                if (!answer) return null;
                return (
                  <div key={q.id} style={{
                    padding: "12px 14px", background: "#0f0f0f",
                    borderRadius: "10px", borderLeft: `2px solid ${COLORS.coral}`,
                  }}>
                    <div style={{ fontSize: "11px", color: COLORS.textSecondary, fontWeight: 600, marginBottom: "6px" }}>
                      {i + 1}. {q.question}
                    </div>
                    <div style={{
                      fontSize: "14px", color: COLORS.textPrimary,
                      lineHeight: 1.6, whiteSpace: "pre-wrap", fontStyle: "italic",
                    }}>
                      "{answer}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Prompt for recipient */}
        <div style={{
          ...styles.cardAccent, marginBottom: "24px", textAlign: "center",
          background: `linear-gradient(135deg, ${COLORS.coral}12, ${COLORS.coral}06)`,
        }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "10px", fontFamily: FONT }}>
            {t.prompt_title}
          </div>
          <div style={{ fontSize: "14px", color: COLORS.textSecondary, lineHeight: 1.6 }}>
            {t.prompt_body}
          </div>
        </div>

        {/* CTA to create own */}
        <div style={{
          ...styles.card, marginBottom: "16px", textAlign: "center",
          background: "#0f0f0f", border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ fontSize: "17px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "6px" }}>
            {t.own_title}
          </div>
          <div style={{ fontSize: "13px", color: COLORS.textSecondary, marginBottom: "16px", lineHeight: 1.5 }}>
            {t.own_sub}
          </div>
          <button style={{ ...styles.btn }} onClick={goHome}>
            {t.own_cta}
          </button>
        </div>

        {/* Footer */}
        <p style={{ fontSize: "11px", color: COLORS.textMuted, textAlign: "center", lineHeight: 1.5, marginTop: "24px" }}>
          {t.footer}<br />{t.footer2}
        </p>
      </div>
    </div>
  );
}
