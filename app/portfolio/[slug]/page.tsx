import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Logo from "@/components/Logo";
import PortfolioActions from "@/components/PortfolioActions";

export const dynamic = "force-dynamic";

interface PortfolioRow {
  user_id: number;
  name: string;
  bio: string;
  skills: string;
  experience: string;
  links: string;
  projects: string;
  theme: string;
  tagline: string;
  location: string;
  availability: string;
  languages: string;
  timezone_info: string;
  response_time: string;
  avatar_url: string;
  portfolio_views_count: number;
  updated_at: string;
}

const THEME_CLASSES: Record<string, { bg: string; card: string; text: string; accent: string; muted: string }> = {
  minimal: { bg: "bg-white", card: "bg-gray-50 border-gray-200", text: "text-gray-900", accent: "text-amber-600", muted: "text-gray-500" },
  modern: { bg: "bg-gray-950", card: "bg-gray-900 border-gray-700", text: "text-white", accent: "text-amber-400", muted: "text-gray-400" },
  creative: { bg: "bg-purple-950", card: "bg-purple-900/50 border-purple-700", text: "text-purple-50", accent: "text-purple-300", muted: "text-purple-300/60" },
  professional: { bg: "bg-blue-950", card: "bg-blue-900/50 border-blue-700", text: "text-blue-50", accent: "text-blue-300", muted: "text-blue-300/60" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const row = (await db.prepare("SELECT name, bio, tagline FROM portfolios WHERE slug = ?").get(slug)) as
    | { name: string; bio: string; tagline: string }
    | undefined;
  if (!row) return { title: "Portfolio" };
  return {
    title: `${row.name} — Portfolio`,
    description: row.bio || row.tagline || `${row.name}'s portfolio on Thrive PH`,
    openGraph: { title: `${row.name} — Portfolio`, description: row.bio || row.tagline || "", type: "profile" },
  };
}

export default async function PublicPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = (await db.prepare("SELECT * FROM portfolios WHERE slug = ?").get(slug)) as PortfolioRow | undefined;
  if (!row) notFound();

  let skills: string[] = [];
  let links: { label: string; url: string }[] = [];
  let projects: Array<{ title: string; description: string; role: string; tools: string; image: string; liveUrl: string; repoUrl: string }> = [];
  let languages: string[] = [];
  try { skills = JSON.parse(row.skills); } catch { skills = []; }
  try { links = JSON.parse(row.links); } catch { links = []; }
  try { projects = JSON.parse(row.projects || "[]"); } catch { projects = []; }
  try { languages = JSON.parse(row.languages || "[]"); } catch { languages = []; }

  const hireReady = !!(await db
    .prepare("SELECT 1 FROM user_badges WHERE user_id = ? AND badge_type = 'hire_ready'")
    .get(row.user_id));

  // Get certificates
  const certs = (await db.prepare("SELECT stage_title FROM certificates WHERE user_id = ? ORDER BY date_issued").all(row.user_id)) as Array<{ stage_title: string }>;

  const updated = new Date(row.updated_at + "Z").toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });

  const theme = THEME_CLASSES[row.theme] || THEME_CLASSES.minimal;

  return (
    <div className={`min-h-screen ${theme.bg} py-16 px-8`}>
      <div className="max-w-[760px] mx-auto">
        <div className="flex items-center justify-between mb-14">
          <div className="flex items-center gap-3">
            <Logo size={26} />
            <span className={`font-mono font-semibold text-[13px] tracking-[0.06em] uppercase ${theme.muted}`}>
              Thrive · Portfolio
            </span>
          </div>
          <PortfolioActions slug={slug} />
        </div>

        <div className={`${theme.card} border rounded-[3px] p-10`}>
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3">
            {hireReady && (
              <span className="font-mono text-[10.5px] text-navy-950 bg-gold-400 rounded-full px-2.5 py-1 font-semibold uppercase tracking-[0.08em]">
                Hire-Ready ✓
              </span>
            )}
            {certs.length > 0 && (
              <span className="font-mono text-[10.5px] text-green-400 border border-green-500/30 bg-green-500/10 rounded-full px-2.5 py-1">
                {certs.length} Certificate{certs.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {row.avatar_url && (
            <div className="mt-4">
              <img
                src={row.avatar_url}
                alt={`${row.name}'s photo`}
                className="w-[120px] h-[120px] rounded-full object-cover border-4 border-white/20 shadow-lg"
              />
            </div>
          )}

          <h1 className={`font-serif font-medium text-[clamp(30px,4vw,44px)] mt-4 mb-2 ${theme.text}`}>{row.name}</h1>
          {row.tagline && <p className={`text-[15px] ${theme.accent} mb-3`}>{row.tagline}</p>}
          {row.bio && <p className={`text-[16.5px] leading-relaxed max-w-[560px] ${theme.muted}`}>{row.bio}</p>}

          {/* Trust Signals */}
          <div className="flex flex-wrap gap-4 mt-6 text-[12px]">
            {row.location && <span className={theme.muted}>📍 {row.location}</span>}
            {row.availability && <span className={theme.muted}>🟢 {row.availability}</span>}
            {row.timezone_info && <span className={theme.muted}>🕐 {row.timezone_info}</span>}
            {row.response_time && <span className={theme.muted}>⚡ {row.response_time}</span>}
            {languages.length > 0 && <span className={theme.muted}>🌐 {languages.join(", ")}</span>}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mt-8">
              <h2 className={`font-mono text-[11.5px] uppercase tracking-[0.1em] mb-3 ${theme.muted}`}>Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s} className={`text-[13px] border rounded-full px-3.5 py-1.5 ${theme.accent} border-current/30 bg-current/5`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Featured Projects */}
          {projects.length > 0 && (
            <div className="mt-8">
              <h2 className={`font-mono text-[11.5px] uppercase tracking-[0.1em] mb-4 ${theme.muted}`}>Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, i) => (
                  <div key={i} className={`${theme.card} border rounded-[3px] p-5 space-y-2`}>
                    {project.image && (
                      <div className="h-32 bg-navy-800 rounded-[2px] overflow-hidden mb-3">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h3 className={`text-[15px] font-semibold ${theme.text}`}>{project.title}</h3>
                    {project.role && <p className={`text-[12px] ${theme.accent}`}>{project.role}</p>}
                    {project.description && <p className={`text-[13px] leading-relaxed ${theme.muted}`}>{project.description}</p>}
                    {project.tools && <p className={`text-[11px] ${theme.muted}`}>Tools: {project.tools}</p>}
                    <div className="flex gap-3 pt-2">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          className={`font-mono text-[11px] ${theme.accent} hover:underline`}>
                          Live Project ↗
                        </a>
                      )}
                      {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                          className={`font-mono text-[11px] ${theme.muted} hover:underline`}>
                          Source Code ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {row.experience && (
            <div className="mt-8">
              <h2 className={`font-mono text-[11.5px] uppercase tracking-[0.1em] mb-3 ${theme.muted}`}>Experience</h2>
              <p className={`text-[14.5px] leading-relaxed whitespace-pre-wrap ${theme.muted}`}>{row.experience}</p>
            </div>
          )}

          {/* Sample Work Links */}
          {links.length > 0 && (
            <div className="mt-8">
              <h2 className={`font-mono text-[11.5px] uppercase tracking-[0.1em] mb-3 ${theme.muted}`}>Sample Work</h2>
              <div className="flex flex-col gap-2">
                {links.map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                    className={`${theme.card} border hover:border-gold-400 px-5 py-3.5 rounded-[3px] flex justify-between items-center transition-colors group`}
                    onClick={() => {
                      try {
                        fetch("/api/portfolio/click", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ slug, linkLabel: l.label, linkUrl: l.url }),
                        });
                      } catch {}
                    }}>
                    <span className={`text-[14.5px] font-medium ${theme.text}`}>{l.label || l.url}</span>
                    <span className={`font-mono text-xs ${theme.accent}`}>OPEN ↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-between items-center flex-wrap gap-3 mt-8 font-mono text-[11.5px] ${theme.muted}`}>
          <span>BUILT ON THRIVE</span>
          <span>UPDATED: {updated}</span>
        </div>
      </div>
    </div>
  );
}
