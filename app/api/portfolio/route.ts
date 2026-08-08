import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordDailyActivity, refreshHireReadyBadge } from "@/lib/gamification";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { logActivity } from "@/lib/activity";
import { slugify, uniqueSlug } from "@/lib/slug";

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
  const tagline = String(data.tagline || "").trim().slice(0, 120);
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

  // Projects (featured work samples)
  const projects = (Array.isArray(data.projects) ? data.projects : [])
    .slice(0, 6)
    .map((p: unknown) => {
      const o = (p ?? {}) as { title?: string; description?: string; role?: string; tools?: string; image?: string; liveUrl?: string; repoUrl?: string };
      return {
        title: String(o.title || "").trim().slice(0, 100),
        description: String(o.description || "").trim().slice(0, 500),
        role: String(o.role || "").trim().slice(0, 100),
        tools: String(o.tools || "").trim().slice(0, 200),
        image: String(o.image || "").trim().slice(0, 300),
        liveUrl: String(o.liveUrl || "").trim().slice(0, 300),
        repoUrl: String(o.repoUrl || "").trim().slice(0, 300),
      };
    })
    .filter((p: { title: string }) => p.title);

  // Theme
  const validThemes = ["minimal", "modern", "creative", "professional"];
  const theme = validThemes.includes(data.theme) ? data.theme : "minimal";

  // Layout
  const validLayouts = ["classic", "services", "resume", "photo-forward"];
  const layout = validLayouts.includes(data.layout) ? data.layout : "classic";

  // Accent color (empty = use theme default; otherwise a 6-digit hex)
  const accentColor =
    typeof data.accent_color === "string" && /^#[0-9a-fA-F]{6}$/.test(data.accent_color) ? data.accent_color : "";
  const resumeUrl = String(data.resume_url || "").trim().slice(0, 500);

  // Trust fields
  const location = String(data.location || "").trim().slice(0, 100);
  const availability = String(data.availability || "").trim().slice(0, 50);
  const languages = (Array.isArray(data.languages) ? data.languages : []).slice(0, 5).map((l: unknown) => String(l).trim().slice(0, 30)).filter(Boolean);
  const timezoneInfo = String(data.timezone_info || "").trim().slice(0, 50);
  const responseTime = String(data.response_time || "").trim().slice(0, 50);
  const avatarUrl = String(data.avatar_url || "").trim().slice(0, 500);

  // Custom slug
  const customSlugRaw = String(data.custom_slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);

  if (links.some((l: { url: string }) => !l.url.startsWith("http"))) {
    return NextResponse.json({ error: "Every link must start with http" }, { status: 400 });
  }

  const existing = (await db.prepare("SELECT id, slug FROM portfolios WHERE user_id = ?").get(user.id)) as
    | { id: number; slug: string }
    | undefined;

  let slug = existing?.slug;
  if (!slug) {
    // New portfolio
    const baseSlug = customSlugRaw || slugify(name);
    slug = await uniqueSlug("portfolios", baseSlug);
    await db.prepare(
      `INSERT INTO portfolios (user_id, slug, name, bio, tagline, skills, experience, links, projects, theme, layout, accent_color, resume_url, custom_slug, location, availability, languages, timezone_info, response_time, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(user.id, slug, name, bio, tagline, JSON.stringify(skills), experience, JSON.stringify(links), JSON.stringify(projects), theme, layout, accentColor, resumeUrl, customSlugRaw, location, availability, JSON.stringify(languages), timezoneInfo, responseTime, avatarUrl);
  } else {
    // Update existing
    let finalSlug = slug!;
    if (customSlugRaw && customSlugRaw !== existing!.slug) {
      finalSlug = await uniqueSlug("portfolios", customSlugRaw, existing!.id);
    }
    await db.prepare(
      `UPDATE portfolios SET slug = ?, name = ?, bio = ?, tagline = ?, skills = ?, experience = ?, links = ?, projects = ?, theme = ?, layout = ?, accent_color = ?, resume_url = ?, custom_slug = ?, location = ?, availability = ?, languages = ?, timezone_info = ?, response_time = ?, avatar_url = ?, updated_at = datetime('now') WHERE user_id = ?`
    ).run(finalSlug, name, bio, tagline, JSON.stringify(skills), experience, JSON.stringify(links), JSON.stringify(projects), theme, layout, accentColor, resumeUrl, customSlugRaw, location, availability, JSON.stringify(languages), timezoneInfo, responseTime, avatarUrl, user.id);
    slug = finalSlug;
  }

  await recordDailyActivity(user.id);
  await refreshHireReadyBadge(user.id);
  await logActivity(user.id, "portfolio_updated", { slug });

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
