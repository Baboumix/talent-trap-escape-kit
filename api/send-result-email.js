// Send result email via Brevo transactional API.
// Auto-Coach Kit v2: single template, based on top 3 Essential Needs.

const BREVO_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = "julien@monexpansion.com";
const FROM_NAME = "Julien Klein · monExpansion";

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

// Need-specific emoji + soft accent color (mirror of NEED_ACCENTS in src/data/needs.js).
// Duplicated server-side to keep the email worker self-contained.
const NEED_ACCENTS = {
  stability:   { color: "#61CE70", emoji: "🌳" },
  stimulation: { color: "#FF8A54", emoji: "⚡" },
  recognition: { color: "#FE6C63", emoji: "⭐" },
  belonging:   { color: "#EC4899", emoji: "🤝" },
  growth:      { color: "#8B5CF6", emoji: "🌱" },
  impact:      { color: "#3B82F6", emoji: "🎯" },
};

function slugifyNeedId(name) {
  // Tolerate English or French names coming from the client.
  const n = (name || "").toLowerCase();
  if (n.startsWith("stab")) return "stability";
  if (n.startsWith("stim")) return "stimulation";
  if (n.startsWith("recon") || n.startsWith("recog")) return "recognition";
  if (n.startsWith("appar") || n.startsWith("belong")) return "belonging";
  if (n.startsWith("crois") || n.startsWith("grow")) return "growth";
  if (n.startsWith("imp")) return "impact";
  return null;
}

function buildEmail({ firstName, topNeeds, lang, resumeUrl }) {
  const t = lang === "en"
    ? {
        subject: `${firstName}, your top 3 essential needs are ready`,
        hi: `Hi ${firstName},`,
        intro: "You just completed the Auto-Coach Kit. Here are your 3 dominant essential needs right now, the ones driving your decisions, often unconsciously.",
        top_label: "YOUR TOP 3",
        rank: "#",
        score_of: "/ 40",
        step2_title: "Step 2 is coming.",
        step2_body: "You now know your 3 dominant needs. Next step: see whether you're satisfying them in a way that charges you or drains you, through the Energy Triangle (Focus, Physiology, Language).",
        divider: "— — —",
        lab_title: "🏕️ The Expansion Bootcamp",
        lab_tag: "Group program",
        lab_body: "Move forward with a group. 12 creatives in the same situation. 3 months. Live sessions with Julien. Private group.",
        lab_cta: "Discover the Bootcamp",
        now_title: "🎯 Private coaching with Julien",
        now_tag: "1:1 Coaching",
        now_body: "4 intensive 1:1 coaching sessions, calibrated to your profile. For those who want to move fast, privately. Free discovery call.",
        now_cta: "Book a free call",
        signoff: "Talk soon,",
        signature: "Julien",
        ps_title: "P.S.",
        ps_body: "These priorities shift with age and circumstances. This is a snapshot, not a frozen truth. Retake the test in 90 days to compare.",
      }
    : {
        subject: `${firstName}, tes 3 besoins prioritaires sont prêts`,
        hi: `Bonjour ${firstName},`,
        intro: "Tu viens de compléter l'Auto-Coach Kit. Voici tes 3 besoins essentiels dominants en ce moment, ceux qui dirigent tes décisions, souvent à ton insu.",
        top_label: "TON TOP 3",
        rank: "N°",
        score_of: "/ 40",
        step2_title: "L'étape 2 arrive.",
        step2_body: "Tu connais maintenant tes 3 besoins dominants. Prochaine étape : voir si tu les satisfais d'une manière qui te charge ou qui te vide, via le Triangle Énergétique (Focus, Physiologie, Langage).",
        divider: "— — —",
        lab_title: "🏕️ Le Bootcamp Expansion",
        lab_tag: "Programme de groupe",
        lab_body: "Avancer en groupe. 12 créatifs dans la même situation. 3 mois. Sessions live avec Julien. Groupe privé.",
        lab_cta: "Découvrir le Bootcamp",
        now_title: "🎯 Coaching privé avec Julien",
        now_tag: "Coaching 1:1",
        now_body: "4 sessions individuelles intensives, calibrées sur ton profil. Pour ceux qui veulent avancer vite, privément. Appel de découverte gratuit.",
        now_cta: "Réserver un appel gratuit",
        signoff: "À bientôt,",
        signature: "Julien",
        ps_title: "P.S.",
        ps_body: "Tes priorités évoluent avec l'âge et les circonstances. C'est un instantané, pas une vérité figée. Refais le test dans 90 jours pour comparer.",
      };

  const labUrl = lang === "en"
    ? "https://monexpansion.com/en/escape-lab/"
    : "https://monexpansion.com/fr/escape-lab/";
  const nowUrl = "https://www.monexpansion.com/escape-now/";

  const topCards = (topNeeds || [])
    .map((n, i) => {
      const id = slugifyNeedId(n.name);
      const a = (id && NEED_ACCENTS[id]) || { color: BRAND.coral, emoji: "🎯" };
      const pct = Math.min(100, Math.round(((n.score || 0) / 40) * 100));
      return `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
          <tr>
            <td style="background:linear-gradient(135deg,${a.color}14,${a.color}06);border:1px solid ${a.color}44;border-radius:14px;padding:18px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="width:44px;font-size:26px;line-height:1;">${a.emoji}</td>
                  <td valign="middle" style="padding-left:6px;">
                    <div style="font-size:10px;letter-spacing:1.5px;color:${a.color};font-weight:800;text-transform:uppercase;line-height:1;">${t.rank}${i + 1}</div>
                    <div style="font-size:18px;font-weight:800;color:${BRAND.textPrimary};line-height:1.2;margin-top:2px;">${n.name}</div>
                  </td>
                  <td valign="middle" align="right" style="white-space:nowrap;">
                    <span style="font-size:22px;font-weight:800;color:${a.color};">${n.score}</span>
                    <span style="font-size:12px;color:${BRAND.textMuted};">${t.score_of}</span>
                  </td>
                </tr>
              </table>
              <div style="margin-top:12px;height:5px;border-radius:3px;background:${BRAND.border};overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:${a.color};border-radius:3px;"></div>
              </div>
            </td>
          </tr>
        </table>
      `;
    })
    .join("");

  const html = emailWrapper(`
    <p style="font-size:16px;color:${BRAND.textPrimary};margin:0 0 16px;">${t.hi}</p>
    <p style="font-size:15px;color:${BRAND.textSecondary};line-height:1.6;margin:0 0 28px;">${t.intro}</p>

    <div style="font-size:10px;letter-spacing:2px;color:${BRAND.coral};font-weight:800;text-transform:uppercase;margin:0 0 14px;">${t.top_label}</div>

    ${topCards}

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BRAND.border};border-radius:16px;padding:20px 22px;margin:20px 0 28px;">
      <tr><td>
        <div style="font-size:16px;font-weight:800;color:${BRAND.textPrimary};margin-bottom:8px;">${t.step2_title}</div>
        <div style="font-size:13px;color:${BRAND.textSecondary};line-height:1.6;">${t.step2_body}</div>
      </td></tr>
    </table>

    <p style="text-align:center;color:${BRAND.textMuted};margin:24px 0;letter-spacing:4px;">${t.divider}</p>

    ${resumeBlock(resumeUrl, lang)}

    ${escapeBlocks(t, labUrl, nowUrl)}

    ${signature(t)}
  `);

  return { subject: t.subject, htmlContent: html };
}

