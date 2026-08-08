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
            <p className="text-ink-500 text-xs mt-3 leading-relaxed">
              Also building something? If you've got a working project — a website,
              a system, anything real — reach out:{" "}
              <a href="mailto:thrive.va.2026@gmail.com" className="text-ink-400 hover:text-gold-300 transition-colors">
                thrive.va.2026@gmail.com
              </a>
            </p>
            {/* Social links */}
            <div className="flex gap-3 mt-5">
              <a
                href="mailto:thrive.va.2026@gmail.com"
                className="w-9 h-9 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-ink-500 hover:text-gold-400 hover:border-gold-400/40 transition-colors"
                aria-label="Email us"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 6L2 7" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61593070227652"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-ink-500 hover:text-gold-400 hover:border-gold-400/40 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
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
              <Link href="/portfolio-builder" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Portfolio Builder</Link>
              <Link href="/tools/rate-card-generator" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Rate Card Generator</Link>
              <Link href="/tools/interview-coach" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Interview Coach</Link>
              <Link href="/tools/tracker" className="block text-sm text-ink-300 hover:text-gold-300">Job Tracker</Link>
            </div>
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Resources</h4>
              <Link href="/niches" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Niches</Link>
              <Link href="/equipment" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Equipment Guide</Link>
              <Link href="/apply-here" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Apply Here</Link>
              <Link href="/jobs" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Job Alerts</Link>
              <Link href="/closing-scripts" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Closing Scripts</Link>
              <Link href="/first-90-days" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">First 90 Days</Link>
              <Link href="/red-flags" className="block text-sm text-ink-300 hover:text-gold-300">Red Flags</Link>
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
              <Link href="/privacy-policy" className="block text-sm text-ink-300 hover:text-gold-300">Privacy Policy</Link>
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
