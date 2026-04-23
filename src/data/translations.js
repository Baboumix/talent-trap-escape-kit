// Re-export canonical need identity from needs.js to avoid drift.
export { NEED_IDS, NEEDS, getNeedName } from "./needs";
import { NEEDS } from "./needs";

export const NEED_NAMES = {
  fr: Object.fromEntries(Object.entries(NEEDS).map(([id, v]) => [id, v.fr.name])),
  en: Object.fromEntries(Object.entries(NEEDS).map(([id, v]) => [id, v.en.name])),
};

// UI strings shared across screens (landing, disclaimer, quiz, gate, results).
export const T = {
  fr: {
    brand: "AUTO-COACH KIT",

    // Landing
    hero_h1_a: "Tu as 6 besoins essentiels. ",
    hero_h1_b: "3 dirigent ta vie.",
    hero_sub: "Un test de 24 questions pour savoir lesquels, et comment ils te servent ou te piègent.",
    hero_cta: "Commencer le test →",
    hero_continue: "Continuer mon test →",
    hero_restart: "Recommencer à zéro",
    hero_resumed: "Déjà commencé ? Cherche l'email de monExpansion dans ta boîte.",

    context_title: "Tes 6 besoins, tes 3 dépendances.",
    context_intro: "Selon le modèle de Tony Robbins (Robbins-Madanes Training), chaque être humain a 6 besoins fondamentaux qui dirigent ses décisions.",
    context_body: "On les a tous. Mais 3 deviennent dominants et guident tes décisions à ton insu. Ce test est un instantané — tes priorités évoluent avec l'âge et les circonstances.",

    // Disclaimer
    disc_title: "Avant de commencer.",
    disc_p1: "Ce kit n'est pas un diagnostic médical, psychologique ou thérapeutique. C'est un outil d'auto-coaching pour mieux comprendre comment tu fonctionnes en tant que machine émotionnelle.",
    disc_p2_lead: "Un conseil.",
    disc_p2: "Réponds honnêtement. Si tu essaies de manipuler tes réponses, ou de te montrer sous ton meilleur jour plutôt que sous ton vrai jour, les résultats seront inutiles.",
    disc_p3: "Personne ne lit tes réponses. Le seul à qui tu mens, c'est toi.",
    disc_cta: "Je réponds honnêtement →",
    disc_back: "← Retour",

    // Quiz
    quiz_progress: "Question {n}/{total}",
    quiz_prompt: "Est-ce que cette phrase te décrit ?",
    quiz_next: "Suivant →",
    quiz_prev: "← Précédent",
    quiz_see: "Voir mon top 3 →",
    quiz_hint: "Sois honnête. Le premier instinct est souvent le bon.",

    // Results
    res_label: "TES 3 BESOINS PRIORITAIRES",
    res_intro: "Voici les 3 besoins qui dirigent tes décisions émotionnelles en ce moment. Pour chacun, tu as une version saine et une version piège. Regarde les deux. Sois franc.",
    res_rank: "N°{n}",
    res_score: "/ 40",
    res_positive: "Le + (sain)",
    res_negative: "Le − (piège)",
    res_all_title: "Tes 6 scores",
    res_all_sub: "Les 3 au-dessus du seuil sont ceux qui te dirigent en ce moment.",

    // Step 2 teaser
    step2_title: "Étape 2, bientôt.",
    step2_sub: "Tu connais maintenant tes 3 besoins dominants. La prochaine étape : voir si tu les satisfais d'une manière qui te charge ou qui te vide, via le Triangle Énergétique (Focus, Physiologie, Langage). Ça arrive.",

    // CTAs
    esc_now_title: "Coaching privé avec Julien.",
    esc_now_sub: "4 sessions 1:1 intensives, calibrées sur ton profil. Appel de découverte gratuit pour voir si c'est pour toi.",
    esc_now_cta: "Réserver un appel gratuit →",
    esc_lab_title: "Le Bootcamp Expansion.",
    esc_lab_sub: "Avancer en groupe : 12 créatifs, 3 mois, sessions live avec Julien.",
    esc_lab_cta: "Découvrir le Bootcamp →",

    // Share / misc
    share_label: "Ton résumé",
    share_link: "Fais le test → kit.monexpansion.com",
    footer_credit: "Basé sur les Six Besoins Humains Essentiels · Robbins-Madanes Training",
    footer_author: "Julien Klein · Coach certifié RMT · monexpansion.com",

    prev_result_msg: "Tu as fait ce test le {date}. Voir ton ancien résultat ou refaire le test ?",
    prev_result_view: "Voir mon ancien résultat",
    prev_result_redo: "Refaire le test",

    tidycal: "https://tidycal.com/julienklein/decouverte",
  },
  en: {
    brand: "AUTO-COACH KIT",

    hero_h1_a: "You have 6 essential needs. ",
    hero_h1_b: "3 drive your life.",
    hero_sub: "A 24-question test to find out which ones, and how they serve you or trap you.",
    hero_cta: "Start the test →",
    hero_continue: "Continue my test →",
    hero_restart: "Start over",
    hero_resumed: "Already started? Check your inbox for the monExpansion email.",

    context_title: "Your 6 needs, your 3 dependencies.",
    context_intro: "In Tony Robbins' model (Robbins-Madanes Training), every human being has 6 fundamental needs that drive their decisions.",
    context_body: "We all have them. But 3 become dominant and guide your decisions unconsciously. This test is a snapshot — your priorities shift with age and circumstances.",

    disc_title: "Before we begin.",
    disc_p1: "This kit is not a medical, psychological, or therapeutic diagnosis. It's a self-coaching tool to better understand how you function as an emotional machine.",
    disc_p2_lead: "One piece of advice.",
    disc_p2: "Answer honestly. If you try to manipulate your answers, or present your best self rather than your true self, the results will be useless.",
    disc_p3: "Nobody reads your answers. The only person you're lying to is yourself.",
    disc_cta: "I'll answer honestly →",
    disc_back: "← Back",

    quiz_progress: "Question {n}/{total}",
    quiz_prompt: "Does this statement describe you?",
    quiz_next: "Next →",
    quiz_prev: "← Previous",
    quiz_see: "See my top 3 →",
    quiz_hint: "Be honest. Your first instinct is usually right.",

    res_label: "YOUR 3 TOP NEEDS",
    res_intro: "These are the 3 needs driving your emotional decisions right now. Each one has a healthy version and a trap version. Look at both. Be honest.",
    res_rank: "#{n}",
    res_score: "/ 40",
    res_positive: "The + (healthy)",
    res_negative: "The − (trap)",
    res_all_title: "Your 6 scores",
    res_all_sub: "The top 3 are the ones driving you right now.",

    step2_title: "Step 2, coming soon.",
    step2_sub: "You now know your 3 dominant needs. Next step: see if you're satisfying them in a way that charges you or drains you, through the Energy Triangle (Focus, Physiology, Language). Coming soon.",

    esc_now_title: "Private coaching with Julien.",
    esc_now_sub: "4 intensive 1:1 sessions, calibrated to your profile. Free discovery call to see if it's for you.",
    esc_now_cta: "Book a free call →",
    esc_lab_title: "The Expansion Bootcamp.",
    esc_lab_sub: "Move forward with a group: 12 creatives, 3 months, live sessions with Julien.",
    esc_lab_cta: "Discover the Bootcamp →",

    share_label: "Your summary",
    share_link: "Take the test → kit.monexpansion.com",
    footer_credit: "Based on the Six Core Human Needs · Robbins-Madanes Training",
    footer_author: "Julien Klein · RMT Certified Coach · monexpansion.com",

    prev_result_msg: "You took this test on {date}. View your previous result or retake the test?",
    prev_result_view: "View my previous result",
    prev_result_redo: "Retake the test",

    tidycal: "https://tidycal.com/julienklein/discovery",
  },
};
