import Link from "next/link";
import NetworkCanvas from "@/components/NetworkCanvas";
import { getSessionUser } from "@/lib/auth";
import { MOCK_WINS } from "@/data/wins";

const STATS = [
  { num: "1,240+", label: "Community members" },
  { num: "45", label: "Active resources and guides" },
  { num: "4", label: "Stages from zero to thriving" },
  { num: "100%", label: "Free — every tool, no plan" },
];

const TOOLS = [
  {
    icon: (
      <path d="M9 11l3 3 8-8" />
    ),
    icon2: <path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9" />,
    title: "VA Readiness Check",
    body: "A 2-minute quiz that tells you which stage to start in.",
    tag: "TAKE THE QUIZ →",
    href: "/tools/readiness",
  },
  {
    icon: <circle cx="12" cy="12" r="3" />,
    icon2: (
      <>
        <circle cx="5" cy="6" r="2" />
        <circle cx="19" cy="6" r="2" />
        <circle cx="5" cy="18" r="2" />
        <circle cx="19" cy="18" r="2" />
        <path d="M9.5 10.5L6.5 7.5M14.5 10.5l3-3M9.5 13.5l-3 3M14.5 13.5l3 3" />
      </>
    ),
    title: "Niche Finder",
    body: "Discover which specialization fits you best.",
    tag: "FIND YOUR NICHE →",
    href: "/tools/niche-finder",
  },
  {
    icon: <rect x="3" y="4" width="18" height="12" rx="1.5" />,
    icon2: <path d="M8 20h8M12 16v4" />,
    title: "Equipment Guide",
    body: "Real Philippine prices — laptop, internet, headset, by budget.",
    tag: "SEE THE GUIDE →",
    href: "/equipment",
  },
  {
    icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    icon2: <path d="M9 14l2 2 4-4" />,
    title: "Job Tracker",
    body: "Keep track of all applications, interview dates, statuses, and notes.",
    tag: "TRACK APPLICATIONS →",
    href: "/tools/tracker",
  },
  {
    icon: <rect x="4" y="2" width="16" height="20" rx="2" />,
    icon2: (
      <>
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="18" />
        <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
      </>
    ),
    title: "Budget Planner",
    body: "Tailored 50/30/20 budget calculations with freelance overheads.",
    tag: "PLAN YOUR BUDGET →",
    href: "/tools/budget",
  },
];

