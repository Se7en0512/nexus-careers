/**
 * Recommendation Engine V2
 *
 * Uses all UserProfile fields including experience, weekly hours, interests,
 * VA score, profile strength, streak, and last activity to generate
 * personalized recommendations.
 */

import type { UserProfile } from "./personalization";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  why: string;
  estimatedMinutes: number;
  benefit: string;
  href: string;
  priority: number;
  icon: string;
  category: "getting-started" | "building" | "applying" | "advanced";
}

export interface QuickAction {
  label: string;
  href: string;
  icon: string;
  priority: number;
}

/* ─── Goal-Based Content Priorities ─── */

const GOAL_PRIORITIES: Record<string, string[]> = {
  first_client: ["portfolio", "resume", "tracker", "mock-interview", "cover-letter"],
  learn_skills: ["roadmap", "courses", "readiness", "skill-quiz", "certificates"],
  resume: ["resume", "portfolio", "readiness", "niche-finder", "cover-letter"],
  portfolio: ["portfolio", "resume", "roadmap", "skill-quiz", "mock-interview"],
  interviews: ["mock-interview", "interview-coach", "resume", "portfolio", "cover-letter"],
  earn_more: ["courses", "resume", "portfolio", "tracker", "pitch-calculator"],
};

/* ─── Next Best Action ─── */

