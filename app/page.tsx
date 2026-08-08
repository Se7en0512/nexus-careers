import Link from "next/link";
import NetworkCanvas from "@/components/NetworkCanvas";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import FaqAccordion from "@/components/FaqAccordion";

/* ────────────────────────────────────────────────────────
   REAL PROBLEMS, REAL SOLUTIONS — tools that actually exist
   ──────────────────────────────────────────────────────── */
const SOLUTIONS = [
  {
    title: "Don't know where to start?",
    body: "The VA Readiness Check scores you in 8 questions and tells you exactly which stage to begin from.",
    href: "/tools/readiness",
    cta: "Take the Readiness Check",
  },
  {
    title: "Resume looks generic?",
    body: "The Resume Builder turns your experience into a clean, client-ready document in minutes.",
    href: "/tools/resume-builder",
    cta: "Open the Resume Builder",
  },
  {
    title: "Afraid of getting scammed?",
    body: "The Red Flags guide and Red Flag Checker screen offers for scam patterns before you even reply.",
    href: "/tools/red-flag-checker",
    cta: "Check the Red Flags",
  },
  {
    title: "No portfolio to show clients?",
    body: "The Portfolio Builder creates a shareable page — with photo upload and resume auto-fill.",
    href: "/portfolio-builder",
    cta: "Build your portfolio",
  },
  {
    title: "Nervous about interviews?",
    body: "Practice with the Mock Interview and Interview Coach — your answers get graded out loud.",
    href: "/tools/mock-interview",
    cta: "Practice a mock interview",
  },
  {
    title: "Stuck with no one to ask?",
    body: "The AI Career Assistant answers rate, negotiation, and tool questions instantly — for free.",
    href: "/assistant",
    cta: "Ask the Assistant",
  },
];

/* ────────────────────────────────────────────────────────
   WHAT YOU GET — benefit strip below hero (no fake numbers,
   only real features that exist on the site)
   ──────────────────────────────────────────────────────── */
const BENEFITS = [
  { icon: "🎯", label: "Know your starting point", desc: "The Readiness Check scores where you are in 8 questions." },
  { icon: "🗺️", label: "Know your next step", desc: "A personalized roadmap and 30-day plan guide each day." },
  { icon: "🧰", label: "Skip the paid courses", desc: "13+ free tools — resumes, invoices, rates, and practice." },
  { icon: "💼", label: "Look client-ready", desc: "A shareable portfolio page with photo upload and resume auto-fill." },
  { icon: "🚩", label: "Don't get scammed", desc: "A Red Flags guide and in-tool checker for suspicious offers." },
  { icon: "🤖", label: "Never stuck alone", desc: "The AI Assistant answers rates, interviews, and tool questions." },
];

/* ────────────────────────────────────────────────────────
   SUCCESS TIMELINE
   ──────────────────────────────────────────────────────── */
const TIMELINE = [
  { step: "01", title: "Started with Zero Experience", desc: "NoVA background, no portfolio, no idea where to begin." },
  { step: "02", title: "Completed the VA Readiness Check", desc: "8 questions. 2 minutes. Found out exactly which stage to start in." },
  { step: "03", title: "Followed the Roadmap", desc: "Step-by-step checklist — from learning fundamentals to building skills." },
  { step: "04", title: "Built a Professional Resume", desc: "AI-powered resume builder created a client-ready document in minutes." },
  { step: "05", title: "Passed Mock Interviews", desc: "AI interview coach graded answers and improved confidence." },
  { step: "06", title: "Applied to {platformCount} Platforms", desc: "Curated directory of job boards, agencies, and direct clients." },
  { step: "07", title: "Got Hired", desc: "First client. First invoice. First taste of freedom." },
];

/* ────────────────────────────────────────────────────────
   TRUST BADGES
   ──────────────────────────────────────────────────────── */
const BADGES = [
  { icon: "🔒", label: "Secure Login" },
  { icon: "🤖", label: "AI Powered" },
  { icon: "🌱", label: "Beginner Friendly" },
  { icon: "🆓", label: "Free to Start" },
  { icon: "🇵🇭", label: "Built for Filipinos" },
  { icon: "🛡️", label: "Privacy Protected" },
];

