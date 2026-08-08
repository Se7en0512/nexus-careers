"use client";

import { useEffect, useState } from "react";

interface Experience {
  role: string;
  company: string;
  dates: string;
  bullets: string;
}

interface Education {
  degree: string;
  school: string;
  dates: string;
}

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  experience: Experience[];
  education: Education[];
}

const EMPTY: ResumeData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  skills: "",
  experience: [{ role: "", company: "", dates: "", bullets: "" }],
  education: [{ degree: "", school: "", dates: "" }],
};

const STORAGE_KEY = "nexus-resume-v1";

type ResumeTemplate = "classic" | "modern" | "compact" | "bold-header";

const TEMPLATES: Array<{ key: ResumeTemplate; label: string; tag: string }> = [
  { key: "classic", label: "Classic", tag: "Serif + gold accents" },
  { key: "modern", label: "Modern Minimal", tag: "Clean sans + whitespace" },
  { key: "compact", label: "Compact", tag: "Tight spacing, fits more" },
  { key: "bold-header", label: "Bold Header", tag: "Accent header block" },
];

const TEMPLATE_KEYS = TEMPLATES.map((t) => t.key) as string[];

interface TemplateStyles {
  container: React.CSSProperties;
  header: React.CSSProperties;
  name: React.CSSProperties;
  title: React.CSSProperties;
  contact: React.CSSProperties;
  section: React.CSSProperties;
  heading: React.CSSProperties;
  body: React.CSSProperties;
  role: React.CSSProperties;
  meta: React.CSSProperties;
}

const TEMPLATE_STYLES: Record<ResumeTemplate, TemplateStyles> = {
  classic: {
    container: { fontFamily: "'Public Sans', system-ui, sans-serif", fontSize: "13.5px", lineHeight: 1.5 },
    header: { borderBottom: "3px solid #d9a94e", paddingBottom: "14px", marginBottom: "18px" },
    name: { fontFamily: "'Newsreader', Georgia, serif", fontSize: "32px", fontWeight: 600, margin: 0 },
    title: { fontSize: "15px", color: "#444", margin: "4px 0 0" },
    contact: { fontSize: "12px", color: "#666", marginTop: "8px" },
    section: { marginBottom: "16px" },
    heading: {
      fontFamily: "'Newsreader', Georgia, serif",
      fontSize: "15px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "#d9a94e",
      borderBottom: "1px solid #ddd",
      paddingBottom: "4px",
      margin: "0 0 8px",
    },
    body: { margin: 0, color: "#333" },
    role: { fontSize: "14px" },
    meta: { color: "#666", fontSize: "12.5px", whiteSpace: "nowrap" },
  },
  modern: {
    container: { fontFamily: "'Public Sans', system-ui, sans-serif", fontSize: "13.5px", lineHeight: 1.55 },
    header: { paddingBottom: "18px", marginBottom: "30px" },
    name: { fontSize: "34px", fontWeight: 700, margin: 0, color: "#1a1a1a" },
    title: { fontSize: "15px", color: "#555", margin: "6px 0 0" },
    contact: { fontSize: "12px", color: "#777", marginTop: "10px", letterSpacing: "0.02em" },
    section: { marginBottom: "24px" },
    heading: {
      fontFamily: "'Public Sans', system-ui, sans-serif",
      fontSize: "13px",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "#333",
      margin: "0 0 10px",
    },
    body: { margin: 0, color: "#3a3a3a" },
    role: { fontSize: "14px", fontWeight: 600 },
    meta: { color: "#666", fontSize: "12.5px", whiteSpace: "nowrap" },
  },
  compact: {
    container: { fontFamily: "'Public Sans', system-ui, sans-serif", fontSize: "12.5px", lineHeight: 1.4 },
    header: { borderBottom: "1px solid #ccc", paddingBottom: "8px", marginBottom: "12px" },
    name: { fontFamily: "'Newsreader', Georgia, serif", fontSize: "27px", fontWeight: 600, margin: 0 },
    title: { fontSize: "13.5px", color: "#444", margin: "3px 0 0" },
    contact: { fontSize: "11px", color: "#666", marginTop: "6px" },
    section: { marginBottom: "10px" },
    heading: {
      fontFamily: "'Newsreader', Georgia, serif",
      fontSize: "13px",
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      color: "#1a1a1a",
      borderBottom: "1px solid #bbb",
      paddingBottom: "3px",
      margin: "0 0 6px",
    },
    body: { margin: 0, color: "#333" },
    role: { fontSize: "12.5px" },
    meta: { color: "#666", fontSize: "11px", whiteSpace: "nowrap" },
  },
  "bold-header": {
    container: { fontFamily: "'Public Sans', system-ui, sans-serif", fontSize: "13.5px", lineHeight: 1.5 },
    header: { backgroundColor: "#faf6ec", padding: "16px 18px 14px", marginBottom: "20px", borderBottom: "1px solid #e6dcc3" },
    name: { fontFamily: "'Newsreader', Georgia, serif", fontSize: "36px", fontWeight: 700, margin: 0, color: "#1a1a1a" },
    title: { fontSize: "15px", color: "#555", margin: "5px 0 0" },
    contact: { fontSize: "12px", color: "#777", marginTop: "9px" },
    section: { marginBottom: "16px" },
    heading: {
      fontSize: "13px",
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      color: "#1a1a1a",
      borderBottom: "1px solid #ddd",
      paddingBottom: "4px",
      margin: "0 0 8px",
    },
    body: { margin: 0, color: "#333" },
    role: { fontSize: "14px" },
    meta: { color: "#666", fontSize: "12.5px", whiteSpace: "nowrap" },
  },
};

