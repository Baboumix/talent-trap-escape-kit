"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Q0C,
  SOURCES,
  computeZone,
  getSourceFromQuery,
} from "@/lib/sources";
import { playClickTick } from "@/lib/feedback";
import type { LightAnswers, SourceKey } from "@/lib/types";

const STORAGE_KEY_LIGHT = "ptc-light-v1";

export default function LightPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LightPage />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <main className="min-h-[100svh] flex items-center justify-center">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
        Chargement…
      </p>
    </main>
  );
}

function LightPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source: SourceKey = useMemo(
    () => getSourceFromQuery(searchParams.get("source")),
    [searchParams],
  );
  const config = SOURCES[source];

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0); // 0 = Q0, 1 = Q0b, 2 = Q0c
  const [q0, setQ0] = useState<number | null>(null);
  const [q0b, setQ0b] = useState<number | null>(null);
  const [q0c, setQ0c] = useState<number | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  const currentQ = step === 0 ? config.q0 : step === 1 ? config.q0b : Q0C;
  const currentValue =
    step === 0 ? q0 : step === 1 ? q0b : q0c;
  const setCurrentValue =
    step === 0 ? setQ0 : step === 1 ? setQ0b : setQ0c;

  const onContinue = () => {
    if (currentValue === null) return;
    playClickTick();
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    // All answered: store + redirect to /light/resultat
    const answers: LightAnswers = {
      source,
      q0: q0!,
      q0b: q0b!,
      q0c: q0c!,
    };
    try {
      localStorage.setItem(STORAGE_KEY_LIGHT, JSON.stringify(answers));
    } catch {
      // ignore
    }
    router.push(`/light/resultat?source=${source}`);
  };

  const onBack = () => {
    if (step === 0) {
      router.push("/");
      return;
    }
    setStep(step - 1);
  };

  if (!hydrated) return <LoadingFallback />;

  return (
    <main className="relative min-h-[100svh] flex flex-col">
      {/* Sticky header with progress */}
      <div className="sticky top-0 z-10 bg-ink/90 backdrop-blur-sm">
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-coral-500 to-coral-400 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-neutral-400 hover:text-white hover:border-white/40 transition-colors"
            aria-label={step === 0 ? "Retour à l'accueil" : "Question précédente"}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 3l-5 5 5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <p className="text-[10px] uppercase tracking-[0.2em] text-coral">
            {step + 1} / {totalSteps}
          </p>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            Quitter
          </Link>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-xl mx-auto w-full">
        <p
          className="text-[10px] uppercase tracking-[0.22em] text-coral mb-6 text-center animate-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          {config.pillLabel}
        </p>

        <p
          key={`q-${step}`}
          className="font-display font-medium text-[26px] sm:text-3xl md:text-[36px] leading-[1.25] text-center mb-12 animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          {currentQ.text}
        </p>

        <SliderInput
          value={currentValue}
          onChange={setCurrentValue}
          lowLabel={currentQ.lowLabel}
          highLabel={currentQ.highLabel}
        />

        <div className="mt-12 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <button
            type="button"
            onClick={onContinue}
            disabled={currentValue === null}
            className="group flex items-center justify-center w-full py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/20 active:scale-[0.99] transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step === 2 ? "Voir mon résultat" : "Continuer"}
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
          </button>
        </div>
      </div>

      <footer className="px-6 pb-6 pt-2 text-center">
        <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          Test rapide gratuit · 1 minute · sans email
        </p>
      </footer>
    </main>
  );
}

function SliderInput({
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  value: number | null;
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="flex flex-col gap-5">
      {/* Big value display */}
      <div className="text-center">
        <p
          className={`font-display font-semibold text-[80px] sm:text-[110px] leading-none tracking-tight transition-colors ${
            value === null ? "text-neutral-700" : "text-coral"
          }`}
        >
          {value === null ? "?" : value}
          <span className="text-[36px] sm:text-[48px] text-neutral-500 font-normal align-top ml-1">
            /10
          </span>
        </p>
      </div>

      {/* Grid of 10 large tap targets (mobile-first) */}
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {numbers.map((n) => {
          const isSelected = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${n} sur 10`}
              aria-pressed={isSelected}
              className={`h-12 sm:h-14 rounded-lg border text-sm sm:text-base font-semibold tabular-nums transition-all active:scale-95 ${
                isSelected
                  ? "border-coral bg-coral text-white shadow-lg shadow-coral/30"
                  : "border-white/15 bg-white/[0.03] text-neutral-300 hover:border-coral/40 hover:bg-coral/[0.06]"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* End labels */}
      <div className="flex justify-between text-xs text-neutral-500 px-1">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
