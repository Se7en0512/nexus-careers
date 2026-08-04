"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PortfolioData {
  name: string;
  bio: string;
  skills: string[];
  experience: string;
  links: { label: string; url: string }[];
}

interface PortfolioFormProps {
  initial: PortfolioData | null;
  currentSlug?: string | null;
}

export default function PortfolioForm({ initial, currentSlug }: PortfolioFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name || "");
  const [bio, setBio] = useState(initial?.bio || "");
  const [skillsInput, setSkillsInput] = useState((initial?.skills || []).join(", "));
  const [experience, setExperience] = useState(initial?.experience || "");
  const [links, setLinks] = useState<{ label: string; url: string }[]>(
    initial?.links?.length ? initial.links : [{ label: "", url: "" }]
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [savedSlug, setSavedSlug] = useState<string | null>(currentSlug || null);

  const updateLink = (idx: number, field: "label" | "url", value: string) => {
    setLinks((ls) => ls.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };

  const addLink = () => setLinks((ls) => [...ls, { label: "", url: "" }]);
  const removeLink = (idx: number) => setLinks((ls) => ls.filter((_, i) => i !== idx));

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
          skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
          experience,
          links: links.filter((l) => l.url.trim()),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong — please try again.");
        return;
      }
      setSavedSlug(data.slug);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div>
        <label className="form-label" htmlFor="pf-name">Name</label>
        <input
          id="pf-name"
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Maria Santos"
          required
        />
      </div>
      <div>
        <label className="form-label" htmlFor="pf-bio">Short bio (2–3 sentences)</label>
        <textarea
          id="pf-bio"
          className="field min-h-[100px] resize-y"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="What do you do, what kind of clients do you work with, and what's your work style?"
          maxLength={1000}
        />
      </div>
      <div>
        <label className="form-label" htmlFor="pf-skills">Skills (comma-separated)</label>
        <input
          id="pf-skills"
          className="field"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          placeholder="e.g. email management, calendar, data entry, Canva"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="pf-exp">Experience (optional — 2–5 lines)</label>
        <textarea
          id="pf-exp"
          className="field min-h-[90px] resize-y"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="e.g. 1 year of admin support for 2 clients. Managed email and calendar for a real estate CEO. No experience? Leave it blank — that's fine."
          maxLength={2000}
        />
      </div>

      <div>
        <label className="form-label">Sample work / links</label>
        <div className="flex flex-col gap-2">
          {links.map((l, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2">
              <input
                className="field"
                placeholder="Label (e.g. Portfolio PDF)"
                value={l.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
              />
              <input
                className="field"
                placeholder="https://..."
                value={l.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="btn-danger !py-[10px] !px-[14px] !text-[12px]"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addLink} className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px] self-start">
            + Add link
          </button>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="flex items-center gap-4 flex-wrap">
        <button className="btn-primary" disabled={busy}>
          {busy ? "Saving..." : savedSlug ? "Update Portfolio" : "Publish Portfolio"}
        </button>
        {savedSlug && (
          <a href={`/portfolio/${savedSlug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            View the Public Page ↗
          </a>
        )}
      </div>
      {savedSlug && (
        <p className="form-note">
          Your public link:{" "}
          <a href={`/portfolio/${savedSlug}`} className="accent-link">
            /portfolio/{savedSlug}
          </a>{" "}
          — you can share it with any applications.
        </p>
      )}
    </form>
  );
}
