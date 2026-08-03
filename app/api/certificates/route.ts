import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROADMAP } from "@/data/roadmap";
import { refreshHireReadyBadge } from "@/lib/gamification";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const rows = (await db
    .prepare(
      "SELECT id, stage_key, stage_title, date_issued FROM certificates WHERE user_id = ? ORDER BY date_issued"
    )
    .all(user.id)) as unknown as Array<Record<string, unknown>>;
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
  const stageKey = String(data?.stageKey || "");

  const stage = ROADMAP.find((s) => s.key === stageKey);
  if (!stage) {
    return NextResponse.json({ error: "Unknown stage" }, { status: 400 });
  }

  // Make sure the stage checklist is 100% done before issuing a certificate.
  const progress = (await db.prepare("SELECT checks FROM progress WHERE user_id = ?").get(user.id)) as
    | { checks: string }
    | undefined;
  const checks = progress ? (JSON.parse(progress.checks) as Record<string, number[]>) : {};
  const done = checks[stageKey]?.length || 0;
  if (done < stage.items.length) {
    return NextResponse.json(
      { error: `Complete all ${stage.items.length} items of the ${stage.title} stage first` },
      { status: 400 }
    );
  }

  const existing = await db
    .prepare("SELECT id FROM certificates WHERE user_id = ? AND stage_key = ?")
    .get(user.id, stageKey);
  if (existing) {
    return NextResponse.json({ id: (existing as { id: number }).id, duplicate: true });
  }

  const result = await db
    .prepare("INSERT INTO certificates (user_id, stage_key, stage_title) VALUES (?, ?, ?)")
    .run(user.id, stageKey, stage.title);
  const id = Number(result.lastInsertRowid);

  await refreshHireReadyBadge(user.id);

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
