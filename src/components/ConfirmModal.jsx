import { COLORS, FONT, styles } from "./SharedStyles";

const MODAL_TEXT = {
  fr: {
    title: "C'est noté ✉️",
    sub: "On t'enverra le prochain module dans 2 jours, dans ton email.",
    saved_title: "Ta progression est sauvegardée",
    saved_sub: "Pas de mot de passe, pas de compte. Juste ton email. Quand tu reviendras, tu reprendras exactement où tu t'es arrêté.",
    close: "Compris →",
  },
  en: {
    title: "Got it ✉️",
    sub: "We'll send you the next module in 2 days, to your inbox.",
    saved_title: "Your progress is saved",
    saved_sub: "No password, no account. Just your email. When you come back, you'll pick up exactly where you left off.",
    close: "Got it →",
  },
};

export default function ConfirmModal({ lang, onClose, firstName }) {
  const t = MODAL_TEXT[lang];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.bgCard, border: `1px solid ${COLORS.borderAccent}`,
          borderRadius: "20px", padding: "32px 24px", maxWidth: 420, width: "100%",
          textAlign: "center", fontFamily: FONT,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✉️</div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 8px" }}>
          {t.title}
        </h2>
        <p style={{ fontSize: "14px", color: COLORS.textSecondary, margin: "0 0 20px", lineHeight: 1.6 }}>
          {firstName ? `${firstName}, ${t.sub.charAt(0).toLowerCase()}${t.sub.slice(1)}` : t.sub}
        </p>

        <div style={{ padding: "16px", background: `${COLORS.green}12`, borderRadius: "12px", border: `1px solid ${COLORS.green}30`, marginBottom: "20px", textAlign: "left" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.green, marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🔒</span> {t.saved_title}
          </div>
          <div style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: 1.5 }}>
            {t.saved_sub}
          </div>
        </div>

        <button style={{ ...styles.btn, width: "100%" }} onClick={onClose}>
          {t.close}
        </button>
      </div>
    </div>
  );
}