const SHOWCASE: Array<{ group: string; blurb: string; items: Array<{ label: string; href: string }> }> = [
  {
    group: "Start Here",
    blurb: "Find out exactly where you should begin.",
    items: [
      { label: "VA Readiness Check", href: "/tools/readiness" },
      { label: "Niche Finder", href: "/tools/niche-finder" },
      { label: "VA Learning Path", href: "/walkthrough" },
      { label: "Get Started Roadmap", href: "/get-started" },
    ],
  },
  {
    group: "Learn",
    blurb: "Free courses, guides, and templates to build your skills.",
    items: [
      { label: "Course Library", href: "/courses" },
      { label: "Tips & Guides", href: "/tips" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Free Templates", href: "/free-templates" },
      { label: "Equipment Guide", href: "/equipment" },
    ],
  },
  {
    group: "Practice",
    blurb: "AI tools that grade you and push you to get better.",
    items: [
      { label: "AI Mock Interview", href: "/tools/mock-interview" },
      { label: "Interview Coach", href: "/tools/interview-coach" },
      { label: "Resume Builder", href: "/tools/resume-builder" },
      { label: "Cover Letter Builder", href: "/tools/cover-letter" },
    ],
  },
  {
    group: "Apply",
    blurb: "Directories, job alerts, and scripts for the interview.",
    items: [
      { label: "Apply Here — 80+ Platforms", href: "/apply-here" },
      { label: "Job Alerts", href: "/jobs" },
      { label: "Portfolio Builder", href: "/portfolio-builder" },
      { label: "Closing Scripts", href: "/closing-scripts" },
      { label: "30-Day Plan", href: "/30-day-plan" },
    ],
  },
  {
    group: "Run Your VA Business",
    blurb: "Track income, invoicing, and contributions — organized.",
    items: [
      { label: "Job Tracker", href: "/tools/tracker" },
      { label: "Budget & Calculators", href: "/tools/budget" },
      { label: "Invoice Generator", href: "/tools/invoice-generator" },
      { label: "Contributions Calculator", href: "/tools/contributions-calculator" },
      { label: "First 90 Days", href: "/first-90-days" },
    ],
  },
];

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <>
      {/* HERO */}
      <section className="relative py-24 pb-20 border-b border-navy-700 overflow-hidden">
        <div className="wrap relative z-[2]">
          <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
            <div>
              <div className="eyebrow">// One platform for every aspiring VA</div>
              <h1 className="font-serif font-medium text-[clamp(34px,4.6vw,58px)] leading-[1.1] tracking-[-0.01em] my-[18px]">
                Wherever you are in your VA journey,
                <br /> there's a place for you here.
              </h1>
              <p className="text-[17px] text-ink-300 max-w-[480px] mb-[34px]">
                A structured path from your first step to your first client — built on the
                actual process, not a copied list of tips.
              </p>
              <div className="flex gap-3.5 flex-wrap">
                {user ? (
                  <>
                    <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
                    <Link href="/tools/readiness" className="btn-secondary">Take the Readiness Check</Link>
                  </>
                ) : (
                  <>
                    <Link href="/signup" className="btn-primary">Create an Account</Link>
                    <Link href="/get-started" className="btn-secondary">View the Roadmap</Link>
                  </>
                )}
              </div>
            </div>
            <div className="aspect-square max-h-[420px] w-full md:order-none order-first md:max-h-[420px] max-h-[260px]">
              <NetworkCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-navy-700 py-7">
        <div className="wrap">
          <div className="flex justify-between flex-wrap gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex-1 min-w-[140px]">
                <div className="font-mono text-[26px] font-semibold text-gold-400">{s.num}</div>
                <div className="text-[13px] text-ink-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU CAN DO HERE */}
      <section className="border-b border-navy-700">
        <div className="wrap py-[88px]">
          <div className="section-head">
            <div className="eyebrow">What You Can Do Here</div>
            <h2>One place for the whole journey — learn, practice, apply, and get paid.</h2>
            <p>Everything is grouped by what you're trying to do, so you never have to dig through the footer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-px bg-navy-700 border border-navy-700">
            {SHOWCASE.map((s) => (
              <div key={s.group} className="bg-navy-900 p-7 flex flex-col">
                <h3 className="font-serif text-[17px] font-medium text-gold-300 mb-1.5">{s.group}</h3>
                <p className="text-[12.5px] text-ink-500 mb-5">{s.blurb}</p>
                <div className="flex flex-col gap-[9px] mt-auto">
                  {s.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-[13.5px] text-ink-300 hover:text-gold-300 transition-colors leading-snug"
                    >
                      <span className="text-gold-400 mr-1.5">→</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-navy-700">
        <div className="wrap py-[88px]">
          <div className="section-head">
            <div className="eyebrow">How It Works</div>
            <h2>Four steps from zero to having clients.</h2>
            <p>No magic formula — there's a system. Here's what you'll do step by step.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 relative">
            <div className="hidden lg:block absolute top-[17px] left-0 right-0 h-px bg-navy-600" />
            {[
              user
                ? {
                    n: "01",
                    title: "Start from where you are",
                    body: "You're already signed in — head to your dashboard or take the VA Readiness Check to find your stage.",
                  }
                : {
                    n: "01",
                    title: "Create an account",
                    body: "Free and no expiry. Needed for progress tracking and saving your results.",
                  },
              {
                n: "02",
                title: "Take the VA Readiness Check",
                body: "8 questions, 2 minutes. You'll find out which stage you should start in — plus your VA Score.",
              },
              {
                n: "03",
                title: "Follow your personalized roadmap",
                body: "A checklist for each stage — Start to Level Up, or the more detailed 30-day plan.",
              },
              {
                n: "04",
                title: "Apply using the tools",
                body: "Portfolio builder, closing scripts, templates — you'll be ready to face real clients.",
              },
            ].map((s) => (
              <div key={s.n} className="relative pr-6">
                <div className="w-[34px] h-[34px] rounded-full bg-navy-800 border-[1.5px] border-gold-400 flex items-center justify-center font-mono text-xs text-gold-400 mb-5">
                  {s.n}
                </div>
                <h3 className="font-semibold text-[16.5px] mb-2">{s.title}</h3>
                <p className="text-sm text-ink-500 leading-[1.55] max-w-[240px]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IS A VIRTUAL ASSISTANT */}
      <section className="border-b border-navy-700">
        <div className="wrap py-[88px]">
          <div className="section-head">
            <div className="eyebrow">New here?</div>
            <h2>What is a Virtual Assistant?</h2>
            <p>
              A Virtual Assistant (VA) is someone who works remotely for a business or entrepreneur —
              handling tasks like email, scheduling, research, social media, customer support, and
              more. All you need is a laptop, Wi-Fi, and the right skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                stat: "₱15K–₱60K+",
                label: "Monthly earning potential",
                detail: "Starts at ₱15K for beginners. Experienced VAs and specialists earn ₱40K–₱60K+.",
              },
              {
                stat: "4M+",
                label: "Filipino VAs registered",
                detail: "Filipinos are the #1 source of remote talent worldwide — English skills, reliability, and strong work ethic.",
              },
              {
                stat: "100%",
                label: "Free to start",
                detail: "No degree, no certificate, no equipment purchases needed. A laptop and internet are enough to begin.",
              },
            ].map((s) => (
              <div key={s.label} className="panel p-7">
                <p className="font-mono text-[28px] text-gold-400 font-semibold leading-none mb-2">{s.stat}</p>
                <p className="text-[14.5px] font-semibold mb-1.5">{s.label}</p>
                <p className="text-[13px] text-ink-500 leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>

          <div className="section-head !mb-6">
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
                className="bg-navy-900 p-7 hover:bg-navy-800 transition-colors group"
              >
                <span className="text-2xl mb-4 block">{n.icon}</span>
                <h3 className="text-[15.5px] font-semibold mb-1.5 group-hover:text-gold-300 transition-colors">{n.title}</h3>
                <p className="text-[13px] text-ink-500 leading-relaxed">{n.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/niches" className="font-mono text-[12px] text-gold-400 hover:text-gold-300">
              VIEW ALL NICHES & RESOURCES →
            </Link>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="py-[88px] border-y border-navy-700">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Tools</div>
            <h2>Not just reading material — there's something for you to do.</h2>
            <p>Interactive tools that answer your question: "Where should I start?"</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-navy-700 border border-navy-700">
            {TOOLS.map((t) => (
              <Link key={t.title} href={t.href} className="bg-navy-900 p-8 hover:bg-navy-800 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-[rgba(217,169,78,0.16)] flex items-center justify-center mb-[22px]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#D9A94E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                    {t.icon}
                    {t.icon2}
                  </svg>
                </div>
                <h3 className="text-[17px] font-semibold mb-2.5">{t.title}</h3>
                <p className="text-[14.5px] text-ink-500 mb-4">{t.body}</p>
                <span className="font-mono text-[11.5px] text-gold-400 tracking-[0.04em] group-hover:text-gold-300 transition-colors">
                  {t.tag}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-[88px] border-b border-navy-700" id="pricing">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Free Forever</div>
            <h2>Everything here is free — no plan, no card.</h2>
            <p>
              Every tool, course, and resource is unlocked for every member. Just create an
              account to save your progress — there's nothing to pay for.
            </p>
          </div>
          <div className="bg-navy-900 border border-navy-700 p-9 max-w-[760px]">
            <span className="price-badge font-mono text-[11px] tracking-[0.08em] uppercase text-gold-400 mb-[18px] inline-block">
              100% Free
            </span>
            <h3 className="font-serif font-medium text-2xl mb-1.5">Everything, for everyone</h3>
            <div className="font-mono text-[15px] text-ink-300 mb-[22px]">
              <strong className="text-ink-50">₱0</strong> / forever
            </div>
            <ul className="flex flex-col mb-6">
              {[
                "Complete roadmap — Start to Level Up",
                "VA Readiness Check & Niche Finder",
                "AI VA Assistant, Mock Interview, Resume Builder",
                "Cover Letter Builder, Interview Coach, Pitch Calculator",
                "Invoice Generator, Contributions & Budget Calculators",
                "Apply Here directory & Job Alerts",
                "Full course library with certificates",
              ].map((f) => (
                <li key={f} className="text-sm text-ink-300 py-[7px] flex gap-2.5">
                  <span className="text-gold-400 flex-shrink-0">—</span>
                  {f}
                </li>
              ))}
            </ul>
            {user ? (
              <Link href="/dashboard" className="btn-primary">Go to your Dashboard</Link>
            ) : (
              <Link href="/signup" className="btn-primary">Create your free account</Link>
            )}
          </div>
        </div>
      </section>

      {/* WINS / MOCK TESTIMONIALS */}
      <section className="py-[88px] border-b border-navy-700">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Wins</div>
            <h2>This is what the path looks like when you follow it.</h2>
            <p>The stories below are sample results — we show what's possible, not what we promise.</p>
          </div>
          <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-500 mb-6">
            {"// Sample Results"} — illustrative only, not real stories
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-navy-700 border border-navy-700">
            {MOCK_WINS.map((w) => (
              <figure key={w.name} className="bg-navy-900 p-8 flex flex-col">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-5">
                  {w.role}
                </span>
                <blockquote className="font-serif italic text-[15.5px] text-ink-200 leading-relaxed flex-1">
                  "{w.quote}"
                </blockquote>
                <div className="mt-6 border-t border-navy-700 pt-4">
                  <p className="font-semibold text-[14.5px]">{w.name}</p>
                  <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-gold-400 mt-2.5">
                    RESULTA: {w.result}
                  </p>
                </div>
              </figure>
            ))}
          </div>
          <p className="font-mono text-xs text-ink-500 mt-5">
            Will be replaced with real member stories once available —{" "}
            <Link href="/wins" className="text-gold-400 hover:text-gold-300">view the Wins page →</Link>
          </p>
        </div>
      </section>

      {/* RED FLAGS CALLOUT */}
      <section className="bg-navy-800 border-b border-navy-700 py-6">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚩</span>
              <p className="text-[15px] text-ink-200">
                Before you apply anywhere, read the Red Flags first — signs that should
                never be allowed past the client.
              </p>
            </div>
            <Link href="/red-flags" className="btn-secondary flex-shrink-0">
              Read the Red Flags
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-800 border-b border-navy-700 py-20 text-center">
        <div className="wrap">
          <h2 className="font-serif italic font-medium text-[clamp(28px,3.6vw,42px)] max-w-[560px] mx-auto mb-4">
            {user ? "Continue where you left off." : "Are you ready?"}
          </h2>
          <p className="text-ink-300 mb-8 text-base">
            {user
              ? "Your roadmap, tracker, and every tool are waiting in your dashboard."
              : "Create a free account and start today — everything is free, forever."}
          </p>
          {user ? (
            <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
          ) : (
            <Link href="/signup" className="btn-primary">Create an Account</Link>
          )}
        </div>
      </section>
    </>
  );
}
