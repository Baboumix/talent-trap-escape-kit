import { useEffect, useState } from "react";
import { COLORS, FONT, styles, fadeStyle } from "./SharedStyles";
import { T } from "../data/translations";
import { NEEDS, NEED_IDS } from "../data/needs";
import { rankedNeeds, topThree } from "../data/scoring";
import ShareModal from "./ShareModal";
import { buildShareUrl } from "../lib/shareLink";

export default function Results({ lang, answers, firstName, onBack }) {
  const [vis, setVis] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const t = T[lang];

  useEffect(() => {
    const id = setTimeout(() => setVis(true), 30);
    return () => clearTimeout(id);
  }, []);

  if (!answers || Object.keys(answers).length === 0) {
    return (
      <div style={{ ...styles.page, ...fadeStyle(vis) }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <p style={{ color: COLORS.textSecondary, marginBottom: "20px" }}>
            {lang === "fr"
              ? "Termine le test pour voir tes résultats."
              : "Complete the test to see your results."}
          </p>
          <button style={styles.btnOutline} onClick={onBack}>
            {t.disc_back}
          </button>
        </div>
      </div>
    );
  }

  const top = topThree(answers);
  const ranked = rankedNeeds(answers);
  const threshold = top.length > 0 ? top[top.length - 1].score : 0;

  const today = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const sectionLabel = {
    fontSize: "10px",
    color: COLORS.coral,
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "14px",
  };

  return (
    <div style={{ ...styles.pageTop, ...fadeStyle(vis) }}>
      <div style={{ maxWidth: 620, width: "100%" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ ...styles.surtitre, marginBottom: "12px" }}>
            {t.res_label}
          </div>
          <h1
            style={{
              fontSize: "clamp(30px,6vw,42px)",
              fontWeight: 800,
              color: COLORS.textPrimary,
              lineHeight: 1.1,
              margin: "0 0 12px",
              fontFamily: FONT,
            }}
          >
            {firstName ? `${firstName}, ` : ""}
            {lang === "fr" ? "voici ton top 3." : "here is your top 3."}
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: COLORS.textSecondary,
              margin: "0 0 8px",
              lineHeight: 1.6,
            }}
          >
            {t.res_intro}
          </p>
          <p style={{ fontSize: "12px", color: COLORS.textMuted }}>{today}</p>
        </div>

        {/* ─── TOP 3 NEED CARDS ─── */}
        {top.map((n, i) => {
          const data = NEEDS[n.id][lang];
          return (
            <div key={n.id} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  ...styles.card,
                  background: `linear-gradient(135deg, ${COLORS.coral}10, ${COLORS.coral}04)`,
                  border: `1px solid ${COLORS.borderAccent}`,
                  padding: "24px 20px",
                }}
              >
                {/* Rank + name + score */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 800,
                        color: COLORS.coral,
                        letterSpacing: "1px",
                      }}
                    >
                      {t.res_rank.replace("{n}", i + 1)}
                    </div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: 800,
                        color: COLORS.textPrimary,
                        fontFamily: FONT,
                        lineHeight: 1.1,
                      }}
                    >
                      {data.name}
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "26px",
                        fontWeight: 800,
                        color: COLORS.coral,
                      }}
                    >
                      {n.score}
                    </span>
                    <span style={{ fontSize: "13px", color: COLORS.textTertiary }}>
                      {t.res_score}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: "12px", color: COLORS.textMuted, marginBottom: "14px", fontStyle: "italic" }}>
                  {data.short}
                </div>

                {/* Score bar */}
                <div
                  style={{
                    position: "relative",
                    height: "6px",
                    borderRadius: "3px",
                    background: "#1a1a1a",
                    overflow: "hidden",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${(n.score / 40) * 100}%`,
                      borderRadius: "3px",
                      background: COLORS.coralGradient,
                    }}
                  />
                </div>

                {/* Positive / Negative */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      background: `${COLORS.green}10`,
                      border: `1px solid ${COLORS.green}30`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        color: COLORS.green,
                        fontWeight: 700,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      ✅ {t.res_positive}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: COLORS.textPrimary,
                        lineHeight: 1.6,
                      }}
                    >
                      {data.positive}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      background: `${COLORS.coral}10`,
                      border: `1px solid ${COLORS.coral}30`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        color: COLORS.coral,
                        fontWeight: 700,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      ⚠️ {t.res_negative}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: COLORS.textPrimary,
                        lineHeight: 1.6,
                      }}
                    >
                      {data.negative}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ─── ALL 6 SCORES ─── */}
        <div style={{ ...styles.card, marginBottom: "20px" }}>
          <div style={sectionLabel}>{t.res_all_title}</div>
          <p
            style={{
              fontSize: "13px",
              color: COLORS.textTertiary,
              margin: "0 0 16px",
              lineHeight: 1.5,
            }}
          >
            {t.res_all_sub}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {ranked.map((n) => {
              const data = NEEDS[n.id][lang];
              const inTop3 = n.score >= threshold && top.some((x) => x.id === n.id);
              const pct = (n.score / 40) * 100;
              const c = inTop3 ? COLORS.coral : COLORS.textTertiary;
              return (
                <div key={n.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: inTop3 ? 700 : 500,
                        color: inTop3 ? COLORS.textPrimary : COLORS.textSecondary,
                      }}
                    >
                      {data.name}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: c,
                      }}
                    >
                      {n.score}
                      <span style={{ color: COLORS.textMuted, fontWeight: 500 }}>
                        /40
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      height: "5px",
                      borderRadius: "3px",
                      background: "#1a1a1a",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${pct}%`,
                        borderRadius: "3px",
                        background: inTop3 ? COLORS.coralGradient : "#444",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── STEP 2 TEASER ─── */}
        <div
          style={{
            ...styles.cardAccent,
            marginBottom: "20px",
            background: `linear-gradient(135deg, ${COLORS.coral}15, ${COLORS.coral}06)`,
            padding: "24px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "10px" }}>🔜</div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: COLORS.textPrimary,
              marginBottom: "10px",
              fontFamily: FONT,
            }}
          >
            {t.step2_title}
          </div>
          <p
            style={{
              fontSize: "14px",
              color: COLORS.textSecondary,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {t.step2_sub}
          </p>
        </div>

        {/* ─── SHARE CARD ─── */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "11px",
              color: COLORS.textTertiary,
              fontWeight: 600,
              textAlign: "center",
              marginBottom: "10px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {t.share_label}
          </div>
          <div
            style={{
              background: "#111",
              border: `1px solid ${COLORS.border}`,
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: COLORS.coralGradient,
              }}
            />
            <div
              style={{
                fontSize: "10px",
                color: COLORS.textMuted,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              {t.brand} · {today}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}
            >
              {top.map((n, i) => (
                <div
                  key={n.id}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    background: `${COLORS.coral}15`,
                    border: `1px solid ${COLORS.coral}40`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: COLORS.coral,
                      fontWeight: 700,
                    }}
                  >
                    {t.res_rank.replace("{n}", i + 1)}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: COLORS.textPrimary,
                    }}
                  >
                    {NEEDS[n.id][lang].name}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.coral,
                fontWeight: 600,
                marginTop: "6px",
              }}
            >
              {t.share_link}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "14px" }}>
            <button style={styles.btnOutline} onClick={() => setShowShare(true)}>
              🔗 {lang === "fr" ? "Partager mon top 3" : "Share my top 3"}
            </button>
          </div>
        </div>

        {/* ─── CTAs ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <a
            href={
              lang === "fr"
                ? "https://monexpansion.com/fr/escape-lab/"
                : "https://monexpansion.com/en/escape-lab/"
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "14px",
              padding: "14px 12px",
              textAlign: "center",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: "20px" }}>🧪</div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}
            >
              {t.esc_lab_title}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: COLORS.textSecondary,
                lineHeight: 1.4,
              }}
            >
              {t.esc_lab_sub}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: COLORS.coral,
                fontWeight: 600,
                marginTop: "2px",
              }}
            >
              {t.esc_lab_cta}
            </div>
          </a>

          <a
            href={t.tidycal}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "14px",
              padding: "14px 12px",
              textAlign: "center",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: "20px" }}>🚀</div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}
            >
              {t.esc_now_title}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: COLORS.textSecondary,
                lineHeight: 1.4,
              }}
            >
              {t.esc_now_sub}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: COLORS.coral,
                fontWeight: 600,
                marginTop: "2px",
              }}
            >
              {t.esc_now_cta}
            </div>
          </a>
        </div>

        {/* Back */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button style={styles.btnGhost} onClick={onBack}>
            {t.disc_back}
          </button>
        </div>
      </div>

      {showShare && (
        <ShareModal
          lang={lang}
          url={buildShareUrl(answers, firstName, lang)}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

// Keep NEED_IDS reference to avoid linter warning on unused import
void NEED_IDS;
