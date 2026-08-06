import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROADMAP, stageFromKey } from "@/data/roadmap";
import { PLAN_30 } from "@/data/plan30";
import { getStreak, hasBadge, refreshHireReadyBadge, roadmapCompletion, getCheckinStreak, hasCheckedInThisWeek } from "@/lib/gamification";
import WeeklyCheckin from "@/components/WeeklyCheckin";
import Checklist from "@/components/Checklist";
import LogoutButton from "@/components/LogoutButton";
import ScoreRing from "@/components/ScoreRing";
import CertificateSection from "@/components/CertificateSection";
import AccountSettings from "@/components/AccountSettings";
import ResendVerification from "@/components/ResendVerification";
import ProfileStrengthCard from "@/components/ProfileStrengthCard";

export const metadata: Metadata = { title: "Dashboard" };

export const dynamic = "force-dynamic";

const SECTIONS = [
  { id: "overview", num: "01", label: "Overview" },
  { id: "roadmap", num: "02", label: "Roadmap Progress" },
  { id: "results", num: "03", label: "My Results" },
  { id: "certificates", num: "04", label: "My Certificates" },
  { id: "portfolio", num: "05", label: "Portfolio" },
  { id: "tracker", num: "06", label: "Job Tracker" },
  { id: "tools", num: "07", label: "Tools" },
  { id: "settings", num: "08", label: "Account Settings" },
];

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const [
    progress,
    quizzes,
    vaScore,
    userRow,
    planDone,
    portfolio,
    certificates,
    appsCountRow,
    streak,
  ] = await Promise.all([
    db.prepare("SELECT stage, checks, updated_at FROM progress WHERE user_id = ?").get(user.id),
    db.prepare("SELECT quiz, result, payload, created_at FROM quiz_results WHERE user_id = ? ORDER BY created_at DESC").all(user.id),
    db.prepare("SELECT va_score FROM users WHERE id = ?").get(user.id),
    db.prepare("SELECT updates_opt_in FROM users WHERE id = ?").get(user.id),
    db.prepare("SELECT day FROM daily_plan_progress WHERE user_id = ? AND done = 1").all(user.id),
    db.prepare("SELECT slug, updated_at FROM portfolios WHERE user_id = ?").get(user.id),
    db.prepare("SELECT id, stage_key, stage_title, date_issued FROM certificates WHERE user_id = ? ORDER BY date_issued").all(user.id),
    db.prepare("SELECT COUNT(*) AS n FROM job_applications WHERE user_id = ?").get(user.id),
    getStreak(user.id),
  ]);

  let checks: Record<string, number[]> = {};
  const progressRow = progress as { stage: string; checks: string; updated_at: string } | undefined;
  try { checks = progressRow ? JSON.parse(progressRow.checks) : {}; } catch { checks = {}; }
  const currentStageKey = progressRow?.stage || "umpisa";
  const currentStage = stageFromKey(currentStageKey);

  const quizRows = quizzes as unknown as Array<{ quiz: string; result: string; payload: string; created_at: string }>;
  const readiness = quizRows.find((q) => q.quiz === "readiness");
  const niche = quizRows.find((q) => q.quiz === "niche");

  const vaScoreRow = vaScore as { va_score: number } | undefined;
  const userRowTyped = userRow as { updates_opt_in: number } | undefined;
  const planDoneRows = planDone as unknown as Array<{ day: number }>;
  const doneDays = new Set(planDoneRows.map((d) => d.day));
  const nextDay = PLAN_30.find((d) => !doneDays.has(d.day));
  const portfolioRow = portfolio as { slug: string; updated_at: string } | undefined;
  const certRows = certificates as unknown as Array<{ id: number; stage_key: string; stage_title: string; date_issued: string }>;
  const appsCount = (appsCountRow as { n: number } | undefined)?.n ?? 0;
  const checkinStreak = await getCheckinStreak(user.id);
  const weeklyCheckedIn = await hasCheckedInThisWeek(user.id);

  const pct = (key: string) => {
    const items = stageFromKey(key)?.items.length || 0;
    const done = checks[key]?.length || 0;
    return items ? Math.round((done / items) * 100) : 0;
  };

  const totalDone = ROADMAP.reduce((acc, s) => acc + (checks[s.key]?.length || 0), 0);
  const totalItems = ROADMAP.reduce((acc, s) => acc + s.items.length, 0);
  const overallPct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;

  const roadmap = await roadmapCompletion(user.id);
  await refreshHireReadyBadge(user.id);
  const hireReady = await hasBadge(user.id, "hire_ready");

  const nextAction =
    nextDay
      ? { label: `Continue Day ${nextDay.day} of the 30-Day Plan`, href: "/30-day-plan" }
      : !roadmap.complete
        ? { label: `Continue the ${currentStage?.title || "roadmap"} stage`, href: `/get-started#${currentStageKey}` }
        : !portfolioRow
          ? { label: "Create a Portfolio", href: "/portfolio-builder" }
          : { label: "See Job Alerts", href: "/jobs" };

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="eyebrow">// Dashboard</div>
              <h1 className="mb-0">Hi, {user.name || user.email}.</h1>
              <p className="mt-4">
                Everything is free. The full roadmap, all tools, and every course are yours.
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </section>

      {/* TEMPORARILY DISABLED — Re-enable once a verified email domain is configured on Resend.
      {user.email_verified === 0 && (
        <div className="wrap" style={{ marginTop: 16 }}>
          <ResendVerification />
        </div>
      )} */}

      <div className="wrap py-14 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 items-start">
        {/* SECTION NAV */}
        <nav className="lg:sticky lg:top-24 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-8 px-8 lg:mx-0 lg:px-0">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-3 whitespace-nowrap lg:whitespace-normal font-mono text-[12px] uppercase tracking-[0.08em] text-ink-500 hover:text-gold-300 transition-colors border border-navy-800 lg:border-0 rounded-[3px] px-3.5 lg:px-0 py-2 lg:py-1.5"
            >
              <span className="text-gold-400/70">{s.num}</span>
              {s.label}
            </a>
          ))}
        </nav>

        {/* MAIN CONTENT */}
        <div className="flex flex-col gap-14 min-w-0">
          {/* 01 OVERVIEW */}
          <section id="overview" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">01 · Overview</div>
              <h2 className="!text-[24px]">Your progress right now</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-navy-700 border border-navy-700 mb-6">
              <div className="bg-navy-900 p-6">
                <p className="text-[26px] leading-none mb-2">🔥</p>
                <p className="font-mono text-[22px] text-gold-400 leading-none">{streak.current_streak}<span className="text-[13px] text-ink-500">-day</span></p>
                <p className="text-[12.5px] text-ink-500 mt-2">Streak (longest: {streak.longest_streak})</p>
              </div>
              <div className="bg-navy-900 p-6">
                <p className="font-mono text-[22px] text-gold-400 leading-none">{overallPct}%</p>
                <p className="text-[12.5px] text-ink-500 mt-2">Roadmap ({totalDone}/{totalItems})</p>
              </div>
              <div className="bg-navy-900 p-6">
                <p className="font-mono text-[22px] text-gold-400 leading-none">{vaScoreRow?.va_score ?? 0}</p>
                <p className="text-[12.5px] text-ink-500 mt-2">VA Score</p>
              </div>
              <div className="bg-navy-900 p-6">
                <p className="font-mono text-[22px] text-gold-400 leading-none">{hireReady ? "✓" : "—"}</p>
                <p className="text-[12.5px] text-ink-500 mt-2">Hire-Ready Badge</p>
              </div>
            </div>
            {/* 4-stage progress bar */}
            <div className="flex flex-col gap-1.5 mb-6">
              <div className="h-[6px] bg-navy-800 rounded-full overflow-hidden">
                <div className="h-full bg-gold-400 transition-all" style={{ width: `${overallPct}%` }} />
              </div>
              <div className="flex flex-wrap justify-between font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-500">
                {ROADMAP.map((s) => (
                  <span key={s.key} className={s.key === currentStageKey ? "text-gold-300" : ""}>
                    {s.title} {pct(s.key) === 100 ? "✓" : ""}
                  </span>
                ))}
              </div>
            </div>
            <div className="border border-navy-700 bg-navy-900 rounded-[3px] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500 mb-1">Next up</p>
                <p className="text-[15px] font-semibold">{nextAction.label}</p>
              </div>
              <Link href={nextAction.href} className="btn-primary !py-[10px] !px-[16px] !text-[12px] whitespace-nowrap self-start">
                CONTINUE →
              </Link>
            </div>
            <div className="mt-6">
              <ProfileStrengthCard />
            </div>
            <div className="mt-6">
              <WeeklyCheckin initialApps={appsCount} streak={checkinStreak} checkedIn={weeklyCheckedIn} />
            </div>
          </section>

          {/* 02 ROADMAP PROGRESS */}
          <section id="roadmap" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">02 · Roadmap Progress</div>
              <h2 className="!text-[24px]">Roadmap & 30-Day Plan</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-navy-700 border border-navy-700 mb-8">
              {ROADMAP.map((s) => (
                <div key={s.key} className={`bg-navy-900 p-6 ${s.key === currentStageKey ? "ring-1 ring-inset ring-gold-400/50" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] text-gold-400">{s.num}</span>
                    {s.key === currentStageKey && (
                      <span className="font-mono text-[10px] text-navy-950 bg-gold-400 rounded-full px-2 py-0.5 uppercase tracking-wide">
                        You're here
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[15px]">{s.title}</h3>
                  <p className="font-mono text-[13px] text-ink-500 mt-3">{pct(s.key)}% done</p>
                  <div className="h-[3px] bg-navy-700 mt-2">
                    <div className="h-full bg-gold-400" style={{ width: `${pct(s.key)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="panel p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <div className="eyebrow">Current Stage</div>
                  <h3 className="font-serif font-medium text-[22px] mt-2">
                    {currentStage?.num} · {currentStage?.title}
                  </h3>
                </div>
                <Link href="/30-day-plan" className="font-mono text-xs text-gold-400 hover:text-gold-300 tracking-[0.04em]">
                  OPEN THE 30-DAY PLAN →
                </Link>
              </div>
              {currentStage && (
                <Checklist
                  stageKey={currentStage.key}
                  items={currentStage.items}
                  saved={checks[currentStage.key] ?? []}
                />
              )}
              <div className="flex gap-4 flex-wrap mt-8 pt-5 border-t border-navy-700">
                {currentStage?.resources.map((r) => (
                  <Link key={r.href} href={r.href} className="font-mono text-xs text-gold-400 hover:text-gold-300 tracking-[0.04em]">
                    {r.label.toUpperCase()} →
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* 03 MY RESULTS */}
          <section id="results" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">03 · My Results</div>
              <h2 className="!text-[24px]">Your saved quiz results</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="panel p-7">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-1">Readiness Check</p>
                    {readiness && <p className="text-[13px] text-ink-500">taken on {readiness.created_at}</p>}
                  </div>
                  <ScoreRing score={vaScoreRow?.va_score ?? 0} size={64} />
                </div>
                <p className="text-[15px] font-semibold mb-4">{readiness ? readiness.result : "No result saved yet."}</p>
                <Link href="/tools/readiness" className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px] inline-block">
                  {readiness ? "RETAKE →" : "TAKE IT NOW →"}
                </Link>
              </div>
              <div className="panel p-7">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-1">Niche Finder</p>
                <p className="text-[15px] font-semibold mt-4 mb-4">{niche ? niche.result : "No result saved yet."}</p>
                <p className="text-[12px] text-ink-500 mb-4">{niche ? `taken on ${niche.created_at}` : "Find out which niche fits you."}</p>
                <Link href="/tools/niche-finder" className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px] inline-block">
                  {niche ? "RETAKE →" : "TAKE IT NOW →"}
                </Link>
              </div>
            </div>
          </section>

          {/* 04 CERTIFICATES */}
          <section id="certificates" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">04 · My Certificates</div>
              <h2 className="!text-[24px]">Completed stages and certificates</h2>
            </div>
            <CertificateSection
              stages={ROADMAP.map((s) => ({ key: s.key, title: s.title, complete: pct(s.key) === 100 }))}
              earned={certRows.map((c) => ({ id: c.id, stage_key: c.stage_key, stage_title: c.stage_title }))}
            />
          </section>

          {/* 05 PORTFOLIO */}
          <section id="portfolio" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">05 · Portfolio</div>
              <h2 className="!text-[24px]">Your public page</h2>
            </div>
            <div className="panel p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="font-mono text-[22px] text-gold-400 leading-none mb-2">{portfolioRow ? "✓" : "—"}</p>
                <p className="text-[14.5px] font-semibold mb-1">{portfolioRow ? "Your portfolio is published." : "You don't have a portfolio yet."}</p>
                <p className="text-[12.5px] text-ink-500">
                  {portfolioRow
                    ? `Live at /portfolio/${portfolioRow.slug} — share the link with every application.`
                    : "Create a shareable page with your skills and sample work."}
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Link href="/portfolio-builder" className="btn-primary !py-[10px] !px-[16px] !text-[12px] text-center">
                  {portfolioRow ? "EDIT PORTFOLIO →" : "CREATE PORTFOLIO →"}
                </Link>
                {portfolioRow && (
                  <Link href={`/portfolio/${portfolioRow.slug}`} target="_blank" className="btn-secondary !py-[10px] !px-[16px] !text-[12px] text-center">
                    VIEW PREVIEW ↗
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* 06 JOB TRACKER */}
          <section id="tracker" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">06 · Job Tracker</div>
              <h2 className="!text-[24px]">Track your applications</h2>
            </div>
            <div className="panel p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="font-mono text-[22px] text-gold-400 leading-none mb-2">{appsCount}</p>
                <p className="text-[14.5px] font-semibold mb-1">Applications tracked</p>
                <p className="text-[12.5px] text-ink-500">
                  Keep track of where you applied, interview schedules, and follow-ups.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Link href="/tools/tracker" className="btn-primary !py-[10px] !px-[16px] !text-[12px] text-center">
                  OPEN JOB TRACKER →
                </Link>
              </div>
            </div>
          </section>

          {/* 07 TOOLS */}
          <section id="tools" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">07 · Tools</div>
              <h2 className="!text-[24px]">Everything you need, free</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "AI VA Assistant",
                  desc: "Ask anything about getting hired — rates, negotiation, interviews.",
                  href: "/assistant",
                },
                {
                  title: "AI Mock Interview",
                  desc: "5 real questions for your niche, graded with feedback.",
                  href: "/tools/mock-interview",
                },
                {
                  title: "Interview Coach",
                  desc: "Guide to the questions most often asked — and how to answer.",
                  href: "/tools/interview-coach",
                },
                {
                  title: "Cover Letter Builder",
                  desc: "A letter with substance — not a generic template.",
                  href: "/tools/cover-letter",
                },
                {
                  title: "Pitch Calculator",
                  desc: "Find the rate you need to hit your target.",
                  href: "/tools/pitch-calculator",
                },
                {
                  title: "Job Alerts",
                  desc: "New WFH jobs for Filipino VAs, refreshed regularly.",
                  href: "/jobs",
                },
              ].map((t) => (
                <div key={t.title} className="panel p-7">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-semibold text-[15.5px]">{t.title}</h3>
                  </div>
                  <p className="text-[13.5px] text-ink-500 mb-4">{t.desc}</p>
                  <Link href={t.href} className="font-mono text-[11.5px] text-gold-400 hover:text-gold-300">
                    OPEN →
                  </Link>
                </div>
              ))}
            </div>
            <div className="panel p-7 mt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-[15.5px] mb-2">More tools & courses</h3>
                  <p className="text-[13.5px] text-ink-500 max-w-[560px]">
                    Invoice Generator, Contract Red-Flag Checker, Budget Calculator, Timezone
                    Converter, Resume Builder, Contributions Calculator, and the full course
                    library — all unlocked.
                  </p>
                </div>
                <Link href="/courses" className="font-mono text-[11.5px] text-gold-400 hover:text-gold-300 border border-gold-400/50 rounded-full px-3.5 py-1.5">
                  BROWSE THE LIBRARY →
                </Link>
              </div>
            </div>
          </section>

          {/* 08 ACCOUNT SETTINGS */}
          <section id="settings" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">08 · Account Settings</div>
              <h2 className="!text-[24px]">Profile, password, and preferences</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
              <div className="panel p-7">
                <AccountSettings name={user.name || user.email} email={user.email} updatesOptIn={userRowTyped?.updates_opt_in === 1} />
              </div>
              <div className="flex flex-col gap-6">
                <div className="panel p-7">
                  <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-ink-500 mb-4">Membership</h3>
                  <p className="text-[14.5px] text-ink-50">
                    <strong className="text-gold-400">Free forever</strong> — no plan, no card, no expiry.
                  </p>
                  <p className="text-[12.5px] text-ink-500 mt-2">
                    Every tool and course is available to all members.
                  </p>
                </div>
                <div className="panel p-7">
                  <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-ink-500 mb-4">Data & Privacy</h3>
                  <p className="text-[12.5px] text-ink-500 mb-3">
                    Read how we protect your personal data.
                  </p>
                  <Link href="/privacy-policy" className="font-mono text-[11.5px] text-gold-400 hover:text-gold-300">
                    PRIVACY POLICY →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
