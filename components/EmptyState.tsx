"use client";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  variant?: "default" | "motivational" | "celebration";
}

export default function EmptyState({
  icon = "📋",
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  const variantStyles = {
    default: "border-navy-700 bg-navy-900",
    motivational: "border-gold-400/20 bg-gradient-to-br from-navy-900 to-navy-800",
    celebration: "border-emerald-400/20 bg-gradient-to-br from-navy-900 to-navy-800",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-14 px-8 text-center rounded-[3px] border ${variantStyles[variant]}`}
    >
      <div className="text-[48px] mb-5 leading-none">{icon}</div>
      <p className="text-[16px] font-semibold text-ink-50 mb-2">{title}</p>
      {description && (
        <p className="text-[13.5px] text-ink-500 max-w-[340px] leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <a
          href={action.href}
          className="btn-primary !py-[10px] !px-[20px] !text-[12px] mt-6"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
