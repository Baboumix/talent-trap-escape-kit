"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { analytics } from "@/lib/analytics";
import { STATUT_PRO_OPTIONS } from "@/lib/content";
import { playClickTick } from "@/lib/feedback";
import { interleavedQuestions } from "@/lib/scoring";
import type { AnswerValue, StatutPro } from "@/lib/types";

const STORAGE_KEY = "ptc-diagnostic-v1";

type Stored = {
  v: 1;
  startedAt: string;
  statutPro?: StatutPro;
  answers: Record<number, AnswerValue>;
};

const MILESTONE_TOAST: Record<number, string> = {
  6: "Premier quart fait. Tu tiens le rythme.",
  12: "Mi-parcours. On avance ensemble.",
  18: "Dernière ligne droite. Reste précis.",
};

type AnswerChoice = {
  value: AnswerValue;
  short: string;
  full: string;
  className: string;
};

const ANSWER_CHOICES: AnswerChoice[] = [
  {
    value: 0,
    short: "Non",
    full: "Non, pas vraiment",
    className:
      "border-rose-500/30 bg-rose-500/5 text-rose-200 hover:border-rose-500 hover:bg-rose-500 hover:text-white focus-visible:border-rose-500 focus-visible:bg-rose-500 focus-visible:text-white",
  },
  {
    value: 1,
    short: "Plutôt",
    full: "Plutôt oui",
    className:
      "border-neutral-400/30 bg-neutral-500/5 text-neutral-200 hover:border-neutral-200 hover:bg-neutral-200 hover:text-neutral-900 focus-visible:border-neutral-200 focus-visible:bg-neutral-200 focus-visible:text-neutral-900",
  },
  {
    value: 2,
    short: "Oui",
    full: "Oui, clairement",
    className:
      "border-emerald-500/30 bg-emerald-500/5 text-emerald-200 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white focus-visible:border-emerald-500 focus-visible:bg-emerald-500 focus-visible:text-white",
  },
];

