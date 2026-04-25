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
  for (let i = 1; i <= 24; i++) answers[i] = 0;
  // Certitude piège (verdict coince), Variete + Connexion sains
  answers[1] = 2; answers[2] = 2; answers[3] = 0; answers[4] = 2;
  answers[5] = 2; answers[6] = 1; answers[7] = 2; answers[8] = 0;
  answers[9] = 1; answers[10] = 1; answers[11] = 1; answers[12] = 1;
  answers[13] = 2; answers[14] = 1; answers[15] = 2; answers[16] = 0;
  answers[17] = 1; answers[18] = 1; answers[19] = 1; answers[20] = 1;
  answers[21] = 1; answers[22] = 1; answers[23] = 1; answers[24] = 1;
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
