// Send result email via Brevo transactional API
// Sends a branded, on-brand email with the user's module result

const BREVO_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = "julien@monexpansion.com";
const FROM_NAME = "Julien Klein · monExpansion";

// Brand tokens (optimized for white background emails)
const BRAND = {
  coral: "#FE6C63",
  coralLight: "#FF8A54",
  green: "#61CE70",
  textPrimary: "#0B0A0B",
  textSecondary: "#4a5568",
  textMuted: "#6b7280",
  bgLight: "#faf9f8",
  bgCard: "#f5f4f2",
  border: "#e5e5e5",
};

// ─────────────── TEMPLATES ───────────────

function module1Email({ firstName, tensionLabel, tensionSub, tensionColor, signalCount, archetypeLabel, archetypeDesc, archetypeIcon, lang, resumeUrl }) {
  const t = lang === "fr" ? {
    subject: `${firstName}, ton profil de tension est prêt`,
    hi: `Bonjour ${firstName},`,
    intro: "Tu viens de compléter le Module 1 du Talent Trap Escape Kit. Voici ton résultat complet, à garder dans ta boîte mail.",
    profile_label: "TON PROFIL DE TENSION",
    signals: "signaux détectés sur 10",
    archetype_label: "TON ARCHÉTYPE",
    next_title: "Prochaine étape : cartographier tes besoins.",
    next_body: "Tu sais maintenant que le piège est là. Le Module 2 te montre lequel de tes 6 besoins essentiels il vise. Ça prend 8 minutes.",
    next_cta: "Continuer le parcours",
    divider: "— — —",
    lab_title: "🧪 Escape Lab",
    lab_body: "Une cohorte de créatifs dans la même situation. 3 mois. Sessions live avec Julien. Groupe privé. Le format bootcamp pour sortir du piège avec des pairs qui comprennent.",
    lab_cta: "Découvrir l'Escape Lab",
    now_title: "🚀 Escape Now!",
    now_body: "4 sessions de coaching individuel intensif avec Julien, calibrées sur ton diagnostic. Pour ceux qui veulent régler ça maintenant, en 1:1. Appel de découverte gratuit.",
    now_cta: "Réserver un appel gratuit",
    signoff: "À bientôt,",
    signature: "Julien",
    ps_title: "P.S.",
    ps_body: "Tu peux revenir au kit à tout moment. Ta progression est sauvegardée grâce à ton email. Il suffit de retourner sur kit.monexpansion.com.",
  } : {
    subject: `${firstName}, your tension profile is ready`,
    hi: `Hi ${firstName},`,
    intro: "You just completed Module 1 of the Talent Trap Escape Kit. Here's your full result, saved to your inbox.",
    profile_label: "YOUR TENSION PROFILE",
    signals: "signals detected out of 10",
    archetype_label: "YOUR ARCHETYPE",
    next_title: "Next step: map your needs.",
    next_body: "You know the trap is there. Module 2 shows you which of your 6 essential needs it targets. Takes 8 minutes.",
    next_cta: "Continue the journey",
    divider: "— — —",
    lab_title: "🧪 Escape Lab",
    lab_body: "A cohort of creatives in the same situation. 3 months. Live sessions with Julien. Private group. A bootcamp format to escape the trap with peers who get it.",
    lab_cta: "Discover the Escape Lab",
    now_title: "🚀 Escape Now!",
    now_body: "4 intensive 1:1 coaching sessions with Julien, calibrated to your diagnostic. For those who want to fix this now, privately. Free discovery call.",
    now_cta: "Book a free call",
    signoff: "Talk soon,",
    signature: "Julien",
    ps_title: "P.S.",
    ps_body: "You can return to the kit anytime. Your progress is saved via your email. Just go back to kit.monexpansion.com.",
  };

  const labUrl = lang === "fr" ? "https://monexpansion.com/fr/escape-lab/" : "https://monexpansion.com/en/escape-lab/";
  const nowUrl = "https://www.monexpansion.com/escape-now/";
  const kitUrl = "https://kit.monexpansion.com";

  return {
    subject: t.subject,
    htmlContent: emailWrapper(`
      <p style="font-size:16px;color:${BRAND.textPrimary};margin:0 0 16px;">${t.hi}</p>
      <p style="font-size:15px;color:${BRAND.textSecondary};line-height:1.6;margin:0 0 32px;">${t.intro}</p>

      <!-- Profile result card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bgCard};border-radius:16px;padding:24px;margin-bottom:16px;">
        <tr><td align="center">
          <div style="font-size:10px;letter-spacing:2px;color:${BRAND.coral};font-weight:700;text-transform:uppercase;margin-bottom:12px;">${t.profile_label}</div>
          <div style="font-size:28px;font-weight:800;color:${tensionColor};margin-bottom:8px;line-height:1.2;">${tensionLabel}</div>
          <div style="font-size:42px;font-weight:800;color:${tensionColor};margin-bottom:4px;">${signalCount}<span style="font-size:18px;color:${BRAND.textMuted};">/10</span></div>
          <div style="font-size:12px;color:${BRAND.textMuted};margin-bottom:16px;">${t.signals}</div>
          <div style="font-size:14px;color:${BRAND.textSecondary};line-height:1.6;">${tensionSub}</div>
        </td></tr>
      </table>

      <!-- Archetype card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BRAND.coral}40;border-radius:16px;padding:24px;margin-bottom:32px;">
        <tr><td align="center">
          <div style="font-size:10px;letter-spacing:2px;color:${BRAND.coral};font-weight:700;text-transform:uppercase;margin-bottom:12px;">${t.archetype_label}</div>
          <div style="font-size:42px;margin-bottom:8px;">${archetypeIcon}</div>
          <div style="font-size:20px;font-weight:700;color:${BRAND.textPrimary};margin-bottom:8px;">${archetypeLabel}</div>
          <div style="font-size:14px;color:${BRAND.textSecondary};line-height:1.6;">${archetypeDesc}</div>
        </td></tr>
      </table>

      <!-- Next module CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BRAND.border};border-radius:16px;padding:24px;margin-bottom:16px;">
        <tr><td>
          <div style="font-size:17px;font-weight:700;color:${BRAND.textPrimary};margin-bottom:8px;">${t.next_title}</div>
          <div style="font-size:14px;color:${BRAND.textSecondary};line-height:1.6;margin-bottom:16px;">${t.next_body}</div>
          ${ctaButton(kitUrl, t.next_cta)}
        </td></tr>
      </table>

      <p style="text-align:center;color:${BRAND.textMuted};margin:32px 0;letter-spacing:4px;">${t.divider}</p>

      ${resumeBlock(resumeUrl, lang)}

      ${escapeBlocks(t, labUrl, nowUrl)}

      ${signature(t)}
    `),
  };
}

