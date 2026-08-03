import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import JobTracker, { JobApplication } from "@/components/JobTracker";

export const metadata: Metadata = { title: "Job Application Tracker" };

export const dynamic = "force-dynamic";

export default async function JobTrackerPage() {
  const user = await getSessionUser();
  let initialApplications: JobApplication[] = [];
  const isGuest = !user;

  if (user) {
    initialApplications = db
      .prepare("SELECT * FROM job_applications WHERE user_id = ? ORDER BY applied_date DESC, id DESC")
      .all(user.id) as unknown as JobApplication[];
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Free Tool</div>
          <h1>Job Application Tracker</h1>
          <p>
            Don't lose track of your applications. Monitor your applications,
            interviews, and progress so you know where to make adjustments.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <JobTracker initialApplications={initialApplications} isGuest={isGuest} />
      </div>
    </>
  );
}
