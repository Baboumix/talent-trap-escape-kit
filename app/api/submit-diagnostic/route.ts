import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { VERDICTS } from "@/lib/content";
import { createDiagnosticPage } from "@/lib/notion";
import { sendReportEmail, upsertContact } from "@/lib/brevo";
import { generateReportHtml } from "@/lib/email-report";
import { checkRateLimit } from "@/lib/rate-limit";
import { computeDiagnostic } from "@/lib/scoring";
import type { AnswerValue, StatutPro } from "@/lib/types";

export const runtime = "nodejs";

const submitSchema = z.object({
  answers: z.record(
    z.string().regex(/^\d+$/),
    z.number().int().min(0).max(2),
  ),
  statutPro: z.enum(["salarie", "freelance", "patron-manager"]),
  prenom: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  metier: z.string().trim().min(1).max(200),
  lang: z.enum(["fr", "en"]).default("fr"),
  durationSec: z.number().int().min(0).max(7200),
  source: z.string().max(500).optional(),
  website: z.string().max(0).optional().default(""),
});

export async function POST(req: NextRequest) {
  // Rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie plus tard." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfter || 60) },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 },
    );
  }

  const { website, ...data } = parsed.data;
  if (website) {
    // Honeypot triggered, assume bot
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Normalize answers (string keys to number)
  const answers: Record<number, AnswerValue> = {};
  for (const [k, v] of Object.entries(data.answers)) {
    answers[Number(k)] = v as AnswerValue;
  }

  // Ensure all 24 answers are present
  const missing: number[] = [];
  for (let i = 1; i <= 24; i++) {
    if (answers[i] === undefined) missing.push(i);
  }
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing answers: ${missing.join(",")}` },
      { status: 400 },
    );
  }

  const statutPro = data.statutPro as StatutPro;
  const result = computeDiagnostic(answers, statutPro);
  const input = {
    answers,
    statutPro,
    prenom: data.prenom,
    email: data.email,
    metier: data.metier,
    lang: data.lang,
    durationSec: data.durationSec,
    source: data.source,
  };

  // Fire Notion + Brevo contact in parallel (best effort)
  const [notionRes, contactRes] = await Promise.allSettled([
    createDiagnosticPage(input, result),
    upsertContact(input, result),
  ]);

  if (notionRes.status === "rejected") {
    console.error("Notion create failed:", notionRes.reason);
  }
  if (contactRes.status === "rejected") {
    console.error("Brevo upsert failed:", contactRes.reason);
  }

  // Send report email (blocking: this is the main deliverable)
  try {
    const html = generateReportHtml({ input, result });
    const verdictName = VERDICTS[result.verdict].notionName;
    await sendReportEmail({
      to: data.email,
      prenom: data.prenom,
      html,
      subject: `${data.prenom}, ton verdict : ${verdictName}`,
    });
  } catch (e) {
    console.error("Brevo send failed:", e);
    // Don't fail the whole request. Notion fiche exists, user can be reached manually.
  }

  return NextResponse.json({
    ok: true,
    verdict: result.verdict,
  });
}
