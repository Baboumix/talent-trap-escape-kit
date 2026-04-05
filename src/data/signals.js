// ══════════════════════════════════════════
// Module 1 : Le Miroir — Les 10 Signaux
// Based on Chapter 3 of "Le Piège du Talent"
// ══════════════════════════════════════════

export const SIGNALS = {
  fr: [
    {
      id: "sunday_anxiety",
      label: "Anxiété du dimanche soir",
      statement: "Le dimanche soir, quand tu penses à lundi, tu sens quelque chose se serrer.",
      scene: "Hong regarde son assiette. Vingt-deux ans encore du même couloir, des mêmes écrans.",
    },
    {
      id: "boreout",
      label: "Ennui malgré la compétence",
      statement: "Tu maîtrises ton métier, mais cette maîtrise ne t'excite plus. Tu es en pilote automatique.",
      scene: "Il développe des outils pour être encore meilleur dans ce qu'il connaît déjà.",
    },
    {
      id: "invisibility",
      label: "Sentiment d'invisibilité",
      statement: "Ton travail est excellent, mais personne ne voit ce que toi tu apportes vraiment.",
      scene: "Sofia enlève les cordes. La scène respire. C'est ce qu'elle avait proposé il y a deux heures.",
    },
    {
      id: "impostor",
      label: "Syndrome de l'imposteur",
      statement: "Tu as l'impression que si tu changes, les gens vont voir que tu es moins solide que tu sembles.",
      scene: "52 à 82% des professionnels tech le ressentent. Pas les moins compétents. Les plus compétents.",
    },
    {
      id: "physical",
      label: "Symptômes physiques",
      statement: "Ton corps t'envoie des signaux : fatigue inexplicable, tensions, insomnie, mal de dos.",
      scene: "Arne ne pouvait plus cliquer. Son médecin parlait de troubles musculo-squelettiques. Lui savait que c'était autre chose.",
    },
    {
      id: "retreat",
      label: "Retrait des projets personnels",
      statement: "Tes projets personnels et créatifs reculent. Toujours demain. Toujours après ce contrat.",
      scene: "Six mois que Sofia n'a pas ouvert ce disque dur. La danse des loups attend.",
    },
    {
      id: "quiet_quit",
      label: "Quiet quitting",
      statement: "Tu livres au cahier des charges. Correctement. Sans étincelle. Le minimum attendu.",
      scene: "59% des travailleurs mondiaux sont en quiet quitting. Pas par paresse. Par rupture de sens.",
    },
    {
      id: "identity",
      label: "Confusion identitaire",
      statement: "Si on te retirait ton titre et ton entreprise, tu ne saurais plus très bien qui tu es.",
      scene: "Sans le nom du studio sur son LinkedIn, qui est Hong ?",
    },
    {
      id: "meaning",
      label: "Crise de sens",
      statement: "Le travail semble vide de son objectif initial. Tu fais, mais tu ne sais plus pourquoi.",
      scene: "Emma regarde l'expérience. Il y a des choix visuels qu'elle ne reconnaît pas. C'était son travail d'avant.",
    },
    {
      id: "cynicism",
      label: "Cynisme aigu",
      statement: "Tu deviens cynique envers l'industrie, les clients, les collègues. Ou envers toi-même.",
      scene: "La neutralité chronique est un signal. Tu décris ta semaine avec des mots neutres. Jamais avec de l'énergie.",
    },
  ],
  en: [
    {
      id: "sunday_anxiety",
      label: "Sunday evening anxiety",
      statement: "Sunday evening, when you think about Monday, something tightens inside.",
      scene: "Hong stares at his plate. Twenty-two more years of the same hallway, the same screens.",
    },
    {
      id: "boreout",
      label: "Boredom despite competence",
      statement: "You've mastered your craft, but that mastery no longer excites you. You're on autopilot.",
      scene: "He builds tools to get better at what he already knows.",
    },
    {
      id: "invisibility",
      label: "Feeling invisible",
      statement: "Your work is excellent, but nobody sees what you truly bring to the table.",
      scene: "Sofia removes the strings. The scene breathes. It's what she suggested two hours ago.",
    },
    {
      id: "impostor",
      label: "Impostor syndrome",
      statement: "You feel like if you change paths, people will see you're less solid than you appear.",
      scene: "52 to 82% of tech professionals experience this. Not the least competent. The most competent.",
    },
    {
      id: "physical",
      label: "Physical symptoms",
      statement: "Your body sends signals: unexplained fatigue, tension, insomnia, back pain.",
      scene: "Arne couldn't click anymore. His doctor said musculoskeletal disorders. He knew it was something else.",
    },
    {
      id: "retreat",
      label: "Retreat from personal projects",
      statement: "Your personal and creative projects keep getting pushed back. Always tomorrow. Always after this contract.",
      scene: "Six months since Sofia last opened that hard drive. La danse des loups waits.",
    },
    {
      id: "quiet_quit",
      label: "Quiet quitting",
      statement: "You deliver to spec. Correctly. Without a spark. The expected minimum.",
      scene: "59% of workers worldwide are quiet quitting. Not from laziness. From a break in meaning.",
    },
    {
      id: "identity",
      label: "Identity confusion",
      statement: "If someone took away your title and your company, you wouldn't quite know who you are.",
      scene: "Without the studio name on his LinkedIn, who is Hong?",
    },
    {
      id: "meaning",
      label: "Crisis of meaning",
      statement: "Work feels empty of its original purpose. You do, but you no longer know why.",
      scene: "Emma watches the experience. There are visual choices she doesn't recognize. That used to be her job.",
    },
    {
      id: "cynicism",
      label: "Acute cynicism",
      statement: "You're becoming cynical toward the industry, clients, colleagues. Or toward yourself.",
      scene: "Chronic neutrality is a signal. You describe your week in neutral words. Never with energy.",
    },
  ],
};