function module2Email({ firstName, score, verdict, verdictSub, verdictColor, topGaps, lang, resumeUrl }) {
  const t = lang === "fr" ? {
    subject: `${firstName}, ta carte des besoins est prête`,
    hi: `Bonjour ${firstName},`,
    intro: "Module 2 complété. Tu as maintenant la carte de tes besoins essentiels, et où ils coincent. Voici ton résultat complet.",
    score_label: "TON SCORE D'ALIGNEMENT",
    gaps_label: "LÀ OÙ ÇA COINCE",
    next_title: "Prochaine étape : trouver ta direction.",
    next_body: "Tu vois le piège. Tu comprends les besoins qui souffrent. Le Module 3 t'aide à identifier ce qui t'appartient vraiment — ton talent organique. 15 minutes de réflexion guidée.",
    next_cta: "Finir le parcours",
    divider: "— — —",
    lab_title: "🧪 Escape Lab",
    lab_body: "Une cohorte de créatifs dans la même situation. 3 mois. Sessions live avec Julien. Groupe privé. Le format bootcamp pour sortir du piège avec des pairs qui comprennent.",
    lab_cta: "Découvrir l'Escape Lab",
    now_title: "🚀 Escape Now!",
    now_body: "4 sessions de coaching individuel intensif avec Julien, calibrées sur ton diagnostic. Pour ceux qui veulent régler ça maintenant, en 1:1. Appel de découverte gratuit.",
    now_cta: "Réserver un appel gratuit",
    signoff: "À bientôt,",
    signature: "Julien",
    ps_title: "P.S.",
    ps_body: "Ta progression est sauvegardée. Reprends quand tu veux sur kit.monexpansion.com.",
  } : {
    subject: `${firstName}, your needs map is ready`,
    hi: `Hi ${firstName},`,
    intro: "Module 2 complete. You now have the map of your essential needs, and where they're stuck. Here's your full result.",
    score_label: "YOUR ALIGNMENT SCORE",
    gaps_label: "WHERE IT BREAKS DOWN",
    next_title: "Next step: find your direction.",
    next_body: "You see the trap. You understand the needs that are suffering. Module 3 helps you identify what truly belongs to you — your organic talent. 15 minutes of guided reflection.",
    next_cta: "Finish the journey",
    divider: "— — —",
    lab_title: "🧪 Escape Lab",
    lab_body: "A cohort of creatives in the same situation. 3 months. Live sessions with Julien. Private group. A bootcamp format to escape the trap with peers who get it.",
    lab_cta: "Discover the Escape Lab",
    now_title: "🚀 Escape Now!",
    now_body: "4 intensive 1:1 coaching sessions with Julien, calibrated to your diagnostic. For those who want to fix this now, privately. Free discovery call.",
    now_cta: "Book a free call",
    signoff: "Talk soon,",
    signature: "Julien",
    ps_title: "P.S.",
    ps_body: "Your progress is saved. Come back anytime at kit.monexpansion.com.",
  };

  const labUrl = lang === "fr" ? "https://monexpansion.com/fr/escape-lab/" : "https://monexpansion.com/en/escape-lab/";
  const nowUrl = "https://www.monexpansion.com/escape-now/";
  const kitUrl = "https://kit.monexpansion.com";

  const gapsHtml = (topGaps || []).map((g) => `
    <tr><td style="padding:8px 0;border-bottom:1px solid ${BRAND.border};">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-size:14px;font-weight:700;color:${BRAND.textPrimary};">${g.name}</td>
        <td align="right" style="font-size:12px;font-weight:600;color:${BRAND.coral};">${g.status}</td>
      </tr></table>
    </td></tr>
  `).join("");

  return {
    subject: t.subject,
    htmlContent: emailWrapper(`
      <p style="font-size:16px;color:${BRAND.textPrimary};margin:0 0 16px;">${t.hi}</p>
      <p style="font-size:15px;color:${BRAND.textSecondary};line-height:1.6;margin:0 0 32px;">${t.intro}</p>

      <!-- Score card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bgCard};border-radius:16px;padding:24px;margin-bottom:16px;">
        <tr><td align="center">
          <div style="font-size:10px;letter-spacing:2px;color:${BRAND.coral};font-weight:700;text-transform:uppercase;margin-bottom:12px;">${t.score_label}</div>
          <div style="font-size:48px;font-weight:800;color:${verdictColor};margin-bottom:8px;">${score}<span style="font-size:20px;color:${BRAND.textMuted};">/100</span></div>
          <div style="font-size:20px;font-weight:800;color:${verdictColor};margin-bottom:8px;">${verdict}</div>
          <div style="font-size:14px;color:${BRAND.textSecondary};line-height:1.6;">${verdictSub}</div>
        </td></tr>
      </table>

      ${gapsHtml ? `
      <!-- Gaps card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BRAND.border};border-radius:16px;padding:20px 24px;margin-bottom:32px;">
        <tr><td>
          <div style="font-size:10px;letter-spacing:2px;color:${BRAND.textMuted};font-weight:700;text-transform:uppercase;margin-bottom:12px;">${t.gaps_label}</div>
          <table width="100%" cellpadding="0" cellspacing="0">${gapsHtml}</table>
        </td></tr>
      </table>
      ` : ""}

      <!-- Next module CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BRAND.border};border-radius:16px;padding:24px;margin-bottom:16px;">
        <tr><td>
          <div style="font-size:17px;font-weight:700;color:${BRAND.textPrimary};margin-bottom:8px;">${t.next_title}</div>
          <div style="font-size:14px;color:${BRAND.textSecondary};line-height:1.6;margin-bottom:16px;">${t.next_body}</div>
          ${ctaButton(kitUrl, t.next_cta)}
        </td></tr>
      </table>

      <p style="text-align:center;color:${BRAND.textMuted};margin:32px 0;letter-spacing:4px;">${t.divider}</p>

      ${resumeBlock(resumeUrl, lang)}

      ${escapeBlocks(t, labUrl, nowUrl)}

      ${signature(t)}
    `),
  };
}

