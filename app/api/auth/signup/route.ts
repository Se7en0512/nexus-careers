import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  const ip = getClientIp(req);
  if (!rateLimit(`signup:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many accounts created from this IP — please wait 15 minutes." },
      { status: 429 }
    );
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
  if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
    return NextResponse.json({ error: "Password must contain a mix of letters and numbers" }, { status: 400 });
  }

  const exists = await db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (exists) {
    return NextResponse.json({ error: "An account already exists for this email. Please sign in." }, { status: 409 });
  }

  const result = await db
    .prepare("INSERT INTO users (email, password_hash, name, updates_opt_in) VALUES (?, ?, ?, ?)")
    .run(email, hashPassword(password), name, updatesOptIn);
  const userId = Number(result.lastInsertRowid);
  await createSession(userId);

  return NextResponse.json({ ok: true });
}