export function getNextBestAction(profile: UserProfile): Recommendation {
  const recs: Recommendation[] = [];

  // Use all profile fields for smarter prioritization
  const isBeginner = profile.overallPct < 25;
  const isIntermediate = profile.overallPct >= 25 && profile.overallPct < 75;
  const isAdvanced = profile.overallPct >= 75;
  const hasHighScore = profile.vaScore >= 70;
  const isStale = !profile.lastActivityDate
    ? true
    : (Date.now() - new Date(profile.lastActivityDate).getTime()) / 86400000 >= 7;

  // ── Goal-specific top picks ──
  if (profile.mainGoal === "first_client" && profile.hasReadinessQuiz && isIntermediate) {
    recs.push({
      id: "build-portfolio-goal",
      title: "Build Your Client-Ready Portfolio",
      description: "Show clients what you can do. Your portfolio is your #1 sales tool.",
      why: "Your goal is your first client. A portfolio is the single biggest factor in whether a client replies to your application.",
      estimatedMinutes: 15,
      benefit: "Clients who see a portfolio are 3x more likely to respond",
      href: "/portfolio-builder",
      priority: 110,
      icon: "💼",
      category: "building",
    });
  }

  if (profile.mainGoal === "learn_skills" && isBeginner) {
    recs.push({
      id: "start-learning-path",
      title: "Start Your Learning Path",
      description: "The roadmap is your step-by-step guide to becoming a skilled VA.",
      why: "Your goal is to learn skills. The roadmap covers exactly what clients are looking for.",
      estimatedMinutes: 15,
      benefit: "Build the skills clients actually pay for",
      href: `/get-started#${profile.currentStage}`,
      priority: 110,
      icon: "🗺️",
      category: "getting-started",
    });
  }

  if (profile.mainGoal === "interviews" && profile.hasPortfolio) {
    recs.push({
      id: "mock-interview-goal",
      title: "Practice a Mock Interview",
      description: "Simulate a real client call with AI-powered feedback.",
      why: "Your goal is interview prep. You already have a portfolio — now practice selling yourself.",
      estimatedMinutes: 10,
      benefit: "Walk into interviews with confidence",
      href: "/tools/mock-interview",
      priority: 110,
      icon: "🎤",
      category: "applying",
    });
  }

  if (profile.mainGoal === "resume" && isBeginner) {
    recs.push({
      id: "build-resume-goal",
      title: "Build Your VA Resume",
      description: "Create a professional resume with our builder.",
      why: "Your goal is a strong resume. Start now so you're ready when the right job appears.",
      estimatedMinutes: 10,
      benefit: "Apply to jobs with a polished resume",
      href: "/tools/resume-builder",
      priority: 110,
      icon: "📄",
      category: "building",
    });
  }

  if (profile.mainGoal === "earn_more" && hasHighScore) {
    recs.push({
      id: "pitch-calculator",
      title: "Calculate Your Rate",
      description: "Find the rate you need to hit your income target.",
      why: "Your goal is to earn more. The pitch calculator shows you exactly what to charge based on your skills and experience.",
      estimatedMinutes: 5,
      benefit: "Know your worth and stop undercharging",
      href: "/tools/pitch-calculator",
      priority: 110,
      icon: "💰",
      category: "advanced",
    });
  }

  if (profile.mainGoal === "portfolio" && !profile.hasPortfolio) {
    recs.push({
      id: "create-portfolio-goal",
      title: "Create Your Portfolio",
      description: "Build a shareable page with your skills and experience.",
      why: "Your goal is to improve your portfolio. Start by creating one — it's the foundation.",
      estimatedMinutes: 15,
      benefit: "3x your chances of landing a client",
      href: "/portfolio-builder",
      priority: 110,
      icon: "💼",
      category: "building",
    });
  }

  // 1. Onboarding not completed
  if (profile.overallPct === 0 && !profile.hasReadinessQuiz) {
    recs.push({
      id: "take-readiness-quiz",
      title: "Take the Readiness Quiz",
      description: "A 5-minute quiz to get your VA Score and personalized roadmap.",
      why: "This quiz tells us exactly where you stand and what to work on first.",
      estimatedMinutes: 5,
      benefit: "Get your personalized VA Score and stage assignment",
      href: "/tools/readiness",
      priority: 100,
      icon: "📝",
      category: "getting-started",
    });
  }

  // 2. No portfolio
  if (!profile.hasPortfolio && profile.overallPct > 0) {
    recs.push({
      id: "create-portfolio",
      title: "Create Your Portfolio",
      description: "Build a shareable page with your skills and experience.",
      why: "Clients want to see your work before they hire you. A portfolio is your storefront.",
      estimatedMinutes: 15,
      benefit: "3x your chances of landing a client",
      href: "/portfolio-builder",
      priority: 95,
      icon: "💼",
      category: "building",
    });
  }

  // 3. Roadmap not started
  if (profile.overallPct === 0 && profile.hasReadinessQuiz) {
    recs.push({
      id: "start-roadmap",
      title: "Start Your Roadmap",
      description: "Begin with Stage 1 — Getting Started.",
      why: "The roadmap is your step-by-step guide to becoming a successful VA.",
      estimatedMinutes: 10,
      benefit: "Build foundational skills and earn your first certificate",
      href: `/get-started#${profile.currentStage}`,
      priority: 90,
      icon: "🗺️",
      category: "getting-started",
    });
  }

  // 4. Roadmap incomplete
  if (profile.overallPct > 0 && profile.overallPct < 100) {
    recs.push({
      id: "continue-roadmap",
      title: `Continue the ${profile.currentStage} Stage`,
      description: `You're ${profile.overallPct}% through the roadmap. Keep going!`,
      why: "Each completed item brings you closer to earning a certificate and becoming Hire Ready.",
      estimatedMinutes: 20,
      benefit: `Earn your ${profile.currentStage} stage certificate`,
      href: `/get-started#${profile.currentStage}`,
      priority: 85,
      icon: "🗺️",
      category: "building",
    });
  }

  // 5. No readiness quiz
  if (!profile.hasReadinessQuiz) {
    recs.push({
      id: "take-readiness-quiz-2",
      title: "Take the Readiness Quiz",
      description: "Find out your VA Score and which stage you should start in.",
      why: "Your score helps us personalize your experience and track your growth.",
      estimatedMinutes: 5,
      benefit: "Get your personalized stage assignment",
      href: "/tools/readiness",
      priority: 80,
      icon: "📝",
      category: "getting-started",
    });
  }

  // 6. No niche quiz
  if (!profile.hasNicheQuiz && profile.hasReadinessQuiz) {
    recs.push({
      id: "take-niche-quiz",
      title: "Find Your Niche",
      description: "Discover which VA niche fits your skills and interests.",
      why: "Knowing your niche helps you focus your applications and charge higher rates.",
      estimatedMinutes: 5,
      benefit: "Target the right clients and jobs",
      href: "/tools/niche-finder",
      priority: 75,
      icon: "🎯",
      category: "building",
    });
  }

  // 7. No certificate
  if (profile.certificatesCount === 0 && profile.overallPct > 50) {
    recs.push({
      id: "claim-certificate",
      title: "Claim Your Certificate",
      description: "You've completed a stage — earn your certificate!",
      why: "Certificates prove your skills and dedication to potential clients.",
      estimatedMinutes: 2,
      benefit: "Boost your profile credibility",
      href: "/dashboard#certificates",
      priority: 70,
      icon: "🏆",
      category: "building",
    });
  }

  // 8. No mock interview
  if (profile.hasPortfolio && profile.applicationsCount === 0) {
    recs.push({
      id: "practice-interview",
      title: "Practice Your Interview",
      description: "Try a mock interview to prepare for real client calls.",
      why: "Practice makes perfect. The AI gives you feedback on your answers.",
      estimatedMinutes: 10,
      benefit: "Walk into interviews with confidence",
      href: "/tools/mock-interview",
      priority: 65,
      icon: "🎤",
      category: "applying",
    });
  }

  // 9. No applications tracked
  if (profile.applicationsCount === 0 && profile.overallPct > 50) {
    recs.push({
      id: "track-application",
      title: "Track Your First Application",
      description: "Start tracking your job applications to stay organized.",
      why: "Tracking helps you follow up on time and see your conversion rate.",
      estimatedMinutes: 3,
      benefit: "Stay organized and follow up effectively",
      href: "/tools/tracker",
      priority: 60,
      icon: "📤",
      category: "applying",
    });
  }

  // 10. No resume
  if (!profile.hasPortfolio && profile.overallPct > 30) {
    recs.push({
      id: "build-resume",
      title: "Build Your Resume",
      description: "Create a professional VA resume with our builder.",
      why: "A strong resume shows clients you're professional and serious.",
      estimatedMinutes: 10,
      benefit: "Apply to jobs with a polished resume",
      href: "/tools/resume-builder",
      priority: 55,
      icon: "📄",
      category: "building",
    });
  }

  // 11. Stale user — encourage comeback
  if (isStale && profile.overallPct > 0 && profile.overallPct < 100) {
    recs.push({
      id: "comeback-roadmap",
      title: "Pick Up Where You Left Off",
      description: `You haven't been active in a while. Your roadmap is waiting at ${profile.overallPct}%.`,
      why: "Even 10 minutes of progress today keeps your momentum alive. Small steps add up.",
      estimatedMinutes: 10,
      benefit: "Rebuild your streak and stay on track",
      href: `/get-started#${profile.currentStage}`,
      priority: 88,
      icon: "🔄",
      category: "getting-started",
    });
  }

  // 12. High VA score but no applications — nudge
  if (hasHighScore && profile.applicationsCount === 0 && profile.overallPct > 75) {
    recs.push({
      id: "start-applying",
      title: "Start Applying to Jobs",
      description: "You have the skills. Now it's time to find clients.",
      why: "Your VA Score is strong and your roadmap is nearly done. The next step is to apply.",
      estimatedMinutes: 10,
      benefit: "Turn your preparation into real income",
      href: "/jobs",
      priority: 92,
      icon: "🚀",
      category: "applying",
    });
  }

  // Sort by priority and return the best
  recs.sort((a, b) => b.priority - a.priority);
  return recs[0] || {
    id: "browse-jobs",
    title: "Browse Job Opportunities",
    description: "See the latest VA jobs matched to your skills.",
    why: "New jobs are posted regularly. Apply while they're fresh.",
    estimatedMinutes: 10,
    benefit: "Find your next client",
    href: "/jobs",
    priority: 50,
    icon: "🔍",
    category: "applying",
  };
}

