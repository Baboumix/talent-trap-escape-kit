import type {
  AnswerOption,
  AnswerValue,
  Modifier,
  Need,
  Question,
  SatisfactionStatus,
  StatutPro,
  Verdict,
  VerdictKey,
} from "./types";

export const NEED_LABELS: Record<Need, string> = {
  certitude: "Certitude",
  variete: "Variété",
  signifiance: "Signifiance",
  connexion: "Connexion",
  croissance: "Croissance",
  contribution: "Contribution",
};

export const NEED_QUESTIONS: Record<Need, string> = {
  certitude: "Suis-je en sécurité ?",
  variete: "Suis-je stimulé ?",
  signifiance: "Est-ce que je compte ?",
  connexion: "Suis-je relié aux autres ?",
  croissance: "Est-ce que j'évolue ?",
  contribution: "Est-ce que je sers quelque chose de plus grand ?",
};

export const NEED_ORDER: Need[] = [
  "certitude",
  "variete",
  "signifiance",
  "connexion",
  "croissance",
  "contribution",
];

export const STATUS_LABELS: Record<SatisfactionStatus, string> = {
  verrouille: "Verrouillé par le piège",
  "sous-influence": "Sous influence",
  satisfait: "Nourri sainement",
};

export const STATUS_HOOKS: Record<SatisfactionStatus, string> = {
  verrouille:
    "Ce besoin est dominant chez toi, et ton mode de vie actuel le nourrit en compensation. C'est là que ton talent fuit.",
  "sous-influence":
    "Ce besoin est partiellement nourri. Tu n'es ni au piège ni totalement libre.",
  satisfait:
    "Ce besoin est nourri sainement. C'est une force que tu peux capitaliser.",
};

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
  // CERTITUDE (Q1-Q4)
  {
    id: 1,
    need: "certitude",
    kind: "intensity",
    text: "Avoir de la stabilité dans ma vie est essentiel pour moi.",
  },
  {
    id: 2,
    need: "certitude",
    kind: "intensity",
    text: "J'ai besoin de pouvoir prévoir ce qui m'attend.",
  },
  {
    id: 3,
    need: "certitude",
    kind: "satisfaction-positive",
    text: "Mon travail actuel me donne le niveau de sécurité dont j'ai besoin.",
  },
  {
    id: 4,
    need: "certitude",
    kind: "satisfaction-negative",
    text: "Je continue ce travail surtout parce que je n'ose pas perdre ce qu'il m'apporte.",
  },

  // VARIÉTÉ (Q5-Q8)
  {
    id: 5,
    need: "variete",
    kind: "intensity",
    text: "J'ai besoin de stimulation et de nouveauté pour me sentir vivant.",
  },
  {
    id: 6,
    need: "variete",
    kind: "intensity",
    text: "La routine me pèse vite.",
  },
  {
    id: 7,
    need: "variete",
    kind: "satisfaction-positive",
    text: "Mon travail m'apporte régulièrement des défis qui me sortent de ma zone.",
  },
  {
    id: 8,
    need: "variete",
    kind: "satisfaction-negative",
    text: "Dans les 6 derniers mois, j'ai surtout répété ce que je savais déjà.",
  },

  // SIGNIFIANCE (Q9-Q12)
  {
    id: 9,
    need: "signifiance",
    kind: "intensity",
    text: "Être reconnu pour ce que je fais compte beaucoup pour moi.",
  },
  {
    id: 10,
    need: "signifiance",
    kind: "intensity",
    text: "J'ai besoin de me sentir important dans ce que je fais.",
  },
  {
    id: 11,
    need: "signifiance",
    kind: "satisfaction-positive",
    text: "Au travail, ma contribution est vue à sa juste valeur.",
  },
  {
    id: 12,
    need: "signifiance",
    kind: "satisfaction-negative",
    text: "Si on me retirait mon titre demain, je ne saurais plus vraiment qui je suis.",
  },

  // CONNEXION (Q13-Q16)
  {
    id: 13,
    need: "connexion",
    kind: "intensity",
    text: "Les relations profondes sont au cœur de ma vie.",
  },
  {
    id: 14,
    need: "connexion",
    kind: "intensity",
    text: "J'ai besoin de me sentir relié aux autres au quotidien.",
  },
  {
    id: 15,
    need: "connexion",
    kind: "satisfaction-positive",
    text: "J'ai des relations vraies au travail, où je peux être moi-même.",
  },
  {
    id: 16,
    need: "connexion",
    kind: "satisfaction-negative",
    text: "Au travail, je me sens isolé même quand je suis entouré.",
  },

  // CROISSANCE (Q17-Q20)
  {
    id: 17,
    need: "croissance",
    kind: "intensity",
    text: "Apprendre et évoluer est un besoin profond chez moi.",
  },
  {
    id: 18,
    need: "croissance",
    kind: "intensity",
    text: "Sans nouveau défi, mon énergie s'éteint.",
  },
  {
    id: 19,
    need: "croissance",
    kind: "satisfaction-positive",
    text: "Mon travail me fait grandir dans une direction que j'ai choisie.",
  },
  {
    id: 20,
    need: "croissance",
    kind: "satisfaction-negative",
    text: "Je travaille beaucoup, mais je ne saurais pas dire vers quoi j'avance.",
  },

  // CONTRIBUTION (Q21-Q24)
  {
    id: 21,
    need: "contribution",
    kind: "intensity",
    text: "Servir quelque chose de plus grand que moi donne du sens à ma vie.",
  },
  {
    id: 22,
    need: "contribution",
    kind: "intensity",
    text: "Sans contribution réelle aux autres, ma vie n'a pas de poids.",
  },
  {
    id: 23,
    need: "contribution",
    kind: "satisfaction-positive",
    text: "Je vois concrètement ce que mon travail apporte aux autres.",
  },
  {
    id: 24,
    need: "contribution",
    kind: "satisfaction-negative",
    text: "Au travail, je donne beaucoup plus que je ne reçois.",
  },
];

