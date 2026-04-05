import { useState, useEffect } from "react";
import { COLORS, FONT, styles } from "./SharedStyles";
import { consentStatus, grantConsent, denyConsent } from "../lib/analytics";

const BANNER_TEXT = {
  fr: {
    title: "Un cookie pour l'analyse ?",
    body: "On utilise Google Analytics pour comprendre comment le kit est utilisé — juste pour l'améliorer. Aucun tracking publicitaire.",
    accept: "Accepter",
    deny: "Refuser",
    more: "En savoir plus",
  },
  en: {
    title: "A cookie for analytics?",
    body: "We use Google Analytics to understand how the kit is used — just to improve it. No ad tracking.",
    accept: "Accept",
    deny: "Decline",
    more: "Learn more",
  },
};

export default function CookieBanner({ lang }) {
  const [status, setStatus] = useState("unknown");
  const [vis, setVis] = useState(false);
  const t = BANNER_TEXT[lang] || BANNER_TEXT.fr;

  useEffect(() => {
    const s = consentStatus();
    setStatus(s);
    if (s === "unknown") {
      // Delay banner 1s to avoid jumping the UI on first load
      const ti = setTimeout(() => setVis(true), 1000);
      return () => clearTimeout(ti);
    }
  }, []);

  if (status !== "unknown") return null;

  const handleAccept = () => {
    grantConsent();
    setVis(false);
    setTimeout(() => setStatus("granted"), 300);
  };

  const handleDeny = () => {
    denyConsent();
    setVis(false);
    setTimeout(() => setStatus("denied"), 300);
  };

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 500,
      padding: "16px", display: "flex", justifyContent: "center",
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.3s, transform 0.3s",
      pointerEvents: vis ? "auto" : "none",
    }}>
      <div style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.borderAccent}`,
        borderRadius: "16px",
        padding: "16px 20px",
        maxWidth: "560px", width: "100%",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        fontFamily: FONT,
        display: "flex", flexDirection: "column", gap: "12px",
      }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "4px" }}>
            {t.title}
          </div>
          <div style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: 1.5 }}>
            {t.body}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button
            onClick={handleDeny}
            style={{
              background: "transparent", color: COLORS.textSecondary,
              border: `1px solid ${COLORS.border}`, borderRadius: "20px",
              padding: "8px 16px", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", fontFamily: FONT,
            }}
          >
            {t.deny}
          </button>
          <button
            onClick={handleAccept}
            style={{
              ...styles.btn,
              padding: "8px 20px", fontSize: "13px",
              boxShadow: "none",
            }}
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
