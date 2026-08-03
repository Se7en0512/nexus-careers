import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { NICHES, NICHE_DETAILS } from "@/lib/quizzes";

export const metadata: Metadata = { title: "VA Niches" };

export const dynamic = "force-dynamic";

export default async function NichesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/niches");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">VA Niches</div>
          <h1>Specialization isn't a prison — it's what raises your rate.</h1>
          <p>
            The generic "virtual assistant" has a lot of competition. A niche gives you a
            clearer path, an easier pitch, and a higher rate. Here are the six most common
            specializations for Filipino VAs — including the real income range.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(NICHE_DETAILS).map(([key, d], idx) => (
            <section key={key} className="panel p-8 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-gold-400">0{idx + 1}</span>
                <Link
                  href={`/niches/${key}`}
                  className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 border border-gold-400/50 rounded-full px-2.5 py-0.5 hover:bg-[rgba(217,169,78,0.12)] transition-colors"
                >
                  {NICHES[key as keyof typeof NICHES]} → Learning Hub
                </Link>
              </div>
              <h2 className="font-serif font-medium text-[24px] mb-3">{NICHES[key as keyof typeof NICHES]}</h2>
              <p className="text-[14.5px] text-ink-300 mb-6">{d.desc}</p>

              <div className="mb-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 mb-2.5">
                  Skills to learn
                </p>
                <div className="flex flex-wrap gap-2">
                  {d.skills.map((s) => (
                    <span key={s} className="text-[12.5px] text-ink-300 border border-navy-700 bg-navy-950 rounded-full px-3 py-1">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 mb-2.5">
                  Tools you'll use
                </p>
                <p className="text-[14px] text-ink-300">{d.tools.join(" · ")}</p>
              </div>

              <div className="mt-auto border-t border-navy-700 pt-4 flex items-center justify-between flex-wrap gap-3">
                <span className="font-mono text-[13px] text-gold-400">{d.rate}</span>
                <span className="font-mono text-[11px] text-ink-500">
                  Fits you if this is what you already do every day
                </span>
              </div>
            </section>
          ))}
        </div>

        <div className="border-l-2 border-gold-400 pl-5 mt-12 max-w-[640px]">
          <p className="text-[15px] text-ink-300">
            <strong className="text-ink-50">You don't have to choose right away.</strong>{" "}
            Many VAs start with admin support, then find which part they enjoy most. If you're
            not sure where to start, use the{" "}
            <a href="/tools/niche-finder" className="accent-link">Niche Finder</a>.
          </p>
        </div>
      </div>
    </>
  );
}
