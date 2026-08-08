import { db } from "./db";
import { sendFollowUpReminderEmail } from "./email";

const NON_TERMINAL_STATUSES = ["applied", "interviewing"];

interface ReminderRow {
  id: number;
  email: string;
  company: string;
  role: string;
  applied_date: string;
  follow_up_date: string;
}

function daysSince(dateStr: string): number {
  if (!dateStr) return 0;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date.getTime())) return 0;
  const diff = Date.now() - date.getTime();
  return Math.max(0, Math.floor(diff / (24 * 60 * 60 * 1000)));
}

export async function sendWeeklyFollowUpReminders(): Promise<{ sent: number; skipped: number }> {
  const today = new Date().toISOString().slice(0, 10);

  const rows = (await db
    .prepare(
      `SELECT u.id, u.email, a.company, a.role, a.applied_date, a.follow_up_date
       FROM users u
       JOIN job_applications a ON a.user_id = u.id
       WHERE u.updates_opt_in = 1
         AND a.status IN (${NON_TERMINAL_STATUSES.map(() => "?").join(", ")})
         AND a.follow_up_date IS NOT NULL
         AND a.follow_up_date != ''
         AND a.follow_up_date <= ?
         AND (u.last_reminder_sent_at IS NULL OR u.last_reminder_sent_at != ?)
       ORDER BY u.id`
    )
    .all(...NON_TERMINAL_STATUSES, today, today)) as ReminderRow[];

  const byUser = new Map<number, { email: string; items: Array<{ company: string; role: string; daysSince: number }> }>();
  for (const row of rows) {
    const entry = byUser.get(row.id) || { email: row.email, items: [] };
    entry.items.push({
      company: row.company,
      role: row.role,
      daysSince: daysSince(row.applied_date || row.follow_up_date),
    });
    byUser.set(row.id, entry);
  }

  let sent = 0;
  let skipped = 0;

  for (const [userId, user] of byUser) {
    try {
      const ok = await sendFollowUpReminderEmail(user.email, user.items);
      if (!ok) {
        skipped++;
        continue;
      }
      await db.prepare("UPDATE users SET last_reminder_sent_at = ? WHERE id = ?").run(new Date().toISOString().slice(0, 10), userId);
      sent++;
    } catch (e) {
      console.error("[reminders] Failed to send weekly reminder for user", userId, e);
      skipped++;
    }
  }

  return { sent, skipped };
}
