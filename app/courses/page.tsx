import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import CourseLibrary from "@/components/CourseLibrary";

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
}

export default async function CoursesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/courses");

  const rows = (await db.prepare("SELECT * FROM courses ORDER BY provider, title").all()) as unknown as CourseRow[];
  const courses: CourseRow[] = rows.map((r) => ({ ...r }));

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
        <CourseLibrary courses={courses} />
      </div>
    </>
  );
}
