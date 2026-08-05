import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  const ip = getClientIp(req);
  if (!(await rateLimit(`reset:${ip}`, 5, 15 * 60 * 1000))) {
    return NextResponse.json(
      { error: "Too many attempts — please wait 15 minutes before trying again." },
      { status: 429 }
    );
  }

  const token = String(data.token || "");
  const password = String(data.password || "");

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  if (password.length > 128) {
    return NextResponse.json({ error: "Password must be at most 128 characters" }, { status: 400 });
  }
  if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
    return NextResponse.json({ error: "Password must contain a mix of letters and numbers" }, { status: 400 });
  }
  if (!/[A-Z]/.test(password)) {
    return NextResponse.json({ error: "Password must contain at least one uppercase letter" }, { status: 400 });
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return NextResponse.json({ error: "Password must contain at least one special character" }, { status: 400 });
  }

  const row = (await db.prepare("SELECT user_id, expires_at FROM password_resets WHERE token = ?").get(token)) as
    | { user_id: number; expires_at: number }
    | undefined;

  if (!row || row.expires_at < Date.now()) {
    return NextResponse.json({ error: "Link is expired or invalid. Request a new one." }, { status: 400 });
  }

  await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(password), row.user_id);
  await db.prepare("DELETE FROM password_resets WHERE token = ?").run(token);
  await db.prepare("DELETE FROM sessions WHERE user_id = ?").run(row.user_id);

  return NextResponse.json({ ok: true });
}
