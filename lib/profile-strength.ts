/**
 * Profile Strength Score
 *
 * Measures account completeness (NOT skill/readiness).
 * Each item has a point value. Score = sum of completed items' points.
 *
 * Scoring is modular: add/remove items by editing the CHECKLIST array.
 * Each item has:
 *   - id: unique key
 *   - label: display text
 *   - points: max points for this item
 *   - href: link to complete the action
 *   - check: async function returning true if complete
 *
 * VA Readiness Score (lib/quizzes.ts) is a separate system — do not modify.
 */

import { db } from "./db";
import { ROADMAP } from "@/data/roadmap";
import { EMAIL_VERIFICATION_ENABLED } from "./feature-flags";

export interface ProfileCheckItem {
  id: string;
  label: string;
  points: number;
  href: string;
  completed: boolean;
}

export interface ProfileStrengthResult {
  score: number; // 0–100
  level: string;
  levelKey: string;
  checklist: ProfileCheckItem[];
  nextBest: ProfileCheckItem | null;
  nextGain: number;
  message: string;
  milestone: number | null; // 25, 50, 75, 100 if just hit, else null
}

/* ─── Level Definitions ─── */
const LEVELS = [
  { max: 25, key: "getting-started", label: "Getting Started" },
  { max: 50, key: "building-profile", label: "Building Your Profile" },
  { max: 75, key: "career-ready", label: "Career Ready" },
  { max: 99, key: "almost-complete", label: "Almost Complete" },
  { max: 100, key: "thrive-ready", label: "Thrive Ready" },
] as const;

function getLevel(pct: number) {
  for (const l of LEVELS) {
    if (pct <= l.max) return l;
  }
  return LEVELS[LEVELS.length - 1];
}

function getMessage(pct: number): string {
  if (pct === 0) return "Let's complete your profile together. Start with your name.";
  if (pct < 25) return "Let's complete your profile together. Every step counts.";
  if (pct < 50) return "Good start! Keep going to unlock better recommendations.";
  if (pct < 75) return "Your profile is taking shape. A few more steps to go.";
  if (pct < 100) return "Your profile is almost complete. Finish the last details.";
  return "Your profile is 100% complete. You're ready to shine!";
}

