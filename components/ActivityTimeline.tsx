import { db } from "@/lib/db";
import EmptyState from "@/components/EmptyState";

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  metadata: string;
  created_at: number;
}

function timeAgo(unixSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - unixSeconds;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  const days = Math.floor(diff / 86400);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "Last week";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

function groupByTime(items: ActivityItem[]): Array<{ label: string; items: ActivityItem[] }> {
  const now = Math.floor(Date.now() / 1000);
  const groups: Array<{ label: string; items: ActivityItem[] }> = [];

  const today: ActivityItem[] = [];
  const yesterday: ActivityItem[] = [];
  const thisWeek: ActivityItem[] = [];
  const older: ActivityItem[] = [];

  for (const item of items) {
    const diff = now - item.created_at;
    if (diff < 86400) today.push(item);
    else if (diff < 172800) yesterday.push(item);
    else if (diff < 604800) thisWeek.push(item);
    else older.push(item);
  }

  if (today.length) groups.push({ label: "Today", items: today });
  if (yesterday.length) groups.push({ label: "Yesterday", items: yesterday });
  if (thisWeek.length) groups.push({ label: "This Week", items: thisWeek });
  if (older.length) groups.push({ label: "Earlier", items: older });

  return groups;
}

const TYPE_ICONS: Record<string, string> = {
  account_created: "🎉",
  wizard_completed: "✨",
  quiz_completed: "📝",
  resume_updated: "📄",
  portfolio_updated: "💼",
  roadmap_progress: "🗺️",
  certificate_earned: "🏆",
  hire_ready_unlocked: "🏅",
  profile_milestone: "⭐",
  job_applied: "📤",
  checkin_recorded: "✅",
  daily_plan_progress: "📅",
};

export default async function ActivityTimeline({ userId }: { userId: number }) {
  const rows = (await db
    .prepare(
      "SELECT id, type, title, metadata, created_at FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 15"
    )
    .all(userId)) as ActivityItem[];

  if (rows.length === 0) {
    return (
      <EmptyState
        icon="🚀"
        title="No activity yet"
        description="Start your VA journey and your progress will appear here."
        action={{ label: "START YOUR JOURNEY →", href: "/get-started" }}
      />
    );
  }

  const groups = groupByTime(rows);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500 mb-3">
            {group.label}
          </p>
          <div className="space-y-0">
            {group.items.map((item, i) => (
              <div key={item.id} className="flex items-start gap-3 py-2.5 border-l border-navy-700 pl-4 relative">
                <div className="absolute left-[-5px] top-3.5 w-[9px] h-[9px] rounded-full bg-gold-400 border-2 border-navy-900" />
                <span className="text-[16px] mt-0.5 shrink-0">{TYPE_ICONS[item.type] || "📌"}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] text-ink-50 leading-snug">{item.title}</p>
                  <p className="font-mono text-[10.5px] text-ink-500 mt-0.5">{timeAgo(item.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
