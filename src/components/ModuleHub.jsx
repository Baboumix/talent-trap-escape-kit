import { COLORS, FONT, styles, fadeStyle } from "./SharedStyles";
import { useState, useEffect } from "react";

const HUB_TEXT = {
  fr: {
    surtitre: "TALENT TRAP ESCAPE KIT",
    title: "Ton parcours de sortie.",
    sub: "3 étapes. Chacune t'emmène plus profond.",
    modules: [
      {
        num: "01", name: "Le Miroir", icon: "👁️", duration: "5 min",
        desc: "Diagnostique les signaux du piège.",
        done: "Profil de tension complété.",
      },
      {
        num: "02", name: "La Carte", icon: "🗺️", duration: "8 min",
        desc: "Cartographie tes besoins essentiels.",
        done: "Carte des besoins complétée.",
      },
      {
        num: "03", name: "La Boussole", icon: "🧭", duration: "15 min",
        desc: "Identifie ta direction organique.",
        done: "Profil d'expansion complété.",
      },
    ],
    start: "Commencer",
    continue_mod: "Continuer",
    locked: "Verrouillé",
    see_full: "Voir mon profil complet →",
    footer: "Basé sur les Six Besoins Humains Essentiels · Robbins-Madanes Training",
    footer2: "Julien Klein · Coach certifié RMT · monexpansion.com",
  },
  en: {
    surtitre: "TALENT TRAP ESCAPE KIT",
    title: "Your escape path.",
    sub: "3 steps. Each takes you deeper.",
    modules: [
      {
        num: "01", name: "The Mirror", icon: "👁️", duration: "5 min",
        desc: "Diagnose the signals of the trap.",
        done: "Tension profile completed.",
      },
      {
        num: "02", name: "The Map", icon: "🗺️", duration: "8 min",
        desc: "Map your essential needs.",
        done: "Needs map completed.",
      },
      {
        num: "03", name: "The Compass", icon: "🧭", duration: "15 min",
        desc: "Identify your organic direction.",
        done: "Expansion profile completed.",
      },
    ],
    start: "Start",
    continue_mod: "Continue",
    locked: "Locked",
    see_full: "See my full profile →",
    footer: "Based on the Six Core Human Needs · Robbins-Madanes Training",
    footer2: "Julien Klein · RMT Certified Coach · monexpansion.com",
  },
};

