"use client";

import { useMemo, useState } from "react";
import { NICHE_LEARNING } from "@/data/niche-learning";

interface Site {
  id: number;
  name: string;
  url: string;
  category: string;
  description: string;
  platform_type: string;
  niche_tags: string;
}

const PLATFORM_FILTERS: Array<{ key: string; label: string }> = [
  { key: "all", label: "All platforms" },
  { key: "job_board", label: "Job Boards" },
  { key: "marketplace", label: "Marketplaces" },
  { key: "agency", label: "Agencies / Direct Hire" },
];

const NICHE_FILTERS = [{ key: "all", label: "All niches" }, ...NICHE_LEARNING.map((n) => ({ key: n.key, label: n.title }))];

function matchesNiche(tags: string, niche: string): boolean {
  if (niche === "all") return true;
  try {
    const parsed = JSON.parse(tags) as string[];
    return parsed.includes("all") || parsed.includes(niche);
  } catch {
    return false;
  }
}

export default function ApplyDirectory({ sites }: { sites: Site[] }) {
  const [platform, setPlatform] = useState("all");
  const [niche, setNiche] = useState("all");

  const filtered = useMemo(
    () =>
      sites.filter(
        (s) =>
          (platform === "all" || s.platform_type === platform) && matchesNiche(s.niche_tags, niche)
      ),
    [sites, platform, niche]
  );

  const categories = useMemo(
    () => [...new Set(filtered.map((s) => s.category))],
    [filtered]
  );

  return (
    <>
      <div className="flex flex-col gap-4 mb-12">
        <div className="flex flex-wrap gap-2">
          {PLATFORM_FILTERS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPlatform(p.key)}
              className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
                platform === p.key
                  ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300"
                  : "border-navy-700 text-ink-400 hover:border-navy-500"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {NICHE_FILTERS.map((n) => (
            <button
              key={n.key}
              onClick={() => setNiche(n.key)}
              className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
                niche === n.key
                  ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300"
                  : "border-navy-700 text-ink-400 hover:border-navy-500"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {categories.length === 0 ? (
<p className="panel p-8 text-center text-ink-500 text-[14px]">
           No matches for these filters.
         </p>
      ) : (
        categories.map((cat) => (
          <section key={cat} className="mb-14">
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-6">
              {cat} · {filtered.filter((s) => s.category === cat).length}
            </h2>
            <div className="flex flex-col gap-1 bg-navy-700 border border-navy-700">
              {filtered
                .filter((s) => s.category === cat)
                .map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-navy-900 hover:bg-navy-800 transition-colors p-6 flex flex-col md:flex-row md:items-center md:gap-8 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-[16.5px] group-hover:text-gold-300 transition-colors">
                          {s.name}
                        </h3>
                        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-500 border border-navy-600 rounded-full px-2 py-0.5">
                          {s.platform_type === "agency" ? "Agency" : s.platform_type === "marketplace" ? "Marketplace" : "Job Board"}
                        </span>
                      </div>
                      <p className="text-[14px] text-ink-500 mt-1.5 max-w-[640px]">{s.description}</p>
                    </div>
                    <span className="font-mono text-xs text-gold-400 mt-3 md:mt-0 whitespace-nowrap">
                      VISIT →
                    </span>
                  </a>
                ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
