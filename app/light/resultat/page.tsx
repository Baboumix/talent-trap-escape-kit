"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SOURCES,
  ZONE_DOORS,
  ZONE_LABELS,
  computeZone,
  getSourceFromQuery,
} from "@/lib/sources";
import type { LightAnswers, QuadrantZone, SourceKey } from "@/lib/types";

const STORAGE_KEY_LIGHT = "ptc-light-v1";

export default function LightResultatPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LightResultatPage />
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

function LightResultatPage() {
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
        router.replace(`/light?source=${querySource}`);
        return;
      }
      const parsed = JSON.parse(raw) as LightAnswers;
      if (typeof parsed.q0 !== "number" || typeof parsed.q0b !== "number") {
        const querySource = getSourceFromQuery(searchParams.get("source"));
        router.replace(`/light?source=${querySource}`);
        return;
      }
      setAnswers(parsed);
      setHydrated(true);
    } catch {
      const querySource = getSourceFromQuery(searchParams.get("source"));
      router.replace(`/light?source=${querySource}`);
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
    const config = SOURCES[answers.source];
    return { zone, config };
  }, [answers]);

  if (!hydrated || !answers || !result || !revealed) {
    return <RevealLoader />;
  }

  return (
    <main className="relative min-h-[100svh] flex flex-col px-6 py-8 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-coral/[0.12] blur-[140px]" />
      </div>

      <header
        className="flex justify-center mb-8 animate-fade-up"
        style={{ animationDelay: "0ms" }}
      >
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/30 rounded-full bg-coral/[0.04]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Résultat préliminaire
        </p>
      </header>

      {/* Score préliminaire visible */}
      <section
        className="max-w-xl mx-auto w-full text-center animate-fade-up"
        style={{ animationDelay: "150ms" }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-3">
          Tu es probablement dans la zone
        </p>
        <h1 className="font-display font-semibold leading-[0.9] tracking-tight text-coral text-[58px] sm:text-[88px] md:text-[112px]">
          {ZONE_LABELS[result.zone]}
        </h1>
        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          Porte recommandée · {ZONE_DOORS[result.zone]}
        </p>
      </section>

      {/* Quadrant visualization */}
      <section
        className="mt-12 max-w-md mx-auto w-full animate-fade-up"
        style={{ animationDelay: "300ms" }}
      >
        <Quadrant zone={result.zone} />
      </section>

      {/* Insight phrase */}
      <section
        className="mt-10 max-w-xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "450ms" }}
      >
        <p className="font-display italic font-medium text-lg md:text-xl text-center text-neutral-200 leading-relaxed">
          « {result.config.insightByZone[result.zone]} »
        </p>
      </section>

      {/* Locked tease */}
      <section
        className="mt-10 max-w-xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "600ms" }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-4 text-center">
          Voici ce que tu n'as pas encore vu
        </p>
        <div className="flex flex-col gap-2">
          <LockedRow label="Ton angle mort principal" />
          <LockedRow label="Tes 3 actions concrètes pour les 30 prochains jours" />
          <LockedRow label="Les réponses détaillées à tes 4 vraies questions" />
        </div>
      </section>

      {/* Main CTA */}
      <section
        className="mt-10 max-w-xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "750ms" }}
      >
        <div className="rounded-2xl border border-coral/30 bg-coral/[0.05] p-6 md:p-7 text-center">
          <p className="text-neutral-300 text-sm leading-relaxed mb-5">
            Le diagnostic complet te donne <strong className="text-white">tout</strong>.
            5 minutes de plus, par email, gratuit.
          </p>
          <Link
            href={`/diagnostic?source=${answers.source}`}
            className="group inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/20 active:scale-[0.99] transition-transform"
          >
            Débloquer mon diagnostic complet
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

      {/* Share block */}
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
          href={`/light?source=${answers.source}`}
          className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-coral transition-colors"
        >
          ← Refaire le test rapide
        </Link>
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

function LockedRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02]">
      <span
        className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.04] text-neutral-500"
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
      <p className="flex-1 text-sm text-neutral-400 leading-snug">{label}</p>
    </div>
  );
}

function Quadrant({ zone }: { zone: QuadrantZone }) {
  // Grid order : top-left, top-right, bottom-left, bottom-right
  // X axis : Loyal (left) → Truqué (right)
  // Y axis : Exprimé (top) → Bridé (bottom)
  const cells: QuadrantZone[] = [
    "pleine-expansion", // top-left = Loyal + Exprimé
    "depart-imminent", // top-right = Truqué + Exprimé
    "reveil-possible", // bottom-left = Loyal + Bridé
    "urgence-absolue", // bottom-right = Truqué + Bridé
  ];
  return (
    <div className="relative w-full">
      <div className="flex justify-between mb-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
        <span>Terrain Loyal</span>
        <span>Terrain Truqué</span>
      </div>
      <div className="flex">
        {/* Y axis label (left) */}
        <div className="flex flex-col justify-between pr-3 py-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500 text-right">
          <span>Talent<br/>Exprimé</span>
          <span>Talent<br/>Bridé</span>
        </div>
        {/* The grid */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {cells.map((key) => {
            const isActive = key === zone;
            return (
              <div
                key={key}
                className={`aspect-[5/3] rounded-lg flex items-center justify-center text-center px-3 py-2 border transition-all ${
                  isActive
                    ? "border-coral bg-coral/10 text-coral shadow-lg shadow-coral/20 scale-[1.02]"
                    : "border-white/8 bg-white/[0.02] text-neutral-600"
                }`}
              >
                <p className="text-xs font-semibold leading-tight">
                  {ZONE_LABELS[key]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ShareBlock({
  zone,
  source,
}: {
  zone: QuadrantZone;
  source: SourceKey;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://kit.monexpansion.com/light?source=${source}`;
  const shareText = `Je viens de découvrir : je suis dans la zone "${ZONE_LABELS[zone]}". Et toi, où en es-tu ?`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center">
      <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-3">
        Partage ton score préliminaire
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-4 py-2 rounded-full border border-white/15 text-neutral-300 hover:border-coral/60 hover:text-coral transition-colors"
        >
          X / Twitter
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-4 py-2 rounded-full border border-white/15 text-neutral-300 hover:border-coral/60 hover:text-coral transition-colors"
        >
          LinkedIn
        </a>
        <button
          type="button"
          onClick={onCopy}
          className="text-xs px-4 py-2 rounded-full border border-white/15 text-neutral-300 hover:border-coral/60 hover:text-coral transition-colors"
        >
          {copied ? "Lien copié !" : "Copier le lien"}
        </button>
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-coral/[0.1] blur-[120px] animate-pulse" />
      </div>
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:200ms]" />
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:400ms]" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
        Calcul en cours
      </p>
    </main>
  );
}
