import {
  MODIFIERS,
  NEED_LABELS,
  NEED_ORDER,
  NEED_QUESTIONS,
  STATUS_HOOKS,
  STATUS_LABELS,
  VERDICTS,
} from "./content";
import type { DiagnosticInput, DiagnosticResult, Need } from "./types";

const BRAND = {
  coral: "#FE6C63",
  coralLight: "#FF8A54",
  ink: "#0B0A0B",
  textPrimary: "#0B0A0B",
  textSecondary: "#4a5568",
  textMuted: "#6b7280",
  bgPage: "#faf9f8",
  bgCard: "#ffffff",
  bgAccent: "#fff5f3",
  bgVerrouille: "#fff0ee",
  bgSatisfait: "#f0f8f3",
  border: "#e5e5e5",
  borderAccent: "#FFD3CE",
};

const SOCIAL_LINKS = [
  { label: "monexpansion.com", url: "https://monexpansion.com" },
  {
    label: "YouTube",
    url: "https://www.youtube.com/channel/UCxQtPK0hRbXC8Rvb_j4OgeA",
  },
  {
    label: "Apple Podcasts",
    url: "https://podcasts.apple.com/fr/podcast/mon-expansion/id1689127397",
  },
  {
    label: "Spotify",
    url: "https://open.spotify.com/show/0i55bBSIvvOiwcJiz9PBKC",
  },
  { label: "Instagram", url: "https://instagram.com/monexpansion" },
  { label: "TikTok", url: "https://tiktok.com/@monexpansion.com" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/julienklein/" },
];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraphsToHtml(text: string): string {
  return text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 16px 0; font-size:16px; line-height:1.65; color:${BRAND.textPrimary};">${escapeHtml(
          p,
        )}</p>`,
    )
    .join("");
}

function statusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "verrouille":
      return { bg: BRAND.bgVerrouille, text: BRAND.coral };
    case "satisfait":
      return { bg: BRAND.bgSatisfait, text: "#2d7a4f" };
    default:
      return { bg: BRAND.bgAccent, text: BRAND.coralLight };
  }
}

function renderNeedRow(
  need: Need,
  result: DiagnosticResult,
  isDominant: boolean,
): string {
  const score = result.needScores[need];
  const label = NEED_LABELS[need];
  const question = NEED_QUESTIONS[need];
  const statusLabel = STATUS_LABELS[score.status];
  const hook = STATUS_HOOKS[score.status];
  const colors = statusColor(score.status);

  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 12px 0;">
    <tr><td style="background-color:${colors.bg}; border-radius:12px; padding:18px 20px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="font-family:Georgia,'Times New Roman',serif; font-size:20px; font-weight:600; color:${BRAND.textPrimary};">
            ${escapeHtml(label)}${isDominant ? ` <span style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:${BRAND.coral}; font-weight:700; vertical-align:middle;">· prioritaire</span>` : ""}
          </td>
          <td align="right" style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:${colors.text}; font-weight:700;">
            ${escapeHtml(statusLabel)}
          </td>
        </tr>
      </table>
      <p style="margin:6px 0 10px 0; font-size:13px; color:${BRAND.textMuted}; font-style:italic;">
        ${escapeHtml(question)}
      </p>
      <p style="margin:0 0 12px 0; font-size:14px; line-height:1.55; color:${BRAND.textPrimary};">
        ${escapeHtml(hook)}
      </p>
      <p style="margin:0; font-size:12px; color:${BRAND.textMuted}; letter-spacing:0.04em;">
        Intensité <strong style="color:${BRAND.textPrimary};">${score.intensity}/4</strong> &nbsp;·&nbsp; Satisfaction <strong style="color:${BRAND.textPrimary};">${score.satisfaction}/4</strong>
      </p>
    </td></tr>
  </table>`;
}

function renderModifierBlock(
  result: DiagnosticResult,
): string {
  if (result.modifiers.length === 0) {
    return `
    <tr><td style="padding:24px 32px 0 32px;">
      <p style="margin:0; font-size:15px; line-height:1.65; color:${BRAND.textMuted}; font-style:italic;">
        Tes réponses ne déclenchent aucun angle mort spécifique. C'est un bon signe.
      </p>
    </td></tr>`;
  }

  const blocks = result.modifiers
    .map((k) => {
      const m = MODIFIERS[k];
      return `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 16px 0;">
        <tr><td style="background-color:${BRAND.bgAccent}; border:1px solid ${BRAND.borderAccent}; border-radius:12px; padding:18px 22px;">
          <p style="margin:0 0 10px 0; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:${BRAND.coral}; font-weight:700;">
            ${escapeHtml(m.displayName)}
          </p>
          <p style="margin:0; font-size:15px; line-height:1.65; color:${BRAND.textPrimary};">
            ${escapeHtml(m.paragraph)}
          </p>
        </td></tr>
      </table>`;
    })
    .join("");

  return `
    <tr><td style="padding:24px 32px 0 32px;">
      ${blocks}
    </td></tr>`;
}

function renderSocialsBlock(): string {
  const links = SOCIAL_LINKS.map(
    (s) =>
      `<a href="${s.url}" style="color:${BRAND.coral}; text-decoration:none; font-weight:600;">${escapeHtml(s.label)}</a>`,
  ).join(" &nbsp;·&nbsp; ");

  return `
    <tr><td style="padding:32px 32px 0 32px;">
      <div style="height:1px; background-color:${BRAND.border};"></div>
    </td></tr>
    <tr><td style="padding:24px 32px 8px 32px;">
      <p style="margin:0 0 12px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
        Reste connecté
      </p>
      <p style="margin:0 0 14px 0; font-size:15px; line-height:1.65; color:${BRAND.textPrimary};">
        Si ce diagnostic t'a touché, voici où retrouver le reste du travail. Le site, le podcast, et les réseaux où je publie chaque semaine.
      </p>
      <p style="margin:0; font-size:14px; line-height:1.9; color:${BRAND.textPrimary};">
        ${links}
      </p>
    </td></tr>`;
}

export function generateReportHtml({
  input,
  result,
}: {
  input: DiagnosticInput;
  result: DiagnosticResult;
}): string {
  const verdict = VERDICTS[result.verdict];
  const dominantSet = new Set(result.dominantNeeds);
  const waitlistUrl =
    input.lang === "en"
      ? process.env.WAITLIST_BOOTCAMP_URL_EN ||
        "https://www.monexpansion.com/en/bootcamp/"
      : process.env.WAITLIST_BOOTCAMP_URL_FR ||
        "https://www.monexpansion.com/bootcamp/";

  const needsHtml = NEED_ORDER.map((n) =>
    renderNeedRow(n, result, dominantSet.has(n)),
  ).join("");

  return `<!doctype html>
