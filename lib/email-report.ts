import { DIMENSION_LABELS, MODIFIERS, VERDICTS } from "./content";
import type {
  DiagnosticInput,
  DiagnosticResult,
  Dimension,
  ModifierKey,
} from "./types";

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
  border: "#e5e5e5",
  borderAccent: "#FFD3CE",
};

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

function interpretScore(dimension: Dimension, value: number): string {
  const bucket = value <= 5 ? "low" : value <= 10 ? "mid" : "high";

  const matrix: Record<Dimension, Record<string, string>> = {
    ancrage: {
      low: "Tu n'es pas sur-ancré. Ta sécurité et ta reconnaissance ne te tiennent pas prisonnier. Tu peux bouger sans drame — c'est rare.",
      mid: "Ton ancrage commence à te ralentir. Il y a des choses que tu ne fais pas parce qu'elles coûteraient trop cher. Pas critique, mais à regarder en face.",
      high: "Ton ancrage est devenu une ancre. Ce qui te sécurisait hier te retient aujourd'hui. C'est le marqueur le plus net du Piège du Talent.",
    },
    circulation: {
      low: "Ton énergie circule. Tu apprends, tu bouges, tu ne répètes pas bêtement. C'est précieux, ne le tiens pas pour acquis.",
      mid: "Ta circulation est tiède. Tu n'es pas encore épuisé, mais tu sens que ça ne nourrit plus comme avant. Attention à la dérive silencieuse.",
      high: "Ta circulation est cassée. Soit tu es dans l'épuisement silencieux, soit dans l'ennui masqué. Ton énergie n'a plus d'endroit où aller.",
    },
    sens: {
      low: "Ton sens est solide. Tu sais pourquoi tu fais ce que tu fais. Ça compte énormément — c'est ce qui soutient tout le reste.",
      mid: "Ton sens commence à s'effriter. Tu te poses des questions. Ne les laisse pas te paralyser, mais ne les balaie pas non plus.",
      high: "Ton sens est en crise. Tu fais sans savoir pourquoi. C'est épuisant — et potentiellement très fécond : les crises de sens précèdent les vrais changements.",
    },
  };

  return matrix[dimension][bucket];
}

