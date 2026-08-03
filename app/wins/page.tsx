import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import WinForm from "@/components/WinForm";

export const metadata: Metadata = { title: "Wins" };

export const dynamic = "force-dynamic";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  badge: string;
  created_at: string;
}

export default async function WinsPage() {
  const user = await getSessionUser();
  const wins = db
    .prepare(
      "SELECT id, name, role, quote, badge, created_at FROM testimonials WHERE status = 'approved' ORDER BY created_at DESC"
    )
    .all() as unknown as Testimonial[];

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Wins</div>
          <h1>Proof that this path works.</h1>
          <p>
            Before anything is shown, here's our promise: we show real stories — not made-up
            testimonials to make the pitch look good.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        {wins.length <= 2 ? (
          <div className="panel p-8 md:p-10 bg-gold-50 border-gold-400/40 mb-10">
            <p className="font-serif text-[18px] italic text-ink-800 max-w-[520px] mb-5">
              You'll be the first story here — share it when your first client arrives.
            </p>
            {user ? (
              <a href="#win-form" className="btn-primary inline-block">
                Share my story
              </a>
            ) : (
              <a href="/signup" className="btn-primary inline-block">
                Create an account to share yours
              </a>
            )}
          </div>
        ) : null}

        {wins.length > 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-navy-700 border border-navy-700 mb-14">
            {wins.map((w) => (
              <figure key={w.id} className="bg-navy-900 p-8 flex flex-col">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-5">
                  {w.badge}
                </span>
                <blockquote className="text-[15px] text-ink-300 leading-relaxed flex-1">
                  "{w.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-navy-700 pt-4">
                  <span className="font-semibold text-[14.5px]">{w.name}</span>
                  <span className="block text-[13px] text-ink-500">{w.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}

        {user ? (
          <div id="win-form">
            <WinForm />
          </div>
        ) : (
          <div className="border-l-2 border-gold-400 pl-5 max-w-[640px]">
            <p className="text-[15px] text-ink-300">
              Got a story — first client, first month, first rate increase?{" "}
              <a href="/signup" className="accent-link">Create an account</a> or{" "}
              <a href="/login" className="accent-link">log in</a> to share your win.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
