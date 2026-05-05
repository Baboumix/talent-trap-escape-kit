import Link from "next/link";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales du diagnostic Profil du Talent Coincé.",
};

export default function MentionsLegales() {
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
        <h1 className="font-display font-medium text-4xl md:text-5xl tracking-tight mb-8 text-ink">
          Mentions légales
        </h1>

        <section className="space-y-6 text-neutral-400 leading-relaxed">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Éditeur du site
            </h2>
            <p>
              Julien Klein, exerçant sous le nom commercial{" "}
              <strong className="text-ink">monExpansion</strong>.
              <br />
              Contact : julien@monexpansion.com
              <br />
              Site : monexpansion.com
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Hébergement
            </h2>
            <p>
              Le diagnostic talent.monexpansion.com est hébergé par{" "}
              <strong className="text-ink">Vercel Inc.</strong>
              <br />
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
              <br />
              vercel.com
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des contenus du site (textes, code, illustrations,
              logos, structure du diagnostic) est la propriété exclusive de
              Julien Klein / monExpansion. Toute reproduction sans autorisation
              écrite préalable est interdite.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Responsabilité
            </h2>
            <p>
              Le diagnostic est un outil d'auto-réflexion. Il ne remplace ni un
              accompagnement professionnel, ni un avis médical ou
              psychologique. Julien Klein / monExpansion ne saurait être tenu
              responsable des décisions prises sur la base des résultats du
              diagnostic.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-2">
              Données personnelles
            </h2>
            <p>
              Pour la collecte et le traitement de tes données personnelles,
              consulte notre{" "}
              <Link
                href="/confidentialite"
                className="text-coral hover:underline"
              >
                politique de confidentialité
              </Link>
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
