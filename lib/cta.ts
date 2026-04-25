import type { Lang, StatutPro, VerdictKey } from "./types";

export type ProductKey = "bootcamp" | "coaching" | "b2b" | "newsletter";

export interface EmailCta {
  product: ProductKey;
  intro: string;
  buttonLabel: string;
  url: string;
}

function urls(lang: Lang) {
  const fr = lang === "fr";
  return {
    bootcamp: fr
      ? process.env.WAITLIST_BOOTCAMP_URL_FR ||
        "https://www.monexpansion.com/bootcamp/"
      : process.env.WAITLIST_BOOTCAMP_URL_EN ||
        "https://www.monexpansion.com/en/bootcamp/",
    coaching: fr
      ? process.env.COACHING_URL_FR || "https://monexpansion.com"
      : process.env.COACHING_URL_EN || "https://monexpansion.com",
    b2b: fr
      ? process.env.B2B_URL_FR || "https://monexpansion.com"
      : process.env.B2B_URL_EN || "https://monexpansion.com",
    newsletter: "https://monexpansion.com",
  };
}

const COPY: Record<ProductKey, { intro: string; buttonLabel: string }> = {
  bootcamp: {
    intro:
      "Le <strong>Bootcamp Expansion</strong> est le programme que j'ai conçu exactement pour les gens dans ta situation. 1 mois, 4 appels hebdomadaires, décisions concrètes. Les inscriptions pour la prochaine cohorte sont sur liste d'attente.",
    buttonLabel: "Rejoindre la waitlist →",
  },
  coaching: {
    intro:
      "Pour ton profil, c'est un <strong>coaching premium 1:1</strong> qui aurait le plus d'impact. Cadre individuel, travail en profondeur, sur 3 mois. Réservation d'un appel découverte gratuit.",
    buttonLabel: "Réserver un appel →",
  },
  b2b: {
    intro:
      "Si tu encadres une équipe ou un studio créatif, <strong>ExpansionStudio</strong> travaille sur la culture et la rétention de tes talents. Appel d'exploration B2B sans engagement.",
    buttonLabel: "Demander un appel B2B →",
  },
  newsletter: {
    intro:
      "Tu n'as pas besoin d'un programme. Garde le contact avec <strong>monExpansion</strong> : podcast, vidéos, newsletter avec des cas concrets. Le contenu suffit pour beaucoup.",
    buttonLabel: "Voir monExpansion →",
  },
};

/**
 * Picks the right product CTA per verdict.
 * Some verdicts depend on statutPro (loyal -> coaching only if patron-manager;
 * expansion -> b2b only if patron-manager).
 */
export function pickCta(
  verdict: VerdictKey,
  statutPro: StatutPro,
  lang: Lang,
): EmailCta {
  const u = urls(lang);
  const isLeader = statutPro === "patron-manager";

  let product: ProductKey;
  switch (verdict) {
    case "coince":
    case "disperse":
    case "egoique":
    case "epuise":
    case "transition":
    case "suspendu":
    case "explorateur":
      product = "bootcamp";
      break;
    case "perdu":
    case "reconnu":
      product = "coaching";
      break;
    case "loyal":
      product = isLeader ? "coaching" : "bootcamp";
      break;
    case "expansion":
      product = isLeader ? "b2b" : "newsletter";
      break;
    case "ancre":
    case "connecte":
    case "service":
    default:
      product = "newsletter";
      break;
  }

  const url = u[product];
  const copy = COPY[product];
  return { product, intro: copy.intro, buttonLabel: copy.buttonLabel, url };
}
