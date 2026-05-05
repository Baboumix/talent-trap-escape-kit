# Tracking et data du Profil du Talent Coincé

Document de référence pour comprendre tout ce que l'application enregistre, envoie et trace lors d'une session utilisateur. Source de vérité pour le contexte business et technique.

## Contexte produit

**Profil du Talent Coincé** est un diagnostic gratuit de 5 minutes, déployé sur **talent.monexpansion.com** (Next.js, Vercel). C'est le lead magnet du funnel monExpansion qui pousse vers le Bootcamp Expansion, le coaching premium 1:1 (via TidyCal), ou la newsletter selon le profil détecté.

L'utilisateur :
1. Arrive sur la home, clique "Démarrer le diagnostic"
2. Choisit son statut pro (salarié / freelance / patron-manager)
3. Répond à 24 questions (réponses : Non / Plutôt / Oui)
4. Voit son verdict + sa **note Talent /10** + son breakdown des 6 besoins essentiels
5. Saisit prénom / email / métier pour recevoir le diagnostic complet par email
6. Atterrit sur une page de remerciement / hub d'abonnement YouTube + Podcast + Réseaux

Le diagnostic produit l'un des **14 verdicts** suivants, dérivés du score sur les **6 besoins essentiels (Robbins)** : Certitude, Variété, Signifiance, Connexion, Croissance, Contribution.

Les 14 verdicts :
- **Pièges** (besoin dominant en compensation) : Talent Coincé, Talent Dispersé, Talent Égoïque, Talent Loyal, Talent Épuisé, Talent Perdu
- **Sains** (besoin dominant nourri sainement) : Talent Ancré, Talent Explorateur, Talent Reconnu, Talent Connecté, Talent en Expansion, Talent Au Service
- **Transversaux** : Talent en Transition, Talent Suspendu

## Vue d'ensemble du tracking

```
┌─────────────────────────────────────────────────────┐
│  NAVIGATEUR UTILISATEUR (talent.monexpansion.com)      │
└──────┬──────────────────────────────────────────────┘
       │
       ├──► Google Tag Manager (GTM-PHQMQHQK)
       │       └──► GA4 G-26ZHX08Z9J : 5 events business + pageviews
       │       └──► Google Ads AW-16629451984
       │
       └──► POST /api/submit-diagnostic (à la capture email)
                  │
                  ├──► Notion API : création fiche dans 🧭 Diagnostics
                  ├──► Brevo API : upsert contact + tag + attributs
                  └──► Brevo SMTP : envoi email rapport + BCC app@monexpansion.com
```

## 1. Notion — Suivi commercial individuel

**Base** : 🧭 Diagnostics, ID `552eee8e-fc53-4785-8c35-0bc135c774e0`, sous la page parent **App Talent**.

**Authentification** : env var `NOTION_TOKEN` (Vercel).

**Une fiche est créée par soumission**, avec ces champs :

| Champ Notion | Type | Description |
|---|---|---|
| Email | Title | l'email du lead |
| Prénom | Rich text | |
| Métier | Rich text | texte libre |
| Statut pro | Select | `Salarié` / `Freelance` / `Patron-Manager` |
| Verdict | Select | un des 14 verdicts ci-dessus, format `Talent X` |
| Modifiers | Multi-select | jusqu'à 8 angles morts détectés (voir liste plus bas) |
| Note Talent /10 | Number | de 0 à 10 |
| Besoins dominants | Multi-select | top 3 besoins (Certitude / Variété / Signifiance / Connexion / Croissance / Contribution) |
| Intensité [Besoin] × 6 | Number | 0-4, mesure si le besoin est dominant pour la personne |
| Satisfaction [Besoin] × 6 | Number | 0-4, mesure si le besoin est nourri sainement |
| Réponses brutes | Rich text | JSON des 24 réponses (clé Q1-Q24, valeur 0/1/2) |
| Date diagnostic | Date | timestamp ISO |
| Durée test (sec) | Number | de 0 à 86400 (cap 24h) |
| Langue | Select | `FR` / `EN` |
| Source | Rich text | document.referrer si fourni |
| Statut suivi | Select | `Nouveau` par défaut. Modifiable manuellement par Julien : `Email envoyé`, `Séquence en cours`, `Relancé`, `Appel proposé`, `Converti Bootcamp`, `Converti Coaching`, `Filtre out` |
| Avatar rattaché | Relation | vers la base Avatars (un avatar par verdict si configuré côté env) |

