# Guide : configurer la séquence email J+2 / J+5 / J+10 dans Brevo

Cette séquence se déclenche automatiquement après que quelqu'un complète le diagnostic et reçoive son rapport. Elle approfondit le verdict, donne du contexte, et invite progressivement vers le bon produit.

## Vue d'ensemble

Tu vas créer **un seul workflow d'automation** dans Brevo, avec **4 branches** selon le verdict, et **3 emails par branche** (J+2, J+5, J+10). Soit 12 emails à préparer.

Ça paraît beaucoup. En pratique, certains emails (notamment les J+2 d'approfondissement) peuvent être communs à plusieurs branches. Je propose une matrice optimisée plus bas.

## Architecture

### Trigger

Le workflow se déclenche quand un contact reçoit le tag `diagnostic_fait` (déjà posé automatiquement par l'email transactionnel envoyé après le diagnostic).

### Conditions de sortie

Si le contact reçoit l'un de ces tags pendant la séquence, il sort automatiquement :
- `bootcamp_inscrit`
- `coaching_inscrit`
- `unsubscribed` (Brevo le gère natif)

À créer manuellement dans Brevo > Contacts > Tags si pas déjà existant.

### Segmentation en 4 branches

| Branche | Verdicts couverts | Direction |
|---|---|---|
| **A** : Pièges classiques | Talent Coincé, Talent Dispersé, Talent Égoïque, Talent Loyal (non patron-manager), Talent Épuisé | Push Bootcamp progressif |
| **B** : Profils coaching | Talent Perdu, Talent Reconnu, Talent Loyal (patron-manager) | Push Coaching premium |
| **C** : Transition / Suspendu | Talent en Transition, Talent Suspendu | Urgence + Bootcamp |
| **D** : Sains | Talent Ancré, Talent Connecté, Talent Au Service, Talent en Expansion, Talent Explorateur | Contenu pur, pas de push |

Le verdict est stocké dans l'attribut Brevo `VERDICT` (déjà en place côté code).

---

## Étapes Brevo

### 1. Vérifier les prérequis

- [ ] L'attribut contact `VERDICT` existe et est rempli (vérifier sur 1-2 contacts récents)
- [ ] Le tag `diagnostic_fait` est posé sur les contacts récents
- [ ] Tu as les tags `bootcamp_inscrit` et `coaching_inscrit` créés (sinon : Contacts > Tags > Créer)

### 2. Créer le workflow

Brevo > **Automation** > **Créer un workflow** > **À partir de zéro**.

Nom : `Diagnostic - Séquence J+2 J+5 J+10`

### 3. Configurer le trigger

- Type : **Un contact reçoit un tag**
- Tag : `diagnostic_fait`

### 4. Configurer la condition de sortie globale

Dans les paramètres du workflow > **Sortie automatique** :
- Sortir si le contact reçoit `bootcamp_inscrit`
- Sortir si le contact reçoit `coaching_inscrit`

### 5. Construire les 4 branches

Ajoute une étape **Conditions** (Si/Sinon) en racine, avec 4 chemins basés sur l'attribut `VERDICT`.

Pour chaque branche, ajoute :
1. **Attendre** : 2 jours
2. **Envoyer email** : J+2 (template selon branche)
3. **Attendre** : 3 jours (donc J+5 au total)
4. **Envoyer email** : J+5
5. **Attendre** : 5 jours (donc J+10 au total)
6. **Envoyer email** : J+10

---

## Contenu des 12 emails

Ci-dessous, **sujet + objectif + outline** pour chacun. À toi de finaliser le copy au ton monExpansion.

### Branche A : Pièges classiques (Coincé, Dispersé, Égoïque, Loyal-non-leader, Épuisé)

#### A.J+2 : "Le piège dont tu ne parles pas"

- **Objectif** : approfondir l'angle mort du verdict, donner du langage
- **Sujet** : `[Prénom], le piège qui coûte le plus cher, c'est celui qu'on ne nomme pas`
- **Outline** :
  - Hook : ce que la plupart des gens ne voient pas dans ta position
  - Le vrai mécanisme du piège (pas financier mais identitaire)
  - Ce qu'on observe sur 100 personnes avec ce profil
  - Soft : pas de CTA produit, juste un lien vers une vidéo YouTube ou article approfondi
- **CTA secondaire** : `Voir la vidéo →` (lien YouTube avec UTM)

#### A.J+5 : "Le moment où c'est devenu plus cher de rester que de partir"

- **Objectif** : déclencher l'urgence par un témoignage / scénario
- **Sujet** : `[Prénom], le moment où le piège se referme vraiment`
- **Outline** :
  - Témoignage court d'un ancien client similaire (à insérer)
  - Ce qui s'est passé pour lui : 6 mois avant la décision, 6 mois après
  - L'angle mort qu'il a vu en clair
  - Mention du Bootcamp comme le cadre qui l'a aidé
- **CTA** : `Voir le Bootcamp Expansion →`

#### A.J+10 : "Tu es au croisement"

- **Objectif** : invitation directe au Bootcamp ou TidyCal
- **Sujet** : `[Prénom], 30 jours pour décider sans drame`
- **Outline** :
  - Reprise du verdict et de la note /10
  - Question directe : tu attends quoi pour bouger ?
  - Présentation du Bootcamp : 1 mois, 4 appels, décisions concrètes
  - Option urgence : appel découverte 15 min
- **CTA principal** : `Rejoindre la waitlist Bootcamp →`
- **CTA secondaire** : `Réserver un appel découverte →` (TidyCal)

### Branche B : Profils coaching (Perdu, Reconnu, Loyal-leader)

#### B.J+2 : "Ce que personne ne te dit dans ta position"

- **Objectif** : reconnaître la solitude des leaders / gens en haut
- **Sujet** : `[Prénom], la solitude que personne ne nomme dans ta position`
- **Outline** :
  - L'isolement spécifique des gens à ton niveau
  - Pourquoi le coaching collectif ne marche pas pour ce profil
  - Mention du coaching premium 1:1 sans push
- **CTA secondaire** : `Lire un article approfondi →`

#### B.J+5 : "Le travail qui change tout, à ton niveau"

- **Objectif** : montrer ce que fait le coaching premium concrètement
- **Sujet** : `[Prénom], voici ce qui se passe quand on travaille en 1:1`
- **Outline** :
  - Témoignage d'un client coaching premium
  - Le shift identitaire (pas tactique)
  - Ce que tu ne peux pas faire seul
- **CTA** : `Réserver un appel découverte →` (TidyCal)

#### B.J+10 : "On en parle ?"

- **Objectif** : invitation directe sans pression
- **Sujet** : `[Prénom], 15 minutes pour voir si c'est le bon moment`
- **Outline** :
  - Pas de gros pitch, juste une invitation à parler
  - Comment ça se passe : 15 min, pas d'engagement, on regarde ensemble
- **CTA** : `Réserver un appel découverte →` (TidyCal)

### Branche C : Transition / Suspendu

#### C.J+2 : "Ce qui te fait vraiment hésiter"

- **Objectif** : nommer le blocage émotionnel
- **Sujet** : `[Prénom], ce n'est pas l'information qui te manque`
- **Outline** :
  - Hypothèse : tu as déjà toutes les infos
  - Le vrai blocage est émotionnel, pas intellectuel
  - Pourquoi un cadre extérieur change tout
- **CTA secondaire** : `Lire le Bootcamp →`

#### C.J+5 : "30 jours pour trancher"

- **Objectif** : poser le cadre du Bootcamp comme accélérateur de décision
- **Sujet** : `[Prénom], le coût de l'indécision`
- **Outline** :
  - Le coût caché de rester dans l'entre-deux
  - Cas client : il était comme toi, voici sa décision et ses 6 mois après
  - Le Bootcamp comme deadline forcée
- **CTA** : `Voir le Bootcamp Expansion →`

#### C.J+10 : "Bouger ou pas, mais bouger"

- **Objectif** : appel à l'action final
- **Sujet** : `[Prénom], dernière étape de la séquence`
- **Outline** :
  - Tu as reçu trois emails. Voici la conclusion.
  - Si tu veux le cadre : Bootcamp
  - Si tu veux parler avant : appel découverte
  - Si tu n'es pas prêt : pas de souci, tu reçois le contenu hebdo
- **CTA principal** : `Rejoindre la waitlist Bootcamp →`
- **CTA secondaire** : `Réserver un appel découverte →`

### Branche D : Sains (Ancré, Connecté, Au Service, Expansion, Explorateur)

Pas de push produit dans cette branche. **Du contenu pur, pour entretenir la relation**.

#### D.J+2 : "Ton talent circule. Voici comment l'amplifier"

- **Objectif** : valoriser leur position, donner du contenu inspirant
- **Sujet** : `[Prénom], tu fais partie d'une minorité`
- **Outline** :
  - Statistique : seulement X% des gens qui font ce test ont ton profil
  - 3 questions à te poser pour amplifier ce qui marche déjà
  - Lien vers une vidéo YouTube avancée
- **CTA secondaire** : `Voir la vidéo →`

#### D.J+5 : "Ce qui fait la différence entre stable et puissant"

- **Objectif** : pousser à la prochaine étape sans la nommer comme produit
- **Sujet** : `[Prénom], la prochaine marche n'est pas où tu crois`
- **Outline** :
  - Réflexion sur la transition stable → puissant
  - Ce qu'on observe chez ceux qui montent encore d'un cran
  - Lien podcast / article approfondi
- **CTA secondaire** : `Écouter l'épisode →`

#### D.J+10 : "Reste dans le sillon"

- **Objectif** : invitation à rester abonné, pas de push commercial
- **Sujet** : `[Prénom], on continue à te suivre ?`
- **Outline** :
  - Récap des 3 emails
  - Invitation à suivre YouTube + Podcast + Réseaux
  - Pas de produit, juste du contenu hebdo
- **CTA** : `S'abonner sur YouTube →`

---

## Setup template Brevo

Pour chaque email, tu peux :

1. **Réutiliser le template HTML** de l'email diagnostic (style cohérent) en l'adaptant. Brevo permet de dupliquer un template et de modifier le contenu.

2. **Variables dynamiques disponibles** :
   - `{{ contact.PRENOM }}` : prénom
   - `{{ contact.VERDICT }}` : verdict (texte type "Talent Coincé")
   - `{{ contact.METIER }}` : métier
   - `{{ contact.STATUT_PRO }}` : statut pro

3. **UTM sur les liens** : ajouter manuellement
   - `?utm_source=email_sequence&utm_medium=email&utm_campaign=diagnostic_jX&utm_content=cta_<produit>`
   - Exemple : `https://www.monexpansion.com/bootcamp/?utm_source=email_sequence&utm_medium=email&utm_campaign=diagnostic_j10&utm_content=cta_bootcamp`

---

## Validation avant activation

Avant de lancer le workflow en production :

- [ ] Tester le workflow en mode **draft** avec ton propre email
- [ ] Vérifier qu'on entre bien dans la bonne branche selon ton verdict de test
- [ ] Vérifier que les variables s'affichent (pas de `{{ contact.PRENOM }}` brut)
- [ ] Tester la sortie : ajoute manuellement le tag `bootcamp_inscrit` à un contact en cours et vérifie qu'il sort
- [ ] Vérifier dans Brevo > Statistiques que les emails s'envoient bien

---

## Étapes pour Julien

1. **Cette semaine** : finaliser le copy de chaque email (12 brouillons)
2. **Quand prêt** : créer les 12 templates dans Brevo
3. **Configurer le workflow** dans Brevo Automation selon ce guide
4. **Tester** avec ton propre email
5. **Activer**
