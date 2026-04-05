// ══════════════════════════════════════════
// Synthesis — turns recap into a personalized portrait
// Narrative (Piste 1) + Sitting Question (Piste 2) + Character Pattern (Piste 5)
// ══════════════════════════════════════════

// ── PISTE 1 — Narrative de synthèse ──
// Weaves modules 1+2+3 into a single personalized paragraph.
// Uses archetype + tension + top gap + reflection hint.

const NARRATIVE_TEMPLATES = {
  fr: {
    // Opening sentences by tension profile
    opening: {
      moving: "tu avances, mais avec de la friction",
      crossroads: "tu es à un carrefour",
      deep: "tu es en tension profonde",
    },
    // Closing lines by archetype
    archetype_closing: {
      hong: "Tu as accumulé beaucoup. Peut-être trop pour bouger.",
      sofia: "Ton excellence est réelle. Le problème n'est pas toi, c'est le système.",
      emma: "Tu as permis l'impact des autres. Maintenant, qui permet le tien ?",
    },
    // Templates by verdict level
    by_verdict: {
      trap: "{firstName}tu es **{archetype}**{tension_clause}, avec un score de {score}/100. Tes besoins de **{top_need_1}**{top_need_2_clause} sont essentiels pour toi, mais ta situation les ignore. Pourtant, ce que tu portes vraiment{reflection_clause} — ce n'est pas ce que tu fais, c'est ce que tu ES.\n\n{archetype_closing}",
      mis: "{firstName}tu es **{archetype}**, avec un score de {score}/100. Ta situation tient, mais pas tout. Tes besoins de **{top_need_1}**{top_need_2_clause} demandent de l'attention. {reflection_opening}{reflection_clause_soft}\n\n{archetype_closing}",
      ok: "{firstName}tu es **{archetype}**, avec un score de {score}/100. Ton alignement est solide aujourd'hui. {reflection_opening_positive}{reflection_clause_soft} Le défi : ne pas laisser le confort digital étouffer l'organique.\n\n{archetype_closing}",
    },
    // Snippets
    reflection_opening: "Ce que tu as écrit sur toi compte :",
    reflection_opening_positive: "Ce que tu portes vraiment :",
    anonymous: "Toi, ",
  },
  en: {
    opening: {
      moving: "you're moving, but with friction",
      crossroads: "you're at a crossroads",
      deep: "you're in deep tension",
    },
    archetype_closing: {
      hong: "You've accumulated a lot. Maybe too much to move.",
      sofia: "Your excellence is real. The problem isn't you — it's the system.",
      emma: "You've enabled others' impact. Now, who enables yours?",
    },
    by_verdict: {
      trap: "{firstName}you are **{archetype}**{tension_clause}, with a score of {score}/100. Your **{top_need_1}**{top_need_2_clause} needs are essential to you, but your situation ignores them. And yet, what you really carry{reflection_clause} — it's not what you do, it's what you ARE.\n\n{archetype_closing}",
      mis: "{firstName}you are **{archetype}**, with a score of {score}/100. Your situation holds, but not all of it. Your **{top_need_1}**{top_need_2_clause} needs are asking for attention. {reflection_opening}{reflection_clause_soft}\n\n{archetype_closing}",
      ok: "{firstName}you are **{archetype}**, with a score of {score}/100. Your alignment is solid today. {reflection_opening_positive}{reflection_clause_soft} The challenge: don't let digital comfort smother the organic.\n\n{archetype_closing}",
    },
    reflection_opening: "What you wrote about yourself matters:",
    reflection_opening_positive: "What you really carry:",
    anonymous: "You, ",
  },
};

