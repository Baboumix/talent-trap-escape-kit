import type { QuadrantZone, SourceKey } from "./types";

/**
 * Config des 4 portes d'entrée du test (Keeper / Fraud / AI / Talent).
 * Chaque source a son hook signature (Q0), sa question miroir (Q0b),
 * son hero court pour l'app, et un "pain" associé.
 */
export interface SourceConfig {
  key: SourceKey;
  // Nom court pour le menu home
  menuName: string;
  // Question signature courte pour la card du menu (raccourcie pour tenir)
  menuQuestion: string;
  // Phrase de valeur ajoutée pour la card du menu
  menuValue: string;
  // Couleur d'accent pour la card du menu (Tailwind class names)
  menuTheme: {
    border: string; // border + hover border
    bg: string; // bg + hover bg
    accent: string; // text accent
  };
  // Pill d'arrivée dans l'app, qui rappelle la source
  pillLabel: string;
  // Question 0 : signature, slider 1-10 (10 = très haut, le sens dépend de la question)
  q0: {
    text: string;
    lowLabel: string; // étiquette à 1
    highLabel: string; // étiquette à 10
  };
  // Question 0b : miroir, slider 1-10
  q0b: {
    text: string;
    lowLabel: string;
    highLabel: string;
  };
  // Phrase courte de valeur immédiate dans le résultat light, par zone du quadrant
  insightByZone: Record<QuadrantZone, string>;
}

// Q0c urgency identique pour toutes les sources
export const Q0C = {
  text: "À quel point ça doit changer dans les 6 prochains mois ?",
  lowLabel: "Pas urgent",
  highLabel: "Urgence absolue",
};

export const SOURCES: Record<SourceKey, SourceConfig> = {
  talent: {
    key: "talent",
    menuName: "Le test du Talent",
    menuQuestion: "Utilises-tu vraiment tes capacités au boulot ?",
    menuValue: "Vois en 1 minute si ton talent circule ou s'il fuit.",
    menuTheme: {
      border: "border-coral/30 hover:border-coral/60",
      bg: "bg-coral/[0.04] hover:bg-coral/[0.08]",
      accent: "text-coral",
    },
    pillLabel: "Le test du Talent",
    q0: {
      text: "À quel point utilises-tu pleinement tes capacités dans ton job ?",
      lowLabel: "Pas du tout",
      highLabel: "À fond",
    },
    q0b: {
      text: "Si tu pouvais redessiner ton rôle demain, à quel point tu changerais des choses ?",
      lowLabel: "Rien",
      highLabel: "Tout",
    },
    insightByZone: {
      "pleine-expansion":
        "Ton talent circule et le terrain le reconnaît. C'est rare. Ne le perds pas par habitude.",
      "depart-imminent":
        "Ton talent est exprimé mais le terrain ne le rend pas. Le départ est mûr.",
      "reveil-possible":
        "Le terrain est loyal mais ton talent est bridé. Le réveil est à portée.",
      "urgence-absolue":
        "Talent bridé ET terrain truqué. La double peine. Le coût d'attendre est très élevé.",
    },
  },
  keeper: {
    key: "keeper",
    menuName: "Le test du Keeper",
    menuQuestion: "Ton boss se battrait pour te garder ?",
    menuValue: "Découvre la vraie place que tu occupes pour ton boss.",
    menuTheme: {
      border: "border-emerald-300 hover:border-emerald-500",
      bg: "bg-emerald-50 hover:bg-emerald-100/70",
      accent: "text-emerald-700",
    },
    pillLabel: "Le test du Keeper",
    q0: {
      text: "Si tu démissionnais demain, à quel point ton boss se battrait pour te garder ?",
      lowLabel: "Pas du tout",
      highLabel: "À fond",
    },
    q0b: {
      text: "Et toi, à quel point tu te battrais pour rester ?",
      lowLabel: "Pas du tout",
      highLabel: "À fond",
    },
    insightByZone: {
      "pleine-expansion":
        "Tu es à ta place et reconnu pour la bonne raison. Rare. À ancrer pour que ça dure.",
      "depart-imminent":
        "Tu apportes plus que ce qu'on te rend. Le terrain est en train de te perdre.",
      "reveil-possible":
        "Tu es loyal mais ton talent dort. Le réveil est encore possible si tu agis.",
      "urgence-absolue":
        "Ni toi ni ton boss ne mettriez l'énergie. C'est le signal du recommencement.",
    },
  },
  fraud: {
    key: "fraud",
    menuName: "Le test de la Fraude",
    menuQuestion: "À quel point tu te sens fraude dans ton rôle ?",
    menuValue: "Mesure ton imposter syndrome et ce qu'il cache.",
    menuTheme: {
      border: "border-violet-300 hover:border-violet-500",
      bg: "bg-violet-50 hover:bg-violet-100/70",
      accent: "text-violet-700",
    },
    pillLabel: "Le test de la Fraude",
    q0: {
      text: "Sur 10, à quel point tu te sens fraude dans ton rôle aujourd'hui ?",
      lowLabel: "Pas du tout",
      highLabel: "Tous les jours",
    },
    q0b: {
      text: "Si on filmait ton dernier 1:1 difficile, à quel point tu serais fier ?",
      lowLabel: "Pas fier",
      highLabel: "Très fier",
    },
    insightByZone: {
      "pleine-expansion":
        "Tu te sens fraude mais tu performes. Classique. Le syndrome ne dit pas la vérité.",
      "depart-imminent":
        "Tu as raison de douter du terrain, pas de toi. Le décalage est externe.",
      "reveil-possible":
        "Le sentiment de fraude vient d'un cadre mental qui ne te correspond plus.",
      "urgence-absolue":
        "Le doute est cohérent avec la situation. Pas un syndrome, un signal.",
    },
  },
  ai: {
    key: "ai",
    menuName: "Le test du Remplaçant",
    menuQuestion: "Ton job sera-t-il remplacé par l'IA dans 24 mois ?",
    menuValue: "Estime ton risque IA face à des données objectives.",
    menuTheme: {
      border: "border-sky-300 hover:border-sky-500",
      bg: "bg-sky-50 hover:bg-sky-100/70",
      accent: "text-sky-700",
    },
    pillLabel: "Le test du Remplaçant",
    q0: {
      text: "Sur 10, à quel point ton job de leader sera remplacé par l'IA dans 24 mois ?",
      lowLabel: "Aucun risque",
      highLabel: "Très probable",
    },
    q0b: {
      text: "Si l'IA prenait 50% de ton job demain, à quel point tu serais soulagé ?",
      lowLabel: "Pas du tout",
      highLabel: "Très soulagé",
    },
    insightByZone: {
      "pleine-expansion":
        "Tu sens venir le changement et tu en es l'un des architectes possibles.",
      "depart-imminent":
        "Tu vois l'IA comme une libération. C'est rarement un bon signe pour ton rôle actuel.",
      "reveil-possible":
        "Tu sous-estimes l'impact. Un réveil rapide vaut mieux qu'un réveil tardif.",
      "urgence-absolue":
        "L'IA va accélérer un mouvement déjà entamé. Le timing est court.",
    },
  },
};

