import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  if (user.email_verified) {
    return NextResponse.json({ ok: true, message: "Email already verified" });
  }

  // Rate limit: max 3 resend attempts per hour
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateKey = `resend-verify:${user.id}:${ip}`;
  if (!(await rateLimit(rateKey, 3, 60 * 60 * 1000))) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait 1 hour before resending." },
      { status: 429 }
    );
  }

  // Delete old tokens for this user
  await db.prepare("DELETE FROM email_verifications WHERE user_id = ?").run(user.id);

  // Create new token
  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  await db.prepare("INSERT INTO email_verifications (token, user_id, expires_at) VALUES (?, ?, ?)").run(token, user.id, expiresAt);

  const appUrl = process.env.APP_URL || (process.env.NODE_ENV === "production" ? null : "http://localhost:3000");
  if (!appUrl) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const sent = await sendVerificationEmail(user.email, token, appUrl);
  if (!sent) {
    return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Verification email sent!" });
}
