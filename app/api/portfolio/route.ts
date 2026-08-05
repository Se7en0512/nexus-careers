import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordDailyActivity, refreshHireReadyBadge } from "@/lib/gamification";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "va";
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 2;
  while (await db.prepare("SELECT 1 FROM portfolios WHERE slug = ?").get(slug)) {
    slug = `${base}-${n}`;
    n++;
  }
  return slug;
}

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const row = await db.prepare("SELECT * FROM portfolios WHERE user_id = ?").get(user.id);
  return NextResponse.json(row ?? null);
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const ip = getClientIp(req);
  if (!(await rateLimit(`portfolio:${ip}`, 10, 10 * 60 * 1000))) {
    return NextResponse.json({ error: "Too many requests — please wait 10 minutes." }, { status: 429 });
  }
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  const name = String(data.name || "").trim().slice(0, 60) || user.name || user.email;
  const bio = String(data.bio || "").trim().slice(0, 1000);
  const skills = (Array.isArray(data.skills) ? data.skills : []).slice(0, 15).map((s: unknown) =>
    String(s).trim().slice(0, 40)
  ).filter(Boolean);
  const experience = String(data.experience || "").trim().slice(0, 2000);
  const links = (Array.isArray(data.links) ? data.links : [])
    .slice(0, 6)
    .map((l: unknown) => {
      const o = (l ?? {}) as { label?: string; url?: string };
      return { label: String(o.label || "").trim().slice(0, 60), url: String(o.url || "").trim().slice(0, 300) };
    })
    .filter((l: { url: string }) => l.url);

  if (links.some((l: { url: string }) => !l.url.startsWith("http"))) {
    return NextResponse.json({ error: "Every link must start with http" }, { status: 400 });
  }

  const existing = (await db.prepare("SELECT id, slug FROM portfolios WHERE user_id = ?").get(user.id)) as
    | { id: number; slug: string }
    | undefined;

  let slug = existing?.slug;
  if (!slug) {
    slug = await uniqueSlug(slugify(name));
    await db.prepare(
      "INSERT INTO portfolios (user_id, slug, name, bio, skills, experience, links) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(user.id, slug, name, bio, JSON.stringify(skills), experience, JSON.stringify(links));
  } else {
    await db.prepare(
      "UPDATE portfolios SET name = ?, bio = ?, skills = ?, experience = ?, links = ?, updated_at = datetime('now') WHERE user_id = ?"
    ).run(name, bio, JSON.stringify(skills), experience, JSON.stringify(links), user.id);
  }

  await recordDailyActivity(user.id);
  await refreshHireReadyBadge(user.id);

  return NextResponse.json({ ok: true, slug }, { status: 200 });
}

export async function DELETE() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  await db.prepare("DELETE FROM portfolios WHERE user_id = ?").run(user.id);
  return NextResponse.json({ ok: true });
}
