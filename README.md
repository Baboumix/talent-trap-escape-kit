# Profil du Talent Coincé

Diagnostic gratuit 5 minutes · lead magnet pour monExpansion · Bootcamp Expansion.

- **Prod :** https://kit.monexpansion.com
- **Source de vérité du contenu éditorial :** Notion → page `ℹ️ Profil du Talent Coincé`

## Stack

- Next.js 14 (App Router) + TypeScript strict
- Tailwind CSS (tokens : `ink` #0A0A0A, `coral` FE6B63 → FF8A54, fonts Fraunces + DM Sans)
- Notion API (`@notionhq/client`) : fiche diagnostic + relation Avatar
- Brevo REST API : contact, liste FR/EN, email transactionnel J0

## Flow

1. `/` : splash screen (hook + CTA)
2. `/diagnostic` : 1 étape `StatutStep` (salarié / freelance / patron-manager), puis 24 questions interleavées Ancrage/Circulation/Sens
3. `/diagnostic/resultat` : verdict + 3 scores + angle mort (lit localStorage)
4. `/diagnostic/infos` : capture prénom / email / métier → POST `/api/submit-diagnostic`
5. `/diagnostic/merci` : confirmation

## Scoring

Pure fonctions dans `lib/scoring.ts`. Tests témoins `npm run test:scoring`.

## Déploiement

```bash
vercel --prod --yes
```

16 variables d'environnement sont gérées via `vercel env`. Voir `.env.example`.

## Intégrations

- **Notion Diagnostics** (`DB_ID=552eee8e…`) : chaque soumission crée une fiche, mappe le verdict à un avatar via `NOTION_AVATAR_*_ID`.
- **Brevo** : contact upserté sur la liste FR (11) ou EN (12), attributs custom (PRENOM, VERDICT, MODIFIERS, METIER, STATUT_PRO, LANG), tag `diagnostic_fait` sur l'email transactionnel. Les séquences J+2/J+4/… sont à configurer côté Brevo via automation sur ce tag ou sur la liste.

## Historique

- Tag `v1-escape-kit` : ancien produit Escape Kit (Vite + React) avant refonte.
- Branche `main` : Profil du Talent Coincé (Next.js).
