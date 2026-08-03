import type { Metadata } from "next";
import { RED_FLAGS, SCAM_STEPS } from "@/data/redflags";

export const metadata: Metadata = { title: "Red Flags & Scams" };

export default function RedFlagsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Real Warning</div>
          <h1>Before you apply anywhere, read this first.</h1>
          <p>
            Not every "job offer" is a real job. These are the patterns we keep
            seeing — not theory, but drawn from the community's actual experiences.
          </p>
        </div>
      </section>

      <section className="py-[72px] border-b border-navy-700">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Patterns to Watch For</div>
            <h2>Six signs you should think about carefully.</h2>
            <p>
              One of these alone doesn't mean it's a scam — but if two or more
              show up in the same offer, be careful.
            </p>
          </div>
          <div className="flex flex-col gap-px bg-navy-700 border border-navy-700">
            {RED_FLAGS.map((f) => (
              <div key={f.num} className="bg-navy-900 p-[26px] grid grid-cols-[44px_1fr] gap-[22px] items-start">
                <div className="w-[30px] h-[30px] rounded-full border border-red-400 text-red-400 font-mono text-[13px] flex items-center justify-center">
                  {f.num}
                </div>
                <div>
                  <h3 className="font-semibold text-[16.5px] mb-2">{f.title}</h3>
                  <p className="text-[14.5px] text-ink-500 max-w-[640px]">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[72px]">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">If It's Happened to You</div>
            <h2>Four steps when you feel something is off.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-navy-700 border border-navy-700">
            {SCAM_STEPS.map((s) => (
              <div key={s.n} className="bg-navy-900 p-[26px]">
                <div className="font-mono text-xs text-gold-400 mb-3.5">{s.n}</div>
                <h3 className="font-semibold text-[15.5px] mb-2">{s.title}</h3>
                <p className="text-[13.5px] text-ink-500">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-[rgba(217,126,107,0.14)] border border-[rgba(217,126,107,0.35)] rounded-md p-6 mt-10">
            <p className="text-[14.5px] text-ink-300">
              <strong className="text-red-400">Remember:</strong> a real client isn't
              too rushed, doesn't ask you to pay, and doesn't get angry
              when you ask questions.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