/* ────────────────────────────────────────────────────────
   FAQ
   ──────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  { q: "Is Thrive PH really free?", a: "Yes — 100% free, forever. Every tool, course, roadmap, and resource is available to all members. No hidden fees, no premium tier, no credit card required." },
  { q: "Can beginners use this even with zero experience?", a: "Absolutely. Thrive is designed for complete beginners. The VA Readiness Check evaluates your current level and gives you a personalized starting point. You don't need any prior experience." },
  { q: "Do I need a college degree or certification?", a: "No. Most clients hire based on skills and reliability, not credentials. Thrive teaches you practical skills that clients actually need — and gives you the tools to prove them." },
  { q: "Can AI really build my resume?", a: "Yes. Our AI Resume Builder creates a professional, client-ready resume based on your skills and experience. You can customize it further, but the heavy lifting is done for you." },
  { q: "Is my personal information secure?", a: "Your data is encrypted and stored securely. We never sell or share your information with third parties. We use industry-standard security practices and regular backups." },
  { q: "How is this different from YouTube or free courses?", a: "YouTube gives you information. Thrive gives you a system — a structured roadmap, interactive tools, AI coaching, job tracking, and scam protection — all in one place, tailored for Filipino VAs." },
  { q: "What if I get stuck or need help?", a: "You have access to the AI VA Assistant for instant guidance, the Mock Interview tool for practice, and a community of fellow VAs. You're never truly alone on this journey." },
  { q: "Can I use Thrive on my phone?", a: "Yes — Thrive is fully responsive and works on any device. However, some tools like the Resume Builder work best on a laptop or desktop for the full experience." },
];

/* ────────────────────────────────────────────────────────
   PAGE COMPONENT
   ──────────────────────────────────────────────────────── */