function emailWrapper(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Auto-Coach Kit</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bgLight};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bgLight};padding:24px 16px;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.04);">
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND.coral},${BRAND.coralLight});padding:4px 0;"></td>
        </tr>
        <tr>
          <td style="padding:28px 32px 20px;border-bottom:1px solid ${BRAND.border};">
            <div style="font-size:10px;letter-spacing:3px;color:${BRAND.coral};font-weight:700;text-transform:uppercase;margin-bottom:4px;">AUTO-COACH KIT</div>
            <div style="font-size:14px;color:${BRAND.textMuted};">kit.monexpansion.com</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            ${bodyHtml}
          </td>
        </tr>
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
        <div style="display:inline-block;background:${BRAND.bgCard};color:${BRAND.textMuted};font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:10px;">${t.lab_tag}</div>
        <div style="font-size:14px;color:${BRAND.textSecondary};line-height:1.6;margin-bottom:16px;">${t.lab_body}</div>
        ${ctaButton(labUrl, t.lab_cta)}
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BRAND.coral}40;border-radius:16px;padding:24px;margin-bottom:28px;">
      <tr><td>
        <div style="font-size:16px;font-weight:700;color:${BRAND.textPrimary};margin-bottom:6px;">${t.now_title}</div>
        <div style="display:inline-block;background:${BRAND.bgCard};color:${BRAND.textMuted};font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:10px;">${t.now_tag}</div>
        <div style="font-size:14px;color:${BRAND.textSecondary};line-height:1.6;margin-bottom:16px;">${t.now_body}</div>
        <a href="${nowUrl}" style="display:inline-block;background:transparent;color:${BRAND.coral};text-decoration:none;padding:12px 24px;border-radius:20px;font-size:14px;font-weight:600;border:1px solid ${BRAND.coral};">${t.now_cta} →</a>
      </td></tr>
    </table>
  `;
}

function resumeBlock(resumeUrl, lang) {
  if (!resumeUrl) return "";
  const label = lang === "en" ? "Re-open my result" : "Rouvrir mon résultat";
  const sub = lang === "en"
    ? "This link re-opens your top 3 whenever you want. Keep this email."
    : "Ce lien rouvre ton top 3 quand tu veux. Garde cet email.";
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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body;
    if (!data?.email || !data?.firstName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const email = buildEmail({
      firstName: data.firstName,
      topNeeds: Array.isArray(data.topNeeds) ? data.topNeeds : [],
      lang: data.lang === "en" ? "en" : "fr",
      resumeUrl: data.resumeUrl || null,
    });

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
