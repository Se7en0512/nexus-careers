import type { Metadata } from "next";

export const metadata: Metadata = { title: "Walkthrough — Watch Before You Start" };

export default function WalkthroughPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Video Guide</div>
          <h1>Watch this before you start.</h1>
          <p>
            A full walkthrough of the Nexus Careers roadmap — how to go from zero
            to your first VA client in 30 days. No fluff, just the steps that
            actually work.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="max-w-[800px] mx-auto">
          <div className="aspect-video bg-navy-900 border border-navy-700 rounded-[3px] flex items-center justify-center mb-8">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/i9g56Mu2nag"
              title="Nexus Careers Walkthrough"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <h2 className="font-serif font-medium text-[24px] mb-4">What you will learn</h2>
          <div className="flex flex-col gap-3 mb-8">
            {[
              "How the 4-stage roadmap works and where to start",
              "How to use the Readiness Check to find your starting point",
              "How to build a portfolio that gets you hired",
              "How to write a cover letter and resume that stand out",
              "How to find and apply to 150+ job platforms",
              "How to handle your first client conversation",
              "How to avoid scams and protect yourself",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-gold-400 font-mono text-sm mt-0.5">→</span>
                <span className="text-[14px] text-ink-300">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="/get-started" className="btn-primary !py-[10px] !px-[16px] !text-[12.5px]">
              Start the Roadmap →
            </a>
            <a href="/tools/readiness" className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px]">
              Take the Readiness Check →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}