import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment monExpansion collecte, utilise et protège tes données dans le cadre du diagnostic Profil du Talent Coincé.",
};

export default function Confidentialite() {
  return (
    <main className="min-h-[100svh] flex flex-col px-6 py-10 max-w-2xl mx-auto">
      <header className="mb-10">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-coral transition-colors"
        >
          ← Retour à l'accueil
        </Link>
      </header>

      <article className="prose prose-invert max-w-none">
        <h1 className="font-display font-medium text-4xl md:text-5xl tracking-tight mb-4 text-ink">
          Politique de confidentialité
        </h1>
        <p className="text-sm text-neutral-500 mb-10 italic">
          Dernière mise à jour : avril 2026
        </p>

        <section className="space-y-7 text-neutral-400 leading-relaxed">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Quelles données on collecte
            </h2>
            <p>
              Quand tu fais le diagnostic puis demandes ton rapport, on
              collecte :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ton prénom</li>
              <li>Ton adresse email</li>
              <li>Ton métier (texte libre)</li>
              <li>
                Ton statut professionnel (salarié / freelance / patron-manager)
              </li>
              <li>Tes 24 réponses au diagnostic</li>
              <li>
                La langue choisie, la durée du test, et la source de visite
                (referrer)
              </li>
            </ul>
            <p className="mt-3">
              On ne te demande aucune donnée sensible (numéro de téléphone,
              adresse postale, données bancaires, données de santé). Aucune
              carte bancaire n'est demandée à aucun moment.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Pourquoi on collecte ces données
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Te générer ton rapport personnalisé et te l'envoyer par email
              </li>
              <li>
                T'envoyer occasionnellement des emails de suivi pertinents pour
                ton profil (séquence éditoriale, invitations)
              </li>
              <li>Améliorer le diagnostic via des statistiques anonymisées</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Avec qui on partage tes données
            </h2>
            <p>
              On utilise plusieurs sous-traitants pour faire fonctionner le
              diagnostic. Aucun ne revend tes données.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong className="text-ink">Brevo</strong> (ex-Sendinblue,
                France) : envoi de l'email de rapport et gestion de la liste de
                contacts.
              </li>
              <li>
                <strong className="text-ink">Notion</strong> (États-Unis) :
                stockage des fiches de diagnostic pour le suivi
                interne.
              </li>
              <li>
                <strong className="text-ink">Vercel</strong> (États-Unis) :
                hébergement du site.
              </li>
              <li>
                <strong className="text-ink">Google Analytics 4</strong>{" "}
                (États-Unis) via Google Tag Manager : statistiques de fréquentation
                anonymisées.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Combien de temps on les garde
            </h2>
            <p>
              Tes données restent dans nos systèmes tant que tu es abonné à
              nos communications. Si tu te désabonnes, ton email est supprimé
              de Brevo dans le mois qui suit, et la fiche Notion associée est
              archivée puis supprimée sous 12 mois.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Tes droits (RGPD)
            </h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données,
              tu as les droits suivants :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Accéder à tes données</li>
              <li>Les rectifier si elles sont incorrectes</li>
              <li>Demander leur suppression</li>
              <li>T'opposer au traitement</li>
              <li>Demander la portabilité de tes données</li>
              <li>Retirer ton consentement à tout moment</li>
            </ul>
            <p className="mt-3">
              Pour exercer un de ces droits, écris à{" "}
              <a
                href="mailto:julien@monexpansion.com"
                className="text-coral hover:underline"
              >
                julien@monexpansion.com
              </a>
              . On répond sous 30 jours maximum.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Cookies
            </h2>
            <p>
              kit.monexpansion.com utilise Google Tag Manager qui dépose des
              cookies pour Google Analytics 4 (mesure d'audience). Le
              consentement est géré au niveau de monexpansion.com via Complianz.
              Tu peux refuser ou retirer ton consentement à tout moment via les
              paramètres cookies de monexpansion.com.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Contact
            </h2>
            <p>
              Pour toute question relative à la protection de tes données,
              contacte Julien Klein à{" "}
              <a
                href="mailto:julien@monexpansion.com"
                className="text-coral hover:underline"
              >
                julien@monexpansion.com
              </a>
              .
            </p>
          </div>
        </section>
      </article>

      <footer className="mt-16 mb-8 text-center">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-500 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </footer>
    </main>
  );
}
