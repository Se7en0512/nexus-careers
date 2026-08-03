import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NICHE_LEARNING } from "@/data/niche-learning";

const VALID = NICHE_LEARNING.map((n) => n.key);

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const row = (await db.prepare("SELECT niche_preferences FROM users WHERE id = ?").get(user.id)) as
    | { niche_preferences: string }
    | undefined;
  return NextResponse.json({ niches: row ? JSON.parse(row.niche_preferences) : [] });
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const data = await req.json().catch(() => null);
  const niches = (Array.isArray(data?.niches) ? data.niches : [])
    .map((n: unknown) => String(n))
    .filter((n: string) => VALID.includes(n));

  await db.prepare("UPDATE users SET niche_preferences = ? WHERE id = ?").run(
    JSON.stringify(niches),
    user.id
  );
  return NextResponse.json({ ok: true, niches });
}
