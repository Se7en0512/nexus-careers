import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordDailyActivity, refreshHireReadyBadge } from "@/lib/gamification";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const row = (await db.prepare("SELECT stage, checks, updated_at FROM progress WHERE user_id = ?").get(user.id)) as
    | { stage: string; checks: string; updated_at: string }
    | undefined;
  return NextResponse.json(
    row ? { stage: row.stage, checks: JSON.parse(row.checks), updated_at: row.updated_at } : { stage: "umpisa", checks: {} }
  );
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

  const stageKey = String(data.stageKey || "");
  const checked = Array.isArray(data.checked) ? data.checked.filter((n: unknown) => Number.isInteger(n)) : [];
  if (!stageKey) return NextResponse.json({ error: "stageKey is required" }, { status: 400 });

  const existing = (await db.prepare("SELECT checks FROM progress WHERE user_id = ?").get(user.id)) as
    | { checks: string }
    | undefined;
  const checks = existing ? (JSON.parse(existing.checks) as Record<string, number[]>) : {};
  checks[stageKey] = checked;

  await db.prepare(
    `INSERT INTO progress (user_id, stage, checks, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET checks = excluded.checks, updated_at = excluded.updated_at`
  ).run(user.id, stageKey, JSON.stringify(checks));

  await recordDailyActivity(user.id);
  await refreshHireReadyBadge(user.id);

  return NextResponse.json({ ok: true, checks });
}
