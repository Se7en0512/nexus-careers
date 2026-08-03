import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordDailyActivity, refreshHireReadyBadge } from "@/lib/gamification";

export async function GET(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const type = new URL(req.url).searchParams.get("type") || "";
  if (type !== "readiness" && type !== "niche") {
    return NextResponse.json({ error: "Unknown quiz type" }, { status: 400 });
  }
  const rows = (await db
    .prepare(
      "SELECT id, quiz, result, payload, created_at FROM quiz_results WHERE user_id = ? AND quiz = ? ORDER BY created_at DESC"
    )
    .all(user.id, type)) as unknown as Array<Record<string, unknown>>;
  return NextResponse.json(rows);
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

  const quiz = String(data.quiz || "");
  const result = String(data.result || "").slice(0, 200);
  const payload = String(data.payload || "").slice(0, 2000);

  if (quiz !== "readiness" && quiz !== "niche") {
    return NextResponse.json({ error: "Unknown quiz type" }, { status: 400 });
  }
  if (!result) return NextResponse.json({ error: "Result is required" }, { status: 400 });

  await db.prepare("INSERT INTO quiz_results (user_id, quiz, result, payload) VALUES (?, ?, ?, ?)").run(
    user.id,
    quiz,
    result,
    payload
  );

  // Also pushes the readiness result to the progress tracker's stage,
  // and saves the VA Score on the user's profile (updated on every take).
  if (quiz === "readiness") {
    try {
      const payloadObj = JSON.parse(payload) as { stage?: string; score?: number };
      if (payloadObj.stage) {
        await db.prepare(
          `INSERT INTO progress (user_id, stage, checks, updated_at)
           VALUES (?, ?, '{}', datetime('now'))
           ON CONFLICT(user_id) DO UPDATE SET stage = excluded.stage`
        ).run(user.id, payloadObj.stage);
      }
      if (typeof payloadObj.score === "number") {
        await db.prepare("UPDATE users SET va_score = ? WHERE id = ?").run(
          Math.max(0, Math.min(100, Math.round(payloadObj.score))),
          user.id
        );
      }
    } catch {
      // not critical — just don't break the save
    }
  }

  await recordDailyActivity(user.id);
  await refreshHireReadyBadge(user.id);

  return NextResponse.json({ ok: true }, { status: 201 });
}
