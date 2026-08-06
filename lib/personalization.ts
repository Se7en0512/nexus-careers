/**
 * Personalization Engine
 *
 * Generates dynamic greetings, insights, coach messages, and milestone forecasts
 * based on the user's profile, progress, and activity history.
 */

export interface UserProfile {
  name: string;
  experienceLevel: string;
  mainGoal: string;
  weeklyHours: string;
  interests: string[];
  overallPct: number;
  vaScore: number;
  profileStrength: number;
  hasPortfolio: boolean;
  hasReadinessQuiz: boolean;
  hasNicheQuiz: boolean;
  certificatesCount: number;
  applicationsCount: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  hireReady: boolean;
  currentStage: string;
}

/* ─── Dynamic Greetings ─── */

const GREETINGS = {
  morning: [
    "Good morning, {name} 👋",
    "Rise and shine, {name}! ☀️",
    "Morning, {name} — ready to hustle?",
    "Good morning, {name}! Let's make today count.",
  ],
  afternoon: [
    "Good afternoon, {name} 👋",
    "Hey {name} — how's your day going?",
    "Afternoon, {name}! Keep the momentum going.",
    "Good afternoon, {name}! You're doing great.",
  ],
  evening: [
    "Good evening, {name} 👋",
    "Hey {name} — welcome back!",
    "Evening, {name}! Ready to make progress?",
    "Good evening, {name}! Every step counts.",
  ],
};

const SUBTEXT: Record<string, string[]> = {
  new: [
    "Welcome to Thrive PH — your VA journey starts now.",
    "Let's get you set up for success.",
    "Your first step is the hardest — and you already took it.",
  ],
  beginner: [
    "You're off to a great start — keep going!",
    "Consistency beats perfection. You're building real habits.",
    "Every checkbox you tick brings you closer to your goal.",
  ],
  intermediate: [
    "You're building real momentum. Let's keep it going!",
    "Great progress so far — you're ahead of most people.",
    "You're doing amazing. Let's push forward.",
  ],
  advanced: [
    "You're making serious progress — finish strong!",
    "Almost there — let's cross the finish line together.",
    "You've come so far. Let's make the final push count.",
  ],
  stuck: [
    "It's okay to take breaks — we're here when you're ready.",
    "No pressure. Your progress is saved and waiting for you.",
    "Small steps are still steps. Let's pick up where you left off.",
  ],
  hireReady: [
    "You're Hire Ready! Time to start applying.",
    "Incredible work — you've earned the Hire-Ready badge!",
    "Your profile is strong. Now let's find you clients.",
  ],
};

export function getGreeting(firstName: string, profile: UserProfile): { greeting: string; subtext: string } {
  const hour = new Date().getHours();
  const period = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const greetings = GREETINGS[period];
  const idx = Math.floor(Date.now() / 86400000) % greetings.length;
  const greeting = greetings[idx].replace("{name}", firstName);

  let subtextPool: string[];
  if (profile.hireReady) subtextPool = SUBTEXT.hireReady;
  else if (isStuck(profile)) subtextPool = SUBTEXT.stuck;
  else if (profile.overallPct === 0) subtextPool = SUBTEXT.new;
  else if (profile.overallPct < 25) subtextPool = SUBTEXT.beginner;
  else if (profile.overallPct < 75) subtextPool = SUBTEXT.intermediate;
  else subtextPool = SUBTEXT.advanced;

  const subIdx = Math.floor(Date.now() / 86400000 / 3) % subtextPool.length;
  return { greeting, subtext: subtextPool[subIdx] };
}

/* ─── Stuck Detection ─── */

export function isStuck(profile: UserProfile): boolean {
  if (!profile.lastActivityDate) return false;
  const last = new Date(profile.lastActivityDate).getTime();
  const daysSince = (Date.now() - last) / 86400000;
  return daysSince >= 7;
}

export function getDaysInactive(profile: UserProfile): number {
  if (!profile.lastActivityDate) return 999;
  return Math.floor((Date.now() - new Date(profile.lastActivityDate).getTime()) / 86400000);
}

/* ─── Motivational Coach Messages ─── */

