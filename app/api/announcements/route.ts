import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = (await db
    .prepare(
      `SELECT a.id, a.title, a.message, a.created_at,
              CASE WHEN r.id IS NULL THEN 0 ELSE 1 END AS read
       FROM announcements a
       LEFT JOIN announcement_reads r ON r.announcement_id = a.id AND r.user_id = ?
       ORDER BY a.created_at DESC LIMIT 20`
    )
    .all(user.id)) as Array<{ id: number; title: string; message: string; created_at: string; read: number }>;

  return NextResponse.json({
    announcements: rows.map((a) => ({ ...a, read: a.read === 1 })),
  });
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  if (data.action === "mark_read" && typeof data.id === "number") {
    await db
      .prepare("INSERT OR IGNORE INTO announcement_reads (announcement_id, user_id) VALUES (?, ?)")
      .run(data.id, user.id);
    return NextResponse.json({ ok: true });
  }

  if (data.action === "mark_all_read") {
    const ids = (await db
      .prepare(
        `SELECT a.id FROM announcements a
         LEFT JOIN announcement_reads r ON r.announcement_id = a.id AND r.user_id = ?
         WHERE r.id IS NULL`
      )
      .all(user.id)) as Array<{ id: number }>;
    for (const row of ids) {
      await db
        .prepare("INSERT OR IGNORE INTO announcement_reads (announcement_id, user_id) VALUES (?, ?)")
        .run(row.id, user.id);
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}