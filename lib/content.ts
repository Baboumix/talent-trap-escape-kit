import type {
  AnswerOption,
  Modifier,
  Question,
  StatutPro,
  Verdict,
  VerdictKey,
} from "./types";

export const DIMENSION_LABELS = {
  ancrage: "Ancrage",
  circulation: "Circulation",
  sens: "Sens",
} as const;

export const STATUT_PRO_OPTIONS: { value: StatutPro; label: string }[] = [
  { value: "salarie", label: "Salarié" },
  { value: "freelance", label: "Freelance / indépendant" },
  { value: "patron-manager", label: "Patron / manager d'équipe" },
];

export const STATUT_PRO_NOTION_NAME: Record<StatutPro, string> = {
  salarie: "Salarié",
  freelance: "Freelance",
  "patron-manager": "Patron-Manager",
};

export const ANSWER_OPTIONS: AnswerOption[] = [
  { value: 2, label: "Oui, clairement" },
  { value: 1, label: "Plutôt oui" },
  { value: 0, label: "Non, pas vraiment" },
];

export const QUESTIONS: Question[] = [
  // Ancrage (Q1-Q8)
  {
    id: 1,
    dimension: "ancrage",
    text: "Quand je pense à partir, ce qui me freine en premier, c'est la perte de ce que j'ai construit.",
  },
  {
    id: 2,
    dimension: "ancrage",
    text: "J'ai déjà continué quelque chose qui ne me plaît plus, parce qu'arrêter coûterait trop cher.",
  },
  {
    id: 3,
    dimension: "ancrage",
    text: "Quand on me complimente sur mon travail, je me sens plus en sécurité qu'heureux.",
  },
  {
    id: 4,
    dimension: "ancrage",
    text: "Si on me retirait mon titre ou ma position demain, je ne saurais plus qui je suis.",
  },
  {
    id: 5,
    dimension: "ancrage",
    text: "Ma valeur vient plus de ce que je gagne que de ce que je fais vraiment.",
  },
  {
    id: 6,
    dimension: "ancrage",
    text: "Changer de cap me fait peur. J'ai mis des années à construire cette reconnaissance.",
  },
  {
    id: 7,
    dimension: "ancrage",
    text: "J'ai déjà refusé une opportunité qui me correspondait mieux, parce qu'elle payait moins ou avait moins de prestige.",
  },
  {
    id: 8,
    dimension: "ancrage",
    text: "Quand je me compare aux gens qui ont réussi autour de moi, je ressens plus de pression que d'inspiration.",
  },
  // Circulation (Q9-Q16)
  {
    id: 9,
    dimension: "circulation",
    text: "Je finis mes journées de travail avec plus de fatigue que de satisfaction.",
  },
  {
    id: 10,
    dimension: "circulation",
    text: "Je fais souvent les mêmes choses, même quand elles ne m'apprennent plus rien.",
  },
  {
    id: 11,
    dimension: "circulation",
    text: "Je rêve parfois d'un projet à côté, mais je ne le démarre jamais.",
  },
  {
    id: 12,
    dimension: "circulation",
    text: "Dans les 6 derniers mois, j'ai surtout répété ce que je savais déjà, sans vraiment apprendre.",
  },
  {
    id: 13,
    dimension: "circulation",
    text: "Je travaille beaucoup, mais je ne saurais pas dire vers quoi j'avance.",
  },
  {
    id: 14,
    dimension: "circulation",
    text: "Je confonds souvent être occupé et avancer.",
  },
  {
    id: 15,
    dimension: "circulation",
    text: "Même pendant mon temps libre, le travail reste dans ma tête. Je n'arrive pas vraiment à décrocher.",
  },
  {
    id: 16,
    dimension: "circulation",
    text: "J'ai l'impression de revivre la même année, encore et encore.",
  },
  // Sens (Q17-Q24)
  {
    id: 17,
    dimension: "sens",
    text: "Si personne ne voyait mon travail, je doute qu'il ait encore de la valeur.",
  },
  {
    id: 18,
    dimension: "sens",
    text: "Je me sens isolé dans mon travail, même entouré de gens.",
  },
  {
    id: 19,
    dimension: "sens",
    text: "Quand je regarde les 5 prochaines années, ma direction reste floue.",
  },
  {
    id: 20,
    dimension: "sens",
    text: "Je donne beaucoup aux autres et j'ai l'impression que ça ne me revient pas.",
  },
  {
    id: 21,
    dimension: "sens",
    text: "Si un enfant me demandait pourquoi mon travail compte, j'aurais du mal à lui répondre simplement.",
  },
  {
    id: 22,
    dimension: "sens",
    text: "Mes relations au travail sont utiles, mais elles restent assez froides humainement.",
  },
  {
    id: 23,
    dimension: "sens",
    text: "Au travail, j'ai parfois l'impression de jouer un rôle plutôt que d'être vraiment moi-même.",
  },
  {
    id: 24,
    dimension: "sens",
    text: "J'aimerais transmettre ce que j'ai appris, mais je ne vois pas à qui, ni comment.",
  },
];

