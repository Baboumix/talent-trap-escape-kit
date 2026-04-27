import {
  MODIFIERS,
  NEED_LABELS,
  NEED_ORDER,
  NEED_QUESTIONS,
  STATUS_HOOKS,
  STATUS_LABELS,
  VERDICTS,
} from "./content";
import { getSoftCallCta, pickCta } from "./cta";
import type {
  DiagnosticInput,
  DiagnosticResult,
  Need,
  SatisfactionStatus,
  VerdictKey,
} from "./types";

function withUtm(url: string, content: string, verdict: VerdictKey): string {
  if (!/^https?:\/\//.test(url)) return url;
  if (/[?&]utm_/.test(url)) return url;
  const sep = url.includes("?") ? "&" : "?";
  const params = new URLSearchParams({
    utm_source: "email_diagnostic",
    utm_medium: "email",
    utm_campaign: `ptc_${verdict}`,
    utm_content: content,
  });
  return `${url}${sep}${params.toString()}`;
}

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
  bgDominant: "#fff7f5",
  bgVerrouille: "#fff0ee",
  bgSatisfait: "#f0f8f3",
  border: "#e5e5e5",
  borderAccent: "#FFD3CE",
  borderDominant: "#FFB8AE",
  textSouffrance: "#C72E3F",
  borderSouffrance: "#F8B4B8",
  bgSouffrance: "#FEF1F1",
};

const SOCIAL_BRANDS = {
  youtube: { bg: "#FEF2F2", border: "#FCA5A5", text: "#C92A2A" },
  apple: { bg: "#FAF5FF", border: "#C4B5FD", text: "#6D28D9" },
  spotify: { bg: "#ECFDF5", border: "#86EFAC", text: "#15803D" },
  instagram: { bg: "#FFF1F2", border: "#FDA4AF", text: "#BE123C" },
  tiktok: { bg: "#ECFEFF", border: "#67E8F9", text: "#0E7490" },
  linkedin: { bg: "#EFF6FF", border: "#93C5FD", text: "#1D4ED8" },
};

const YOUTUBE_URL =
  "https://www.youtube.com/channel/UCxQtPK0hRbXC8Rvb_j4OgeA";
const APPLE_PODCAST_URL =
  "https://podcasts.apple.com/fr/podcast/mon-expansion/id1689127397";
const SPOTIFY_URL = "https://open.spotify.com/show/0i55bBSIvvOiwcJiz9PBKC";
const INSTAGRAM_URL = "https://instagram.com/monexpansion";
const TIKTOK_URL = "https://tiktok.com/@monexpansion.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/julienklein/";

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

