import type { Milestone } from "@/lib/personalization";

export default function MilestoneForecast({ milestone }: { milestone: Milestone | null }) {
  if (!milestone) return null;

  const doneCount = milestone.requirements.filter((r) => r.done).length;
  const total = milestone.requirements.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="border border-navy-700 bg-navy-900 rounded-[3px] p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[18px]">🎯</span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400">
          Next Achievement
        </span>
      </div>

      <h4 className="text-[16px] font-semibold mb-3">{milestone.name}</h4>

      <div className="space-y-2 mb-4">
        {milestone.requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className={`text-[14px] ${req.done ? "text-green-400" : "text-ink-500"}`}>
              {req.done ? "✔" : "⬜"}
            </span>
            <span className={`text-[13px] ${req.done ? "text-ink-50 line-through" : "text-ink-50"}`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-ink-500">
          ⏱ Est. {milestone.estimatedMinutes} min
        </span>
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
