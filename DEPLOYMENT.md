# Déploiement — kit.monexpansion.com

## ✅ Pré-requis (actions de Julien)

### 1. Sauvegarder les images du livre

Enregistrer les 2 couvers du livre dans `/public/` :
- `public/book-fr.png` — "Tout le monde pense que tu as réussi. Sauf toi."
- `public/book-en.png` — "Everyone thinks you've made it. Except you."

Format recommandé : PNG transparent, 400-600px de large.

### 2. Créer une image Open Graph

Créer une image OG de 1200x630px pour les partages sociaux :
- Sauvegarder dans `public/og-image.png`
- Contenu : titre "Ton talent te propulse ou te piège ?" + branding

### 3. Obtenir un ID Google Analytics 4

1. Aller sur https://analytics.google.com
2. Créer une propriété GA4 pour `kit.monexpansion.com`
3. Récupérer le Measurement ID (format `G-XXXXXXXXXX`)

### 4. Vérifier Brevo

- **Sender email** : `julien@monexpansion.com` doit être validé
  → Brevo → Senders, Domains & IP → Senders
- **Domain** : configurer SPF/DKIM sur `monexpansion.com`
  → Brevo → Senders, Domains & IP → Domains → Add domain
- **Liste** : vérifier que le List ID `2` correspond à "Escape Kit"
  → Brevo → Contacts → Lists

---

## 🚀 Déploiement Vercel

### 1. Pousser sur GitHub

```bash
cd /Users/babs/talent-trap-escape-kit
git remote add origin <url-du-repo>  # si pas déjà fait
git push -u origin main
```

### 2. Connecter à Vercel

1. Aller sur https://vercel.com
2. "Add New Project" → Import depuis GitHub
3. Sélectionner le repo `talent-trap-escape-kit`
4. **Framework Preset** : Vite (auto-detecté)
5. **Environment Variables** : ajouter
   - `BREVO_API_KEY` = ta clé Brevo
   - `VITE_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX` (depuis étape 3)
6. "Deploy"

### 3. Configurer le domaine custom

Dans Vercel → Project → Settings → Domains :
1. Add Domain → `kit.monexpansion.com`
2. Vercel affiche un CNAME record à configurer

Chez le registrar de `monexpansion.com` (OVH, Gandi, etc.) :
```
Type:  CNAME
Name:  kit
Value: cname.vercel-dns.com
```

Attendre la propagation (5-60 min). HTTPS automatique.

### 4. Tester en production

Visiter `https://kit.monexpansion.com` et faire le flow complet :
- [ ] Module 1 → email gate avec un vrai email
- [ ] Vérifier réception email Module 1 (inbox + spam)
- [ ] Vérifier contact créé dans Brevo avec tags `kit-module1`
- [ ] Module 2 → vérifier email reçu avec score/gaps
- [ ] Module 3 → vérifier email récap complet
- [ ] Voir Profil Complet (page Results)
- [ ] Tester en EN

---

## 📊 Analytics

### Vérifier GA4 remonte les événements

1. Ouvrir https://analytics.google.com
2. Propriété → Reports → Realtime
3. Faire des actions sur l'app → vérifier que les events apparaissent :
   - `page_view` (avec `screen_name`)
   - `module_started`
   - `module_completed`
   - `email_submitted`
   - `language_changed`

### Events custom à suivre

| Event | Paramètres | Ce qu'il mesure |
|-------|------------|-----------------|
| `page_view` | screen_name, lang | Funnel d'écrans |
| `module_started` | module_num | Taux d'abandon entre modules |
| `module_completed` | module_num, score, verdict, archetype | Distribution des résultats |
| `email_submitted` | module_num, lang | Conversion email gate |
| `cta_click` | destination | Clics vers Escape Lab / Now / Livre |
| `language_changed` | from, to | Usage FR vs EN |

---

## 🔗 Intégration WordPress

Sur `monexpansion.com` (Elementor), ajouter des liens vers `kit.monexpansion.com` :

### Page `/escape-kit`
CTA "Commencer le diagnostic" → `https://kit.monexpansion.com?utm_source=wordpress&utm_medium=escape_kit_page`

### Page `/livre`
CTA "Fais le diagnostic" → `https://kit.monexpansion.com?utm_source=wordpress&utm_medium=book_page`

### Pied de page
Lien discret "Fais ton check-up" → `https://kit.monexpansion.com?utm_source=wordpress&utm_medium=footer`

### LinkedIn
`https://kit.monexpansion.com?utm_source=linkedin&utm_medium=post`

---

## 🐛 Debug en production

### Les emails n'arrivent pas
1. Check Brevo → Transactional → Statistics → recent emails
2. Check dossier spam
3. Vérifier SPF/DKIM (https://mxtoolbox.com/spf.aspx)
4. Check Vercel logs : `vercel logs --follow`

### GA4 ne remonte pas d'events
1. Vérifier `VITE_GA_MEASUREMENT_ID` dans Vercel env vars
2. Vérifier qu'on a rebuild après ajout de la var (Vercel auto-redeploy)
3. Dans la console browser : `window.dataLayer` doit exister
4. Utiliser l'extension Chrome "Google Analytics Debugger"

### L'API Brevo renvoie 401
- La clé a peut-être été régénérée dans Brevo
- Re-vérifier `BREVO_API_KEY` dans Vercel env vars
- Redéployer manuellement

---

## 📦 Ce qui est inclus dans le lancement

- 3 modules (Le Miroir, La Carte, La Boussole)
- Email gate avec sauvegarde de progression
- Page Results riche combinée (3 modules)
- 3 emails transactionnels automatiques
- Analytics GA4 + cookie banner RGPD
- Bilingue FR/EN
- Images du livre (à ajouter)
- Responsive mobile/tablet/desktop
- Persistance localStorage

## 📦 À faire après le lancement

- Tests utilisateurs (5-10 personnes)
- A/B test sur copy de l'email gate
- Automation Brevo "J+2 relance Module 2"
- Image OG personnalisée pour partage social
- Déploiement v2 avec améliorations
