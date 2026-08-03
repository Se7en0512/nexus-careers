"use client";

import { useMemo, useState } from "react";
import CopyScript from "@/components/CopyScript";

interface Fields {
  name: string;
  role: string;
  company: string;
  niche: string;
  experience: string;
  skills: string;
  platform: string;
}

const EMPTY: Fields = {
  name: "",
  role: "",
  company: "",
  niche: "Admin Support",
  experience: "",
  skills: "",
  platform: "OnlineJobs.ph",
};

export default function CoverLetterBuilder() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLetter, setAiLetter] = useState<string | null>(null);

  const set = (k: keyof Fields, v: string) => setFields((f) => ({ ...f, [k]: v }));

  const templateLetter = useMemo(() => {
    const f = fields;
    if (!f.name || !f.role || !f.company) return null;
    const skillsList = f.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 5);
    return `Hello,

I'm ${f.name}${f.experience ? ` — ${f.experience}` : ""}. I came across your post for ${f.role} on ${f.platform}, and I'd like to apply.

My specialty is ${f.niche}.${skillsList.length ? ` In my day-to-day work, I rely on: ${skillsList.join(", ")}.` : ""}

${f.company ? `I can help ${f.company} because I keep learning what the role requires — and I'm not afraid to ask questions when unsure.` : "I know there's a lot I still need to learn, but I'm ready to start and commit to the process."}

I'm applying because your requirements align with what I already do. Can we talk through the role in more detail?

Thank you for taking the time to review my application.

Best regards,
${f.name}`;
  }, [fields]);

  const displayedLetter = aiLetter ?? templateLetter;

  const generateWithAi = async () => {
    if (!fields.role || !fields.company) {
      setAiError("Fill in the position and company first before generating.");
      return;
    }
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: `${fields.role} sa ${fields.company}${fields.niche ? ` (${fields.niche})` : ""}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || "There was a problem with the generation. Please try again.");
        return;
      }
      setAiLetter(data.letter);
    } catch {
      setAiError("Connection problem. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const copy = async () => {
    if (displayedLetter) await navigator.clipboard.writeText(displayedLetter);
  };

  const download = () => {
    if (!displayedLetter) return;
    const blob = new Blob([displayedLetter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <section className="flex flex-col gap-5">
        <div>
          <label className="form-label" htmlFor="cl-name">Your name</label>
          <input
            id="cl-name"
            className="field"
            placeholder="e.g. Maria Santos"
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cl-role">Position you're applying for</label>
          <input
            id="cl-role"
            className="field"
            placeholder="e.g. Virtual Assistant"
            value={fields.role}
            onChange={(e) => set("role", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cl-company">Company or client</label>
          <input
            id="cl-company"
            className="field"
            placeholder="e.g. Acme Digital Solutions"
            value={fields.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cl-niche">Niche / specialty</label>
          <select
            id="cl-niche"
            className="field"
            value={fields.niche}
            onChange={(e) => set("niche", e.target.value)}
          >
            {[
              "Admin Support",
              "Social Media Management",
              "E-commerce Support",
              "Bookkeeping",
              "Customer Support",
              "Content & Copywriting",
            ].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="cl-exp">Experience (1 sentence, or leave blank)</label>
          <input
            id="cl-exp"
            className="field"
            placeholder="e.g. one year of admin support for 2 clients"
            value={fields.experience}
            onChange={(e) => set("experience", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cl-skills">Skills (comma separated)</label>
          <input
            id="cl-skills"
            className="field"
            placeholder="e.g. email management, calendar, data entry"
            value={fields.skills}
            onChange={(e) => set("skills", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cl-platform">Platform you're applying on</label>
          <select
            id="cl-platform"
            className="field"
            value={fields.platform}
            onChange={(e) => set("platform", e.target.value)}
          >
            {["OnlineJobs.ph", "Upwork", "Somewhere", "VirtualStaff.ph", "LinkedIn", "Email"].map(
              (p) => (
                <option key={p}>{p}</option>
              )
            )}
          </select>
        </div>

        <div className="border-t border-navy-700 pt-6 mt-2">
          <button
            type="button"
            onClick={generateWithAi}
            disabled={aiLoading}
            className="btn-primary"
          >
            {aiLoading ? "Generating..." : "Generate the full letter with AI"}
          </button>
          <p className="font-mono text-[11px] text-ink-500 mt-2">
            Uses your portfolio — make sure you've saved one at /portfolio-builder
            before using it.
          </p>
          {aiError && <p className="form-error mt-2">{aiError}</p>}
        </div>
      </section>

      <section className="panel p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400">
            {aiLetter ? "AI-Generated Letter" : "Cover Letter Preview"}
          </h3>
          <div className="flex gap-2">
            <button onClick={copy} disabled={!displayedLetter} className="btn-secondary !py-[8px] !px-[14px] !text-[12px]">
              Copy
            </button>
            <button onClick={download} disabled={!displayedLetter} className="btn-primary !py-[8px] !px-[14px] !text-[12px]">
              Download
            </button>
          </div>
        </div>
        <pre className="flex-1 whitespace-pre-wrap font-sans text-[14.5px] text-ink-300 leading-relaxed bg-navy-950 border border-navy-700 p-5 rounded-[3px]">
          {displayedLetter ?? "Fill in the fields on the left — your letter will appear here."}
        </pre>
        {aiLetter && (
          <div className="mt-4 pt-4 border-t border-navy-700">
            <p className="form-note mb-2">
              Want to edit the result? Copy and paste it into your text editor.
            </p>
            <CopyScript script={aiLetter} />
          </div>
        )}
        {aiLetter && (
          <p className="form-note mt-2">
            AI-generated. Review and adjust it before sending.
          </p>
        )}
        {!aiLetter && (
          <p className="form-note mt-4">
            Make one version per client. Don't mass-send — a copy-pasted letter reads as generic.
          </p>
        )}
      </section>
    </div>
  );
}
