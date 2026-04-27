import type { Lang, StatutPro, VerdictKey } from "./types";

const SUBJECT_BY_VERDICT: Record<VerdictKey, string> = {
  coince: "voilà pourquoi ton talent fuit",
  disperse: "voilà pourquoi rien n'avance vraiment",
  egoique: "il y a un piège dans ce que tu portes",
  loyal: "voilà ce qui te retient sans le dire",
  epuise: "voilà pourquoi tu te sens vidé",
  perdu: "voilà ce que personne ne voit dans ce que tu portes",
  ancre: "ton talent a une vraie base. Et après ?",
  explorateur: "tu explores. Voici ce qui mérite de durer",
  reconnu: "tu comptes. Voici la prochaine marche",
  connecte: "tes liens te portent. Et toi, qui te porte ?",
  expansion: "ton talent circule. Ne t'arrête pas là",
  service: "tu sers. Mais te sers-tu aussi toi-même ?",
  transition: "tu es sur le seuil. Voici comment trancher",
  suspendu: "le silence aussi est un signal",
};

/**
 * Subject of the diagnostic email, per verdict, prefixed with first name.
 * Avoids the cliché "Ton verdict : X" in favor of an emotional hook.
 */
export function pickEmailSubject(
  verdict: VerdictKey,
  prenom: string,
): string {
  const hook = SUBJECT_BY_VERDICT[verdict];
  return `${prenom}, ${hook}`;
}

export type ProductKey = "bootcamp" | "coaching";

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
      ? process.env.COACHING_URL_FR ||
        "https://tidycal.com/julienklein/decouverte"
      : process.env.COACHING_URL_EN ||
        "https://tidycal.com/julienklein/discovery",
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
};

/**
 * Verdicts where the primary CTA pushes Bootcamp (a commitment-heavy product).
 * For these, we offer a softer alternative: book a 15-min discovery call.
 * Skipped for verdicts whose primary CTA is already TidyCal (coaching/b2b).
 */
const BOOTCAMP_PRIMARY_VERDICTS: VerdictKey[] = [
  "coince",
  "disperse",
  "egoique",
  "epuise",
  "transition",
  "suspendu",
];

export function getSoftCallCta(
  verdict: VerdictKey,
  lang: Lang,
): { url: string; intro: string; buttonLabel: string } | null {
  if (!BOOTCAMP_PRIMARY_VERDICTS.includes(verdict)) return null;
  const url =
    lang === "fr"
      ? "https://tidycal.com/julienklein/decouverte"
      : "https://tidycal.com/julienklein/discovery";
  return {
    url,
    intro:
      "Tu préfères en parler avant de t'engager ? Réserve 15 min avec moi, sans engagement.",
    buttonLabel: "Réserver un appel découverte →",
  };
}

/**
 * Picks the product CTA per verdict, or null for healthy verdicts that don't
 * push a product (Ancré, Connecté, Au Service, Expansion, Explorateur).
 *
 * For those, the email keeps the "Reste connecté" social block as the only
 * CTA. No P.S. push, no soft CTA: the lead stays in the monExpansion orbit
 * via YouTube / podcast / social, without commercial pressure.
 */
export function pickCta(
  verdict: VerdictKey,
  statutPro: StatutPro,
  lang: Lang,
): EmailCta | null {
  const u = urls(lang);
  const isLeader = statutPro === "patron-manager";

  let product: ProductKey | null;
  switch (verdict) {
    case "coince":
    case "disperse":
    case "egoique":
    case "epuise":
    case "transition":
    case "suspendu":
      product = "bootcamp";
      break;
    case "perdu":
    case "reconnu":
      product = "coaching";
      break;
    case "loyal":
      product = isLeader ? "coaching" : "bootcamp";
      break;
    // Healthy verdicts: no P.S. push. The "Reste connecté" social block
    // (YouTube hero + podcast + socials) is the engagement path.
    case "ancre":
    case "connecte":
    case "service":
    case "expansion":
    case "explorateur":
    default:
      product = null;
      break;
  }

  if (product === null) return null;

  const url = u[product];
  const copy = COPY[product];
  return { product, intro: copy.intro, buttonLabel: copy.buttonLabel, url };
}
