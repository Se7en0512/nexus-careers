"use client";

import { useMemo, useState } from "react";
import { saveProgressAction } from "@/lib/progress-actions";

interface ChecklistProps {
  stageKey: string;
  items: string[];
  saved: number[];
}

export default function Checklist({ stageKey, items, saved }: ChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(() => new Set(saved));
  const [saving, setSaving] = useState(false);

  const pct = useMemo(
    () => (items.length ? Math.round((checked.size / items.length) * 100) : 0),
    [checked, items.length]
  );

  const toggle = async (idx: number) => {
    const next = new Set(checked);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setChecked(next);
    setSaving(true);
    try {
      await saveProgressAction(stageKey, [...next]);
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
          {checked.size}/{items.length}
        </span>
      </div>
      <div className="h-[3px] bg-navy-700 mb-5">
        <div className="h-full bg-gold-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="flex flex-col gap-1">
        {items.map((item, idx) => {
          const done = checked.has(idx);
          return (
            <li key={idx}>
              <button
                onClick={() => toggle(idx)}
                disabled={saving}
                className={`w-full text-left flex gap-3 px-4 py-3 border rounded-[3px] transition-colors ${
                  done
                    ? "border-gold-400/40 bg-navy-800 text-ink-300"
                    : "border-navy-700 bg-navy-900 hover:border-navy-600 text-ink-50"
                }`}
              >
                <span
                  className={`font-mono text-sm mt-px flex-shrink-0 ${
                    done ? "text-gold-400" : "text-ink-500"
                  }`}
                >
                  {done ? "✓" : "○"}
                </span>
                <span className={`text-[14.5px] ${done ? "line-through opacity-70" : ""}`}>
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