export const VERDICTS: Record<VerdictKey, Verdict> = {
  // ============ CERTITUDE ============
  ancre: {
    key: "ancre",
    notionName: "Talent Ancré",
    avatarEnvKey: "NOTION_AVATAR_ANCRE_ID",
    phrasePunch: "Tu as bâti une base. Pas une prison.",
    descriptionCourte:
      "Tu as construit quelque chose de solide. Stabilité, fiabilité, repères clairs. Et ce n'est pas une cage, c'est ton socle.\n\nTu sais te projeter sans trembler. Tu peux dire non, tenir tes engagements, **prévoir sans étouffer**.\n\nTon talent s'appuie sur ce socle au lieu d'en être prisonnier. C'est rare, et précieux.",
    descriptionLongue: `Tu es ce que j'appelle un Talent Ancré. Ton besoin de stabilité est fort, et il est nourri sainement. Pas par compensation, par choix. Ça change tout.

La plupart des gens confondent ancrage et inertie. Toi, tu as compris que la stabilité n'est pas l'opposé du mouvement, c'est ce qui le rend possible. Sans socle, on ne peut pas oser. Sans repères, on ne peut pas trancher.

Ce qui te guette, ce n'est pas l'effondrement. C'est l'inverse, la zone trop confortable. À force d'être ancré, tu pourrais oublier que la vie demande aussi de désancrer parfois. Pas tout, pas tout le temps. Juste assez pour que ton ancrage reste un choix, pas une habitude.

La question pour toi n'est pas de savoir si tu es solide. Tu l'es. La question est, qu'est-ce que tu fais de cette solidité ?`,
    angleMort: "Ton ancrage est ton plus grand atout. À condition qu'il reste un choix.",
    ctaNote: "Pas de produit prioritaire. Invitation aux contenus monExpansion.",
    actions30Days: [
      "Prends une décision dans les 30 jours qui demande de désancrer un peu. Pas un saut, juste un pas.",
      "Identifie une routine qui te sert et une qui te limite. Garde la première, questionne la seconde.",
      "Demande-toi, si tu n'avais pas besoin de stabilité, qu'est-ce que tu ferais cette année ? Note la réponse, sans rien décider.",
    ],
  },

  coince: {
    key: "coince",
    notionName: "Talent Coincé",
    avatarEnvKey: "NOTION_AVATAR_COINCE_ID",
    phrasePunch: "Tu es bon. Et c'est exactement le problème.",
    descriptionCourte:
      "Tu as construit quelque chose de solide. Salaire, reconnaissance, statut. Sur le papier, tu as réussi.\n\nMais il y a cette sensation que tu connais bien, plus tu montes, plus les options se ferment. **Ce que tu as bâti est aussi ce qui te retient.**\n\nTu n'es pas malheureux. Tu es suspendu. Et tu commences à te demander si le confort actuel vaut le prix que tu payes sans le voir.",
    descriptionLongue: `Je connais cette situation intimement. J'ai été toi, plusieurs fois.

Tu es ce que j'appelle un Talent Coincé. Ce qui veut dire, très concrètement, que ton besoin de certitude est devenu plus fort que ton besoin d'expansion. Ce n'est pas un bug. C'est le système qui fait exactement ce qu'il est censé faire, te récompenser pour rester. Plus tu es bon, plus c'est cher de partir.

La chose que la plupart des gens ne voient pas dans ta position, c'est que le piège n'est pas financier. Il est identitaire. Tu n'as pas peur de perdre ton salaire. Tu as peur de perdre qui tu es devenu aux yeux des autres. Ton titre, ton studio, ton rôle dans ton industrie, ta place dans la conversation. Tout ça s'est tissé dans ton identité sans que tu remarques la couture.

Ce qui te guette n'est pas un burn out spectaculaire. C'est un lent désintérêt. Tu vas commencer par te dire que tu es fatigué en ce moment. Puis que tu ne retrouves plus le feu. Puis un matin, tu vas regarder le miroir et te demander comment tu as passé 10 ans à faire quelque chose que tu n'aurais pas choisi aujourd'hui.

Tu n'es pas obligé d'en arriver là.

La sortie du Talent Coincé ne passe pas par une démission héroïque. Elle passe par un travail précis, reconnaître que ce qui t'a construit n'est pas ce qui va te faire grandir. Et décider, sans drame, ce qui reste, ce qui bouge, et ce qui doit partir.`,
    angleMort: "Ton piège n'est pas financier. Il est identitaire.",
    ctaNote: "Bootcamp Expansion en priorité (waitlist selon langue).",
    actions30Days: [
      "Identifie une chose concrète dans ton travail actuel que tu ne quitterais pas, même si tu partais. Ce n'est pas une obligation, c'est un actif que tu peux emporter.",
      "Prends 30 minutes pour écrire, sans objectif de décider, ce qui t'attire en dehors de ta zone de sécurité. Juste nommer, pas encore choisir.",
      "Parle à une personne qui t'a connu avant ton rôle actuel. Pas pour des conseils, pour te rappeler qui tu étais avant la fonction.",
    ],
  },

  // ============ VARIÉTÉ ============
  explorateur: {
    key: "explorateur",
    notionName: "Talent Explorateur",
    avatarEnvKey: "NOTION_AVATAR_EXPLORATEUR_ID",
    phrasePunch: "Tu cherches du nouveau. Et tu sais aller au bout.",
    descriptionCourte:
      "Tu as soif de stimulation, et tu transformes cette soif en mouvement réel. Tu lances des projets, tu apprends, tu t'expérimentes.\n\nTu n'es pas dispersé, tu es vivant. **Ton terrain de jeu, c'est l'inconnu.**\n\nTon talent grandit dans le mouvement. Tu sais finir ce que tu commences, parce que la nouveauté n'est pas une fuite, c'est une nourriture.",
    descriptionLongue: `Tu es un Talent Explorateur. Ton besoin de variété est fort, et tu le nourris sainement. Tu trouves la stimulation dans des défis qui font sens, pas dans le chaos.

La différence est subtile mais énorme. La plupart des gens qui ont un fort besoin de variété se dispersent. Ils confondent nouveauté et avancée. Toi, tu sais distinguer les deux. Tu vas vers le neuf parce que ça te fait grandir, pas parce que tu fuis le silence.

Ce qui te guette, c'est de te lasser trop vite quand un projet entre dans sa phase ennuyeuse. Tous les projets ont une phase ennuyeuse. C'est là que se construit la vraie maîtrise. Apprends à rester quand ça devient répétitif, juste un peu plus longtemps que ton instinct te le dit. C'est dans cet écart que se loge la profondeur.

La question pour toi, que veux-tu approfondir, parmi tout ce que tu as exploré ?`,
    angleMort:
      "Tu sais explorer. La vraie maîtrise viendra de ce que tu décideras d'approfondir.",
    ctaNote: "Bootcamp Expansion ou contenus monExpansion.",
    actions30Days: [
      "Choisis un projet en cours et engage-toi à le finir, même si tu as déjà envie de passer au suivant.",
      "Identifie le sujet où tu pourrais devenir une référence si tu acceptais d'y rester 12 mois. Note-le.",
      "Refuse une opportunité nouvelle cette semaine, juste pour voir ce qui se passe quand tu ne l'attrapes pas.",
    ],
  },

  disperse: {
    key: "disperse",
    notionName: "Talent Dispersé",
    avatarEnvKey: "NOTION_AVATAR_DISPERSE_ID",
    phrasePunch: "Tu cours après le neuf. Et rien ne grandit.",
    descriptionCourte:
      "Tu lances, tu commences, tu cherches. Beaucoup. Mais rien ne se finit, rien ne s'enracine.\n\nTu confonds mouvement et avancée. **Ton besoin de variété est devenu une fuite.**\n\nTu sens bien que quelque chose te file entre les doigts. Pas le temps, la profondeur.",
    descriptionLongue: `Tu es un Talent Dispersé. Ton besoin de variété est dominant, et il est nourri en mode compensation. Tu cherches la stimulation pour ne pas sentir ce qui se passerait si tu t'arrêtais.

La nouveauté est devenue une drogue. Chaque projet te donne un shot de dopamine au démarrage, et l'ennui de la phase moyenne te fait sauter au suivant. Tu accumules les commencements, tu collectionnes les achats, les formations, les idées. Mais rien n'aboutit vraiment.

L'angle mort est celui-ci, tu crois que tu manques de discipline. Tu ne manques pas de discipline. Tu manques d'un cap qui te tienne assez fort pour traverser la phase ennuyeuse. Sans cap, ton besoin de variété te jette d'une rive à l'autre, sans jamais accoster.

La sortie ne passe pas par la rigueur. Elle passe par le choix. Choisis une seule chose à conduire jusqu'au bout, même si elle te paraît moins excitante que les dix autres. C'est dans la traversée de l'ennui qu'on découvre la profondeur.`,
    angleMort:
      "Tu ne manques pas de discipline. Tu manques d'un cap assez fort pour traverser l'ennui.",
    ctaNote: "Bootcamp Expansion en priorité (cadre + deadline forcés).",
    actions30Days: [
      "Liste tes 5 projets en cours et choisis-en UN seul à finir dans les 30 jours. Mets les autres en pause assumée.",
      "Identifie ce qui se passe dans ton corps quand un projet entre dans sa phase ennuyeuse. C'est cet inconfort que tu fuis.",
      "Refuse toute nouvelle opportunité ces 30 prochains jours. Aucune exception.",
    ],
  },

  // ============ SIGNIFIANCE ============
  reconnu: {
    key: "reconnu",
    notionName: "Talent Reconnu",
    avatarEnvKey: "NOTION_AVATAR_RECONNU_ID",
    phrasePunch: "Tu comptes. Et tu n'as pas besoin qu'on te le rappelle.",
    descriptionCourte:
      "Tu as un fort besoin de te sentir important, et tu l'as nourri proprement. Pas par le prestige, par l'impact réel.\n\nTu sais ce que tu apportes, tu vois la différence que tu fais. **Ta valeur ne dépend pas du regard des autres.**\n\nTu peux porter un rôle visible sans te confondre avec lui.",
    descriptionLongue: `Tu es un Talent Reconnu. Ton besoin de signifiance est fort, et tu l'as construit sur des fondations solides, ton impact, pas ton image.

La plupart des gens qui ont ce besoin tombent dans le piège du prestige. Ils chassent les titres, les podiums, la validation. Toi, tu as compris que la vraie reconnaissance vient de ce qu'on a fait, pas de ce qu'on porte. Tu peux perdre un titre demain et savoir encore qui tu es.

Ce qui te guette, c'est de ne plus oser viser plus grand. À force d'être à l'aise, tu pourrais te contenter. Ton besoin de signifiance demande à être nourri par des défis à ta hauteur. Pas pour être admiré, pour rester vivant.

La question pour toi, quelle est la prochaine chose suffisamment grande pour mériter ton talent ?`,
    angleMort: "Ta sécurité intérieure est ton arme. Ne la confonds pas avec un plafond.",
    ctaNote: "Pas de produit prioritaire. Invitation aux contenus avancés.",
    actions30Days: [
      "Identifie un projet plus grand que ce que tu fais aujourd'hui. Pas pour le faire tout de suite, juste pour le nommer.",
      "Demande à trois personnes qui te connaissent bien, qu'est-ce que tu fais de mieux que les autres ? Note les réponses.",
      "Choisis un endroit où tu peux transmettre ce que tu sais. Mentor, intervenant, écrit. Engage-toi sur une seule action.",
    ],
  },

  egoique: {
    key: "egoique",
    notionName: "Talent Égoïque",
    avatarEnvKey: "NOTION_AVATAR_EGOIQUE_ID",
    phrasePunch:
      "Tu as construit ton identité sur ton titre. Et il devient ta cage.",
    descriptionCourte:
      "Tu as un fort besoin de te sentir important, et tu l'as accroché à ton statut. Le titre, le poste, la position.\n\nÇa marche. Tu es respecté, peut-être même envié. Mais c'est fragile. **Sans le titre, qui es-tu ?**\n\nTu sens parfois que ton image te porte plus que ton talent réel. Et que ça commence à coûter cher.",
    descriptionLongue: `Tu es un Talent Égoïque. Ton besoin de signifiance est dominant, et il est nourri par compensation, tu as accroché ton identité à ton statut social plutôt qu'à ton impact réel.

Ce n'est pas un défaut moral. C'est un mécanisme. À force de te définir par ce que tu portes, tu as fini par croire que c'est qui tu es. Et chaque succès renforce le piège, plus tu réussis, plus tu as à perdre, plus tu te sens obligé de tenir le rôle.

L'angle mort est celui-ci, tu confonds ce qu'on respecte en toi (ton titre) avec ce qu'on aime en toi (qui tu es vraiment). Les deux ne sont pas la même chose. Tant que tu n'as pas reconstruit ta valeur sans le titre, tu ne pourras pas vraiment décider de ta vie. Toute transition te coûtera ton identité, pas juste ton job.

La sortie passe par un travail précis, refaire la liste de ce que tu vaux indépendamment de ton poste. Pas pour partir. Pour pouvoir choisir.`,
    angleMort: "Tu confonds ce qu'on respecte en toi avec ce qu'on aime en toi.",
    ctaNote: "Bootcamp Expansion ou coaching premium 1:1.",
    actions30Days: [
      "Écris ta bio professionnelle sans mentionner ton titre actuel ni les noms d'entreprise. Garde ce qui reste.",
      "Identifie une situation où tu as parlé fort parce que tu te sentais menacé. Reconnais le mécanisme.",
      "Passe une journée sans te présenter par ton titre. Observe ce qui change dans tes interactions.",
    ],
  },

  // ============ CONNEXION ============
  connecte: {
    key: "connecte",
    notionName: "Talent Connecté",
    avatarEnvKey: "NOTION_AVATAR_CONNECTE_ID",
    phrasePunch: "Tu as besoin des autres. Et tu sais comment être avec eux.",
    descriptionCourte:
      "Les relations sont au cœur de ta vie, et tu les nourris vraiment. Pas par devoir, par choix.\n\nTu sais être présent, écouter, donner sans te perdre. **Tu reçois autant que tu donnes.**\n\nTon talent se déploie dans le lien avec les autres. C'est une force, pas une dépendance.",
    descriptionLongue: `Tu es un Talent Connecté. Ton besoin de connexion est fort, et il est nourri sainement. Tu as construit autour de toi un réseau de relations vraies, où tu peux être toi-même sans masque.

La plupart des gens qui ont ce besoin tombent dans la loyauté excessive ou dans la dépendance affective. Toi, tu as compris que la vraie connexion demande autant d'autonomie que de présence. Tu ne te perds pas dans les autres. Tu les rejoins.

Ce qui te guette, c'est de tellement valoriser le lien que tu pourrais accepter trop longtemps des relations qui ne te nourrissent plus. Par fidélité, par souvenir, par peur de blesser. Apprends à reconnaître quand une relation est devenue une habitude plutôt qu'un échange.

La question pour toi, parmi tes liens actuels, lesquels te font vraiment grandir ?`,
    angleMort: "La fidélité est une vertu. La fidélité aveugle est un piège.",
    ctaNote: "Pas de produit prioritaire. Invitation aux contenus monExpansion.",
    actions30Days: [
      "Identifie une relation devenue obligation. Décide ce que tu en fais, nourrir, transformer ou laisser partir.",
      "Crée un moment cette semaine pour une connexion vraie avec quelqu'un que tu vois trop peu.",
      "Demande-toi qui dans ta vie te connaît vraiment. Si la réponse est moins de trois personnes, c'est un signal.",
    ],
  },

  loyal: {
    key: "loyal",
    notionName: "Talent Loyal",
    avatarEnvKey: "NOTION_AVATAR_LOYAL_ID",
    phrasePunch: "Tu es loyal. Au point d'oublier ta propre vie.",
    descriptionCourte:
      "Tu as un fort besoin de connexion, et tu l'as accroché à ton organisation, ton équipe, ton chef. Tu donnes beaucoup, tu protèges les autres, tu portes le collectif.\n\nMais tu commences à sentir le coût. **Ta loyauté est devenue une chaîne.**\n\nTu n'oses plus partir, parce que tu te dois à eux. Et personne ne te demande ce que tu te dois à toi.",
    descriptionLongue: `Tu es un Talent Loyal. Ton besoin de connexion est dominant, et il est nourri par compensation, tu as accroché ton sentiment d'appartenance à une structure spécifique, au point que la quitter te paraît être une trahison.

C'est noble, et c'est piégé. La loyauté qui te dépasse n'est plus de la loyauté, c'est de l'effacement. Tu te dis que tu restes par fidélité, mais en réalité, tu restes parce que tu as confondu être aimé et être utile. Tu donnes pour être indispensable, et l'idée de partir te terrifie parce qu'elle équivaut à devenir invisible.

L'angle mort est celui-ci, ton organisation ne te traiterait pas avec la même loyauté si la situation était inversée. Ce n'est pas une critique, c'est une réalité. Les structures n'aiment pas, elles fonctionnent. La loyauté pure ne peut exister qu'entre individus, jamais entre toi et une entité.

La sortie passe par un travail de désidentification douce. Pas couper. Distinguer. Toi d'eux. Ton sens de toi, de ton rôle dans cette structure.`,
    angleMort: "Tu as confondu être aimé et être utile.",
    ctaNote: "Coaching premium 1:1 si patron-manager. Bootcamp Expansion sinon.",
    actions30Days: [
      "Écris la liste de ce que tu portes pour les autres sans qu'on te l'ait demandé. La moitié, tu peux la lâcher.",
      "Imagine que tu pars demain. Qui se débrouillerait sans toi ? La réponse honnête est, tout le monde, après deux mois de réajustement.",
      "Investis cette semaine dans une relation hors de ton organisation. Ami, mentor, communauté. Diversifie ton lien.",
    ],
  },

  // ============ CROISSANCE ============
  expansion: {
    key: "expansion",
    notionName: "Talent en Expansion",
    avatarEnvKey: "NOTION_AVATAR_EXPANSION_ID",
    phrasePunch: "Ton talent grandit. Continue.",
    descriptionCourte:
      "Tu as un fort besoin de grandir, et tu le nourris vraiment. Apprentissage choisi, défis à ta hauteur, direction claire.\n\n**Tu n'es pas dans un piège, tu es en mouvement.**\n\nCe que tu as construit fonctionne. La seule question qui vaille pour toi est, que veux-tu faire de cette énergie disponible ?",
    descriptionLongue: `Je vais être direct, tu n'es pas dans ma cible habituelle de coaching. Et c'est une bonne nouvelle pour toi.

Tu es un Talent en Expansion. Ton besoin de croissance est fort, et tu le nourris dans une direction que tu as choisie. C'est rare. La plupart des gens qui font ce diagnostic sont dans un piège quelconque, toi, tu es en mouvement réel.

Ce qui ne veut pas dire que tout est parfait. La croissance demande de l'énergie, de la lucidité, des renoncements. Mais tu as les fondations. Tu sais distinguer ce qui te fait grandir de ce qui te disperse.

Ce qui te guette, c'est de t'épuiser sans le voir. Quand tu carbures à l'apprentissage, tu peux passer des mois sans regarder ton compteur d'énergie. Apprends à programmer des plateaux. Apprendre à approfondir vaut souvent mieux qu'apprendre à élargir.

Si tu diriges une équipe ou un studio, on a peut-être quelque chose à se dire. ExpansionStudio travaille avec des structures créatives sur leur culture et la rétention de leurs talents. Ce pourrait être intéressant pour toi.

Sinon, garde ce diagnostic comme un repère. Les états changent. Si dans 6 mois quelque chose bouge, reviens faire le test.`,
    angleMort:
      "L'expansion demande autant de travail à maintenir qu'elle en a demandé à construire.",
    ctaNote:
      "Proposition d'appel B2B ExpansionStudio si patron-manager créatif. Sinon, contenus monExpansion.",
    actions30Days: [
      "Regarde ce qui est fragile dans ton alignement actuel. Pas pour le fixer tout de suite, juste pour le nommer avant qu'il ne craque.",
      "Si quelqu'un dans ton équipe ou ton entourage était dans un piège, qu'est-ce que tu voudrais lui dire ? Tu es peut-être la personne à qui il va parler.",
      "Choisis une cause, un projet ou une personne à qui commencer à transmettre ce que tu as construit. L'expansion qui ne circule pas finit par stagner.",
    ],
  },

  epuise: {
    key: "epuise",
    notionName: "Talent Épuisé",
    avatarEnvKey: "NOTION_AVATAR_EPUISE_ID",
    phrasePunch: "Tu apprends. Mais tu apprends dans la mauvaise direction.",
    descriptionCourte:
      "Tu as un fort besoin de grandir, mais ta croissance va dans une direction que tu n'as pas vraiment choisie. Tu absorbes, tu te formes, tu progresses.\n\n**Et pourtant tu te sens vidé, pas plein.**\n\nTu sens bien que ton énergie part dans le mauvais sens, mais tu n'as pas l'espace mental pour repenser le cap.",
    descriptionLongue: `Ce que tu vis, ce n'est pas un manque de discipline. C'est un problème de direction.

Tu es un Talent Épuisé, ton besoin de croissance est dominant, et il est nourri par compensation. Tu progresses, mais dans une direction qui n'est pas la tienne. C'est l'épuisement le plus traître, parce qu'il ne ressemble pas à un burn out classique. Tu fais des choses qui devraient te nourrir (apprendre, construire, livrer), et pourtant tu sors lessivé.

L'angle mort est celui-ci, tu confonds avancer et grandir. Tu avances dans la direction qu'on t'a donnée, ou que tu as choisie il y a longtemps sans la rééquilibrer. Mais tu ne grandis plus dans la direction qui te ferait fleurir aujourd'hui.

La plupart des gens dans ta position pensent qu'il leur faut juste mieux s'organiser, prendre moins de projets, dormir plus. Ce n'est pas vrai. Ce qu'il te faut, c'est repenser le cap. Arrêter de construire dans la mauvaise direction. Accepter de ralentir 6 mois pour réorienter.

Le coût de ne rien changer, c'est de te réveiller dans 5 ans encore plus loin du sens, avec un CV impressionnant et une vie qui ne te ressemble plus.`,
    angleMort: "Tu confonds avancer et grandir.",
    ctaNote: "Bootcamp Expansion ou coaching premium selon profil.",
    actions30Days: [
      "Liste les 3 projets ou clients qui te drainent le plus. Cette semaine, commence à planifier la sortie d'un seul d'entre eux.",
      "Identifie ce que tu apprends actuellement par obligation et ce que tu apprends par désir. La répartition te dit où va ton énergie.",
      "Bloque 2 heures dans ton agenda cette semaine pour travailler SUR ta direction, pas DEDANS. C'est le premier pas hors du cycle.",
    ],
  },

  // ============ CONTRIBUTION ============
  service: {
    key: "service",
    notionName: "Talent Au Service",
    avatarEnvKey: "NOTION_AVATAR_SERVICE_ID",
    phrasePunch:
      "Tu sers quelque chose de plus grand. Et tu te sers aussi toi-même.",
    descriptionCourte:
      "Tu as un fort besoin de contribuer, et tu l'as nourri proprement. Tu sers une cause, une communauté, un projet qui te dépasse. Et tu te respectes dans ce service.\n\n**Tu donnes sans t'oublier.** Ton impact est réel, et il te touche en retour.\n\nTon talent se déploie dans ce qui sert. Et ce qui te sert ne te coupe pas des autres, ça vous relie.",
    descriptionLongue: `Tu es un Talent Au Service. Ton besoin de contribution est fort, et il est nourri sainement. Tu as trouvé un terrain qui demande ce que tu sais faire de mieux, et qui te le rend.

La plupart des gens qui ont ce besoin tombent dans le don pur, jusqu'à s'épuiser. Toi, tu as compris que servir vraiment demande aussi de s'occuper de soi. Pas par égoïsme, par lucidité. Un puits vide ne peut nourrir personne.

Ce qui te guette, c'est de te laisser aspirer par la cause au point d'oublier ce qui te ressource toi. Apprends à reconnaître quand tu commences à donner depuis le manque plutôt que depuis l'abondance. La différence est intérieure, mais elle change tout.

La question pour toi, ta cause te nourrit-elle autant que tu la nourris ?`,
    angleMort: "Servir vraiment demande aussi de se servir soi-même.",
    ctaNote: "Pas de produit prioritaire. Invitation aux contenus monExpansion.",
    actions30Days: [
      "Identifie ce qui te nourrit, indépendamment de ta cause. Programme une chose dans la semaine qui ne sert qu'à toi.",
      "Vérifie, ta cause te demande-t-elle plus que ce qu'elle te rend ? Si oui, ajuste avant que tu sois vidé.",
      "Trouve quelqu'un qui pourrait porter une partie de ce que tu portes seul. Délègue avant la fin du mois.",
    ],
  },

  perdu: {
    key: "perdu",
    notionName: "Talent Perdu",
    avatarEnvKey: "NOTION_AVATAR_PERDU_ID",
    phrasePunch: "Tu donnes tout. Et le soir, personne ne s'occupe de toi.",
    descriptionCourte:
      "Tu as un fort besoin de contribuer, et tu l'as accroché à ton équipe, à ta cause, à ceux qui dépendent de toi. Tu portes, tu absorbes, tu protèges.\n\n**Mais le soir, tu ne sais plus qui s'occupe de toi.**\n\nTu es devenu le pilier que les autres cherchent. Et tu commences à te demander si c'est soutenable.",
    descriptionLongue: `Tu portes une charge que peu de gens voient.

Tu es un Talent Perdu, ton besoin de contribution est dominant et il est nourri par compensation. Tu donnes pour les autres jusqu'à t'oublier toi-même. Ce n'est pas par devoir, c'est par mécanisme, ta valeur s'est accrochée à ce que tu apportes aux autres, jamais à ce que tu te dois à toi-même.

Si tu es patron ou manager, ce schéma est encore plus aigu. On t'a promu pour ton excellence, et maintenant tu portes des humains, des budgets, des tensions. Tu absorbes ce qui ne t'appartient pas, parce que personne d'autre ne le porterait. Mais cette absorption a un coût que personne ne voit, sauf toi tard le soir.

L'angle mort le plus dangereux, c'est celui-ci, tu crois que tu dois tout porter parce que tu es bon à le faire. En réalité, tu portes tout parce que tu n'as jamais appris à recevoir. Donner te donne une légitimité claire. Recevoir te met dans un inconfort que tu ne sais pas gérer.

Il existe une voie entre tout porter et tout lâcher. Elle commence par un travail qui n'est pas tactique (mieux déléguer) mais identitaire, accepter que ta valeur n'est pas dans ce que tu donnes. Elle est dans ce que tu es, donneur ou pas.`,
    angleMort:
      "Tu portes tout parce que tu n'as jamais appris à recevoir, pas parce que tu es bon à porter.",
    ctaNote:
      "Coaching premium 1:1 en priorité. Bootcamp Expansion en seconde option. Workshop B2B si le profil matche.",
    actions30Days: [
      "Écris la liste de ce que tu as accepté de porter sans qu'on te le demande explicitement. La moitié, tu peux la lâcher.",
      "Identifie une personne dans ton équipe qui pourrait reprendre une chose que tu portes en ce moment. Délègue avant la fin du mois, vraiment.",
      "Demande quelque chose à quelqu'un cette semaine. Petit, concret. Observe ton inconfort. C'est lui, le vrai blocage.",
    ],
  },

  // ============ TRANSVERSAUX ============
  transition: {
    key: "transition",
    notionName: "Talent en Transition",
    avatarEnvKey: "NOTION_AVATAR_TRANSITION_ID",
    phrasePunch:
      "Tu sais que quelque chose doit changer. Tu n'as juste pas encore décidé quoi.",
    descriptionCourte:
      "Tu n'es plus vraiment coincé, mais tu n'es pas encore parti. Tu sens le mouvement, tu lis, tu réfléchis, tu en parles parfois à tes proches. Mais rien n'est encore tranché.\n\nTu es dans la zone grise où beaucoup de gens restent pendant des années. **Pas assez malheureux pour bouger vite, assez lucide pour savoir que le temps joue contre toi.**\n\nTu as besoin d'un cadre pour décider.",
    descriptionLongue: `Tu es exactement là où il faut que tu sois, et c'est pour ça que c'est inconfortable.

Tu es un Talent en Transition. Ce n'est pas un verdict tiède. C'est un état très particulier, tu as fait le travail de prise de conscience, tu as compris que quelque chose cloche, tu as peut-être même identifié les grandes directions possibles. Mais tu es bloqué au moment de décider.

Ce blocage n'est pas dû à un manque d'information. Tu as probablement déjà lu beaucoup, écouté des podcasts, parlé à des gens. Le blocage est dû à une chose que personne ne te dit, la transition est un travail émotionnel, pas intellectuel. Tant que tu cherches la bonne réponse par le raisonnement, tu vas rester là. Parce que toutes les options ont des coûts, et aucune analyse ne peut les rendre gratuites.

L'angle mort le plus courant dans ta position, c'est de croire que tu as besoin de plus de clarté avant d'agir. En réalité, tu as besoin d'agir différemment pour gagner de la clarté. Les transitions ne se décident pas dans la tête. Elles se décident dans le corps, par des petites expériences concrètes qui te permettent de sentir ce qui résonne.

La bonne nouvelle, tu es dans l'état où un cadre structuré a le plus d'impact. Pas un gros coaching intensif d'un an. Une structure courte, avec un objectif clair et des livrables concrets. C'est exactement ce que le Bootcamp Expansion est conçu pour faire.

Tu n'as pas besoin de plus de réflexion. Tu as besoin de trancher.`,
    angleMort:
      "Tu as besoin d'agir différemment pour gagner de la clarté, pas l'inverse.",
    ctaNote:
      "Bootcamp Expansion en priorité absolue (c'est le verdict où la conversion est la plus forte).",
    actions30Days: [
      "Choisis une petite expérience concrète à faire dans les 30 jours, un side project, un appel, une rencontre. Quelque chose qui t'engage physiquement.",
      "Écris les 3 scénarios possibles pour les 12 prochains mois. Pas pour choisir, pour les voir côte à côte et sentir lequel te fait vraiment vibrer.",
      "Donne-toi une deadline pour trancher, même arbitraire. Ton cerveau a besoin d'un horizon pour arrêter de ruminer.",
    ],
  },

  suspendu: {
    key: "suspendu",
    notionName: "Talent Suspendu",
    avatarEnvKey: "NOTION_AVATAR_SUSPENDU_ID",
    phrasePunch: "Tu n'es pas malheureux. Tu n'es pas vivant non plus.",
    descriptionCourte:
      "Aucun de tes besoins ne ressort vraiment. Tu n'es pas dans un piège violent, mais tu n'as pas non plus de feu qui te porte.\n\n**C'est l'engourdissement.** Le pire ennemi du talent, parce qu'il ne fait pas de bruit.\n\nTu fonctionnes. Tu encaisses. Et un jour, tu vas te demander où sont passées les années.",
    descriptionLongue: `Tu es un Talent Suspendu. Aucun de tes besoins essentiels ne se détache nettement. C'est un signal très particulier, et probablement le plus difficile à entendre.

La plupart des verdicts identifient un piège, donc une voie de sortie. Toi, tu n'as pas vraiment de piège. Tu as une absence. Tu fonctionnes, tu fais ce qu'il faut, tu cumules les semaines. Mais aucun désir ne te traverse vraiment, aucune frustration ne te pousse vraiment.

L'angle mort est celui-ci, tu confonds ne pas souffrir avec aller bien. Ce n'est pas la même chose. La souffrance signale qu'un besoin essentiel n'est pas nourri. L'absence de désir signale que tu as cessé de demander à la vie de te nourrir. Tu t'es endormi debout.

La sortie ne passe pas par une décision. Elle passe par une provocation. Tu as besoin d'expériences fortes qui réveillent tes besoins essentiels. Voyage seul. Engage-toi dans quelque chose qui te fait peur. Reconnecte avec ce qui te touchait à 18 ans. Le but n'est pas de fuir. C'est de te rappeler que tu désires.`,
    angleMort: "Tu confonds ne pas souffrir avec aller bien.",
    ctaNote: "Bootcamp Expansion. Le réveil est l'objet du programme.",
    actions30Days: [
      "Programme dans les 30 jours une expérience qui te fait peur. Petite, mais réelle. Solo, sport extrême, prise de parole, peu importe.",
      "Reconnecte avec ce qui te touchait à 18 ans. Une chanson, un livre, une personne. Note ce que ça réveille.",
      "Pose-toi cette question chaque matin pendant 30 jours, qu'est-ce que je désire vraiment ? Note la réponse, même si elle est vide.",
    ],
  },
};

