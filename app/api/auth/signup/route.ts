import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { verifyCaptcha } from "@/lib/captcha";
import { sendVerificationEmail } from "@/lib/email";
import { EMAIL_VERIFICATION_ENABLED } from "@/lib/feature-flags";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  const ip = getClientIp(req);
  if (!(await rateLimit(`signup:${ip}`, 5, 15 * 60 * 1000))) {
    return NextResponse.json(
      { error: "Too many accounts created from this IP — please wait 15 minutes." },
      { status: 429 }
    );
  }

  const captchaToken = String(data.captcha_token || "");
  if (!(await verifyCaptcha(captchaToken, ip))) {
    return NextResponse.json({ error: "Security check failed. Please try again." }, { status: 403 });
  }

  const name = String(data.name || "").trim().slice(0, 60);
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");
  const updatesOptIn = data.updates_opt_in === true ? 1 : 0;

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
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

  const exists = await db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (exists) {
    return NextResponse.json({ error: "An account already exists for this email. Please sign in." }, { status: 409 });
  }

  // TEMPORARILY DISABLED — auto-verify on signup
  // Re-enable once a verified email domain is configured on Resend.
  const autoVerify = EMAIL_VERIFICATION_ENABLED ? 0 : 1;

  const result = await db
    .prepare("INSERT INTO users (email, password_hash, name, updates_opt_in, email_verified) VALUES (?, ?, ?, ?, ?)")
    .run(email, hashPassword(password), name, updatesOptIn, autoVerify);
  const userId = Number(result.lastInsertRowid);
  await createSession(userId);
  await logActivity(userId, "account_created", { email, name });

  // TEMPORARILY DISABLED — skip verification email
  // Re-enable once a verified email domain is configured on Resend.
  if (EMAIL_VERIFICATION_ENABLED) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await db.prepare("INSERT INTO email_verifications (token, user_id, expires_at) VALUES (?, ?, ?)").run(token, userId, expiresAt);

    const appUrl = process.env.APP_URL || (process.env.NODE_ENV === "production" ? null : "http://localhost:3000");
    if (appUrl) {
      await sendVerificationEmail(email, token, appUrl);
    }
  }

  try {
    await db
      .prepare("INSERT INTO notifications (type, title, message, meta) VALUES (?, ?, ?, ?)")
      .run(
        "signup",
        "New member joined",
        `${name || email} just created an account.`,
        JSON.stringify({ userId, email, name })
      );
  } catch {
    // non-critical
  }

  return NextResponse.json({ ok: true, verified: !!autoVerify });
}
