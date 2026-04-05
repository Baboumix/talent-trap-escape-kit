import { COLORS, FONT } from "./SharedStyles";

const PRIVACY_TEXT = {
  fr: {
    title: "Politique de confidentialité",
    subtitle: "Version courte et honnête. Conforme à la Loi 25 (Québec).",
    sections: [
      {
        title: "Qui collecte tes données",
        body: "Julien Klein (monExpansion), coach certifié basé au Québec. Contact : julien@monexpansion.com. Je suis aussi le responsable de la protection des renseignements personnels.",
      },
      {
        title: "Ce que je collecte",
        body: "Ton prénom, ton email, tes réponses aux 3 modules (signaux, besoins, réflexions). Des données de navigation anonymisées via Google Analytics (si tu as accepté les cookies).",
      },
      {
        title: "Pourquoi",
        body: "Pour t'envoyer ton résultat par email, sauvegarder ta progression et te recontacter avec du contenu pertinent (1 email/mois max). Les analytics servent à améliorer le kit.",
      },
      {
        title: "Qui y a accès",
        body: "Moi uniquement, plus 2 sous-traitants : Brevo (envoi des emails, hébergé en UE) et Google Analytics (données anonymisées). Aucun tiers ne revend ces données.",
      },
      {
        title: "Tes droits",
        body: "Tu peux à tout moment demander à voir tes données, les corriger ou les supprimer. Écris-moi à julien@monexpansion.com — je te réponds sous 30 jours (obligation légale).",
      },
      {
        title: "Combien de temps",
        body: "Tes données restent actives tant que tu restes sur la liste email. Si tu te désabonnes, tout est supprimé sous 30 jours.",
      },
    ],
    close: "Fermer",
  },
  en: {
    title: "Privacy Policy",
    subtitle: "Short and honest. Compliant with Quebec's Law 25.",
    sections: [
      {
        title: "Who collects your data",
        body: "Julien Klein (monExpansion), certified coach based in Quebec, Canada. Contact: julien@monexpansion.com. I'm also the privacy officer responsible for your data.",
      },
      {
        title: "What I collect",
        body: "Your first name, email, and answers to the 3 modules (signals, needs, reflections). Anonymized browsing data via Google Analytics (if you accepted cookies).",
      },
      {
        title: "Why",
        body: "To send you your result by email, save your progress, and share relevant content (1 email/month max). Analytics are used to improve the kit.",
      },
      {
        title: "Who has access",
        body: "Only me, plus 2 service providers: Brevo (email delivery, hosted in EU) and Google Analytics (anonymized data). No third party resells this data.",
      },
      {
        title: "Your rights",
        body: "You can at any time ask to see your data, correct it, or delete it. Email me at julien@monexpansion.com — I'll respond within 30 days (legal obligation).",
      },
      {
        title: "How long",
        body: "Your data stays active as long as you're on the email list. If you unsubscribe, everything is deleted within 30 days.",
      },
    ],
    close: "Close",
  },
};

export default function PrivacyModal({ lang, onClose }) {
  const t = PRIVACY_TEXT[lang] || PRIVACY_TEXT.fr;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1100,
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
          borderRadius: "20px", padding: "28px 24px", maxWidth: 560, width: "100%",
          maxHeight: "90vh", overflowY: "auto", fontFamily: FONT,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 4px" }}>
            {t.title}
          </h2>
          <p style={{ fontSize: "12px", color: COLORS.textMuted, margin: 0, lineHeight: 1.5 }}>
            {t.subtitle}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
          {t.sections.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: COLORS.coral, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {s.title}
              </div>
              <div style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: 1.6 }}>
                {s.body}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%", background: COLORS.coral, color: "#fff",
            border: "none", borderRadius: "12px", padding: "12px 24px",
            fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: FONT,
          }}
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}
