"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { analytics, diagnosticTimer } from "@/lib/analytics";
import {
  MODIFIERS,
  NEED_LABELS,
  NEED_ORDER,
  STATUS_HOOKS,
  STATUS_LABELS,
  VERDICTS,
} from "@/lib/content";
import { computeDiagnostic } from "@/lib/scoring";
import type {
  AnswerValue,
  DiagnosticResult,
  Need,
  SatisfactionStatus,
  StatutPro,
  VerdictKey,
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

  // Fire diagnostic_completed once when verdict is ready.
  // Don't clear the timer here: we still need it for email_captured duration.
  useEffect(() => {
    if (!diagnostic) return;
    const duration = diagnosticTimer.durationSeconds();
    analytics.diagnosticCompleted(diagnostic.verdict, duration);
  }, [diagnostic]);

  if (!hydrated || !stored || !diagnostic || !revealed) {
    return <RevealLoader />;
  }

  const verdict = VERDICTS[diagnostic.verdict];
  const topTwo = diagnostic.dominantNeeds.slice(0, 2);
  const dominantSet = new Set(topTwo);

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
          Ton score
        </p>
      </header>

      <section
        className="max-w-2xl mx-auto w-full text-center animate-fade-up"
        style={{ animationDelay: "150ms" }}
      >
        <p className="font-display font-semibold leading-none tracking-tight text-coral text-[120px] sm:text-[160px] md:text-[200px]">
          {diagnostic.talentScore}
          <span className="text-neutral-500 font-normal text-[56px] sm:text-[72px] md:text-[88px] align-top ml-2">
            /10
          </span>
        </p>
        <p className="mt-4 font-display italic font-medium text-lg md:text-xl text-neutral-400">
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
        <h2 className="font-display font-medium text-3xl md:text-5xl leading-tight tracking-tight mb-4 text-ink">
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
        <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-3 text-center">
          Tes 2 besoins centraux
        </p>
        <p className="text-center text-base md:text-lg text-ink leading-relaxed mb-2">
          {topTwo
            .map((n) => NEED_LABELS[n])
            .join(" · ")}
        </p>
        <p className="text-center text-sm text-neutral-500 leading-relaxed mb-8 max-w-lg mx-auto">
          {topTwo
            .map((n) => statusSentence(n, diagnostic.needScores[n].status))
            .join(" ")}
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
        style={{ animationDelay: "1200ms" }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-3 text-center">
          Angles morts détectés
        </p>
        {diagnostic.modifiers.length > 0 ? (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {diagnostic.modifiers.map((k) => (
                <span
                  key={k}
                  className="text-xs px-3 py-1.5 rounded-full border border-coral/40 bg-coral/[0.06] text-coral"
                >
                  {MODIFIERS[k].displayName}
                </span>
              ))}
            </div>
            <p className="text-center text-sm text-neutral-500 italic">
              Le détail de chacun, et ce que ça veut dire pour toi, dans ton email.
            </p>
          </>
        ) : (
          <p className="text-center text-sm text-neutral-500 leading-relaxed max-w-md mx-auto">
            Tes réponses ne déclenchent aucun angle mort spécifique. C'est plutôt rare. Le détail dans ton email.
          </p>
        )}
      </section>

      <section
        className="mt-10 max-w-2xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "1300ms" }}
      >
        <div className="rounded-2xl border border-coral/30 bg-coral/[0.05] p-6 md:p-7 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-3">
            Le reste t'attend par email
          </p>
          <p className="text-neutral-400 leading-relaxed mb-6">
            Le verdict détaillé, le décodage de tes angles morts,
            et tes <strong className="text-ink">3 actions concrètes pour les 30 prochains jours</strong>.
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

      <section
        className="mt-12 max-w-2xl mx-auto w-full animate-fade-up"
        style={{ animationDelay: "1400ms" }}
      >
        <ShareBlock
          verdictKey={diagnostic.verdict}
          verdictName={verdict.notionName}
          talentScore={diagnostic.talentScore}
        />
      </section>

      <footer
        className="mt-12 flex flex-col items-center gap-4 text-center animate-fade-up"
        style={{ animationDelay: "1500ms" }}
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
          className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-500 transition-colors"
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
    <div className="mx-auto max-w-xl text-neutral-400 text-base md:text-lg leading-relaxed space-y-4">
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
        className="text-ink font-medium px-1.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
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

function statusSentence(need: Need, status: SatisfactionStatus): string {
  const label = NEED_LABELS[need];
  if (status === "satisfait") return `${label} est nourri sainement.`;
  if (status === "verrouille") return `${label} est verrouillé par le piège.`;
  return `${label} est sous influence.`;
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
  const statusLabel = STATUS_LABELS[score.status];
  const hook = STATUS_HOOKS[score.status];
  const isSouffrance = score.status !== "satisfait";

  const statusColor =
    score.status === "verrouille"
      ? "text-coral border-coral/40 bg-coral/[0.06]"
      : score.status === "satisfait"
        ? "text-emerald-700 border-emerald-200 bg-emerald-50/40"
        : "text-amber-700 border-amber-200 bg-amber-50/40";

  if (!isDominant) {
    // Compact card for non-dominant needs
    return (
      <div
        className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface shadow-sm px-4 py-3 animate-fade-up"
        style={{ animationDelay: `${delay}ms` }}
      >
        <p className="font-display font-semibold text-base leading-tight">
          {label}
        </p>
        <div className="flex items-center gap-3">
          <p className="text-[10px] text-neutral-600 tracking-wider hidden sm:block">
            <span className="text-neutral-500">{score.intensity}/4</span>
            <span className="mx-1.5 text-neutral-400">·</span>
            <span className="text-neutral-500">{score.satisfaction}/4</span>
          </p>
          <span
            className={`shrink-0 text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-1 rounded-full border ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>
    );
  }

  // Full card for the 2 dominant needs
  return (
    <div
      className="rounded-xl border border-coral/40 bg-coral/[0.04] p-4 md:p-5 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display font-semibold text-lg leading-tight">
            {label}
          </p>
          <span className="text-[9px] uppercase tracking-[0.18em] text-coral font-semibold px-2 py-0.5 rounded-full border border-coral/40 bg-coral/[0.08]">
            Ton besoin
          </span>
          {isSouffrance && (
            <span className="text-[9px] uppercase tracking-[0.18em] text-rose-300 font-semibold px-2 py-0.5 rounded-full border border-rose-400/40 bg-rose-400/[0.08]">
              En souffrance
            </span>
          )}
        </div>
        <span
          className={`shrink-0 text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-1 rounded-full border ${statusColor}`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-sm text-neutral-400 leading-relaxed mt-3">{hook}</p>
      <p className="text-[10px] text-neutral-600 mt-3 tracking-wider">
        Intensité <span className="text-neutral-500">{score.intensity}/4</span>
        <span className="mx-2">·</span>
        Satisfaction <span className="text-neutral-500">{score.satisfaction}/4</span>
      </p>
    </div>
  );
}

function ShareBlock(_props: {
  verdictKey: VerdictKey;
  verdictName: string;
  talentScore: number;
}) {
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
        Une capture d'écran suffit pour le partager à quelqu'un.
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-coral/[0.1] blur-[140px] animate-pulse" />
      </div>
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:200ms]" />
        <span className="w-2 h-2 rounded-full bg-coral animate-pulse [animation-delay:400ms]" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
        Ta note se compose
      </p>
    </main>
  );
}
