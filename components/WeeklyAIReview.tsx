"use client";

import { useState, useEffect } from "react";

interface WeeklyReviewData {
  weekStart: string;
  tasksCompleted: number;
  totalTasks: number;
  streakDays: number;
  roadmapProgress: number;
  quizTaken: boolean;
  portfolioCreated: boolean;
  applicationsTracked: number;
  certificatesEarned: number;
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

function generateReview(profile: {
  overallPct: number;
  hasPortfolio: boolean;
  hasReadinessQuiz: boolean;
  mainGoal: string;
  currentStage: string;
  applicationsCount: number;
  certificatesCount: number;
  currentStreak: number;
  vaScore: number;
}): { summary: string; highlights: string[]; nextWeekFocus: string; estimatedOutcome: string } {
  const highlights: string[] = [];
  let summary = "";
  let nextWeekFocus = "";
  let estimatedOutcome = "";

  // Progress-based summary
  if (profile.overallPct === 0) {
    summary = "This week you took your first steps. Let's build on that momentum.";
    nextWeekFocus = "Complete the Readiness Quiz and start your first roadmap stage.";
  } else if (profile.overallPct < 25) {
    summary = `You've made progress — ${profile.overallPct}% through the roadmap. Every item counts.`;
    nextWeekFocus = `Keep pushing through the ${profile.currentStage} stage. Aim for 2+ checklist items.`;
  } else if (profile.overallPct < 75) {
    summary = `Solid progress at ${profile.overallPct}%. You're building real skills.`;
    nextWeekFocus = "Focus on completing more roadmap items and building your portfolio.";
  } else if (profile.overallPct < 100) {
    summary = `Almost there — ${profile.overallPct}% done! The finish line is in sight.`;
    nextWeekFocus = "Finish the remaining roadmap items and claim your certificate.";
  } else {
    summary = "Roadmap complete! You've built a strong foundation.";
    nextWeekFocus = "Start applying to jobs and tracking your applications.";
  }

  // Highlights
  if (profile.hasReadinessQuiz) highlights.push("VA Readiness Quiz completed");
  if (profile.hasPortfolio) highlights.push("Portfolio created");
  if (profile.certificatesCount > 0) highlights.push(`${profile.certificatesCount} certificate(s) earned`);
  if (profile.applicationsCount > 0) highlights.push(`${profile.applicationsCount} job application(s) tracked`);
  if (profile.currentStreak >= 3) highlights.push(`${profile.currentStreak}-day activity streak`);
  if (profile.vaScore >= 70) highlights.push(`VA Score: ${profile.vaScore} (strong)`);

  if (highlights.length === 0) {
    highlights.push("You showed up — that's the hardest part");
  }

  // Estimated outcome
  if (profile.overallPct >= 75 && profile.hasPortfolio && profile.vaScore >= 70) {
    estimatedOutcome = "You're on track to become Hire Ready within 1-2 weeks.";
  } else if (profile.overallPct >= 50) {
    estimatedOutcome = "At this pace, you could be Hire Ready in 3-4 weeks.";
  } else if (profile.overallPct > 0) {
    estimatedOutcome = "Keep going — consistent effort compounds into results.";
  } else {
    estimatedOutcome = "Start today. Every expert was once a beginner.";
  }

  return { summary, highlights, nextWeekFocus, estimatedOutcome };
}

export default function WeeklyAIReview(profile: {
  overallPct: number;
  hasPortfolio: boolean;
  hasReadinessQuiz: boolean;
  mainGoal: string;
  currentStage: string;
  applicationsCount: number;
  certificatesCount: number;
  currentStreak: number;
  vaScore: number;
}) {
  const [review, setReview] = useState<ReturnType<typeof generateReview> | null>(null);

  useEffect(() => {
    setReview(generateReview(profile));
  }, [profile.overallPct, profile.hasPortfolio, profile.hasReadinessQuiz, profile.mainGoal, profile.currentStage, profile.applicationsCount, profile.certificatesCount, profile.currentStreak, profile.vaScore]);

  if (!review) return null;

  const weekStart = getWeekStart();

  return (
    <div className="panel p-7">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-1">Weekly Review</p>
          <p className="text-[13.5px] text-ink-500">Week of {weekStart}</p>
        </div>
        <div className="text-[28px]">📊</div>
      </div>

      {/* Summary */}
      <div className="bg-navy-800/50 rounded-[3px] p-4 mb-5">
        <p className="text-[14px] text-ink-50 leading-relaxed">{review.summary}</p>
      </div>

      {/* Highlights */}
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-500 mb-3">This Week&apos;s Highlights</p>
        <div className="space-y-2">
          {review.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
              <span className="text-[13px] text-ink-500">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next week focus */}
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-500 mb-2">Next Week&apos;s Focus</p>
        <p className="text-[13.5px] text-ink-50">{review.nextWeekFocus}</p>
      </div>

      {/* Estimated outcome */}
      <div className="border-t border-navy-700 pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold-400 mb-2">Projected Outcome</p>
        <p className="text-[13.5px] text-gold-300">{review.estimatedOutcome}</p>
      </div>
    </div>
  );
}
