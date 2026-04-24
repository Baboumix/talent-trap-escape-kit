"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ANSWER_OPTIONS, STATUT_PRO_OPTIONS } from "@/lib/content";
import { interleavedQuestions } from "@/lib/scoring";
import type { AnswerValue, StatutPro } from "@/lib/types";

const STORAGE_KEY = "ptc-diagnostic-v1";

type Stored = {
  v: 1;
  startedAt: string;
  statutPro?: StatutPro;
  answers: Record<number, AnswerValue>;
};

export default function DiagnosticPage() {
  const router = useRouter();
  const questions = useMemo(() => interleavedQuestions(), []);
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [statutPro, setStatutPro] = useState<StatutPro | undefined>();
  const [startedAt, setStartedAt] = useState("");
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Stored;
        if (parsed.v === 1 && parsed.answers) {
          setAnswers(parsed.answers);
          setStatutPro(parsed.statutPro);
          setStartedAt(parsed.startedAt);
          if (Object.keys(parsed.answers).length >= 24) {
            router.replace("/diagnostic/resultat");
            return;
          }
          setHydrated(true);
          return;
        }
      }
    } catch {
      // ignore — start fresh below
    }
    setStartedAt(new Date().toISOString());
    setHydrated(true);
  }, [router]);

  useEffect(() => {
    if (!hydrated) return;
    const stored: Stored = {
      v: 1,
      startedAt: startedAt || new Date().toISOString(),
      statutPro,
      answers,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // ignore
    }
  }, [answers, statutPro, startedAt, hydrated]);

  if (!hydrated) {
    return (
      <main className="min-h-[100svh] flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Chargement…
        </p>
      </main>
    );
  }

  if (!statutPro) {
    return <StatutStep onSelect={(s) => { setStatutPro(s); setFadeKey((k) => k + 1); }} />;
  }

  const answeredCount = Object.keys(answers).length;
  const currentIndex = questions.findIndex(
    (q) => answers[q.id] === undefined,
  );
  const current = currentIndex === -1 ? null : questions[currentIndex];

  if (!current) {
    // All answered — will redirect via useEffect
    return (
      <main className="min-h-[100svh] flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Calcul de ton verdict…
        </p>
      </main>
    );
  }

  const progress = (answeredCount / 24) * 100;
  const questionNumber = answeredCount + 1;

  const selectAnswer = (value: AnswerValue) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    setFadeKey((k) => k + 1);
    if (Object.keys(next).length >= 24) {
      // Store final state synchronously before navigating
      const stored: Stored = {
        v: 1,
        startedAt: startedAt || new Date().toISOString(),
        statutPro,
        answers: next,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      } catch {
        // ignore
      }
      router.push("/diagnostic/resultat");
    }
  };

  return (
    <main className="min-h-[100svh] flex flex-col">
      <div className="sticky top-0 z-10 bg-ink/90 backdrop-blur-sm">
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-coral-500 to-coral-400 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-coral">
            Question {questionNumber} / 24
          </p>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            Quitter
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-xl mx-auto w-full">
        <p
          key={`q-${fadeKey}`}
          className="font-display font-medium text-2xl sm:text-3xl md:text-[34px] leading-[1.15] text-center mb-12 animate-fade-up"
        >
          {current.text}
        </p>

        <div
          key={`opts-${fadeKey}`}
          className="flex flex-col gap-3 animate-fade-up"
        >
          {ANSWER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => selectAnswer(opt.value)}
              className="group w-full px-6 py-4 rounded-2xl border border-white/12 bg-white/[0.03] text-left text-base md:text-lg hover:border-coral/60 hover:bg-coral/[0.06] active:scale-[0.995] transition-all"
            >
              <span className="flex items-center justify-between">
                <span className="font-medium">{opt.label}</span>
                <span
                  aria-hidden="true"
                  className="w-6 h-6 rounded-full border border-white/20 group-hover:border-coral group-hover:bg-coral/20 transition-colors"
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      <footer className="px-6 pb-6 pt-2 text-center">
        <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          Réponds spontanément. Pas de bonne réponse.
        </p>
      </footer>
    </main>
  );
}

function StatutStep({ onSelect }: { onSelect: (s: StatutPro) => void }) {
  return (
    <main className="relative min-h-[100svh] flex flex-col justify-between px-6 py-8 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-coral/[0.08] blur-[120px]" />
      </div>

      <header className="flex justify-center pt-2">
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/30 rounded-full bg-coral/[0.04]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Avant de commencer
        </p>
      </header>

      <section className="flex-1 flex flex-col justify-center items-center text-center max-w-md mx-auto w-full">
        <h1 className="font-display font-medium text-[34px] sm:text-4xl md:text-5xl leading-[1.05] tracking-tight mb-4">
          Ton contexte.
        </h1>
        <p className="text-neutral-400 text-base mb-10">
          Pour que le verdict soit calibré sur ta réalité — pas une moyenne.
        </p>

        <div className="flex flex-col gap-3 w-full animate-fade-up">
          {STATUT_PRO_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className="group w-full px-6 py-5 rounded-2xl border border-white/12 bg-white/[0.03] text-left hover:border-coral/60 hover:bg-coral/[0.06] active:scale-[0.995] transition-all"
            >
              <span className="flex items-center justify-between">
                <span className="font-medium text-base md:text-lg">
                  {opt.label}
                </span>
                <svg
                  className="w-4 h-4 text-neutral-600 group-hover:text-coral group-hover:translate-x-0.5 transition-all"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 3l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </section>

      <footer className="text-center">
        <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          Ta réponse reste privée. Aucune donnée envoyée pour l'instant.
        </p>
      </footer>
    </main>
  );
}