export const VERDICTS: Record<VerdictKey, Verdict> = {
  coince: {
    key: "coince",
    notionName: "Talent Coincé",
    avatarEnvKey: "NOTION_AVATAR_COINCE_ID",
    phrasePunch: "Tu es bon. Et c'est exactement le problème.",
    descriptionCourte:
      "Tu as construit quelque chose de solide. Salaire, reconnaissance, statut. Sur le papier, tu as réussi.\n\nMais il y a cette sensation que tu connais bien : plus tu montes, plus les options se ferment. **Ce que tu as bâti est aussi ce qui te retient.**\n\nTu n'es pas malheureux. Tu es suspendu. Et tu commences à te demander si le confort actuel vaut le prix que tu payes sans le voir.",
    descriptionLongue: `Je connais cette situation intimement. J'ai été toi, plusieurs fois.

Tu es ce que j'appelle un Talent Coincé. Ce qui veut dire, très concrètement, que ton ancrage dans la sécurité et dans la reconnaissance externe est devenu plus fort que ton besoin de te sentir aligné. Ce n'est pas un bug. C'est le système qui fait exactement ce qu'il est censé faire : te récompenser pour rester. Plus tu es bon, plus c'est cher de partir.

La chose que la plupart des gens ne voient pas dans ta position, c'est que le piège n'est pas financier. Il est identitaire. Tu n'as pas peur de perdre ton salaire. Tu as peur de perdre qui tu es devenu aux yeux des autres. Ton titre, ton studio, ton rôle dans ton industrie, ta place dans la conversation. Tout ça s'est tissé dans ton identité sans que tu remarques la couture.

Ce qui te guette n'est pas un burn out spectaculaire. C'est un lent désintérêt. Tu vas commencer par te dire que tu es fatigué en ce moment. Puis que tu ne retrouves plus le feu. Puis un matin, tu vas regarder le miroir et te demander comment tu as passé 10 ans à faire quelque chose que tu n'aurais pas choisi aujourd'hui.

Tu n'es pas obligé d'en arriver là.

La sortie du Talent Coincé ne passe pas par une démission héroïque. Elle passe par un travail précis : reconnaître que ce qui t'a construit n'est pas ce qui va te faire grandir. Et décider, sans drame, ce qui reste, ce qui bouge, et ce qui doit partir.`,
    angleMort: "Ton piège n'est pas financier. Il est identitaire.",
    ctaNote: "Bootcamp Expansion en priorité (waitlist selon langue).",
  },
  epuise: {
    key: "epuise",
    notionName: "Talent Épuisé",
    avatarEnvKey: "NOTION_AVATAR_EPUISE_ID",
    phrasePunch: "Tu es libre. Mais tu vends ton temps comme un salarié.",
    descriptionCourte:
      "Tu as fait le saut. Tu es ton propre patron. Sur le papier, c'est la victoire.\n\nMais tu as troqué un boss contre dix clients, et tu le sais. **Tu travailles plus que jamais, pour une liberté que tu n'arrives pas à goûter.**\n\nTu sens bien que ton modèle actuel a un plafond, mais tu n'as pas l'énergie ni l'espace mental pour le repenser. Tu cours. Et tu commences à te demander pourquoi.",
    descriptionLongue: `Ce que tu vis, ce n'est pas un manque de discipline. C'est un problème de structure.

Tu es un Talent Épuisé : tu as conquis la liberté de choisir, mais tu vends encore ton temps à l'heure ou au projet. Ce qui veut dire que ton revenu est directement lié à ton énergie disponible. Quand l'énergie baisse, le revenu baisse. Quand le revenu baisse, tu prends plus de projets pour compenser. Et le cycle s'accélère.

La plupart des freelances ou indépendants créatifs dans ta position pensent qu'il leur manque un client de plus, un tarif plus élevé, un meilleur système d'organisation. Ce n'est pas vrai. Ce qui te manque, c'est un pivot de modèle. Tu dois arrêter de vendre du temps pour commencer à vendre une valeur reproductible.

Mais voici le vrai angle mort : tu ne le fais pas parce qu'inconsciemment, tu aimes le rush. Tu aimes être débordé parce que ça te donne une preuve d'existence. Tant que tu cours, tu ne peux pas te poser la question qui fait peur : est-ce que ce que je construis me ressemble vraiment, ou est-ce que j'ai juste fui le salariat sans construire autre chose ?

Sortir du Talent Épuisé, ce n'est pas trouver plus de clients. C'est décider d'arrêter de vendre ton temps. Ça veut dire choisir une niche plus étroite, construire un actif (formation, méthode, outil, contenu), et accepter de gagner moins pendant 6 mois pour gagner autrement après.

Le coût de ne rien changer, c'est de te réveiller dans 5 ans avec le même modèle, juste un peu plus fatigué.`,
    angleMort:
      "Tu aimes être débordé parce que ça te donne une preuve d'existence.",
    ctaNote: "Bootcamp Expansion ou coaching premium selon profil.",
  },
  perdu: {
    key: "perdu",
    notionName: "Talent Perdu",
    avatarEnvKey: "NOTION_AVATAR_PERDU_ID",
    phrasePunch:
      "Tu as été promu pour ce que tu savais faire. Mais ce qu'on te demande maintenant, personne ne te l'a appris.",
    descriptionCourte:
      "Tu étais excellent dans ton métier. On t'a promu. Maintenant tu manages des humains, tu gères des budgets, tu portes une équipe. Et personne ne t'a appris comment.\n\nTu donnes beaucoup, tu absorbes les tensions, tu protèges tes gens. **Mais le soir, tu ne sais plus qui s'occupe de toi.**\n\nTu es devenu le leader que tu n'as jamais eu. Et tu commences à te demander si c'est soutenable.",
    descriptionLongue: `Tu portes une charge que peu de gens voient.

Tu es un Talent Perdu : quelqu'un qui a été promu pour son excellence technique, et qui se retrouve à faire un métier complètement différent sans transition, sans formation, sans soutien. Ton studio, ton équipe, ou tes pairs attendent de toi que tu sois un leader. Mais personne ne t'a jamais enseigné comment en devenir un. Tu improvises. Tu copies des modèles qui ne te correspondent pas. Tu absorbes des tensions qui ne sont pas les tiennes.

Ce que la plupart des gens dans ta position ne voient pas, c'est que ton épuisement n'est pas lié au volume de travail. Il est lié à un conflit intérieur : tu ne peux plus être celui qui fait, mais tu n'as pas encore appris à être celui qui fait faire. Tu es dans un entre-deux identitaire que personne ne nomme. Tu es le leader accidentel.

L'angle mort le plus dangereux, c'est celui-ci : tu crois que tu dois tout porter parce que tu as été promu. En réalité, ta promotion t'a donné le droit de redéfinir ton rôle, pas l'obligation de sauver tout le monde. Ce n'est pas égoïste de te demander ce que tu veux vraiment porter. C'est la première étape d'un leadership soutenable.

Il existe une voie entre rendre ton tablier et continuer à t'épuiser silencieusement. Elle commence par un travail qui n'est pas tactique (outils de management) mais identitaire : clarifier qui tu es comme leader, qu'est-ce que tu veux vraiment porter, et ce que tu dois apprendre à lâcher.`,
    angleMort:
      "Ta promotion t'a donné le droit de redéfinir ton rôle, pas l'obligation de sauver tout le monde.",
    ctaNote:
      "Coaching premium 1:1 en priorité. Bootcamp Expansion en seconde option. Workshop B2B si le profil matche.",
  },
  transition: {
    key: "transition",
    notionName: "Talent en Transition",
    avatarEnvKey: "NOTION_AVATAR_TRANSITION_ID",
    phrasePunch:
      "Tu sais que quelque chose doit changer. Tu n'as juste pas encore décidé quoi.",
    descriptionCourte:
      "Tu n'es plus vraiment coincé, mais tu n'es pas encore parti. Tu sens le mouvement, tu lis, tu réfléchis, tu en parles parfois à tes proches. Mais rien n'est encore tranché.\n\nTu es dans la zone grise où beaucoup de gens restent pendant des années. **Pas assez malheureux pour bouger vite, assez lucide pour savoir que le temps joue contre toi.**\n\nTu as besoin d'un cadre pour décider.",
    descriptionLongue: `Tu es exactement là où il faut que tu sois, et c'est pour ça que c'est inconfortable.

Tu es un Talent en Transition. Ce n'est pas un verdict tiède. C'est un état très particulier : tu as fait le travail de prise de conscience, tu as compris que quelque chose cloche, tu as peut-être même identifié les grandes directions possibles. Mais tu es bloqué au moment de décider.

Ce blocage n'est pas dû à un manque d'information. Tu as probablement déjà lu beaucoup, écouté des podcasts, parlé à des gens. Le blocage est dû à une chose que personne ne te dit : la transition est un travail émotionnel, pas intellectuel. Tant que tu cherches la bonne réponse par le raisonnement, tu vas rester là. Parce que toutes les options ont des coûts, et aucune analyse ne peut les rendre gratuites.

L'angle mort le plus courant dans ta position, c'est de croire que tu as besoin de plus de clarté avant d'agir. En réalité, tu as besoin d'agir différemment pour gagner de la clarté. Les transitions ne se décident pas dans la tête. Elles se décident dans le corps, par des petites expériences concrètes qui te permettent de sentir ce qui résonne.

La bonne nouvelle : tu es dans l'état où un cadre structuré a le plus d'impact. Pas un gros coaching intensif d'un an. Une structure courte, avec un objectif clair et des livrables concrets. C'est exactement ce que le Bootcamp Expansion est conçu pour faire.

Tu n'as pas besoin de plus de réflexion. Tu as besoin de trancher.`,
    angleMort:
      "Tu as besoin d'agir différemment pour gagner de la clarté, pas l'inverse.",
    ctaNote:
      "Bootcamp Expansion en priorité absolue (c'est le verdict où la conversion est la plus forte).",
  },
  expansion: {
    key: "expansion",
    notionName: "Talent en Expansion",
    avatarEnvKey: "NOTION_AVATAR_EXPANSION_ID",
    phrasePunch: "Ton talent circule. Continue.",
    descriptionCourte:
      "Tu as quelque chose de rare : un alignement. Ton travail te nourrit, ton ancrage est stable, ton sens est clair.\n\n**Tu n'as pas besoin d'un coaching de sortie de piège, parce que tu n'es pas dans un piège.**\n\nCe que tu as construit fonctionne, et tu le sais. La seule question qui vaille pour toi est la suivante : que veux-tu faire de cette énergie disponible ?",
    descriptionLongue: `Je vais être direct : tu n'es pas dans ma cible habituelle de coaching. Et c'est une bonne nouvelle pour toi.

Tu es un Talent en Expansion. Ça ne veut pas dire que tout est parfait. Mais ça veut dire que tes 3 dimensions fondamentales sont alignées : tu as un ancrage stable sans être coincé, une énergie qui circule sans te détruire, et un sens qui te relie à quelque chose de plus grand. C'est rare. La plupart des gens qui font ce diagnostic sont dans un piège quelconque.

Ce que je te propose n'est pas un programme de coaching. Si tu diriges une équipe, un studio, ou que tu encadres des créatifs qui, eux, sont peut-être dans un piège, on a peut-être quelque chose à se dire. ExpansionStudio travaille avec des studios créatifs sur leur culture, leur employer branding et la rétention de leurs talents. Ce pourrait être intéressant pour toi.

Sinon, garde ce diagnostic comme un repère. Les états changent. Si dans 6 mois un de tes scores bouge, reviens faire le test.

Et surtout : ne prends pas ton expansion pour acquise. Elle demande autant de travail à maintenir qu'elle en a demandé à construire.`,
    angleMort:
      "L'expansion demande autant de travail à maintenir qu'elle en a demandé à construire.",
    ctaNote:
      "Proposition d'appel B2B ExpansionStudio si le profil matche (patron-manager d'une équipe créative). Sinon, invitation à suivre le contenu gratuit.",
  },
};