const COACH_MESSAGES = {
  new: [
    "You're closer to your first client than you think. Let's start with the basics.",
    "Every successful VA started exactly where you are right now.",
    "The best time to start was yesterday. The second best time is now.",
  ],
  noQuiz: [
    "Take the Readiness Quiz — it's the fastest way to know where you stand.",
    "Your VA Readiness Score will tell you exactly what to work on next.",
    "A 5-minute quiz could change your entire career trajectory.",
  ],
  noPortfolio: [
    "Your portfolio is your storefront. Clients want to see your work before they hire you.",
    "A strong portfolio can 3x your chances of landing a client.",
    "Portfolio not done? That's your biggest missed opportunity right now.",
  ],
  noResume: [
    "Your resume is your first impression. Make it count.",
    "A polished resume shows clients you take your career seriously.",
    "Resume done? You're one step closer to applying with confidence.",
  ],
  noCert: [
    "Your first certificate is just a few checklists away. Claim it today!",
    "Certificates prove your dedication. They make clients trust you faster.",
    "Complete a roadmap stage and earn your first certificate.",
  ],
  lowScore: [
    "Your VA Score has room to grow. Focus on the roadmap to improve it.",
    "Score not where you want it to be? The roadmap is your shortcut.",
    "Small daily improvements lead to big results. Keep going.",
  ],
  midProgress: [
    "Consistency beats perfection. You're building real habits.",
    "You're doing better than 80% of people who never start.",
    "Every completed lesson brings you one step closer to becoming a successful VA.",
  ],
  almostDone: [
    "You're so close to completing the roadmap. Finish strong!",
    "The hardest part is behind you. Just a few more steps.",
    "Almost there — don't stop now. Your future self will thank you.",
  ],
  hireReady: [
    "You're Hire Ready! Start applying and tracking your applications.",
    "Your profile is strong. Now it's time to hustle for clients.",
    "You've done the work. Now let's find you clients who value your skills.",
  ],
  streak: [
    "You're on a {streak}-day streak! Don't break the chain.",
    "Consistency is your superpower. Keep it going!",
    "Your {streak}-day streak proves you're serious about this.",
  ],
};

export function getCoachMessage(profile: UserProfile): string {
  let pool: string[];

  if (profile.hireReady) pool = COACH_MESSAGES.hireReady;
  else if (profile.currentStreak >= 3) pool = COACH_MESSAGES.streak;
  else if (profile.overallPct >= 75) pool = COACH_MESSAGES.almostDone;
  else if (profile.overallPct >= 25) pool = COACH_MESSAGES.midProgress;
  else if (profile.vaScore < 50 && profile.vaScore > 0) pool = COACH_MESSAGES.lowScore;
  else if (!profile.hasReadinessQuiz) pool = COACH_MESSAGES.noQuiz;
  else if (!profile.hasPortfolio) pool = COACH_MESSAGES.noPortfolio;
  else if (!profile.hasNicheQuiz) pool = COACH_MESSAGES.noResume;
  else if (profile.certificatesCount === 0) pool = COACH_MESSAGES.noCert;
  else if (profile.overallPct === 0) pool = COACH_MESSAGES.new;
  else pool = COACH_MESSAGES.midProgress;

  const idx = Math.floor(Date.now() / 86400000) % pool.length;
  return pool[idx].replace("{streak}", String(profile.currentStreak));
}

/* ─── Personalized Insights ─── */

export interface Insight {
  type: "positive" | "warning" | "info" | "action";
  icon: string;
  text: string;
}

