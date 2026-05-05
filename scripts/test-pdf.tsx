import { writeFileSync } from "node:fs";
import { generateReportPdfBuffer } from "../lib/pdf-report";
import { computeDiagnostic } from "../lib/scoring";
import type { AnswerValue, DiagnosticInput } from "../lib/types";

// Build a sample 24-answer payload with mixed values
const answers: Record<number, AnswerValue> = {};
for (let i = 1; i <= 24; i++) {
  answers[i] = ((i + 1) % 3) as AnswerValue;
}

const result = computeDiagnostic(answers, "salarie");
console.log(
  "verdict:",
  result.verdict,
  "score:",
  result.talentScore,
  "modifiers:",
  result.modifiers,
);

const input: DiagnosticInput = {
  answers,
  prenom: "Bruno",
  email: "bruno@example.com",
  metier: "Supervisor 2D",
  statutPro: "salarie",
  lang: "fr",
  durationSec: 240,
};

generateReportPdfBuffer(input, result).then((buf) => {
  writeFileSync("/tmp/diagnostic-sample.pdf", buf);
  console.log("PDF written:", buf.length, "bytes → /tmp/diagnostic-sample.pdf");

  // Also generate EN version
  return generateReportPdfBuffer(
    { ...input, lang: "en", prenom: "Sam" },
    result,
  );
}).then((buf) => {
  writeFileSync("/tmp/diagnostic-sample-en.pdf", buf);
  console.log("EN PDF written:", buf.length, "bytes → /tmp/diagnostic-sample-en.pdf");
});
