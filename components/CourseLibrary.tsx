"use client";

import { useMemo, useState } from "react";
import EmptyState from "@/components/EmptyState";

interface Course {
  id: number;
  title: string;
  provider: string;
  url: string;
  description: string;
  badge: string;
  category: string;
  difficulty: string;
}

const CATEGORIES = ["Marketing", "Productivity Tools", "Data & Tech", "CRM & Sales", "Career & Freelancing", "Design & Web"];
const DIFFICULTIES = ["Beginner", "Intermediate"];

const BADGE_STYLES: Record<string, string> = {
  Free: "border-gold-400 text-gold-300",
  Audit: "border-sky-400 text-sky-300",
  Trial: "border-purple-400 text-purple-300",
};

export default function CourseLibrary({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (category === "all" || c.category === category) &&
        (difficulty === "all" || c.difficulty === difficulty) &&
        (q === "" || c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    );
  }, [courses, query, category, difficulty]);

  const groups = useMemo(() => {
    const map = new Map<string, Course[]>();
    for (const c of filtered) {
      const arr = map.get(c.category) ?? [];
      arr.push(c);
      map.set(c.category, arr);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <>
      <div className="flex flex-col gap-4 mb-12">
        <input
          className="field"
          placeholder="Search for a course or provider (e.g. Google, HubSpot, Excel)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
              category === "all" ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300" : "border-navy-700 text-ink-400 hover:border-navy-500"
            }`}
          >
            All categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
                category === cat ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300" : "border-navy-700 text-ink-400 hover:border-navy-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDifficulty("all")}
            className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
              difficulty === "all" ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300" : "border-navy-700 text-ink-400 hover:border-navy-500"
            }`}
          >
            All levels
          </button>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
                difficulty === d ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300" : "border-navy-700 text-ink-400 hover:border-navy-500"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon="📚"
          title="Nothing matched these filters"
          description="Try a different category or clear the search to browse all courses."
          variant="default"
        />
      ) : (
        groups.map(([cat, list]) => (
          <section key={cat} className="mb-14">
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-6">
              {cat} · {list.length}
            </h2>
            <div className="flex flex-col gap-1 bg-navy-700 border border-navy-700">
              {list.map((c) => (
                <a
                  key={c.id}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-navy-900 hover:bg-navy-800 transition-colors p-6 flex flex-col md:flex-row md:items-start md:gap-8 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-[16.5px] group-hover:text-gold-300 transition-colors">
                        {c.title}
                      </h3>
                      <span className={`font-mono text-[10px] uppercase tracking-[0.08em] border rounded-full px-2 py-0.5 ${BADGE_STYLES[c.badge] ?? "border-navy-600 text-ink-500"}`}>
                        {c.badge}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-500 border border-navy-600 rounded-full px-2 py-0.5">
                        {c.difficulty}
                      </span>
                    </div>
                    <p className="text-[14px] text-ink-500 mt-1.5 max-w-[640px]">{c.description}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-gold-400/80 mt-2">
                      {c.provider}
                    </p>
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
