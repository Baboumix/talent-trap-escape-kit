"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  NEED_LABELS,
  NEED_ORDER,
  NEED_QUESTIONS,
  STATUS_HOOKS,
  STATUS_LABELS,
  VERDICTS,
} from "@/lib/content";
import { computeDiagnostic } from "@/lib/scoring";
import type {
  AnswerValue,
  DiagnosticResult,
  Need,
  StatutPro,
} from "@/lib/types";

const STORAGE_KEY = "ptc-diagnostic-v1";

type Stored = {
  v: 1;
  startedAt: string;
  statutPro?: StatutPro;
  answers: Record<number, AnswerValue>;
};

export default function ResultatPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [stored, setStored] = useState<Stored | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        router.replace("/diagnostic");
        return;
      }
      const parsed = JSON.parse(raw) as Stored;
      if (
        parsed.v !== 1 ||
        !parsed.answers ||
        !parsed.statutPro ||
        Object.keys(parsed.answers).length < 24
      ) {
        router.replace("/diagnostic");
        return;
      }
      setStored(parsed);
      setHydrated(true);
    } catch {
      router.replace("/diagnostic");
    }
  }, [router]);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => setRevealed(true), 1400);
    return () => clearTimeout(t);
  }, [hydrated]);

  const diagnostic = useMemo(() => {
    if (!stored || !stored.statutPro) return null;
    return computeDiagnostic(stored.answers, stored.statutPro);
  }, [stored]);

  if (!hydrated || !stored || !diagnostic || !revealed) {
    return <RevealLoader />;
  }

  const verdict = VERDICTS[diagnostic.verdict];
  const dominantSet = new Set(diagnostic.dominantNeeds);

  return (
    <main className="relative min-h-[100svh] flex flex-col px-6 py-10 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-coral/[0.12] blur-[140px]" />
      </div>

      <header
        className="flex justify-center mb-8 animate-fade-up"
        style={{ animationDelay: "0ms" }}
      >
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/30 rounded-full bg-coral/[0.04]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Ton profil
        </p>
      </header>

      <section
        className="max-w-2xl mx-auto w-full text-center animate-fade-up"
        style={{ animationDelay: "150ms" }}
      >
        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 mb-4">
          Ton talent activé
        </p>
        <p className="font-display font-semibold leading-none tracking-tight text-coral text-[120px] sm:text-[160px] md:text-[200px]">
          {diagnostic.talentScore}
          <span className="text-neutral-500 font-normal text-[56px] sm:text-[72px] md:text-[88px] align-top ml-2">
            /10
          </span>
        </p>
        <p className="mt-4 font-display italic font-medium text-lg md:text-xl text-neutral-300">
          {talentInterpretation(diagnostic.talentScore)}
        </p>
      </section>

      <section
        className="mt-14 max-w-2xl mx-auto w-full text-center animate-fade-up"
        style={{ animationDelay: "350ms" }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-3">
          Ton verdict
        </p>
        <h2 className="font-display font-medium text-3xl md:text-5xl leading-tight tracking-tight mb-4 text-white">
          {verdict.notionName}
        </h2>
        <p className="font-display italic font-medium text-lg md:text-xl leading-snug text-coral mb-8 max-w-xl mx-auto">
          « {verdict.phrasePunch} »
        </p>
        <DescriptionCourte text={verdict.descriptionCourte} />
      </section>

      <section
        className="mt-14 max-w-2xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "550ms" }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-2 text-center">
          Tes 6 besoins essentiels
        </p>
        <p className="text-center text-sm text-neutral-500 italic mb-6">
          Les 3 prioritaires gouvernent le plus tes décisions aujourd'hui.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {NEED_ORDER.map((n, i) => (
            <NeedCard
              key={n}
              need={n}
              result={diagnostic}
              isDominant={dominantSet.has(n)}
              delay={650 + i * 90}
            />
          ))}
        </div>
      </section>

      <section
        className="mt-14 max-w-2xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "1300ms" }}
      >
        <div className="rounded-2xl border border-coral/30 bg-coral/[0.05] p-6 md:p-7 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-3">
            Le reste t'attend par email
          </p>
          <p className="text-neutral-300 leading-relaxed mb-6">
            Tes <strong className="text-white">angles morts</strong>, le verdict détaillé,
            et tes <strong className="text-white">3 actions concrètes pour les 30 prochains jours</strong>.
            Tout est dans le diagnostic complet.
          </p>
          <Link
            href="/diagnostic/infos"
            className="group inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/20 active:scale-[0.99] transition-transform"
          >
            Recevoir mon diagnostic complet
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
          <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-neutral-600">
            Par email · gratuit · aucune carte bancaire
          </p>
        </div>
      </section>

      <footer
        className="mt-16 flex flex-col items-center gap-4 text-center animate-fade-up"
        style={{ animationDelay: "1450ms" }}
      >
        <button
          type="button"
          onClick={() => {
            try {
              const raw = localStorage.getItem(STORAGE_KEY);
              if (raw) {
                const parsed = JSON.parse(raw) as Stored;
                const ids = Object.keys(parsed.answers ?? {})
                  .map(Number)
                  .sort((a, b) => a - b);
                const lastId = ids[ids.length - 1];
                if (lastId !== undefined) {
                  delete parsed.answers[lastId];
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                }
              }
            } catch {
              // ignore
            }
            router.push("/diagnostic");
          }}
          className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-coral transition-colors"
        >
          ← Modifier mes réponses
        </button>
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </footer>
    </main>
  );
}