function module3Email({ firstName, tensionLabel, signalCount, score, verdict, lang, resumeUrl }) {
  const t = lang === "fr" ? {
    subject: `${firstName}, ton profil d'expansion est complet`,
    hi: `Bonjour ${firstName},`,
    intro: "Tu as terminé les 3 modules. Ton parcours diagnostic est complet. Voici ce que ça donne :",
    full_profile: "TON PROFIL COMPLET",
    m1_label: "Profil de tension",
    m2_label: "Score d'alignement",
    m3_label: "Direction",
    m3_value: "Réflexion guidée complétée",
    insight: "Ce profil n'est pas une réponse. C'est le début d'une conversation avec toi-même.",
    next_title: "Et maintenant ?",
    next_body: "Tu as le diagnostic. Tu as la carte. Tu as commencé à identifier ta direction. La prochaine question c'est : qu'est-ce que tu fais de tout ça ? Deux options selon ton moment :",
    divider: "— — —",
    lab_title: "🧪 Escape Lab — Recommandé si tu veux un cadre",
    lab_body: "Une cohorte de créatifs dans la même situation. 3 mois, sessions live avec Julien, groupe privé Telegram, binômes de soutien. C'est le bootcamp pour sortir du piège avec des pairs qui comprennent. 197€.",
    lab_cta: "Découvrir l'Escape Lab",
    now_title: "🚀 Escape Now! — Recommandé si tu veux aller vite, en 1:1",
    now_body: "4 sessions de coaching individuel intensif avec Julien, calibrées sur ton diagnostic. Pour ceux qui veulent régler ça maintenant, privément. Appel de découverte gratuit pour voir si c'est pour toi.",
    now_cta: "Réserver un appel gratuit",
    signoff: "Ton parcours commence vraiment maintenant.",
    signature: "Julien",
    ps_title: "P.S.",
    ps_body: "Refais ce diagnostic dans 90 jours pour mesurer ta progression. Ta progression actuelle est sauvegardée sur kit.monexpansion.com.",
  } : {
    subject: `${firstName}, your expansion profile is complete`,
    hi: `Hi ${firstName},`,
    intro: "You completed all 3 modules. Your diagnostic journey is complete. Here's the picture:",
    full_profile: "YOUR FULL PROFILE",
    m1_label: "Tension profile",
    m2_label: "Alignment score",
    m3_label: "Direction",
    m3_value: "Guided reflection completed",
    insight: "This profile isn't an answer. It's the start of a conversation with yourself.",
    next_title: "What now?",
    next_body: "You have the diagnostic. You have the map. You've started to identify your direction. The next question is: what do you do with all this? Two options depending on your moment:",
    divider: "— — —",
    lab_title: "🧪 Escape Lab — Recommended if you want a framework",
    lab_body: "A cohort of creatives in the same situation. 3 months, live sessions with Julien, private Telegram group, peer pairs. It's the bootcamp to escape the trap with peers who get it. €197.",
    lab_cta: "Discover the Escape Lab",
    now_title: "🚀 Escape Now! — Recommended if you want to move fast, 1:1",
    now_body: "4 intensive 1:1 coaching sessions with Julien, calibrated to your diagnostic. For those who want to fix this now, privately. Free discovery call to see if it's for you.",
    now_cta: "Book a free call",
    signoff: "Your real journey starts now.",
    signature: "Julien",
    ps_title: "P.S.",
    ps_body: "Retake this diagnostic in 90 days to measure your progress. Your current progress is saved at kit.monexpansion.com.",
  };

  const labUrl = lang === "fr" ? "https://monexpansion.com/fr/escape-lab/" : "https://monexpansion.com/en/escape-lab/";
  const nowUrl = "https://www.monexpansion.com/escape-now/";

  return {
    subject: t.subject,
    htmlContent: emailWrapper(`
      <p style="font-size:16px;color:${BRAND.textPrimary};margin:0 0 16px;">${t.hi}</p>
      <p style="font-size:15px;color:${BRAND.textSecondary};line-height:1.6;margin:0 0 32px;">${t.intro}</p>

      <!-- Full profile card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bgCard};border-radius:16px;padding:24px;margin-bottom:16px;">
        <tr><td>
          <div style="font-size:10px;letter-spacing:2px;color:${BRAND.coral};font-weight:700;text-transform:uppercase;margin-bottom:16px;text-align:center;">${t.full_profile}</div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};">
              <table width="100%"><tr>
                <td style="font-size:13px;color:${BRAND.textMuted};">${t.m1_label}</td>
                <td align="right" style="font-size:15px;font-weight:700;color:${BRAND.textPrimary};">${tensionLabel} — ${signalCount}/10</td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};">
              <table width="100%"><tr>
                <td style="font-size:13px;color:${BRAND.textMuted};">${t.m2_label}</td>
                <td align="right" style="font-size:15px;font-weight:700;color:${BRAND.textPrimary};">${verdict} — ${score}/100</td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:10px 0;">
              <table width="100%"><tr>
                <td style="font-size:13px;color:${BRAND.textMuted};">${t.m3_label}</td>
                <td align="right" style="font-size:14px;font-weight:600;color:${BRAND.green};">✓ ${t.m3_value}</td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>
      </table>

      <!-- Insight quote -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        <tr><td align="center" style="padding:24px;">
          <div style="font-size:16px;font-style:italic;color:${BRAND.textSecondary};line-height:1.6;max-width:420px;margin:0 auto;">"${t.insight}"</div>
        </td></tr>
      </table>

      <!-- Next steps intro -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BRAND.border};border-radius:16px;padding:24px;margin-bottom:32px;">
        <tr><td>
          <div style="font-size:17px;font-weight:700;color:${BRAND.textPrimary};margin-bottom:8px;">${t.next_title}</div>
          <div style="font-size:14px;color:${BRAND.textSecondary};line-height:1.6;">${t.next_body}</div>
        </td></tr>
      </table>

      <p style="text-align:center;color:${BRAND.textMuted};margin:0 0 32px;letter-spacing:4px;">${t.divider}</p>

      ${resumeBlock(resumeUrl, lang)}

      ${escapeBlocks(t, labUrl, nowUrl)}

      ${signature(t)}
    `),
  };
}

