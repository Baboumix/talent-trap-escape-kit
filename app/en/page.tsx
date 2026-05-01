import Link from "next/link";
import { LangSwitch } from "@/components/LangSwitch";

export const metadata = {
  title: "Talent Test · monExpansion",
  description:
    "A free 5-minute diagnostic. A score out of 10. And the 6 essential needs that drive it. English version coming soon.",
};

export default function EnLanding() {
  return (
    <main className="relative min-h-[100svh] flex flex-col justify-between px-6 py-8 overflow-hidden">
      <LangSwitch current="en" />

      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-coral/[0.12] blur-[120px]" />
      </div>

      <header className="flex justify-center pt-2">
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/30 rounded-full bg-coral/[0.04]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Activate your expansion
        </p>
      </header>

      <section className="flex-1 flex flex-col justify-center items-center text-center max-w-2xl mx-auto w-full">
        <h1 className="font-display font-medium text-[56px] sm:text-7xl md:text-[96px] lg:text-[112px] leading-[0.92] tracking-tight mb-8">
          <span className="block text-white">Your talent.</span>
          <span className="block bg-gradient-to-r from-coral-500 to-coral-400 bg-clip-text text-transparent">
            Activated?
          </span>
        </h1>
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-sm mb-6">
          A score out of 10. And the 6 essential needs that drive it.
        </p>
        <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
          The English version of the diagnostic is launching soon. In the
          meantime, the French version is live and the analysis engine is the
          same, so if you read French comfortably you can take it now.
        </p>
      </section>

      <footer className="w-full max-w-md mx-auto">
        <Link
          href="/"
          className="group flex items-center justify-center w-full py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/20 active:scale-[0.99] transition-transform"
        >
          Take the diagnostic in French
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
        <p className="mt-5 text-[11px] text-neutral-600 text-center tracking-wide">
          monexpansion.com
        </p>
      </footer>
    </main>
  );
}
