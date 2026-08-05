import { db } from "./db";

// DB-backed rate limiter using a simple rate_limits table.
// Survives cold starts and works across serverless invocations.

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean old entries periodically (1 in 20 chance)
  if (Math.random() < 0.05) {
    await db.prepare("DELETE FROM rate_limits WHERE timestamp < ?").run(windowStart);
  }

  // Count hits in window
  const row = (await db
    .prepare("SELECT COUNT(*) AS n FROM rate_limits WHERE key = ? AND timestamp > ?")
    .get(key, windowStart)) as { n: number } | undefined;

  if (row && row.n >= limit) {
    return false;
  }

  // Record this hit
  await db.prepare("INSERT INTO rate_limits (key, timestamp) VALUES (?, ?)").run(key, now);
  return true;
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
