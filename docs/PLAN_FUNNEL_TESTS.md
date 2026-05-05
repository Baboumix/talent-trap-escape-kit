# Plan de match : 1 test, 4 portes d'entrée vers Bootcamp

> Statut : direction validée, à exécuter
> Dernière mise à jour : 2026-04-27

## Vision stratégique

**Un seul test** qui capture les 4 questions urgentes du Leader Créatif Accidentel via 4 portes d'entrée. Le test mesure 6 besoins essentiels + terrain + qualifying business, puis dérive **les 4 réponses** (Keeper, Fraud, AI, Talent) depuis ce diagnostic unique.

Le prospect arrive sur la porte qui l'accroche le plus, mais repart avec la cartographie complète. Plus de valeur perçue. Moins de tests à maintenir. Conversion Bootcamp accélérée par le lead scoring automatique.

## Architecture

```
LANDING WORDPRESS (monexpansion.com/[slug])
  ├── /keeper  (hook : "Boss te garderait ?")
  ├── /fraud   (hook : "Tu te sens fraude ?")
  ├── /ai      (hook : "Risque IA ?")
  └── /talent  (hook : "Talent activé ?")
            ↓ (avec ?source=keeper / fraud / ai / talent)

TEST UNIFIÉ (talent.monexpansion.com)
  ├── Q0 : slider 1-10 dynamique selon source
  ├── Q0b : question miroir dynamique selon source
  ├── EMAIL GATE (enrichi)
  ├── 22 Robbins reformulées leader
  ├── 5 qualifying questions
            ↓

PAGE RÉSULTAT
  ├── Note Talent /10
  ├── Quadrant Talent × Terrain
  ├── Archétype (Tampon / Faussaire / Roi Solitaire)
  ├── Réponses aux 4 questions du prospect
  ├── Porte recommandée (1-4)
  ├── Angle mort
  └── CTA dynamique selon source + tier
            ↓

LEAD TIER CALCULÉ (HOT / WARM / COLD)
  ├── HOT  → email immédiat + TidyCal direct (pas de séquence longue)
  ├── WARM → séquence Brevo 5 emails
  └── COLD → séquence Brevo 3 emails (newsletter + waitlist livre)
            ↓

J+1 : PDF DIAGNOSTIC TÉLÉCHARGEABLE (lead magnet partageable)
J+30+ : RETARGETING LINKEDIN par verdict (audience custom)
```

## Phasage

| Phase | Contenu | Durée |
|---|---|---|
| **P1** | TTE v2 sur kit/talent : Q0 slider + Q0b miroir + quadrant Talent×Terrain + 3 archétypes + 4 portes + 5 qualifying questions intégrées + email gate enrichi. Hero dynamique selon `?source=`. | 3-4 jours |
| **P2** | Lead tier calculé côté code (Hot/Warm/Cold). Tag Brevo + variables dynamiques utm_source. | 1 jour |
| **P3** | 4 réponses calculées dans la page résultat (Keeper score, Fraud score, AI risk, Talent /10). Mini-module 3 questions objectives IA (toujours posé, sert au calcul AI risk). | 2 jours |
| **P4** | Reformulation des 22 questions Robbins pour parler au leader (validation copy avec Julien avant). | 1-2 jours |
| **P5** | PDF téléchargeable à J+1 via next/og (route /diagnostic/pdf). | 2 jours |
| **P6** | Séquences Brevo configurées : 1 workflow avec branchements Hot/Warm/Cold + variables dynamiques selon SOURCE. | hors code, dashboard Brevo |
| **P7** | 4 landings WordPress à construire dans Elementor + lien vers le test avec utm_source. | hors code, ton boulot WP |
| **P8** | Retargeting LinkedIn : audiences custom uploadées par verdict. | hors code, dashboard LinkedIn Ads |

## Architecture Brevo (séquence email unique avec branchements)

### Trigger

Tag `diagnostic_fait` posé par l'app à la soumission.

### Conditions de sortie

- Tag `bootcamp_inscrit` reçu
- Tag `coaching_inscrit` reçu

### Workflow interne

```
[Trigger : tag diagnostic_fait]
   ↓
[Condition : LEAD_TIER]
   ├─ HOT → Email A.J+0 (immédiat, invite TidyCal direct)
   │       Email A.J+3 (relance si pas booking)
   │       Email A.J+7 (last call urgence)
   │       SORTIE
   │
   ├─ WARM → Email B.J+0 (rapport personnalisé)
   │        Email B.J+2 (témoignage similaire)
   │        Email B.J+5 (outil pratique)
   │        Email B.J+8 (invite Bootcamp + soft TidyCal)
   │        Email B.J+12 (last call cohorte)
   │        SORTIE
   │
   └─ COLD → Email C.J+0 (rapport + invitation newsletter)
            Email C.J+7 (waitlist livre)
            Email C.J+30 (refais le test, ça a bougé ?)
            SORTIE
```

### Variables dynamiques par email