/* ─── Goal-Based Quick Actions ─── */

export function getQuickActions(profile: UserProfile): QuickAction[] {
  const goal = profile.mainGoal;
  const isBeginner = profile.overallPct < 25;
  const isIntermediate = profile.overallPct >= 25 && profile.overallPct < 75;
  const isAdvanced = profile.overallPct >= 75;

  // Stale users get a comeback action first
  const isStale = !profile.lastActivityDate
    ? true
    : (Date.now() - new Date(profile.lastActivityDate).getTime()) / 86400000 >= 7;

  if (isStale && profile.overallPct > 0) {
    return [
      { label: "Continue Roadmap", href: `/get-started#${profile.currentStage}`, icon: "🗺️", priority: 100 },
      { label: "Daily Motivation", href: "/dashboard#motivation", icon: "☀️", priority: 90 },
      { label: "Track Applications", href: "/tools/tracker", icon: "📤", priority: 80 },
    ];
  }

  if (isBeginner) {
    return [
      { label: "Start Roadmap", href: "/get-started", icon: "🗺️", priority: 100 },
      { label: "Take Readiness Quiz", href: "/tools/readiness", icon: "📝", priority: 90 },
      { label: "Find Your Niche", href: "/tools/niche-finder", icon: "🎯", priority: 80 },
    ];
  }

  if (isAdvanced) {
    return [
      { label: "Track Applications", href: "/tools/tracker", icon: "📤", priority: 100 },
      { label: "Update Portfolio", href: "/portfolio-builder", icon: "💼", priority: 90 },
      { label: "Browse Jobs", href: "/jobs", icon: "🔍", priority: 80 },
    ];
  }

  // Intermediate — goal-based
  const goalActions: Record<string, QuickAction[]> = {
    first_client: [
      { label: "Build Portfolio", href: "/portfolio-builder", icon: "💼", priority: 100 },
      { label: "Track Applications", href: "/tools/tracker", icon: "📤", priority: 90 },
      { label: "Practice Interview", href: "/tools/mock-interview", icon: "🎤", priority: 80 },
    ],
    learn_skills: [
      { label: "Continue Roadmap", href: `/get-started#${profile.currentStage}`, icon: "🗺️", priority: 100 },
      { label: "Browse Courses", href: "/courses", icon: "📚", priority: 90 },
      { label: "Take Skill Quiz", href: "/tutorials", icon: "📝", priority: 80 },
    ],
    resume: [
      { label: "Build Resume", href: "/tools/resume-builder", icon: "📄", priority: 100 },
      { label: "Create Portfolio", href: "/portfolio-builder", icon: "💼", priority: 90 },
      { label: "Write Cover Letter", href: "/tools/cover-letter", icon: "✉️", priority: 80 },
    ],
    portfolio: [
      { label: "Build Portfolio", href: "/portfolio-builder", icon: "💼", priority: 100 },
      { label: "Continue Roadmap", href: `/get-started#${profile.currentStage}`, icon: "🗺️", priority: 90 },
      { label: "Build Resume", href: "/tools/resume-builder", icon: "📄", priority: 80 },
    ],
    interviews: [
      { label: "Mock Interview", href: "/tools/mock-interview", icon: "🎤", priority: 100 },
      { label: "Interview Coach", href: "/tools/interview-coach", icon: "📚", priority: 90 },
      { label: "Build Resume", href: "/tools/resume-builder", icon: "📄", priority: 80 },
    ],
    earn_more: [
      { label: "Browse Courses", href: "/courses", icon: "📚", priority: 100 },
      { label: "Update Portfolio", href: "/portfolio-builder", icon: "💼", priority: 90 },
      { label: "Pitch Calculator", href: "/tools/pitch-calculator", icon: "💰", priority: 80 },
    ],
  };

  return goalActions[goal] || [
    { label: "Continue Roadmap", href: `/get-started#${profile.currentStage}`, icon: "🗺️", priority: 100 },
    { label: "Build Portfolio", href: "/portfolio-builder", icon: "💼", priority: 90 },
    { label: "Track Applications", href: "/tools/tracker", icon: "📤", priority: 80 },
  ];
}