// Build the narrative paragraph from user data
export function buildNarrative({
  firstName, lang, archetype, tensionProfileKey, verdictLevel,
  score, topNeedNames, reflection,
}) {
  const t = NARRATIVE_TEMPLATES[lang] || NARRATIVE_TEMPLATES.fr;
  const template = t.by_verdict[verdictLevel] || t.by_verdict.mis;

  const name = firstName?.trim() ? `${firstName}, ` : t.anonymous;

  const archetype_label = archetype?.label || "";
  const tension_phrase = t.opening[tensionProfileKey] || "";
  const tension_clause = verdictLevel === "trap" && tension_phrase
    ? `, ${tension_phrase}`
    : "";

  const top_need_1 = topNeedNames[0] || "";
  const top_need_2_clause = topNeedNames[1]
    ? lang === "fr" ? ` et **${topNeedNames[1]}**` : ` and **${topNeedNames[1]}**`
    : "";

  // Reflection clause — uses q1 or q5 if available
  const shortRef = (reflection || "").trim();
  let reflection_clause = "";
  let reflection_clause_soft = "";
  if (shortRef) {
    // Trim to ~80 chars, keep it compact
    const trimmed = shortRef.length > 80 ? shortRef.slice(0, 80).trim() + "..." : shortRef;
    reflection_clause = lang === "fr"
      ? `, ce que tu as décrit ("${trimmed}")`
      : `, what you described ("${trimmed}")`;
    reflection_clause_soft = ` "${trimmed}"`;
  }

  const archetype_closing = t.archetype_closing[archetype?.key] || "";

  return template
    .replace("{firstName}", name)
    .replace("{archetype}", archetype_label)
    .replace("{tension_clause}", tension_clause)
    .replace("{score}", score)
    .replace("{top_need_1}", top_need_1)
    .replace("{top_need_2_clause}", top_need_2_clause)
    .replace("{reflection_opening}", shortRef ? t.reflection_opening : "")
    .replace("{reflection_opening_positive}", shortRef ? t.reflection_opening_positive : "")
    .replace("{reflection_clause}", reflection_clause)
    .replace("{reflection_clause_soft}", reflection_clause_soft)
    .replace("{archetype_closing}", archetype_closing)
    .trim();
}

// Third-person narrative for shared view (someone else reading about this person)
const SHARED_NARRATIVE = {
  fr: {
    with_name: "**{firstName}** est **{archetype}**{tension_clause}. Avec un score de {score}/100, ses besoins de **{top_need_1}**{top_need_2_clause} sont essentiels pour {pronoun} — mais sa situation ne les nourrit pas.{reflection_line}",
    anonymous: "Cette personne est **{archetype}**{tension_clause}. Avec un score de {score}/100, ses besoins de **{top_need_1}**{top_need_2_clause} sont essentiels pour elle — mais sa situation ne les nourrit pas.{reflection_line}",
    reflection_line_prefix: "\n\nCe qu'elle porte vraiment : ",
  },
  en: {
    with_name: "**{firstName}** is **{archetype}**{tension_clause}. With a score of {score}/100, their **{top_need_1}**{top_need_2_clause} needs are essential to them — but their situation doesn't feed them.{reflection_line}",
    anonymous: "This person is **{archetype}**{tension_clause}. With a score of {score}/100, their **{top_need_1}**{top_need_2_clause} needs are essential to them — but their situation doesn't feed them.{reflection_line}",
    reflection_line_prefix: "\n\nWhat they really carry: ",
  },
};

const TENSION_CLAUSES_SHARED = {
  fr: {
    moving: "",
    crossroads: ", à un carrefour",
    deep: ", en tension profonde",
  },
  en: {
    moving: "",
    crossroads: ", at a crossroads",
    deep: ", in deep tension",
  },
};

export function buildSharedNarrative({
  firstName, lang, archetype, tensionProfileKey,
  score, topNeedNames, reflection,
}) {
  const t = SHARED_NARRATIVE[lang] || SHARED_NARRATIVE.fr;
  const tensionMap = TENSION_CLAUSES_SHARED[lang] || TENSION_CLAUSES_SHARED.fr;

  const template = firstName?.trim() ? t.with_name : t.anonymous;

  const tension_clause = tensionMap[tensionProfileKey] || "";
  const top_need_1 = topNeedNames[0] || "";
  const top_need_2_clause = topNeedNames[1]
    ? (lang === "fr" ? ` et **${topNeedNames[1]}**` : ` and **${topNeedNames[1]}**`)
    : "";

  const shortRef = (reflection || "").trim();
  const trimmed = shortRef.length > 100 ? shortRef.slice(0, 100).trim() + "..." : shortRef;
  const reflection_line = trimmed
    ? `${t.reflection_line_prefix}« ${trimmed} »`
    : "";

  return template
    .replace("{firstName}", firstName || "")
    .replace("{archetype}", archetype?.label || "")
    .replace("{tension_clause}", tension_clause)
    .replace("{score}", score)
    .replace("{top_need_1}", top_need_1)
    .replace("{top_need_2_clause}", top_need_2_clause)
    .replace("{pronoun}", lang === "fr" ? "elle/lui" : "them")
    .replace("{reflection_line}", reflection_line)
    .trim();
}

// ── PISTE 2 — LA question qui reste ──
// A single prompt, calibrated by archetype × top gap need

