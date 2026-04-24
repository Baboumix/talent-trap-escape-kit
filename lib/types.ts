export type Dimension = "ancrage" | "circulation" | "sens";

export type AnswerValue = 0 | 1 | 2;

export type StatutPro = "salarie" | "freelance" | "patron-manager";

export type VerdictKey =
  | "coince"
  | "epuise"
  | "perdu"
  | "transition"
  | "expansion";

export type ModifierKey =
  | "m1"
  | "m2"
  | "m3"
  | "m4"
  | "m5"
  | "m6"
  | "m7"
  | "m8";

export type Lang = "fr" | "en";

export interface Question {
  id: number;
  dimension: Dimension;
  text: string;
}

export interface AnswerOption {
  value: AnswerValue;
  label: string;
}

export interface Verdict {
  key: VerdictKey;
  notionName: string;
  avatarEnvKey:
    | "NOTION_AVATAR_COINCE_ID"
    | "NOTION_AVATAR_EPUISE_ID"
    | "NOTION_AVATAR_PERDU_ID"
    | "NOTION_AVATAR_TRANSITION_ID"
    | "NOTION_AVATAR_EXPANSION_ID";
  phrasePunch: string;
  descriptionCourte: string;
  descriptionLongue: string;
  angleMort: string;
  ctaNote: string;
  actions30Days: string[];
}

export interface Modifier {
  key: ModifierKey;
  notionName: string;
  displayName: string;
  paragraph: string;
  dimension: Dimension;
  trigger: (
    answers: Record<number, AnswerValue>,
    statutPro: StatutPro,
  ) => boolean;
}

export interface Scores {
  ancrage: number;
  circulation: number;
  sens: number;
}

export interface DiagnosticInput {
  answers: Record<number, AnswerValue>;
  prenom: string;
  email: string;
  metier: string;
  statutPro: StatutPro;
  lang: Lang;
  durationSec: number;
  source?: string;
}

export interface DiagnosticResult {
  scores: Scores;
  verdict: VerdictKey;
  modifiers: ModifierKey[];
}
