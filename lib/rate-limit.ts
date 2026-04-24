// Very basic in-memory rate limit.
// Note: serverless functions don't share memory across cold starts.
// This is a minimal MVP protection. For real protection, swap for Upstash Redis.

const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const LIMIT = 5; // 5 submissions per hour per IP

export function checkRateLimit(ip: string): {
  ok: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const arr = hits.get(ip) ?? [];
  const recent = arr.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    const oldest = recent[0] ?? now;
    const retryAfter = Math.ceil((WINDOW_MS - (now - oldest)) / 1000);
    return { ok: false, retryAfter };
  }
  recent.push(now);
  hits.set(ip, recent);
  return { ok: true };
}
