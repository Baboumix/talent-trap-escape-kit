import { MODIFIERS, VERDICTS } from "./content";
import type { DiagnosticInput, DiagnosticResult } from "./types";

const BREVO_API = "https://api.brevo.com/v3";

function headers(): HeadersInit {
  return {
    accept: "application/json",
    "content-type": "application/json",
    "api-key": process.env.BREVO_API_KEY ?? "",
  };
}

/**
 * Create or update a Brevo contact and attach to the correct language list.
 * Brevo's `POST /contacts` accepts `updateEnabled: true` for upsert semantics.
 */
export async function upsertContact(
  input: DiagnosticInput,
  result: DiagnosticResult,
): Promise<void> {
  const listId =
    input.lang === "en"
      ? Number(process.env.BREVO_LIST_ID_EN)
      : Number(process.env.BREVO_LIST_ID_FR);

  const verdictName = VERDICTS[result.verdict].notionName;
  const modifiersStr = result.modifiers
    .map((k) => MODIFIERS[k].notionName)
    .join(", ");

  const body = {
    email: input.email,
    listIds: [listId],
    updateEnabled: true,
    attributes: {
      PRENOM: input.prenom,
      VERDICT: verdictName,
      MODIFIERS: modifiersStr,
      METIER: input.metier,
      STATUT_PRO: input.statutPro,
      LANG: input.lang.toUpperCase(),
    },
  };

  const res = await fetch(`${BREVO_API}/contacts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Brevo upsertContact failed ${res.status}: ${text.slice(0, 500)}`,
    );
  }
}

export async function sendReportEmail(params: {
  to: string;
  prenom: string;
  html: string;
  subject: string;
  attachments?: { name: string; content: string }[]; // content = base64
}): Promise<void> {
  const body: Record<string, unknown> = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL!,
      name: process.env.BREVO_SENDER_NAME!,
    },
    to: [{ email: params.to, name: params.prenom }],
    subject: params.subject,
    htmlContent: params.html,
    tags: ["diagnostic_fait"],
  };

  if (params.attachments && params.attachments.length > 0) {
    body.attachment = params.attachments;
  }

  const bccEmail = process.env.BREVO_BCC_EMAIL || "app@monexpansion.com";
  if (bccEmail) {
    body.bcc = [{ email: bccEmail, name: "monExpansion" }];
  }

  const res = await fetch(`${BREVO_API}/smtp/email`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Brevo sendReportEmail failed ${res.status}: ${text.slice(0, 500)}`,
    );
  }
}
