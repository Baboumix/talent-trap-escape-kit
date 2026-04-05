import { useEffect, useState } from "react";
import { COLORS, FONT, styles, fadeStyle } from "./SharedStyles";
import { T, NEED_NAMES } from "../data/translations";
import { getScore, getVerdict, topGaps, getClosingQuestion, getExplanation } from "../data/scoring";
import { TENSION_PROFILES, ARCHETYPES, SIGNALS, SIGNAL_LABELS } from "../data/signals";
import { DIRECTION } from "../data/direction";

const R_TEXT = {
  fr: {
    surtitre: "PROFIL COMPLET",
    title: "Ton profil d'expansion",
    sub: "Les 3 modules combinés, pour te garder avec toi-même.",
    date_label: "Complété le",
    back: "← Retour au parcours",

    sec_tension: "Module 1 · Profil de tension",
    sec_archetype: "Ton archétype",
    sec_signals: "Tes signaux les plus forts",
    signals_of: "sur 10 signaux",

    sec_needs: "Module 2 · Carte des besoins",
    sec_gaps: "Là où ça coince",
    sec_closing: "La question à garder avec toi",

    sec_direction: "Module 3 · Direction organique",
    sec_reflections: "Tes réflexions",
    no_reflection: "Pas encore de réponse",

    share_label: "Ton résumé",
    share_hint: "Envoie ce diagnostic à un ami créatif qui en a besoin.",
    share_link: "Fais le test → kit.monexpansion.com",

    d90_title: "Refais ce diagnostic dans 90 jours.",
    d90_sub: "Pour mesurer ta progression.",

    esc_lab_title: "Commence à sortir du piège. Avec un groupe.",
    esc_lab_sub: "12 créatifs dans la même situation, 3 mois, sessions live avec Julien, groupe privé.",
    esc_lab_cta: "Découvrir l'Escape Lab →",

    esc_now_title: "Tu veux régler ça maintenant ?",
    esc_now_sub: "4 sessions de coaching intensif avec Julien, calibrées sur ton diagnostic. Appel de découverte gratuit.",
    esc_now_cta: "Réserver un appel gratuit →",

    book_title: "Approfondir avec le livre",
    book_sub: "170 pages, le mode d'emploi complet. Les histoires de Hong, Sofia et Emma.",
    book_cta: "Découvrir le livre →",

    tidycal: "https://tidycal.com/julienklein/decouverte",
    book_url: "https://www.monexpansion.com/#livre",
  },
  en: {
    surtitre: "FULL PROFILE",
    title: "Your expansion profile",
    sub: "The 3 modules combined, to keep with yourself.",
    date_label: "Completed on",
    back: "← Back to journey",

    sec_tension: "Module 1 · Tension profile",
    sec_archetype: "Your archetype",
    sec_signals: "Your strongest signals",
    signals_of: "out of 10 signals",

    sec_needs: "Module 2 · Needs map",
    sec_gaps: "Where it breaks down",
    sec_closing: "The question to sit with",

    sec_direction: "Module 3 · Organic direction",
    sec_reflections: "Your reflections",
    no_reflection: "No answer yet",

    share_label: "Your summary",
    share_hint: "Send this diagnostic to a creative friend who needs it.",
    share_link: "Take the test → kit.monexpansion.com",

    d90_title: "Retake this diagnostic in 90 days.",
    d90_sub: "To measure your progress.",

    esc_lab_title: "Start breaking free. With a group.",
    esc_lab_sub: "12 creatives in the same situation, 3 months, live sessions with Julien, private group.",
    esc_lab_cta: "Discover the Escape Lab →",

    esc_now_title: "Want to fix this now?",
    esc_now_sub: "4 intensive coaching sessions with Julien, calibrated to your diagnostic. Free discovery call.",
    esc_now_cta: "Book a free call →",

    book_title: "Go deeper with the book",
    book_sub: "170 pages, the full manual. Hong, Sofia and Emma's full stories.",
    book_cta: "Discover the book →",

    tidycal: "https://tidycal.com/julienklein/discovery",
    book_url: "https://www.monexpansion.com/en/talent-trap/#livre",
  },
};

