import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROADMAP, stageFromKey } from "@/data/roadmap";
import { PLAN_30 } from "@/data/plan30";
import { getStreak, hasBadge, refreshHireReadyBadge, roadmapCompletion, getCheckinStreak, hasCheckedInThisWeek } from "@/lib/gamification";
import { getGreeting, getCoachMessage, getInsights, getMilestoneForecast, getSmartProgress, getStepsToHireReady, type UserProfile } from "@/lib/personalization";
import { getNextBestAction, getQuickActions } from "@/lib/recommendations";
import EmptyState from "@/components/EmptyState";
import WeeklyCheckin from "@/components/WeeklyCheckin";
import Checklist from "@/components/Checklist";
import ScoreRing from "@/components/ScoreRing";
import CertificateSection from "@/components/CertificateSection";
import AccountSettings from "@/components/AccountSettings";
import ProfileStrengthCard from "@/components/ProfileStrengthCard";
import DailyMotivation from "@/components/DailyMotivation";
import ActivityTimeline from "@/components/ActivityTimeline";
import TodayFocus from "@/components/TodayFocus";
import PersonalizedInsights from "@/components/PersonalizedInsights";
import MilestoneForecast from "@/components/MilestoneForecast";
import MotivationalCoach from "@/components/MotivationalCoach";
import AdaptiveQuickActions from "@/components/AdaptiveQuickActions";
import SmartProgressSummary from "@/components/SmartProgressSummary";
import SmartWeeklyPlan from "@/components/SmartWeeklyPlan";
import WeeklyAIReview from "@/components/WeeklyAIReview";
import CareerJourneyMap from "@/components/CareerJourneyMap";
import CareerReadinessInsights from "@/components/CareerReadinessInsights";

export const metadata: Metadata = { title: "Dashboard" };

export const dynamic = "force-dynamic";

