# Notion DB schema · Diagnostics

Colonnes attendues dans la base Notion (env `NOTION_DIAGNOSTICS_DB_ID`).

## Colonnes existantes (à conserver)

| Nom | Type Notion |
|---|---|
| Email | Title |
| Prénom | Rich text |
| Métier | Rich text |
| Statut pro | Select (`Salarié`, `Freelance`, `Patron-Manager`) |
| Verdict | Select (voir liste plus bas) |
| Modifiers | Multi-select |
| Réponses brutes | Rich text |
| Date diagnostic | Date |
| Durée test (sec) | Number |
| Langue | Select (`FR`, `EN`) |
| Statut suivi | Select (`Nouveau`, ...) |
| Source | Rich text (optionnel) |
| Avatar rattaché | Relation (vers la base Avatars) |

## Colonnes à AJOUTER

| Nom | Type Notion | Notes |
|---|---|---|
| Note Talent /10 | Number | 0 à 10 |
| Besoins dominants | Multi-select | Top 3 besoins (voir options ci-dessous) |
| Intensité Certitude | Number | 0 à 4 |
| Intensité Variété | Number | 0 à 4 |
| Intensité Signifiance | Number | 0 à 4 |
| Intensité Connexion | Number | 0 à 4 |
| Intensité Croissance | Number | 0 à 4 |
| Intensité Contribution | Number | 0 à 4 |
| Satisfaction Certitude | Number | 0 à 4 |
| Satisfaction Variété | Number | 0 à 4 |
| Satisfaction Signifiance | Number | 0 à 4 |
| Satisfaction Connexion | Number | 0 à 4 |
| Satisfaction Croissance | Number | 0 à 4 |
| Satisfaction Contribution | Number | 0 à 4 |

## Colonnes à SUPPRIMER

| Nom | Raison |
|---|---|
| Score Ancrage | Remplacé par Intensité/Satisfaction par besoin |
| Score Circulation | idem |
| Score Sens | idem |

## Options du Select `Verdict` (14 valeurs)

- Talent Ancré
- Talent Coincé
- Talent Explorateur
- Talent Dispersé
- Talent Reconnu
- Talent Égoïque
- Talent Connecté
- Talent Loyal
- Talent en Expansion
- Talent Épuisé
- Talent Au Service
- Talent Perdu
- Talent en Transition
- Talent Suspendu

## Options du Multi-select `Besoins dominants` (6 valeurs)

- Certitude
- Variété
- Signifiance
- Connexion
- Croissance
- Contribution

## Variables d'environnement Avatar (optionnelles)

Si tu crées une fiche avatar par verdict dans Notion, ajoute la variable d'env correspondante. Manquante = pas de relation `Avatar rattaché` posée.

```
NOTION_AVATAR_ANCRE_ID
NOTION_AVATAR_COINCE_ID
NOTION_AVATAR_EXPLORATEUR_ID
NOTION_AVATAR_DISPERSE_ID
NOTION_AVATAR_RECONNU_ID
NOTION_AVATAR_EGOIQUE_ID
NOTION_AVATAR_CONNECTE_ID
NOTION_AVATAR_LOYAL_ID
NOTION_AVATAR_EXPANSION_ID
NOTION_AVATAR_EPUISE_ID
NOTION_AVATAR_SERVICE_ID
NOTION_AVATAR_PERDU_ID
NOTION_AVATAR_TRANSITION_ID
NOTION_AVATAR_SUSPENDU_ID
```

## Options du Multi-select `Modifiers` (8 valeurs, inchangé)

- Angle Mort Financier
- Angle Mort Statut
- Épuisement Silencieux
- Ennui Masqué
- Contribution Vide
- Isolement Créatif
- Leader Accidentel
- Vision Floue
