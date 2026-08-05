import { NextResponse } from "next/server";
import { requireUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await requireUser();
  if (!isAdmin(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await db
    .prepare("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50")
    .all();
  return NextResponse.json({ notifications: rows });
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!isAdmin(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  if (data.action === "mark_read" && typeof data.id === "number") {
    await db.prepare("UPDATE notifications SET read = 1 WHERE id = ?").run(data.id);
    return NextResponse.json({ ok: true });
  }

  if (data.action === "mark_all_read") {
    await db.prepare("UPDATE notifications SET read = 1 WHERE read = 0").run();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