**Les 8 modifiers (angles morts)** :
- Angle Mort Financier · Angle Mort Statut · Épuisement Silencieux · Ennui Masqué
- Contribution Vide · Isolement Créatif · Leader Accidentel · Vision Floue

**Usage** : interface Notion classique. Trier par date, filtrer par verdict ou Statut suivi, ajouter des notes perso dans une colonne `Notes perso` libre.

## 2. Brevo — CRM email + envois

**Authentification** : env var `BREVO_API_KEY` (Vercel).

À chaque soumission diagnostic :

### Upsert contact
- Liste **FR** (id `11`) ou **EN** (id `12`) selon `lang`
- Attributs custom remplis :
  - `PRENOM` (texte)
  - `VERDICT` (texte, format `Talent X`)
  - `MODIFIERS` (texte, modifiers concaténés en `, `)
  - `METIER` (texte libre)
  - `STATUT_PRO` (`salarie` / `freelance` / `patron-manager`)
  - `LANG` (`FR` / `EN`)
- Tag `diagnostic_fait` posé

### Email transactionnel
- Sender : env vars `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME`
- Destinataire : email du lead
- **BCC : `app@monexpansion.com`** (override possible via env var `BREVO_BCC_EMAIL`)
- Sujet : émotionnel, segmenté par verdict (ex. `[Prénom], voilà pourquoi ton talent fuit` pour Coincé). 14 sujets différents.
- Contenu HTML : rapport complet (note /10 hero, breakdown 6 besoins, verdict détaillé, angles morts, 3 actions 30 jours, bloc "Reste connecté", P.S. produit segmenté + soft CTA TidyCal urgence sur les Bootcamp-primary)

### Sortie de séquence (à venir)
Tags à créer côté Brevo pour stopper les automations :
- `bootcamp_inscrit`
- `coaching_inscrit`

## 3. Google Analytics 4 (via Google Tag Manager)

**Conteneur GTM** : `GTM-PHQMQHQK` (le même que monexpansion.com WordPress, donc unifié).

**Tags actifs dans le conteneur** :
- GA4 : `G-26ZHX08Z9J`
- Google Ads : `AW-16629451984`

**Wrappage** : composant `<GoogleTagManager>` du package `@next/third-parties/google` dans `app/layout.tsx`. Override possible via env var `NEXT_PUBLIC_GTM_ID`.

### 5 events business

Émis via `sendGTMEvent` du package `@next/third-parties/google`.

| Event | Trigger | Paramètres custom |
|---|---|---|
| `diagnostic_started` | clic CTA "Démarrer le diagnostic" sur la home | `diagnostic_source` (valeurs : `landing_hero_cta`, `landing_secondary_cta`, `blog_link`, `email_followup`, `social_share`, `direct`) |
| `diagnostic_question_answered` | à chaque clic Non / Plutôt / Oui | `question_number` (1-24, 1-indexed), `total_questions` (24) |
| `diagnostic_completed` | mount de la page `/diagnostic/resultat` | `verdict` (un des 14), `duration_seconds` |
| `email_captured` (**KEY EVENT**) | après que `/api/submit-diagnostic` retourne ok | `verdict`, `method` (`inline_form`) |
| `share_clicked` | clic sur les boutons partage de la page résultat | `share_platform` (`twitter` / `linkedin` / `copy_link`), `verdict` |

### Custom dimensions GA4 (Event scope)

Déjà créées côté GA4 admin :
- `verdict`
- `question_number`
- `total_questions`
- `duration_seconds`
- `method`
- `share_platform`
- `diagnostic_source`

### Configuration GTM à finaliser

Côté dashboard GTM (à faire manuellement par Julien ou via une autre session Claude) :
- 1 trigger Custom Event regex matchant les 5 noms d'events
- 7 Data Layer Variables (une par paramètre custom)
- 1 tag GA4 Event qui forward `{{Event}}` + paramètres
- Submit + publish la version

