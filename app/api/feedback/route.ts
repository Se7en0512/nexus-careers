import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const ip = getClientIp(req);
  if (!(await rateLimit(`feedback:${ip}`, 3, 60 * 60 * 1000))) {
    return NextResponse.json(
      { error: "You've already submitted feedback recently — please wait an hour." },
      { status: 429 }
    );
  }

  const data = await req.json().catch(() => null);
  const content = String(data?.content || "").trim().slice(0, 600);
  const rating = Math.min(5, Math.max(1, Math.round(Number(data?.rating) || 5)));
  if (content.length < 10) {
    return NextResponse.json(
      { error: "Feedback must be at least 10 characters." },
      { status: 400 }
    );
  }

  await db.prepare(
    "INSERT INTO feedback (user_id, name, content, rating, status) VALUES (?, ?, ?, ?, 'pending')"
  ).run(user.id, user.name || user.email, content, rating);

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET() {
  const rows = (await db
    .prepare(
      "SELECT name, content, rating, created_at FROM feedback WHERE status = 'published' ORDER BY created_at DESC LIMIT 100"
    )
    .all()) as unknown as Array<{ name: string; content: string; rating: number; created_at: string }>;

  return NextResponse.json(rows);
}
