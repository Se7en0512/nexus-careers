import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLAN_30 } from "@/data/plan30";
import DayChecklist from "@/components/DayChecklist";

export const metadata: Metadata = { title: "30-Day Plan" };

export const dynamic = "force-dynamic";

export default async function Plan30Page() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/30-day-plan");

  const rows = db
    .prepare("SELECT day, done FROM daily_plan_progress WHERE user_id = ? AND done = 1")
    .all(user.id) as unknown as Array<{ day: number }>;
  const saved = rows.map((r) => r.day);

  const weeks = [1, 8, 15, 22, 29];

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Free Tool · Day-by-Day Guide</div>
          <h1>The 30-day plan — day by day, not phase by phase.</h1>
          <p>
            The four phases are the map. This 30-day plan is the step-by-step — what you'll do
            on Day 3, on Day 7, on Day 21. Check off each day and stay true to the plan.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          <aside className="panel p-6 lg:sticky lg:top-24">
            <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-gold-400 mb-5">
              The Weeks
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { week: "Week 1", days: "Day 1–7", label: "Foundation & Setup", desc: "Email, drive, community, internet." },
                { week: "Week 2", days: "Day 8–14", label: "Assess & Skills", desc: "Quizzes, workspace, tools practice." },
                { week: "Week 3", days: "Day 15–20", label: "Ready to Apply", desc: "Portfolio, resume, pitch, verification." },
                { week: "Week 4", days: "Day 21–30", label: "Apply & Follow Up", desc: "13+ applications and interviews." },
              ].map((w, i) => (
                <div key={w.week} className="border-l border-navy-700 pl-4">
                  <p className="font-mono text-[11px] text-ink-500">{w.days}</p>
                  <p className="text-[14px] font-semibold mt-0.5">{w.label}</p>
                  <p className="text-[12.5px] text-ink-500 mt-0.5">{w.desc}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-700 mt-6 pt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 mb-3">
                Extra help
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/closing-scripts" className="text-[13.5px] text-gold-400 hover:text-gold-300">
                  Closing Scripts →
                </Link>
                <Link href="/apply-here" className="text-[13.5px] text-gold-400 hover:text-gold-300">
                  Apply Here →
                </Link>
                <Link href="/templates" className="text-[13.5px] text-gold-400 hover:text-gold-300">
                  Templates →
                </Link>
              </div>
            </div>
          </aside>

          <div>
            <DayChecklist saved={saved} />
          </div>
        </div>
      </div>
    </>
  );
}
