import { useEffect, useState } from "react";
import { COLORS, FONT, styles, fadeStyle } from "./SharedStyles";
import { T } from "../data/translations";
import { NEEDS, NEED_IDS } from "../data/needs";
import { rankedNeeds, topThree } from "../data/scoring";

const S_TEXT = {
  fr: {
    surtitre: "TOP 3 PARTAGÉ",
    title_has: " partage son top 3",
    title_anon: "Top 3 partagé",
    sub: "Une personne qui te connaît t'a envoyé ses 3 besoins prioritaires. Prends un moment. Lis. Tu peux confirmer ou nuancer.",

    sec_top: "Ses 3 besoins prioritaires",
    sec_all: "Les 6 scores",
    res_positive: "Le + (sain)",
    res_negative: "Le − (piège)",
    res_rank: "N°{n}",

    prompt_title: "Qu'est-ce que ça t'évoque ?",
    prompt_body: "Est-ce que tu reconnais cette personne ? Est-ce qu'il y a un besoin où tu la vois différemment ? Dis-lui.",

    own_title: "Toi aussi, passe le test.",
    own_sub: "24 questions. 4 minutes. Connais tes 3 besoins dominants.",
    own_cta: "Commencer mon test →",

    explore_label: "Pour aller plus loin",
    esc_lab_title: "Escape Lab",
    esc_lab_sub: "Cohorte de 12, 3 mois, live avec Julien.",
    esc_lab_cta: "Découvrir →",
    esc_now_title: "Coaching privé avec Julien.",
    esc_now_sub: "4 sessions 1:1 intensives, calibrées sur ton profil.",
    esc_now_cta: "Réserver un appel →",
    tidycal: "https://tidycal.com/julienklein/decouverte",
    escape_lab_url: "https://monexpansion.com/fr/escape-lab/",
  },
  en: {
    surtitre: "SHARED TOP 3",
    title_has: " shares their top 3",
    title_anon: "Shared top 3",
    sub: "Someone who knows you sent you their 3 priority needs. Take a moment. Read. You can confirm or nuance it.",

    sec_top: "Their 3 priority needs",
    sec_all: "The 6 scores",
    res_positive: "The + (healthy)",
    res_negative: "The − (trap)",
    res_rank: "#{n}",

    prompt_title: "What does this evoke?",
    prompt_body: "Do you recognize this person? Is there a need where you see them differently? Tell them.",

    own_title: "Take the test yourself.",
    own_sub: "24 questions. 4 minutes. Know your 3 dominant needs.",
    own_cta: "Start my test →",

    explore_label: "Go further",
    esc_lab_title: "Escape Lab",
    esc_lab_sub: "Cohort of 12, 3 months, live with Julien.",
    esc_lab_cta: "Discover →",
    esc_now_title: "Private coaching with Julien.",
    esc_now_sub: "4 intensive 1:1 sessions, calibrated to your profile.",
    esc_now_cta: "Book a call →",
    tidycal: "https://tidycal.com/julienklein/discovery",
    escape_lab_url: "https://monexpansion.com/en/escape-lab/",
  },
};

