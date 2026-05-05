"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LangSwitch } from "@/components/LangSwitch";
import { SOURCES, SOURCE_MENU_ORDER } from "@/lib/sources";
import { analytics, diagnosticTimer } from "@/lib/analytics";
import { playClickTick } from "@/lib/feedback";
import type { SourceKey } from "@/lib/types";

const STORAGE_KEY_LIGHT_DONE = "ptc-light-completed-sources-v1";

export default function LandingPage() {
  const [doneSources, setDoneSources] = useState<SourceKey[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LIGHT_DONE);
      if (raw) {
        const list = JSON.parse(raw) as SourceKey[];
        if (Array.isArray(list)) setDoneSources(list);
      }
    } catch {
      // ignore
    }
  }, []);

  const onLightClick = (_source: SourceKey) => {
    playClickTick();
    diagnosticTimer.start();
    analytics.diagnosticStarted("landing_hero_cta");
  };

  const onDiagnosticClick = () => {
    playClickTick();
    diagnosticTimer.start();
    analytics.diagnosticStarted("landing_secondary_cta");
  };

  return (
    <main className="relative min-h-[100svh] flex flex-col px-6 py-8 overflow-hidden">
      <LangSwitch current="fr" />

      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-coral/[0.18] blur-[140px]" />
      </div>

      <header className="flex justify-center pt-2 mb-10">
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/40 rounded-full bg-coral/[0.08]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Active ton expansion
        </p>
      </header>

      <section className="text-center max-w-xl mx-auto w-full mb-10 animate-fade-up">
        <p className="font-display font-medium text-[28px] sm:text-3xl md:text-4xl leading-tight mb-3 text-ink">
          Choisis ton angle.
        </p>
        <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-md mx-auto">
          4 tests rapides. 1 minute chacun. Sans email. Tu vois immédiatement
          où tu en es.
        </p>
      </section>

      <section className="flex flex-col gap-3 max-w-xl mx-auto w-full">
        {SOURCE_MENU_ORDER.map((key, i) => {
          const cfg = SOURCES[key];
          const done = doneSources.includes(key);
          return (
            <Link
              key={key}
              href={`/light?source=${key}`}
              onClick={() => onLightClick(key)}
              className={`group block rounded-2xl border p-5 transition-all active:scale-[0.995] animate-fade-up ${cfg.menuTheme.border} ${cfg.menuTheme.bg}`}
              style={{ animationDelay: `${150 + i * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <p
                  className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${cfg.menuTheme.accent}`}
                >
                  {cfg.menuName}
                </p>
                {done && (
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 rounded-full bg-white/70 ${cfg.menuTheme.accent}`}
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="w-3 h-3"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8l3.5 3.5L13 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Déjà fait
                  </span>
                )}
              </div>
              <p className="font-display font-medium text-lg md:text-xl leading-snug text-ink mb-2">
                {cfg.menuQuestion}
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                {cfg.menuValue}
              </p>
              <p
                className={`inline-flex items-center text-sm font-semibold ${cfg.menuTheme.accent}`}
              >
                {done ? "Voir mon résultat" : "Faire le test"}
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
          );
        })}
      </section>

      <section
        className="max-w-xl mx-auto w-full mt-10 animate-fade-up"
        style={{ animationDelay: "550ms" }}
      >
        <div className="rounded-2xl border border-line bg-surface shadow-sm p-5 text-center">
          <p className="text-sm text-neutral-700 leading-relaxed mb-4">
            Tu veux <strong className="text-ink">les 4 réponses</strong>, un
            diagnostic complet et un <strong className="text-ink">PDF</strong>
            {" "}par email ?
          </p>
          <Link
            href="/diagnostic"
            onClick={onDiagnosticClick}
            className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-lg shadow-coral/30 active:scale-[0.99] transition-transform"
          >
            Diagnostic PDF · 5 minutes
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
            Mentions légales
          </Link>
          <span className="mx-2">·</span>
          <Link
            href="/confidentialite"
            className="hover:text-neutral-700 transition-colors"
          >
            Confidentialité
          </Link>
        </p>
      </footer>
    </main>
  );
}
