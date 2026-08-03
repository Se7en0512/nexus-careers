import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  const ip = getClientIp(req);
  if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts — please wait 15 minutes before trying again." },
      { status: 429 }
    );
  }

  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");

  const user = (await db.prepare("SELECT id, email, password_hash, name, plan FROM users WHERE email = ?").get(email)) as
    | { id: number; email: string; password_hash: string; name: string; plan: string }
    | undefined;

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });
  }

// TODO(email service): once an email provider is set up, require email_verified
  // before allowing login: if (!user.email_verified) return 403 "verify your email first".
  // For now this is NOT required because no verification email is being sent yet.

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
