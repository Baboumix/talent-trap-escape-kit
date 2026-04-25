import { Client } from "@notionhq/client";
import {
  MODIFIERS,
  NEED_LABELS,
  NEED_ORDER,
  STATUT_PRO_NOTION_NAME,
  VERDICTS,
} from "./content";
import type { DiagnosticInput, DiagnosticResult, VerdictKey } from "./types";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const avatarEnvVarByVerdict: Record<VerdictKey, string> = {
  ancre: "NOTION_AVATAR_ANCRE_ID",
  coince: "NOTION_AVATAR_COINCE_ID",
  explorateur: "NOTION_AVATAR_EXPLORATEUR_ID",
  disperse: "NOTION_AVATAR_DISPERSE_ID",
  reconnu: "NOTION_AVATAR_RECONNU_ID",
  egoique: "NOTION_AVATAR_EGOIQUE_ID",
  connecte: "NOTION_AVATAR_CONNECTE_ID",
  loyal: "NOTION_AVATAR_LOYAL_ID",
  expansion: "NOTION_AVATAR_EXPANSION_ID",
  epuise: "NOTION_AVATAR_EPUISE_ID",
  service: "NOTION_AVATAR_SERVICE_ID",
  perdu: "NOTION_AVATAR_PERDU_ID",
  transition: "NOTION_AVATAR_TRANSITION_ID",
  suspendu: "NOTION_AVATAR_SUSPENDU_ID",
};

export async function createDiagnosticPage(
  input: DiagnosticInput,
  result: DiagnosticResult,
): Promise<string> {
  const avatarId = process.env[avatarEnvVarByVerdict[result.verdict]];
  const verdictName = VERDICTS[result.verdict].notionName;
  const modifierNames = result.modifiers.map((k) => MODIFIERS[k].notionName);
  const statutName = STATUT_PRO_NOTION_NAME[input.statutPro];
  const dominantNames = result.dominantNeeds.map((n) => NEED_LABELS[n]);

  const properties: Record<string, unknown> = {
    Email: { title: [{ text: { content: input.email } }] },
    "Prénom": { rich_text: [{ text: { content: input.prenom } }] },
    "Métier": { rich_text: [{ text: { content: input.metier } }] },
    "Statut pro": { select: { name: statutName } },
    Verdict: { select: { name: verdictName } },
    Modifiers: {
      multi_select: modifierNames.map((n) => ({ name: n })),
    },
    "Note Talent /10": { number: result.talentScore },
    "Besoins dominants": {
      multi_select: dominantNames.map((n) => ({ name: n })),
    },
    "Réponses brutes": {
      rich_text: [
        { text: { content: JSON.stringify(input.answers).slice(0, 1900) } },
      ],
    },
    "Date diagnostic": { date: { start: new Date().toISOString() } },
    "Durée test (sec)": { number: input.durationSec },
    Langue: { select: { name: input.lang.toUpperCase() } },
    "Statut suivi": { select: { name: "Nouveau" } },
  };

  // Per-need scores: 6 intensity columns + 6 satisfaction columns
  for (const need of NEED_ORDER) {
    const label = NEED_LABELS[need];
    const score = result.needScores[need];
    properties[`Intensité ${label}`] = { number: score.intensity };
    properties[`Satisfaction ${label}`] = { number: score.satisfaction };
  }

  if (input.source) {
    properties.Source = {
      rich_text: [{ text: { content: input.source.slice(0, 400) } }],
    };
  }
  if (avatarId) {
    properties["Avatar rattaché"] = { relation: [{ id: avatarId }] };
  }

  const response = await notion.pages.create({
    parent: { database_id: process.env.NOTION_DIAGNOSTICS_DB_ID! },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: properties as any,
  });
  return response.id;
}
