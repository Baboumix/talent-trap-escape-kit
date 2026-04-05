import { useState } from "react";
import { COLORS, FONT, styles } from "./SharedStyles";

const TEXT = {
  fr: {
    title: "Partage ton profil",
    sub: "Envoie ce lien à quelqu'un qui te connaît bien. Un ami, un mentor, ton partenaire. Demande-lui ce qu'il en pense.",
    why_title: "Pourquoi partager ?",
    why_body: "Les gens proches voient parfois ce que tu ne vois pas encore. Leur retour peut confirmer une intuition — ou ouvrir une porte.",
    copy: "Copier le lien",
    copied: "Lien copié ✓",
    whatsapp: "WhatsApp",
    email_share: "Email",
    close: "Fermer",
    message: "J'ai fait ce diagnostic sur moi et j'aimerais ton avis. Dis-moi si ça résonne :",
  },
  en: {
    title: "Share your profile",
    sub: "Send this link to someone who knows you well. A friend, a mentor, your partner. Ask them what they think.",
    why_title: "Why share?",
    why_body: "People close to you sometimes see what you don't yet. Their feedback can confirm an intuition — or open a door.",
    copy: "Copy link",
    copied: "Link copied ✓",
    whatsapp: "WhatsApp",
    email_share: "Email",
    close: "Close",
    message: "I just did this diagnostic on myself and would love your take. Tell me if it resonates:",
  },
};

export default function ShareModal({ lang, url, onClose }) {
  const [copied, setCopied] = useState(false);
  const t = TEXT[lang] || TEXT.fr;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(t.message + "\n\n" + url)}`;
  const subject = lang === "fr" ? "Mon profil Talent Trap — ton avis ?" : "My Talent Trap profile — your take?";
  const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(t.message + "\n\n" + url)}`;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.bgCard, border: `1px solid ${COLORS.borderAccent}`,
          borderRadius: "20px", padding: "28px 24px", maxWidth: 460, width: "100%",
          fontFamily: FONT, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔗</div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 8px" }}>
            {t.title}
          </h2>
          <p style={{ fontSize: "14px", color: COLORS.textSecondary, margin: 0, lineHeight: 1.5 }}>
            {t.sub}
          </p>
        </div>

        {/* Why share */}
        <div style={{
          padding: "14px", background: `${COLORS.coral}08`, borderRadius: "12px",
          marginBottom: "20px", borderLeft: `2px solid ${COLORS.coral}`,
        }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: COLORS.coral, marginBottom: "4px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            {t.why_title}
          </div>
          <div style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: 1.5 }}>
            {t.why_body}
          </div>
        </div>

        {/* URL input + copy */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input
            type="text"
            value={url}
            readOnly
            onClick={(e) => e.target.select()}
            style={{
              flex: 1, minWidth: 0,
              padding: "12px 14px", borderRadius: "12px",
              border: `1px solid ${COLORS.border}`, background: COLORS.bg,
              color: COLORS.textSecondary, fontSize: "12px",
              outline: "none", fontFamily: "monospace", textOverflow: "ellipsis",
            }}
          />
          <button
            onClick={copy}
            style={{
              background: copied ? COLORS.green : COLORS.coral,
              color: "#fff", border: "none", borderRadius: "12px",
              padding: "12px 18px", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>

        {/* Quick share buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "12px", borderRadius: "12px",
              background: COLORS.bg, border: `1px solid ${COLORS.border}`,
              color: COLORS.textPrimary, fontSize: "13px", fontWeight: 600,
              textDecoration: "none", fontFamily: FONT,
            }}
          >
            <span>💬</span> {t.whatsapp}
          </a>
          <a
            href={emailUrl}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "12px", borderRadius: "12px",
              background: COLORS.bg, border: `1px solid ${COLORS.border}`,
              color: COLORS.textPrimary, fontSize: "13px", fontWeight: 600,
              textDecoration: "none", fontFamily: FONT,
            }}
          >
            <span>✉️</span> {t.email_share}
          </a>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            width: "100%", background: "transparent",
            border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary,
            borderRadius: "12px", padding: "10px 20px",
            fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: FONT,
          }}
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}
