import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "node:crypto";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data?.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const portfolio = (await db.prepare("SELECT id FROM portfolios WHERE slug = ?").get(data.slug)) as { id: number } | undefined;
  if (!portfolio) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Generate anonymous visitor ID from IP + user agent
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = req.headers.get("user-agent") || "";
  const visitorId = crypto.createHash("sha256").update(`${ip}:${ua}`).digest("hex").slice(0, 16);

  try {
    await db.prepare(
      "INSERT INTO portfolio_views (portfolio_id, visitor_id, path, referrer, user_agent) VALUES (?, ?, ?, ?, ?)"
    ).run(portfolio.id, visitorId, data.path || "/", req.headers.get("referer") || "", ua.slice(0, 200));
    // Increment view counter
    await db.prepare("UPDATE portfolios SET portfolio_views_count = portfolio_views_count + 1 WHERE id = ?").run(portfolio.id);
  } catch {
    // non-critical
  }

  return NextResponse.json({ ok: true });
}
