import type { Recommendation } from "@/lib/recommendations";
import ScoreRing from "@/components/ScoreRing";

interface TodayFocusProps {
  greeting: string;
  subtext: string;
  rec: Recommendation;
  vaScore: number;
  overallPct: number;
  currentStreak: number;
  longestStreak: number;
  hireReady: boolean;
}

export default function TodayFocus({
  greeting,
  subtext,
  rec,
  vaScore,
  overallPct,
  currentStreak,
  longestStreak,
  hireReady,
}: TodayFocusProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-400/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="relative wrap py-12 lg:py-16">
        {/* Top row: Greeting + Score */}
        <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
          <div className="flex-1 min-w-0">
            <div className="eyebrow mb-3">// Dashboard</div>
            <h1 className="!text-[28px] lg:!text-[34px] mb-2">{greeting}</h1>
            <p className="text-[15px] text-ink-500 max-w-[480px]">{subtext}</p>
          </div>
          <div className="flex items-center gap-4 bg-navy-800/60 border border-navy-700 rounded-[3px] px-5 py-4">
            <ScoreRing score={vaScore} size={56} />
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500">Readiness</p>
              <p className="font-mono text-[22px] text-gold-400 leading-none mt-1">{vaScore}<span className="text-[12px] text-ink-500">/100</span></p>
            </div>
          </div>
        </div>

        {/* Today's Focus — single CTA */}
        <div className="border border-gold-400/30 bg-navy-800/40 rounded-[3px] p-7 lg:p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-400/5 to-transparent rounded-[3px] pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-[22px]">{rec.icon}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400">
                Today&apos;s Focus
              </span>
            </div>

            <h2 className="text-[20px] lg:text-[24px] font-serif font-medium mb-2">{rec.title}</h2>
            <p className="text-[14.5px] text-ink-500 max-w-[600px] mb-5">{rec.description}</p>

            {/* Priority + Difficulty + Time badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className={`font-mono text-[10.5px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-[3px] border ${
                rec.priority >= 100
                  ? "border-red-400/30 bg-red-400/10 text-red-400"
                  : rec.priority >= 80
                    ? "border-gold-400/30 bg-gold-400/10 text-gold-400"
                    : "border-navy-600 bg-navy-800 text-ink-500"
              }`}>
                {rec.priority >= 100 ? "High Priority" : rec.priority >= 80 ? "Medium Priority" : "Recommended"}
              </span>
              <span className={`font-mono text-[10.5px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-[3px] border ${
                rec.estimatedMinutes <= 5
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : rec.estimatedMinutes <= 15
                    ? "border-gold-400/30 bg-gold-400/10 text-gold-400"
                    : "border-navy-600 bg-navy-800 text-ink-500"
              }`}>
                {rec.estimatedMinutes <= 5 ? "Quick Win" : rec.estimatedMinutes <= 15 ? "Short Task" : "Deep Work"}
              </span>
              <span className="font-mono text-[11px] text-ink-500">
                ⏱ ~{rec.estimatedMinutes} min
              </span>
            </div>

            {/* Reason + Benefit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="bg-navy-900/60 rounded-[3px] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-500 mb-1.5">Why this matters</p>
                <p className="text-[13px] text-ink-100 leading-relaxed">{rec.why}</p>
              </div>
              <div className="bg-navy-900/60 rounded-[3px] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-500 mb-1.5">Expected benefit</p>
                <p className="text-[13px] text-ink-100 leading-relaxed">{rec.benefit}</p>
              </div>
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={rec.href}
                className="btn-primary !py-[12px] !px-[28px] !text-[13px]"
              >
                CONTINUE →
              </a>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-navy-700 border border-navy-700 mt-8">
          <div className="bg-navy-900/80 p-5">
            <p className="text-[20px] leading-none mb-1.5">🔥</p>
            <p className="font-mono text-[20px] text-gold-400 leading-none">{currentStreak}<span className="text-[12px] text-ink-500">-day</span></p>
            <p className="text-[11.5px] text-ink-500 mt-1.5">Streak{longestStreak > currentStreak ? ` (best: ${longestStreak})` : ""}</p>
          </div>
          <div className="bg-navy-900/80 p-5">
            <p className="font-mono text-[20px] text-gold-400 leading-none">{overallPct}%</p>
            <p className="text-[11.5px] text-ink-500 mt-1.5">Roadmap Complete</p>
          </div>
          <div className="bg-navy-900/80 p-5">
            <p className="font-mono text-[20px] text-gold-400 leading-none">{vaScore}</p>
            <p className="text-[11.5px] text-ink-500 mt-1.5">VA Score</p>
          </div>
          <div className="bg-navy-900/80 p-5">
            <p className="font-mono text-[20px] text-gold-400 leading-none">{hireReady ? "✓" : "—"}</p>
            <p className="text-[11.5px] text-ink-500 mt-1.5">Hire-Ready</p>
          </div>
        </div>
      </div>
    </section>
  );
}