<html lang="${input.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ton diagnostic complet · ${escapeHtml(verdict.notionName)}</title>
</head>
<body style="margin:0; padding:0; background-color:${BRAND.bgPage}; font-family:Helvetica,Arial,sans-serif; color:${BRAND.textPrimary}; -webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BRAND.bgPage};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:${BRAND.bgCard}; border-radius:16px; overflow:hidden; box-shadow:0 1px 2px rgba(0,0,0,0.04);">

        <tr><td style="padding:56px 32px 40px 32px; text-align:center; border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0 0 24px 0; font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:${BRAND.coral}; font-weight:700;">
            Active ton expansion
          </p>
          <p style="margin:0 0 8px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.textMuted};">
            Ton talent activé
          </p>
          <h1 style="margin:0 0 14px 0; font-family:Georgia,'Times New Roman',serif; font-size:84px; line-height:1.0; font-weight:600; color:${BRAND.coral}; letter-spacing:-0.03em;">
            ${result.talentScore}<span style="font-size:42px; color:${BRAND.textMuted}; font-weight:400;">/10</span>
          </h1>
          <p style="margin:14px 0 0 0; font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:20px; line-height:1.3; color:${BRAND.textPrimary};">
            ${escapeHtml(verdict.notionName)}
          </p>
        </td></tr>

        <tr><td style="padding:40px 32px 8px 32px;">
          <p style="margin:0 0 20px 0; font-size:18px; line-height:1.5; color:${BRAND.textPrimary};">
            Salut ${escapeHtml(input.prenom)},
          </p>
          <p style="margin:0; font-size:16px; line-height:1.65; color:${BRAND.textPrimary};">
            Voici ton diagnostic complet, basé sur les 24 réponses que tu viens de donner. Il est structuré en 4 parties, ta note de talent activé, le détail de tes 6 besoins essentiels, ton verdict, et les angles morts que tes réponses révèlent.
          </p>
        </td></tr>

        <tr><td style="padding:32px 32px 0 32px;">
          <div style="height:1px; background-color:${BRAND.border};"></div>
        </td></tr>

        <tr><td style="padding:32px 32px 0 32px;">
          <p style="margin:0 0 8px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
            Tes 6 besoins essentiels
          </p>
          <p style="margin:0 0 20px 0; font-size:15px; line-height:1.55; color:${BRAND.textMuted}; font-style:italic;">
            Les 3 prioritaires sont ceux qui gouvernent le plus tes décisions aujourd'hui. Quand un besoin prioritaire n'est pas nourri sainement, ton talent fuit.
          </p>
          ${needsHtml}
        </td></tr>

        <tr><td style="padding:24px 32px 0 32px;">
          <div style="height:1px; background-color:${BRAND.border};"></div>
        </td></tr>

        <tr><td style="padding:32px 32px 8px 32px;">
          <p style="margin:0 0 16px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
            Ton verdict en détail
          </p>
          <p style="margin:0 0 24px 0; font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:22px; line-height:1.35; color:${BRAND.textPrimary};">
            « ${escapeHtml(verdict.phrasePunch)} »
          </p>
          ${paragraphsToHtml(verdict.descriptionLongue)}
        </td></tr>

        <tr><td style="padding:24px 32px 0 32px;">
          <div style="height:1px; background-color:${BRAND.border};"></div>
        </td></tr>

        <tr><td style="padding:32px 32px 0 32px;">
          <p style="margin:0 0 16px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
            Tes angles morts
          </p>
          <p style="margin:0 0 16px 0; font-size:15px; line-height:1.55; color:${BRAND.textMuted}; font-style:italic;">
            Ce que tes réponses révèlent et que la plupart des gens ne voient pas. Lis-les lentement.
          </p>
        </td></tr>

        ${renderModifierBlock(result)}

        <tr><td style="padding:24px 32px 0 32px;">
          <div style="height:1px; background-color:${BRAND.border};"></div>
        </td></tr>

        <tr><td style="padding:24px 32px 0 32px;">
          <p style="margin:0 0 8px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
            L'angle mort principal
          </p>
          <p style="margin:0; font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:22px; line-height:1.4; color:${BRAND.textPrimary};">
            « ${escapeHtml(verdict.angleMort)} »
          </p>
        </td></tr>

        <tr><td style="padding:32px 32px 0 32px;">
          <div style="height:1px; background-color:${BRAND.border};"></div>
        </td></tr>

        <tr><td style="padding:24px 32px 0 32px;">
          <p style="margin:0 0 8px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
            Tes 3 actions pour les 30 prochains jours
          </p>
          <p style="margin:0 0 20px 0; font-size:15px; line-height:1.55; color:${BRAND.textMuted}; font-style:italic;">
            Pas des grands gestes. Des choses concrètes, qui te sortent de la rumination et qui te remettent en mouvement.
          </p>
          ${verdict.actions30Days
            .map(
              (action, i) => `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 14px 0;">
            <tr>
              <td style="vertical-align:top; width:40px; padding-top:2px;">
                <div style="width:28px; height:28px; border-radius:999px; background-color:${BRAND.coral}; color:#ffffff; font-weight:700; font-size:13px; line-height:28px; text-align:center;">
                  ${i + 1}
                </div>
              </td>
              <td style="vertical-align:top; padding-left:4px;">
                <p style="margin:0; font-size:16px; line-height:1.65; color:${BRAND.textPrimary};">
                  ${escapeHtml(action)}
                </p>
              </td>
            </tr>
          </table>`,
            )
            .join("")}
        </td></tr>

        <tr><td style="padding:32px 32px 8px 32px;">
          <p style="margin:0 0 20px 0; font-size:16px; line-height:1.65; color:${BRAND.textPrimary};">
            D'ici là, prends soin de toi.
          </p>
          <p style="margin:0 0 8px 0; font-family:Georgia,'Times New Roman',serif; font-size:18px; font-weight:600; color:${BRAND.textPrimary};">
            Julien
          </p>
        </td></tr>

        ${renderSocialsBlock()}

        <tr><td style="padding:24px 32px 40px 32px;">
          <div style="background-color:${BRAND.bgAccent}; border-radius:14px; padding:20px 24px;">
            <p style="margin:0 0 12px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
              P.S.
            </p>
            <p style="margin:0 0 16px 0; font-size:15px; line-height:1.65; color:${BRAND.textPrimary};">
              Le <strong>Bootcamp Expansion</strong> est le programme que j'ai conçu exactement pour les gens dans ta situation. 1 mois, 4 appels hebdomadaires, décisions concrètes. Les inscriptions pour la prochaine cohorte sont sur liste d'attente.
            </p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr><td style="background-color:${BRAND.coral}; border-radius:999px;">
                <a href="${waitlistUrl}" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none;">
                  Rejoindre la waitlist →
                </a>
              </td></tr>
            </table>
          </div>
        </td></tr>

      </table>
      <p style="margin:16px 0 0 0; font-size:11px; color:${BRAND.textMuted}; text-align:center;">
        Julien Klein · monExpansion · Montréal
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}