**Helper côté code** : `lib/analytics.ts` expose `analytics.diagnosticStarted()`, `.diagnosticQuestionAnswered()`, `.diagnosticCompleted()`, `.emailCaptured()`, `.shareClicked()`. Plus un objet `diagnosticTimer` (start / durationSeconds / clear) qui mesure le temps via sessionStorage de "clic CTA" à "email capturé".

## 4. Convention UTM

Tous les liens externes dans l'email transactionnel et les boutons de partage sont taggués automatiquement.

### Sources

| `utm_source` | Quand |
|---|---|
| `email_diagnostic` | liens dans l'email transactionnel envoyé après le diagnostic |
| `email_sequence` | (futur) liens dans la séquence de relance J+2/J+5/J+10 Brevo |
| `share` | liens depuis les boutons "Partage ton verdict" sur la page résultat |

### Structure complète

```
?utm_source=<source>
&utm_medium=<email|twitter|linkedin|copy>
&utm_campaign=ptc_<verdict>
&utm_content=<cta_bootcamp|cta_coaching|social_youtube|social_apple|social_spotify|social_instagram|social_tiktok|social_linkedin|soft_call_tidycal>
```

**Exemples** :
- `https://www.monexpansion.com/bootcamp/?utm_source=email_diagnostic&utm_medium=email&utm_campaign=ptc_coince&utm_content=cta_bootcamp`
- `https://tidycal.com/julienklein/decouverte?utm_source=email_diagnostic&utm_medium=email&utm_campaign=ptc_perdu&utm_content=cta_coaching`
- `https://www.youtube.com/channel/UCxQtPK0hRbXC8Rvb_j4OgeA?utm_source=email_diagnostic&utm_medium=email&utm_campaign=ptc_ancre&utm_content=social_youtube`

### Helper côté code

`withUtm(url, content, verdict)` dans `lib/email-report.ts`. Skip automatique si l'URL a déjà des params `utm_*` ou si elle n'est pas absolue HTTP.

## 5. Stockage navigateur

### localStorage : `ptc-diagnostic-v1`
Sauvegarde la progression du diagnostic pour permettre la reprise (clé `STORAGE_KEY`) :
- Version du schéma
- Date de démarrage
- Statut pro choisi
- Réponses (clé Q-id, valeur 0/1/2)

Cleared après soumission réussie.

### sessionStorage : `diagnostic_start_time`
Timestamp en ms au moment du clic CTA "Démarrer le diagnostic". Utilisé pour calculer `duration_seconds` envoyé à GA4 lors de `diagnostic_completed` et `email_captured`. Cleared après email_captured.

## 6. CTA segmenté par verdict

Le P.S. de l'email transactionnel pousse un produit différent selon le verdict.

