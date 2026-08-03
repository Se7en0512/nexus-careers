"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NICHE_LEARNING } from "@/data/niche-learning";

interface Job {
  id: number;
  title: string;
  company: string;
  url: string;
  niche: string;
  description: string;
  source: string;
  created_at: string;
  rate_range: string;
  client_type: string;
}

const NICHES = [{ key: "all", title: "All" }, ...NICHE_LEARNING.map((n) => ({ key: n.key, title: n.title }))];

const NICHE_LABELS = Object.fromEntries(NICHE_LEARNING.map((n) => [n.key, n.title]));

export default function JobsFeed({ jobs, savedNiches }: { jobs: Job[]; savedNiches: string[] }) {
  const router = useRouter();
  const [active, setActive] = useState("all");
  const [rateFilter, setRateFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [prefs, setPrefs] = useState<string[]>(savedNiches);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const filtered = useMemo(
    () => {
      let result = active === "all" ? jobs : jobs.filter((j) => j.niche === active);
      if (rateFilter !== "all") {
        result = result.filter((j) => j.rate_range === rateFilter);
      }
      if (clientFilter !== "all") {
        result = result.filter((j) => j.client_type === clientFilter);
      }
      return result;
    },
    [jobs, active, rateFilter, clientFilter]
  );

  const matched = useMemo(
    () => (prefs.length === 0 ? jobs : jobs.filter((j) => prefs.includes(j.niche))),
    [jobs, prefs]
  );

  const togglePref = (key: string) =>
    setPrefs((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));

  const savePrefs = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/niche-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niches: prefs }),
      });
      if (res.ok) {
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 2000);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="panel p-7 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="font-serif font-medium text-[20px] mb-1.5">Your job alerts</h2>
            <p className="text-[13.5px] text-ink-500 max-w-[480px]">
              Choose the niches you're interested in — your dashboard will show job
              posts that fit you.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 md:items-end">
            <div className="flex flex-wrap gap-2">
              {NICHE_LEARNING.map((n) => (
                <button
                  key={n.key}
                  onClick={() => togglePref(n.key)}
                  className={`text-[12.5px] px-3.5 py-1.5 rounded-full border transition-colors ${
                    prefs.includes(n.key)
                      ? "border-gold-400 bg-[rgba(217,169,78,0.15)] text-gold-300"
                      : "border-navy-600 text-ink-400 hover:border-navy-500"
                  }`}
                >
                  {prefs.includes(n.key) ? "✓ " : ""}{n.title}
                </button>
              ))}
            </div>
            <button onClick={savePrefs} disabled={saving} className="btn-secondary !py-[9px] !px-[16px] !text-[12.5px]">
              {saving ? "Saving..." : savedMsg ? "Saved ✓" : "Save alert preferences"}
            </button>
          </div>
        </div>
      </div>

      {prefs.length > 0 && matched.length > 0 && (
        <div className="mb-10">
          <h3 className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-gold-400 mb-4">
            Matched to your niche ({matched.length})
          </h3>
          <div className="flex flex-col gap-3">
            {matched.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap mb-5">
        {NICHES.map((n) => (
          <button
            key={n.key}
            onClick={() => setActive(n.key)}
            className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
              active === n.key
                ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300"
                : "border-navy-700 text-ink-400 hover:border-navy-500"
            }`}
          >
            {n.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-ink-500 uppercase tracking-wider">Rate</span>
          <select
            value={rateFilter}
            onChange={(e) => setRateFilter(e.target.value)}
            className="field !py-[6px] !px-[10px] !text-[12px]"
          >
            <option value="all">All</option>
            <option value="₱500-₱1,000">₱500 – ₱1,000/hr</option>
            <option value="₱1,000-₱3,000">₱1,000 – ₱3,000/hr</option>
            <option value="₱3,000+">₱3,000+/hr</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-ink-500 uppercase tracking-wider">Client</span>
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="field !py-[6px] !px-[10px] !text-[12px]"
          >
            <option value="all">All</option>
            <option value="agency">Agency</option>
            <option value="direct_client">Direct Client</option>
            <option value="marketplace">Marketplace</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="panel p-8 text-center text-ink-500 text-[14px]">
            No job posts in this niche right now.
          </p>
        ) : (
          filtered.map((j) => <JobCard key={j.id} job={j} />)
        )}
      </div>

      <p className="mt-8 text-[12.5px] text-ink-500">
        These job posts are sample data for the platform demo. They're refreshed
        regularly — and the real listings will be pulled from the job boards linked in Apply Here.
      </p>
    </>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="panel p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h4 className="text-[15.5px] font-semibold">{job.title}</h4>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-gold-400 border border-gold-400/50 rounded-full px-2.5 py-0.5">
            {NICHE_LABELS[job.niche] || job.niche}
          </span>
          {job.rate_range && (
            <span className="font-mono text-[10.5px] text-ink-500 border border-navy-600 rounded-full px-2.5 py-0.5">
              {job.rate_range}
            </span>
          )}
          {job.client_type && (
            <span className="font-mono text-[10.5px] text-ink-500 border border-navy-600 rounded-full px-2.5 py-0.5">
              {job.client_type === "direct_client" ? "Direct Client" : job.client_type === "agency" ? "Agency" : "Marketplace"}
            </span>
          )}
        </div>
        <p className="text-[13px] text-ink-500 mt-1">
          {job.company || "Remote"} · in-post {new Date(job.created_at + "Z").toLocaleDateString("en-PH")}
        </p>
        <p className="text-[13.5px] text-ink-300 mt-2 max-w-[600px]">{job.description}</p>
      </div>
      <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn-primary !py-[10px] !px-[18px] !text-[13px] flex-shrink-0">
        Apply ↗
      </a>
    </div>
  );
}
