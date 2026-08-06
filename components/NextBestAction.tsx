import type { Recommendation } from "@/lib/recommendations";

export default function NextBestAction({ rec }: { rec: Recommendation }) {
  return (
    <div className="border border-gold-400/30 bg-navy-900 rounded-[3px] p-6 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-400/5 to-transparent pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-[20px]">{rec.icon}</span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400">
            Next Best Action
          </span>
        </div>

        <h3 className="text-[18px] font-semibold mb-1">{rec.title}</h3>
        <p className="text-[14px] text-ink-500 mb-4">{rec.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="bg-navy-800/50 rounded-[3px] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-500 mb-1">Why this matters</p>
            <p className="text-[13px] text-ink-50">{rec.why}</p>
          </div>
          <div className="bg-navy-800/50 rounded-[3px] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-500 mb-1">Expected benefit</p>
            <p className="text-[13px] text-ink-50">{rec.benefit}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] text-ink-500">
            ⏱ ~{rec.estimatedMinutes} min
          </span>
          <a
            href={rec.href}
            className="btn-primary !py-[10px] !px-[20px] !text-[12px]"
          >
            CONTINUE →
          </a>
        </div>
      </div>
    </div>
  );
}
