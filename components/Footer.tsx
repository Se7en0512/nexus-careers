import Link from "next/link";
import { getSessionUser, isAdmin } from "@/lib/auth";
import Logo from "./Logo";

export default async function Footer() {
  const user = await getSessionUser();
  const admin = user ? isAdmin(user) : false;

  return (
    <footer className="py-14">
      <div className="wrap">
        <div className="flex justify-between flex-wrap gap-10 mb-12">
          <div className="max-w-[280px]">
            <Link href="/" className="flex items-center gap-3">
              <Logo size={28} />
              <span className="font-mono font-semibold text-[14px] tracking-[0.06em] uppercase">
                Thrive
              </span>
            </Link>
            <p className="text-ink-500 text-sm mt-3.5">Where the next wave of Filipino VAs gets ready.</p>
          </div>

          <div className="flex gap-16 flex-wrap">
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Roadmap</h4>
              <Link href="/get-started#umpisa" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Getting Started</Link>
              <Link href="/get-started#get-hired" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Get Hired</Link>
              <Link href="/get-started#thrive" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Thrive</Link>
              <Link href="/get-started#level-up" className="block text-sm text-ink-300 hover:text-gold-300">Level Up</Link>
            </div>
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Learn</h4>
              <Link href="/courses" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Free Courses</Link>
              <Link href="/tutorials" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Tutorials</Link>
              <Link href="/prompts" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">AI Prompts</Link>
              <Link href="/codes" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Codes & Shortcuts</Link>
              <Link href="/tips" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Tips</Link>
              <Link href="/free-templates" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">FREE Templates</Link>
              <Link href="/walkthrough" className="block text-sm text-ink-300 hover:text-gold-300">Walkthrough</Link>
            </div>
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Resources</h4>
              <Link href="/niches" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Niches</Link>
              <Link href="/equipment" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Equipment Guide</Link>
              <Link href="/apply-here" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Apply Here</Link>
              <Link href="/templates" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Templates</Link>
              <Link href="/all-other-resources" className="block text-sm text-ink-300 hover:text-gold-300">All Resources</Link>
            </div>
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Tools</h4>
              <Link href="/assistant" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">AI VA Assistant</Link>
              <Link href="/tools/mock-interview" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Mock Interview</Link>
              <Link href="/tools/resume-builder" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Resume Builder</Link>
              <Link href="/30-day-plan" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">30-Day Plan</Link>
              <Link href="/portfolio-builder" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Portfolio Builder</Link>
              <Link href="/closing-scripts" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Closing Scripts</Link>
              <Link href="/jobs" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Job Alerts</Link>
              {admin && (
                <Link href="/admin" className="block text-sm text-gold-400 hover:text-gold-300">Admin Panel</Link>
              )}
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
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Protection</h4>
              <Link href="/red-flags" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Red Flags</Link>
              <Link href="/first-90-days" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">First 90 Days</Link>
              <Link href="/privacy-policy" className="block text-sm text-ink-300 hover:text-gold-300">Privacy Policy</Link>
            </div>
            <div>
              <h4 className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-500 mb-4">Community</h4>
              <Link href="/wins" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Wins</Link>
              <Link href="/feedback" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">Feedback</Link>
              <Link href="/faq" className="block text-sm text-ink-300 hover:text-gold-300 mb-2.5">FAQ</Link>
              <Link href="/about" className="block text-sm text-ink-300 hover:text-gold-300">About Us</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-700 pt-6 flex justify-between flex-wrap gap-3 font-mono text-xs text-ink-500">
          <span>© 2026 THRIVE</span>
          <span>MADE FOR FILIPINO VAs</span>
        </div>
      </div>
    </footer>
  );
}