function renderDimensionSection(
  dimension: Dimension,
  score: number,
  triggeredModifiers: ModifierKey[],
): string {
  const label = DIMENSION_LABELS[dimension];
  const interpretation = interpretScore(dimension, score);
  const modifiersForDim = triggeredModifiers
    .filter((k) => MODIFIERS[k].dimension === dimension)
    .map((k) => MODIFIERS[k]);

  const modifiersHtml = modifiersForDim
    .map(
      (m) => `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0 0 0;">
      <tr><td style="background-color:${BRAND.bgAccent}; border:1px solid ${BRAND.borderAccent}; border-radius:12px; padding:16px 20px;">
        <p style="margin:0 0 8px 0; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
          ${escapeHtml(m.displayName)}
        </p>
        <p style="margin:0; font-size:15px; line-height:1.65; color:${BRAND.textPrimary};">
          ${escapeHtml(m.paragraph)}
        </p>
      </td></tr>
    </table>`,
    )
    .join("");

  return `
  <tr><td style="padding:24px 32px 0 32px;">
    <p style="margin:0; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
      Dimension · ${escapeHtml(label)}
    </p>
    <p style="margin:8px 0 16px 0; font-family:Georgia, 'Times New Roman', serif; font-size:22px; font-weight:600; color:${BRAND.textPrimary};">
      Ton score : ${score}/16
    </p>
    <p style="margin:0; font-size:16px; line-height:1.65; color:${BRAND.textPrimary};">
      ${escapeHtml(interpretation)}
    </p>
    ${modifiersHtml}
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
  const waitlistUrl =
    input.lang === "en"
      ? process.env.WAITLIST_BOOTCAMP_URL_EN ||
        "https://www.monexpansion.com/en/bootcamp/"
      : process.env.WAITLIST_BOOTCAMP_URL_FR ||
        "https://www.monexpansion.com/bootcamp/";

  return `<!doctype html>
<html lang="${input.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ton rapport complet — ${escapeHtml(verdict.notionName)}</title>
</head>
<body style="margin:0; padding:0; background-color:${BRAND.bgPage}; font-family:Helvetica,Arial,sans-serif; color:${BRAND.textPrimary}; -webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BRAND.bgPage};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:${BRAND.bgCard}; border-radius:16px; overflow:hidden; box-shadow:0 1px 2px rgba(0,0,0,0.04);">

        <tr><td style="padding:56px 32px 40px 32px; text-align:center; border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0 0 24px 0; font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:${BRAND.coral}; font-weight:700;">
            Profil du Talent Coincé
          </p>
          <h1 style="margin:0 0 14px 0; font-family:Georgia,'Times New Roman',serif; font-size:52px; line-height:1.0; font-weight:500; color:${BRAND.textPrimary}; letter-spacing:-0.02em;">
            Ton rapport.
          </h1>
          <p style="margin:0; font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:20px; line-height:1.3; color:${BRAND.coral};">
            ${escapeHtml(verdict.notionName)}
          </p>
        </td></tr>

        <tr><td style="padding:40px 32px 8px 32px;">
          <p style="margin:0 0 20px 0; font-size:18px; line-height:1.5; color:${BRAND.textPrimary};">
            Salut ${escapeHtml(input.prenom)},
          </p>
          <p style="margin:0; font-size:16px; line-height:1.65; color:${BRAND.textPrimary};">
            Voici ton rapport complet, basé sur les 24 réponses que tu viens de donner. Je l'ai structuré en 5 parties : ton verdict, tes 3 dimensions en détail, et l'angle mort que tes réponses révèlent.
          </p>
        </td></tr>

        <tr><td style="padding:32px 32px 0 32px;">
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

        ${renderDimensionSection("ancrage", result.scores.ancrage, result.modifiers)}
        ${renderDimensionSection("circulation", result.scores.circulation, result.modifiers)}
        ${renderDimensionSection("sens", result.scores.sens, result.modifiers)}

        <tr><td style="padding:32px 32px 0 32px;">
          <div style="height:1px; background-color:${BRAND.border};"></div>
        </td></tr>

        <tr><td style="padding:24px 32px 0 32px;">
          <p style="margin:0 0 8px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
            Ton angle mort
          </p>
          <p style="margin:0; font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:22px; line-height:1.4; color:${BRAND.textPrimary};">
            « ${escapeHtml(verdict.angleMort)} »
          </p>
        </td></tr>

        <tr><td style="padding:32px 32px 0 32px;">
          <div style="height:1px; background-color:${BRAND.border};"></div>
        </td></tr>

        <tr><td style="padding:24px 32px 0 32px;">
          <p style="margin:0 0 16px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
            Qu'est-ce que tu fais avec ça maintenant ?
          </p>
          <p style="margin:0 0 20px 0; font-size:16px; line-height:1.65; color:${BRAND.textPrimary};">
            <strong>1.</strong> Relis ce rapport demain. Pas aujourd'hui. Tu es encore dans l'émotion de te reconnaître. Demain tu le liras avec du recul, et c'est là que les vraies questions vont émerger.
          </p>
          <p style="margin:0 0 20px 0; font-size:16px; line-height:1.65; color:${BRAND.textPrimary};">
            <strong>2.</strong> Note les 3 phrases qui t'ont le plus percuté. Pas pour les poster. Pour toi. Ce sont des balises. Tu vas y revenir.
          </p>
          <p style="margin:0 0 20px 0; font-size:16px; line-height:1.65; color:${BRAND.textPrimary};">
            <strong>3.</strong> Dans les prochains jours, je vais t'envoyer des emails qui racontent l'histoire de gens que j'ai accompagnés et qui étaient dans une situation proche de la tienne. Tu vas y voir des détails utiles.
          </p>
        </td></tr>

        <tr><td style="padding:32px 32px 0 32px;">
          <div style="height:1px; background-color:${BRAND.border};"></div>
        </td></tr>

        <tr><td style="padding:32px 32px 8px 32px;">
          <p style="margin:0 0 20px 0; font-size:16px; line-height:1.65; color:${BRAND.textPrimary};">
            D'ici là, prends soin de toi.
          </p>
          <p style="margin:0 0 8px 0; font-family:Georgia,'Times New Roman',serif; font-size:18px; font-weight:600; color:${BRAND.textPrimary};">
            Julien
          </p>
        </td></tr>

        <tr><td style="padding:16px 32px 40px 32px;">
          <div style="background-color:${BRAND.bgAccent}; border-radius:14px; padding:20px 24px;">
            <p style="margin:0 0 12px 0; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${BRAND.coral}; font-weight:600;">
              P.S.
            </p>
            <p style="margin:0 0 16px 0; font-size:15px; line-height:1.65; color:${BRAND.textPrimary};">
              Le <strong>Bootcamp Expansion</strong> est le programme que j'ai conçu exactement pour les gens dans ta situation. 1 mois, 4 appels hebdomadaires, 12 personnes, décisions concrètes. Les inscriptions pour la prochaine cohorte sont sur liste d'attente.
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
