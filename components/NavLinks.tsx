"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Learn",
    items: [
      { label: "Walkthrough", href: "/walkthrough" },
      { label: "Courses", href: "/courses" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Tips & Guides", href: "/tips" },
      { label: "Free Templates", href: "/free-templates" },
      { label: "Equipment Guide", href: "/equipment" },
      { label: "Red Flags", href: "/red-flags" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "VA Readiness Check", href: "/tools/readiness" },
      { label: "Niche Finder", href: "/tools/niche-finder" },
      { label: "Resume Builder", href: "/tools/resume-builder" },
      { label: "Cover Letter Builder", href: "/tools/cover-letter" },
      { label: "Portfolio Builder", href: "/portfolio-builder" },
      { label: "Rate Card Generator", href: "/tools/rate-card-generator" },
      { label: "Job Tracker", href: "/tools/tracker" },
      { label: "AI Mock Interview", href: "/tools/mock-interview" },
      { label: "Interview Coach", href: "/tools/interview-coach" },
      { label: "Budget & Calculators", href: "/tools/budget" },
    ],
  },
  {
    label: "Apply",
    items: [
      { label: "30-Day Plan", href: "/30-day-plan" },
      { label: "Apply Here", href: "/apply-here" },
      { label: "Job Alerts", href: "/jobs" },
      { label: "Closing Scripts", href: "/closing-scripts" },
      { label: "First 90 Days", href: "/first-90-days" },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Wins", href: "/wins" },
      { label: "Feedback", href: "/feedback" },
      { label: "FAQ", href: "/faq" },
      { label: "About Us", href: "/about" },
    ],
  },
];

export const GATED_HREFS = new Set([
  "/courses",
  "/tips",
  "/tutorials",
  "/free-templates",
  "/equipment",
  "/tools/readiness",
  "/tools/niche-finder",
  "/tools/mock-interview",
  "/tools/interview-coach",
  "/tools/resume-builder",
  "/tools/cover-letter",
  "/tools/pitch-calculator",
  "/tools/invoice-generator",
  "/tools/red-flag-checker",
  "/apply-here",
  "/jobs",
  "/portfolio-builder",
  "/closing-scripts",
  "/30-day-plan",
  "/first-90-days",
  "/prompts",
  "/assistant",
  "/applications",
  "/niches",
  "/codes",
  "/get-started",
]);

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function NavLinks({ className = "", loggedIn = false }: { className?: string; loggedIn?: boolean }) {
  const pathname = usePathname();

  return (
    <div className={className}>
      <Link href="/" className={`nav-link ${pathname === "/" ? "nav-link--active" : ""}`}>
        Home
      </Link>
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="relative group">
          <button className="nav-link flex items-center gap-1.5" type="button">
            {group.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px] transition-transform duration-200 group-hover:rotate-180">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out pointer-events-none group-hover:pointer-events-auto">
            <div className="panel rounded-[8px] p-2 w-[230px] flex flex-col shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
              {group.items.map((item) => {
                const locked = !loggedIn && GATED_HREFS.has(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3.5 py-2.5 rounded-[6px] text-[12.5px] font-medium transition-colors flex items-center gap-1.5 ${
                      isActive(pathname, item.href)
                        ? "text-gold-300 bg-[rgba(217,169,78,0.1)]"
                        : "text-ink-300 hover:text-ink-50 hover:bg-navy-800"
                    }`}
                  >
                    <span>{item.label}</span>
                    {locked && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-[10px] h-[10px] text-gold-400/70 flex-shrink-0"
                        aria-label="Requires a free account"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
