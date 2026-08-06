import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getReadinessInsights } from "@/lib/readiness";
import { getStreak, hasBadge, roadmapCompletion } from "@/lib/gamification";
import { stageFromKey } from "@/data/roadmap";
import type { UserProfile } from "@/lib/personalization";

export async function GET() {
  let user;
  try {
    user = await getSessionUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const userId = user!.id;

  const [
    progress,
    quizzes,
    vaScore,
    planDone,
    portfolio,
    certificates,
    appsCountRow,
    streak,
    onboarding,
    skillQuizzes,
  ] = await Promise.all([
    db.prepare("SELECT stage, checks, updated_at FROM progress WHERE user_id = ?").get(userId),
    db.prepare("SELECT quiz, result, payload, created_at FROM quiz_results WHERE user_id = ? ORDER BY created_at DESC").all(userId),
    db.prepare("SELECT va_score FROM users WHERE id = ?").get(userId),
    db.prepare("SELECT day FROM daily_plan_progress WHERE user_id = ? AND done = 1").all(userId),
    db.prepare("SELECT slug, updated_at FROM portfolios WHERE user_id = ?").get(userId),
    db.prepare("SELECT id, stage_key, stage_title, date_issued FROM certificates WHERE user_id = ? ORDER BY date_issued").all(userId),
    db.prepare("SELECT COUNT(*) AS n FROM job_applications WHERE user_id = ?").get(userId),
    getStreak(userId),
    db.prepare("SELECT experience_level, main_goal, weekly_hours, interests FROM user_onboarding WHERE user_id = ?").get(userId),
    db.prepare("SELECT COUNT(*) AS n FROM skill_quiz_results WHERE user_id = ?").get(userId),
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
  const planDoneRows = planDone as unknown as Array<{ day: number }>;
  const portfolioRow = portfolio as { slug: string; updated_at: string } | undefined;
  const certRows = certificates as unknown as Array<{ id: number; stage_key: string; stage_title: string; date_issued: string }>;
  const appsCount = (appsCountRow as { n: number } | undefined)?.n ?? 0;
  const onboardingRow = onboarding as { experience_level?: string; main_goal?: string; weekly_hours?: string; interests?: string } | undefined;
  const skillQuizCount = (skillQuizzes as { n: number } | undefined)?.n ?? 0;

  const totalDone = 28; // simplified for API
  const totalItems = 28;
  const overallPct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;

  const interests = (() => {
    try { return JSON.parse(onboardingRow?.interests || "[]"); } catch { return []; }
  })() as string[];

  const roadmap = await roadmapCompletion(userId);
  await hasBadge(userId, "hire_ready");

  const userProfile: UserProfile = {
    name: user!.name || user!.email,
    experienceLevel: onboardingRow?.experience_level || "",
    mainGoal: onboardingRow?.main_goal || "",
    weeklyHours: onboardingRow?.weekly_hours || "",
    interests,
    overallPct: roadmap.pct,
    vaScore: vaScoreRow?.va_score ?? 0,
    profileStrength: 0,
    hasPortfolio: !!portfolioRow,
    hasReadinessQuiz: !!readiness,
    hasNicheQuiz: !!niche,
    certificatesCount: certRows.length,
    applicationsCount: appsCount,
    currentStreak: streak.current_streak,
    longestStreak: streak.longest_streak,
    lastActivityDate: streak.last_activity_date,
    hireReady: await hasBadge(userId, "hire_ready"),
    currentStage: currentStage?.title || "Getting Started",
  };

  const result = getReadinessInsights(userProfile);
  return NextResponse.json(result);
}
