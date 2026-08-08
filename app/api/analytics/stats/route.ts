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

  // Clean up stale active users first — must complete before the batch
  // below so the `online` count only includes users seen in the last 5 min.
  await db.prepare("DELETE FROM active_users WHERE last_seen < ?").run(now - 300);

  const [
    onlineRow,
    totalUsersRow,
    todayViewsRow,
    weekViewsRow,
    totalViewsRow,
    topPages,
    todayVisitorsRow,
    dailyTrend,
    yesterdayViewsRow,
    yesterdayVisitorsRow,
  ] = await Promise.all([
    // Online now (active in last 5 minutes)
    db.prepare("SELECT COUNT(*) as n FROM active_users").get(),
    // Total registered users
    db.prepare("SELECT COUNT(*) as n FROM users").get(),
    // Today's page views
    db.prepare("SELECT COUNT(*) as n FROM page_views WHERE created_at >= date('now')").get(),
    // This week's page views
    db.prepare("SELECT COUNT(*) as n FROM page_views WHERE created_at >= datetime('now', '-7 days')").get(),
    // Total page views
    db.prepare("SELECT COUNT(*) as n FROM page_views").get(),
    // Top pages today
    db.prepare("SELECT path, COUNT(*) as views FROM page_views WHERE created_at >= date('now') GROUP BY path ORDER BY views DESC LIMIT 5").all(),
    // Visitors today (unique)
    db.prepare("SELECT COUNT(DISTINCT visitor_id) as n FROM page_views WHERE created_at >= date('now')").get(),
    // Daily views for the last 7 days (trend chart)
    db.prepare(
      "SELECT date(created_at) as day, COUNT(*) as views FROM page_views WHERE created_at >= datetime('now', '-7 days') GROUP BY date(created_at) ORDER BY day ASC"
    ).all(),
    // Yesterday's views, for % change comparison
    db.prepare("SELECT COUNT(*) as n FROM page_views WHERE created_at >= date('now', '-1 day') AND created_at < date('now')").get(),
    // Yesterday's unique visitors
    db.prepare("SELECT COUNT(DISTINCT visitor_id) as n FROM page_views WHERE created_at >= date('now', '-1 day') AND created_at < date('now')").get(),
  ]);

  const online = (onlineRow as { n: number } | undefined)?.n ?? 0;
  const totalUsers = (totalUsersRow as { n: number } | undefined)?.n ?? 0;
  const todayViews = (todayViewsRow as { n: number } | undefined)?.n ?? 0;
  const weekViews = (weekViewsRow as { n: number } | undefined)?.n ?? 0;
  const totalViews = (totalViewsRow as { n: number } | undefined)?.n ?? 0;
  const todayVisitors = (todayVisitorsRow as { n: number } | undefined)?.n ?? 0;
  const yesterdayViews = (yesterdayViewsRow as { n: number } | undefined)?.n ?? 0;
  const yesterdayVisitors = (yesterdayVisitorsRow as { n: number } | undefined)?.n ?? 0;

  // Fill any missing days in the last 7 days with zero views so the
  // chart always has a continuous 7-point series.
  const trendMap = new Map<string, number>();
  for (const row of dailyTrend as Array<{ day: string; views: number }>) {
    trendMap.set(row.day, row.views);
  }
  const dailyTrendFull: Array<{ day: string; views: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    dailyTrendFull.push({ day, views: trendMap.get(day) ?? 0 });
  }

  return NextResponse.json({
    online,
    totalUsers,
    todayViews,
    weekViews,
    totalViews,
    todayVisitors,
    topPages: topPages as Array<{ path: string; views: number }>,
    dailyTrend: dailyTrendFull,
    yesterdayViews,
    yesterdayVisitors,
  });
}