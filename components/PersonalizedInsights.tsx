import type { Insight } from "@/lib/personalization";

const TYPE_STYLES: Record<string, string> = {
  positive: "border-green-500/30 bg-green-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
  info: "border-blue-500/30 bg-blue-500/5",
  action: "border-gold-400/30 bg-gold-400/5",
};

export default function PersonalizedInsights({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null;

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 p-4 rounded-[3px] border ${TYPE_STYLES[insight.type] || TYPE_STYLES.info}`}
        >
          <span className="text-[18px] mt-0.5 shrink-0">{insight.icon}</span>
          <p className="text-[13.5px] text-ink-50 leading-relaxed">{insight.text}</p>
        </div>
      ))}
    </div>
  );
}
