import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminPanel from "@/components/AdminPanel";

export const metadata: Metadata = { title: "Admin Panel" };

export const dynamic = "force-dynamic";

interface SiteRow {
  id: number;
  name: string;
  url: string;
  category: string;
  description: string;
  platform_type: string;
  niche_tags: string;
}

interface JobRow {
  id: number;
  title: string;
  company: string;
  url: string;
  niche: string;
  description: string;
  source: string;
  rate_range: string;
  client_type: string;
  created_at: string;
}

interface CourseRow {
  id: number;
  title: string;
  provider: string;
  url: string;
  description: string;
  badge: string;
  category: string;
  difficulty: string;
  created_at: string;
}

interface FeedbackRow {
  id: number;
  name: string;
  content: string;
  rating: number;
  status: string;
  created_at: string;
}

export type AdminSite = SiteRow;
export type AdminJob = JobRow;
export type AdminCourse = CourseRow;
export type AdminFeedback = FeedbackRow;

interface NotificationRow {
  id: number;
  type: string;
  title: string;
  message: string;
  meta: string;
  read: number;
  created_at: string;
}
export type AdminNotification = NotificationRow;

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/admin");
  if (!isAdmin(user)) redirect("/login?next=/admin");

  const siteRows = (await db.prepare("SELECT * FROM apply_sites ORDER BY name").all()) as unknown as SiteRow[];
  const jobRows = (await db.prepare("SELECT * FROM jobs ORDER BY created_at DESC").all()) as unknown as JobRow[];
  const courseRows = (await db.prepare("SELECT * FROM courses ORDER BY provider, title").all()) as unknown as CourseRow[];
  const feedbackRows = (await db
    .prepare("SELECT * FROM feedback ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'published' THEN 1 ELSE 2 END, created_at DESC")
    .all()) as unknown as FeedbackRow[];
  const sites: AdminSite[] = siteRows.map((s) => ({ ...s }));
  const jobs: AdminJob[] = jobRows.map((j) => ({ ...j }));
  const courses: AdminCourse[] = courseRows.map((c) => ({ ...c }));
  const feedback: AdminFeedback[] = feedbackRows.map((f) => ({ ...f }));

  const notifRows = (await db
    .prepare("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50")
    .all()) as unknown as NotificationRow[];
  const notifications: AdminNotification[] = notifRows.map((n) => ({ ...n }));

  const configRows = (await db.prepare("SELECT key, value FROM site_config").all()) as Array<{ key: string; value: string }>;
  const config: Record<string, string> = {};
  for (const r of configRows) config[r.key] = r.value;

  const totalUsers = ((await db.prepare("SELECT COUNT(*) AS n FROM users").get()) as { n: number }).n;
  const thisWeek = ((await db.prepare("SELECT COUNT(*) AS n FROM users WHERE created_at >= datetime('now', '-7 days')").get()) as { n: number }).n;
  const thisMonth = ((await db.prepare("SELECT COUNT(*) AS n FROM users WHERE created_at >= datetime('now', '-30 days')").get()) as { n: number }).n;
  const pendingFeedback = ((await db.prepare("SELECT COUNT(*) AS n FROM feedback WHERE status = 'pending'").get()) as { n: number }).n;

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Admin</div>
          <h1>Admin panel — manage the directory, job posts, course library, and feedback.</h1>
          <p>
            Add platforms to Apply Here, job posts to Job Alerts, free courses to the Course
            Library, and publish or reject site feedback. Every change shows up across the site
            right away.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Users", value: totalUsers, icon: "👤" },
            { label: "This Week", value: thisWeek, icon: "📈" },
            { label: "This Month", value: thisMonth, icon: "📅" },
            { label: "Pending Feedback", value: pendingFeedback, icon: "💬" },
          ].map((stat) => (
            <div key={stat.label} className="panel p-4 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[16px]">{stat.icon}</span>
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500">{stat.label}</span>
              </div>
              <p className="font-serif text-[28px] font-medium text-gold-400">{stat.value}</p>
            </div>
          ))}
        </div>
        <AdminPanel sites={sites} jobs={jobs} courses={courses} feedback={feedback} notifications={notifications} config={config} />
      </div>
    </>
  );
}
