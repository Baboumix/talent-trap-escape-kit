import { Client } from "@notionhq/client";
import { MODIFIERS, STATUT_PRO_NOTION_NAME, VERDICTS } from "./content";
import type { DiagnosticInput, DiagnosticResult, VerdictKey } from "./types";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const avatarPageIdByVerdict: Record<VerdictKey, string | undefined> = {
  coince: process.env.NOTION_AVATAR_COINCE_ID,
  epuise: process.env.NOTION_AVATAR_EPUISE_ID,
  perdu: process.env.NOTION_AVATAR_PERDU_ID,
  transition: process.env.NOTION_AVATAR_TRANSITION_ID,
  expansion: process.env.NOTION_AVATAR_EXPANSION_ID,
};

export async function createDiagnosticPage(
  input: DiagnosticInput,
  result: DiagnosticResult,
): Promise<string> {
  const avatarId = avatarPageIdByVerdict[result.verdict];
  const verdictName = VERDICTS[result.verdict].notionName;
  const modifierNames = result.modifiers.map((k) => MODIFIERS[k].notionName);
  const statutName = STATUT_PRO_NOTION_NAME[input.statutPro];

  const properties: Record<string, unknown> = {
    Email: { title: [{ text: { content: input.email } }] },
    "Prénom": { rich_text: [{ text: { content: input.prenom } }] },
    "Métier": { rich_text: [{ text: { content: input.metier } }] },
    "Statut pro": { select: { name: statutName } },
    Verdict: { select: { name: verdictName } },
    Modifiers: {
      multi_select: modifierNames.map((n) => ({ name: n })),
    },
    "Score Ancrage": { number: result.scores.ancrage },
    "Score Circulation": { number: result.scores.circulation },
    "Score Sens": { number: result.scores.sens },
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
