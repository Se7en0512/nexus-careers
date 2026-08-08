"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS, GATED_HREFS } from "./NavLinks";

export default function MobileMenu({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        className={`lg:hidden flex flex-col items-center justify-center gap-[5px] w-10 h-10 rounded-[10px] transition-colors ${
          open ? "bg-navy-800" : ""
        }`}
      >
        <span
          className={`w-[18px] h-[2px] bg-ink-50 rounded-sm transition-transform duration-300 ${
            open ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`w-[18px] h-[2px] bg-ink-50 rounded-sm transition-transform duration-300 ${
            open ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>
      {open && (
        <div className="lg:hidden absolute left-0 right-0 top-16 bg-navy-900 border-b border-navy-700 px-8 py-6 flex flex-col gap-6 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`font-mono text-[12.5px] uppercase tracking-[0.1em] transition-colors ${
              pathname === "/" ? "text-gold-400" : "text-ink-300 hover:text-ink-50"
            }`}
          >
            Home
          </Link>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500 mb-1">
                {group.label}
              </p>
              {group.items.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const locked = !loggedIn && GATED_HREFS.has(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`py-1.5 text-[13px] transition-colors flex items-center gap-1.5 ${
                      active ? "text-gold-400" : "text-ink-300 hover:text-ink-50"
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
          ))}
          <Link
            href={loggedIn ? "/dashboard" : "/signup"}
            onClick={() => setOpen(false)}
            className="btn-primary text-center mt-2"
          >
            {loggedIn ? "Dashboard" : "Create Account"}
          </Link>
        </div>
      )}
    </>
  );
}
