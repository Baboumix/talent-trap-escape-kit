"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ANSWER_OPTIONS, STATUT_PRO_OPTIONS } from "@/lib/content";
import { interleavedQuestions } from "@/lib/scoring";
import type { AnswerValue, StatutPro } from "@/lib/types";

const STORAGE_KEY = "ptc-diagnostic-v1";
const MILESTONE_POINTS = [6, 12, 18] as const;

type Stored = {
  v: 1;
  startedAt: string;
  statutPro?: StatutPro;
  answers: Record<number, AnswerValue>;
  dismissedBreaks?: number[];
};

type Milestone = {
  count: number;
  chapter: string;
  title: string;
  body: string;
};

const MILESTONES: Milestone[] = [
  {
    count: 6,
    chapter: "1 / 4",
    title: "Premier quart fait.",
    body: "Tu viens de répondre à 6 questions qui sondent comment tu te tiens dans ton travail : ce que tu protèges, ce qui te fatigue, ce qui te relie. Le diagnostic mélange volontairement ces trois axes pour empêcher les biais.",
  },
  {
    count: 12,
    chapter: "2 / 4",
    title: "Mi-parcours.",
    body: "12 questions derrière toi. Un pattern commence déjà à se dessiner, mais le verdict ne se formera qu'après la dernière. Reste précis, ne te corrige pas.",
  },
  {
    count: 18,
    chapter: "3 / 4",
    title: "Trois quarts.",
    body: "Il reste 6 questions. Ce sont souvent celles qui verrouillent ou nuancent ce que les 18 précédentes ont révélé. Ne survole pas la fin.",
  },
];

export default function DiagnosticPage() {
  const router = useRouter();
  const questions = useMemo(() => interleavedQuestions(), []);
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [statutPro, setStatutPro] = useState<StatutPro | undefined>();
  const [startedAt, setStartedAt] = useState("");
  const [dismissedBreaks, setDismissedBreaks] = useState<number[]>([]);
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
          setDismissedBreaks(parsed.dismissedBreaks ?? []);
          if (Object.keys(parsed.answers).length >= 24) {
            router.replace("/diagnostic/resultat");
            return;
          }
          setHydrated(true);
          return;
        }
      }
    } catch {
      // ignore, start fresh below
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
      dismissedBreaks,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // ignore
    }
  }, [answers, statutPro, startedAt, dismissedBreaks, hydrated]);

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
    return (
      <StatutStep
        onSelect={(s) => {
          setStatutPro(s);
          setFadeKey((k) => k + 1);
        }}
      />
    );
  }

  const answeredCount = Object.keys(answers).length;

  const activeMilestone = MILESTONES.find(
    (m) =>
      answeredCount === m.count &&
      !dismissedBreaks.includes(m.count) &&
      answeredCount < 24,
  );

  const currentIndex = questions.findIndex(
    (q) => answers[q.id] === undefined,
  );
  const current = currentIndex === -1 ? null : questions[currentIndex];

  if (!current) {
    // All answered, will redirect via useEffect
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
        dismissedBreaks,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      } catch {
        // ignore
      }
      router.push("/diagnostic/resultat");
    }
  };

  if (activeMilestone) {
    return (
      <MilestoneScreen
        milestone={activeMilestone}
        progress={progress}
        onContinue={() => {
          setDismissedBreaks((arr) =>
            arr.includes(activeMilestone.count)
              ? arr
              : [...arr, activeMilestone.count],
          );
          setFadeKey((k) => k + 1);
        }}
      />
    );
  }

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

function MilestoneScreen({
  milestone,
  progress,
  onContinue,
}: {
  milestone: Milestone;
  progress: number;
  onContinue: () => void;
}) {
  const remaining = 24 - milestone.count;
  return (
    <main className="min-h-[100svh] flex flex-col">
      <div className="sticky top-0 z-10 bg-ink/90 backdrop-blur-sm">
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-coral-500 to-coral-400 transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-coral">
            {milestone.count} / 24
          </p>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            Quitter
          </Link>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col justify-center items-center px-6 py-10 text-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-coral/[0.12] blur-[120px]" />
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-coral font-semibold mb-6 animate-fade-up">
          Chapitre {milestone.chapter}
        </p>
        <h1 className="font-display font-medium text-[44px] sm:text-5xl md:text-6xl leading-[1.0] tracking-tight mb-6 animate-fade-up">
          {milestone.title}
        </h1>
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-lg mb-10 animate-fade-up">
          {milestone.body}
        </p>

        <ChapterDots total={4} active={milestone.count / 6} />

        <button
          type="button"
          onClick={onContinue}
          className="group mt-10 inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/20 active:scale-[0.99] transition-transform"
        >
          Continuer
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
        <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          {remaining} questions restantes
        </p>
      </div>
    </main>
  );
}

function ChapterDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => {
        const done = i + 1 <= active;
        return (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              done ? "bg-coral" : "bg-white/12"
            }`}
          />
        );
      })}
    </div>
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
          Pour que le verdict soit calibré sur ta réalité, pas sur une moyenne.
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
