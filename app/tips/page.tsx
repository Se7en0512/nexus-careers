import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { TIP_GROUPS } from "@/data/tips";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "VA Tips" };

export const dynamic = "force-dynamic";

export default async function TipsPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Tips"
        title="The honest advice no one tells you."
        description="No hype, no 'quit your job in 30 days.' These are the practical things that really decide who gets hired — in the order you'll need them."
        highlights={[
          "Practical advice for every stage of the journey",
          "In the order you'll actually need it",
          "No hype, no get-rich promises",
        ]}
        nextPath="/tips"
      />
    );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Tips</div>
          <h1>The honest advice <em className="italic text-gold-300">no one tells you</em>.</h1>
          <p>
            No hype, no "quit your job in 30 days." These are the practical things that
            really decide who gets hired — in the order you'll need them.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="flex flex-col gap-20">
          {TIP_GROUPS.map((group) => (
            <section key={group.key}>
              <div className="mb-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-3">{group.eyebrow}</p>
                <h2 className="font-serif font-medium text-[28px] mb-3">{group.title}</h2>
                <p className="text-ink-300 max-w-[640px]">{group.lead}</p>
              </div>

              <div className="flex flex-col gap-1 bg-navy-700 border border-navy-700">
                {group.tips.map((t) => (
                  <div key={t.num} className="bg-navy-900 p-6 flex flex-col md:flex-row md:gap-8">
                    <span className="font-mono text-[11px] text-gold-400 w-[36px] flex-shrink-0">{t.num}</span>
                    <div>
                      <h3 className="font-semibold text-[16.5px] mb-1.5">{t.title}</h3>
                      <p className="text-[14px] text-ink-400 leading-relaxed max-w-[620px]">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-20">
          <a href="/apply-here" className="panel p-7 block group">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">Find a job</p>
            <h3 className="font-serif font-medium text-[20px] mb-2 group-hover:text-gold-300 transition-colors">Where to apply</h3>
            <p className="text-[13.5px] text-ink-400">A curated list of legitimate platforms and agencies — marketplaces, job boards, and companies that genuinely hire Filipino VAs.</p>
            <span className="font-mono text-xs text-gold-400 mt-4 inline-block">See the list →</span>
          </a>
          <a href="/get-started" className="panel p-7 block group">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">Not ready yet?</p>
            <h3 className="font-serif font-medium text-[20px] mb-2 group-hover:text-gold-300 transition-colors">Back to Get Started</h3>
            <p className="text-[13.5px] text-ink-400">If you're still building your foundation, follow the roadmap in order — equipment, skill, course, then applications.</p>
            <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Get Started →</span>
          </a>
        </div>
      </div>
    </>
  );
}