export const SITTING_QUESTIONS = {
  fr: {
    // Keyed by `${archetype}-${gapNeedId}`
    "hong-growth": "Si dans 3 ans tu fais exactement la même chose, comment tu te sens ?",
    "hong-stimulation": "Qu'est-ce qui te faisait perdre la notion du temps avant que tu accumules tout ça ?",
    "hong-recognition": "Tu es le 'fiable'. Mais pour quoi as-tu envie d'être connu vraiment ?",
    "hong-stability": "Ce que tu appelles stabilité — est-ce de la clarté, ou de l'inertie ?",
    "hong-impact": "Si tu disparaissais de tes projets demain, qu'est-ce qui serait vraiment perdu ?",
    "hong-belonging": "À qui tu peux dire que tu n'es plus sûr ? Sans qu'il y ait de conséquence ?",

    "sofia-recognition": "Si personne ne voyait jamais ton travail, qu'est-ce que tu créerais quand même ?",
    "sofia-growth": "Ton excellence dans ce rôle — est-ce qu'elle te grandit, ou elle te garde ?",
    "sofia-belonging": "Qui te voit vraiment, et qui te voit 'utile' ? Tu peux faire la différence ?",
    "sofia-impact": "Ce que tu rends possible pour les autres — qu'est-ce qui est possible pour toi ?",
    "sofia-stimulation": "Quand est-ce que tu t'es sentie créatrice, et pas exécutante, pour la dernière fois ?",
    "sofia-stability": "La sécurité de ce rôle — qu'est-ce qu'elle te coûte en retour ?",

    "emma-growth": "Le geste créatif que tu n'as pas posé depuis 6 mois — pourquoi pas aujourd'hui ?",
    "emma-impact": "Tu permets l'impact des autres. Le tien — à qui il appartient ?",
    "emma-stimulation": "Quand est-ce que tu as fait le travail qui t'a fait aimer ce métier ?",
    "emma-recognition": "On te félicite pour ton leadership. Tu veux être reconnue pour quoi, toi ?",
    "emma-belonging": "Avec qui tu peux être vulnérable sans que ça affaiblisse ton rôle ?",
    "emma-stability": "Tu as un titre. As-tu une direction ?",

    // Fallback
    default: "Si tu pouvais changer une chose dans ta semaine type, qu'est-ce que ce serait ?",
  },
  en: {
    "hong-growth": "If in 3 years you do exactly the same thing, how does that feel?",
    "hong-stimulation": "What made you lose track of time before you accumulated all this?",
    "hong-recognition": "You're the 'reliable one.' But what do you want to be truly known for?",
    "hong-stability": "What you call stability — is it clarity, or inertia?",
    "hong-impact": "If you vanished from your projects tomorrow, what would really be lost?",
    "hong-belonging": "Who can you tell you're not sure anymore? Without consequences?",

    "sofia-recognition": "If nobody ever saw your work, what would you still create?",
    "sofia-growth": "Your excellence in this role — is it growing you, or keeping you?",
    "sofia-belonging": "Who truly sees you, vs. who sees you as 'useful'? Can you tell the difference?",
    "sofia-impact": "What you make possible for others — what's possible for you?",
    "sofia-stimulation": "When did you last feel like a creator, not an executor?",
    "sofia-stability": "The security of this role — what does it cost you in return?",

    "emma-growth": "The creative gesture you haven't made in 6 months — why not today?",
    "emma-impact": "You enable others' impact. Yours — who does it belong to?",
    "emma-stimulation": "When did you last do the work that made you love this job?",
    "emma-recognition": "They praise your leadership. What do YOU want to be known for?",
    "emma-belonging": "Who can you be vulnerable with without weakening your role?",
    "emma-stability": "You have a title. Do you have a direction?",

    default: "If you could change one thing about your typical week, what would it be?",
  },
};

export function getSittingQuestion(archetypeKey, gapNeedId, lang) {
  const questions = SITTING_QUESTIONS[lang] || SITTING_QUESTIONS.fr;
  const key = `${archetypeKey}-${gapNeedId}`;
  return questions[key] || questions.default;
}

// ── PISTE 5 — Character Pattern Match ──
// Surfaces a moment from the book that matches the user's archetype

