import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { CLOSING_SCRIPTS } from "@/data/closing-scripts";
import CopyScript from "@/components/CopyScript";

export const metadata: Metadata = { title: "Client Closing Scripts" };

export const dynamic = "force-dynamic";

export default async function ClosingScriptsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/closing-scripts");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Interactive Tool · Free</div>
          <h1>Scripts for negotiation, not for guessing.</h1>
          <p>
            The biggest reason new VAs earn low isn't a lack of skills — it's that they don't
            know how to negotiate. Here are scripts you only adapt, not build from scratch.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="flex flex-col gap-8">
          {CLOSING_SCRIPTS.map((s) => (
            <section key={s.key} id={s.key} className="panel p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-5">
                <div className="max-w-[560px]">
                  <h2 className="font-serif font-medium text-[23px] mb-1.5">{s.title}</h2>
                  <p className="text-[14px] text-ink-300">{s.scenario}</p>
                </div>
                <CopyScript script={s.lines.join("\n\n")} />
              </div>
              <div className="flex flex-col gap-2.5">
                {s.lines.map((line, i) => (
                  <p
                    key={i}
                    className={`text-[14px] leading-relaxed rounded-[3px] px-4 py-3 ${
                      i === 0
                        ? "bg-[rgba(217,169,78,0.1)] border-l-2 border-gold-400 text-ink-200"
                        : "bg-navy-950 border border-navy-700 text-ink-300"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <p className="mt-5 text-[13px] text-ink-500 border-t border-navy-700 pt-4">
                <span className="text-gold-400 font-semibold">Why this works: </span>
                {s.tip}
              </p>
            </section>
          ))}
        </div>

        <div className="border-l-2 border-gold-400 pl-5 mt-12 max-w-[640px]">
          <p className="text-[15px] text-ink-300">
            <strong className="text-ink-50">How to use:</strong> copy, replace the
            brackets, and practice reading it out loud until it feels natural. The
            script is a guide — your confidence is what sells.
          </p>
        </div>
      </div>
    </>
  );
}
