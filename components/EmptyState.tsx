"use client";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export default function EmptyState({ icon = "📋", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="text-[40px] mb-4 leading-none">{icon}</div>
      <p className="text-[15px] font-semibold text-ink-50 mb-1">{title}</p>
      {description && (
        <p className="text-[13px] text-ink-500 max-w-[320px]">{description}</p>
      )}
      {action && (
        <a
          href={action.href}
          className="btn-primary !py-[10px] !px-[16px] !text-[12px] mt-5"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
