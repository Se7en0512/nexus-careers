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
  related_niches: string;
}

export interface RecommendedBlock {
  title: string;
  courses: Course[];
}

const CATEGORIES = ["Marketing", "Productivity Tools", "Data & Tech", "CRM & Sales", "Career & Freelancing", "Design & Web"];
const DIFFICULTIES = ["Beginner", "Intermediate"];
const PROGRESS_FILTERS = [
  { value: "all", label: "All" },
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const BADGE_STYLES: Record<string, string> = {
  Free: "border-gold-400 text-gold-300",
  Audit: "border-sky-400 text-sky-300",
  Trial: "border-purple-400 text-purple-300",
};

function CourseCard({
  course,
  status,
  onStatus,
}: {
  course: Course;
  status: string;
  onStatus: (status: "started" | "completed") => void;
}) {
  return (
    <div className="bg-navy-900 hover:bg-navy-800 transition-colors p-6 group">
      <div className="flex flex-col md:flex-row md:items-start md:gap-8">
        <a href={course.url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-semibold text-[16.5px] group-hover:text-gold-300 transition-colors">
              {course.title}
            </h3>
            <span className={`font-mono text-[10px] uppercase tracking-[0.08em] border rounded-full px-2 py-0.5 ${BADGE_STYLES[course.badge] ?? "border-navy-600 text-ink-500"}`}>
              {course.badge}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-500 border border-navy-600 rounded-full px-2 py-0.5">
              {course.difficulty}
            </span>
          </div>
          <p className="text-[14px] text-ink-500 mt-1.5 max-w-[640px]">{course.description}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-gold-400/80 mt-2">
            {course.provider}
          </p>
        </a>
        <div className="flex flex-col items-start md:items-end gap-3 mt-3 md:mt-0 flex-shrink-0">
          {status === "not_started" && (
            <button
              onClick={() => onStatus("started")}
              className="font-mono text-[11.5px] px-3 py-1.5 rounded-full border transition-colors border-navy-600 text-ink-400 hover:border-gold-400 hover:text-gold-300"
            >
              Mark as Started
            </button>
          )}
          {status === "started" && (
            <button
              onClick={() => onStatus("completed")}
              className="font-mono text-[11.5px] px-3 py-1.5 rounded-full border transition-colors border-gold-400/50 text-gold-300 bg-[rgba(217,169,78,0.1)] hover:border-gold-400"
            >
              Mark as Completed →
            </button>
          )}
          {status === "completed" && (
            <span className="font-mono text-[11.5px] px-3 py-1.5 rounded-full border border-green-400/50 text-green-400 bg-[rgba(74,222,128,0.1)]">
              ✓ Completed
            </span>
          )}
          <span className="font-mono text-xs text-gold-400 whitespace-nowrap">
            VISIT →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CourseLibrary({
  courses,
  initialProgress,
  recommended,
}: {
  courses: Course[];
  initialProgress: Record<number, string>;
  recommended: RecommendedBlock | null;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [progressFilter, setProgressFilter] = useState("all");
  const [progress, setProgress] = useState<Record<number, string>>(initialProgress);

  const statusOf = (id: number) => progress[id] ?? "not_started";

  const updateStatus = async (course: Course, status: "started" | "completed") => {
    const prev = statusOf(course.id);
    setProgress((p) => ({ ...p, [course.id]: status }));
    try {
      const res = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: course.id, status }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setProgress((p) => ({ ...p, [course.id]: prev }));
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const s = statusOf(c.id);
      const pOk =
        progressFilter === "all" ||
        (progressFilter === "not_started" && s === "not_started") ||
        (progressFilter === "in_progress" && s === "started") ||
        (progressFilter === "completed" && s === "completed");
      return (
        (category === "all" || c.category === category) &&
        (difficulty === "all" || c.difficulty === difficulty) &&
        pOk &&
        (q === "" || c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      );
    });
  }, [courses, query, category, difficulty, progressFilter, progress]);

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
      {recommended && recommended.courses.length > 0 && (
        <section className="mb-14">
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-6">
            Recommended for you — {recommended.title}
          </h2>
          <div className="flex flex-col gap-1 bg-navy-700 border border-navy-700">
            {recommended.courses.map((c) => (
              <CourseCard key={c.id} course={c} status={statusOf(c.id)} onStatus={(s) => updateStatus(c, s)} />
            ))}
          </div>
        </section>
      )}

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
        <div className="flex flex-wrap gap-2">
          {PROGRESS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setProgressFilter(f.value)}
              className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
                progressFilter === f.value ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300" : "border-navy-700 text-ink-400 hover:border-navy-500"
              }`}
            >
              {f.label}
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
                <CourseCard key={c.id} course={c} status={statusOf(c.id)} onStatus={(s) => updateStatus(c, s)} />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}