"use client";

import { useMemo, useState } from "react";
import { PLAN_30 } from "@/data/plan30";

interface DayChecklistProps {
  saved: number[];
}

export default function DayChecklist({ saved }: DayChecklistProps) {
  const [done, setDone] = useState<Set<number>>(() => new Set(saved));
  const [saving, setSaving] = useState(false);

  const pct = useMemo(() => Math.round((done.size / PLAN_30.length) * 100), [done]);

  const toggle = async (day: number) => {
    const next = new Set(done);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    setDone(next);
    setSaving(true);
    try {
      await fetch("/api/plan30", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, done: next.has(day) }),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-ink-500">{pct}% done</span>
        <div className="h-px flex-1 mx-4 bg-navy-700" />
        <span className="font-mono text-xs text-gold-400">
          {done.size}/{PLAN_30.length} days
        </span>
      </div>
      <div className="h-[3px] bg-navy-700 mb-8">
        <div className="h-full bg-gold-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex flex-col gap-1">
        {PLAN_30.map((d) => {
          const isDone = done.has(d.day);
          return (
            <div key={d.day}>
              <button
                onClick={() => toggle(d.day)}
                disabled={saving}
                className={`w-full text-left flex gap-4 px-5 py-3.5 border rounded-[3px] transition-colors ${
                  isDone
                    ? "border-gold-400/40 bg-navy-800"
                    : "border-navy-700 bg-navy-900 hover:border-navy-600"
                }`}
              >
                <span
                  className={`font-mono text-xs pt-1 flex-shrink-0 w-8 text-right ${
                    isDone ? "text-gold-400" : "text-ink-500"
                  }`}
                >
                  {isDone ? "✓" : `${d.day}`.padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span
                    className={`block text-[14.5px] font-medium ${
                      isDone ? "line-through opacity-70 text-ink-300" : "text-ink-50"
                    }`}
                  >
                    Day {d.day}: {d.title}
                  </span>
                  <span className={`block text-[13px] mt-1 ${isDone ? "text-ink-500/60" : "text-ink-500"}`}>
                    {d.body}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
