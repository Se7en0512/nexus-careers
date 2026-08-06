"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScoreRing from "./ScoreRing";
import ProfileStrengthCelebration from "./ProfileStrengthCelebration";
import { SkeletonCard } from "@/components/Skeleton";

interface ChecklistItem {
  id: string;
  label: string;
  points: number;
  href: string;
  completed: boolean;
}

interface ProfileStrengthData {
  score: number;
  level: string;
  levelKey: string;
  checklist: ChecklistItem[];
  nextBest: ChecklistItem | null;
  nextGain: number;
  message: string;
  milestone: number | null;
}

const LEVEL_COLORS: Record<string, string> = {
  "getting-started": "text-ink-500",
  "building-profile": "text-gold-400",
  "career-ready": "text-gold-300",
  "almost-complete": "text-gold-300",
  "thrive-ready": "text-gold-400",
};

export default function ProfileStrengthCard() {
  const [data, setData] = useState<ProfileStrengthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [celebrationMilestone, setCelebrationMilestone] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/profile-strength")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setData(d);
          // Check if user just hit a milestone (stored in sessionStorage)
          const key = `profile-strength-milestone-${d.score}`;
          if (d.milestone && !sessionStorage.getItem(key)) {
            setCelebrationMilestone(d.milestone);
            sessionStorage.setItem(key, "1");
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <SkeletonCard />;
  }

  if (!data) return null;

  const incomplete = data.checklist.filter((i) => !i.completed);
  const completed = data.checklist.filter((i) => i.completed);
  const visibleChecklist = showAll ? data.checklist : data.checklist.slice(0, 7);

  return (
    <>
      {celebrationMilestone && (
        <ProfileStrengthCelebration
          milestone={celebrationMilestone}
          onDismiss={() => setCelebrationMilestone(null)}
        />
      )}

      <div className="panel p-7">
        {/* Header */}
        <div className="eyebrow mb-5">Profile Strength</div>

        {/* Score Ring + Level */}
        <div className="flex flex-col items-center mb-5">
          <ScoreRing score={data.score} size={100} />
          <p className={`font-mono text-[13px] mt-3 font-semibold ${LEVEL_COLORS[data.levelKey] || "text-ink-500"}`}>
            {data.level}
          </p>
          <p className="text-[13px] text-ink-500 mt-1 text-center max-w-[260px]">
            {data.message}
          </p>
        </div>

        {/* Next Best Action */}
        {data.nextBest && (
          <div className="bg-navy-800 border border-navy-700 rounded-[3px] p-4 mb-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-500 mb-1.5">
              Your next best step
            </p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[14px] font-semibold text-ink-50">{data.nextBest.label}</p>
              <span className="font-mono text-[11px] text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded">
                +{data.nextGain}%
              </span>
            </div>
            <Link
              href={data.nextBest.href}
              className="btn-primary !py-[8px] !px-[14px] !text-[11px] mt-3 inline-block"
            >
              Complete Now →
            </Link>
          </div>
        )}

        {/* Checklist */}
        <div className="space-y-0">
          {visibleChecklist.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 py-2.5 border-b border-navy-700 last:border-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[11px] ${
                    item.completed
                      ? "bg-gold-400 border-gold-400 text-navy-950"
                      : "border-navy-600 text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  {item.completed ? "✓" : ""}
                </span>
                <span className={`text-[13.5px] ${item.completed ? "text-ink-500 line-through" : "text-ink-300"}`}>
                  {item.label}
                </span>
              </div>
              {!item.completed && (
                <Link
                  href={item.href}
                  className="font-mono text-[10px] text-gold-400 hover:text-gold-300 tracking-wide flex-shrink-0 whitespace-nowrap"
                >
                  COMPLETE →
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Show more/less */}
        {data.checklist.length > 7 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="font-mono text-[11px] text-ink-500 hover:text-ink-300 mt-3 w-full text-center"
          >
            {showAll ? "Show less" : `Show all ${data.checklist.length} items`}
          </button>
        )}

        {/* Progress summary */}
        <div className="mt-4 pt-4 border-t border-navy-700 flex justify-between text-[12px] text-ink-500">
          <span>{completed.length} of {data.checklist.length} completed</span>
          <span className="font-mono text-gold-400">{data.score}%</span>
        </div>
      </div>
    </>
  );
}