Dans chaque template, variables conditionnelles selon `SOURCE` :

```
{% if contact.SOURCE == "keeper" %}
  Tu es venu pour savoir si ton boss se battrait pour te garder. La vraie réponse...
{% elif contact.SOURCE == "fraud" %}
  Tu es venu pour mesurer ta fraude perçue. Voici ce qu'on a vu de plus...
{% elif contact.SOURCE == "ai" %}
  Tu es venu pour évaluer ton risque IA. Voici ce qui change...
{% else %}
  Tu es venu pour mesurer ton talent activé. Voici ce qui le bride...
{% endif %}
```

3 séquences × 4 hooks = 12 expériences possibles, **8-10 templates Brevo seulement** à écrire.

## Lead scoring automatique (calcul côté code)

| Tier | Critères combinés |
|---|---|
| **Hot** | Note Talent ≤ 4/10 ET (Patron-Manager OU rôle senior : Lead/Director/VP/C-level) ET urgency ≥ 7/10 |
| **Warm** | Note Talent 5-7 OU (Note Talent ≤ 4 mais profil non-leader) |
| **Cold** | Note Talent ≥ 8 OU Freelance sans match qualifying OU urgency ≤ 3 |

Le tier est posé en attribut Brevo `LEAD_TIER` au moment de l'upsert.

## Attributs Brevo enrichis

À ajouter aux existants :
- `SOURCE` (keeper / fraud / ai / talent)
- `TALENT_SCORE` (0-10)
- `KEEPER_SCORE` (réponse au quadrant côté Keeper)
- `FRAUD_SCORE` (indice imposture 0-10)
- `AI_RISK_SCORE` (0-10 calculé via mini-module objectif)
- `ARCHETYPE` (Tampon / Faussaire / Roi Solitaire / Aucun)
- `PORTE` (1=Ancrer / 2=Déployer / 3=Quitter / 4=Recommencer)
- `LEAD_TIER` (Hot / Warm / Cold)
- `INDUSTRY` (VFX / Gaming / Design / Music / Agency / Tech / Other)
- `ROLE` (Lead / Senior Manager / Director / VP / C-level / Other)
- `YEARS_IN_LEADERSHIP` (<1 / 1-3 / 3-5 / 5+ / 10+)
- `DIRECT_REPORTS` (<5 / 5-15 / 15-50 / 50+)
- `LAST_VACATION` (<1m / 1-6m / 6-12m / 1+y)
- `COMP_RANGE` (brackets en USD/EUR)
- `URGENCY` (1-10 slider)

## PDF diagnostic à J+1

- Route `/diagnostic/pdf?id=<diagnostic_id>` qui génère un PDF personnalisé
- Contient : note /10 + verdict + quadrant + archétype + 6 besoins + angles morts + actions 30 jours + CTA Bootcamp embed
- Designed pour être imprimable + partageable
- Email Brevo J+1 envoie le lien de téléchargement
- Effet viral : les leads partagent à conjoint/coach/RH

## Retargeting LinkedIn

- Upload des leads dans LinkedIn Ads Custom Audience
- Audiences segmentées par `VERDICT` (14 audiences) ou par `LEAD_TIER` (3 audiences)
- Pubs personnalisées : "Talent Coincé : voici ce qu'on fait au Bootcamp..."
- Coût acquisition réduit (retargeting > cold)

## KPIs à suivre

| Métrique | Source | Cible |
|---|---|---|
| Visiteurs sur landing /[slug] | GA4 | À mesurer après lancement |
| Taux de complétion test | GA4 (started vs completed) | > 60% |
| Email captured / completed | GA4 | > 80% |
| Lead distribution Hot/Warm/Cold | Brevo | À calibrer |
| Conversion Hot → TidyCal booking | TidyCal + Brevo | > 30% |
| Conversion TidyCal → Bootcamp | manuel | À mesurer |
| Conversion Warm → Bootcamp | Brevo | > 5% |
| Téléchargements PDF J+1 | Vercel Analytics | > 50% des Hot |
| Partages PDF (estimation) | manuel feedback | À tracker |

## Charge totale estimée

- **Code** : 8-10 jours dev pour P1-P5
- **Copy** : 8-10 templates Brevo à écrire (P6)
- **Design WP** : 4 landings Elementor (P7)
- **Marketing ops** : retargeting LinkedIn setup (P8)

Comparé à la spec originale (4 tests séparés, ~70 pieces de texte, 4 builds) : **charge divisée par 5** pour un funnel équivalent en valeur.

## Décisions stratégiques verrouillées

- ✅ 1 test unifié, 4 portes d'entrée
- ✅ Landings sur monexpansion.com/[slug] (pas sous-domaines)
- ✅ talent.monexpansion.com / talent.monexpansion.com pointent vers la même app
- ✅ ExpansionStudio retiré (offre arrêtée)
- ✅ Live mensuel reporté (URL pas encore disponible)
- ✅ Sains : pas de P.S. produit, juste bloc "Reste connecté"
- ✅ TidyCal en CTA Coaching + soft sur Bootcamp-primary
- ✅ **Test light gratuit en entrée + diagnostic complet sur email gate**
- ✅ **Mobile-first design**

