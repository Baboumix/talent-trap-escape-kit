"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LangSwitch } from "@/components/LangSwitch";
import { computeZone, getSourceFromQuery } from "@/lib/sources";
import {
  SOURCES_EN,
  ZONE_DOORS_EN,
  ZONE_LABELS_EN,
} from "@/lib/sources.en";
import type { LightAnswers, QuadrantZone, SourceKey } from "@/lib/types";

const STORAGE_KEY_LIGHT = "ptc-light-v1";

export default function LightResultPageWrapperEn() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LightResultPageEn />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <main className="min-h-[100svh] flex items-center justify-center">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
        Loading…
      </p>
    </main>
  );
}

function LightResultPageEn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<LightAnswers | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LIGHT);
      if (!raw) {
        const querySource = getSourceFromQuery(searchParams.get("source"));
        router.replace(`/en/light?source=${querySource}`);
        return;
      }
      const parsed = JSON.parse(raw) as LightAnswers;
      if (typeof parsed.q0 !== "number" || typeof parsed.q0b !== "number") {
        const querySource = getSourceFromQuery(searchParams.get("source"));
        router.replace(`/en/light?source=${querySource}`);
        return;
      }
      setAnswers(parsed);
      setHydrated(true);
    } catch {
      const querySource = getSourceFromQuery(searchParams.get("source"));
      router.replace(`/en/light?source=${querySource}`);
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => setRevealed(true), 800);
    return () => clearTimeout(t);
  }, [hydrated]);

  const result = useMemo(() => {
    if (!answers) return null;
    const zone = computeZone(answers.source, answers.q0, answers.q0b);
    const config = SOURCES_EN[answers.source];
    return { zone, config };
  }, [answers]);

  if (!hydrated || !answers || !result || !revealed) {
    return <RevealLoader />;
  }

  return (
    <main className="relative min-h-[100svh] flex flex-col px-6 py-8 overflow-hidden">
      <LangSwitch
        current="en"
        frHref={`/light/resultat?source=${answers.source}`}
        enHref={`/en/light/resultat?source=${answers.source}`}
      />

      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-coral/[0.18] blur-[140px]" />
      </div>

      <header
        className="flex justify-center mb-8 animate-fade-up"
        style={{ animationDelay: "0ms" }}
      >
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/40 rounded-full bg-coral/[0.08]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Preliminary result
        </p>
      </header>

      <section
        className="max-w-xl mx-auto w-full text-center animate-fade-up"
        style={{ animationDelay: "150ms" }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-3">
          You are probably in the
        </p>
        <h1 className="font-display font-semibold leading-[1.0] tracking-tight text-[58px] sm:text-[88px] md:text-[112px] bg-gradient-to-r from-coral-500 to-coral-400 bg-clip-text text-transparent pb-2">
          {ZONE_LABELS_EN[result.zone]}
        </h1>
        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          Recommended door · {ZONE_DOORS_EN[result.zone]}
        </p>
      </section>

      <section
        className="mt-12 max-w-md mx-auto w-full animate-fade-up"
        style={{ animationDelay: "300ms" }}
      >
        <Quadrant zone={result.zone} />
      </section>

      <section
        className="mt-10 max-w-xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "450ms" }}
      >
        <p className="font-display italic font-medium text-lg md:text-xl text-center text-ink leading-relaxed">
          “{result.config.insightByZone[result.zone]}”
        </p>
      </section>

      <section
        className="mt-10 max-w-xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "600ms" }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-4 text-center">
          Here is what you haven't seen yet
        </p>
        <div className="flex flex-col gap-2">
          <LockedRow label="Your main blind spot" />
          <LockedRow label="Your 3 concrete actions for the next 30 days" />
          <LockedRow label="The detailed answers to your 4 real questions" />
        </div>
      </section>

      <section
        className="mt-10 max-w-xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "750ms" }}
      >
        <div className="rounded-2xl border border-coral/30 bg-coral/[0.06] p-6 md:p-7 text-center shadow-sm">
          <p className="text-neutral-700 text-sm leading-relaxed mb-5">
            The full diagnostic gives you{" "}
            <strong className="text-ink">everything</strong>, with a{" "}
            <strong className="text-ink">PDF to keep</strong>. 5 more minutes,
            by email, free. (Full diagnostic in French for now.)
          </p>
          <Link
            href={`/diagnostic?source=${answers.source}`}
            className="group inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/30 active:scale-[0.99] transition-transform"
          >
            Unlock my PDF diagnostic
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
          <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            By email · free · no credit card
          </p>
        </div>
      </section>

      <section
        className="mt-10 max-w-xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "900ms" }}
      >
        <ShareBlock zone={result.zone} source={answers.source} />
      </section>

      <footer
        className="mt-12 mb-4 flex flex-col items-center gap-3 text-center animate-fade-up"
        style={{ animationDelay: "1050ms" }}
      >
        <Link
          href="/en"
          className="text-[10px] uppercase tracking-[0.2em] text-coral hover:text-coral-400 transition-colors"
        >
          ← Try another quick test
        </Link>
        <Link
          href={`/en/light?source=${answers.source}`}
          className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-ink transition-colors"
        >
          Retake this test
        </Link>
      </footer>
    </main>
  );
}

function LockedRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-line bg-surface shadow-sm">
      <span
        className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-cream text-neutral-500 border border-line"
        aria-hidden="true"
      >
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
          <path
            d="M5 7V5a3 3 0 016 0v2m-7 0h8a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p className="flex-1 text-sm text-neutral-700 leading-snug">{label}</p>
    </div>
  );
}

const ZONE_COLOR_CLASSES: Record<
  QuadrantZone,
  { active: string; idle: string }
> = {
  "pleine-expansion": {
    active:
      "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/20 scale-[1.02]",
    idle: "border-emerald-200 bg-emerald-50/40 text-emerald-700/60",
  },
  "reveil-possible": {
    active:
      "border-amber-500 bg-amber-50 text-amber-700 shadow-md shadow-amber-500/20 scale-[1.02]",
    idle: "border-amber-200 bg-amber-50/40 text-amber-700/60",
  },
  "depart-imminent": {
    active:
      "border-amber-500 bg-amber-50 text-amber-700 shadow-md shadow-amber-500/20 scale-[1.02]",
    idle: "border-amber-200 bg-amber-50/40 text-amber-700/60",
  },
  "urgence-absolue": {
    active:
      "border-coral bg-coral/10 text-coral shadow-md shadow-coral/30 scale-[1.02]",
    idle: "border-coral/20 bg-coral/[0.04] text-coral/60",
  },
};

function Quadrant({ zone }: { zone: QuadrantZone }) {
  const cells: QuadrantZone[] = [
    "depart-imminent",
    "pleine-expansion",
    "urgence-absolue",
    "reveil-possible",
  ];
  return (
    <div className="relative w-full">
      <div className="flex justify-between mb-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
        <span>Rigged Field</span>
        <span>Loyal Field</span>
      </div>
      <div className="flex">
        <div className="flex flex-col justify-between pr-3 py-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500 text-right">
          <span>
            Talent
            <br />
            Expressed
          </span>
          <span>
            Talent
            <br />
            Held back
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {cells.map((key) => {
            const isActive = key === zone;
            const colors = ZONE_COLOR_CLASSES[key];
            return (
              <div
                key={key}
                className={`aspect-[5/3] rounded-lg flex items-center justify-center text-center px-3 py-2 border transition-all ${
                  isActive ? colors.active : colors.idle
                }`}
              >
                <p className="text-xs font-semibold leading-tight">
                  {ZONE_LABELS_EN[key]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ShareBlock(_props: { zone: QuadrantZone; source: SourceKey }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span
        className="text-3xl mb-3 leading-none"
        aria-hidden="true"
        role="img"
      >
        📸
      </span>
      <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
        A screenshot is enough to share it with someone.
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-neutral-400">
        talent.monexpansion.com
      </p>
    </div>
  );
}

function RevealLoader() {
  return (
    <main className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-coral/[0.18] blur-[120px] animate-pulse" />
      </div>
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:200ms]" />
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:400ms]" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
        Calculating
      </p>
    </main>
  );
}
