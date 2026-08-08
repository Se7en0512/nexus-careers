"use client";

import { useState } from "react";
import { showToast } from "@/components/Toast";

interface OnboardingItem {
  num: string;
  title: string;
  desc: string;
}

export default function OnboardingChecklist({
  items,
  initialDone,
}: {
  items: OnboardingItem[];
  initialDone: string[];
}) {
  const [done, setDone] = useState<Set<string>>(() => new Set(initialDone));
  const [saving, setSaving] = useState(false);

  const pct = Math.round((done.size / items.length) * 100);

  const toggle = async (num: string) => {
    const next = new Set(done);
    if (next.has(num)) next.delete(num);
    else next.add(num);
    if (next.size === items.length && done.size !== items.length) {
      showToast("success", "All set — you're ready for day one!");
    }
    setDone(next);
    setSaving(true);
    try {
      const res = await fetch("/api/onboarding-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_num: num, done: next.has(num) }),
      });
      if (!res.ok) {
        setDone((d) => {
          const revert = new Set(d);
          if (next.has(num)) revert.delete(num);
          else revert.add(num);
          return revert;
        });
      }
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
          {done.size}/{items.length} items
        </span>
      </div>
      <div className="h-[3px] bg-navy-700 mb-8">
        <div className="h-full bg-gold-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex flex-col gap-1 bg-navy-700 border border-navy-700">
        {items.map((item) => {
          const isDone = done.has(item.num);
          return (
            <button
              key={item.num}
              onClick={() => toggle(item.num)}
              disabled={saving}
              className={`w-full text-left bg-navy-900 p-6 flex flex-col md:flex-row md:gap-8 transition-colors ${
                isDone ? "bg-navy-800" : "hover:bg-navy-800"
              }`}
            >
              <span
                className={`font-mono text-[11px] w-[36px] flex-shrink-0 pt-0.5 ${
                  isDone ? "text-gold-400" : "text-ink-500"
                }`}
              >
                {isDone ? "✓" : item.num}
              </span>
              <span className="flex-1">
                <span
                  className={`block font-semibold text-[16.5px] mb-1.5 ${
                    isDone ? "line-through opacity-70 text-ink-300" : "text-ink-50"
                  }`}
                >
                  {item.title}
                </span>
                <span
                  className={`block text-[14px] text-ink-400 leading-relaxed max-w-[620px] ${
                    isDone ? "opacity-60" : ""
                  }`}
                >
                  {item.desc}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}