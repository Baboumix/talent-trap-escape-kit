# Configuration Brevo — Sortir du piège

## 🔑 Ce qui est déjà configuré

- **Clé API Brevo** dans `.env` (`BREVO_API_KEY`)
- **List ID** : `2` (à vérifier dans ton compte Brevo)
- **Attributs contact** : `PRENOM`, `LANG`, `PROFILE`, `SCORE`, `VERDICT`, `SIGNAL_COUNT`, `TENSION_PROFILE`, `ARCHETYPE`, `KIT_COMPLETE`
- **Tags** : `kit-module1`, `kit-module2`, `kit-module3`, `kit-complete`

## 📧 Emails transactionnels

L'API `/api/send-result-email` envoie 3 emails différents selon le module complété, tous en HTML responsive avec fond blanc et branding monExpansion. Les templates sont **dans le code** (`api/send-result-email.js`) — tu n'as rien à configurer dans Brevo.

### Aperçu des 3 emails

| Module | Sujet FR | Contenu |
|--------|----------|---------|
| **Module 1** | "Julien, ton profil de tension est prêt" | Profil de tension + Archétype + CTA Module 2 + Escape Lab + Escape Now |
| **Module 2** | "Julien, ta carte des besoins est prête" | Score + Gaps top 3 + CTA Module 3 + Escape Lab + Escape Now |
| **Module 3** | "Julien, ton profil d'expansion est complet" | Récap complet des 3 modules + Escape Lab + Escape Now |

### Email expéditeur
- **Nom** : `Julien Klein · monExpansion`
- **Email** : `julien@monexpansion.com`

⚠️ **Important** : Pour que les emails arrivent bien, tu dois vérifier dans Brevo que `julien@monexpansion.com` est **autorisé comme expéditeur** :
1. Va dans Brevo → Senders, Domains & IP → Senders
2. Vérifie que `julien@monexpansion.com` existe et est validé
3. Si non, ajoute-le et valide via l'email de confirmation

Et idéalement configure SPF/DKIM sur ton domaine :
1. Brevo → Senders, Domains & IP → Domains
2. Add domain `monexpansion.com`
3. Ajoute les records DNS (SPF, DKIM) demandés

## 🎨 Personnalisation des emails

Les templates sont dans `/api/send-result-email.js` :
- `module1Email()` — lignes 22-100
- `module2Email()` — lignes 102-190
- `module3Email()` — lignes 192-300

Tu peux éditer directement les textes `t.title`, `t.intro`, `t.signature`, etc.

### Couleurs (fond blanc)
```js
const BRAND = {
  coral: "#FE6C63",
  coralLight: "#FF8A54",
  green: "#61CE70",
  textPrimary: "#0B0A0B",
  textSecondary: "#4a5568",
  textMuted: "#6b7280",
  bgLight: "#faf9f8",
  bgCard: "#f5f4f2",
  border: "#e5e5e5",
};
```

## ✅ Checklist avant production

- [ ] Vérifier le `BREVO_API_KEY` dans Vercel (Settings → Environment Variables)
- [ ] Tester l'envoi d'un email réel via le Module 1 (remplir ton propre email)
- [ ] Vérifier que le LIST_ID `2` correspond bien à ta liste "Escape Kit" dans Brevo
- [ ] Configurer SPF/DKIM sur `monexpansion.com` (sinon les emails partent en spam)
- [ ] Vérifier que les emails s'affichent correctement sur mobile (Gmail app, Apple Mail)
- [ ] Tester les 3 modules pour les 3 emails

## 🐛 Debug

Si un email n'arrive pas :
1. Check les logs Vercel (`vercel logs`)
2. Check le statut dans Brevo → Transactional → Statistics
3. Check le dossier spam de l'utilisateur
4. Vérifie que l'expéditeur est validé dans Brevo
