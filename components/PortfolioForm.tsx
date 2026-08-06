"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getPortfolioStrength, type PortfolioStrengthResult } from "@/lib/portfolio-strength";
import Button from "@/components/Button";

interface Project {
  title: string;
  description: string;
  role: string;
  tools: string;
  image: string;
  liveUrl: string;
  repoUrl: string;
}

interface PortfolioData {
  name: string;
  bio: string;
  skills: string[];
  experience: string;
  links: { label: string; url: string }[];
  projects?: Project[];
  theme?: string;
  custom_slug?: string;
  tagline?: string;
  location?: string;
  availability?: string;
  languages?: string[];
  timezone_info?: string;
  response_time?: string;
}

interface PortfolioFormProps {
  initial: PortfolioData | null;
  currentSlug?: string | null;
}

const THEMES = [
  { key: "minimal", label: "Minimal", icon: "◻️", colors: "bg-white text-gray-900" },
  { key: "modern", label: "Modern", icon: "◼️", colors: "bg-gray-900 text-white" },
  { key: "creative", label: "Creative", icon: "🎨", colors: "bg-purple-900 text-purple-50" },
  { key: "professional", label: "Professional", icon: "💼", colors: "bg-blue-900 text-blue-50" },
];

const IMPRESSION_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "needs-improvement": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  "good": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  "excellent": { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
};

