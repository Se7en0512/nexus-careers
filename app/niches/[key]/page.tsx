import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NICHE_DETAILS } from "@/lib/quizzes";

export const dynamic = "force-dynamic";

interface NicheRow {
  key: string;
  title: string;
  overview: string;
  rate_range: string;
  job_titles: string;
}

interface ResourceRow {
  title: string;
  url: string;
  type: string;
  description: string;
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const row = (await db.prepare("SELECT title FROM niches WHERE key = ?").get(key)) as
    | { title: string }
    | undefined;
  return { title: row ? `${row.title} — Niche Learning` : "Niche Learning" };
}

export default async function NicheDetailPage({ params }: { params: Promise<{ key: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/niches");

  const { key } = await params;
  const row = (await db.prepare("SELECT * FROM niches WHERE key = ?").get(key)) as NicheRow | undefined;
  if (!row) notFound();

  const resources = (await db
    .prepare("SELECT title, url, type, description FROM niche_resources WHERE niche_key = ?")
    .all(key)) as unknown as ResourceRow[];

  const jobTitles = JSON.parse(row.job_titles) as string[];
  const details = NICHE_DETAILS[key as keyof typeof NICHE_DETAILS];

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Link href="/niches" className="font-mono text-[12px] text-ink-500 hover:text-gold-400 mb-6 inline-block">
            ← All niches
          </Link>
          <div className="eyebrow">Niche Learning Hub</div>
          <h1>{row.title}</h1>
          <p className="max-w-[640px]">{row.overview}</p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
          <div className="flex flex-col gap-6">
            <section className="panel p-8">
              <h2 className="font-serif font-medium text-[22px] mb-4">What to expect</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 mb-2">Rate range</p>
                  <p className="font-mono text-[15px] text-gold-400">{row.rate_range}</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 mb-2">Job titles</p>
                  <p className="text-[13.5px] text-ink-300">{jobTitles.join(" · ")}</p>
                </div>
              </div>
              {details && (
                <div className="mt-6 border-t border-navy-700 pt-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 mb-2.5">
                    Skills to learn
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {details.skills.map((s) => (
                      <span key={s} className="text-[12.5px] text-ink-300 border border-navy-700 bg-navy-950 rounded-full px-3 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 mb-2">Tools</p>
                  <p className="text-[14px] text-ink-300">{details.tools.join(" · ")}</p>
                </div>
              )}
            </section>

            <section className="panel p-8">
              <h2 className="font-serif font-medium text-[22px] mb-5">Resources — free and curated</h2>
              <div className="flex flex-col gap-3">
                {resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-navy-700 bg-navy-950 hover:border-gold-400 rounded-[3px] px-5 py-4 flex items-start justify-between gap-4 transition-colors"
                  >
                    <div>
                      <p className="text-[14.5px] font-medium">{r.title}</p>
                      <p className="text-[13px] text-ink-500 mt-0.5">{r.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-gold-400 border border-gold-400/50 rounded-full px-2.5 py-0.5">
                        {r.type}
                      </span>
                      <span className="font-mono text-[11px] text-ink-500">OPEN ↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>

          <aside className="panel p-7 lg:sticky lg:top-24">
            <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-gold-400 mb-5">Next steps</h3>
            <div className="flex flex-col gap-3">
              <Link href="/jobs" className="btn-primary text-center">
                Get job alerts for this
              </Link>
              <Link href="/portfolio-builder" className="btn-secondary text-center">
                Build a portfolio for this niche
              </Link>
              <Link href="/tools/niche-finder" className="text-[13.5px] text-gold-400 hover:text-gold-300 text-center">
                Not sure about your niche? → Niche Finder
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
