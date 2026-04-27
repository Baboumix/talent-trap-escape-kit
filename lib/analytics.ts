/**
 * Analytics helper centralisé pour kit.monexpansion.com
 * Tous les events du diagnostic Profil du Talent Coincé passent par ici.
 *
 * Forwarded by GTM-PHQMQHQK to GA4 G-26ZHX08Z9J.
 * Custom dimensions (Event scope) déjà créées côté GA4:
 *   verdict, question_number, total_questions, duration_seconds,
 *   method, share_platform, diagnostic_source.
 */

import { sendGTMEvent } from "@next/third-parties/google";
import type { VerdictKey } from "./types";

export type Verdict = VerdictKey;

export type SharePlatform = "twitter" | "linkedin" | "copy_link";

export type DiagnosticSource =
  | "landing_hero_cta"
  | "landing_secondary_cta"
  | "blog_link"
  | "email_followup"
  | "social_share"
  | "direct";

export const analytics = {
  diagnosticStarted: (source: DiagnosticSource = "landing_hero_cta") => {
    sendGTMEvent({
      event: "diagnostic_started",
      diagnostic_source: source,
    });
  },

  diagnosticQuestionAnswered: (
    questionNumber: number,
    totalQuestions: number,
  ) => {
    sendGTMEvent({
      event: "diagnostic_question_answered",
      question_number: questionNumber,
      total_questions: totalQuestions,
    });
  },

  diagnosticCompleted: (verdict: Verdict, durationSeconds: number) => {
    sendGTMEvent({
      event: "diagnostic_completed",
      verdict,
      duration_seconds: durationSeconds,
    });
  },

  emailCaptured: (verdict: Verdict, method: string = "inline_form") => {
    sendGTMEvent({
      event: "email_captured",
      verdict,
      method,
    });
  },

  shareClicked: (platform: SharePlatform, verdict: Verdict) => {
    sendGTMEvent({
      event: "share_clicked",
      share_platform: platform,
      verdict,
    });
  },
};

/**
 * Tracks elapsed time from CTA click to email capture.
 * Stored in sessionStorage so it survives navigation but resets per session.
 * Different from `startedAt` (localStorage) which marks first /diagnostic access.
 */
export const diagnosticTimer = {
  start: () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "diagnostic_start_time",
        String(Date.now()),
      );
    }
  },
  durationSeconds: (): number => {
    if (typeof window === "undefined") return 0;
    const start = window.sessionStorage.getItem("diagnostic_start_time");
    if (!start) return 0;
    return Math.round((Date.now() - parseInt(start, 10)) / 1000);
  },
  clear: () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("diagnostic_start_time");
    }
  },
};
