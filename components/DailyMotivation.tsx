import { getTodayMotivation } from "@/data/daily-motivation";

export default function DailyMotivation() {
  const item = getTodayMotivation();

  const typeColors: Record<string, string> = {
    tip: "border-gold-400/30",
    advice: "border-blue-400/30",
    challenge: "border-green-400/30",
    quote: "border-purple-400/30",
  };

  const typeLabels: Record<string, string> = {
    tip: "Tip of the Day",
    advice: "Career Advice",
    challenge: "Daily Challenge",
    quote: "Inspirational Quote",
  };

  return (
    <div
      className={`border ${typeColors[item.type] || typeColors.tip} bg-navy-900 rounded-[3px] p-5`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[18px]">{item.emoji}</span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400">
          {typeLabels[item.type] || item.title}
        </span>
      </div>
      <p className="text-[14px] text-ink-50 leading-relaxed">{item.content}</p>
    </div>
  );
}
