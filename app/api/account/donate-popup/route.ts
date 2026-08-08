import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  await db
    .prepare("UPDATE users SET donate_popup_last_shown_at = datetime('now') WHERE id = ?")
    .run(user.id);

  return NextResponse.json({ ok: true });
}