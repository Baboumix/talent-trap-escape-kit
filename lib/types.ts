export type Need =
  | "certitude"
  | "variete"
  | "signifiance"
  | "connexion"
  | "croissance"
  | "contribution";

export type QuestionKind =
  | "intensity"
  | "satisfaction-positive"
  | "satisfaction-negative";

export type AnswerValue = 0 | 1 | 2;

export type StatutPro = "salarie" | "freelance" | "patron-manager";

export type VerdictKey =
  | "ancre"
  | "coince"
  | "explorateur"
  | "disperse"
  | "reconnu"
  | "egoique"
  | "connecte"
  | "loyal"
  | "expansion"
  | "epuise"
  | "service"
  | "perdu"
  | "transition"
  | "suspendu";

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
  need: Need;
  kind: QuestionKind;
  text: string;
}

export interface AnswerOption {
  value: AnswerValue;
  label: string;
}

export type SatisfactionStatus = "verrouille" | "sous-influence" | "satisfait";

export interface NeedScore {
  intensity: number;
  satisfaction: number;
  status: SatisfactionStatus;
}

export type NeedScores = Record<Need, NeedScore>;

export interface Verdict {
  key: VerdictKey;
  notionName: string;
  avatarEnvKey: string;
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
  need: Need;
  trigger: (
    answers: Record<number, AnswerValue>,
    statutPro: StatutPro,
  ) => boolean;
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
  needScores: NeedScores;
  dominantNeeds: Need[];
  talentScore: number;
  verdict: VerdictKey;
  modifiers: ModifierKey[];
}