const isStrongYes = (v: number | undefined) => v === 2;
const isLeaderStatus = (s: StatutPro) => s === "patron-manager";

export const MODIFIERS: Record<string, Modifier> = {
  m1: {
    key: "m1",
    notionName: "Angle Mort Financier",
    displayName: "Angle Mort Financier",
    need: "certitude",
    paragraph:
      "Il y a un détail supplémentaire dans tes réponses que je dois te nommer, tu as un rapport au salaire qui est devenu une identité. Tu ne mesures pas seulement ta sécurité par ce que tu gagnes, tu mesures ta valeur. C'est l'angle mort financier, et c'est le plus tenace des pièges, parce qu'il se déguise en pragmatisme.",
    // Strong Certitude intensity + strong "I stay because I dare not lose"
    trigger: (a) => isStrongYes(a[1]) && isStrongYes(a[2]) && isStrongYes(a[4]),
  },
  m2: {
    key: "m2",
    notionName: "Angle Mort Statut",
    displayName: "Angle Mort Statut",
    need: "signifiance",
    paragraph:
      "Je remarque autre chose, tu as construit ton identité sur ton statut, pas sur ton talent. La reconnaissance externe te donne une sécurité que ton rapport direct à ton travail ne te donne plus. C'est l'angle mort statut. Il rend toute transition 10 fois plus coûteuse, parce que ce n'est pas juste un job que tu risques de perdre, c'est qui tu crois être.",
    // Strong Signifiance intensity + identity tied to title
    trigger: (a) =>
      (isStrongYes(a[9]) || isStrongYes(a[10])) && isStrongYes(a[12]),
  },
  m3: {
    key: "m3",
    notionName: "Épuisement Silencieux",
    displayName: "Épuisement Silencieux",
    need: "croissance",
    paragraph:
      "Tes réponses sur le rapport à ton énergie me disent quelque chose, tu es dans un épuisement silencieux. Ce n'est pas encore un burn out. C'est pire d'une certaine façon, parce que tu fonctionnes encore. Tu absorbes. Tu encaisses. Et tu te dis que ça va passer. Ça ne passera pas tout seul. L'épuisement silencieux est le tunnel qui mène au vrai effondrement.",
    // No direction + repetition + isolated even surrounded
    trigger: (a) =>
      isStrongYes(a[20]) && isStrongYes(a[8]) && isStrongYes(a[16]),
  },
  m4: {
    key: "m4",
    notionName: "Ennui Masqué",
    displayName: "Ennui Masqué",
    need: "variete",
    paragraph:
      "Tu caches un ennui que tu ne t'autorises probablement pas à ressentir. Tes réponses montrent un fort besoin de variété, et un quotidien qui le bride. Tu te persuades d'être occupé pour ne pas sentir que tu t'ennuies. L'ennui chez un talent senior est un signal sacré. Il te dit qu'il est temps de partir, ou de réinventer ce que tu fais.",
    // Strong Variety intensity + repetition + routine weighs
    trigger: (a) =>
      isStrongYes(a[5]) && isStrongYes(a[6]) && isStrongYes(a[8]),
  },
  m5: {
    key: "m5",
    notionName: "Contribution Vide",
    displayName: "Contribution Vide",
    need: "contribution",
    paragraph:
      "Il y a un écart chez toi entre ce que tu donnes et le sens que tu en retires. Tu contribues beaucoup, mais ta contribution ne te nourrit pas en retour. C'est une contribution vide. Ce n'est pas que ton travail n'a pas de valeur. C'est que la valeur qu'il a ne te touche plus.",
    // Strong Contribution intensity + give more than receive
    trigger: (a) => isStrongYes(a[22]) && isStrongYes(a[24]),
  },
  m6: {
    key: "m6",
    notionName: "Isolement Créatif",
    displayName: "Isolement Créatif",
    need: "connexion",
    paragraph:
      "Tu es entouré, mais tu es seul dans ta tête. Tes réponses révèlent un isolement créatif, tu n'as pas d'interlocuteur avec qui tu peux parler vraiment de ce qui bouge à l'intérieur de toi. Les collègues parlent taf. Les amis parlent vie. Personne ne parle sens. C'est la solitude la plus courante chez les talents seniors, et elle ralentit toutes les transitions.",
    // Strong Connection need + isolated even surrounded
    trigger: (a) => isStrongYes(a[14]) && isStrongYes(a[16]),
  },
  m7: {
    key: "m7",
    notionName: "Leader Accidentel",
    displayName: "Leader Accidentel",
    need: "contribution",
    paragraph:
      "Ton profil montre le schéma du leader accidentel, tu donnes beaucoup aux gens que tu encadres, et tu reçois peu en retour. Tu protèges ton équipe. Tu portes leurs tensions. Mais personne ne porte les tiennes. Si tu ne structures pas rapidement un espace où toi aussi tu es soutenu, tu vas soit imploser, soit devenir le manager distant que tu détestais avant.",
    // Patron-manager + give more + isolated
    trigger: (a, s) =>
      isLeaderStatus(s) && isStrongYes(a[24]) && isStrongYes(a[16]),
  },
  m8: {
    key: "m8",
    notionName: "Vision Floue",
    displayName: "Vision Floue",
    need: "croissance",
    paragraph:
      "Tu ne sais pas vers où tu vas. Et tu ne t'autorises probablement pas à le dire tout haut. Tes réponses montrent une vision floue qui n'est pas un problème de paresse ou d'absence d'ambition. C'est le symptôme d'un rôle qui ne te correspond plus, mais que tu continues à jouer par habitude. La clarté ne viendra pas en réfléchissant plus. Elle viendra en expérimentant.",
    // Strong "stagne = ferme" + no direction
    trigger: (a) => isStrongYes(a[18]) && isStrongYes(a[20]),
  },
};

export const MODIFIERS_BY_NEED: Record<Need, string[]> = {
  certitude: ["m1"],
  variete: ["m4"],
  signifiance: ["m2"],
  connexion: ["m6"],
  croissance: ["m3", "m8"],
  contribution: ["m5", "m7"],
};

// Used for a quick mapping when an answer payload is incomplete in tests.
export const ALL_QUESTION_IDS = QUESTIONS.map((q) => q.id);

export type AnswerMap = Record<number, AnswerValue>;
