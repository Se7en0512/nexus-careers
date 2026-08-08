import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Logo from "@/components/Logo";
import PortfolioActions from "@/components/PortfolioActions";
import PortfolioLink from "@/components/PortfolioLink";

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
  layout: string;
  accent_color: string;
  resume_url: string;
  portfolio_views_count: number;
  updated_at: string;
}

const THEME_CLASSES: Record<string, { bg: string; card: string; text: string; accent: string; muted: string }> = {
  minimal: { bg: "bg-white", card: "bg-gray-50 border-gray-200", text: "text-gray-900", accent: "text-amber-600", muted: "text-gray-500" },
  modern: { bg: "bg-gray-950", card: "bg-gray-900 border-gray-700", text: "text-white", accent: "text-amber-400", muted: "text-gray-400" },
  creative: { bg: "bg-purple-950", card: "bg-purple-900/50 border-purple-700", text: "text-purple-50", accent: "text-purple-300", muted: "text-purple-300/60" },
  professional: { bg: "bg-blue-950", card: "bg-blue-900/50 border-blue-700", text: "text-blue-50", accent: "text-blue-300", muted: "text-blue-300/60" },
};

const ACCENT_HEX: Record<string, string> = {
  minimal: "#d97706",
  modern: "#fbbf24",
  creative: "#d8b4fe",
  professional: "#93c5fd",
};

const VALID_LAYOUTS = ["classic", "services", "resume", "photo-forward"];

interface Project {
  title: string;
  description: string;
  role: string;
  tools: string;
  image: string;
  liveUrl: string;
  repoUrl: string;
}

