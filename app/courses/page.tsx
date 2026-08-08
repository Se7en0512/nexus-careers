import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import CourseLibrary, { type RecommendedBlock } from "@/components/CourseLibrary";
import LockedPreview from "@/components/LockedPreview";
import { NICHE_LEARNING } from "@/data/niche-learning";

export const metadata: Metadata = { title: "Course Library" };

export const dynamic = "force-dynamic";

interface CourseRow {
  id: number;
  title: string;
  provider: string;
  url: string;
  description: string;
  badge: string;
  category: string;
  difficulty: string;
  related_niches: string;
}

export default async function CoursesPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Course Library"
        title="Free courses with certificates — from real providers."
        description="Curated courses from Google, HubSpot, Microsoft, Coursera, and more. Every free course comes with an official certificate you can link to on LinkedIn."
        highlights={[
          "100% free certificate courses from real providers",
          "Free, audit, and trial options clearly labeled",
          "Certificates you can add straight to LinkedIn",
        ]}
        nextPath="/courses"
      />
    );

  const rows = (await db.prepare("SELECT * FROM courses ORDER BY provider, title").all()) as unknown as CourseRow[];
  const courses: CourseRow[] = rows.map((r) => ({ ...r }));

  const progressRows = (await db
    .prepare("SELECT course_id, status FROM course_progress WHERE user_id = ?")
    .all(user.id)) as Array<{ course_id: number; status: string }>;
  const progress: Record<number, string> = {};
  for (const p of progressRows) progress[p.course_id] = p.status;

  let recommended: RecommendedBlock | null = null;
  const nicheRow = (await db
    .prepare("SELECT niche_preferences FROM users WHERE id = ?")
    .get(user.id)) as { niche_preferences: string } | undefined;
  let nicheKeys: string[] = [];
  try { nicheKeys = nicheRow ? JSON.parse(nicheRow.niche_preferences) : []; } catch { nicheKeys = []; }
  const nicheKey = nicheKeys.find((k) => NICHE_LEARNING.some((n) => n.key === k));
  if (nicheKey) {
    const nicheLabel = NICHE_LEARNING.find((n) => n.key === nicheKey)?.title ?? nicheKey;
    const rec = courses.filter((c) => {
      let tags: string[] = [];
      try { tags = JSON.parse(c.related_niches ?? "[]"); } catch { tags = []; }
      return tags.includes(nicheKey);
    });
    if (rec.length > 0) recommended = { title: nicheLabel, courses: rec };
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Course Library</div>
          <h1>Free courses with <em className="italic text-gold-300">certificates</em> — from real providers.</h1>
          <p>
            {courses.length} curated courses from Google, HubSpot, Microsoft, Coursera, and more.
            Every free course comes with an official certificate you can link to on LinkedIn.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="mb-8 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-500">
          <span className="border border-gold-400 text-gold-300 rounded-full px-3 py-1">Free — free certificate</span>
          <span className="border border-sky-400 text-sky-300 rounded-full px-3 py-1">Audit — free to audit, paid certificate</span>
          <span className="border border-purple-400 text-purple-300 rounded-full px-3 py-1">Trial — limited free period</span>
        </div>
        <CourseLibrary courses={courses} initialProgress={progress} recommended={recommended} />
      </div>
    </>
  );
}
