// ══════════════════════════════════════════
// Design tokens aligned with monexpansion.com
// Font: Lexend · Dark theme · Coral accent
// ══════════════════════════════════════════

export const COLORS = {
  bg: "#0B0A0B",
  bgCard: "#141414",
  bgCardHover: "#1a1a1a",
  border: "#2a2a2a",
  borderAccent: "#ff666633",

  coral: "#FE6C63",
  coralLight: "#ff6666",
  coralDim: "#FE6C6320",
  coralGradient: "linear-gradient(135deg, #FE6C63, #FF8A54)",

  green: "#61CE70",
  greenDim: "#61CE7020",
  greenGradient: "linear-gradient(90deg, #22c55e, #61CE70)",

  orange: "#FF8A54",
  orangeDim: "#FF8A5420",

  textPrimary: "#ffffff",
  textSecondary: "#949dad",
  textTertiary: "#6b7280",
  textMuted: "#444",

  satColors: ["#FE6C63", "#FF8A54", "#b8b8b8", "#A3E635", "#61CE70"],
  impColors: ["#6b7280", "#FF8A54", "#FE6C63"],
};

export const FONT = "'Lexend', system-ui, -apple-system, sans-serif";

// Shared component styles
export const styles = {
  card: {
    background: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "20px",
    padding: "24px",
    textAlign: "left",
  },

  cardAccent: {
    background: COLORS.bgCard,
    border: `1px solid ${COLORS.borderAccent}`,
    borderRadius: "20px",
    padding: "24px",
    textAlign: "left",
  },

  btn: {
    background: COLORS.coral,
    color: COLORS.textPrimary,
    border: "none",
    borderRadius: "20px",
    padding: "16px 36px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT,
    transition: "all 0.2s",
    boxShadow: "6px 6px 9px rgba(0,0,0,0.2)",
  },

  btnOutline: {
    background: "transparent",
    color: COLORS.coral,
    border: `1px solid ${COLORS.coral}`,
    borderRadius: "20px",
    padding: "14px 28px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT,
    transition: "all 0.2s",
  },

  btnDisabled: {
    background: COLORS.coral,
    color: COLORS.textPrimary,
    border: "none",
    borderRadius: "20px",
    padding: "16px 36px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "not-allowed",
    fontFamily: FONT,
    opacity: 0.3,
  },

  btnGhost: {
    background: "none",
    border: "none",
    color: COLORS.textTertiary,
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: FONT,
    padding: "8px 12px",
  },

  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 20px",
  },

  pageTop: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "56px 20px 48px",
  },

  surtitre: {
    fontSize: "11px",
    letterSpacing: "3px",
    color: COLORS.coral,
    textTransform: "uppercase",
    fontWeight: 600,
  },

  sectionTitle: {
    fontSize: "11px",
    color: COLORS.textTertiary,
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "14px",
    fontWeight: 600,
  },

  tag: {
    fontSize: "10px",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: "8px",
    display: "inline-block",
  },
};

// Fade animation wrapper
export function fadeStyle(visible) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(16px)",
    transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
  };
}

// Progress bar segments (3 modules)
export function progressWidth(module, subProgress = 0) {
  // module: 1, 2, 3. subProgress: 0-1 within module
  const base = ((module - 1) / 3) * 100;
  const add = (subProgress / 3) * 100;
  return `${base + add}%`;
}
