import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROADMAP } from "@/data/roadmap";
import Checklist from "@/components/Checklist";

export const metadata: Metadata = { title: "Get Started" };

export const dynamic = "force-dynamic";

export default async function GetStartedPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/get-started");
  const progress = user
    ? ((await db
        .prepare("SELECT checks FROM progress WHERE user_id = ?")
        .get(user.id)) as { checks: string } | undefined)
    : undefined;
  let checks: Record<string, number[]> = {};
  if (progress) {
    try {
      checks = JSON.parse(progress.checks) as Record<string, number[]>;
    } catch {
      console.error("Failed to parse progress.checks in get-started");
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Your Path</div>
          <h1>The roadmap, from your first step to your first client.</h1>
          <p>
            Four stages, each with a checklist you can follow and check off.{" "}
            {user ? (
              "Your progress is saved on your dashboard."
            ) : (
              <>
                <Link href="/signup" className="accent-link">Create a free account</Link>{" "}
                to save your progress.
              </>
            )}
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="flex flex-col gap-8">
          {ROADMAP.map((stage) => (
            <section key={stage.key} id={stage.key} className="panel p-8 md:p-10 scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-start md:gap-10">
                <div className="md:w-[220px] md:flex-shrink-0">
                  <div className="w-[34px] h-[34px] rounded-full bg-navy-800 border-[1.5px] border-gold-400 flex items-center justify-center font-mono text-xs text-gold-400 mb-4">
                    {stage.num}
                  </div>
                  <h2 className="font-serif font-medium text-[26px]">{stage.title}</h2>
                  <p className="font-mono text-[11.5px] text-ink-500 mt-2 uppercase tracking-[0.08em]">
                    {stage.timeline}
                  </p>
                </div>
                <div className="flex-1 mt-6 md:mt-0">
                  <p className="text-ink-300 text-[15.5px] max-w-[620px] mb-8">{stage.goal}</p>
                  {user ? (
                    <Checklist
                      stageKey={stage.key}
                      items={stage.items}
                      saved={checks[stage.key] ?? []}
                    />
                  ) : (
                    <ul className="flex flex-col gap-1.5">
                      {stage.items.map((item, i) => (
                        <li key={i} className="flex gap-3 text-[14.5px] text-ink-300 py-1.5 border-b border-navy-700/60">
                          <span className="font-mono text-sm text-ink-500 flex-shrink-0">○</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex gap-6 flex-wrap mt-8 pt-5 border-t border-navy-700">
                    {stage.resources.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        className="font-mono text-xs text-gold-400 hover:text-gold-300 tracking-[0.04em]"
                      >
                        {r.label.toUpperCase()} →
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
