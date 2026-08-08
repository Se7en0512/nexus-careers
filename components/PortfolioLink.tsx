"use client";

export default function PortfolioLink({
  href,
  slug,
  label,
  className,
  children,
}: {
  href: string;
  slug: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        try {
          fetch("/api/portfolio/click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, linkLabel: label, linkUrl: href }),
          });
        } catch {}
      }}
    >
      {children}
    </a>
  );
}