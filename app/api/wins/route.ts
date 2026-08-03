import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET() {
  const rows = (await db
    .prepare(
      "SELECT id, name, role, quote, badge, created_at FROM testimonials WHERE status = 'approved' ORDER BY created_at DESC"
    )
    .all()) as unknown as Array<Record<string, unknown>>;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const ip = getClientIp(req);
  if (!rateLimit(`wins:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions — please wait 10 minutes." }, { status: 429 });
  }
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

const name = String(data.name || "").trim().slice(0, 60) || user.name || "Community";
  const role = String(data.role || "").trim().slice(0, 120);
  const quote = String(data.quote || "").trim();

  if (!quote) return NextResponse.json({ error: "Story cannot be blank" }, { status: 400 });
  if (quote.length > 500) return NextResponse.json({ error: "Story is limited to 500 characters" }, { status: 400 });

  await db.prepare("INSERT INTO testimonials (name, role, quote, badge) VALUES (?, ?, ?, 'Community')").run(
    name,
    role,
    quote
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
