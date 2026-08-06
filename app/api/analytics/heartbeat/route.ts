import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  const visitorId = String(data?.visitor_id || "").trim();
  if (!visitorId || visitorId.length > 128) {
    return NextResponse.json({ ok: true });
  }

  const now = Math.floor(Date.now() / 1000);

  // Upsert heartbeat
  await db.prepare(
    "INSERT INTO active_users (visitor_id, last_seen) VALUES (?, ?) ON CONFLICT(visitor_id) DO UPDATE SET last_seen = excluded.last_seen"
  ).run(visitorId, now);

  // Log page view
  const path = String(data?.path || "/").slice(0, 500);
  const ua = String(req.headers.get("user-agent") || "").slice(0, 300);
  await db.prepare(
    "INSERT INTO page_views (path, visitor_id, user_agent) VALUES (?, ?, ?)"
  ).run(path, visitorId, ua);

  // Clean up old active users (older than 5 minutes)
  await db.prepare("DELETE FROM active_users WHERE last_seen < ?").run(now - 300);

  return NextResponse.json({ ok: true });
}
