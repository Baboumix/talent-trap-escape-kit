// 24 Essential Needs questions (4 per need × 6 needs)
// Source: Tony Robbins / Robbins-Madanes Training Human Needs Quiz
// Scoring: Yes = 10, Partly = 5, No = 0

export const QUESTIONS = [
  // STABILITÉ
  { id: 1, need: "stability", fr: "J'ai besoin de me sentir stable.", en: "I need to feel stable." },
  { id: 2, need: "stability", fr: "J'aime que les choses soient prévisibles.", en: "I like for things to be predictable." },
  { id: 3, need: "stability", fr: "Mes routines et mes habitudes sont importantes pour moi.", en: "My routines and habits are important to me." },
  { id: 4, need: "stability", fr: "J'ai besoin de me sentir en sécurité autant que possible, à tout moment.", en: "I need to feel as safe as possible at all times." },

  // STIMULATION
  { id: 5, need: "stimulation", fr: "Je déteste l'ennui.", en: "I hate the feeling of boredom." },
  { id: 6, need: "stimulation", fr: "Je cherche constamment de nouvelles expériences.", en: "I'm always looking for new experiences." },
  { id: 7, need: "stimulation", fr: "J'aime le frisson du suspense.", en: "I enjoy suspense." },
  { id: 8, need: "stimulation", fr: "J'aime être impliqué dans beaucoup d'activités différentes.", en: "I enjoy being involved in many different activities." },

  // RECONNAISSANCE
  { id: 9, need: "recognition", fr: "Je m'inquiète souvent de ce que les gens disent de moi.", en: "I often worry about what people are saying about me." },
  { id: 10, need: "recognition", fr: "La reconnaissance est très importante pour moi.", en: "Recognition is very important to me." },
  { id: 11, need: "recognition", fr: "Le prestige est très important pour moi.", en: "Prestige is very important to me." },
  { id: 12, need: "recognition", fr: "Je ne veux jamais être perçu comme un perdant.", en: "I never want to be seen as a loser." },

  // APPARTENANCE
  { id: 13, need: "belonging", fr: "Le sentiment d'appartenir quelque part est important pour moi.", en: "Feeling that I 'belong' is important to me." },
  { id: 14, need: "belonging", fr: "Je sais bien prendre soin des gens.", en: "I'm good at taking care of people." },
  { id: 15, need: "belonging", fr: "Dans la plupart de mes relations proches, je suis celui ou celle qui donne.", en: "In most close relationships I'm usually the giver." },
  { id: 16, need: "belonging", fr: "Les relations personnelles sont ce qu'il y a de plus important dans ma vie.", en: "Personal relationships are the most important thing in my life." },

  // CROISSANCE
  { id: 17, need: "growth", fr: "Je cherche constamment à m'améliorer.", en: "I constantly aspire to improve." },
  { id: 18, need: "growth", fr: "Il y a toujours quelque chose de nouveau à apprendre.", en: "There is always something new to be learned." },
  { id: 19, need: "growth", fr: "J'aime comment apprendre change ma perspective.", en: "I like how learning something new changes my perspective." },
  { id: 20, need: "growth", fr: "Quand on arrête de grandir, on meurt.", en: "When we stop growing, we die." },

  // IMPACT
  { id: 21, need: "impact", fr: "Je crois en l'idée de redonner.", en: "I believe in giving back." },
  { id: 22, need: "impact", fr: "J'ai besoin de me sentir accompli.", en: "I need to feel fulfilled." },
  { id: 23, need: "impact", fr: "Parfois, le travail le plus important n'est pas celui pour lequel on te paie.", en: "Sometimes the most important work is not what you're being paid for." },
  { id: 24, need: "impact", fr: "Si je ne contribue pas aux autres, ma vie n'a pas de sens.", en: "If I'm not contributing to others, my life is meaningless." },
];

export const ANSWER_VALUES = {
  yes: 10,
  partly: 5,
  no: 0,
};

export const ANSWER_LABELS = {
  fr: {
    yes: "Oui",
    partly: "En partie",
    no: "Non",
  },
  en: {
    yes: "Yes",
    partly: "Partly",
    no: "No",
  },
};
