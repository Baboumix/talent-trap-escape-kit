import Link from "next/link";

export default function MerciPage() {
  return (
    <main className="relative min-h-[100svh] flex flex-col justify-between px-6 py-10 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-coral/[0.12] blur-[120px]" />
      </div>

      <header className="flex justify-center pt-2">
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/30 rounded-full bg-coral/[0.04]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Envoyé
        </p>
      </header>

      <section className="flex-1 flex flex-col justify-center items-center text-center max-w-md mx-auto w-full">
        <h1 className="font-display font-medium text-[34px] sm:text-4xl md:text-5xl leading-[1.05] tracking-tight mb-6">
          Ton rapport est en route.
        </h1>
        <p className="text-neutral-300 text-base leading-relaxed mb-2">
          Vérifie ton inbox dans quelques secondes.
        </p>
        <p className="text-neutral-500 text-sm leading-relaxed mb-10">
          (Le dossier spam aussi, on sait jamais.)
        </p>

        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-coral/30 bg-coral/[0.05]">
          <span className="font-display font-semibold text-coral text-2xl leading-none">
            1/3
          </span>
          <p className="text-xs text-neutral-300 text-left leading-snug max-w-[220px]">
            C'est la proportion qui va jusqu'au bout d'un diagnostic de cette
            longueur. Tu en fais partie.
          </p>
        </div>
      </section>

      <footer className="max-w-md mx-auto w-full">
        <Link
          href="https://www.monexpansion.com/bootcamp/"
          className="group flex items-center justify-center w-full py-4 rounded-full font-medium text-white border border-white/20 hover:border-white/40 transition-colors"
        >
          Voir le Bootcamp Expansion
        </Link>
        <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-neutral-600 text-center">
          Sur les prochains jours, tu recevras aussi des emails avec des cas
          concrets.
        </p>
      </footer>
    </main>
  );
}
