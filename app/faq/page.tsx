import type { Metadata } from "next";
import { FAQS } from "@/data/faqs";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Questions</div>
          <h1>Answers before you even ask.</h1>
          <p>
            If your question isn't here, just head to the community — we'll answer you
            directly.
          </p>
        </div>
      </section>

      <section className="py-14 pb-24">
        <div className="wrap max-w-[900px]">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="border-b border-navy-700 py-[22px] first:border-t first:border-navy-700 group"
            >
              <summary className="list-none cursor-pointer flex justify-between items-center gap-5 font-semibold text-base [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="font-mono text-lg text-gold-400 flex-shrink-0 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="text-[14.5px] text-ink-300 mt-4 max-w-[680px] leading-[1.65]">{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
