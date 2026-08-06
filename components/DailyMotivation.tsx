"use client";

import { useState } from "react";
import { getTodayMotivation } from "@/data/daily-motivation";

export default function DailyMotivation() {
  const item = getTodayMotivation();
  const todayKey = new Date().toISOString().slice(0, 10);
  const storageKey = `thrive_daily_done_${todayKey}`;

  const [completed, setCompleted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKey) === "true";
  });

  const markDone = () => {
    localStorage.setItem(storageKey, "true");
    setCompleted(true);
  };

  const typeColors: Record<string, string> = {
    tip: "border-gold-400/30",
    advice: "border-blue-400/30",
    challenge: completed ? "border-emerald-500/30" : "border-green-400/30",
    quote: "border-purple-400/30",
  };

  const typeLabels: Record<string, string> = {
    tip: "Tip of the Day",
    advice: "Career Advice",
    challenge: completed ? "Challenge Complete!" : "Daily Challenge",
    quote: "Inspirational Quote",
  };

  return (
    <div
      className={`border ${typeColors[item.type] || typeColors.tip} bg-navy-900 rounded-[3px] p-5 transition-colors`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[18px]" aria-hidden="true">{completed && item.type === "challenge" ? "✅" : item.emoji}</span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400">
          {typeLabels[item.type] || item.title}
        </span>
      </div>
      <p className={`text-[14px] text-ink-50 leading-relaxed ${completed && item.type === "challenge" ? "opacity-70" : ""}`}>
        {item.content}
      </p>

      {/* Challenge completion button */}
      {item.type === "challenge" && (
        <div className="mt-4">
          {completed ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="text-[16px]">✓</span>
              <span className="font-mono text-[12px]">Completed today — great job!</span>
            </div>
          ) : (
            <button
              onClick={markDone}
              className="font-mono text-[12px] text-gold-400 hover:text-gold-300 border border-gold-400/30 hover:border-gold-400/50 rounded-[3px] px-4 py-2 min-h-[44px] transition-colors"
            >
              MARK AS DONE →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