function TemplateThumb({ template }: { template: ResumeTemplate }) {
  if (template === "modern") {
    return (
      <div className="space-y-[3px]">
        <div style={{ fontSize: "14px", fontWeight: 700, lineHeight: 1.1 }}>Name</div>
        <div style={{ fontSize: "7.5px", color: "#555", lineHeight: 1.2 }}>Job Title</div>
        <div style={{ fontSize: "6px", color: "#333", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "5px" }}>Summary</div>
        <div style={{ fontSize: "5.5px", color: "#999", lineHeight: 1.4 }}>Line of text for preview</div>
      </div>
    );
  }
  if (template === "compact") {
    return (
      <div className="space-y-[2px]">
        <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "11px", fontWeight: 600, lineHeight: 1.1 }}>Name</div>
        <div style={{ fontSize: "7px", color: "#444", lineHeight: 1.2 }}>Job Title</div>
        <div style={{ fontSize: "5.5px", color: "#1a1a1a", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", borderBottom: "1px solid #bbb", marginTop: "3px" }}>Summary</div>
        <div style={{ fontSize: "5px", color: "#999", lineHeight: 1.3 }}>Line of text for preview</div>
      </div>
    );
  }
  if (template === "bold-header") {
    return (
      <div className="space-y-1">
        <div style={{ backgroundColor: "#faf6ec", borderBottom: "1px solid #e6dcc3", padding: "3px 4px", margin: "-2px -2px 0" }}>
          <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "13px", fontWeight: 700, lineHeight: 1.1 }}>Name</div>
          <div style={{ fontSize: "7px", color: "#555", lineHeight: 1.2 }}>Job Title</div>
        </div>
        <div style={{ fontSize: "6px", color: "#1a1a1a", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", borderBottom: "1px solid #ddd", marginTop: "4px" }}>Summary</div>
        <div style={{ fontSize: "5.5px", color: "#999", lineHeight: 1.3 }}>Line of text for preview</div>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "13px", fontWeight: 600, lineHeight: 1.1 }}>Name</div>
      <div style={{ fontSize: "7.5px", color: "#444", lineHeight: 1.2 }}>Job Title</div>
      <div style={{ borderBottom: "2px solid #d9a94e", marginTop: "4px" }} />
      <div style={{ fontSize: "6px", color: "#d9a94e", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "3px" }}>Summary</div>
      <div style={{ fontSize: "5.5px", color: "#999", lineHeight: 1.3 }}>Line of text for preview</div>
    </div>
  );
}

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(EMPTY);
  const [template, setTemplate] = useState<ResumeTemplate>("classic");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const { template: savedTemplate, ...rest } = parsed;
          if (TEMPLATE_KEYS.includes(savedTemplate)) setTemplate(savedTemplate as ResumeTemplate);
          setData({ ...EMPTY, ...rest });
        }
      }
    } catch {
      // ignore corrupted storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, template }));
      } catch {
        // storage full or unavailable — ignore
      }
    }
  }, [data, template, loaded]);

  const set = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const setExp = (i: number, key: keyof Experience, value: string) =>
    setData((d) => {
      const experience = d.experience.map((e, j) => (j === i ? { ...e, [key]: value } : e));
      return { ...d, experience };
    });

  const setEdu = (i: number, key: keyof Education, value: string) =>
    setData((d) => {
      const education = d.education.map((e, j) => (j === i ? { ...e, [key]: value } : e));
      return { ...d, education };
    });

  const addExp = () =>
    setData((d) => ({ ...d, experience: [...d.experience, { role: "", company: "", dates: "", bullets: "" }] }));
  const addEdu = () =>
    setData((d) => ({ ...d, education: [...d.education, { degree: "", school: "", dates: "" }] }));

  const skillList = data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 items-start">
      <div className="panel p-7 flex flex-col gap-6">
        <div>
          <label className="form-label">Template</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTemplate(t.key)}
                className={`text-left p-2 rounded-[3px] border transition-colors ${
                  template === t.key ? "border-gold-400 bg-gold-400/10" : "border-navy-700 bg-navy-900 hover:border-navy-600"
                }`}
              >
                <div className="bg-white rounded-[2px] p-2 h-[62px] mb-1.5 overflow-hidden">
                  <TemplateThumb template={t.key} />
                </div>
                <span className={`text-[11px] font-medium block ${template === t.key ? "text-gold-300" : "text-ink-50"}`}>
                  {t.label}
                </span>
                <span className="text-[9.5px] text-ink-500 block leading-snug">{t.tag}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif font-medium text-[20px] mb-1.5">Your details</h2>
          <p className="text-[13px] text-ink-500">
            Fills in on the right as you type. Saved in your browser automatically.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="form-label">Full name</label>
            <input className="field" value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Juan Dela Cruz" />
          </div>
          <div className="col-span-2">
            <label className="form-label">Job title</label>
            <input className="field" value={data.title} onChange={(e) => set("title", e.target.value)} placeholder="Virtual Assistant" />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input className="field" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input className="field" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+63 9xx xxx xxxx" />
          </div>
          <div className="col-span-2">
            <label className="form-label">Location</label>
            <input className="field" value={data.location} onChange={(e) => set("location", e.target.value)} placeholder="Manila, Philippines (Remote)" />
          </div>
        </div>

        <div>
          <label className="form-label">Summary</label>
          <textarea
            className="field min-h-[90px]"
            value={data.summary}
            onChange={(e) => set("summary", e.target.value)}
            placeholder="2-3 lines: who you are, what you do, what you're known for."
          />
        </div>

        <div>
          <label className="form-label">Skills (comma-separated)</label>
          <input className="field" value={data.skills} onChange={(e) => set("skills", e.target.value)} placeholder="Email management, Google Sheets, Canva, Scheduling" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="form-label !mb-0">Experience</label>
            <button type="button" onClick={addExp} className="font-mono text-[11.5px] text-gold-400 hover:text-gold-300">+ Add</button>
          </div>
          <div className="flex flex-col gap-4">
            {data.experience.map((exp, i) => (
              <div key={i} className="border border-navy-700 rounded-md p-3 flex flex-col gap-2.5">
                <input className="field" placeholder="Role" value={exp.role} onChange={(e) => setExp(i, "role", e.target.value)} />
                <div className="grid grid-cols-2 gap-2.5">
                  <input className="field" placeholder="Company" value={exp.company} onChange={(e) => setExp(i, "company", e.target.value)} />
                  <input className="field" placeholder="Dates" value={exp.dates} onChange={(e) => setExp(i, "dates", e.target.value)} />
                </div>
                <textarea
                  className="field min-h-[70px]"
                  placeholder={"Accomplishments, one per line (start with action verbs):\nManaged calendars for 3 executives…"}
                  value={exp.bullets}
                  onChange={(e) => setExp(i, "bullets", e.target.value)}
                />
                {data.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setData((d) => ({ ...d, experience: d.experience.filter((_, j) => j !== i) }))}
                    className="font-mono text-[11.5px] text-red-400 self-start"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="form-label !mb-0">Education</label>
            <button type="button" onClick={addEdu} className="font-mono text-[11.5px] text-gold-400 hover:text-gold-300">+ Add</button>
          </div>
          <div className="flex flex-col gap-4">
            {data.education.map((edu, i) => (
              <div key={i} className="border border-navy-700 rounded-md p-3 flex flex-col gap-2.5">
                <input className="field" placeholder="Degree / Course" value={edu.degree} onChange={(e) => setEdu(i, "degree", e.target.value)} />
                <div className="grid grid-cols-2 gap-2.5">
                  <input className="field" placeholder="School" value={edu.school} onChange={(e) => setEdu(i, "school", e.target.value)} />
                  <input className="field" placeholder="Year" value={edu.dates} onChange={(e) => setEdu(i, "dates", e.target.value)} />
                </div>
                {data.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setData((d) => ({ ...d, education: d.education.filter((_, j) => j !== i) }))}
                    className="font-mono text-[11.5px] text-red-400 self-start"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary w-full" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
        <p className="font-mono text-[10px] text-ink-500 -mt-3 leading-relaxed">
          All templates are designed to stay readable by both recruiters and automated resume scanners (ATS).
        </p>
      </div>

      <div className="lg:sticky lg:top-24">
        <div
          id="resume-print"
          style={{
            background: "#ffffff",
            color: "#1a1a1a",
            ...TEMPLATE_STYLES[template].container,
          }}
          className="p-8 min-h-[900px]"
        >
          <header style={TEMPLATE_STYLES[template].header}>
            <h1 style={TEMPLATE_STYLES[template].name}>
              {data.name || "Your Full Name"}
            </h1>
            <p style={TEMPLATE_STYLES[template].title}>
              {data.title || "Job Title"}
            </p>
            <p style={TEMPLATE_STYLES[template].contact}>
              {[data.email, data.phone, data.location].filter(Boolean).join("  ·  ") || "email · phone · location"}
            </p>
          </header>

          {data.summary && (
            <section style={TEMPLATE_STYLES[template].section}>
              <h2 style={TEMPLATE_STYLES[template].heading}>
                Summary
              </h2>
              <p style={TEMPLATE_STYLES[template].body}>{data.summary}</p>
            </section>
          )}

          {skillList.length > 0 && (
            <section style={TEMPLATE_STYLES[template].section}>
              <h2 style={TEMPLATE_STYLES[template].heading}>
                Skills
              </h2>
              <p style={TEMPLATE_STYLES[template].body}>{skillList.join("  ·  ")}</p>
            </section>
          )}

          {data.experience.some((e) => e.role || e.company) && (
            <section style={TEMPLATE_STYLES[template].section}>
              <h2 style={TEMPLATE_STYLES[template].heading}>
                Experience
              </h2>
              {data.experience
                .filter((e) => e.role || e.company)
                .map((e, i) => (
                  <div key={i} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <strong style={TEMPLATE_STYLES[template].role}>
                        {[e.role, e.company].filter(Boolean).join(" — ")}
                      </strong>
                      {e.dates && <span style={TEMPLATE_STYLES[template].meta}>{e.dates}</span>}
                    </div>
                    {e.bullets && (
                      <ul style={{ margin: "6px 0 0", paddingLeft: "18px", color: "#333" }}>
                        {e.bullets
                          .split("\n")
                          .map((b) => b.trim())
                          .filter(Boolean)
                          .map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
            </section>
          )}

          {data.education.some((e) => e.degree || e.school) && (
            <section>
              <h2 style={TEMPLATE_STYLES[template].heading}>
                Education
              </h2>
              {data.education
                .filter((e) => e.degree || e.school)
                .map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "6px" }}>
                    <strong style={TEMPLATE_STYLES[template].role}>{[e.degree, e.school].filter(Boolean).join(" — ")}</strong>
                    {e.dates && <span style={TEMPLATE_STYLES[template].meta}>{e.dates}</span>}
                  </div>
                ))}
            </section>
          )}
        </div>
        <p className="text-[12.5px] text-ink-500 mt-3">
          Click "Print / Save as PDF" and choose <strong>Save as PDF</strong> in the print dialog.
        </p>
      </div>
    </div>
  );
}