export default function SharedView({ data }) {
  const [vis, setVis] = useState(false);
  const { answers, firstName, lang } = data;
  const t = S_TEXT[lang] || S_TEXT.fr;

  useEffect(() => {
    const ti = setTimeout(() => setVis(true), 30);
    return () => clearTimeout(ti);
  }, []);

  const top = answers ? topThree(answers) : [];
  const ranked = answers ? rankedNeeds(answers) : [];
  const threshold = top.length > 0 ? top[top.length - 1].score : 0;

  const section = { ...styles.card, marginBottom: "16px" };
  const sectionLabel = {
    fontSize: "10px",
    color: COLORS.coral,
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "14px",
  };

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div style={{ ...styles.pageTop, ...fadeStyle(vis) }}>
      <div style={{ maxWidth: 620, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ ...styles.surtitre, marginBottom: "12px" }}>
            {t.surtitre}
          </div>
          <h1
            style={{
              fontSize: "clamp(24px,5vw,32px)",
              fontWeight: 800,
              color: COLORS.textPrimary,
              lineHeight: 1.2,
              margin: "0 0 12px",
              fontFamily: FONT,
            }}
          >
            {firstName ? (
              <>
                <span
                  style={{
                    background: COLORS.coralGradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {firstName}
                </span>
                {t.title_has}
              </>
            ) : (
              t.title_anon
            )}
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: COLORS.textSecondary,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {t.sub}
          </p>
        </div>

        {/* Top 3 */}
        <div style={{ ...section, padding: 0, overflow: "hidden" }}>
          <div
            style={{
              ...sectionLabel,
              padding: "20px 20px 0",
              marginBottom: "14px",
            }}
          >
            {t.sec_top}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "0 20px 20px",
            }}
          >
            {top.map((n, i) => {
              const d = NEEDS[n.id][lang];
              return (
                <div
                  key={n.id}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "12px",
                    background: `${COLORS.coral}10`,
                    border: `1px solid ${COLORS.coral}30`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "8px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          color: COLORS.coral,
                          marginRight: "8px",
                        }}
                      >
                        {t.res_rank.replace("{n}", i + 1)}
                      </span>
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: 800,
                          color: COLORS.textPrimary,
                          fontFamily: FONT,
                        }}
                      >
                        {d.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: COLORS.coral,
                      }}
                    >
                      {n.score}
                      <span
                        style={{
                          fontSize: "11px",
                          color: COLORS.textMuted,
                        }}
                      >
                        /40
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "8px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: COLORS.green,
                        lineHeight: 1.6,
                      }}
                    >
                      <strong>✅ {t.res_positive}:</strong>{" "}
                      <span style={{ color: COLORS.textSecondary }}>
                        {d.positive}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: COLORS.coral,
                        lineHeight: 1.6,
                      }}
                    >
                      <strong>⚠️ {t.res_negative}:</strong>{" "}
                      <span style={{ color: COLORS.textSecondary }}>
                        {d.negative}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All 6 scores */}
        <div style={section}>
          <div style={sectionLabel}>{t.sec_all}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {ranked.map((n) => {
              const d = NEEDS[n.id][lang];
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
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: inTop3 ? 700 : 500,
                        color: inTop3
                          ? COLORS.textPrimary
                          : COLORS.textSecondary,
                      }}
                    >
                      {d.name}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: c }}>
                      {n.score}
                      <span style={{ color: COLORS.textMuted }}>/40</span>
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

        {/* Prompt for recipient */}
        <div
          style={{
            ...styles.cardAccent,
            marginBottom: "24px",
            textAlign: "center",
            background: `linear-gradient(135deg, ${COLORS.coral}12, ${COLORS.coral}06)`,
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: COLORS.textPrimary,
              marginBottom: "10px",
              fontFamily: FONT,
            }}
          >
            {t.prompt_title}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: COLORS.textSecondary,
              lineHeight: 1.6,
            }}
          >
            {t.prompt_body}
          </div>
        </div>

        {/* CTA to create own */}
        <div
          style={{
            ...styles.card,
            marginBottom: "16px",
            textAlign: "center",
            background: "#0f0f0f",
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: COLORS.textPrimary,
              marginBottom: "6px",
            }}
          >
            {t.own_title}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: COLORS.textSecondary,
              marginBottom: "16px",
              lineHeight: 1.5,
            }}
          >
            {t.own_sub}
          </div>
          <button style={styles.btn} onClick={goHome}>
            {t.own_cta}
          </button>
        </div>

        {/* Secondary: explore */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: COLORS.border }} />
          <div
            style={{
              fontSize: "10px",
              color: COLORS.textMuted,
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 600,
            }}
          >
            {t.explore_label}
          </div>
          <div style={{ flex: 1, height: "1px", background: COLORS.border }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <a
            href={t.escape_lab_url}
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
      </div>
    </div>
  );
}

// Keep NEED_IDS as an import anchor; prevents tree-shakers from dropping the needs module
// if this view is the only consumer in some deploys.
void NEED_IDS;

// T is imported in case we localize additional strings later.
void T;