function statusSentenceFr(need: Need, status: SatisfactionStatus): string {
  const label = NEED_LABELS[need];
  if (status === "satisfait") return `${label} est nourri sainement.`;
  if (status === "verrouille") return `${label} est verrouillé par le piège.`;
  return `${label} est sous influence.`;
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
  const isSouffrance = score.status !== "satisfait";

  const cardBg = isDominant ? BRAND.bgDominant : BRAND.bgCard;
  const cardBorder = isDominant ? BRAND.borderDominant : BRAND.border;

  const tags = isDominant
    ? `
        <span style="display:inline-block; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:${BRAND.coral}; font-weight:700; padding:3px 8px; border:1px solid ${BRAND.borderDominant}; background-color:${BRAND.bgAccent}; border-radius:999px; margin-right:6px;">
          Ton besoin
        </span>${
          isSouffrance
            ? `<span style="display:inline-block; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:${BRAND.textSouffrance}; font-weight:700; padding:3px 8px; border:1px solid ${BRAND.borderSouffrance}; background-color:${BRAND.bgSouffrance}; border-radius:999px;">
                En souffrance
              </span>`
            : ""
        }`
    : "";

  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 12px 0;">
    <tr><td style="background-color:${cardBg}; border:1px solid ${cardBorder}; border-radius:12px; padding:18px 20px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="font-family:Georgia,'Times New Roman',serif; font-size:20px; font-weight:600; color:${BRAND.textPrimary};">
            ${escapeHtml(label)}
          </td>
          <td align="right" style="font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:${colors.text}; font-weight:700; background-color:${colors.bg}; padding:4px 10px; border-radius:999px; white-space:nowrap;">
            ${escapeHtml(statusLabel)}
          </td>
        </tr>
      </table>
      ${tags ? `<div style="margin:10px 0 0 0;">${tags}</div>` : ""}
      <p style="margin:10px 0 10px 0; font-size:13px; color:${BRAND.textMuted}; font-style:italic;">
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

function chip(
  href: string,
  label: string,
  brand: { bg: string; border: string; text: string },
  verdict: VerdictKey,
  utmContent: string,
): string {
  const tracked = withUtm(href, utmContent, verdict);
  return `<a href="${tracked}" style="display:inline-block; font-size:13px; font-weight:600; color:${brand.text}; text-decoration:none; padding:7px 14px; margin:0 6px 6px 0; background-color:${brand.bg}; border:1px solid ${brand.border}; border-radius:999px;">${escapeHtml(label)}</a>`;
}

function renderSocialsBlock(verdict: VerdictKey): string {
  const yt = SOCIAL_BRANDS.youtube;
  const youtubeTracked = withUtm(YOUTUBE_URL, "social_youtube", verdict);
  return `
    <tr><td style="padding:32px 32px 0 32px;">
      <div style="height:1px; background-color:${BRAND.border};"></div>
    </td></tr>
    <tr><td style="padding:24px 32px 8px 32px;">
      <p style="margin:0 0 12px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
        Reste connecté
      </p>
      <p style="margin:0 0 20px 0; font-size:15px; line-height:1.65; color:${BRAND.textPrimary};">
        Si ce diagnostic t'a touché, voici où retrouver le reste du travail. Le podcast, les vidéos, les réseaux où je publie chaque semaine.
      </p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 12px 0;">
        <tr><td style="background-color:${yt.bg}; border:1px solid ${yt.border}; border-radius:14px; padding:18px 20px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="vertical-align:top;">
                <p style="margin:0 0 4px 0; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:${yt.text}; font-weight:700;">
                  1 · Le plus utile
                </p>
                <p style="margin:0 0 4px 0; font-family:Georgia,'Times New Roman',serif; font-size:18px; font-weight:600; color:${BRAND.textPrimary};">
                  Abonne-toi sur YouTube
                </p>
                <p style="margin:0 0 12px 0; font-size:13px; color:${BRAND.textMuted};">
                  Une vidéo par semaine sur les pièges du talent senior.
                </p>
                <a href="${youtubeTracked}" style="display:inline-block; font-size:13px; font-weight:600; color:#ffffff; text-decoration:none; padding:9px 18px; background-color:${yt.text}; border-radius:999px;">
                  Voir la chaîne →
                </a>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 12px 0;">
        <tr><td style="background-color:${BRAND.bgCard}; border:1px solid ${BRAND.border}; border-radius:14px; padding:16px 20px;">
          <p style="margin:0 0 6px 0; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:${BRAND.textMuted}; font-weight:700;">
            2 · Pour tes trajets
          </p>
          <p style="margin:0 0 12px 0; font-family:Georgia,'Times New Roman',serif; font-size:16px; font-weight:600; color:${BRAND.textPrimary};">
            Écoute le podcast monExpansion
          </p>
          <div>
            ${chip(APPLE_PODCAST_URL, "Apple Podcasts", SOCIAL_BRANDS.apple, verdict, "social_apple")}
            ${chip(SPOTIFY_URL, "Spotify", SOCIAL_BRANDS.spotify, verdict, "social_spotify")}
          </div>
        </td></tr>
      </table>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px 0;">
        <tr><td style="background-color:${BRAND.bgCard}; border:1px solid ${BRAND.border}; border-radius:14px; padding:16px 20px;">
          <p style="margin:0 0 6px 0; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:${BRAND.textMuted}; font-weight:700;">
            3 · Pour rester proche
          </p>
          <p style="margin:0 0 12px 0; font-family:Georgia,'Times New Roman',serif; font-size:16px; font-weight:600; color:${BRAND.textPrimary};">
            Suis monExpansion sur tes réseaux
          </p>
          <div>
            ${chip(INSTAGRAM_URL, "Instagram", SOCIAL_BRANDS.instagram, verdict, "social_instagram")}
            ${chip(TIKTOK_URL, "TikTok", SOCIAL_BRANDS.tiktok, verdict, "social_tiktok")}
            ${chip(LINKEDIN_URL, "LinkedIn", SOCIAL_BRANDS.linkedin, verdict, "social_linkedin")}
          </div>
        </td></tr>
      </table>
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
  const topTwo = result.dominantNeeds.slice(0, 2);
  const dominantSet = new Set(topTwo);
  const cta = pickCta(result.verdict, input.statutPro, input.lang);
  const softCall = getSoftCallCta(result.verdict, input.lang);
  const softCallUrlTracked = softCall
    ? withUtm(softCall.url, "soft_call_tidycal", result.verdict)
    : "";
  const ctaUrlTracked = cta
    ? withUtm(cta.url, `cta_${cta.product}`, result.verdict)
    : "";

  const dominantNames = topTwo.map((n) => NEED_LABELS[n]).join(" · ");
  const dominantSentences = topTwo
    .map((n) => statusSentenceFr(n, result.needScores[n].status))
    .join(" ");

  // Order: 2 dominants first, then the 4 others in NEED_ORDER
  const orderedNeeds: Need[] = [
    ...topTwo,
    ...NEED_ORDER.filter((n) => !dominantSet.has(n)),
  ];
  const needsHtml = orderedNeeds
    .map((n) => renderNeedRow(n, result, dominantSet.has(n)))
    .join("");

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
            Tes 2 besoins centraux
          </p>
          <p style="margin:0 0 4px 0; font-family:Georgia,'Times New Roman',serif; font-size:22px; font-weight:600; color:${BRAND.textPrimary};">
            ${escapeHtml(dominantNames)}
          </p>
          <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:${BRAND.textSecondary};">
            ${escapeHtml(dominantSentences)} Ce sont eux qui gouvernent le plus tes décisions aujourd'hui. Quand un besoin central n'est pas nourri sainement, ton talent fuit.
          </p>
          ${needsHtml}
          <p style="margin:6px 0 0 0; font-size:13px; color:${BRAND.textMuted}; font-style:italic; text-align:center;">
            Les 4 autres besoins sont en arrière-plan. Tu les retrouves ci-dessus pour avoir le tableau complet.
          </p>
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

        ${renderSocialsBlock(result.verdict)}

        ${
          cta
            ? `
        <tr><td style="padding:24px 32px ${softCall ? "12" : "40"}px 32px;">
          <div style="background-color:${BRAND.bgAccent}; border-radius:14px; padding:20px 24px;">
            <p style="margin:0 0 12px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
              P.S.
            </p>
            <p style="margin:0 0 16px 0; font-size:15px; line-height:1.65; color:${BRAND.textPrimary};">
              ${cta.intro}
            </p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr><td style="background-color:${BRAND.coral}; border-radius:999px;">
                <a href="${ctaUrlTracked}" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none;">
                  ${cta.buttonLabel}
                </a>
              </td></tr>
            </table>
          </div>
        </td></tr>`
            : ""
        }

        ${
          softCall
            ? `
        <tr><td style="padding:0 32px 40px 32px;">
          <div style="border:1px solid ${BRAND.border}; border-radius:14px; padding:18px 24px; text-align:center;">
            <p style="margin:0 0 14px 0; font-size:14px; line-height:1.6; color:${BRAND.textSecondary};">
              ${escapeHtml(softCall.intro)}
            </p>
            <a href="${softCallUrlTracked}" style="display:inline-block; padding:10px 20px; font-size:13px; font-weight:600; color:${BRAND.coral}; text-decoration:none; border:1px solid ${BRAND.coral}; border-radius:999px;">
              ${escapeHtml(softCall.buttonLabel)}
            </a>
          </div>
        </td></tr>`
            : ""
        }

      </table>
      <p style="margin:16px 0 0 0; font-size:11px; color:${BRAND.textMuted}; text-align:center;">
        Julien Klein · monExpansion · Montréal
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}
