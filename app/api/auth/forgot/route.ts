import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  const email = String(data?.email || "").trim().toLowerCase();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const ip = getClientIp(req);
  if (!(await rateLimit(`forgot:${ip}`, 5, 15 * 60 * 1000))) {
    return NextResponse.json(
      { error: "Too many requests — please wait 15 minutes before trying again." },
      { status: 429 }
    );
  }

  const user = (await db.prepare("SELECT id FROM users WHERE email = ?").get(email)) as
    | { id: number }
    | undefined;

  // So attackers can't tell whether an email has an account, always reply "ok".
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  // Clear old tokens before creating a new one — prevents token flooding.
  await db.prepare("DELETE FROM password_resets WHERE user_id = ?").run(user.id);

  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
  await db.prepare("INSERT INTO password_resets (token, user_id, expires_at) VALUES (?, ?, ?)").run(
    token,
    user.id,
    expiresAt
  );

  const appUrl = process.env.APP_URL || (process.env.NODE_ENV === "production" ? null : "http://localhost:3000");
  if (!appUrl) {
    console.error("[password-reset] APP_URL env var is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const resetLink = `${appUrl}/reset-password?token=${token}`;

  // Send the reset link via email. In production we never return the link in
  // the response — if an attacker only knows the email, they could take over
  // the account. Never reveal whether sending failed either.
  await sendPasswordResetEmail(email, resetLink);

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: true });
  }

  // Dev convenience: return the link so local testing works without SMTP creds.
  return NextResponse.json({ ok: true, resetLink });
}