const SERVICE_ICONS = [
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  <svg key="mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg>,
  <svg key="chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 3v18h18" /><path d="M7 13l4-4 3 3 5-6" /></svg>,
  <svg key="pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></svg>,
  <svg key="calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  <svg key="clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
];

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
  let projects: Project[] = [];
  let languages: string[] = [];
  try { skills = JSON.parse(row.skills); } catch { skills = []; }
  try { links = JSON.parse(row.links); } catch { links = []; }
  try { projects = JSON.parse(row.projects || "[]"); } catch { projects = []; }
  try { languages = JSON.parse(row.languages || "[]"); } catch { languages = []; }

  const hireReady = !!(await db
    .prepare("SELECT 1 FROM user_badges WHERE user_id = ? AND badge_type = 'hire_ready'")
    .get(row.user_id));

  const certs = (await db.prepare("SELECT stage_title FROM certificates WHERE user_id = ? ORDER BY date_issued").all(row.user_id)) as Array<{ stage_title: string }>;

  const updated = new Date(row.updated_at + "Z").toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });

  const theme = THEME_CLASSES[row.theme] || THEME_CLASSES.minimal;
  const layout = VALID_LAYOUTS.includes(row.layout) ? row.layout : "classic";
  const accentHex = row.accent_color || ACCENT_HEX[row.theme] || "#d9a94e";

  const contactUrl = (() => {
    const contact = links.find(l =>
      l.url.startsWith("mailto:") || /gmail|outlook|yahoo|email|contact|telegram|viber|whatsapp/i.test(`${l.url} ${l.label}`)
    );
    return (contact || links[0])?.url || null;
  })();

  /* ---------- Shared bits ---------- */

  const Header = (
    <div className="flex items-center justify-between mb-14" style={{ gap: "12px" }}>
      <div className="flex items-center gap-3">
        <Logo size={26} />
        <span className={`font-mono font-semibold text-[13px] tracking-[0.06em] uppercase ${theme.muted}`}>
          Thrive · Portfolio
        </span>
      </div>
      <PortfolioActions slug={slug} />
    </div>
  );

  const FooterBar = (
    <div className={`flex justify-between items-center flex-wrap gap-3 mt-8 font-mono text-[11.5px] ${theme.muted}`}>
      <span>BUILT ON THRIVE</span>
      <span>UPDATED: {updated}</span>
    </div>
  );

  const Badges = (
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
  );

  const SkillPills = ({ compact = false }: { compact?: boolean }) => (
    <>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map(s => (
            <span key={s}
              className={`border rounded-full ${compact ? "text-[12px] px-2.5 py-1" : "text-[13px] px-3.5 py-1.5"} border-current/30 bg-current/5`}
              style={{ color: accentHex }}>
              {s}
            </span>
          ))}
        </div>
      )}
    </>
  );

  const ProjectCard = ({ project, big = false }: { project: Project; big?: boolean }) => (
    <div className={`${theme.card} border rounded-[3px] p-5 space-y-2`}>
      {project.image && (
        <div className={`${big ? "h-44" : "h-32"} bg-navy-800 rounded-[2px] overflow-hidden mb-3`}>
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>
      )}
      <h3 className={`text-[15px] font-semibold ${theme.text}`}>{project.title}</h3>
      {project.role && <p className={`text-[12px]`} style={{ color: accentHex }}>{project.role}</p>}
      {project.description && <p className={`text-[13px] leading-relaxed ${theme.muted}`}>{project.description}</p>}
      {project.tools && <p className={`text-[11px] ${theme.muted}`}>Tools: {project.tools}</p>}
      <div className="flex gap-3 pt-2">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            className={`font-mono text-[11px] hover:underline`} style={{ color: accentHex }}>
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
  );

  const HireButton = ({ size = "normal" }: { size?: "normal" | "large" }) =>
  contactUrl ? (
    <a
      href={contactUrl}
      className={`inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.08em] text-navy-950 font-semibold rounded-[3px] transition-transform ${size === "large" ? "text-[14px] px-8 py-4" : "text-[12px] px-5 py-2.5"}`}
      style={{ backgroundColor: accentHex, color: theme.bg === "bg-white" ? "#1f2937" : "#0b0f1d" }}
    >
      Hire Me
    </a>
  ) : null;

  const ResumeButton = ({ label = "Download Resume" }: { label?: string }) => (
    <a
      href={row.resume_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] border rounded-[3px] px-5 py-2.5 transition-colors`}
      style={{ borderColor: `${accentHex}66`, color: accentHex }}
    >
      {label} ↓
    </a>
  );

  /* ---------- Layouts ---------- */

  const ClassicLayout = (
    <div className={`${theme.card} border rounded-[3px] p-10`}>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        {Badges}
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
      {row.tagline && <p className={`text-[15px] mb-3`} style={{ color: accentHex }}>{row.tagline}</p>}
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
          <SkillPills />
        </div>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <div className="mt-8">
          <h2 className={`font-mono text-[11.5px] uppercase tracking-[0.1em] mb-4 ${theme.muted}`}>Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <ProjectCard key={i} project={project} />
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
              <PortfolioLink key={i} href={l.url} slug={slug} label={l.label || l.url}
                className={`${theme.card} border hover:border-gold-400 px-5 py-3.5 rounded-[3px] flex justify-between items-center transition-colors group`}>
                <span className={`text-[14.5px] font-medium ${theme.text}`}>{l.label || l.url}</span>
                <span className={`font-mono text-xs`} style={{ color: accentHex }}>OPEN ↗</span>
              </PortfolioLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ServicesLayout = (
    <div className={`${theme.card} border rounded-[3px] overflow-hidden`}>
      {/* Hero */}
      <div className="p-10 flex flex-wrap items-center gap-8">
        {row.avatar_url && (
          <img
            src={row.avatar_url}
            alt={`${row.name}'s photo`}
            className="w-[110px] h-[110px] rounded-full object-cover border-4"
            style={{ borderColor: `${accentHex}55` }}
          />
        )}
        <div className="flex-1 min-w-[240px]">
          {Badges}
          <h1 className={`font-serif font-medium text-[clamp(28px,4vw,40px)] mt-3 mb-1 ${theme.text}`}>{row.name}</h1>
          {row.tagline && <p className={`text-[15px] mb-3`} style={{ color: accentHex }}>{row.tagline}</p>}
          {row.bio && <p className={`text-[15px] leading-relaxed max-w-[560px] ${theme.muted}`}>{row.bio}</p>}
          {(contactUrl || row.resume_url) && (
            <div className="flex gap-3 mt-5 flex-wrap">
              {contactUrl && <HireButton />}
              {row.resume_url && <ResumeButton />}
            </div>
          )}
        </div>
      </div>

      {/* Services */}
      {skills.length > 0 && (
        <div className="px-10 pb-10">
          <h2 className={`font-mono text-[11.5px] uppercase tracking-[0.1em] mb-4 ${theme.muted}`}>Services I Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((s, i) => (
              <div key={s} className={`${theme.card} border rounded-[3px] p-5 flex items-start gap-3`}>
                <span className="mt-0.5 flex-shrink-0" style={{ color: accentHex }}>
                  {SERVICE_ICONS[i % SERVICE_ICONS.length]}
                </span>
                <div>
                  <h3 className={`text-[14px] font-semibold ${theme.text}`}>{s}</h3>
                  <p className={`text-[11.5px] mt-1 ${theme.muted}`}>On-demand for your business</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Work */}
      {projects.length > 0 && (
        <div className="px-10 pb-10">
          <h2 className={`font-mono text-[11.5px] uppercase tracking-[0.1em] mb-4 ${theme.muted}`}>Recent Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <ProjectCard key={i} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {row.experience && (
        <div className="px-10 pb-10">
          <h2 className={`font-mono text-[11.5px] uppercase tracking-[0.1em] mb-3 ${theme.muted}`}>Experience</h2>
          <p className={`text-[14.5px] leading-relaxed whitespace-pre-wrap max-w-[640px] ${theme.muted}`}>{row.experience}</p>
        </div>
      )}

      {/* Closing CTA band */}
      {(contactUrl || row.resume_url) && (
        <div className="px-10 py-10 border-t text-center" style={{ borderColor: `${accentHex}44`, background: `${accentHex}0f` }}>
          <h2 className={`font-serif font-medium text-[clamp(22px,3vw,30px)] mb-1 ${theme.text}`}>
            Let's get you the support you need
          </h2>
          <p className={`text-[13.5px] ${theme.muted} mb-6 max-w-[480px] mx-auto`}>
            {row.tagline || `Ready to help — starting with ${skills[0] || "a conversation"}.`}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {contactUrl && <HireButton size="large" />}
            {row.resume_url && <ResumeButton />}
          </div>
        </div>
      )}
    </div>
  );

  const ResumeLayout = (
    <div className={`${theme.card} rounded-[3px] grid grid-cols-1 md:grid-cols-[280px_1fr]`}>
      {/* Sidebar */}
      <aside className="p-6 md:p-5 space-y-5 border-b md:border-b-0 md:border-r" style={{ borderColor: `${accentHex}44` }}>
        {row.avatar_url ? (
          <img
            src={row.avatar_url}
            alt={`${row.name}'s photo`}
            className="w-24 h-24 rounded-lg object-cover"
            style={{ border: `2px solid ${accentHex}66` }}
          />
        ) : (
          <div className="w-24 h-24 rounded-lg flex items-center justify-center font-serif text-[34px]" style={{ backgroundColor: `${accentHex}22`, color: accentHex }}>
            {(row.name || "T").trim().charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          {Badges}
          <h1 className={`font-serif font-medium text-[24px] mt-2 ${theme.text}`}>{row.name}</h1>
          {row.tagline && <p className={`text-[13px] mt-1`} style={{ color: accentHex }}>{row.tagline}</p>}
        </div>

        {(row.location || row.availability || row.timezone_info || row.response_time || languages.length > 0) && (
          <div>
            <h2 className={`font-mono text-[10.5px] uppercase tracking-[0.1em] mb-2.5 ${theme.muted}`}>Details</h2>
            <dl className="space-y-1.5 text-[12px]">
              {row.location && <div><dt className={`inline ${theme.muted}`}>📍 Location: </dt><dd className="inline-block">{row.location}</dd></div>}
              {row.availability && <div><dt className={`inline ${theme.muted}`}>🟢 Availability: </dt><dd className="inline-block">{row.availability}</dd></div>}
              {row.timezone_info && <div><dt className={`inline ${theme.muted}`}>🕐 Timezone: </dt><dd className="inline-block">{row.timezone_info}</dd></div>}
              {row.response_time && <div><dt className={`inline ${theme.muted}`}>⚡ Response: </dt><dd className="inline-block">{row.response_time}</dd></div>}
              {languages.length > 0 && <div><dt className={`inline ${theme.muted}`}>🌐 Languages: </dt><dd className="inline-block">{languages.join(", ")}</dd></div>}
            </dl>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className={`font-mono text-[10.5px] uppercase tracking-[0.1em] mb-2.5 ${theme.muted}`}>Skills</h2>
            <SkillPills compact />
          </div>
        )}

        {links.length > 0 && (
          <div>
            <h2 className={`font-mono text-[10.5px] uppercase tracking-[0.1em] mb-2.5 ${theme.muted}`}>Links</h2>
            <div className="flex flex-col gap-1.5">
              {links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                  className={`text-[12.5px] hover:underline truncate`} style={{ color: accentHex }}>
                  {l.label || l.url} ↗
                </a>
              ))}
            </div>
          </div>
        )}

        {row.resume_url && (
          <a href={row.resume_url} target="_blank" rel="noopener noreferrer"
            className={`block w-full text-center font-mono text-[12px] uppercase tracking-[0.08em] border rounded-[3px] px-4 py-2.5 transition-colors`}
            style={{ borderColor: `${accentHex}66`, color: accentHex }}>
            Download Resume ↓
          </a>
        )}
      </aside>

      {/* Main column — dense */}
      <main className="p-6 md:p-8 space-y-6">
        {row.bio && (
          <section>
            <h2 className={`font-mono text-[10.5px] uppercase tracking-[0.1em] mb-2.5 ${theme.muted}`}>About</h2>
            <p className={`text-[13.5px] leading-relaxed ${theme.muted}`}>{row.bio}</p>
          </section>
        )}
        {row.experience && (
          <section>
            <h2 className={`font-mono text-[10.5px] uppercase tracking-[0.1em] mb-2.5 ${theme.muted}`}>Experience</h2>
            <p className={`text-[13px] leading-relaxed whitespace-pre-wrap ${theme.muted}`}>{row.experience}</p>
          </section>
        )}
        {projects.length > 0 && (
          <section>
            <h2 className={`font-mono text-[10.5px] uppercase tracking-[0.1em] mb-3 ${theme.muted}`}>Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map((project, i) => (
                <div key={i} className={`${theme.card} border rounded-[3px] p-4 space-y-1.5`}>
                  {project.image && (
                    <div className="h-24 bg-navy-800 rounded-[2px] overflow-hidden mb-2">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className={`text-[13.5px] font-semibold ${theme.text}`}>{project.title}</h3>
                  {project.role && <p className={`text-[11px]`} style={{ color: accentHex }}>{project.role}</p>}
                  {project.description && <p className={`text-[12px] leading-relaxed ${theme.muted}`}>{project.description}</p>}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`font-mono text-[10.5px] hover:underline inline-block`} style={{ color: accentHex }}>
                      Live Project ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );

  const PhotoLayout = (
    <div>
      {/* Cover banner */}
      <div className="h-52 rounded-[3px]" style={{ background: `linear-gradient(135deg, ${accentHex}cc, ${accentHex}11)` }} />

      {/* Overlapping avatar */}
      <div className="flex justify-center -mt-16 mb-4">
        {row.avatar_url ? (
          <img
            src={row.avatar_url}
            alt={`${row.name}'s photo`}
            className="w-[140px] h-[140px] rounded-full object-cover border-4"
            style={{ borderColor: theme.bg === "bg-white" ? "#ffffff" : "#111827" }}
          />
        ) : (
          <div className="w-[140px] h-[140px] rounded-full flex items-center justify-center font-serif text-[56px] border-4"
            style={{ backgroundColor: `${accentHex}22`, color: accentHex, borderColor: theme.bg === "bg-white" ? "#ffffff" : "#111827" }}>
            {(row.name || "T").trim().charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="text-center max-w-[600px] mx-auto">
        <div className="flex justify-center">{Badges}</div>
        <h1 className={`font-serif font-medium text-[clamp(32px,5vw,48px)] mt-3 mb-2 ${theme.text}`}>{row.name}</h1>
        {row.tagline && <p className={`text-[16px]`} style={{ color: accentHex }}>{row.tagline}</p>}
        {row.bio && <p className={`text-[15.5px] leading-relaxed mt-3 ${theme.muted}`}>{row.bio}</p>}
      </div>

      {/* Skills row */}
      {skills.length > 0 && (
        <div className="mt-7 flex overflow-x-auto gap-2 pb-2 justify-start md:justify-center">
          {skills.map(s => (
            <span key={s} className={`text-[12.5px] border rounded-full px-4 py-1.5 flex-shrink-0 bg-current/5`}
              style={{ color: accentHex, borderColor: `${accentHex}55` }}>
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mt-10">
          <h2 className={`font-mono text-[11.5px] uppercase tracking-[0.1em] mb-4 text-center ${theme.muted}`}>Recent Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project, i) => (
              <ProjectCard key={i} project={project} big />
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {row.experience && (
        <div className="mt-10">
          <h2 className={`font-mono text-[11.5px] uppercase tracking-[0.1em] mb-3 text-center ${theme.muted}`}>Experience</h2>
          <p className={`text-[14.5px] leading-relaxed whitespace-pre-wrap max-w-[640px] mx-auto text-center ${theme.muted}`}>{row.experience}</p>
        </div>
      )}

      {/* Trust + contact */}
      <div className="mt-10">
        <div className="flex flex-wrap gap-4 justify-center text-[12px] mb-7">
          {row.location && <span className={theme.muted}>📍 {row.location}</span>}
          {row.availability && <span className={theme.muted}>🟢 {row.availability}</span>}
          {row.timezone_info && <span className={theme.muted}>🕐 {row.timezone_info}</span>}
          {row.response_time && <span className={theme.muted}>⚡ {row.response_time}</span>}
          {languages.length > 0 && <span className={theme.muted}>🌐 {languages.join(", ")}</span>}
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          {contactUrl && <HireButton size="large" />}
          {row.resume_url && <ResumeButton />}
        </div>
        {links.length > 0 && (
          <div className="flex gap-3 justify-center flex-wrap mt-6">
            {links.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                className={`font-mono text-[11.5px] border rounded-full px-4 py-2 transition-colors hover:underline`}
                style={{ color: accentHex, borderColor: `${accentHex}44` }}>
                {l.label || "Link"} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} py-16 px-8`}>
      <div className={layout === "resume" ? "max-w-[980px] mx-auto" : "max-w-[760px] mx-auto"}>
        {Header}
        {layout === "services" && ServicesLayout}
        {layout === "resume" && ResumeLayout}
        {layout === "photo-forward" && PhotoLayout}
        {layout === "classic" && (
          <div className={`max-w-[760px]`}>
            {ClassicLayout}
          </div>
        )}
        {FooterBar}
      </div>
    </div>
  );
}