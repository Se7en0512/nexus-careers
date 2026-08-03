import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLAN_30 } from "@/data/plan30";
import { recordDailyActivity } from "@/lib/gamification";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const rows = (await db
    .prepare("SELECT day FROM daily_plan_progress WHERE user_id = ? AND done = 1")
    .all(user.id)) as unknown as Array<{ day: number }>;
  return NextResponse.json({ days: rows.map((r) => r.day) });
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  const day = Number(data.day);
  const done = Boolean(data.done);

  if (!PLAN_30.some((d) => d.day === day)) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }

  await db.prepare(
    `INSERT INTO daily_plan_progress (user_id, day, done, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(user_id, day) DO UPDATE SET done = excluded.done, updated_at = excluded.updated_at`
  ).run(user.id, day, done ? 1 : 0);

  await recordDailyActivity(user.id);

  return NextResponse.json({ ok: true, day, done });
}
