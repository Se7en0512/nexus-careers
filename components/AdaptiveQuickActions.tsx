import type { QuickAction } from "@/lib/recommendations";

export default function AdaptiveQuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          className="flex flex-col items-center gap-2 p-4 rounded-[3px] border border-navy-700 bg-navy-900 hover:border-navy-600 hover:bg-navy-800 transition-colors text-center group"
        >
          <span className="text-[24px] group-hover:scale-110 transition-transform">{action.icon}</span>
          <span className="text-[12.5px] text-ink-50 font-medium leading-tight">{action.label}</span>
        </a>
      ))}
    </div>
  );
}
