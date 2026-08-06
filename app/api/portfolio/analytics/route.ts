import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const portfolio = (await db.prepare("SELECT id FROM portfolios WHERE user_id = ?").get(user.id)) as { id: number } | undefined;
  if (!portfolio) return NextResponse.json({ views: 0, uniqueVisitors: 0, linkClicks: 0, lastViewed: null, topLinks: [] });

  const [viewsRow, uniqueRow, clicksRow, lastViewedRow, topLinks] = await Promise.all([
    db.prepare("SELECT COUNT(*) AS n FROM portfolio_views WHERE portfolio_id = ?").get(portfolio.id),
    db.prepare("SELECT COUNT(DISTINCT visitor_id) AS n FROM portfolio_views WHERE portfolio_id = ?").get(portfolio.id),
    db.prepare("SELECT COUNT(*) AS n FROM portfolio_link_clicks WHERE portfolio_id = ?").get(portfolio.id),
    db.prepare("SELECT created_at FROM portfolio_views WHERE portfolio_id = ? ORDER BY created_at DESC LIMIT 1").get(portfolio.id),
    db.prepare("SELECT link_label, link_url, COUNT(*) AS clicks FROM portfolio_link_clicks WHERE portfolio_id = ? GROUP BY link_label, link_url ORDER BY clicks DESC LIMIT 5").all(portfolio.id),
  ]);

  return NextResponse.json({
    views: (viewsRow as { n: number }).n,
    uniqueVisitors: (uniqueRow as { n: number }).n,
    linkClicks: (clicksRow as { n: number }).n,
    lastViewed: (lastViewedRow as { created_at: string } | undefined)?.created_at ?? null,
    topLinks: topLinks as Array<{ link_label: string; link_url: string; clicks: number }>,
  });
}
