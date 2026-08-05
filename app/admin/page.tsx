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
        <AdminPanel sites={sites} jobs={jobs} courses={courses} feedback={feedback} notifications={notifications} />
      </div>
    </>
  );
}
