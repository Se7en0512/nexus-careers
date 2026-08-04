import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

const VALUES = [
  {
    tag: "Transparency",
    title: "Clear pricing",
    body: "If something costs money, we'll say right away what you're paying for — nothing hidden in the fine print.",
  },
  {
    tag: "Truth",
    title: "We don't promise instant success",
    body: "Everyone moves at their own pace. Our job is to prepare you, not to promise outcomes.",
  },
  {
    tag: "Protection",
    title: "Your safety comes first",
    body: "That's why we have a dedicated Red Flags page — because not getting scammed matters more than getting hired fast.",
  },
];

const STATS = [
  { num: "1,240+", label: "Community members" },
  { num: "45", label: "Active resources" },
  { num: "2026", label: "Year of launch" },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">About Us</div>
          <h1 className="italic">Why we built this — and why it's not all promises.</h1>
          <p>
            There's no face or name behind Thrive because it isn't about
            one person. It's about a system that wants to make clear something
            that's usually made confusing.
          </p>
        </div>
      </section>

      <section className="py-[76px] border-b border-navy-700">
        <div className="wrap max-w-[680px]">
          <div className="eyebrow">The Beginning</div>
          <h2 className="font-serif font-medium text-[28px] my-3.5 mb-6">How this roadmap was made.</h2>
          <div className="flex flex-col gap-[18px] text-[15.5px] text-ink-300">
            <p>
              The steps here weren't taken from a generic online list. They were built
              from the real questions that keep coming up with new VAs — where
              they get stuck, which patterns keep repeating in scams, and what
              information is missing from other sites.
            </p>
            <p>
              Every roadmap stage is tested and updated based on community
              feedback. When a new scam pattern or a recurring question
              keeps coming up, it gets added to the resources.
            </p>
          </div>
        </div>
      </section>

      <section className="py-[76px] border-b border-navy-700">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">What We Stand For</div>
            <h2>Three things we won't compromise on.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-navy-700 border border-navy-700">
            {VALUES.map((v) => (
              <div key={v.tag} className="bg-navy-900 p-7">
                <span className="font-mono text-[11px] text-gold-400 tracking-[0.08em] uppercase block mb-3.5">
                  {v.tag}
                </span>
                <h3 className="font-semibold text-base mb-2.5">{v.title}</h3>
                <p className="text-sm text-ink-500">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[76px]">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Current Status</div>
            <h2>Clear numbers, no fluff.</h2>
          </div>
          <div className="flex gap-10 flex-wrap mt-9">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-mono text-[26px] font-semibold text-gold-400">{s.num}</div>
                <div className="text-[13px] text-ink-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