export default function DiagnosticPage() {
  const router = useRouter();
  const questions = useMemo(() => interleavedQuestions(), []);
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [statutPro, setStatutPro] = useState<StatutPro | undefined>();
  const [startedAt, setStartedAt] = useState("");
  const [fadeKey, setFadeKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [interactionLock, setInteractionLock] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!interactionLock) return;
    const unlock = () => setInteractionLock(false);
    const t = setTimeout(unlock, 350);
    window.addEventListener("pointermove", unlock, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointermove", unlock);
    };
  }, [interactionLock]);

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
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // ignore
    }
  }, [answers, statutPro, startedAt, hydrated]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

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
  const currentIndex = questions.findIndex(
    (q) => answers[q.id] === undefined,
  );
  const current = currentIndex === -1 ? null : questions[currentIndex];

  if (!current) {
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

  const goBack = () => {
    if (answeredCount === 0) return;
    const lastQuestion = questions[answeredCount - 1];
    if (!lastQuestion) return;
    const { [lastQuestion.id]: _removed, ...rest } = answers;
    void _removed;
    setAnswers(rest);
    setFadeKey((k) => k + 1);
    if (typeof document !== "undefined") {
      (document.activeElement as HTMLElement | null)?.blur();
    }
  };

  const selectAnswer = (value: AnswerValue) => {
    playClickTick();
    if (typeof document !== "undefined") {
      (document.activeElement as HTMLElement | null)?.blur();
    }
    setInteractionLock(true);
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    setFadeKey((k) => k + 1);

    const count = Object.keys(next).length;
    analytics.diagnosticQuestionAnswered(count, 24);

    if (count >= 24) {
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
      return;
    }

    const toastMsg = MILESTONE_TOAST[count];
    if (toastMsg) {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast(toastMsg);
      toastTimer.current = setTimeout(() => setToast(null), 3200);
    }
  };

  return (
    <main className="relative min-h-[100svh] flex flex-col">
      <div className="sticky top-0 z-10 bg-ink/90 backdrop-blur-sm">
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-coral-500 to-coral-400 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/15 text-neutral-400 hover:text-white hover:border-white/40 transition-colors"
                aria-label="Revenir à la question précédente"
                title="Revenir à la question précédente"
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
            )}
            <p className="text-[10px] uppercase tracking-[0.2em] text-coral">
              Question {questionNumber} / 24
            </p>
          </div>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            Quitter
          </Link>
        </div>
      </div>

      {toast && <MilestoneToast message={toast} />}

      <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-xl mx-auto w-full">
        <p
          key={`q-${fadeKey}`}
          className="font-display font-medium text-[28px] sm:text-4xl md:text-[44px] leading-[1.2] text-center mb-14 animate-fade-up"
        >
          {current.text}
        </p>

        <div
          key={`opts-${fadeKey}`}
          className={`grid grid-cols-3 gap-3 animate-fade-up ${
            interactionLock ? "pointer-events-none" : ""
          }`}
        >
          {ANSWER_CHOICES.map((choice) => (
            <button
              key={choice.value}
              type="button"
              onClick={() => selectAnswer(choice.value)}
              aria-label={choice.full}
              title={choice.full}
              className={`group w-full py-5 sm:py-6 rounded-2xl border text-base sm:text-lg font-semibold active:scale-[0.97] transition-all duration-200 ${choice.className}`}
            >
              {choice.short}
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

function MilestoneToast({ message }: { message: string }) {
  return (
    <div
      className="pointer-events-none fixed top-16 inset-x-0 z-20 flex justify-center px-4 animate-fade-up"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto max-w-sm px-5 py-3 rounded-full border border-coral/40 bg-ink/95 backdrop-blur-md shadow-xl shadow-coral/10">
        <p className="text-sm text-white flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
          {message}
        </p>
      </div>
    </div>
  );
}

type StatutMeta = {
  sublabel: string;
  className: string;
};

const STATUT_META: Record<StatutPro, StatutMeta> = {
  salarie: {
    sublabel: "Tu reçois une fiche de paie.",
    className:
      "border-rose-400/20 bg-rose-400/[0.04] hover:border-rose-400/55 hover:bg-rose-400/[0.08]",
  },
  freelance: {
    sublabel: "Tu factures tes clients.",
    className:
      "border-amber-400/20 bg-amber-400/[0.04] hover:border-amber-400/55 hover:bg-amber-400/[0.08]",
  },
  "patron-manager": {
    sublabel: "Tu portes une équipe.",
    className:
      "border-violet-400/20 bg-violet-400/[0.04] hover:border-violet-400/55 hover:bg-violet-400/[0.08]",
  },
};

function StatutStep({ onSelect }: { onSelect: (s: StatutPro) => void }) {
  return (
    <main className="relative min-h-[100svh] flex flex-col justify-between px-6 py-8 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-coral/[0.08] blur-[120px]" />
      </div>

      <header className="flex items-center justify-between pt-2">
        <span className="w-12" aria-hidden="true" />
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/30 rounded-full bg-coral/[0.04]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Avant de commencer
        </p>
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          Quitter
        </Link>
      </header>

      <section className="flex-1 flex flex-col justify-center items-center text-center max-w-md mx-auto w-full">
        <h1 className="font-display font-medium text-[34px] sm:text-4xl md:text-5xl leading-[1.05] tracking-tight mb-4">
          Ton contexte.
        </h1>
        <p className="text-neutral-400 text-base mb-10">
          Pour que le verdict soit calibré sur ta réalité, pas sur une moyenne.
        </p>

        <div className="flex flex-col gap-3 w-full animate-fade-up">
          {STATUT_PRO_OPTIONS.map((opt) => {
            const meta = STATUT_META[opt.value];
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  playClickTick();
                  onSelect(opt.value);
                }}
                className={`group w-full px-5 py-4 rounded-2xl border text-left active:scale-[0.995] transition-all ${meta.className}`}
              >
                <span className="flex items-center gap-4">
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium text-base md:text-lg leading-tight">
                      {opt.label}
                    </span>
                    <span className="block text-xs text-neutral-500 mt-0.5">
                      {meta.sublabel}
                    </span>
                  </span>
                  <svg
                    className="shrink-0 w-4 h-4 text-neutral-600 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-all"
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
            );
          })}
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