function talentInterpretation(score: number): string {
  if (score <= 2) return "Ton talent est largement bridé.";
  if (score <= 4) return "Ton talent fuit. Tu le sens.";
  if (score <= 6) return "Tu actives une partie. Pas le meilleur de toi.";
  if (score <= 8) return "Ton talent circule. Reste à l'amplifier.";
  return "Ton talent est déployé. C'est rare.";
}

function DescriptionCourte({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <div className="mx-auto max-w-xl text-neutral-300 text-base md:text-lg leading-relaxed space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i}>{renderHighlights(p)}</p>
      ))}
    </div>
  );
}

function renderHighlights(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 0) return <span key={i}>{part}</span>;
    return (
      <mark
        key={i}
        className="text-white font-medium px-1.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
        style={{
          background:
            "linear-gradient(180deg, transparent 30%, rgba(255, 175, 95, 0.48) 30%, rgba(255, 175, 95, 0.48) 96%, transparent 96%)",
        }}
      >
        {part}
      </mark>
    );
  });
}

function NeedCard({
  need,
  result,
  isDominant,
  delay,
}: {
  need: Need;
  result: DiagnosticResult;
  isDominant: boolean;
  delay: number;
}) {
  const score = result.needScores[need];
  const label = NEED_LABELS[need];
  const question = NEED_QUESTIONS[need];
  const statusLabel = STATUS_LABELS[score.status];
  const hook = STATUS_HOOKS[score.status];

  const statusColor =
    score.status === "verrouille"
      ? "text-coral border-coral/40 bg-coral/[0.06]"
      : score.status === "satisfait"
        ? "text-emerald-300 border-emerald-300/30 bg-emerald-300/[0.04]"
        : "text-amber-300 border-amber-300/30 bg-amber-300/[0.04]";

  return (
    <div
      className={`rounded-xl border p-4 md:p-5 animate-fade-up ${
        isDominant
          ? "border-coral/40 bg-coral/[0.04]"
          : "border-white/10 bg-white/[0.02]"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-display font-semibold text-lg leading-tight">
            {label}
            {isDominant && (
              <span className="ml-2 text-[9px] uppercase tracking-[0.18em] text-coral align-middle">
                · prioritaire
              </span>
            )}
          </p>
          <p className="text-xs text-neutral-500 italic mt-0.5">{question}</p>
        </div>
        <span
          className={`shrink-0 text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-1 rounded-full border ${statusColor}`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-sm text-neutral-300 leading-relaxed mt-3">{hook}</p>
      <p className="text-[10px] text-neutral-600 mt-3 tracking-wider">
        Intensité <span className="text-neutral-400">{score.intensity}/4</span>
        <span className="mx-2">·</span>
        Satisfaction <span className="text-neutral-400">{score.satisfaction}/4</span>
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-coral/[0.1] blur-[140px] animate-pulse" />
      </div>
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:200ms]" />
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:400ms]" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
        Ta note se compose
      </p>
    </main>
  );
}
