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
  const [showAll, setShowAll] = useState(false);

  const pct = useMemo(
    () => (items.length ? Math.round((checked.size / items.length) * 100) : 0),
    [checked, items.length]
  );

  const incompleteIndices = useMemo(
    () => items.map((_, i) => i).filter((i) => !checked.has(i)),
    [checked, items]
  );

  // Today's Mission: first 2 incomplete items
  const DAILY_BATCH = 2;
  const todayMission = incompleteIndices.slice(0, DAILY_BATCH);
  const remaining = incompleteIndices.slice(DAILY_BATCH);
  const tasksLeft = incompleteIndices.length;

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

  const allDone = pct === 100;

  return (
    <div>
      {/* Progress bar */}
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

      {/* Today's Mission header */}
      {!allDone && todayMission.length > 0 && (
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-[18px]">🎯</span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400">
              Today&apos;s Mission
            </p>
            <p className="text-[12.5px] text-ink-500">
              {tasksLeft === 1
                ? "Last task — finish strong!"
                : `Complete ${todayMission.length} tasks${tasksLeft > DAILY_BATCH ? ` — ${tasksLeft - todayMission.length} more after` : ""}`}
            </p>
          </div>
        </div>
      )}

      {/* Completed stages celebration */}
      {allDone && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-[3px] mb-4">
          <span className="text-[24px]">🎉</span>
          <div>
            <p className="text-[14px] font-semibold text-emerald-400">Stage Complete!</p>
            <p className="text-[12.5px] text-ink-500">All tasks done — you can claim your certificate now.</p>
          </div>
        </div>
      )}

      {/* Today's tasks */}
      {!allDone && (
        <ul className="flex flex-col gap-1 mb-4">
          {todayMission.map((idx) => {
            const done = checked.has(idx);
            return (
              <li key={idx}>
                <button
                  onClick={() => toggle(idx)}
                  disabled={saving}
                  className={`w-full text-left flex gap-3 px-4 py-3 border rounded-[3px] transition-colors ${
                    done
                      ? "border-gold-400/40 bg-navy-800 text-ink-300"
                      : "border-gold-400/30 bg-navy-800/60 hover:border-gold-400/50 text-ink-50"
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
                    {items[idx]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Remaining tasks — hidden by default */}
      {!allDone && remaining.length > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full text-center py-3 text-[12.5px] font-mono text-ink-500 hover:text-ink-300 border border-dashed border-navy-700 rounded-[3px] transition-colors"
        >
          Show {remaining.length} remaining tasks ↓
        </button>
      )}

      {/* All tasks when expanded */}
      {!allDone && showAll && remaining.length > 0 && (
        <>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500 mb-2 mt-4">
            Remaining tasks
          </p>
          <ul className="flex flex-col gap-1">
            {remaining.map((idx) => {
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
                      {items[idx]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Milestone encouragement */}
      {!allDone && tasksLeft > 0 && tasksLeft <= 2 && (
        <div className="flex items-center gap-3 mt-4 p-3 bg-gold-400/5 border border-gold-400/20 rounded-[3px]">
          <span className="text-[18px]">⭐</span>
          <p className="text-[13px] text-ink-300">
            You&apos;re only <strong className="text-gold-400">{tasksLeft} task{tasksLeft > 1 ? "s" : ""}</strong> away from completing this stage!
          </p>
        </div>
      )}
    </div>
  );
}
