import Link from "next/link";
import { LangSwitch } from "@/components/LangSwitch";

export const metadata = {
  title: "Talent Test · monExpansion",
  description:
    "4 quick tests. 1 minute each. No email. See where you stand. (Tests run in French for now.)",
};

const MENU = [
  {
    key: "talent",
    name: "The Talent Test",
    question: "Are you really using your capacities at work?",
    value: "See in 1 minute if your talent flows or leaks.",
    theme: {
      border: "border-coral/30 hover:border-coral/60",
      bg: "bg-coral/[0.04] hover:bg-coral/[0.08]",
      accent: "text-coral",
    },
  },
  {
    key: "keeper",
    name: "The Keeper Test",
    question: "Would your boss fight to keep you?",
    value: "Discover the real place you hold for your boss.",
    theme: {
      border: "border-emerald-300 hover:border-emerald-500",
      bg: "bg-emerald-50 hover:bg-emerald-100/70",
      accent: "text-emerald-700",
    },
  },
  {
    key: "fraud",
    name: "The Fraud Test",
    question: "How much do you feel like a fraud in your role?",
    value: "Measure your imposter syndrome and what it hides.",
    theme: {
      border: "border-violet-300 hover:border-violet-500",
      bg: "bg-violet-50 hover:bg-violet-100/70",
      accent: "text-violet-700",
    },
  },
  {
    key: "ai",
    name: "The Replacement Test",
    question: "Will your job be replaced by AI within 24 months?",
    value: "Estimate your AI risk against objective data.",
    theme: {
      border: "border-sky-300 hover:border-sky-500",
      bg: "bg-sky-50 hover:bg-sky-100/70",
      accent: "text-sky-700",
    },
  },
];

export default function EnLanding() {
  return (
    <main className="relative min-h-[100svh] flex flex-col px-6 py-8 overflow-hidden">
      <LangSwitch current="en" />

      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-coral/[0.18] blur-[140px]" />
      </div>

      <header className="flex justify-center pt-2 mb-10">
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/40 rounded-full bg-coral/[0.08]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Activate your expansion
        </p>
      </header>

      <section className="text-center max-w-xl mx-auto w-full mb-10 animate-fade-up">
        <p className="font-display font-medium text-[28px] sm:text-3xl md:text-4xl leading-tight mb-3 text-ink">
          Pick your angle.
        </p>
        <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-md mx-auto">
          4 quick tests. 1 minute each. No email. You see where you stand
          immediately. (Tests run in French for now.)
        </p>
      </section>

      <section className="flex flex-col gap-3 max-w-xl mx-auto w-full">
        {MENU.map((m, i) => (
          <Link
            key={m.key}
            href={`/light?source=${m.key}`}
            className={`group block rounded-2xl border p-5 transition-all active:scale-[0.995] animate-fade-up ${m.theme.border} ${m.theme.bg}`}
            style={{ animationDelay: `${150 + i * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <p
                className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${m.theme.accent}`}
              >
                {m.name}
              </p>
            </div>
            <p className="font-display font-medium text-lg md:text-xl leading-snug text-ink mb-2">
              {m.question}
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed mb-3">
              {m.value}
            </p>
            <p
              className={`inline-flex items-center text-sm font-semibold ${m.theme.accent}`}
            >
              Take the test
              <svg
                className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-0.5"
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
            </p>
          </Link>
        ))}
      </section>

      <section
        className="max-w-xl mx-auto w-full mt-10 animate-fade-up"
        style={{ animationDelay: "550ms" }}
      >
        <div className="rounded-2xl border border-line bg-surface shadow-sm p-5 text-center">
          <p className="text-sm text-neutral-700 leading-relaxed mb-4">
            Want <strong className="text-ink">all 4 answers</strong> and a full
            diagnostic by email?
          </p>
          <Link
            href="/diagnostic"
            className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-lg shadow-coral/30 active:scale-[0.99] transition-transform"
          >
            Full diagnostic · 5 minutes
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
        </div>
      </section>

      <footer className="w-full max-w-md mx-auto mt-10 mb-2">
        <p className="text-[11px] text-neutral-500 text-center tracking-wide">
          monexpansion.com
        </p>
        <p className="mt-2 text-[10px] text-neutral-400 text-center tracking-wide">
          <Link
            href="/mentions-legales"
            className="hover:text-neutral-700 transition-colors"
          >
            Legal
          </Link>
          <span className="mx-2">·</span>
          <Link
            href="/confidentialite"
            className="hover:text-neutral-700 transition-colors"
          >
            Privacy
          </Link>
        </p>
      </footer>
    </main>
  );
}