// Signal rating labels (1-5 scale)
export const SIGNAL_LABELS = {
  fr: [
    { v: 1, label: "Pas du tout", short: "Non" },
    { v: 2, label: "Un peu", short: "Peu" },
    { v: 3, label: "Parfois", short: "Parfois" },
    { v: 4, label: "Souvent", short: "Souvent" },
    { v: 5, label: "Tout le temps", short: "Toujours" },
  ],
  en: [
    { v: 1, label: "Not at all", short: "No" },
    { v: 2, label: "A little", short: "Little" },
    { v: 3, label: "Sometimes", short: "Sometimes" },
    { v: 4, label: "Often", short: "Often" },
    { v: 5, label: "All the time", short: "Always" },
  ],
};

// Tension profile thresholds (count of signals rated >= 3)
export const TENSION_PROFILES = {
  fr: {
    moving: { label: "En mouvement", sub: "Des frictions, mais tu avances. Quelques signaux sont présents, mais le piège n'est pas encore refermé.", color: "#61CE70", range: [0, 3] },
    crossroads: { label: "Au carrefour", sub: "Le piège est là. Tu le sens. Les signaux s'accumulent et un choix se profile.", color: "#FF8A54", range: [4, 6] },
    deep: { label: "En tension profonde", sub: "Les besoins qui comptent le plus pour toi sont ceux que ta situation ignore le plus. Ton corps sait déjà.", color: "#FE6C63", range: [7, 10] },
  },
  en: {
    moving: { label: "In motion", sub: "Friction, but you're moving. Some signals are present, but the trap hasn't closed yet.", color: "#61CE70", range: [0, 3] },
    crossroads: { label: "At the crossroads", sub: "The trap is here. You feel it. Signals are piling up and a choice is emerging.", color: "#FF8A54", range: [4, 6] },
    deep: { label: "In deep tension", sub: "The needs that matter most to you are the ones your situation ignores the most. Your body already knows.", color: "#FE6C63", range: [7, 10] },
  },
};

// Archetype mapping
// Hong = signals 1,2,6,8 (accumulation, boreout, retreat, identity)
// Sofia = signals 3,4,5,6 (invisibility, impostor, physical, retreat)
// Emma = signals 7,8,9,10 (quiet quit, identity, meaning, cynicism)
export const ARCHETYPES = {
  fr: {
    hong: {
      label: "Le Collecteur",
      name: "Hong",
      desc: "Tu accumules : compétences, équipement, projets jamais lancés. C'est ta façon d'éviter la question qui compte vraiment.",
      icon: "🔬",
      signals: ["sunday_anxiety", "boreout", "retreat", "identity"],
    },
    sofia: {
      label: "Le Talent Invisible",
      name: "Sofia",
      desc: "Ton excellence est réelle, mais personne ne la voit. Tu doutes de toi alors que le problème n'est pas toi, c'est le système.",
      icon: "🎵",
      signals: ["invisibility", "impostor", "physical", "retreat"],
    },
    emma: {
      label: "Le Leader Oublié",
      name: "Emma",
      desc: "Tu es passé du craft à la gestion. L'impact que tu permets aux autres, tu l'as perdu pour toi-même.",
      icon: "👑",
      signals: ["quiet_quit", "identity", "meaning", "cynicism"],
    },
  },
  en: {
    hong: {
      label: "The Collector",
      name: "Hong",
      desc: "You accumulate: skills, equipment, projects never launched. It's your way of avoiding the question that really matters.",
      icon: "🔬",
      signals: ["sunday_anxiety", "boreout", "retreat", "identity"],
    },
    sofia: {
      label: "The Invisible Talent",
      name: "Sofia",
      desc: "Your excellence is real, but nobody sees it. You doubt yourself while the problem isn't you — it's the system.",
      icon: "🎵",
      signals: ["invisibility", "impostor", "physical", "retreat"],
    },
    emma: {
      label: "The Forgotten Leader",
      name: "Emma",
      desc: "You went from craft to management. The impact you enable for others, you've lost for yourself.",
      icon: "👑",
      signals: ["quiet_quit", "identity", "meaning", "cynicism"],
    },
  },
};

// ── Scoring functions ──

export function getSignalCount(ratings) {
  // Count signals rated >= 3 (sometimes, often, always)
  return Object.values(ratings).filter((v) => v >= 3).length;
}

export function getTensionProfile(ratings, lang) {
  const count = getSignalCount(ratings);
  const profiles = TENSION_PROFILES[lang];
  if (count <= 3) return { ...profiles.moving, key: "moving", count };
  if (count <= 6) return { ...profiles.crossroads, key: "crossroads", count };
  return { ...profiles.deep, key: "deep", count };
}

export function getDominantArchetype(ratings, lang) {
  const archs = ARCHETYPES[lang];
  let best = null;
  let bestScore = -1;

  for (const [key, arch] of Object.entries(archs)) {
    const score = arch.signals.reduce((sum, sid) => sum + (ratings[sid] || 1), 0);
    if (score > bestScore) {
      bestScore = score;
      best = { ...arch, key };
    }
  }
  return best;
}

export function getTopSignals(ratings, lang) {
  const signals = SIGNALS[lang];
  return signals
    .filter((s) => (ratings[s.id] || 1) >= 3)
    .sort((a, b) => (ratings[b.id] || 1) - (ratings[a.id] || 1))
    .slice(0, 5);
}
