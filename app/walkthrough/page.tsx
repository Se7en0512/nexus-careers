import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "VA Learning Path — From Zero to Your First Client" };

interface VideoStage {
  stage: string;
  title: string;
  description: string;
  videoId: string;
  creator: string;
  creatorUrl: string;
  duration: string;
  takeaways: string[];
  cta: { label: string; href: string };
}

const STAGES: VideoStage[] = [
  {
    stage: "01",
    title: "What is a Virtual Assistant?",
    description:
      "John Jonas, founder of OnlineJobs.ph (the largest Filipino VA marketplace with 4M+ profiles), explains what VA work really is, why employers hire remote Filipino workers, and the biggest misconceptions beginners have.",
    videoId: "KVe9FMHIzzw",
    creator: "Chad Godoy — Work From Home Jobs Podcast",
    creatorUrl: "https://www.youtube.com/@chadgodoy",
    duration: "1:12:00",
    takeaways: [
      "A Virtual Assistant is not someone who 'does everything' — specialize in one thing and get good at it.",
      "Employers want results, not perfection. Honest, specific applications stand out.",
      "Filipino workers are in high demand because of strong English, reliability, and work ethic.",
      "You don't need years of experience — you need one skill and the willingness to learn.",
    ],
    cta: { label: "Take the Readiness Check", href: "/tools/readiness" },
  },
  {
    stage: "02",
    title: "Finding Your VA Niche",
    description:
      "Mia Juan breaks down the top freelancing niches for 2026 — Executive VA, Social Media Management, E-commerce, Bookkeeping, Content Writing, and more — so you can pick the one that fits your skills and interests.",
    videoId: "5ya-e3_4XVI",
    creator: "Mia Juan",
    creatorUrl: "https://www.youtube.com/@mialuan",
    duration: "28:15",
    takeaways: [
      "Executive VA is the most versatile niche — you learn everything and become a right-hand partner.",
      "Bookkeeping VAs can charge $1,000+/month per client — it's the highest-paying niche for numbers people.",
      "E-commerce VA is growing fast — Shopify, Amazon, Etsy stores all need help managing listings and orders.",
      "You don't need to decide forever — start with one, get paid, then expand.",
    ],
    cta: { label: "Find Your Niche", href: "/tools/niche-finder" },
  },
  {
    stage: "03",
    title: "Complete Setup Guide for Beginners",
    description:
      "A step-by-step walkthrough of everything you need to start: workspace setup, essential tools, creating your profile, and the exact services you can offer as a beginner VA.",
    videoId: "XmNdGWG0hls",
    creator: "Advance Virtual Assistants Ltd",
    creatorUrl: "https://www.youtube.com/@AdvanceVirtualAssistants",
    duration: "56:00",
    takeaways: [
      "You only need a decent laptop and stable Wi-Fi to start — no fancy equipment.",
      "Start by picking 2–3 services you can offer well, not 10 things you're mediocre at.",
      "Most VAs fail because they don't set boundaries — define your working hours from day one.",
      "The difference between a generalist and a specialist is income — specialists charge more.",
    ],
    cta: { label: "See the Equipment Guide", href: "/equipment" },
  },
  {
    stage: "04",
    title: "Landing Your First Client",
    description:
      "Nabbie Ella shares the exact strategy she used to go from zero reviews and zero clients to landing consistent VA jobs — including how to position your profile and what to apply for as a beginner.",
    videoId: "8gIvjLNa3Xs",
    creator: "Nabbie Ella",
    creatorUrl: "https://www.youtube.com/@nabbieella",
    duration: "12:22",
    takeaways: [
      "Target small jobs first — they're less competitive and lead to the 5-star reviews that unlock bigger opportunities.",
      "Customize your profile title for each platform — don't use the same generic title everywhere.",
      "Even with a full-time client, keep applying — clients come and go, and you need options.",
      "Bad reviews kill your profile — if you can't guarantee stable internet or electricity, don't take full-time work.",
    ],
    cta: { label: "Browse 80+ Job Platforms", href: "/apply-here" },
  },
  {
    stage: "05",
    title: "Ace the VA Interview",
    description:
      "The 7 most common VA interview questions and how to answer them with confidence — even if you have zero experience. Includes the PEAK method for structuring your answers.",
    videoId: "yzd5k6t7c-Q",
    creator: "Sphere Rocket Jobs",
    creatorUrl: "https://www.youtube.com/@SphereRocketJobs",
    duration: "10:00",
    takeaways: [
      "\"Tell me about yourself\" — keep it short, clear, and focused on your skills, not your life story.",
      "You don't need formal VA experience — highlight tasks from school or past roles that show transferable skills.",
      "Clients care about adaptability — say you're comfortable learning new tools quickly.",
      "Use the PEAK method: Pause, Example, Anchor, Knowledge — it makes every answer sound structured.",
    ],
    cta: { label: "Practice with AI Mock Interview", href: "/tools/mock-interview" },
  },
  {
    stage: "06",
    title: "Scale to a VA Agency",
    description:
      "Le-an Lai Lacaba, CEO of 2xYou (Stevie Award winner), explains how to evolve from a solo freelancer to running your own VA agency — the mindset shift, the systems, and the first steps.",
    videoId: "HNzxtYxt69c",
    creator: "Le-an Lai Lacaba — 2xYou CEO",
    creatorUrl: "https://www.youtube.com/@leanlailacaba",
    duration: "20:00",
    takeaways: [
      "Stop thinking 'I do tasks' — start thinking 'I solve problems for clients'.",
      "The shift from freelancer to agency owner is about systems, not just more work.",
      "Find the one specific problem you solve best, then build everything around that.",
      "Your first VA hire is the hardest — but it's how you stop trading time for money.",
    ],
    cta: { label: "See the First 90 Days Plan", href: "/first-90-days" },
  },
];