// Order of cards in the menu home (Talent first, then Keeper, Fraud, AI)
export const SOURCE_MENU_ORDER: SourceKey[] = [
  "talent",
  "keeper",
  "fraud",
  "ai",
];

/**
 * Calcule la zone du quadrant Talent × Terrain depuis Q0 et Q0b.
 *
 * Convention :
 * - Q0 (slider 1-10) = mesure de talent exprimé (calculée différemment selon source)
 * - Q0b (slider 1-10) = mesure de loyauté du terrain / engagement personnel
 *
 * Pour Keeper :
 *   q0 = "Boss se battrait" (10 = oui = terrain loyal)
 *   q0b = "Tu te battrais" (10 = oui = talent exprimé)
 *
 * Pour Fraud :
 *   q0 = "Tu te sens fraude" (10 = oui = talent bridé) → inversé
 *   q0b = "Fier de ton 1:1" (10 = oui = terrain loyal)
 *
 * Pour AI :
 *   q0 = "Risque IA élevé" (10 = oui = talent bridé) → inversé
 *   q0b = "Soulagé par IA" (10 = oui = talent bridé) → inversé
 *
 * Pour Talent :
 *   q0 = "Capacités utilisées" (10 = oui = talent exprimé)
 *   q0b = "Changerais ton rôle" (10 = oui = terrain truqué) → inversé
 *
 * Output : zone du quadrant
 *   - Talent Exprimé + Terrain Loyal → pleine-expansion
 *   - Talent Exprimé + Terrain Truqué → depart-imminent
 *   - Talent Bridé + Terrain Loyal → reveil-possible
 *   - Talent Bridé + Terrain Truqué → urgence-absolue
 */
export function computeZone(
  source: SourceKey,
  q0: number,
  q0b: number,
): QuadrantZone {
  let talentExprime: number;
  let terrainLoyal: number;

  switch (source) {
    case "keeper":
      // q0 = terrain (boss se bat), q0b = talent (tu te bats)
      terrainLoyal = q0;
      talentExprime = q0b;
      break;
    case "fraud":
      // q0 = inverse talent (sentiment de fraude), q0b = terrain (fier du 1:1)
      talentExprime = 11 - q0;
      terrainLoyal = q0b;
      break;
    case "ai":
      // q0 = inverse talent (risque IA = job remplaçable = talent bridé)
      // q0b = inverse talent (soulagé par IA = talent bridé)
      // Pas de signal terrain direct, on prend le moyen comme neutre
      talentExprime = 11 - Math.round((q0 + q0b) / 2);
      terrainLoyal = 5;
      break;
    case "talent":
      // q0 = talent (capacités utilisées), q0b = inverse terrain (changerais)
      talentExprime = q0;
      terrainLoyal = 11 - q0b;
      break;
  }

  const isExprime = talentExprime >= 6;
  const isLoyal = terrainLoyal >= 6;

  if (isExprime && isLoyal) return "pleine-expansion";
  if (isExprime && !isLoyal) return "depart-imminent";
  if (!isExprime && isLoyal) return "reveil-possible";
  return "urgence-absolue";
}

export const ZONE_LABELS: Record<QuadrantZone, string> = {
  "pleine-expansion": "Pleine Expansion",
  "depart-imminent": "Départ Imminent",
  "reveil-possible": "Réveil Possible",
  "urgence-absolue": "Urgence Absolue",
};

export const ZONE_DOORS: Record<QuadrantZone, string> = {
  "pleine-expansion": "Ancrer",
  "depart-imminent": "Quitter",
  "reveil-possible": "Déployer",
  "urgence-absolue": "Quitter ou Recommencer",
};

export function getSourceFromQuery(value: string | null | undefined): SourceKey {
  if (value && (["keeper", "fraud", "ai", "talent"] as const).includes(value as SourceKey)) {
    return value as SourceKey;
  }
  return "talent";
}
