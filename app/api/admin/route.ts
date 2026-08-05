import { NextResponse } from "next/server";
import { requireUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { NICHE_LEARNING } from "@/data/niche-learning";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const VALID_NICHES = NICHE_LEARNING.map((n) => n.key);

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const ip = getClientIp(req);
  if (!(await rateLimit(`admin:${ip}`, 30, 10 * 60 * 1000))) {
    return NextResponse.json({ error: "Too many requests — please wait 10 minutes." }, { status: 429 });
  }

  const data = await req.json().catch(() => null);
  if (!data?.type) return NextResponse.json({ error: "Missing type" }, { status: 400 });

  if (data.type === "site") {
    const name = String(data.name || "").trim().slice(0, 80);
    const url = String(data.url || "").trim().slice(0, 300);
    const category = String(data.category || "Global Job Board").trim().slice(0, 80);
    const description = String(data.description || "").trim().slice(0, 500);
    const platformType = ["job_board", "marketplace", "agency"].includes(data.platformType)
      ? data.platformType
      : "job_board";
    let nicheTags = "all";
    if (Array.isArray(data.nicheTags) && data.nicheTags.length > 0) {
      nicheTags = JSON.stringify(data.nicheTags.filter((n: unknown) => VALID_NICHES.includes(String(n))));
    }
    if (!name || !url.startsWith("http")) {
      return NextResponse.json({ error: "A name and a valid URL are required" }, { status: 400 });
    }
    await db.prepare(
      "INSERT INTO apply_sites (name, url, category, description, platform_type, niche_tags) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(name, url, category, description, platformType, nicheTags);
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (data.type === "job") {
    const title = String(data.title || "").trim().slice(0, 150);
    const company = String(data.company || "").trim().slice(0, 80);
    const url = String(data.url || "").trim().slice(0, 300);
    const niche = VALID_NICHES.includes(data.niche) ? data.niche : "admin";
    const description = String(data.description || "").trim().slice(0, 500);
    const rateRange = String(data.rateRange || "").trim().slice(0, 60);
    const clientType = ["agency", "direct_client", "marketplace"].includes(data.clientType)
      ? data.clientType
      : "";
    if (!title || !url.startsWith("http")) {
      return NextResponse.json({ error: "A title and a valid URL are required" }, { status: 400 });
    }
    await db.prepare(
      "INSERT INTO jobs (title, company, url, niche, description, source, rate_range, client_type) VALUES (?, ?, ?, ?, ?, 'manual', ?, ?)"
    ).run(title, company, url, niche, description, rateRange, clientType);
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (data.type === "course") {
    const title = String(data.title || "").trim().slice(0, 200);
    const provider = String(data.provider || "").trim().slice(0, 80);
    const url = String(data.url || "").trim().slice(0, 300);
    const description = String(data.description || "").trim().slice(0, 600);
    const badge = ["Free", "Audit", "Trial"].includes(data.badge) ? data.badge : "Free";
    const category = String(data.category || "Marketing").trim().slice(0, 60);
    const difficulty = ["Beginner", "Intermediate", "Advanced"].includes(data.difficulty)
      ? data.difficulty
      : "Beginner";
    if (!title || !url.startsWith("http")) {
      return NextResponse.json({ error: "A title and a valid URL are required" }, { status: 400 });
    }
    await db.prepare(
      "INSERT INTO courses (title, provider, url, description, badge, category, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(title, provider, url, description, badge, category, difficulty);
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (data.type === "feedback") {
    const id = Number(data.id);
    const status = data.status === "published" ? "published" : "rejected";
    const res = await db.prepare("UPDATE feedback SET status = ? WHERE id = ?").run(status, id);
    if (res.changes === 0) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  if (data.type === "config") {
    const key = String(data.key || "").trim();
    const value = String(data.value || "").trim();
    if (!key || !["marquee_text", "paypal_link"].includes(key)) {
      return NextResponse.json({ error: "Invalid config key" }, { status: 400 });
    }
    await db.prepare("INSERT INTO site_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, value);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}

export async function DELETE(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const ip = getClientIp(req);
  if (!(await rateLimit(`admin:${ip}`, 30, 10 * 60 * 1000))) {
    return NextResponse.json({ error: "Too many requests — please wait 10 minutes." }, { status: 429 });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const id = Number(url.searchParams.get("id"));

  if (type === "site") {
    await db.prepare("DELETE FROM apply_sites WHERE id = ? AND url LIKE 'http%'").run(id);
  } else if (type === "job") {
    await db.prepare("DELETE FROM jobs WHERE id = ?").run(id);
  } else if (type === "course") {
    await db.prepare("DELETE FROM courses WHERE id = ?").run(id);
  } else if (type === "feedback") {
    await db.prepare("DELETE FROM feedback WHERE id = ?").run(id);
  } else {
    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