export const CHARACTER_PATTERNS = {
  fr: {
    hong: {
      name: "Hong",
      role: "Lead VFX, papa, collectionneur de matériel",
      moment: "22h30. Amazon. Un troisième Canon R5 dans le panier. Sa fille de 7 ans l'interrompt : « Papa. Prends-moi dans les bras. J'ai fait des cauchemars. » Pendant qu'il la berce, une main sur sa poitrine, il ne clique plus.",
      unlock: "Ce qui a débloqué Hong : reconnaître que l'accumulation était une fuite. Pas le matériel lui-même, mais ce qu'il remplaçait — le DJing, le signal de vie qu'il avait mis de côté parce que ça ne rentrait dans aucun plan d'affaires.",
      quote: "« Peut-être que c'était la chose qui lui manquait le plus. Mettre de la musique dans une pièce et regarder les gens la ressentir en temps réel. »",
    },
    sofia: {
      name: "Sofia",
      role: "Sound designer, sa mère avait refusé Netflix aussi",
      moment: "Deux heures du matin. L'email Netflix sur son bureau. Dix-huit mois de sécurité. Elle pense à sa mère qui avait refusé des rôles à 28 ans pour ses filles, et qui est morte d'un cancer à 43. Elle ne sait pas si c'est une coïncidence. Ce soir-là, son corps n'est pas ambigu.",
      unlock: "Ce qui a débloqué Sofia : faire l'album de côté. Pas à la place du travail — à côté. Pour que son disque dur s'ouvre à nouveau. « La danse des loups » n'attendrait plus.",
      quote: "« Ses enfants auraient besoin de voir une mère qui avait fait son truc pour elle. Avant. »",
    },
    emma: {
      name: "Emma",
      role: "Directrice créative, monoparentale",
      moment: "L'inauguration du projet qu'elle a coordonné. 22 personnes, six mois de production. Elle regarde l'expérience pour la première fois — elle n'a fait que coordonner, pas créer. Un invité lui demande si elle est fière. Elle dit oui. Puis elle regarde ses mains.",
      unlock: "Ce qui a débloqué Emma : se redonner un jour par mois en production. Pas pour redevenir ce qu'elle était, mais pour ne pas oublier qui elle est quand elle crée.",
      quote: "« Il y avait des choix visuels ce soir qu'elle ne reconnaissait pas. Quelqu'un avait pris ces décisions-là. C'était son travail d'avant. »",
    },
  },
  en: {
    hong: {
      name: "Hong",
      role: "VFX Lead, father, gear collector",
      moment: "10:30 PM. Amazon. A third Canon R5 in the cart. His 7-year-old daughter interrupts: \"Daddy. Hold me. I had nightmares.\" As he rocks her, her hand on his chest, he stops clicking.",
      unlock: "What unlocked Hong: recognizing that accumulation was an escape. Not the gear itself, but what it replaced — DJing, the signal of life he'd set aside because it didn't fit any business plan.",
      quote: "\"Maybe it was the thing he missed most. Playing music in a room and watching people feel it in real time.\"",
    },
    sofia: {
      name: "Sofia",
      role: "Sound designer, her mother had also refused",
      moment: "2 AM. The Netflix email on her desk. Eighteen months of security. She thinks about her mother who refused roles at 28 for her daughters, and died of cancer at 43. She doesn't know if it's a coincidence. That night, her body isn't ambiguous.",
      unlock: "What unlocked Sofia: making the album on the side. Not instead of work — alongside. So her hard drive would open again. \"La danse des loups\" wouldn't wait anymore.",
      quote: "\"Her children would need to see a mother who'd done her thing for herself. Before.\"",
    },
    emma: {
      name: "Emma",
      role: "Creative Director, single parent",
      moment: "The opening of the project she coordinated. 22 people, six months of production. She watches the experience for the first time — she only coordinated, didn't create. A guest asks if she's proud. She says yes. Then she looks at her hands.",
      unlock: "What unlocked Emma: giving herself one day a month back in production. Not to become what she was, but to not forget who she is when she creates.",
      quote: "\"There were visual choices that evening she didn't recognize. Someone had made those decisions. It used to be her job.\"",
    },
  },
};

export function getCharacterPattern(archetypeKey, lang) {
  const patterns = CHARACTER_PATTERNS[lang] || CHARACTER_PATTERNS.fr;
  return patterns[archetypeKey] || null;
}

// ── Helper: extract a meaningful reflection from Module 3 ──
// Priority: q1 (childhood flow state), q5 (unique contribution), then any non-empty

export function pickReflection(reflections) {
  if (!reflections) return "";
  const priority = ["q1", "q5", "q3", "q4", "q2"];
  for (const key of priority) {
    const val = reflections[key]?.trim();
    if (val) return val;
  }
  return "";
}
