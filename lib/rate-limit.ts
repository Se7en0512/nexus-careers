// Simple in-memory sliding-window rate limiter.
// Note: sufficient for single-instance deployments (Vercel serverless, or one Node server).
// If instances multiply, move to a shared store (Redis/DB).

const buckets = new Map<string, number[]>();
let lastPrune = 0;

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (now - lastPrune > 60_000) {
    lastPrune = now;
    for (const [k, hits] of buckets) {
      if (hits.length === 0 || now - hits[hits.length - 1] >= windowMs) buckets.delete(k);
    }
  }
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