## Architecture en 2 niveaux

### Niveau 1 : Test light (gratuit, no email, ~1 min)

3 questions sliders 1-10 mobile-friendly :
- **Q0** : signature selon `?source=` (la question urgente du prospect)
- **Q0b** : miroir signature selon `?source=`
- **Q0c** : urgency ("À quel point ça doit changer dans les 6 prochains mois ?")

**Page résultat light** :
- Zone du quadrant Talent × Terrain (calculée depuis Q0 + Q0b)
- Score préliminaire visible (ex. "Tu as répondu 3/10 au Keeper")
- 1 phrase de valeur immédiate ("Voici ce qui te bloque probablement : [phrase courte]")
- 3 verrous tease :
  - 🔒 Ton angle mort principal
  - 🔒 Tes 3 actions concrètes 30 jours
  - 🔒 Les 4 réponses à tes vraies questions
- CTA principal : "Débloque ton diagnostic complet (5 min, par email) →"
- Bouton secondaire : "Partage ton score" (X / LinkedIn / copy link)

### Niveau 2 : Test avancé (avec email, ~5 min)

- Email gate enrichi (Prénom, Email, Métier, Statut pro, Industrie, Rôle)
- 22 questions Robbins (reformulées leader, 6-8 changées)
- 3 questions IA objectives (toujours posées pour calculer AI Risk)
- Page résultat complète : note Talent /10 + quadrant + archétype + 4 réponses + porte recommandée + angle mort
- Si user vient du light : Q0/Q0b/Q0c sont déjà répondues, on les skip (prefill)

## Décisions test light verrouillées

| # | Décision | Choix |
|---|---|---|
| 1 | Light obligatoire ou optionnel | **B** Optionnel (deux entrées sur la landing) |
| 2 | Nombre de questions light | **B** 3 questions (Q0 + Q0b + urgency) |
| 3 | Page résultat light | **B** Tease + 1 phrase de valeur immédiate |
| 4 | Anti-abus | **A** Illimité, public |

## Décisions test avancé verrouillées

| # | Décision | Choix |
|---|---|---|
| 1 | Total questions test avancé | **B** 27 questions (Q0+Q0b+Q0c + 22 Robbins + 3 IA) ; 5 qualifying demandés par email J+0 |
| 2 | Position email gate | **C** Après Q0/Q0b/Q0c, avant les 22 Robbins (si vient du light, Q0 déjà répondu) |
| 3 | Reformulation 22 Robbins | **B** Reformuler 6-8 questions qui sonnent "artiste isolé" |
| 4 | Calcul archétype | **B** Toujours retourner un archétype (le moins éloigné) |
| 5 | Calcul Terrain Loyal/Truqué | **A** Q0b miroir suffit comme proxy pour démarrer |
| 6 | Calcul des 4 réponses | **A** Toutes dérivées des données collectées |
| 7 | UI sliders vs boutons | Slider 1-10 sur Q0/Q0b/Q0c, boutons 3 options sur les 22 Robbins |
| 8 | Module IA (3 questions objectives) | **B** Posé à tout le monde |

## Configuration des 4 sources

| Source | Hero (Q0) | Miroir (Q0b) | Pain ciblé |
|---|---|---|---|
| `keeper` | "Si tu démissionnais demain, à quel point ton boss se battrait pour te garder ?" | "Et toi, tu te battrais pour rester ?" | Golden handcuffs |
| `fraud` | "Sur 10, à quel point tu te sens fraude dans ton rôle aujourd'hui ?" | "Si on filmait ton dernier 1:1 difficile, à quel point tu serais fier ?" | Imposter syndrome |
| `ai` | "Sur 10, à quel point ton job de leader sera remplacé par l'IA dans 24 mois ?" | "Si l'IA prenait 50% de ton job demain, à quel point tu serais soulagé ?" | Remplacement IA |
| `talent` | "À quel point utilises-tu pleinement tes capacités dans ton job ?" | "Si tu pouvais redessiner ton rôle demain, à quel point tu changerais des choses ?" | Craft perdu |

Q0c urgency identique pour tous : "À quel point ça doit changer dans les 6 prochains mois ?"

## Mobile-first : contraintes UX

- Sliders 1-10 manipulables au pouce (zone tactile ≥ 44px)
- 1 question = 1 écran (pas de scroll dans une question)
- Boutons full-width sur mobile, padding généreux
- Progress bar visible permanente
- Texte question en grande taille (≥ 22px sur mobile)
- Transitions fluides (fade-up entre questions)
- Pas de zoom imposé, font-size ≥ 16px sur les inputs
- Tester sur viewport 375px (iPhone SE) et 390px (iPhone moderne)
