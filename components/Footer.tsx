import Link from "next/link";
import { getSessionUser, isAdmin } from "@/lib/auth";
import Logo from "./Logo";

export default async function Footer() {
  const user = await getSessionUser();
  const admin = user ? isAdmin(user) : false;

  return (
    <footer className="bg-navy-950 border-t border-navy-700 pt-16 pb-8">
      <div className="wrap">
        {/* Top section: brand + columns */}
        <div className="flex justify-between flex-wrap gap-10 mb-12">
          {/* Brand column */}
          <div className="max-w-[280px]">
            <Link href="/" className="flex items-center gap-3">
              <Logo size={28} />
              <span className="font-mono font-semibold text-[14px] tracking-[0.06em] uppercase">
                Thrive
              </span>
            </Link>
            <p className="text-ink-500 text-sm mt-3.5 leading-relaxed">
              Where the next wave of Filipino VAs gets ready. Free tools, structured
              roadmap, and scam protection — built for you.
            </p>
            {/* Social links */}
            <div className="flex gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-ink-500 hover:text-gold-400 hover:border-gold-400/40 transition-colors"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-ink-500 hover:text-gold-400 hover:border-gold-400/40 transition-colors"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="mailto:support@thrive-ph.vercel.app"
                className="w-9 h-9 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-ink-500 hover:text-gold-400 hover:border-gold-400/40 transition-colors"
                aria-label="Email"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 6L2 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="flex gap-16 flex-wrap">
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Get Started</h4>
              <Link href="/get-started#umpisa" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Getting Started</Link>
              <Link href="/tools/readiness" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">VA Readiness Check</Link>
              <Link href="/tools/niche-finder" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Niche Finder</Link>
              <Link href="/get-started#get-hired" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Get Hired</Link>
              <Link href="/30-day-plan" className="block text-sm text-ink-300 hover:text-gold-300">30-Day Plan</Link>
            </div>
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Learn</h4>
              <Link href="/courses" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Free Courses</Link>
              <Link href="/tutorials" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Tutorials</Link>
              <Link href="/prompts" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">AI Prompts</Link>
              <Link href="/codes" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Codes & Shortcuts</Link>
              <Link href="/tips" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Tips</Link>
              <Link href="/free-templates" className="block text-sm text-ink-300 hover:text-gold-300">FREE Templates</Link>
            </div>
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Tools</h4>
              <Link href="/assistant" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">AI VA Assistant</Link>
              <Link href="/tools/mock-interview" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Mock Interview</Link>
              <Link href="/tools/resume-builder" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Resume Builder</Link>
              <Link href="/tools/cover-letter" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Cover Letter Builder</Link>
              <Link href="/tools/interview-coach" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Interview Coach</Link>
              <Link href="/tools/tracker" className="block text-sm text-ink-300 hover:text-gold-300">Job Tracker</Link>
            </div>
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Resources</h4>
              <Link href="/niches" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Niches</Link>
              <Link href="/equipment" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Equipment Guide</Link>
              <Link href="/apply-here" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Apply Here</Link>
              <Link href="/jobs" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Job Alerts</Link>
              <Link href="/portfolio-builder" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Portfolio Builder</Link>
              <Link href="/templates" className="block text-sm text-ink-300 hover:text-gold-300">Templates</Link>
            </div>
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Calculators</h4>
              <Link href="/tools/contributions-calculator" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Contributions Calculator</Link>
              <Link href="/tools/pitch-calculator" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Pitch Calculator</Link>
              <Link href="/tools/budget" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Budget Planner</Link>
              <Link href="/tools/invoice-generator" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Invoice Generator</Link>
              <Link href="/tools/timezone" className="block text-sm text-ink-300 hover:text-gold-300">Timezone Converter</Link>
            </div>
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Company</h4>
              <Link href="/about" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">About Us</Link>
              <Link href="/faq" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">FAQ</Link>
              <Link href="/feedback" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Feedback</Link>
              <Link href="/wins" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Success Stories</Link>
              <Link href="/privacy-policy" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Privacy Policy</Link>
              <Link href="/red-flags" className="block text-sm text-ink-300 hover:text-gold-300">Red Flags</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-700 pt-6 flex justify-between flex-wrap gap-3 font-mono text-xs text-ink-500">
          <span>&copy; 2026 THRIVE. All rights reserved.</span>
          <span>MADE WITH ❤ FOR FILIPINO VAs</span>
        </div>
      </div>
    </footer>
  );
}