| Catégorie | Verdicts | CTA principal | CTA soft |
|---|---|---|---|
| Pièges classiques | Coincé / Dispersé / Égoïque / Loyal-non-leader / Épuisé | Bootcamp Expansion (waitlist) | TidyCal urgence |
| Pièges Transition / Suspendu | Transition / Suspendu | Bootcamp Expansion (waitlist) | TidyCal urgence |
| Profils coaching | Perdu / Reconnu / Loyal-leader | TidyCal coaching premium | (déjà l'urgence intégrée) |
| Sains | Ancré / Connecté / Au Service / Expansion / Explorateur | **Pas de P.S. produit**. Le bloc "Reste connecté" (YouTube hero rouge + Podcast Apple+Spotify + Réseaux IG/TikTok/LinkedIn) est l'unique CTA. | (rien) |

URLs (env vars Vercel, fallback codé) :
- Bootcamp FR : `WAITLIST_BOOTCAMP_URL_FR` (fallback `https://www.monexpansion.com/bootcamp/`)
- Bootcamp EN : `WAITLIST_BOOTCAMP_URL_EN`
- Coaching FR : `COACHING_URL_FR` (fallback `https://tidycal.com/julienklein/decouverte`)
- Coaching EN : `COACHING_URL_EN` (fallback `https://tidycal.com/julienklein/discovery`)

## 7. Questions business auxquelles tu peux répondre

Avec ce setup, tu peux répondre dans tes outils :

### Dans GA4 (Acquisition + Engagement)
- Combien de gens **démarrent** le diagnostic par jour / mois ? (event `diagnostic_started`)
- Combien le **terminent** ? (event `diagnostic_completed`)
- Quel est le **taux d'abandon** ? (`diagnostic_completed` / `diagnostic_started`)
- À quelle question les gens **partent le plus** ? (max `question_number` dans `diagnostic_question_answered`)
- Combien capturent leur **email** ? (event `email_captured`, KEY EVENT)
- Quel verdict génère le plus de **partages** ? (`share_clicked` filtré par `verdict`)
- Quel canal envoie du trafic ? (Source/Support classique GA4)
- Quelle campagne UTM **convertit le mieux** ? (filtrer par `utm_campaign` puis comparer les conversions)

### Dans Notion (suivi nominatif)
- Liste des leads par verdict, par statut suivi
- Conversion par jour/semaine/mois (filtrer Date diagnostic)
- Profils convertis vs filtrés out

### Dans Brevo
- Open rate / click rate de l'email transactionnel
- Performance des futures séquences J+2 / J+5 / J+10 (à configurer)
- Taux de désabonnement par segment

## Stack technique côté code

- Next.js 14 App Router + TypeScript strict
- Tailwind CSS, fonts Fraunces + DM Sans, palette ink/coral
- Bibliothèques : `@notionhq/client`, `zod`, `@next/third-parties` (GTM), `@getbrevo/brevo` (mais on utilise fetch direct pour l'API REST Brevo), `next` 14.2

Modules clés :
- `lib/scoring.ts` : compute Diagnostic (intensity, satisfaction, dominantNeeds, talentScore, verdict, modifiers)
- `lib/cta.ts` : `pickCta(verdict, statutPro, lang)` → `EmailCta | null` ; `getSoftCallCta(verdict, lang)` → soft TidyCal CTA ; `pickEmailSubject(verdict, prenom)` → sujet email segmenté
- `lib/email-report.ts` : génère le HTML de l'email transactionnel + helper `withUtm`
- `lib/notion.ts` : `createDiagnosticPage(input, result)` crée la fiche Notion
- `lib/brevo.ts` : `upsertContact(input, result)` + `sendReportEmail(...)`
- `lib/analytics.ts` : helpers `analytics.*` qui wrappent `sendGTMEvent`

API route :
- `POST /api/submit-diagnostic` : Zod validation → Promise.allSettled (Notion + Brevo upsert) → `sendReportEmail` blocking → return `{ ok: true, verdict }`

## Variables d'environnement Vercel

Critiques (l'app crashera ou aura des fallbacks faibles si manquantes) :
- `NOTION_TOKEN`, `NOTION_DIAGNOSTICS_DB_ID`, `NOTION_AVATARS_DB_ID`
- `NOTION_AVATAR_<VERDICT>_ID` × 14 (optionnels, pour rattacher l'avatar Notion par verdict)
- `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`
- `BREVO_LIST_ID_FR=11`, `BREVO_LIST_ID_EN=12`
- `BREVO_BCC_EMAIL=app@monexpansion.com` (optionnel, fallback codé)

Optionnels (override des fallbacks) :
- `WAITLIST_BOOTCAMP_URL_FR`, `WAITLIST_BOOTCAMP_URL_EN`
- `COACHING_URL_FR`, `COACHING_URL_EN`
- `NEXT_PUBLIC_GTM_ID` (override `GTM-PHQMQHQK`)

## Ressources

- Repo : https://github.com/Baboumix/talent-trap-escape-kit
- Prod : https://talent.monexpansion.com
- Dashboard Notion : `🧭 Diagnostics` sous la page `App Talent`
- Dashboard Brevo : compte monExpansion, listes 11 (FR) et 12 (EN), template `diagnostic_fait`
- GA4 : property `G-26ZHX08Z9J`, custom dimensions configurées
- GTM : conteneur `GTM-PHQMQHQK`, à finaliser pour publier les triggers GA4 Event
- Doc complémentaire :
  - `docs/NOTION_SCHEMA.md` : schéma exact de la base Notion
  - `docs/BREVO_SEQUENCE.md` : guide pas-à-pas pour la séquence J+2/J+5/J+10