/* ─── Goal-Based Content Prioritization ─── */

export interface GoalContentSection {
  title: string;
  items: Array<{ label: string; href: string; icon: string; description: string }>;
}

export function getGoalBasedContent(profile: UserProfile): GoalContentSection[] {
  const goal = profile.mainGoal;
  const sections: GoalContentSection[] = [];

  if (goal === "first_client") {
    sections.push({
      title: "Your Client-Getting Toolkit",
      items: [
        { label: "Resume Builder", href: "/tools/resume-builder", icon: "📄", description: "Polish your professional resume" },
        { label: "Portfolio Builder", href: "/portfolio-builder", icon: "💼", description: "Create your online portfolio" },
        { label: "Job Tracker", href: "/tools/tracker", icon: "📤", description: "Track every application" },
        { label: "Mock Interview", href: "/tools/mock-interview", icon: "🎤", description: "Practice before the real thing" },
      ],
    });
  } else if (goal === "learn_skills") {
    sections.push({
      title: "Your Learning Path",
      items: [
        { label: "Continue Roadmap", href: `/get-started#${profile.currentStage}`, icon: "🗺️", description: "Step-by-step career guide" },
        { label: "Course Library", href: "/courses", icon: "📚", description: "27+ free courses from top providers" },
        { label: "Tutorials", href: "/tutorials", icon: "🛠️", description: "Learn essential VA tools" },
        { label: "Certificates", href: "/dashboard#certificates", icon: "🏆", description: "Earn certificates as you complete stages" },
      ],
    });
  } else if (goal === "interviews") {
    sections.push({
      title: "Interview Preparation",
      items: [
        { label: "Mock Interview", href: "/tools/mock-interview", icon: "🎤", description: "AI-powered practice interviews" },
        { label: "Interview Coach", href: "/tools/interview-coach", icon: "📚", description: "Common questions & answers" },
        { label: "Resume Builder", href: "/tools/resume-builder", icon: "📄", description: "Polish your resume first" },
        { label: "Cover Letter", href: "/tools/cover-letter", icon: "✉️", description: "Write a winning cover letter" },
      ],
    });
  }

  return sections;
}
