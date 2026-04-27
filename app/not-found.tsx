import Link from "next/link";

export const metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas ou plus.",
};

export default function NotFound() {
  return (
    <main className="relative min-h-[100svh] flex flex-col justify-between px-6 py-8 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-coral/[0.12] blur-[120px]" />
      </div>

      <header className="flex justify-center pt-2">
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/30 rounded-full bg-coral/[0.04]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Page introuvable
        </p>
      </header>

      <section className="flex-1 flex flex-col justify-center items-center text-center max-w-xl mx-auto w-full">
        <h1 className="font-display font-medium text-[64px] sm:text-7xl md:text-[96px] leading-[0.95] tracking-tight mb-6">
          <span className="block text-white">Tu es</span>
          <span className="block bg-gradient-to-r from-coral-500 to-coral-400 bg-clip-text text-transparent">
            perdu&nbsp;?
          </span>
        </h1>
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-md">
          Cette page n'existe pas, ou n'existe plus. C'est l'occasion de
          repartir d'un endroit clair.
        </p>
      </section>

      <footer className="w-full max-w-md mx-auto flex flex-col gap-3">
        <Link
          href="/diagnostic"
          className="group flex items-center justify-center w-full py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/20 active:scale-[0.99] transition-transform"
        >
          Faire le diagnostic
          <svg
            className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <Link
          href="/"
          className="text-center text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-300 transition-colors py-3"
        >
          Retour à l'accueil
        </Link>
      </footer>
    </main>
  );
}
