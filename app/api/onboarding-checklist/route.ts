import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const rows = (await db
    .prepare("SELECT item_num FROM onboarding_checklist_progress WHERE user_id = ?")
    .all(user.id)) as Array<{ item_num: string }>;
  return NextResponse.json(rows.map((r) => r.item_num));
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const ip = getClientIp(req);
  if (!(await rateLimit(`onboarding-check:${ip}`, 30, 10 * 60 * 1000))) {
    return NextResponse.json({ error: "Too many requests — please wait 10 minutes." }, { status: 429 });
  }

  const data = await req.json().catch(() => null);
  const itemNum = String(data?.item_num ?? "").trim().slice(0, 20);
  const done = data?.done === true;
  if (!itemNum) {
    return NextResponse.json({ error: "item_num is required" }, { status: 400 });
  }

  if (done) {
    await db
      .prepare("INSERT OR IGNORE INTO onboarding_checklist_progress (user_id, item_num) VALUES (?, ?)")
      .run(user.id, itemNum);
  } else {
    await db
      .prepare("DELETE FROM onboarding_checklist_progress WHERE user_id = ? AND item_num = ?")
      .run(user.id, itemNum);
  }

  return NextResponse.json({ ok: true });
}