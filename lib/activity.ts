import { db } from "./db";

export type ActivityType =
  | "account_created"
  | "wizard_completed"
  | "quiz_completed"
  | "resume_updated"
  | "portfolio_updated"
  | "roadmap_progress"
  | "certificate_earned"
  | "hire_ready_unlocked"
  | "profile_milestone"
  | "job_applied"
  | "checkin_recorded"
  | "daily_plan_progress";

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  account_created: "Account created",
  wizard_completed: "Welcome Wizard completed",
  quiz_completed: "Completed a quiz",
  resume_updated: "Updated resume",
  portfolio_updated: "Updated portfolio",
  roadmap_progress: "Made roadmap progress",
  certificate_earned: "Earned a certificate",
  hire_ready_unlocked: "Unlocked Hire-Ready badge",
  profile_milestone: "Reached a profile milestone",
  job_applied: "Tracked a job application",
  checkin_recorded: "Recorded weekly check-in",
  daily_plan_progress: "Made progress on 30-Day Plan",
};

export async function logActivity(
  userId: number,
  type: ActivityType,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const title = ACTIVITY_LABELS[type] || type;
    await db
      .prepare("INSERT INTO activity_log (user_id, type, title, metadata) VALUES (?, ?, ?, ?)")
      .run(userId, type, title, JSON.stringify(metadata));
  } catch {
    // non-critical — never break the main flow
  }
}

export async function getRecentActivities(
  userId: number,
  limit: number = 20
): Promise<Array<{ id: number; type: string; title: string; metadata: string; created_at: number }>> {
  return (
    await db
      .prepare("SELECT id, type, title, metadata, created_at FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT ?")
      .all(userId, limit)
  ) as Array<{ id: number; type: string; title: string; metadata: string; created_at: number }>;
}
