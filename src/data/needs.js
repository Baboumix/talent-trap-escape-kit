// 6 Essential Needs: names + positive/negative descriptions
// Shown on the results page for the top 3 needs only.

export const NEED_IDS = ["stability", "stimulation", "recognition", "belonging", "growth", "impact"];

// Accent color + emoji per need — used for landing tiles and (later) result cards.
// Palette chosen to stay in the warm/natural spectrum, subtle but distinct.
export const NEED_ACCENTS = {
  stability:   { color: "#61CE70", emoji: "🌳" }, // green, rooted
  stimulation: { color: "#FF8A54", emoji: "⚡" }, // orange, energy
  recognition: { color: "#FE6C63", emoji: "⭐" }, // coral, brand/spotlight
  belonging:   { color: "#EC4899", emoji: "🤝" }, // pink, warmth
  growth:      { color: "#8B5CF6", emoji: "🌱" }, // purple, expansion
  impact:      { color: "#3B82F6", emoji: "🎯" }, // blue, mission
};

export const NEEDS = {
  stability: {
    fr: {
      name: "Stabilité",
      short: "Certitude, sécurité",
      positive: "Tu construis sur du solide. Tu tiens tes engagements. Tu es la personne sur qui on peut compter. Ton ancrage rassure ton entourage.",
      negative: "Tu restes là où tu n'es plus vivant, juste parce que partir fait peur. Tu confonds zone de confort et sécurité. L'immobilité devient une cage.",
    },
    en: {
      name: "Stability",
      short: "Certainty, safety",
      positive: "You build on solid ground. You keep your commitments. You're the person people can count on. Your anchor reassures those around you.",
      negative: "You stay where you're no longer alive, just because leaving is scary. You confuse comfort zone with safety. Immobility becomes a cage.",
    },
  },
  stimulation: {
    fr: {
      name: "Stimulation",
      short: "Variété, inconnu",
      positive: "Tu es vivant. Tu cherches ce qui t'allume. Tu ne te résignes jamais à la routine grise. Tu apportes de l'oxygène dans les groupes où tu passes.",
      negative: "Tu fuis ce qui dure. Tu sabotes ce qui devient stable. Tu confonds excitation et progrès. La profondeur t'effraie.",
    },
    en: {
      name: "Stimulation",
      short: "Variety, the unknown",
      positive: "You're alive. You seek what lights you up. You never resign yourself to grey routine. You bring oxygen to any group you enter.",
      negative: "You run from what lasts. You sabotage what becomes stable. You confuse excitement with progress. Depth scares you.",
    },
  },
  recognition: {
    fr: {
      name: "Reconnaissance",
      short: "Se sentir important, vu",
      positive: "Tu te bats pour être vu à ta juste valeur. Tu ne te contentes pas de l'invisible. Tu inspires par l'exemple que tu refuses de te diminuer.",
      negative: "Tu façonnes ta vie pour le regard des autres. Tu perds le contact avec ce que TOI tu veux. Tu confonds admiration et amour.",
    },
    en: {
      name: "Recognition",
      short: "Feeling important, seen",
      positive: "You fight to be seen at your true value. You don't settle for invisibility. You inspire by refusing to diminish yourself.",
      negative: "You shape your life for other people's gaze. You lose touch with what YOU want. You confuse admiration with love.",
    },
  },
  belonging: {
    fr: {
      name: "Appartenance",
      short: "Amour, connexion",
      positive: "Tu crées des liens profonds et durables. Tu prends soin. Les gens se sentent vus et tenus dans ta présence.",
      negative: "Tu restes dans des relations qui t'étouffent par peur d'être seul. Tu donnes pour ne pas perdre. Tu confonds fidélité et sacrifice de soi.",
    },
    en: {
      name: "Belonging",
      short: "Love, connection",
      positive: "You build deep, lasting bonds. You take care. People feel seen and held in your presence.",
      negative: "You stay in suffocating relationships out of fear of being alone. You give to avoid losing. You confuse loyalty with self-sacrifice.",
    },
  },
  growth: {
    fr: {
      name: "Croissance",
      short: "Évoluer, apprendre",
      positive: "Tu ne stagnes jamais. Tu vois chaque expérience comme un terrain d'apprentissage. Tu deviens quelqu'un de nouveau régulièrement.",
      negative: "Tu fuis dans le développement personnel perpétuel pour éviter d'agir. Tu collectionnes les livres et les formations sans jamais livrer. Tu confonds apprendre et avancer.",
    },
    en: {
      name: "Growth",
      short: "Evolving, learning",
      positive: "You never stagnate. You see every experience as learning ground. You regularly become someone new.",
      negative: "You hide in endless personal development to avoid acting. You collect books and courses without ever delivering. You confuse learning with moving forward.",
    },
  },
  impact: {
    fr: {
      name: "Impact",
      short: "Contribuer au-delà de soi",
      positive: "Tu as besoin que ce que tu fais compte. Tu vises plus grand que toi. Ton travail a une direction au-delà du salaire.",
      negative: "Tu sauves les autres pour ne pas regarder ta propre vie. Tu te sacrifies au nom d'une cause. Tu confonds s'oublier et servir.",
    },
    en: {
      name: "Impact",
      short: "Contributing beyond yourself",
      positive: "You need what you do to matter. You aim bigger than yourself. Your work has direction beyond the paycheck.",
      negative: "You save others to avoid looking at your own life. You sacrifice yourself in the name of a cause. You confuse self-erasure with service.",
    },
  },
};

export function getNeedName(id, lang) {
  return NEEDS[id]?.[lang]?.name || id;
}
