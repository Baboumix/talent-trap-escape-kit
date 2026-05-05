"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { analytics, diagnosticTimer } from "@/lib/analytics";
import type { AnswerValue, StatutPro, VerdictKey } from "@/lib/types";

const STORAGE_KEY = "ptc-diagnostic-v1";

type Stored = {
  v: 1;
  startedAt: string;
  statutPro?: StatutPro;
  answers: Record<number, AnswerValue>;
};

export default function InfosPage() {
  const router = useRouter();
  const [stored, setStored] = useState<Stored | null>(null);
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [metier, setMetier] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch {
      router.replace("/diagnostic");
    }
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stored || !stored.statutPro) return;
    setLoading(true);
    setError(null);

    const durationSec = Math.min(
      86400,
      Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(stored.startedAt).getTime()) / 1000,
        ),
      ),
    );

    const source =
      typeof document !== "undefined" ? document.referrer || "" : "";

    try {
      const res = await fetch("/api/submit-diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: stored.answers,
          statutPro: stored.statutPro,
          prenom: prenom.trim(),
          email: email.trim(),
          metier: metier.trim(),
          lang: "fr",
          durationSec,
          source,
          website, // honeypot
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        verdict?: VerdictKey;
        error?: string;
      };
      if (!res.ok) {
        setError(
          data?.error || "Oups, on a eu un souci. Réessaie dans 30 secondes.",
        );
        setLoading(false);
        return;
      }
      // Success: fire email_captured GA4 event with the verdict from backend.
      // Only after backend confirms the save, never on validation errors.
      if (data.verdict) {
        analytics.emailCaptured(data.verdict, "inline_form");
      }
      diagnosticTimer.clear();
      // Clear localStorage and go to merci
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      router.push("/diagnostic/merci");
    } catch {
      setError("Connexion impossible. Vérifie ton réseau et réessaie.");
      setLoading(false);
    }
  };

  if (!stored) {
    return (
      <main className="min-h-[100svh] flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Chargement…
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-[100svh] flex flex-col px-6 py-10 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-coral/[0.1] blur-[120px]" />
      </div>

      <header className="flex justify-center mb-10 animate-fade-up">
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/30 rounded-full bg-coral/[0.04]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Dernière étape
        </p>
      </header>

      <section className="max-w-md mx-auto w-full text-center animate-fade-up mb-10">
        <h1 className="font-display font-medium text-[32px] sm:text-4xl md:text-[44px] leading-[1.05] tracking-tight mb-4">
          Où j'envoie tes 3 prochaines actions ?
        </h1>
        <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
          Tu recevras par email ton diagnostic complet (note /10 détaillée,
          analyse de tes 6 besoins essentiels, angles morts) et tes 3 actions
          concrètes pour les 30 prochains jours.
        </p>
      </section>

      <form
        onSubmit={onSubmit}
        className="max-w-md mx-auto w-full flex flex-col gap-4 animate-fade-up"
        noValidate
      >
        <Field
          label="Prénom"
          value={prenom}
          onChange={setPrenom}
          required
          autoComplete="given-name"
        />
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
          inputMode="email"
        />
        <Field
          label="Métier"
          value={metier}
          onChange={setMetier}
          required
          placeholder="Ex : Compositeur VFX, Lead Developer, Studio Manager"
        />

        {/* Honeypot field: must stay empty */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          <label>
            Site web
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
        </div>

        {error && (
          <p className="text-sm text-coral text-center" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !prenom || !email || !metier}
          className="group flex items-center justify-center mt-2 w-full py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/20 active:scale-[0.99] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Envoi…" : "Recevoir mes 3 actions"}
          {!loading && (
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
          )}
        </button>

        <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-600 text-center mt-2">
          Pas de spam · désinscription en 1 clic
        </p>
        <p className="text-[10px] text-neutral-400 text-center mt-1 leading-relaxed">
          En soumettant, tu acceptes notre{" "}
          <Link
            href="/confidentialite"
            className="text-coral/80 hover:text-coral underline"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </form>

      <footer className="mt-auto pt-10 text-center flex flex-col gap-3 items-center">
        <Link
          href="/diagnostic/resultat"
          className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-500 transition-colors"
        >
          ← Revoir mon verdict
        </Link>
        <p className="text-[10px] text-neutral-400 tracking-wide">
          <Link
            href="/mentions-legales"
            className="hover:text-neutral-500 transition-colors"
          >
            Mentions légales
          </Link>
          <span className="mx-2">·</span>
          <Link
            href="/confidentialite"
            className="hover:text-neutral-500 transition-colors"
          >
            Confidentialité
          </Link>
        </p>
      </footer>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
        {label}
        {required && <span className="text-coral ml-1">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full px-5 py-4 rounded-2xl border border-line bg-surface text-base placeholder:text-neutral-600 focus:border-coral/60 focus:outline-none focus:bg-coral/[0.04] transition-colors"
      />
    </label>
  );
}