export default function ModuleHub({ lang, progress, onSelectModule, onViewResults }) {
  const [vis, setVis] = useState(false);
  const t = HUB_TEXT[lang];

  useEffect(() => {
    const ti = setTimeout(() => setVis(true), 30);
    return () => clearTimeout(ti);
  }, []);

  // progress: { module1: null|{...}, module2: null|{...}, module3: null|{...} }
  const states = [
    progress.module1 ? "done" : "current",
    progress.module1 ? (progress.module2 ? "done" : "current") : "locked",
    progress.module2 ? (progress.module3 ? "done" : "current") : "locked",
  ];

  const allDone = states.every((s) => s === "done");

  const summaries = [
    progress.module1 ? `${progress.module1.signalCount}/10 signaux` : null,
    progress.module2 ? `${progress.module2.score}/100` : null,
    progress.module3 ? "✓" : null,
  ];

  return (
    <div style={{ ...styles.pageTop, ...fadeStyle(vis) }}>
      <div style={{ maxWidth: 560, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ ...styles.surtitre, marginBottom: "12px" }}>{t.surtitre}</div>
          <h1 style={{ fontSize: "clamp(32px,7vw,44px)", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.2, margin: "0 0 8px", fontFamily: FONT }}>
            {t.title}
          </h1>
          <p style={{ fontSize: "15px", color: COLORS.textSecondary, margin: 0 }}>{t.sub}</p>
        </div>

        {/* Journey map with vertical line */}
        <div style={{ position: "relative", paddingLeft: "56px" }}>
          {/* Vertical line (behind the dots) */}
          <div style={{
            position: "absolute",
            left: "23px",
            top: "24px",
            bottom: "24px",
            width: "2px",
            background: `linear-gradient(180deg,
              ${states[0] === "done" ? COLORS.green : COLORS.coral} 0%,
              ${states[1] === "done" ? COLORS.green : states[1] === "current" ? COLORS.coral : COLORS.border} 50%,
              ${states[2] === "done" ? COLORS.green : states[2] === "current" ? COLORS.coral : COLORS.border} 100%)`,
            transition: "background 0.5s",
          }} />

          {/* Module cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {t.modules.map((mod, i) => {
              const state = states[i];
              const isLocked = state === "locked";
              const isDone = state === "done";
              const isCurrent = state === "current";

              const dotColor = isDone ? COLORS.green : isCurrent ? COLORS.coral : COLORS.border;
              const dotBg = isDone ? COLORS.green : isCurrent ? COLORS.coral : "#1a1a1a";

              return (
                <div
                  key={i}
                  onClick={() => !isLocked && onSelectModule(i + 1)}
                  style={{
                    position: "relative",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.45 : 1,
                    transition: "all 0.3s",
                  }}
                >
                  {/* Dot on the line */}
                  <div style={{
                    position: "absolute",
                    left: "-45px",
                    top: "18px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: dotBg,
                    border: `3px solid ${isDone || isCurrent ? COLORS.bg : "#1a1a1a"}`,
                    boxShadow: isCurrent ? `0 0 0 4px ${COLORS.coral}30, 0 0 20px ${COLORS.coral}60` : isDone ? `0 0 0 3px ${COLORS.green}20` : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                    transition: "all 0.3s",
                  }}>
                    {isDone && <span style={{ fontSize: "14px", color: "#fff", fontWeight: 900, lineHeight: 1 }}>✓</span>}
                    {isCurrent && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff" }} />}
                    {isLocked && <span style={{ fontSize: "10px" }}>🔒</span>}
                  </div>

                  {/* Card */}
                  <div style={{
                    background: isCurrent ? `${COLORS.coral}08` : isDone ? `${COLORS.green}06` : COLORS.bgCard,
                    border: `1px solid ${isCurrent ? COLORS.coral : isDone ? `${COLORS.green}40` : COLORS.border}`,
                    borderRadius: "16px",
                    padding: "18px 20px",
                    transition: "all 0.3s",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                        <span style={{ fontSize: "22px" }}>{mod.icon}</span>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                            <span style={{ fontSize: "10px", color: COLORS.textTertiary, fontWeight: 700, letterSpacing: "1.5px" }}>
                              {mod.num}
                            </span>
                            <span style={{ fontSize: "11px", color: COLORS.textTertiary, opacity: 0.6 }}>·</span>
                            <span style={{ fontSize: "11px", color: COLORS.textTertiary }}>{mod.duration}</span>
                          </div>
                          <div style={{ fontSize: "19px", fontWeight: 700, color: COLORS.textPrimary, lineHeight: 1.2 }}>
                            {mod.name}
                          </div>
                        </div>
                      </div>

                      {/* Status badge */}
                      {isDone && summaries[i] && (
                        <div style={{
                          fontSize: "11px", fontWeight: 700, color: COLORS.green,
                          background: `${COLORS.green}15`, padding: "4px 10px", borderRadius: "8px",
                          whiteSpace: "nowrap",
                        }}>
                          {summaries[i]}
                        </div>
                      )}
                      {isCurrent && (
                        <div style={{
                          fontSize: "10px", fontWeight: 700, color: COLORS.coral,
                          background: `${COLORS.coral}15`, padding: "4px 10px", borderRadius: "8px",
                          textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap",
                        }}>
                          {progress[`module${i + 1}`] ? t.continue_mod : t.start} →
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: "14px", color: COLORS.textSecondary, lineHeight: 1.5, paddingLeft: "32px" }}>
                      {isDone ? mod.done : mod.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* See full results */}
        {allDone && (
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button style={styles.btn} onClick={onViewResults}>
              {t.see_full}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