export default function Results({ lang, progress, onBack }) {
  const [vis, setVis] = useState(false);
  const t = R_TEXT[lang];
  const tLang = T[lang];
  const d = DIRECTION[lang];

  useEffect(() => {
    const ti = setTimeout(() => setVis(true), 30);
    return () => clearTimeout(ti);
  }, []);

  const { module1, module2, module3 } = progress;

  if (!module1 || !module2 || !module3) {
    return (
      <div style={{ ...styles.page, ...fadeStyle(vis) }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <p style={{ color: COLORS.textSecondary, marginBottom: "20px" }}>
            {lang === "fr" ? "Complète les 3 modules pour voir ton profil complet." : "Complete all 3 modules to see your full profile."}
          </p>
          <button style={styles.btnOutline} onClick={onBack}>{t.back}</button>
        </div>
      </div>
    );
  }

  // Module 1 data
  const tensionKey = module1.tensionProfile;
  const tension = TENSION_PROFILES[lang][tensionKey];
  const archetype = ARCHETYPES[lang][module1.archetype];
  const signals = SIGNALS[lang];
  const sigLabels = SIGNAL_LABELS[lang];
  const topSigs = signals
    .filter((s) => (module1.ratings?.[s.id] || 1) >= 3)
    .sort((a, b) => (module1.ratings[b.id] || 1) - (module1.ratings[a.id] || 1))
    .slice(0, 3);

  // Module 2 data
  const sat = module2.sat || {};
  const imp = module2.imp || {};
  const score = module2.score;
  const verdict = getVerdict(sat, imp, lang);
  const gaps = topGaps(sat, imp).slice(0, 3);
  const closingQ = module2.profile ? getClosingQuestion(module2.profile, sat, imp, lang) : "";

  // Module 3 reflections
  const reflections = module3.reflections || {};
  const questions = d.questions;

  // Date
  const today = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric", month: "long", year: "numeric",
  });

  // Section style shortcut
  const section = { ...styles.card, marginBottom: "16px" };
  const sectionLabel = {
    fontSize: "10px", color: COLORS.coral, fontWeight: 700,
    letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px",
  };

  return (
    <div style={{ ...styles.pageTop, ...fadeStyle(vis) }}>
      <div style={{ maxWidth: 620, width: "100%" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ ...styles.surtitre, marginBottom: "12px" }}>{t.surtitre}</div>
          <h1 style={{ fontSize: "clamp(30px,6vw,42px)", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.1, margin: "0 0 10px", fontFamily: FONT }}>
            {t.title}
          </h1>
          <p style={{ fontSize: "15px", color: COLORS.textSecondary, margin: "0 0 8px", lineHeight: 1.5 }}>{t.sub}</p>
          <p style={{ fontSize: "12px", color: COLORS.textMuted }}>{t.date_label} {today}</p>
        </div>

        {/* ═══ MODULE 1 · TENSION ═══ */}
        <div style={section}>
          <div style={sectionLabel}>{t.sec_tension}</div>

          {/* Profile + score */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "24px", fontWeight: 800, color: tension.color, marginBottom: "6px", fontFamily: FONT }}>
              {tension.label}
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: tension.color, lineHeight: 1 }}>
              {module1.signalCount}<span style={{ fontSize: "14px", color: COLORS.textTertiary }}>/10</span>
            </div>
            <div style={{ fontSize: "12px", color: COLORS.textSecondary, marginTop: "4px" }}>{t.signals_of}</div>
          </div>

          {/* Progress bar */}
          <div style={{ position: "relative", height: "8px", borderRadius: "4px", background: "#1a1a1a", overflow: "hidden", marginBottom: "20px" }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${(module1.signalCount / 10) * 100}%`,
              borderRadius: "4px",
              background: module1.signalCount <= 3 ? COLORS.greenGradient : module1.signalCount <= 6 ? `linear-gradient(90deg, #f59e0b, ${COLORS.orange})` : `linear-gradient(90deg, #dc2626, ${COLORS.coral})`,
            }} />
          </div>

          {/* Archetype */}
          <div style={{
            padding: "16px", background: `${COLORS.coral}08`, borderRadius: "12px",
            border: `1px solid ${COLORS.borderAccent}`, marginBottom: "16px", textAlign: "center",
          }}>
            <div style={{ fontSize: "10px", color: COLORS.coral, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
              {t.sec_archetype}
            </div>
            <div style={{ fontSize: "28px", marginBottom: "4px" }}>{archetype.icon}</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "4px" }}>
              {archetype.label}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.textSecondary, lineHeight: 1.5 }}>
              {archetype.desc}
            </div>
          </div>

          {/* Top signals */}
          {topSigs.length > 0 && (
            <>
              <div style={{ fontSize: "11px", color: COLORS.textTertiary, fontWeight: 600, marginBottom: "10px" }}>
                {t.sec_signals}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {topSigs.map((sig) => {
                  const val = module1.ratings[sig.id];
                  const c = val >= 4 ? COLORS.coral : COLORS.orange;
                  return (
                    <div key={sig.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c, flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: "13px", color: COLORS.textPrimary, fontWeight: 600 }}>{sig.label}</div>
                      <div style={{ fontSize: "11px", color: c, fontWeight: 700 }}>{sigLabels[val - 1].label}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ═══ MODULE 2 · NEEDS ═══ */}
        <div style={section}>
          <div style={sectionLabel}>{t.sec_needs}</div>

          {/* Score + verdict */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "36px", fontWeight: 800, color: verdict.color, lineHeight: 1 }}>
              {score}<span style={{ fontSize: "14px", color: COLORS.textTertiary }}>/100</span>
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: verdict.color, marginTop: "6px", fontFamily: FONT }}>
              {verdict.title}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.textSecondary, marginTop: "4px", lineHeight: 1.5 }}>
              {verdict.sub}
            </div>
          </div>

          {/* Gaps */}
          {gaps.length > 0 && (
            <>
              <div style={{ fontSize: "11px", color: COLORS.textTertiary, fontWeight: 600, marginBottom: "12px" }}>
                {t.sec_gaps}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {gaps.map((n) => {
                  const pct = (n.sat / 5) * 100;
                  const c = n.sat <= 2 ? COLORS.coral : n.sat <= 3 ? COLORS.orange : COLORS.green;
                  return (
                    <div key={n.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>
                          {NEED_NAMES[lang][n.id]}
                          {n.imp === 3 && (
                            <span style={{ ...styles.tag, marginLeft: "8px", color: COLORS.coral, background: `${COLORS.coral}20` }}>
                              {tLang.essential.toUpperCase()}
                            </span>
                          )}
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: c }}>{tLang.sat[n.sat - 1].label}</span>
                      </div>
                      <div style={{ position: "relative", height: "6px", borderRadius: "3px", background: "#1a1a1a", overflow: "hidden" }}>
                        <div style={{
                          position: "absolute", left: 0, top: 0, bottom: 0,
                          width: `${pct}%`, borderRadius: "3px", background: c,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Closing question */}
          {closingQ && (
            <div style={{
              marginTop: "16px", padding: "14px",
              background: `${COLORS.coral}08`, borderRadius: "12px",
              border: `1px solid ${COLORS.borderAccent}`,
            }}>
              <div style={{ fontSize: "10px", color: COLORS.coral, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                {t.sec_closing}
              </div>
              <div style={{ fontSize: "14px", color: COLORS.textPrimary, fontStyle: "italic", lineHeight: 1.6 }}>
                "{closingQ}"
              </div>
            </div>
          )}
        </div>

        {/* ═══ MODULE 3 · DIRECTION ═══ */}
        <div style={section}>
          <div style={sectionLabel}>{t.sec_direction}</div>

          {/* Reflections */}
          <div style={{ fontSize: "11px", color: COLORS.textTertiary, fontWeight: 600, marginBottom: "12px" }}>
            {t.sec_reflections}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {questions.map((q, i) => {
              const answer = reflections[q.id]?.trim();
              return (
                <div key={q.id} style={{
                  padding: "12px 14px", background: "#0f0f0f",
                  borderRadius: "10px", borderLeft: `2px solid ${answer ? COLORS.coral : COLORS.border}`,
                }}>
                  <div style={{ fontSize: "12px", color: COLORS.textSecondary, fontWeight: 600, marginBottom: "6px" }}>
                    {i + 1}. {q.question}
                  </div>
                  <div style={{
                    fontSize: "13px",
                    color: answer ? COLORS.textPrimary : COLORS.textMuted,
                    fontStyle: answer ? "normal" : "italic",
                    lineHeight: 1.5, whiteSpace: "pre-wrap",
                  }}>
                    {answer || t.no_reflection}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Closing */}
          <div style={{
            marginTop: "16px", padding: "14px",
            background: `${COLORS.coral}08`, borderRadius: "12px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "14px", color: COLORS.textPrimary, fontStyle: "italic", lineHeight: 1.6 }}>
              "{d.closingReflection}"
            </div>
          </div>
        </div>

        {/* ═══ SHARE CARD ═══ */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", color: COLORS.textTertiary, fontWeight: 600, textAlign: "center", marginBottom: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
            {t.share_label}
          </div>
          <div style={{
            background: "#111", border: `1px solid ${COLORS.border}`,
            borderRadius: "16px", padding: "24px", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: COLORS.coralGradient }} />
            <div style={{ fontSize: "10px", color: COLORS.textMuted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
              TALENT TRAP ESCAPE KIT · {today}
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: tension.color, marginBottom: "4px" }}>
              {tension.label}
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: verdict.color, marginBottom: "4px" }}>
              {score}<span style={{ fontSize: "14px", color: COLORS.textTertiary }}>/100</span>
            </div>
            <div style={{ fontSize: "13px", color: COLORS.textSecondary, marginBottom: "14px" }}>
              {archetype.icon} {archetype.label}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.textSecondary, fontStyle: "italic", marginBottom: "12px", lineHeight: 1.5 }}>
              {t.share_hint}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.coral, fontWeight: 600 }}>{t.share_link}</div>
          </div>
        </div>

        {/* 90-day reminder */}
        <div style={{ ...section, background: "#0f0f1a", border: "1px solid #2a2a3a", textAlign: "center" }}>
          <div style={{ fontSize: "20px", marginBottom: "8px" }}>📅</div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "4px" }}>{t.d90_title}</div>
          <div style={{ fontSize: "12px", color: COLORS.textSecondary }}>{t.d90_sub}</div>
        </div>

        {/* ═══ DOUBLE CTA ═══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
          {/* Escape Lab */}
          <div style={{ ...styles.card, textAlign: "center" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "6px" }}>{t.esc_lab_title}</div>
            <div style={{ fontSize: "13px", color: COLORS.textSecondary, marginBottom: "14px", lineHeight: 1.5 }}>{t.esc_lab_sub}</div>
            <a href={lang === "fr" ? "https://monexpansion.com/fr/escape-lab/" : "https://monexpansion.com/en/escape-lab/"} target="_blank" rel="noopener noreferrer"
              style={{ ...styles.btn, display: "inline-block", textDecoration: "none" }}>
              {t.esc_lab_cta}
            </a>
          </div>

          {/* Escape Now */}
          <div style={{ ...styles.card, textAlign: "center", background: "#1a1010", border: `1px solid ${COLORS.borderAccent}` }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "6px" }}>{t.esc_now_title}</div>
            <div style={{ fontSize: "13px", color: COLORS.textSecondary, marginBottom: "14px", lineHeight: 1.5 }}>{t.esc_now_sub}</div>
            <a href={t.tidycal} target="_blank" rel="noopener noreferrer"
              style={{ ...styles.btnOutline, display: "inline-block", textDecoration: "none" }}>
              {t.esc_now_cta}
            </a>
          </div>

          {/* Book */}
          <div style={{ ...styles.card, textAlign: "center" }}>
            <img
              src={lang === "fr" ? "/book-fr.png" : "/book-en.png"}
              alt={lang === "fr" ? "Le Piège du Talent" : "The Talent Trap"}
              style={{ maxWidth: "120px", width: "100%", height: "auto", marginBottom: "12px", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))" }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "6px" }}>{t.book_title}</div>
            <div style={{ fontSize: "13px", color: COLORS.textSecondary, marginBottom: "14px", lineHeight: 1.5 }}>{t.book_sub}</div>
            <a href={t.book_url} target="_blank" rel="noopener noreferrer"
              style={{ ...styles.btnOutline, display: "inline-block", textDecoration: "none" }}>
              {t.book_cta}
            </a>
          </div>
        </div>

        {/* Back button */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button style={styles.btnGhost} onClick={onBack}>{t.back}</button>
        </div>

        {/* Footer */}
        <p style={{ fontSize: "11px", color: COLORS.textMuted, textAlign: "center", lineHeight: 1.5 }}>
          Six Besoins Humains Essentiels · Robbins-Madanes Training<br />
          Julien Klein · monexpansion.com
        </p>
      </div>
    </div>
  );
}
