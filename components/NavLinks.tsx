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
      { label: "Courses", href: "/courses" },
      { label: "Walkthrough", href: "/walkthrough" },
      { label: "Tips & Guides", href: "/tips" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Free Templates", href: "/free-templates" },
      { label: "Resources", href: "/all-other-resources" },
      { label: "Equipment Guide", href: "/equipment" },
      { label: "Red Flags", href: "/red-flags" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "VA Readiness Check", href: "/tools/readiness" },
      { label: "Niche Finder", href: "/tools/niche-finder" },
      { label: "AI Mock Interview", href: "/tools/mock-interview" },
      { label: "Interview Coach", href: "/tools/interview-coach" },
      { label: "Resume Builder", href: "/tools/resume-builder" },
      { label: "Cover Letter Builder", href: "/tools/cover-letter" },
      { label: "Job Tracker", href: "/tools/tracker" },
      { label: "Budget & Calculators", href: "/tools/budget" },
    ],
  },
  {
    label: "Apply",
    items: [
      { label: "Apply Here", href: "/apply-here" },
      { label: "Job Alerts", href: "/jobs" },
      { label: "Portfolio Builder", href: "/portfolio-builder" },
      { label: "Closing Scripts", href: "/closing-scripts" },
      { label: "30-Day Plan", href: "/30-day-plan" },
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

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function NavLinks({ className = "" }: { className?: string }) {
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
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-150 pointer-events-none group-hover:pointer-events-auto">
            <div className="panel rounded-[8px] p-2 w-[230px] flex flex-col shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2.5 rounded-[6px] text-[12.5px] font-medium transition-colors ${
                    isActive(pathname, item.href)
                      ? "text-gold-300 bg-[rgba(217,169,78,0.1)]"
                      : "text-ink-300 hover:text-ink-50 hover:bg-navy-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
