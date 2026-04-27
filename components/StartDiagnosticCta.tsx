"use client";

import Link from "next/link";
import {
  analytics,
  diagnosticTimer,
  type DiagnosticSource,
} from "@/lib/analytics";

/**
 * CTA button to start the diagnostic. Fires the diagnostic_started GA4 event
 * and starts the diagnosticTimer (used later for diagnostic_completed duration).
 */
export function StartDiagnosticCta({
  source = "landing_hero_cta",
  className = "",
  children,
}: {
  source?: DiagnosticSource;
  className?: string;
  children: React.ReactNode;
}) {
  const onClick = () => {
    diagnosticTimer.start();
    analytics.diagnosticStarted(source);
  };

  return (
    <Link href="/diagnostic" onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
