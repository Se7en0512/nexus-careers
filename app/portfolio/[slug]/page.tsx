import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Logo from "@/components/Logo";

export const dynamic = "force-dynamic";

interface PortfolioRow {
  user_id: number;
  name: string;
  bio: string;
  skills: string;
  experience: string;
  links: string;
  updated_at: string;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const row = (await db.prepare("SELECT name FROM portfolios WHERE slug = ?").get(slug)) as
    | { name: string }
    | undefined;
  return { title: row ? `${row.name} — Portfolio` : "Portfolio" };
}

export default async function PublicPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = (await db.prepare("SELECT * FROM portfolios WHERE slug = ?").get(slug)) as PortfolioRow | undefined;
  if (!row) notFound();

  let skills: string[] = [];
  let links: { label: string; url: string }[] = [];
  try { skills = JSON.parse(row.skills); } catch { skills = []; }
  try { links = JSON.parse(row.links); } catch { links = []; }
  const hireReady = !!(await db
    .prepare("SELECT 1 FROM user_badges WHERE user_id = ? AND badge_type = 'hire_ready'")
    .get(row.user_id));
  const updated = new Date(row.updated_at + "Z").toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="py-16 px-8">
      <div className="max-w-[760px] mx-auto">
        <div className="flex items-center gap-3 mb-14">
          <Logo size={26} />
          <span className="font-mono font-semibold text-[13px] tracking-[0.06em] uppercase">
            Thrive · Portfolio
          </span>
        </div>

        <div className="panel p-10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="eyebrow">// Portfolio</div>
            {hireReady && (
              <span className="font-mono text-[10.5px] text-navy-950 bg-gold-400 rounded-full px-2.5 py-1 font-semibold uppercase tracking-[0.08em]">
                Hire-Ready ✓
              </span>
            )}
          </div>
          <h1 className="font-serif font-medium text-[clamp(30px,4vw,44px)] mt-4 mb-3">{row.name}</h1>
          <p className="text-[16.5px] text-ink-300 leading-relaxed max-w-[560px]">{row.bio}</p>

          {skills.length > 0 && (
            <div className="mt-8">
              <h2 className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-ink-500 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="text-[13px] text-gold-300 border border-gold-400/40 bg-[rgba(217,169,78,0.16)] rounded-full px-3.5 py-1.5"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {row.experience && (
            <div className="mt-8">
              <h2 className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-ink-500 mb-3">Experience</h2>
              <p className="text-[14.5px] text-ink-300 leading-relaxed whitespace-pre-wrap">{row.experience}</p>
            </div>
          )}

          {links.length > 0 && (
            <div className="mt-8">
              <h2 className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-ink-500 mb-3">Sample Work</h2>
              <div className="flex flex-col gap-2">
                {links.map((l, i) => (
                  <a
                    key={i}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-navy-600 bg-navy-900 hover:border-gold-400 px-5 py-3.5 rounded-[3px] flex justify-between items-center transition-colors"
                  >
                    <span className="text-[14.5px] font-medium">{l.label || l.url}</span>
                    <span className="font-mono text-xs text-gold-400">OPEN ↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center flex-wrap gap-3 mt-8 font-mono text-[11.5px] text-ink-500">
          <span>BUILT ON NEXUS CAREERS</span>
          <span>UPDATED: {updated}</span>
        </div>
      </div>
    </div>
  );
}