export default async function HomePage() {
  const user = await getSessionUser();

  // Real apply-sites count for the timeline — rounded down to the nearest 5
  // so the displayed figure stays honest without needing edits per change.
  let platformCount = 0;
  try {
    const row = (await db.prepare("SELECT COUNT(*) AS n FROM apply_sites").get()) as { n: number };
    platformCount = Math.floor(row.n / 5) * 5;
  } catch {
    platformCount = 0;
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO — transformation-focused headline
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 pb-20 border-b border-navy-700 overflow-hidden">
        <div className="wrap relative z-[2]">
          <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
            <div className="anim-fade-up">
              {/* Options for the owner to pick from (first one is active):
                  1. "// Free forever. Built by someone who's been there."
                  2. "// Everything here is free. No paywall, no upsell."
                  3. "// No hype. No paywalls. Just a real path to your first client." */}
              <div className="eyebrow">// Free forever. Built by someone who's been there.</div>
              <h1 className="font-serif font-medium text-[clamp(34px,4.6vw,58px)] leading-[1.1] tracking-[-0.01em] my-[18px]">
                Launch Your Virtual Assistant Career
                <br />
                <span className="text-gold-400">with Confidence.</span>
              </h1>
              <p className="text-[17px] text-ink-300 max-w-[480px] mb-[34px] leading-relaxed">
                A structured roadmap, AI-powered tools, and scam protection — everything
                you need to go from zero experience to your first client. Built for
                Filipinos, by someone who&apos;s been there.
              </p>
              <div className="flex gap-3.5 flex-wrap">
                {user ? (
                  <>
                    <Link href="/dashboard" className="btn-primary btn-ripple glow-ring">
                      Go to Dashboard
                    </Link>
                    <Link href="/tools/readiness" className="btn-secondary">
                      Take the Readiness Check
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/signup" className="btn-primary btn-ripple glow-ring">
                      Start Your Free Journey
                    </Link>
                    <Link href="/get-started" className="btn-secondary">
                      View the Roadmap
                    </Link>
                  </>
                )}
              </div>
              {/* Micro trust line under CTA */}
              <p className="font-mono text-[11px] text-ink-500 mt-4 tracking-wide">
                🔒 No credit card · 100% free · Cancel nothing
              </p>
            </div>
            <div className="aspect-square max-h-[420px] w-full md:order-none order-first md:max-h-[420px] max-h-[260px] anim-scale-in delay-2">
              <NetworkCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHAT YOU GET — benefit strip below hero
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-navy-700 py-10">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {BENEFITS.map((b, i) => (
              <div key={b.label} className={`text-center anim-fade-up delay-${i + 1}`}>
                <div className="text-2xl mb-2">{b.icon}</div>
                <div className="font-mono text-[13px] font-semibold text-gold-400 leading-snug">
                  {b.label}
                </div>
                <div className="text-[12px] text-ink-500 mt-1 leading-relaxed">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SUCCESS STORIES TIMELINE
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-navy-700">
        <div className="wrap py-[88px]">
          <div className="section-head anim-fade-up">
            <div className="eyebrow">Success Journey</div>
            <h2>From zero experience to first client — here&apos;s the path.</h2>
            <p>Every successful VA started exactly where you are now. This is the system that gets you there.</p>
          </div>
          <div className="max-w-[560px]">
            {TIMELINE.map((t, i) => (
              <div key={t.step} className={`timeline-line flex gap-5 pb-8 anim-fade-up delay-${Math.min(i + 1, 7)}`}>
                <div className="w-10 h-10 rounded-full bg-navy-800 border-[1.5px] border-gold-400 flex items-center justify-center font-mono text-xs text-gold-400 flex-shrink-0 z-[1]">
                  {t.step}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-[16px] mb-1">
                    {platformCount > 0 ? t.title.replace("{platformCount}", `${platformCount}+`) : t.title.replace("{platformCount}", "Real")}
                  </h3>
                  <p className="text-[14px] text-ink-500 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHAT YOU GET — real problems, real solutions
          ═══════════════════════════════════════════════════ */}
      <section className="py-[88px] border-b border-navy-700">
        <div className="wrap">
          <div className="section-head anim-fade-up">
            <div className="eyebrow">What You Get</div>
            <h2>Everything you need, actually free.</h2>
            <p>Six real problems every new VA hits — and the exact tool on Thrive that solves each one.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map((s, i) => (
              <div key={s.title} className={`panel p-7 flex flex-col hover-lift anim-fade-up delay-${Math.min(i + 1, 6)}`}>
                <h3 className="text-[16.5px] font-semibold mb-2">{s.title}</h3>
                <p className="text-[13.5px] text-ink-500 leading-relaxed mb-5">{s.body}</p>
                <Link
                  href={s.href}
                  className="mt-auto font-mono text-xs text-gold-400 hover:text-gold-300"
                >
                  {s.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS — preserved from original
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-navy-700">
        <div className="wrap py-[88px]">
          <div className="section-head anim-fade-up">
            <div className="eyebrow">How It Works</div>
            <h2>Four steps from zero to having clients.</h2>
            <p>No magic formula — there&apos;s a system. Here&apos;s what you&apos;ll do step by step.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 relative">
            <div className="hidden lg:block absolute top-[17px] left-0 right-0 h-px bg-navy-600" />
            {[
              user
                ? { n: "01", title: "Start from where you are", body: "You&apos;re already signed in — head to your dashboard or take the VA Readiness Check to find your stage." }
                : { n: "01", title: "Create your free account", body: "No credit card, no expiry. Needed for progress tracking and saving your results." },
              { n: "02", title: "Take the VA Readiness Check", body: "8 questions, 2 minutes. You&apos;ll find out which stage you should start in — plus your VA Score." },
              { n: "03", title: "Follow your personalized roadmap", body: "A checklist for each stage — Start to Level Up, or the more detailed 30-day plan." },
              { n: "04", title: "Apply using the tools", body: "Portfolio builder, closing scripts, templates — you&apos;ll be ready to face real clients." },
            ].map((s, i) => (
              <div key={s.n} className={`relative pr-6 anim-fade-up delay-${i + 1}`}>
                <div className="w-[34px] h-[34px] rounded-full bg-navy-800 border-[1.5px] border-gold-400 flex items-center justify-center font-mono text-xs text-gold-400 mb-5">
                  {s.n}
                </div>
                <h3 className="font-semibold text-[16.5px] mb-2">{s.title}</h3>
                <p className="text-sm text-ink-500 leading-[1.55] max-w-[240px]" dangerouslySetInnerHTML={{ __html: s.body }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHAT IS A VIRTUAL ASSISTANT — preserved
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-navy-700">
        <div className="wrap py-[88px]">
          <div className="section-head anim-fade-up">
            <div className="eyebrow">New here?</div>
            <h2>What is a Virtual Assistant?</h2>
            <p>
              A Virtual Assistant (VA) is someone who works remotely for a business or entrepreneur —
              handling tasks like email, scheduling, research, social media, customer support, and
              more. All you need is a laptop, Wi-Fi, and the right skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { stat: "₱15K–₱60K+", label: "Monthly earning potential", detail: "Starts at ₱15K for beginners. Experienced VAs and specialists earn ₱40K–₱60K+ — varies by niche and experience." },
              { stat: "100%", label: "Free to start", detail: "No degree, no certificate, no equipment purchases needed. A laptop and internet are enough to begin." },
            ].map((s, i) => (
              <div key={s.label} className={`panel p-7 hover-lift anim-fade-up delay-${i + 1}`}>
                <p className="font-mono text-[28px] text-gold-400 font-semibold leading-none mb-2">{s.stat}</p>
                <p className="text-[14.5px] font-semibold mb-1.5">{s.label}</p>
                <p className="text-[13px] text-ink-500 leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>

          <div className="section-head !mb-6 anim-fade-up">
            <div className="eyebrow">Explore Niches</div>
            <h2 className="!text-[22px]">6 specializations — pick one to start.</h2>
            <p>Each niche has its own learning path, tools, and earning potential.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-navy-700 border border-navy-700">
            {[
              { key: "admin", icon: "📋", title: "Admin Support", desc: "Email, calendar, data entry — the most accessible entry point for new VAs." },
              { key: "social", icon: "📱", title: "Social Media", desc: "Content calendars, posts, captions, and engagement for Instagram, TikTok, and more." },
              { key: "ecommerce", icon: "🛒", title: "E-commerce", desc: "Product listings, orders, customer chats for Shopify, Amazon, and Etsy stores." },
              { key: "bookkeeping", icon: "📊", title: "Bookkeeping", desc: "Bank reconciliation, invoicing, and financial tracking using Xero or QuickBooks." },
              { key: "content", icon: "✍️", title: "Content Writing", desc: "Blog posts, SEO articles, newsletters, and copywriting for businesses." },
              { key: "customer", icon: "💬", title: "Customer Support", desc: "Inbound support via email, chat, and phone — often with training provided." },
            ].map((n) => (
              <Link
                key={n.key}
                href={`/niches/${n.key}`}
                className="bg-navy-900 p-7 hover:bg-navy-800 transition-colors group hover-lift"
              >
                <span className="text-2xl mb-4 block">{n.icon}</span>
                <h3 className="text-[15.5px] font-semibold mb-1.5 group-hover:text-gold-300 transition-colors">{n.title}</h3>
                <p className="text-[13px] text-ink-500 leading-relaxed">{n.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/niches" className="inline-flex items-center min-h-[44px] font-mono text-[12px] text-gold-400 hover:text-gold-300 py-2">
              VIEW ALL NICHES & RESOURCES →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST BADGES
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-navy-700 py-10">
        <div className="wrap">
          <div className="flex flex-wrap justify-center gap-3">
            {BADGES.map((b) => (
              <span key={b.label} className="trust-pill">
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════ */}
      <section className="py-[88px] border-b border-navy-700">
        <div className="wrap">
          <div className="section-head anim-fade-up">
            <div className="eyebrow">Frequently Asked Questions</div>
            <h2>Got questions? We&apos;ve got answers.</h2>
            <p>Everything you need to know before getting started.</p>
          </div>
          <div className="max-w-[720px]">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA — bottom conversion section
          ═══════════════════════════════════════════════════ */}
      <section className="bg-navy-800 border-b border-navy-700 py-20 text-center">
        <div className="wrap">
          <h2 className="font-serif italic font-medium text-[clamp(28px,3.6vw,42px)] max-w-[560px] mx-auto mb-4 anim-fade-up">
            {user ? "Continue where you left off." : "Your VA career starts here."}
          </h2>
          <p className="text-ink-300 mb-8 text-base max-w-[480px] mx-auto anim-fade-up delay-1">
            {user
              ? "Your roadmap, tracker, and every tool are waiting in your dashboard."
              : "Join free — no experience needed, no credit card required, nothing to cancel."}
          </p>
          {user ? (
            <Link href="/dashboard" className="btn-primary btn-ripple glow-ring anim-fade-up delay-2">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/signup" className="btn-primary btn-ripple glow-ring anim-fade-up delay-2">
              Create My Free Account
            </Link>
          )}
          <p className="font-mono text-[11px] text-ink-500 mt-4 anim-fade-up delay-3">
            🔒 Secure · 🤖 AI-powered · 🇵🇭 Built for Filipinos
          </p>
        </div>
      </section>
    </>
  );
}
