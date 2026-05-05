"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSourceFromQuery } from "@/lib/sources";
import { Q0C_EN, SOURCES_EN } from "@/lib/sources.en";
import { playClickTick } from "@/lib/feedback";
import type { LightAnswers, SourceKey } from "@/lib/types";

const STORAGE_KEY_LIGHT = "ptc-light-v1";
const STORAGE_KEY_LIGHT_DONE = "ptc-light-completed-sources-v1";

export default function LightPageWrapperEn() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LightPageEn />
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

function LightPageEn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source: SourceKey = useMemo(
    () => getSourceFromQuery(searchParams.get("source")),
    [searchParams],
  );
  const config = SOURCES_EN[source];

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [q0, setQ0] = useState<number | null>(null);
  const [q0b, setQ0b] = useState<number | null>(null);
  const [q0c, setQ0c] = useState<number | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  const currentQ = step === 0 ? config.q0 : step === 1 ? config.q0b : Q0C_EN;
  const currentValue = step === 0 ? q0 : step === 1 ? q0b : q0c;
  const setCurrentValue = step === 0 ? setQ0 : step === 1 ? setQ0b : setQ0c;

  const onContinue = () => {
    if (currentValue === null) return;
    playClickTick();
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    const answers: LightAnswers = {
      source,
      q0: q0!,
      q0b: q0b!,
      q0c: q0c!,
    };
    try {
      localStorage.setItem(STORAGE_KEY_LIGHT, JSON.stringify(answers));
      const raw = localStorage.getItem(STORAGE_KEY_LIGHT_DONE);
      const done: SourceKey[] = raw ? (JSON.parse(raw) as SourceKey[]) : [];
      if (!done.includes(source)) {
        done.push(source);
        localStorage.setItem(STORAGE_KEY_LIGHT_DONE, JSON.stringify(done));
      }
    } catch {
      // ignore
    }
    router.push(`/en/light/resultat?source=${source}`);
  };

  const onBack = () => {
    if (step === 0) {
      router.push("/en");
      return;
    }
    setStep(step - 1);
  };

  if (!hydrated) return <LoadingFallback />;

  return (
    <main className="relative min-h-[100svh] flex flex-col">
      <div className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm border-b border-line">
        <div className="h-1 bg-line">
          <div
            className="h-full bg-gradient-to-r from-coral-500 to-coral-400 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-line text-neutral-500 hover:text-ink hover:border-ink/30 transition-colors bg-surface"
            aria-label={step === 0 ? "Back to home" : "Previous question"}
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
          <p className="text-[10px] uppercase tracking-[0.2em] text-coral font-semibold">
            {step + 1} / {totalSteps}
          </p>
          <Link
            href="/en"
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-ink transition-colors"
          >
            Quit
          </Link>
        </div>
      </div>

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

        <div
          className="mt-12 animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <button
            type="button"
            onClick={onContinue}
            disabled={currentValue === null}
            className="group flex items-center justify-center w-full py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/20 active:scale-[0.99] transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step === 2 ? "See my result" : "Continue"}
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
        <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
          Free quick test · 1 minute · no email
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
      <div className="text-center">
        <p
          className={`font-display font-semibold text-[80px] sm:text-[110px] leading-none tracking-tight transition-colors ${
            value === null
              ? "text-neutral-300"
              : "text-transparent bg-gradient-to-r from-coral-500 to-coral-400 bg-clip-text"
          }`}
        >
          {value === null ? "?" : value}
          <span className="text-[36px] sm:text-[48px] text-neutral-400 font-normal align-top ml-1">
            /10
          </span>
        </p>
      </div>

      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {numbers.map((n) => {
          const isSelected = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${n} out of 10`}
              aria-pressed={isSelected}
              className={`h-12 sm:h-14 rounded-lg border text-sm sm:text-base font-semibold tabular-nums transition-all active:scale-95 ${
                isSelected
                  ? "border-coral bg-coral text-white shadow-md shadow-coral/30"
                  : "border-line bg-surface text-neutral-700 hover:border-coral/50 hover:bg-coral/[0.04]"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-neutral-500 px-1">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
