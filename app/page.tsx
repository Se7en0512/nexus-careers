import Link from "next/link";
import NetworkCanvas from "@/components/NetworkCanvas";
import { getSessionUser } from "@/lib/auth";
import TestimonialCard from "@/components/TestimonialCard";
import FaqAccordion from "@/components/FaqAccordion";

/* ────────────────────────────────────────────────────────
   TRUST SIGNALS — below hero (placeholder values for DB wiring)
   ──────────────────────────────────────────────────────── */
const TRUST_SIGNALS = [
  { icon: "👤", value: "1,240+", label: "Active Users", comment: "// TODO: COUNT users FROM users table" },
  { icon: "📄", value: "320+", label: "Resumes Generated", comment: "// TODO: COUNT FROM portfolios" },
  { icon: "🎤", value: "580+", label: "Mock Interviews Done", comment: "// TODO: COUNT FROM mock_interviews" },
  { icon: "🗺️", value: "85%", label: "Roadmap Completion", comment: "// TODO: AVG completion FROM progress" },
  { icon: "⚡", value: "99.9%", label: "Platform Uptime", comment: "// Static — verified via Vercel" },
  { icon: "⭐", value: "4.8/5", label: "User Satisfaction", comment: "// TODO: AVG rating FROM feedback" },
];

/* ────────────────────────────────────────────────────────
   TESTIMONIALS — premium cards with profiles
   ──────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Rea Lyn Caunca",
    role: "Virtual Assistant",
    company: "Freelance",
    quote: "I had zero experience and no idea where to start. The Readiness Check showed me exactly what stage I was in, and the roadmap gave me a clear path forward. Within a month, I had my first paying client.",
    initials: "RC",
    rating: 5,
  },
  {
    name: "Angelica Limosnero",
    role: "Admin Support VA",
    company: "Remote",
    quote: "The Resume Builder and Cover Letter Builder saved me hours. I used to spend days formatting documents — now I generate professional ones in minutes. The mock interview tool gave me confidence I never had.",
    initials: "AL",
    rating: 5,
  },
  {
    name: "Maria Santos",
    role: "Social Media VA",
    company: "Agency",
    quote: "I almost fell for a scam that asked for a training fee. The Red Flags page saved me. Thrive doesn't just teach you skills — it teaches you how to protect yourself in this industry.",
    initials: "MS",
    rating: 5,
  },
  {
    name: "Joyce Ann Rivera",
    role: "E-commerce VA",
    company: "Shopify",
    quote: "The Equipment Guide helped me set up my workspace on a tight budget. I didn't need an expensive laptop to start — just the right one. Now I manage three Shopify stores full-time.",
    initials: "JR",
    rating: 5,
  },
  {
    name: "Catherine Dela Cruz",
    role: "Content Writer VA",
    company: "Freelance",
    quote: "The 30-Day Plan was a game-changer. Instead of overwhelming myself with everything at once, I followed one task per day. By week three, I was already applying to jobs with a portfolio I was proud of.",
    initials: "CD",
    rating: 5,
  },
  {
    name: "Patricia Mendoza",
    role: "Bookkeeping VA",
    company: "Accounting Firm",
    quote: "I was a career shifter from BPO. Thrive's niche finder pointed me to bookkeeping — something I never considered. Now I earn more than I did in my previous job, working from home.",
    initials: "PM",
    rating: 5,
  },
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
  { step: "06", title: "Applied to 80+ Platforms", desc: "Curated directory of job boards, agencies, and direct clients." },
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
   SHOWCASE DATA (preserved from original)
   ──────────────────────────────────────────────────────── */
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

/* ────────────────────────────────────────────────────────
   PAGE COMPONENT
   ──────────────────────────────────────────────────────── */
export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO — transformation-focused headline
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 pb-20 border-b border-navy-700 overflow-hidden">
        <div className="wrap relative z-[2]">
          <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
            <div className="anim-fade-up">
              <div className="eyebrow">// Trusted by 1,200+ Filipino VAs</div>
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
          TRUST SIGNALS — live counters below hero
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-navy-700 py-10">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {TRUST_SIGNALS.map((s, i) => (
              <div key={s.label} className={`text-center anim-fade-up delay-${i + 1}`}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-mono text-[22px] font-semibold text-gold-400">
                  {s.value}
                </div>
                <div className="text-[12px] text-ink-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHAT YOU CAN DO HERE — preserved from original
          ═══════════════════════════════════════════════════ */}
      <section className="border-b border-navy-700">
        <div className="wrap py-[88px]">
          <div className="section-head anim-fade-up">
            <div className="eyebrow">What You Can Do Here</div>
            <h2>One place for the whole journey — learn, practice, apply, and get paid.</h2>
            <p>Everything is grouped by what you&apos;re trying to do, so you never have to dig through the footer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-px bg-navy-700 border border-navy-700">
            {SHOWCASE.map((s, i) => (
              <div key={s.group} className={`bg-navy-900 p-7 flex flex-col hover-lift anim-fade-up delay-${Math.min(i + 1, 8)}`}>
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
                  <h3 className="font-semibold text-[16px] mb-1">{t.title}</h3>
                  <p className="text-[14px] text-ink-500 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS — premium cards with star ratings
          ═══════════════════════════════════════════════════ */}
      <section className="py-[88px] border-b border-navy-700">
        <div className="wrap">
          <div className="section-head anim-fade-up">
            <div className="eyebrow">What Our Members Say</div>
            <h2>Real stories from real people building their VA careers.</h2>
            <p>Every member started somewhere. Here&apos;s what happened when they followed the roadmap.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard
                key={t.name}
                name={t.name}
                role={t.role}
                company={t.company}
                quote={t.quote}
                rating={t.rating}
                initials={t.initials}
                delay={`delay-${Math.min(i + 1, 6)}`}
              />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { stat: "₱15K–₱60K+", label: "Monthly earning potential", detail: "Starts at ₱15K for beginners. Experienced VAs and specialists earn ₱40K–₱60K+." },
              { stat: "4M+", label: "Filipino VAs registered", detail: "Filipinos are the #1 source of remote talent worldwide — English skills, reliability, and strong work ethic." },
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
            <Link href="/niches" className="font-mono text-[12px] text-gold-400 hover:text-gold-300">
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
              : "Join 1,200+ Filipinos building their VA careers. No experience needed. No credit card required. Completely free."}
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
