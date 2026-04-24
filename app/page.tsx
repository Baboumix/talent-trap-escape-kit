import Link from "next/link";
import { LangSwitch } from "@/components/LangSwitch";

export default function LandingPage() {
  return (
    <main className="relative min-h-[100svh] flex flex-col justify-between px-6 py-8 overflow-hidden">
      <LangSwitch current="fr" />

      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-coral/[0.12] blur-[120px]" />
      </div>

      <header className="flex justify-center pt-2">
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/30 rounded-full bg-coral/[0.04]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Profil du Talent Coincé
        </p>
      </header>

      <section className="flex-1 flex flex-col justify-center items-center text-center max-w-2xl mx-auto w-full">
        <h1 className="font-display font-medium text-[56px] sm:text-7xl md:text-[96px] lg:text-[112px] leading-[0.92] tracking-tight mb-8">
          <span className="block text-white">Ton talent te porte.</span>
          <span className="block bg-gradient-to-r from-coral-500 to-coral-400 bg-clip-text text-transparent">
            Ou il te retient&nbsp;?
          </span>
        </h1>
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-sm">
          Un verdict précis qui nomme ce que tu n'arrivais pas à nommer.
        </p>
      </section>

      <footer className="w-full max-w-md mx-auto">
        <Link
          href="/diagnostic"
          className="group flex items-center justify-center w-full py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/20 active:scale-[0.99] transition-transform"
        >
          Démarrer le diagnostic
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

        <div className="mt-5 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
          <span>24 questions</span>
          <span
            className="w-1 h-1 rounded-full bg-neutral-700"
            aria-hidden="true"
          />
          <span>5 minutes</span>
          <span
            className="w-1 h-1 rounded-full bg-neutral-700"
            aria-hidden="true"
          />
          <span>Gratuit</span>
        </div>

        <p className="mt-6 text-[11px] text-neutral-600 text-center leading-relaxed">
          Julien Klein · 15 ans chez Scanline/Netflix · 120+ artistes coachés
        </p>
      </footer>
    </main>
  );
}
