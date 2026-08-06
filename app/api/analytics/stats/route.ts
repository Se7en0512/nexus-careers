import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser, isAdmin } from "@/lib/auth";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const now = Math.floor(Date.now() / 1000);

  // Clean up stale active users first
  await db.prepare("DELETE FROM active_users WHERE last_seen < ?").run(now - 300);

  // Online now (active in last 5 minutes)
  const online = ((await db.prepare("SELECT COUNT(*) as n FROM active_users").get()) as { n: number }).n;

  // Total registered users
  const totalUsers = ((await db.prepare("SELECT COUNT(*) as n FROM users").get()) as { n: number }).n;

  // Today's page views
  const todayViews = ((await db.prepare(
    "SELECT COUNT(*) as n FROM page_views WHERE created_at >= date('now')"
  ).get()) as { n: number }).n;

  // This week's page views
  const weekViews = ((await db.prepare(
    "SELECT COUNT(*) as n FROM page_views WHERE created_at >= datetime('now', '-7 days')"
  ).get()) as { n: number }).n;

  // Total page views
  const totalViews = ((await db.prepare("SELECT COUNT(*) as n FROM page_views").get()) as { n: number }).n;

  // Top pages today
  const topPages = (await db.prepare(
    "SELECT path, COUNT(*) as views FROM page_views WHERE created_at >= date('now') GROUP BY path ORDER BY views DESC LIMIT 5"
  ).all()) as Array<{ path: string; views: number }>;

  // Visitors today (unique)
  const todayVisitors = ((await db.prepare(
    "SELECT COUNT(DISTINCT visitor_id) as n FROM page_views WHERE created_at >= date('now')"
  ).get()) as { n: number }).n;

  return NextResponse.json({
    online,
    totalUsers,
    todayViews,
    weekViews,
    totalViews,
    todayVisitors,
    topPages,
  });
}
