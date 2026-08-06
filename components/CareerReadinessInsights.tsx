"use client";

import { useState, useEffect } from "react";
import { SkeletonCard } from "@/components/Skeleton";
import type {
  ReadinessResult,
  ReadinessInsight,
  ReadinessMilestone,
  ProgressOutlook,
} from "@/lib/readiness";

const INSIGHT_STYLES: Record<string, string> = {
  positive: "border-green-500/30 bg-green-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
  info: "border-blue-500/30 bg-blue-500/5",
  action: "border-gold-400/30 bg-gold-400/5",
  milestone: "border-purple-500/30 bg-purple-500/5",
};

const IMPACT_BADGES: Record<string, string> = {
  high: "bg-green-500/10 text-green-400 border-green-500/30",
  medium: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  low: "bg-ink-500/10 text-ink-400 border-ink-500/30",
};

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-navy-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-gold-400 transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[18px] font-bold text-gold-400">{score}</span>
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: ReadinessInsight }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-[3px] border ${INSIGHT_STYLES[insight.type] || INSIGHT_STYLES.info}`}>
      <span className="text-[18px] mt-0.5 shrink-0">{insight.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] text-ink-50 leading-relaxed">{insight.text}</p>
        <span className={`inline-block mt-2 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${IMPACT_BADGES[insight.impact]}`}>
          {insight.impact} impact
        </span>
      </div>
    </div>
  );
}

function MilestoneCard({ milestone }: { milestone: ReadinessMilestone }) {
  const doneCount = milestone.requirements.filter((r) => r.done).length;
  const total = milestone.requirements.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="border border-navy-700 bg-navy-900 rounded-[3px] p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[20px]">{milestone.icon}</span>
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400">Next Milestone</p>
          <h4 className="text-[16px] font-semibold">{milestone.name}</h4>
        </div>
      </div>
      <p className="text-[13px] text-ink-500 mb-4">{milestone.description}</p>

      <div className="space-y-2 mb-4">
        {milestone.requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className={`text-[14px] ${req.done ? "text-green-400" : "text-ink-500"}`}>
              {req.done ? "✔" : "⬜"}
            </span>
            <span className={`text-[13px] flex-1 ${req.done ? "text-ink-50 line-through" : "text-ink-50"}`}>
              {req.label}
            </span>
            <span className="text-[10px] text-ink-500 font-mono">{req.impact}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-navy-700">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-ink-500">⏱ ~{milestone.estimatedMinutes} min</span>
          <span className="font-mono text-[11px] text-gold-400">+{milestone.readinessGain}% readiness</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-[3px] w-16 bg-navy-700 rounded-full overflow-hidden">
            <div className="h-full bg-gold-400 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="font-mono text-[11px] text-ink-500">{doneCount}/{total}</span>
        </div>
      </div>
    </div>
  );
}

function ProgressOutlookCard({ outlook }: { outlook: ProgressOutlook }) {
  return (
    <div className="border border-navy-700 bg-navy-900 rounded-[3px] p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-[18px]">📋</span>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400">Progress Outlook</p>
      </div>

      {outlook.completed.length > 0 && (
        <div className="mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-green-400 mb-2">Completed</p>
          <div className="space-y-1.5">
            {outlook.completed.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-green-400 text-[13px]">✔</span>
                <span className="text-[13px] text-ink-50">{item.icon} {item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {outlook.remaining.length > 0 && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber-400 mb-2">Remaining</p>
          <div className="space-y-1.5">
            {outlook.remaining.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-ink-500 text-[13px]">⬜</span>
                <span className="text-[13px] text-ink-50 flex-1">{item.icon} {item.label}</span>
                <span className="text-[10px] text-ink-500 font-mono">~{item.estimatedMinutes}m</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CareerReadinessInsights() {
  const [data, setData] = useState<ReadinessResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/readiness")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <SkeletonCard />;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Hero: Score + Level + Summary */}
      <div className="border border-navy-700 bg-navy-900 rounded-[3px] p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <ScoreRing score={data.score} size={90} />
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-[20px]">{data.level.icon}</span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400">
                {data.level.label}
              </span>
            </div>
            <p className="text-[15px] text-ink-50 mb-3">{data.summary}</p>
            <p className="text-[13px] text-ink-500">{data.level.description}</p>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-navy-700">
          {data.strengths.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-green-400 mb-2">Strengths</p>
              <div className="space-y-1">
                {data.strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-green-400 text-[12px]">+</span>
                    <span className="text-[12.5px] text-ink-50">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.gaps.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber-400 mb-2">To Improve</p>
              <div className="space-y-1">
                {data.gaps.slice(0, 4).map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-amber-400 text-[12px]">→</span>
                    <span className="text-[12.5px] text-ink-50">{g}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Estimated time */}
        <div className="mt-4 pt-4 border-t border-navy-700">
          <p className="text-[13px] text-ink-500">
            <span className="text-gold-400 font-medium">Estimated time to Hire Ready:</span>{" "}
            {data.estimatedTimeToHireReady}
          </p>
        </div>
      </div>

      {/* Insights */}
      {data.insights.length > 0 && (
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500 mb-3">Smart Insights</p>
          <div className="space-y-3">
            {data.insights.map((insight, i) => (
              <InsightCard key={i} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* Next Milestone + Progress Outlook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.nextMilestone && <MilestoneCard milestone={data.nextMilestone} />}
        <ProgressOutlookCard outlook={data.progressOutlook} />
      </div>
    </div>
  );
}