// ─────────────── SHARED TEMPLATE HELPERS ───────────────

function emailWrapper(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Talent Trap Escape Kit</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bgLight};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bgLight};padding:24px 16px;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.04);">
        <!-- Header bar -->
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND.coral},${BRAND.coralLight});padding:4px 0;"></td>
        </tr>
        <!-- Header -->
        <tr>
          <td style="padding:28px 32px 20px;border-bottom:1px solid ${BRAND.border};">
            <div style="font-size:10px;letter-spacing:3px;color:${BRAND.coral};font-weight:700;text-transform:uppercase;margin-bottom:4px;">TALENT TRAP ESCAPE KIT</div>
            <div style="font-size:14px;color:${BRAND.textMuted};">monexpansion.com</div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${bodyHtml}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid ${BRAND.border};background:${BRAND.bgLight};">
            <div style="font-size:11px;color:${BRAND.textMuted};line-height:1.6;text-align:center;">
              Julien Klein · Coach certifié Robbins-Madanes Training<br>
              <a href="https://monexpansion.com" style="color:${BRAND.coral};text-decoration:none;">monexpansion.com</a>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function ctaButton(url, label) {
  return `<table cellpadding="0" cellspacing="0"><tr><td>
    <a href="${url}" style="display:inline-block;background:${BRAND.coral};color:#fff;text-decoration:none;padding:14px 28px;border-radius:20px;font-size:14px;font-weight:600;">${label} →</a>
  </td></tr></table>`;
}

