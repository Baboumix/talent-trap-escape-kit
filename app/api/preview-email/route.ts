import { NextResponse } from "next/server";
import { generateReportHtml } from "@/lib/email-report";
import { computeDiagnostic } from "@/lib/scoring";
import type { AnswerValue, StatutPro } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Dev-only email preview. Returns the generated HTML as if a test user
 * had just submitted. Guarded by NODE_ENV so it never ships to production.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const answers: Record<number, AnswerValue> = {};
  for (let i = 1; i <= 24; i++) answers[i] = 2;
  const statutPro: StatutPro = "salarie";
  const result = computeDiagnostic(answers, statutPro);

  const html = generateReportHtml({
    input: {
      answers,
      statutPro,
      prenom: "Julien",
      email: "julien@monexpansion.com",
      metier: "Fondateur monExpansion",
      lang: "fr",
      durationSec: 180,
      source: "preview",
    },
    result,
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
