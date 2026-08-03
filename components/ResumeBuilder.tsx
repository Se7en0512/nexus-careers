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

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      // ignore corrupted storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // storage full or unavailable — ignore
      }
    }
  }, [data, loaded]);

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
      </div>

      <div className="lg:sticky lg:top-24">
        <div
          id="resume-print"
          style={{
            background: "#ffffff",
            color: "#1a1a1a",
            fontFamily: "'Public Sans', system-ui, sans-serif",
            fontSize: "13.5px",
            lineHeight: 1.5,
          }}
          className="p-8 min-h-[900px]"
        >
          <header style={{ borderBottom: "3px solid #d9a94e", paddingBottom: "14px", marginBottom: "18px" }}>
            <h1 style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "32px", fontWeight: 600, margin: 0 }}>
              {data.name || "Your Full Name"}
            </h1>
            <p style={{ fontSize: "15px", color: "#444", margin: "4px 0 0" }}>
              {data.title || "Job Title"}
            </p>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              {[data.email, data.phone, data.location].filter(Boolean).join("  ·  ") || "email · phone · location"}
            </p>
          </header>

          {data.summary && (
            <section style={{ marginBottom: "16px" }}>
              <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "15px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#d9a94e", borderBottom: "1px solid #ddd", paddingBottom: "4px", margin: "0 0 8px" }}>
                Summary
              </h2>
              <p style={{ margin: 0, color: "#333" }}>{data.summary}</p>
            </section>
          )}

          {skillList.length > 0 && (
            <section style={{ marginBottom: "16px" }}>
              <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "15px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#d9a94e", borderBottom: "1px solid #ddd", paddingBottom: "4px", margin: "0 0 8px" }}>
                Skills
              </h2>
              <p style={{ margin: 0, color: "#333" }}>{skillList.join("  ·  ")}</p>
            </section>
          )}

          {data.experience.some((e) => e.role || e.company) && (
            <section style={{ marginBottom: "16px" }}>
              <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "15px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#d9a94e", borderBottom: "1px solid #ddd", paddingBottom: "4px", margin: "0 0 8px" }}>
                Experience
              </h2>
              {data.experience
                .filter((e) => e.role || e.company)
                .map((e, i) => (
                  <div key={i} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <strong style={{ fontSize: "14px" }}>
                        {[e.role, e.company].filter(Boolean).join(" — ")}
                      </strong>
                      {e.dates && <span style={{ color: "#666", fontSize: "12.5px", whiteSpace: "nowrap" }}>{e.dates}</span>}
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
              <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "15px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#d9a94e", borderBottom: "1px solid #ddd", paddingBottom: "4px", margin: "0 0 8px" }}>
                Education
              </h2>
              {data.education
                .filter((e) => e.degree || e.school)
                .map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "14px" }}>{[e.degree, e.school].filter(Boolean).join(" — ")}</strong>
                    {e.dates && <span style={{ color: "#666", fontSize: "12.5px", whiteSpace: "nowrap" }}>{e.dates}</span>}
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