function escapeBlocks(t, labUrl, nowUrl) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BRAND.border};border-radius:16px;padding:24px;margin-bottom:16px;">
      <tr><td>
        <div style="font-size:16px;font-weight:700;color:${BRAND.textPrimary};margin-bottom:6px;">${t.lab_title}</div>
        <div style="display:inline-block;background:${BRAND.bgCard};color:${BRAND.textMuted};font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:10px;">Cohorte</div>
        <div style="font-size:14px;color:${BRAND.textSecondary};line-height:1.6;margin-bottom:16px;">${t.lab_body}</div>
        ${ctaButton(labUrl, t.lab_cta)}
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BRAND.coral}40;border-radius:16px;padding:24px;margin-bottom:32px;">
      <tr><td>
        <div style="font-size:16px;font-weight:700;color:${BRAND.textPrimary};margin-bottom:6px;">${t.now_title}</div>
        <div style="display:inline-block;background:${BRAND.bgCard};color:${BRAND.textMuted};font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:10px;">Coaching 1:1</div>
        <div style="font-size:14px;color:${BRAND.textSecondary};line-height:1.6;margin-bottom:16px;">${t.now_body}</div>
        <a href="${nowUrl}" style="display:inline-block;background:transparent;color:${BRAND.coral};text-decoration:none;padding:12px 24px;border-radius:20px;font-size:14px;font-weight:600;border:1px solid ${BRAND.coral};">${t.now_cta} →</a>
      </td></tr>
    </table>
  `;
}

function resumeBlock(resumeUrl, lang) {
  if (!resumeUrl) return "";
  const label = lang === "fr" ? "Reprendre mon parcours" : "Resume my journey";
  const sub = lang === "fr"
    ? "Ce lien restaure ta progression. Garde cet email — c'est ton accès permanent."
    : "This link restores your progress. Keep this email — it's your permanent access.";
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bgLight};border:1px solid ${BRAND.border};border-radius:16px;padding:20px;margin-bottom:24px;">
      <tr><td align="center">
        <div style="font-size:20px;margin-bottom:8px;">🔗</div>
        <div style="font-size:12px;color:${BRAND.textSecondary};line-height:1.5;margin-bottom:12px;">${sub}</div>
        <a href="${resumeUrl}" style="display:inline-block;background:${BRAND.coral};color:#fff;text-decoration:none;padding:12px 24px;border-radius:20px;font-size:14px;font-weight:600;">${label} →</a>
      </td></tr>
    </table>
  `;
}

