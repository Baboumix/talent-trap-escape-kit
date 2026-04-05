import { useState } from "react";
import { COLORS, FONT, styles } from "./SharedStyles";

const GATE_TEXT = {
  fr: {
    title: "Ton résultat est prêt.",
    sub: "Entre ton prénom et ton email pour le débloquer et sauvegarder ta progression.",
    benefits: [
      "✓ Ton résultat envoyé par email",
      "✓ Ta progression sauvegardée (reprends où tu veux)",
      "✓ Pas de mot de passe, juste ton email",
    ],
    firstNamePlaceholder: "Ton prénom",
    emailPlaceholder: "ton@email.com",
    btn: "Débloquer mon résultat →",
    errEmail: "Adresse email invalide.",
    errName: "Prénom requis.",
    spam: "Un email par mois maximum. Zéro spam.",
    privacy_notice: "En continuant, tu acceptes la",
    privacy_link: "politique de confidentialité",
  },
  en: {
    title: "Your result is ready.",
    sub: "Enter your first name and email to unlock it and save your progress.",
    benefits: [
      "✓ Your result sent by email",
      "✓ Your progress saved (come back anytime)",
      "✓ No password, just your email",
    ],
    firstNamePlaceholder: "Your first name",
    emailPlaceholder: "your@email.com",
    btn: "Unlock my result →",
    errEmail: "Invalid email address.",
    errName: "First name required.",
    spam: "One email per month max. Zero spam.",
    privacy_notice: "By continuing, you accept the",
    privacy_link: "privacy policy",
  },
};

export default function EmailGate({ lang, onUnlock, moduleData, emailData }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const t = GATE_TEXT[lang];

  const submit = async () => {
    if (!firstName.trim()) { setErr(t.errName); return; }
    if (!email || !email.includes("@") || !email.includes(".")) { setErr(t.errEmail); return; }
    setErr("");
    setLoading(true);

    const payload = {
      email: email.trim(),
      firstName: firstName.trim(),
      lang,
    };

    try {
      // Subscribe to Brevo list
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, ...moduleData }),
      });
      // Send result email
      if (emailData) {
        fetch("/api/send-result-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, ...emailData }),
        }).catch(() => {});
      }
    } catch { /* silent fail — don't block the user */ }

    setLoading(false);
    onUnlock({ email: email.trim(), firstName: firstName.trim() });
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bgCard,
    color: COLORS.textPrimary,
    fontSize: "15px",
    outline: "none",
    fontFamily: FONT,
    boxSizing: "border-box",
  };

  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
      display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "100px",
    }}>
      <div style={{
        background: `${COLORS.bg}ee`, backdropFilter: "blur(8px)",
        borderRadius: "20px", padding: "32px 24px", maxWidth: 400, width: "100%",
        textAlign: "center", border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔓</div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 8px", fontFamily: FONT }}>{t.title}</h2>
        <p style={{ fontSize: "14px", color: COLORS.textSecondary, margin: "0 0 16px", lineHeight: 1.5 }}>{t.sub}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px", padding: "12px", background: `${COLORS.coral}10`, borderRadius: "12px", textAlign: "left" }}>
          {t.benefits.map((b, i) => (
            <div key={i} style={{ fontSize: "12px", color: COLORS.textSecondary, lineHeight: 1.5 }}>{b}</div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "8px" }}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); setErr(""); }}
            placeholder={t.firstNamePlaceholder}
            style={inputStyle}
          />
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            style={{ position: "absolute", left: "-9999px", opacity: 0 }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErr(""); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t.emailPlaceholder}
            style={{ ...inputStyle, borderColor: err ? COLORS.coral : COLORS.border }}
          />
          <button
            style={{ ...styles.btn, width: "100%", opacity: loading ? 0.6 : 1 }}
            onClick={submit}
            disabled={loading}
          >
            {loading ? "..." : t.btn}
          </button>
        </div>

        {err && <p style={{ fontSize: "13px", color: COLORS.coral, marginTop: "4px" }}>{err}</p>}
        <p style={{ fontSize: "11px", color: COLORS.textMuted, marginTop: "12px", lineHeight: 1.5 }}>
          {t.privacy_notice}{" "}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("show-privacy"))}
            style={{
              background: "none", border: "none", padding: 0,
              color: COLORS.coral, textDecoration: "underline",
              fontSize: "11px", cursor: "pointer", fontFamily: FONT,
            }}
          >
            {t.privacy_link}
          </button>
          .
          <br />
          {t.spam}
        </p>
      </div>
    </div>
  );
}