export default function PortfolioForm({ initial, currentSlug }: PortfolioFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name || "");
  const [bio, setBio] = useState(initial?.bio || "");
  const [tagline, setTagline] = useState(initial?.tagline || "");
  const [skillsInput, setSkillsInput] = useState((initial?.skills || []).join(", "));
  const [experience, setExperience] = useState(initial?.experience || "");
  const [links, setLinks] = useState<{ label: string; url: string }[]>(
    initial?.links?.length ? initial.links : [{ label: "", url: "" }]
  );
  const [projects, setProjects] = useState<Project[]>(
    initial?.projects?.length ? initial.projects : []
  );
  const [theme, setTheme] = useState(initial?.theme || "minimal");
  const [customSlug, setCustomSlug] = useState(initial?.custom_slug || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [availability, setAvailability] = useState(initial?.availability || "");
  const [languagesInput, setLanguagesInput] = useState((initial?.languages || []).join(", "));
  const [timezoneInfo, setTimezoneInfo] = useState(initial?.timezone_info || "");
  const [responseTime, setResponseTime] = useState(initial?.response_time || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [savedSlug, setSavedSlug] = useState<string | null>(currentSlug || null);
  const [activeTab, setActiveTab] = useState<"content" | "projects" | "trust" | "theme">("content");

  const parsedSkills = useMemo(() =>
    skillsInput.split(",").map(s => s.trim()).filter(Boolean),
    [skillsInput]
  );

  const parsedLanguages = useMemo(() =>
    languagesInput.split(",").map(s => s.trim()).filter(Boolean),
    [languagesInput]
  );

  // Live portfolio strength calculation
  const strength: PortfolioStrengthResult = useMemo(() => getPortfolioStrength({
    name,
    bio,
    skills: parsedSkills,
    experience,
    links: links.filter(l => l.url),
    projects,
    tagline,
    location,
    availability,
    languages: parsedLanguages,
    timezone_info: timezoneInfo,
    response_time: responseTime,
  }), [name, bio, parsedSkills, experience, links, projects, tagline, location, availability, parsedLanguages, timezoneInfo, responseTime]);

  const updateLink = (idx: number, field: "label" | "url", value: string) => {
    setLinks(ls => ls.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };
  const addLink = () => setLinks(ls => [...ls, { label: "", url: "" }]);
  const removeLink = (idx: number) => setLinks(ls => ls.filter((_, i) => i !== idx));

  const updateProject = (idx: number, field: keyof Project, value: string) => {
    setProjects(ps => ps.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };
  const addProject = () => setProjects(ps => [...ps, { title: "", description: "", role: "", tools: "", image: "", liveUrl: "", repoUrl: "" }]);
  const removeProject = (idx: number) => setProjects(ps => ps.filter((_, i) => i !== idx));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          tagline,
          skills: parsedSkills,
          experience,
          links: links.filter(l => l.url.trim()),
          projects: projects.filter(p => p.title.trim()),
          theme,
          custom_slug: customSlug,
          location,
          availability,
          languages: parsedLanguages,
          timezone_info: timezoneInfo,
          response_time: responseTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setSavedSlug(data.slug);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const impressionStyle = IMPRESSION_STYLES[strength.impression] || IMPRESSION_STYLES["needs-improvement"];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
      {/* FORM */}
      <form onSubmit={submit} className="flex flex-col gap-5">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-navy-800 rounded-[3px] p-1">
          {(["content", "projects", "trust", "theme"] as const).map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-[2px] text-[12px] font-mono uppercase tracking-wider transition-colors ${
                activeTab === tab ? "bg-gold-400 text-navy-950" : "text-ink-500 hover:text-ink-300"
              }`}>
              {tab === "content" ? "Content" : tab === "projects" ? "Projects" : tab === "trust" ? "Trust" : "Theme"}
            </button>
          ))}
        </div>

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <>
            <div>
              <label className="form-label" htmlFor="pf-name">Name</label>
              <input id="pf-name" className="field" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Maria Santos" required />
            </div>
            <div>
              <label className="form-label" htmlFor="pf-tagline">Tagline (optional)</label>
              <input id="pf-tagline" className="field" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="e.g. Executive Assistant | Calendar & Email Management" maxLength={120} />
              <p className="font-mono text-[10px] text-ink-500 mt-1">A short line that appears under your name</p>
            </div>
            <div>
              <label className="form-label" htmlFor="pf-bio">Bio</label>
              <textarea id="pf-bio" className="field min-h-[100px] resize-y" value={bio} onChange={e => setBio(e.target.value)} placeholder="What do you do, what kind of clients do you work with, and what's your work style?" maxLength={1000} />
              <p className="font-mono text-[10px] text-ink-500 mt-1">{bio.length}/1000</p>
            </div>
            <div>
              <label className="form-label" htmlFor="pf-skills">Skills (comma-separated)</label>
              <input id="pf-skills" className="field" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} placeholder="e.g. email management, calendar, data entry, Canva" />
              <p className="font-mono text-[10px] text-ink-500 mt-1">{parsedSkills.length}/15 skills</p>
            </div>
            <div>
              <label className="form-label" htmlFor="pf-exp">Experience</label>
              <textarea id="pf-exp" className="field min-h-[90px] resize-y" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 1 year of admin support for 2 clients. Managed email and calendar for a real estate CEO." maxLength={2000} />
              <p className="font-mono text-[10px] text-ink-500 mt-1">{experience.length}/2000</p>
            </div>
            <div>
              <label className="form-label">Sample work / links</label>
              <div className="flex flex-col gap-2">
                {links.map((l, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2">
                    <input className="field" placeholder="Label (e.g. Portfolio PDF)" value={l.label} onChange={e => updateLink(i, "label", e.target.value)} />
                    <input className="field" placeholder="https://..." value={l.url} onChange={e => updateLink(i, "url", e.target.value)} />
                    <button type="button" onClick={() => removeLink(i)} className="btn-danger !py-[10px] !px-[14px] !text-[12px]" aria-label="Remove">✕</button>
                  </div>
                ))}
                <button type="button" onClick={addLink} className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px] self-start">+ Add link</button>
              </div>
            </div>
          </>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <>
            <p className="text-[13.5px] text-ink-500">Featured projects make your portfolio stand out. Each project shows your role, tools, and results.</p>
            {projects.map((project, i) => (
              <div key={i} className="border border-navy-700 rounded-[3px] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gold-400">PROJECT {i + 1}</span>
                  <button type="button" onClick={() => removeProject(i)} className="text-[11px] text-red-400 hover:text-red-300">Remove</button>
                </div>
                <input className="field" placeholder="Project title" value={project.title} onChange={e => updateProject(i, "title", e.target.value)} />
                <textarea className="field min-h-[60px] resize-y" placeholder="What did you do? What was the result?" value={project.description} onChange={e => updateProject(i, "description", e.target.value)} maxLength={500} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="field" placeholder="Your role (e.g. Designer)" value={project.role} onChange={e => updateProject(i, "role", e.target.value)} />
                  <input className="field" placeholder="Tools used (e.g. Canva, Figma)" value={project.tools} onChange={e => updateProject(i, "tools", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input className="field" placeholder="Thumbnail URL (optional)" value={project.image} onChange={e => updateProject(i, "image", e.target.value)} />
                  <input className="field" placeholder="Live project URL" value={project.liveUrl} onChange={e => updateProject(i, "liveUrl", e.target.value)} />
                </div>
                <input className="field" placeholder="Repository URL (optional)" value={project.repoUrl} onChange={e => updateProject(i, "repoUrl", e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={addProject} className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px] self-start">+ Add project</button>
          </>
        )}

        {/* TRUST TAB */}
        {activeTab === "trust" && (
          <>
            <p className="text-[13.5px] text-ink-500">These details build trust with clients. The more you add, the more credible you look.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="pf-location">Location</label>
                <input id="pf-location" className="field" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Manila, Philippines" />
              </div>
              <div>
                <label className="form-label" htmlFor="pf-availability">Availability</label>
                <input id="pf-availability" className="field" value={availability} onChange={e => setAvailability(e.target.value)} placeholder="e.g. Full-time, Part-time" />
              </div>
              <div>
                <label className="form-label" htmlFor="pf-timezone">Timezone</label>
                <input id="pf-timezone" className="field" value={timezoneInfo} onChange={e => setTimezoneInfo(e.target.value)} placeholder="e.g. GMT+8 (Philippines)" />
              </div>
              <div>
                <label className="form-label" htmlFor="pf-response">Response Time</label>
                <input id="pf-response" className="field" value={responseTime} onChange={e => setResponseTime(e.target.value)} placeholder="e.g. Within 24 hours" />
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="pf-languages">Languages (comma-separated)</label>
              <input id="pf-languages" className="field" value={languagesInput} onChange={e => setLanguagesInput(e.target.value)} placeholder="e.g. English, Filipino, Spanish" />
            </div>
          </>
        )}

        {/* THEME TAB */}
        {activeTab === "theme" && (
          <>
            <p className="text-[13.5px] text-ink-500">Choose a look for your public portfolio page. Content stays the same.</p>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map(t => (
                <button key={t.key} type="button" onClick={() => setTheme(t.key)}
                  className={`text-left p-4 rounded-[3px] border transition-colors ${
                    theme === t.key ? "border-gold-400 bg-gold-400/10" : "border-navy-700 bg-navy-900 hover:border-navy-600"
                  }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[18px]">{t.icon}</span>
                    <span className="text-[13px] font-medium">{t.label}</span>
                  </div>
                  <div className={`h-8 rounded ${t.colors}`} />
                </button>
              ))}
            </div>
            <div>
              <label className="form-label" htmlFor="pf-slug">Custom URL slug</label>
              <div className="flex items-center gap-0">
                <span className="font-mono text-[12px] text-ink-500 bg-navy-800 px-3 py-[10px] border border-r-0 border-navy-700 rounded-l-[3px]">/portfolio/</span>
                <input id="pf-slug" className="field !rounded-l-none flex-1" value={customSlug} onChange={e => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder={slugify(name)} maxLength={40} />
              </div>
              <p className="font-mono text-[10px] text-ink-500 mt-1">Leave blank to use auto-generated slug from your name</p>
            </div>
          </>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="flex items-center gap-4 flex-wrap">
          <Button loading={busy}>
            {busy ? "Saving..." : savedSlug ? "Update Portfolio" : "Publish Portfolio"}
          </Button>
          {savedSlug && (
            <a href={`/portfolio/${savedSlug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              View the Public Page ↗
            </a>
          )}
        </div>
        {savedSlug && (
          <p className="form-note">
            Your public link: <a href={`/portfolio/${savedSlug}`} className="accent-link">/portfolio/{savedSlug}</a> — share it with every application.
          </p>
        )}
      </form>

      {/* LIVE PREVIEW */}
      <div className="xl:sticky xl:top-24 space-y-4">
        {/* Strength Score */}
        <div className="border border-navy-700 bg-navy-900 rounded-[3px] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400">Portfolio Strength</span>
            <span className="font-mono text-[22px] text-gold-400 leading-none">{strength.score}%</span>
          </div>
          <div className="h-[4px] bg-navy-800 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gold-400 transition-all duration-300" style={{ width: `${strength.score}%` }} />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] text-ink-50">{strength.level}</span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${impressionStyle.bg} ${impressionStyle.text} ${impressionStyle.border}`}>
              {strength.impressionLabel}
            </span>
          </div>
          {/* Checklist */}
          <div className="space-y-1.5">
            {strength.checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`text-[12px] ${item.done ? "text-green-400" : "text-ink-500"}`}>{item.done ? "✔" : "○"}</span>
                <span className={`text-[11.5px] ${item.done ? "text-ink-50" : "text-ink-500"}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        {strength.tips.length > 0 && (
          <div className="border border-navy-700 bg-navy-900 rounded-[3px] p-5">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-3 block">Tips to Improve</span>
            <div className="space-y-2.5">
              {strength.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`text-[12px] mt-0.5 ${tip.type === "warning" ? "text-amber-400" : "text-blue-400"}`}>
                    {tip.type === "warning" ? "⚠" : "💡"}
                  </span>
                  <span className="text-[12px] text-ink-50 leading-relaxed">{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Mini Preview */}
        <div className="border border-navy-700 bg-navy-900 rounded-[3px] p-5">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-3 block">Preview</span>
          <div className="bg-navy-800 rounded-[3px] p-4 space-y-3">
            {name && <h3 className="font-serif text-[16px] font-medium text-ink-50">{name}</h3>}
            {tagline && <p className="text-[11px] text-gold-400">{tagline}</p>}
            {bio && <p className="text-[11px] text-ink-500 line-clamp-2">{bio}</p>}
            {parsedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {parsedSkills.slice(0, 4).map((s, i) => (
                  <span key={i} className="text-[9px] text-gold-300 border border-gold-400/30 rounded-full px-2 py-0.5">{s}</span>
                ))}
                {parsedSkills.length > 4 && <span className="text-[9px] text-ink-500">+{parsedSkills.length - 4}</span>}
              </div>
            )}
            {projects.length > 0 && (
              <div className="pt-2 border-t border-navy-700">
                <p className="text-[9px] text-ink-500 mb-1">{projects.length} featured project{projects.length > 1 ? "s" : ""}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function slugify(input: string): string {
  return input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "va";
}
