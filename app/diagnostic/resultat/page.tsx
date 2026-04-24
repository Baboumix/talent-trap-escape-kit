"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VERDICTS, DIMENSION_LABELS } from "@/lib/content";
import { computeDiagnostic } from "@/lib/scoring";
import type { AnswerValue, StatutPro } from "@/lib/types";

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

  if (!hydrated || !stored || !diagnostic) {
    return <RevealLoader />;
  }

  if (!revealed) {
    return <RevealLoader />;
  }

  const verdict = VERDICTS[diagnostic.verdict];
  const { scores } = diagnostic;

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
          Ton verdict
        </p>
      </header>

      <section
        className="max-w-2xl mx-auto w-full text-center animate-fade-up"
        style={{ animationDelay: "150ms" }}
      >
        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-4">
          Ton profil
        </p>
        <h1 className="font-display font-medium text-[52px] sm:text-6xl md:text-[88px] leading-[0.95] tracking-tight mb-5 bg-gradient-to-br from-white via-white to-coral-400 bg-clip-text text-transparent">
          {verdict.notionName}
        </h1>
        <p className="font-display italic font-medium text-lg md:text-2xl leading-snug text-coral mb-10 max-w-xl mx-auto">
          « {verdict.phrasePunch} »
        </p>
        <DescriptionCourte text={verdict.descriptionCourte} />
      </section>

      <section
        className="mt-12 max-w-2xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "450ms" }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-4 text-center">
          Tes trois dimensions
        </p>
        <div className="grid grid-cols-1 gap-3">
          <ScoreBar
            label={DIMENSION_LABELS.ancrage}
            value={scores.ancrage}
            delay={550}
          />
          <ScoreBar
            label={DIMENSION_LABELS.circulation}
            value={scores.circulation}
            delay={700}
          />
          <ScoreBar
            label={DIMENSION_LABELS.sens}
            value={scores.sens}
            delay={850}
          />
        </div>
      </section>

      <section
        className="mt-10 max-w-2xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "1050ms" }}
      >
        <div className="rounded-2xl border border-coral/25 bg-coral/[0.04] p-6 md:p-7">
          <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-3">
            Ton angle mort
          </p>
          <p className="font-display italic font-medium text-xl md:text-2xl leading-snug">
            « {verdict.angleMort} »
          </p>
        </div>
      </section>

      <section
        className="mt-14 max-w-md mx-auto w-full text-center animate-fade-up"
        style={{ animationDelay: "1250ms" }}
      >
        <p className="text-neutral-400 text-sm mb-5">
          Ton rapport complet par email, avec tes 3 prochaines actions à
          entreprendre dans les 30 jours.
        </p>
        <Link
          href="/diagnostic/infos"
          className="group flex items-center justify-center w-full py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/20 active:scale-[0.99] transition-transform"
        >
          Recevoir mes 3 prochaines actions
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
      </section>

      <footer
        className="mt-16 text-center animate-fade-up"
        style={{ animationDelay: "1450ms" }}
      >
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          ← Retour à l'accueil
        </Link>
      </footer>
    </main>
  );
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
            "linear-gradient(180deg, transparent 30%, rgba(251, 191, 36, 0.45) 30%, rgba(251, 191, 36, 0.45) 96%, transparent 96%)",
        }}
      >
        {part}
      </mark>
    );
  });
}

function ScoreBar({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  const [fill, setFill] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setFill((value / 16) * 100), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-display font-semibold text-base">{label}</p>
        <p className="text-xs text-neutral-500 font-mono">
          {value}
          <span className="text-neutral-700">/16</span>
        </p>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-coral-500 to-coral-400 transition-[width] duration-1000 ease-out"
          style={{ width: `${fill}%` }}
        />
      </div>
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
        Ton verdict se compose
      </p>
    </main>
  );
}
