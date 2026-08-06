import { NextResponse } from "next/server";
import { requireUser, verifyPassword, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  if ("name" in data) {
    const name = String(data.name || "").trim().slice(0, 60);
    if (!name) return NextResponse.json({ error: "Name cannot be blank" }, { status: 400 });
    await db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, user.id);
  }

  if ("updates_opt_in" in data) {
    const value = data.updates_opt_in === true ? 1 : 0;
    await db.prepare("UPDATE users SET updates_opt_in = ? WHERE id = ?").run(value, user.id);
  }

  if ("main_goal" in data) {
    const goal = String(data.main_goal || "").trim().slice(0, 30);
    const validGoals = ["first_client", "learn_skills", "resume", "portfolio", "interviews", "earn_more", ""];
    if (!validGoals.includes(goal)) {
      return NextResponse.json({ error: "Invalid goal value" }, { status: 400 });
    }
    await db.prepare("UPDATE user_onboarding SET main_goal = ? WHERE user_id = ?").run(goal, user.id);
  }

  return NextResponse.json({ ok: true });
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

  const action = String(data.action || "");

  if (action === "change_password") {
    const current = String(data.current_password || "");
    const next = String(data.new_password || "");
    if (next.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }
    if (!/[0-9]/.test(next) || !/[a-zA-Z]/.test(next)) {
      return NextResponse.json({ error: "Password must contain a mix of letters and numbers" }, { status: 400 });
    }
    const row = (await db.prepare("SELECT password_hash FROM users WHERE id = ?").get(user.id)) as { password_hash: string } | undefined;
    if (!row) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!verifyPassword(current, row.password_hash)) {
      return NextResponse.json({ error: "Current password is wrong" }, { status: 400 });
    }
    await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(next), user.id);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete_request") {
    const reason = String(data.reason || "").trim().slice(0, 500);
    const existing = await db
      .prepare("SELECT id FROM account_deletion_requests WHERE user_id = ? AND status = 'pending'")
      .get(user.id);
    if (existing) {
      return NextResponse.json({ error: "You already have a pending request — it will be processed manually." }, { status: 400 });
    }
    await db.prepare("INSERT INTO account_deletion_requests (user_id, reason) VALUES (?, ?)").run(user.id, reason);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