const SECTIONS = [
  { id: "overview", num: "01", label: "Overview" },
  { id: "tools", num: "02", label: "Career Tools" },
  { id: "roadmap", num: "03", label: "Roadmap Progress" },
  { id: "motivation", num: "04", label: "Daily Motivation" },
  { id: "weekly-plan", num: "05", label: "Weekly Plan" },
  { id: "readiness", num: "06", label: "Readiness Insights" },
  { id: "journey", num: "07", label: "Career Journey" },
  { id: "activity", num: "08", label: "Activity" },
  { id: "results", num: "09", label: "My Results" },
  { id: "certificates", num: "10", label: "My Certificates" },
  { id: "portfolio", num: "11", label: "Portfolio" },
  { id: "tracker", num: "12", label: "Job Tracker" },
  { id: "settings", num: "13", label: "Account Settings" },
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
    onboarding,
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
    db.prepare("SELECT experience_level, main_goal, weekly_hours, interests FROM user_onboarding WHERE user_id = ?").get(user.id),
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

  const onboardingRow = onboarding as { experience_level?: string; main_goal?: string; weekly_hours?: string; interests?: string } | undefined;
  const firstName = (user.name || user.email).split(" ")[0];
  const totalDone = ROADMAP.reduce((acc, s) => acc + (checks[s.key]?.length || 0), 0);
  const totalItems = ROADMAP.reduce((acc, s) => acc + s.items.length, 0);
  const overallPct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;

  const roadmap = await roadmapCompletion(user.id);
  await refreshHireReadyBadge(user.id);
  const hireReady = await hasBadge(user.id, "hire_ready");

  // Build user profile for personalization engine
  const interests = (() => {
    try { return JSON.parse(onboardingRow?.interests || "[]"); } catch { return []; }
  })() as string[];

  const userProfile: UserProfile = {
    name: user.name || user.email,
    experienceLevel: onboardingRow?.experience_level || "",
    mainGoal: onboardingRow?.main_goal || "",
    weeklyHours: onboardingRow?.weekly_hours || "",
    interests,
    overallPct,
    vaScore: vaScoreRow?.va_score ?? 0,
    profileStrength: 0, // will be set below
    hasPortfolio: !!portfolioRow,
    hasReadinessQuiz: !!readiness,
    hasNicheQuiz: !!niche,
    certificatesCount: certRows.length,
    applicationsCount: appsCount,
    currentStreak: streak.current_streak,
    longestStreak: streak.longest_streak,
    lastActivityDate: streak.last_activity_date,
    hireReady,
    currentStage: currentStage?.title || "Getting Started",
  };

  // Get personalized data
  const { greeting, subtext } = getGreeting(firstName, userProfile);
  const nextBestAction = getNextBestAction(userProfile);
  const coachMessage = getCoachMessage(userProfile);
  const insights = getInsights(userProfile);
  const milestone = getMilestoneForecast(userProfile);
  const progressItems = getSmartProgress(userProfile);
  const stepsToHireReady = getStepsToHireReady(userProfile);
  const quickActions = getQuickActions(userProfile);

  // Determine user level for progressive dashboard
  const hasOnboarding = !!onboardingRow?.experience_level;
  const hasQuizzes = !!readiness || !!niche;
  const hasStartedRoadmap = totalDone > 0;

  // NEW: no onboarding, no quizzes, no roadmap progress
  // INTERMEDIATE: has onboarding but <75% roadmap
  // ADVANCED: >=75% roadmap
  const userLevel: "new" | "intermediate" | "advanced" = !hasOnboarding
    ? "new"
    : overallPct >= 75
      ? "advanced"
      : "intermediate";

  // Filter sections by user level
  const visibleSections = SECTIONS.filter((s) => {
    if (userLevel === "new") {
      // New users: only overview, roadmap, portfolio, settings
      return ["overview", "roadmap", "portfolio", "settings"].includes(s.id);
    }
    if (userLevel === "intermediate") {
      // Intermediate: hide activity, results, certificates (show later)
      return !["activity", "results", "certificates"].includes(s.id);
    }
    // Advanced: show everything
    return true;
  });

  // Re-number visible sections for nav
  const numberedSections = visibleSections.map((s, i) => ({
    ...s,
    num: String(i + 1).padStart(2, "0"),
  }));

  // Lookup for dynamic section numbers in eyebrow labels
  const sectionNum = Object.fromEntries(numberedSections.map((s) => [s.id, s.num]));

  return (
    <>
      {/* HERO — Greeting + Today's Focus + Stats */}
      <TodayFocus
        greeting={greeting}
        subtext={subtext}
        rec={nextBestAction}
        vaScore={vaScoreRow?.va_score ?? 0}
        overallPct={overallPct}
        currentStreak={streak.current_streak}
        longestStreak={streak.longest_streak}
        hireReady={hireReady}
      />

      <div className="wrap py-14 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 items-start">
        {/* SECTION NAV — filtered and re-numbered */}
        <nav aria-label="Dashboard sections" className="lg:sticky lg:top-24 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-8 px-8 lg:mx-0 lg:px-0">
          {numberedSections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-label={`${s.num} ${s.label}`}
              className="flex items-center gap-3 whitespace-nowrap lg:whitespace-normal font-mono text-[12px] uppercase tracking-[0.08em] text-ink-500 hover:text-gold-300 transition-colors border border-navy-800 lg:border-0 rounded-[3px] px-3.5 lg:px-0 py-2 lg:py-1.5 min-h-[44px]"
            >
              <span className="text-gold-400/70" aria-hidden="true">{s.num}</span>
              {s.label}
            </a>
          ))}
        </nav>

        {/* MAIN CONTENT */}
        <div className="flex flex-col gap-14 min-w-0">

          {/* ═══════════════════════════════════════════════════════
              01 OVERVIEW — always visible
          ═══════════════════════════════════════════════════════ */}
          <section id="overview" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">{sectionNum.overview} · Overview</div>
              <h2 className="!text-[22px]">Your progress right now</h2>
            </div>

            {/* NEW USER: Onboarding checklist */}
            {userLevel === "new" && (
              <div className="panel p-7 mb-6" role="region" aria-label="Getting started checklist">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-[22px]" aria-hidden="true">🚀</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400">
                    Get Started in 3 Steps
                  </span>
                </div>
                <p className="text-[14.5px] text-ink-500 mb-6">
                  Complete these to unlock your personalized dashboard.
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      done: !!readiness,
                      title: "Take the Readiness Quiz",
                      desc: "2 minutes — find out where to start.",
                      href: "/tools/readiness",
                    },
                    {
                      done: !!onboardingRow?.main_goal,
                      title: "Set Your Career Goal",
                      desc: "Tell us what you want — we'll personalize everything.",
                      href: "/get-started",
                    },
                    {
                      done: !!portfolioRow,
                      title: "Create Your Portfolio",
                      desc: "5 minutes — build a page clients can view.",
                      href: "/portfolio-builder",
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 p-4 rounded-[3px] border transition-colors ${
                        step.done
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-navy-700 bg-navy-800/40"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-[13px] font-semibold ${
                        step.done
                          ? "bg-emerald-500 text-navy-950"
                          : "bg-navy-700 text-ink-500"
                      }`}>
                        {step.done ? "✓" : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14.5px] font-semibold ${step.done ? "text-emerald-400" : ""}`}>
                          {step.title}
                        </p>
                        <p className="text-[12.5px] text-ink-500 mt-0.5">{step.desc}</p>
                      </div>
                      {!step.done && (
                        <Link href={step.href} className="flex-shrink-0 btn-primary !py-[8px] !px-[14px] !text-[11px]">
                          START →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {/* Personalized sections in 2-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <MotivationalCoach message={coachMessage} />
              <MilestoneForecast milestone={milestone} />
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500 mb-3">Quick Actions</p>
              <AdaptiveQuickActions actions={quickActions} />
            </div>

            {/* Insights */}
            {insights.length > 0 && (
              <div className="mb-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500 mb-3">Insights</p>
                <PersonalizedInsights insights={insights} />
              </div>
            )}

            {/* Smart Progress Summary + Profile Strength */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SmartProgressSummary items={progressItems} stepsToHireReady={stepsToHireReady} />
              <ProfileStrengthCard />
            </div>

            <div className="mt-6">
              <WeeklyCheckin initialApps={appsCount} streak={checkinStreak} checkedIn={weeklyCheckedIn} />
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              02 TOOLS — intermediate + advanced only
          ═══════════════════════════════════════════════════════ */}
          {userLevel !== "new" && (
            <section id="tools" className="scroll-mt-24">
              <div className="section-head !mb-6">
                <div className="eyebrow">{sectionNum.tools} · Career Tools</div>
                <h2 className="!text-[22px]">Everything you need, free</h2>
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
                  {
                    title: "Resume Builder",
                    desc: "A clean, client-ready resume in minutes — live preview, export as PDF.",
                    href: "/tools/resume-builder",
                  },
                ].map((t) => (
                  <div key={t.title} className="panel p-7 hover-lift">
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
          )}

          {/* ═══════════════════════════════════════════════════════
              03 READINESS INSIGHTS — intermediate + advanced only
          ═══════════════════════════════════════════════════════ */}
          {userLevel !== "new" && (
            <section id="readiness" className="scroll-mt-24">
              <div className="section-head !mb-6">
                <div className="eyebrow">{sectionNum.readiness} · Readiness Insights</div>
                <h2 className="!text-[22px]">How prepared are you?</h2>
              </div>
              <CareerReadinessInsights />
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              03 CAREER JOURNEY — intermediate + advanced only
          ═══════════════════════════════════════════════════════ */}
          {userLevel !== "new" && (
            <section id="journey" className="scroll-mt-24">
              <div className="section-head !mb-6">
                <div className="eyebrow">{sectionNum.journey} · Career Journey</div>
                <h2 className="!text-[22px]">Your path to becoming a VA</h2>
              </div>
              <CareerJourneyMap
                overallPct={overallPct}
                hasPortfolio={!!portfolioRow}
                hasReadinessQuiz={!!readiness}
                hasNicheQuiz={!!niche}
                certificatesCount={certRows.length}
                applicationsCount={appsCount}
                hireReady={hireReady}
              />
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              04 WEEKLY PLAN — intermediate + advanced only
          ═══════════════════════════════════════════════════════ */}
          {userLevel !== "new" && (
            <section id="weekly-plan" className="scroll-mt-24">
              <div className="section-head !mb-6">
                <div className="eyebrow">{sectionNum["weekly-plan"]} · Weekly Plan</div>
                <h2 className="!text-[22px]">Your personalized week</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SmartWeeklyPlan
                  overallPct={overallPct}
                  hasPortfolio={!!portfolioRow}
                  hasReadinessQuiz={!!readiness}
                  mainGoal={onboardingRow?.main_goal || ""}
                  currentStage={currentStage?.title || "Getting Started"}
                  applicationsCount={appsCount}
                  certificatesCount={certRows.length}
                />
                <WeeklyAIReview
                  overallPct={overallPct}
                  hasPortfolio={!!portfolioRow}
                  hasReadinessQuiz={!!readiness}
                  mainGoal={onboardingRow?.main_goal || ""}
                  currentStage={currentStage?.title || "Getting Started"}
                  applicationsCount={appsCount}
                  certificatesCount={certRows.length}
                  currentStreak={streak.current_streak}
                  vaScore={vaScoreRow?.va_score ?? 0}
                />
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              05 DAILY MOTIVATION — always visible
          ═══════════════════════════════════════════════════════ */}
          <section id="motivation" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">{sectionNum.motivation} · Daily Motivation</div>
              <h2 className="!text-[22px]">Your daily boost</h2>
            </div>
            <DailyMotivation />
          </section>

          {/* ═══════════════════════════════════════════════════════
              06 ACTIVITY — advanced only
          ═══════════════════════════════════════════════════════ */}
          {userLevel === "advanced" && (
            <section id="activity" className="scroll-mt-24">
              <div className="section-head !mb-6">
                <div className="eyebrow">{sectionNum.activity} · Activity</div>
                <h2 className="!text-[22px]">Your recent activity</h2>
              </div>
              <div className="panel p-7">
                <ActivityTimeline userId={user.id} />
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              07 ROADMAP — always visible
          ═══════════════════════════════════════════════════════ */}
          <section id="roadmap" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">{sectionNum.roadmap} · Roadmap Progress</div>
              <h2 className="!text-[22px]">Roadmap & 30-Day Plan</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-navy-700 border border-navy-700 mb-8">
              {ROADMAP.map((s) => (
                <div key={s.key} className={`bg-navy-900 p-6 ${s.key === currentStageKey ? "ring-1 ring-inset ring-gold-400/50" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] text-gold-400">{s.num}</span>
                    {s.key === currentStageKey && (
                      <span className="font-mono text-[10px] text-navy-950 bg-gold-400 rounded-full px-2 py-0.5 uppercase tracking-wide">
                        You&apos;re here
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

          {/* ═══════════════════════════════════════════════════════
              08 MY RESULTS — advanced only
          ═══════════════════════════════════════════════════════ */}
          {userLevel === "advanced" && (
            <section id="results" className="scroll-mt-24">
              <div className="section-head !mb-6">
                <div className="eyebrow">{sectionNum.results} · My Results</div>
                <h2 className="!text-[22px]">Your saved quiz results</h2>
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
                  {readiness ? (
                    <>
                      <p className="text-[15px] font-semibold mb-4">{readiness.result}</p>
                      <Link href="/tools/readiness" className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px] inline-block">
                        RETAKE →
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-[14px] text-ink-300 mb-2">Find out which stage to start from — 8 questions, 2 minutes.</p>
                      <p className="text-[12.5px] text-ink-500 mb-4">It isn&apos;t a grade — it&apos;s a guide so you don&apos;t waste time on the wrong step.</p>
                      <Link href="/tools/readiness" className="btn-primary !py-[10px] !px-[16px] !text-[12.5px] inline-block">
                        TAKE IT NOW →
                      </Link>
                    </>
                  )}
                </div>
                <div className="panel p-7">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-1">Niche Finder</p>
                  {niche ? (
                    <>
                      <p className="text-[15px] font-semibold mt-4 mb-4">{niche.result}</p>
                      <p className="text-[12px] text-ink-500 mb-4">taken on {niche.created_at}</p>
                      <Link href="/tools/niche-finder" className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px] inline-block">
                        RETAKE →
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-[14px] text-ink-300 mt-4 mb-2">8 questions to find which VA specialization fits you.</p>
                      <p className="text-[12.5px] text-ink-500 mb-4">The result is a recommendation — not a verdict. Based on your personality, skills, and interests.</p>
                      <Link href="/tools/niche-finder" className="btn-primary !py-[10px] !px-[16px] !text-[12.5px] inline-block">
                        FIND YOUR NICHE →
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              09 CERTIFICATES — advanced only
          ═══════════════════════════════════════════════════════ */}
          {userLevel === "advanced" && (
            <section id="certificates" className="scroll-mt-24">
              <div className="section-head !mb-6">
                <div className="eyebrow">{sectionNum.certificates} · My Certificates</div>
                <h2 className="!text-[22px]">Completed stages and certificates</h2>
              </div>
              <CertificateSection
                stages={ROADMAP.map((s) => ({ key: s.key, title: s.title, complete: pct(s.key) === 100 }))}
                earned={certRows.map((c) => ({ id: c.id, stage_key: c.stage_key, stage_title: c.stage_title }))}
              />
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              10 PORTFOLIO — always visible (important for all levels)
          ═══════════════════════════════════════════════════════ */}
          <section id="portfolio" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">{sectionNum.portfolio} · Portfolio</div>
              <h2 className="!text-[22px]">Your public page</h2>
            </div>
            {portfolioRow ? (
              <div className="panel p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-[3px] bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-[24px]" aria-hidden="true">
                    ✓
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold mb-1">Your portfolio is published.</p>
                    <p className="text-[13px] text-ink-500">
                      Live at /portfolio/{portfolioRow.slug} — share the link with every application.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <Link href="/portfolio-builder" className="btn-primary !py-[10px] !px-[16px] !text-[12px] text-center">
                    EDIT PORTFOLIO →
                  </Link>
                  <Link href={`/portfolio/${portfolioRow.slug}`} target="_blank" className="btn-secondary !py-[10px] !px-[16px] !text-[12px] text-center">
                    VIEW PREVIEW ↗
                  </Link>
                </div>
              </div>
            ) : (
              <EmptyState
                icon="💼"
                title="Create your professional portfolio"
                description="A shareable page clients can view in under 5 minutes. Skills, projects, and trust signals — all in one link."
                action={{ label: "CREATE PORTFOLIO →", href: "/portfolio-builder" }}
                variant="motivational"
              />
            )}
          </section>

          {/* ═══════════════════════════════════════════════════════
              11 JOB TRACKER — advanced only
          ═══════════════════════════════════════════════════════ */}
          {userLevel === "advanced" && (
            <section id="tracker" className="scroll-mt-24">
              <div className="section-head !mb-6">
                <div className="eyebrow">{sectionNum.tracker} · Job Tracker</div>
                <h2 className="!text-[22px]">Track your applications</h2>
              </div>
              {appsCount > 0 ? (
                <div className="panel p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-[3px] bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-[24px]" aria-hidden="true">
                      📊
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold mb-1">{appsCount} applications tracked</p>
                      <p className="text-[13px] text-ink-500">
                        Keep track of where you applied, interview schedules, and follow-ups.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <Link href="/tools/tracker" className="btn-primary !py-[10px] !px-[16px] !text-[12px] text-center">
                      OPEN JOB TRACKER →
                    </Link>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon="📤"
                  title="Start tracking your applications"
                  description="Know exactly where you applied, who responded, and what to follow up on."
                  action={{ label: "OPEN JOB TRACKER →", href: "/tools/tracker" }}
                  variant="motivational"
                />
              )}
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              13 ACCOUNT SETTINGS — always visible
          ═══════════════════════════════════════════════════════ */}
          <section id="settings" className="scroll-mt-24">
            <div className="section-head !mb-6">
              <div className="eyebrow">{sectionNum.settings} · Account Settings</div>
              <h2 className="!text-[22px]">Profile, password, and preferences</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
              <div className="panel p-7">
                <AccountSettings name={user.name || user.email} email={user.email} updatesOptIn={userRowTyped?.updates_opt_in === 1} mainGoal={onboardingRow?.main_goal || ""} />
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
