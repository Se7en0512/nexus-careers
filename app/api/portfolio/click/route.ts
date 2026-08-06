import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "node:crypto";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data?.slug || !data?.linkUrl) return NextResponse.json({ error: "slug and linkUrl required" }, { status: 400 });

  const portfolio = (await db.prepare("SELECT id FROM portfolios WHERE slug = ?").get(data.slug)) as { id: number } | undefined;
  if (!portfolio) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = req.headers.get("user-agent") || "";
  const visitorId = crypto.createHash("sha256").update(`${ip}:${ua}`).digest("hex").slice(0, 16);

  try {
    await db.prepare(
      "INSERT INTO portfolio_link_clicks (portfolio_id, link_label, link_url, visitor_id) VALUES (?, ?, ?, ?)"
    ).run(portfolio.id, data.linkLabel || "", data.linkUrl, visitorId);
  } catch {
    // non-critical
  }

  return NextResponse.json({ ok: true });
}
