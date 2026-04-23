import { useEffect, useState } from "react";
import { COLORS, FONT, styles, fadeStyle } from "./SharedStyles";
import { T } from "../data/translations";

export default function Disclaimer({ lang, onAccept, onBack }) {
  const [vis, setVis] = useState(false);
  const t = T[lang];

  useEffect(() => {
    const id = setTimeout(() => setVis(true), 30);
    return () => clearTimeout(id);
  }, []);

  return (
    <div style={{ ...styles.page, ...fadeStyle(vis) }}>
      <div style={{ maxWidth: 560, width: "100%" }}>
        <h1
          style={{
            fontSize: "clamp(28px,6vw,40px)",
            fontWeight: 800,
            color: COLORS.textPrimary,
            lineHeight: 1.2,
            margin: "0 0 24px",
            fontFamily: FONT,
            textAlign: "center",
          }}
        >
          {t.disc_title}
        </h1>

        <div style={{ ...styles.card, marginBottom: "20px" }}>
          <p
            style={{
              fontSize: "15px",
              color: COLORS.textSecondary,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {t.disc_p1}
          </p>
        </div>

        <div
          style={{
            ...styles.cardAccent,
            marginBottom: "20px",
            borderLeft: `3px solid ${COLORS.coral}`,
          }}
        >
          <p
            style={{
              fontSize: "15px",
              color: COLORS.textSecondary,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            <span style={{ color: COLORS.coral, fontWeight: 700 }}>
              {t.disc_p2_lead}
            </span>{" "}
            {t.disc_p2}
          </p>
          <p
            style={{
              fontSize: "15px",
              color: COLORS.textPrimary,
              lineHeight: 1.7,
              margin: "12px 0 0",
              fontStyle: "italic",
            }}
          >
            {t.disc_p3}
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <button style={styles.btn} onClick={onAccept}>
            {t.disc_cta}
          </button>
          {onBack && (
            <div style={{ marginTop: "16px" }}>
              <button style={styles.btnGhost} onClick={onBack}>
                {t.disc_back}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