const isStrongYes = (v: number | undefined) => v === 2;
const isLeaderStatus = (s: StatutPro) => s === "patron-manager";

export const MODIFIERS: Record<string, Modifier> = {
  m1: {
    key: "m1",
    notionName: "Angle Mort Financier",
    displayName: "Angle Mort Financier",
    dimension: "ancrage",
    paragraph:
      "Il y a un détail supplémentaire dans tes réponses que je dois te nommer : tu as un rapport au salaire qui est devenu une identité. Tu ne mesures pas seulement ta sécurité par ce que tu gagnes, tu mesures ta valeur. C'est l'angle mort financier, et c'est le plus tenace des pièges, parce qu'il se déguise en pragmatisme.",
    trigger: (a) => isStrongYes(a[4]) && isStrongYes(a[5]) && isStrongYes(a[7]),
  },
  m2: {
    key: "m2",
    notionName: "Angle Mort Statut",
    displayName: "Angle Mort Statut",
    dimension: "ancrage",
    paragraph:
      "Je remarque autre chose : tu as construit ton identité sur ton statut, pas sur ton talent. La reconnaissance externe te donne une sécurité que ton rapport direct à ton travail ne te donne plus. C'est l'angle mort statut. Il rend toute transition 10 fois plus coûteuse, parce que ce n'est pas juste un job que tu risques de perdre, c'est qui tu crois être.",
    trigger: (a) => isStrongYes(a[3]) && isStrongYes(a[4]) && isStrongYes(a[6]),
  },
  m3: {
    key: "m3",
    notionName: "Épuisement Silencieux",
    displayName: "Épuisement Silencieux",
    dimension: "circulation",
    paragraph:
      "Tes réponses sur le rapport au temps me disent quelque chose : tu es dans un épuisement silencieux. Ce n'est pas encore un burn out. C'est pire d'une certaine façon, parce que tu fonctionnes encore. Tu absorbes. Tu encaisses. Et tu te dis que ça va passer. Ça ne passera pas tout seul. L'épuisement silencieux est le tunnel qui mène au vrai effondrement.",
    trigger: (a) =>
      isStrongYes(a[9]) && isStrongYes(a[15]) && isStrongYes(a[16]),
  },
  m4: {
    key: "m4",
    notionName: "Ennui Masqué",
    displayName: "Ennui Masqué",
    dimension: "circulation",
    paragraph:
      "Tu caches un ennui que tu ne t'autorises probablement pas à ressentir. Tes réponses montrent que tu répètes les mêmes gestes sans apprendre. Tu te persuades d'être occupé pour ne pas sentir que tu t'ennuies. L'ennui chez un talent senior est un signal sacré. Il te dit qu'il est temps de partir, ou de réinventer ce que tu fais.",
    trigger: (a) =>
      isStrongYes(a[10]) && isStrongYes(a[12]) && isStrongYes(a[14]),
  },
  m5: {
    key: "m5",
    notionName: "Contribution Vide",
    displayName: "Contribution Vide",
    dimension: "sens",
    paragraph:
      "Il y a un écart chez toi entre ce que tu donnes et le sens que tu en retires. Tu contribues beaucoup, mais ta contribution ne te nourrit pas en retour. C'est une contribution vide. Ce n'est pas que ton travail n'a pas de valeur. C'est que la valeur qu'il a ne te touche plus.",
    trigger: (a) =>
      isStrongYes(a[17]) && isStrongYes(a[20]) && isStrongYes(a[21]),
  },
  m6: {
    key: "m6",
    notionName: "Isolement Créatif",
    displayName: "Isolement Créatif",
    dimension: "sens",
    paragraph:
      "Tu es entouré, mais tu es seul dans ta tête. Tes réponses révèlent un isolement créatif : tu n'as pas d'interlocuteur avec qui tu peux parler vraiment de ce qui bouge à l'intérieur de toi. Les collègues parlent taf. Les amis parlent vie. Personne ne parle sens. C'est la solitude la plus courante chez les talents seniors, et elle ralentit toutes les transitions.",
    trigger: (a) =>
      isStrongYes(a[18]) && isStrongYes(a[22]) && isStrongYes(a[23]),
  },
  m7: {
    key: "m7",
    notionName: "Leader Accidentel",
    displayName: "Leader Accidentel",
    dimension: "sens",
    paragraph:
      "Ton profil montre le schéma du leader accidentel : tu donnes beaucoup aux gens que tu encadres, et tu reçois peu en retour. Tu protèges ton équipe. Tu portes leurs tensions. Mais personne ne porte les tiennes. Si tu ne structures pas rapidement un espace où toi aussi tu es soutenu, tu vas soit imploser, soit devenir le manager distant que tu détestais avant.",
    trigger: (a, s) =>
      isLeaderStatus(s) && isStrongYes(a[20]) && isStrongYes(a[22]),
  },
  m8: {
    key: "m8",
    notionName: "Vision Floue",
    displayName: "Vision Floue",
    dimension: "sens",
    paragraph:
      "Tu ne sais pas vers où tu vas. Et tu ne t'autorises probablement pas à le dire tout haut. Tes réponses montrent une vision floue qui n'est pas un problème de paresse ou d'absence d'ambition. C'est le symptôme d'un rôle qui ne te correspond plus, mais que tu continues à jouer par habitude. La clarté ne viendra pas en réfléchissant plus. Elle viendra en expérimentant.",
    trigger: (a) =>
      isStrongYes(a[19]) && isStrongYes(a[23]) && isStrongYes(a[24]),
  },
};

export const MODIFIERS_BY_DIMENSION = {
  ancrage: ["m1", "m2"] as const,
  circulation: ["m3", "m4"] as const,
  sens: ["m5", "m6", "m7", "m8"] as const,
};
