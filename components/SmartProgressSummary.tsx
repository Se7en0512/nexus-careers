import type { ProgressItem } from "@/lib/personalization";

export default function SmartProgressSummary({
  items,
  stepsToHireReady,
}: {
  items: ProgressItem[];
  stepsToHireReady: number;
}) {
  return (
    <div className="border border-navy-700 bg-navy-900 rounded-[3px] p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-[18px]">✅</span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400">
          Your Progress
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <span className={`text-[14px] ${item.done ? "text-green-400" : "text-ink-500"}`}>
              {item.done ? "✔" : "⬜"}
            </span>
            <span className={`text-[13px] ${item.done ? "text-ink-50" : "text-ink-500"}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {stepsToHireReady > 0 && (
        <div className="pt-3 border-t border-navy-700">
          <p className="text-[13.5px] text-gold-300 font-medium">
            You&apos;re only {stepsToHireReady} step{stepsToHireReady > 1 ? "s" : ""} away from becoming Hire Ready.
          </p>
        </div>
      )}
    </div>
  );
}