function signature(t) {
  return `
    <p style="font-size:15px;color:${BRAND.textPrimary};margin:0 0 8px;">${t.signoff}</p>
    <p style="font-size:15px;color:${BRAND.textPrimary};margin:0 0 32px;white-space:pre-line;font-weight:600;">${t.signature}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bgLight};border-radius:12px;padding:16px 20px;">
      <tr><td>
        <div style="font-size:12px;font-weight:700;color:${BRAND.textMuted};margin-bottom:4px;">${t.ps_title}</div>
        <div style="font-size:13px;color:${BRAND.textSecondary};line-height:1.6;">${t.ps_body}</div>
      </td></tr>
    </table>
  `;
}

// ─────────────── HANDLER ───────────────

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body;
    if (!data.email || !data.firstName || !data.module) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Build resume URL from progress data (same base64 encoding as client)
    const resumeUrl = data.resumeUrl || null;

    let email;
    if (data.module === 1) email = module1Email({ ...data, resumeUrl });
    else if (data.module === 2) email = module2Email({ ...data, resumeUrl });
    else if (data.module === 3) email = module3Email({ ...data, resumeUrl });
    else return res.status(400).json({ error: "Invalid module" });

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_KEY,
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: data.email, name: data.firstName }],
        subject: email.subject,
        htmlContent: email.htmlContent,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Brevo send error:", errText);
      return res.status(500).json({ error: "Send failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("send-result-email error:", e);
    return res.status(500).json({ error: "Internal error" });
  }
}
