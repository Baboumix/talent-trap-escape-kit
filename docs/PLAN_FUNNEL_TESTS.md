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

TEST UNIFIÉ (kit.monexpansion.com)
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

## Décisions verrouillées

- ✅ 1 test unifié, 4 portes d'entrée
- ✅ Landings sur monexpansion.com/[slug] (pas sous-domaines)
- ✅ kit.monexpansion.com / talent.monexpansion.com pointent vers la même app
- ✅ ExpansionStudio retiré (offre arrêtée)
- ✅ Live mensuel reporté (URL pas encore disponible)
- ✅ Sains : pas de P.S. produit, juste bloc "Reste connecté"
- ✅ TidyCal en CTA Coaching + soft sur Bootcamp-primary

## À trancher avant de coder P1 (voir conversation Claude Code en cours)

Voir section dédiée dans la conversation. Les points en suspens incluent : reformulation Robbins, position email gate, calcul exact archétypes, calcul Terrain Loyal/Truqué.
