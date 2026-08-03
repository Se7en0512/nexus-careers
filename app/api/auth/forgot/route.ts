import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  const email = String(data?.email || "").trim().toLowerCase();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const ip = getClientIp(req);
  if (!rateLimit(`forgot:${ip}`, 5, 15 * 60 * 1000)) {
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

  const resetLink = `${process.env.APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  // TODO: once an SMTP/mail service exists, send the link here and delete the block below.
  //
  // Security: don't return the reset link in the response in production —
  // if an attacker only knows the email, they could take over the account.
  // In production, the link only goes to the server logs (for the owner to retrieve via an ops tool).
  if (process.env.NODE_ENV === "production") {
    console.error(`[password-reset] ${email}: ${resetLink}`);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true, resetLink });
}
