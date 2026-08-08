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

const NOW = [
  "13+ free tools — resume builder, cover letter generator, invoice generator, rate card, pitch calculator, mock interview, niche finder, red flag checker, and more.",
  "A full roadmap from zero experience to your first client, plus a day-by-day 30-day plan.",
  "A shareable portfolio builder with photo upload and resume auto-fill.",
  "An AI career assistant that answers questions about rates, negotiation, and interviews.",
  "Scam protection: a dedicated Red Flags guide and an in-tool checker for suspicious offers.",
  "Courses, tutorials, templates, closing scripts, and a niche explorer — all free, no credit card, no trial that expires.",
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
            <div className="eyebrow">What's Here Right Now</div>
            <h2>No made-up numbers — here's what actually exists.</h2>
          </div>
          <div className="flex flex-col gap-4 mt-9 max-w-[680px]">
            {NOW.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="text-gold-400 font-mono text-[13px] mt-0.5 flex-shrink-0">✓</span>
                <p className="text-[15px] text-ink-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[76px] border-t border-navy-700">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Get in Touch</div>
            <h2>Questions, feedback, or ideas?</h2>
          </div>
          <p className="text-[15px] text-ink-300 leading-relaxed max-w-[680px] mt-5">
            We read everything that comes in — email or Facebook, both work.
          </p>
          <div className="flex flex-col gap-3 mt-6">
            <p className="text-[15px] text-ink-300">
              <a href="mailto:thrive.va.2026@gmail.com" className="accent-link">
                thrive.va.2026@gmail.com
              </a>
            </p>
            <p className="text-[15px] text-ink-300">
              <a
                href="https://www.facebook.com/profile.php?id=61593070227652"
                target="_blank"
                rel="noopener noreferrer"
                className="accent-link"
              >
                Follow us on Facebook
              </a>
            </p>
          </div>
          <p className="text-[13.5px] text-ink-500 leading-relaxed mt-5 max-w-[680px]">
            And if you've got your own project running — a website, a system,
            something real — we're open to hearing about it. Same email.
          </p>
        </div>
      </section>
    </>
  );
}
