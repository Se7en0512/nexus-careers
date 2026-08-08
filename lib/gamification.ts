import { db } from "./db";
import { ROADMAP } from "@/data/roadmap";
import { logActivity } from "./activity";

export function phDateStr(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function phDateDaysAgo(days: number): string {
  return phDateStr(new Date(Date.now() - days * 86400000));
}

export function phWeekStart(d: Date = new Date()): string {
  const ph = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  const day = ph.getDay();
  const diff = (day + 6) % 7; // Monday = 0
  ph.setDate(ph.getDate() - diff);
  return phDateStr(ph);
}

export async function recordWeeklyCheckin(userId: number, applicationsSent: number, note: string = ""): Promise<void> {
  const week = phWeekStart();
  const apps = Math.max(0, Math.min(999, applicationsSent));
  await db.prepare(
    `INSERT INTO weekly_checkins (user_id, week_start, applications_sent, note) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, week_start) DO UPDATE SET
       applications_sent = excluded.applications_sent,
       note = excluded.note`
  ).run(userId, week, apps, note.trim().slice(0, 500));
}

export async function getCheckinStreak(userId: number): Promise<number> {
  const rows = (await db
    .prepare("SELECT week_start FROM weekly_checkins WHERE user_id = ? ORDER BY week_start DESC")
    .all(userId)) as Array<{ week_start: string }>;

  let streak = 0;
  const anchor = phWeekStart();
  const currentWeek = new Date(anchor);
  for (const row of rows) {
    const expected = new Date(currentWeek);
    if (row.week_start !== phDateStr(expected)) break;
    streak++;
    currentWeek.setDate(currentWeek.getDate() - 7);
  }
  return streak;
}

export async function hasCheckedInThisWeek(userId: number): Promise<boolean> {
  const week = phWeekStart();
  return !!(await db.prepare("SELECT 1 FROM weekly_checkins WHERE user_id = ? AND week_start = ?").get(userId, week));
}

/* ================= STREAK ================= */

export async function recordDailyActivity(userId: number) {
  const today = phDateStr();
  const row = (await db
    .prepare("SELECT current_streak, longest_streak, last_activity_date FROM user_streaks WHERE user_id = ?")
    .get(userId)) as
    | { current_streak: number; longest_streak: number; last_activity_date: string | null }
    | undefined;

  if (!row) {
    await db.prepare(
      "INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date) VALUES (?, 1, 1, ?)"
    ).run(userId, today);
    return;
  }
  if (row.last_activity_date === today) return;

  const next = row.last_activity_date === phDateDaysAgo(1) ? row.current_streak + 1 : 1;
  const longest = Math.max(row.longest_streak, next);
  await db.prepare(
    "UPDATE user_streaks SET current_streak = ?, longest_streak = ?, last_activity_date = ? WHERE user_id = ?"
  ).run(next, longest, today, userId);
}

export async function getStreak(
  userId: number
): Promise<{ current_streak: number; longest_streak: number; last_activity_date: string | null }> {
  const row = (await db
    .prepare("SELECT current_streak, longest_streak, last_activity_date FROM user_streaks WHERE user_id = ?")
    .get(userId)) as
    | { current_streak: number; longest_streak: number; last_activity_date: string | null }
    | undefined;
  return row ?? { current_streak: 0, longest_streak: 0, last_activity_date: null };
}

/* ================= HIRE-READY BADGE ================= */

export type RoadmapChecks = Record<string, number[]>;

export interface HireReadyCache {
  checks: RoadmapChecks;
  vaScore: number;
  portfolioExists: boolean;
  certCount: number;
}

export function computeRoadmapCompletion(checks: RoadmapChecks): { complete: boolean; pct: number } {
  const totalItems = ROADMAP.reduce((a, s) => a + s.items.length, 0);
  const totalDone = ROADMAP.reduce((a, s) => a + (checks[s.key]?.length || 0), 0);
  return { complete: totalItems > 0 && totalDone >= totalItems, pct: totalItems ? Math.round((totalDone / totalItems) * 100) : 0 };
}

async function fetchRoadmapChecks(userId: number): Promise<RoadmapChecks> {
  const progress = (await db.prepare("SELECT checks FROM progress WHERE user_id = ?").get(userId)) as
    | { checks: string }
    | undefined;
  let checks: RoadmapChecks = {};
  try { checks = progress ? JSON.parse(progress.checks) : {}; } catch { checks = {}; }
  return checks;
}

export async function roadmapCompletion(userId: number, checks?: RoadmapChecks): Promise<{ complete: boolean; pct: number }> {
  return checks
    ? computeRoadmapCompletion(checks)
    : computeRoadmapCompletion(await fetchRoadmapChecks(userId));
}

export function computeHireReady(cached: Partial<HireReadyCache>): boolean {
  if (!computeRoadmapCompletion(cached.checks ?? {}).complete) return false;
  if ((cached.vaScore ?? 0) < 80) return false;
  if ((cached.certCount ?? 0) < 1) return false;
  return !!cached.portfolioExists;
}

export async function isHireReady(userId: number, cached?: Partial<HireReadyCache>): Promise<boolean> {
  if (cached) return computeHireReady(cached);
  if (!(await roadmapCompletion(userId)).complete) return false;
  const vaRow = (await db.prepare("SELECT va_score FROM users WHERE id = ?").get(userId)) as { va_score: number } | undefined;
  if ((vaRow?.va_score ?? 0) < 80) return false;
  const certRow = (await db.prepare("SELECT COUNT(*) AS n FROM certificates WHERE user_id = ?").get(userId)) as { n: number } | undefined;
  if ((certRow?.n ?? 0) < 1) return false;
  return !!(await db.prepare("SELECT 1 FROM portfolios WHERE user_id = ?").get(userId));
}

export async function refreshHireReadyBadge(userId: number, cached?: Partial<HireReadyCache>): Promise<boolean> {
  if (!(await isHireReady(userId, cached))) return false;
  const existing = await db.prepare("SELECT 1 FROM user_badges WHERE user_id = ? AND badge_type = 'hire_ready'").get(userId);
  await db.prepare("INSERT OR IGNORE INTO user_badges (user_id, badge_type) VALUES (?, 'hire_ready')").run(userId);
  if (!existing) {
    await logActivity(userId, "hire_ready_unlocked");
  }
  return true;
}

export async function hasBadge(userId: number, badgeType: string): Promise<boolean> {
  return !!(await db.prepare("SELECT 1 FROM user_badges WHERE user_id = ? AND badge_type = ?").get(userId, badgeType));
}
