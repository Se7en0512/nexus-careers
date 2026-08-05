import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { verifyCaptcha } from "@/lib/captcha";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  const ip = getClientIp(req);
  if (!(await rateLimit(`login:${ip}`, 10, 15 * 60 * 1000))) {
    return NextResponse.json(
      { error: "Too many attempts — please wait 15 minutes before trying again." },
      { status: 429 }
    );
  }

  const captchaToken = String(data.captcha_token || "");
  if (!(await verifyCaptcha(captchaToken, ip))) {
    return NextResponse.json({ error: "Security check failed. Please try again." }, { status: 403 });
  }

  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");

  const user = (await db.prepare("SELECT id, email, password_hash, name, plan FROM users WHERE email = ?").get(email)) as
    | { id: number; email: string; password_hash: string; name: string; plan: string }
    | undefined;

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