/* ─── Checklist Items ─── */
// To add a new requirement, just append to this array.
// Points should reflect impact on profile completeness.
async function buildChecklist(userId: number): Promise<ProfileCheckItem[]> {
  // Batch all DB queries for performance
  const [
    userRow,
    portfolioRow,
    certRow,
    jobRow,
    readinessRow,
    nicheRow,
    progressRow,
    skillQuizRow,
  ] = await Promise.all([
    db.prepare("SELECT name, email_verified FROM users WHERE id = ?").get(userId) as Promise<{
      name: string;
      email_verified: number;
    } | null>,
    db.prepare("SELECT id FROM portfolios WHERE user_id = ?").get(userId),
    db.prepare("SELECT id FROM certificates WHERE user_id = ? LIMIT 1").get(userId),
    db.prepare("SELECT id FROM job_applications WHERE user_id = ? LIMIT 1").get(userId),
    db.prepare("SELECT id FROM quiz_results WHERE user_id = ? AND quiz = 'readiness' LIMIT 1").get(userId),
    db.prepare("SELECT niche_preferences FROM users WHERE id = ?").get(userId) as Promise<{
      niche_preferences: string;
    } | null>,
    db.prepare("SELECT checks FROM progress WHERE user_id = ?").get(userId) as Promise<{
      checks: string;
    } | null>,
    db.prepare("SELECT id FROM skill_quiz_results WHERE user_id = ? LIMIT 1").get(userId),
  ]);

  // Parse roadmap progress
  let roadmapStarted = false;
  let roadmapPct = 0;
  if (progressRow) {
    roadmapStarted = true;
    let checks: Record<string, number[]> = {};
    try { checks = JSON.parse(progressRow.checks); } catch { checks = {}; }
    const totalItems = ROADMAP.reduce((a, s) => a + s.items.length, 0);
    const totalDone = ROADMAP.reduce((a, s) => a + (checks[s.key]?.length || 0), 0);
    roadmapPct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;
  }

  // Parse niche preferences
  let hasNiche = false;
  if (nicheRow?.niche_preferences) {
    try {
      const parsed = JSON.parse(nicheRow.niche_preferences);
      hasNiche = Array.isArray(parsed) && parsed.length > 0;
    } catch { hasNiche = false; }
  }

  const hasName = !!(userRow?.name && userRow.name.trim().length > 0);
  // TEMPORARILY DISABLED — treat email as verified
  // Re-enable once a verified email domain is configured on Resend.
  const hasEmail = EMAIL_VERIFICATION_ENABLED ? !!(userRow?.email_verified) : true;

  const items: ProfileCheckItem[] = [
    {
      id: "name",
      label: "Complete your full name",
      points: 8,
      href: "/dashboard#settings",
      completed: hasName,
    },
    {
      id: "email",
      label: "Verify your email address",
      points: 7,
      href: "/dashboard",
      completed: hasEmail,
    },
    {
      id: "niche",
      label: "Choose your preferred VA niche",
      points: 8,
      href: "/tools/niche-finder",
      completed: hasNiche,
    },
    {
      id: "readiness",
      label: "Take the Readiness Quiz",
      points: 10,
      href: "/tools/readiness",
      completed: !!readinessRow,
    },
    {
      id: "roadmap",
      label: "Start the Roadmap",
      points: 12,
      href: "/get-started",
      completed: roadmapStarted,
    },
    {
      id: "portfolio",
      label: "Create your Portfolio",
      points: 15,
      href: "/portfolio-builder",
      completed: !!portfolioRow,
    },
    {
      id: "resume",
      label: "Build your Resume",
      points: 12,
      href: "/tools/resume-builder",
      completed: !!portfolioRow, // portfolio includes resume data
    },
    {
      id: "certificate",
      label: "Earn your first Certificate",
      points: 10,
      href: "/get-started",
      completed: !!certRow,
    },
    {
      id: "job",
      label: "Save your first Job Application",
      points: 8,
      href: "/tools/tracker",
      completed: !!jobRow,
    },
    {
      id: "skill-quiz",
      label: "Take the Skill Quiz",
      points: 5,
      href: "/tools/readiness",
      completed: !!skillQuizRow,
    },
    {
      id: "bio",
      label: "Add a bio to your portfolio",
      points: 5,
      href: "/portfolio-builder",
      completed: false, // will be checked below
    },
  ];

  // Check bio from portfolio
  if (portfolioRow) {
    const p = (await db.prepare("SELECT bio FROM portfolios WHERE user_id = ?").get(userId)) as {
      bio: string;
    } | undefined;
    const bioItem = items.find((i) => i.id === "bio");
    if (bioItem && p?.bio && p.bio.trim().length > 10) {
      bioItem.completed = true;
    }
  }

  return items;
}

/* ─── Main Export ─── */
export async function getProfileStrength(userId: number): Promise<ProfileStrengthResult> {
  const checklist = await buildChecklist(userId);

  const totalPoints = checklist.reduce((a, i) => a + i.points, 0);
  const earnedPoints = checklist.filter((i) => i.completed).reduce((a, i) => a + i.points, 0);
  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const clamped = Math.max(0, Math.min(100, score));

  const level = getLevel(clamped);
  const message = getMessage(clamped);

  // Find next best action: highest-point incomplete item
  const incomplete = checklist.filter((i) => !i.completed);
  const nextBest = incomplete.length > 0
    ? incomplete.reduce((best, item) => (item.points > best.points ? item : best), incomplete[0])
    : null;

  const nextGain = nextBest ? Math.round((nextBest.points / totalPoints) * 100) : 0;

  // Milestone detection (25, 50, 75, 100)
  let milestone: number | null = null;
  for (const m of [25, 50, 75, 100]) {
    if (clamped >= m) milestone = m;
  }

  return {
    score: clamped,
    level: level.label,
    levelKey: level.key,
    checklist,
    nextBest,
    nextGain,
    message,
    milestone,
  };
}