export default function WalkthroughPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">VA Learning Path</div>
          <h1>From zero to your first VA client.</h1>
          <p>
            6 videos, 6 stages — curated from the best Filipino VA creators on YouTube.
            Watch them in order. Each stage builds on the last, and each links back to
            a free tool here that puts what you learn into practice.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="max-w-[860px] mx-auto flex flex-col gap-16">
          {STAGES.map((s, i) => (
            <div key={s.stage} id={s.stage} className="scroll-mt-24">
              {i > 0 && <div className="h-px bg-navy-700 mb-12" />}

              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-navy-800 border-[1.5px] border-gold-400 flex items-center justify-center font-mono text-sm text-gold-400 flex-shrink-0">
                  {s.stage}
                </div>
                <div>
                  <div className="eyebrow">Stage {s.stage}</div>
                  <h2 className="font-serif font-medium text-[22px] mt-1">{s.title}</h2>
                </div>
              </div>

              <div className="aspect-video bg-navy-900 border border-navy-700 rounded-[3px] mb-6">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${s.videoId}`}
                  title={s.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <a
                  href={s.creatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11.5px] text-gold-400 hover:text-gold-300"
                >
                  {s.creator}
                </a>
                <span className="font-mono text-[11px] text-ink-500">·</span>
                <span className="font-mono text-[11px] text-ink-500">{s.duration}</span>
              </div>

              <p className="text-[14.5px] text-ink-300 leading-relaxed mb-5">{s.description}</p>

              <div className="flex flex-col gap-2.5 mb-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 mb-1">
                  Key Takeaways
                </p>
                {s.takeaways.map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <span className="text-gold-400 font-mono text-sm mt-0.5">→</span>
                    <span className="text-[13.5px] text-ink-300 leading-snug">{t}</span>
                  </div>
                ))}
              </div>

              <Link
                href={s.cta.href}
                className="inline-flex items-center gap-2 font-mono text-[12px] text-gold-400 hover:text-gold-300 transition-colors border border-gold-400/40 rounded-full px-4 py-2"
              >
                {s.cta.label} →
              </Link>
            </div>
          ))}

          <div className="h-px bg-navy-700" />

          <div className="text-center">
            <h2 className="font-serif font-medium text-[26px] mb-3">You&apos;ve watched them all.</h2>
            <p className="text-[15px] text-ink-300 max-w-[480px] mx-auto mb-6">
              You now know what a VA is, which niche fits you, how to set up, how to land
              clients, how to ace interviews, and how to grow. Time to start.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/signup" className="btn-primary">
                Create an Account
              </Link>
              <Link href="/get-started" className="btn-secondary">
                Start the Roadmap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
