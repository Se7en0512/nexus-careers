import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import JobsFeed from "@/components/JobsFeed";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "WFH Job Alerts" };

export const dynamic = "force-dynamic";

interface Job {
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

export default async function JobsPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Free Tool · Daily Updates"
        title="Remote job posts — filtered for your niche."
        description="You don't need to visit six job boards every day. Set your niche preferences, and you'll see the roles that match your skills — with a direct link to the platform where you apply."
        highlights={[
          "Jobs pulled from multiple boards into one feed",
          "Ranked according to the niche you choose",
          "Direct link to the platform where you apply",
        ]}
        nextPath="/jobs"
      />
    );

  const rows = (await db
    .prepare("SELECT * FROM jobs ORDER BY created_at DESC")
    .all()) as unknown as Job[];

  const jobs = rows.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    url: j.url,
    niche: j.niche,
    description: j.description,
    source: j.source,
    rate_range: j.rate_range,
    client_type: j.client_type,
    created_at: j.created_at,
  }));

  const prefsRow = (await db
    .prepare("SELECT niche_preferences FROM users WHERE id = ?")
    .get(user.id)) as { niche_preferences: string } | undefined;
  let savedNiches: string[] = [];
  try { savedNiches = prefsRow ? JSON.parse(prefsRow.niche_preferences) : []; } catch { savedNiches = []; }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Free Tool · Daily Updates</div>
          <h1>Remote job posts — filtered for your niche.</h1>
          <p>
            You don't need to visit six job boards every day. Set your niche
            preferences, and you'll see the roles that match your skills here — with a
            direct link to the platform where you apply.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <JobsFeed jobs={jobs} savedNiches={savedNiches} />
      </div>
    </>
  );
}