export function getInsights(profile: UserProfile): Insight[] {
  const insights: Insight[] = [];

  // Stuck detection
  if (isStuck(profile)) {
    const days = getDaysInactive(profile);
    insights.push({
      type: "warning",
      icon: "⏰",
      text: `You've been inactive for ${days} day${days > 1 ? "s" : ""}. Need help getting back on track?`,
    });
  }

  // Portfolio empty
  if (!profile.hasPortfolio && profile.overallPct > 10) {
    insights.push({
      type: "action",
      icon: "💼",
      text: "Your portfolio is still empty. Completing it could improve your chances of getting hired.",
    });
  }

  // No quiz taken
  if (!profile.hasReadinessQuiz) {
    insights.push({
      type: "action",
      icon: "📝",
      text: "Take the Readiness Quiz to get your VA Score and personalized recommendations.",
    });
  }

  // Low VA score
  if (profile.vaScore > 0 && profile.vaScore < 50) {
    insights.push({
      type: "info",
      icon: "📊",
      text: `Your VA Score is ${profile.vaScore}. Focus on the roadmap to improve it.`,
    });
  }

  // No certificates
  if (profile.certificatesCount === 0 && profile.overallPct > 20) {
    insights.push({
      type: "action",
      icon: "🏆",
      text: "You're close to earning your first certificate. Complete a roadmap stage to claim it!",
    });
  }

  // Hire ready
  if (profile.hireReady) {
    insights.push({
      type: "positive",
      icon: "🎉",
      text: "You're Hire Ready! Start applying to jobs and tracking your applications.",
    });
  }

  // Strong streak
  if (profile.currentStreak >= 7) {
    insights.push({
      type: "positive",
      icon: "🔥",
      text: `Amazing ${profile.currentStreak}-day streak! You're building serious momentum.`,
    });
  }

  // Profile strength check
  if (profile.profileStrength >= 80 && profile.profileStrength < 100) {
    insights.push({
      type: "info",
      icon: "⭐",
      text: `Your Profile Strength is ${profile.profileStrength}%. Just a few more steps to complete it!`,
    });
  }

  return insights.slice(0, 4);
}

/* ─── Milestone Forecast ─── */

export interface Milestone {
  name: string;
  requirements: Array<{ label: string; done: boolean }>;
  estimatedMinutes: number;
}

export function getMilestoneForecast(profile: UserProfile): Milestone | null {
  if (profile.hireReady) return null;

  // Check hire-ready requirements
  const roadmapComplete = profile.overallPct === 100;
  const hasScore = profile.vaScore >= 80;
  const hasCert = profile.certificatesCount >= 1;
  const hasPort = profile.hasPortfolio;

  if (roadmapComplete && hasScore && hasCert && !hasPort) {
    return {
      name: "Hire-Ready Badge",
      requirements: [
        { label: "Roadmap Complete", done: true },
        { label: "VA Score ≥ 80", done: true },
        { label: "1+ Certificate", done: true },
        { label: "Create Portfolio", done: false },
      ],
      estimatedMinutes: 15,
    };
  }

  if (roadmapComplete && hasScore && !hasCert && hasPort) {
    return {
      name: "Hire-Ready Badge",
      requirements: [
        { label: "Roadmap Complete", done: true },
        { label: "VA Score ≥ 80", done: true },
        { label: "Claim Certificate", done: false },
        { label: "Portfolio Created", done: true },
      ],
      estimatedMinutes: 5,
    };
  }

  if (!roadmapComplete) {
    const nextStage = profile.currentStage;
    return {
      name: `${nextStage} Stage Certificate`,
      requirements: [
        { label: `Complete ${nextStage} checklist`, done: false },
      ],
      estimatedMinutes: 30,
    };
  }

  if (!hasScore) {
    return {
      name: "VA Readiness Score",
      requirements: [
        { label: "Take the Readiness Quiz", done: false },
      ],
      estimatedMinutes: 5,
    };
  }

  return {
    name: "Hire-Ready Badge",
    requirements: [
      { label: "Roadmap Complete", done: roadmapComplete },
      { label: "VA Score ≥ 80", done: hasScore },
      { label: "1+ Certificate", done: hasCert },
      { label: "Portfolio Created", done: hasPort },
    ],
    estimatedMinutes: 20,
  };
}

/* ─── Smart Progress Summary ─── */

export interface ProgressItem {
  label: string;
  done: boolean;
}

export function getSmartProgress(profile: UserProfile): ProgressItem[] {
  return [
    { label: "Name & Account", done: !!profile.name },
    { label: "VA Readiness Quiz", done: profile.hasReadinessQuiz },
    { label: "Niche Finder Quiz", done: profile.hasNicheQuiz },
    { label: "Portfolio Created", done: profile.hasPortfolio },
    { label: "Resume Built", done: profile.hasPortfolio },
    { label: "Roadmap Started", done: profile.overallPct > 0 },
    { label: "Certificate Earned", done: profile.certificatesCount > 0 },
    { label: "Job Applications", done: profile.applicationsCount > 0 },
  ];
}

export function getStepsToHireReady(profile: UserProfile): number {
  let steps = 0;
  if (!profile.hasReadinessQuiz) steps++;
  if (!profile.hasPortfolio) steps++;
  if (profile.certificatesCount === 0) steps++;
  if (profile.overallPct < 100) steps++;
  return steps;
}
