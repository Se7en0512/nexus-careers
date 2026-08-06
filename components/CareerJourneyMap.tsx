"use client";

interface JourneyStage {
  id: string;
  label: string;
  icon: string;
  description: string;
  completed: boolean;
  current: boolean;
}

function getJourneyStages(profile: {
  overallPct: number;
  hasPortfolio: boolean;
  hasReadinessQuiz: boolean;
  hasNicheQuiz: boolean;
  certificatesCount: number;
  applicationsCount: number;
  hireReady: boolean;
}): JourneyStage[] {
  const roadmapStarted = profile.overallPct > 0;
  const roadmapComplete = profile.overallPct === 100;
  const hasClient = profile.applicationsCount >= 3;

  return [
    {
      id: "join",
      label: "Join Thrive",
      icon: "👋",
      description: "Created your account",
      completed: true,
      current: false,
    },
    {
      id: "learn",
      label: "Learn Skills",
      icon: "📚",
      description: "Complete the roadmap stages",
      completed: roadmapComplete,
      current: roadmapStarted && !roadmapComplete,
    },
    {
      id: "resume",
      label: "Build Resume",
      icon: "📄",
      description: "Create a professional resume",
      completed: profile.hasPortfolio,
      current: !profile.hasPortfolio && roadmapStarted,
    },
    {
      id: "portfolio",
      label: "Create Portfolio",
      icon: "💼",
      description: "Show clients what you can do",
      completed: profile.hasPortfolio,
      current: !profile.hasPortfolio && roadmapStarted,
    },
    {
      id: "interview",
      label: "Interview Prep",
      icon: "🎤",
      description: "Practice mock interviews",
      completed: profile.hireReady,
      current: profile.hasPortfolio && !profile.hireReady,
    },
    {
      id: "apply",
      label: "Apply to Jobs",
      icon: "📤",
      description: "Start tracking applications",
      completed: profile.applicationsCount >= 3,
      current: profile.hireReady && profile.applicationsCount < 3,
    },
    {
      id: "first_client",
      label: "First Client",
      icon: "🤝",
      description: "Land your first paying client",
      completed: hasClient,
      current: profile.applicationsCount > 0 && !hasClient,
    },
    {
      id: "thrive",
      label: "Thrive",
      icon: "🚀",
      description: "Grow your VA career",
      completed: false,
      current: hasClient,
    },
  ];
}

export default function CareerJourneyMap(profile: {
  overallPct: number;
  hasPortfolio: boolean;
  hasReadinessQuiz: boolean;
  hasNicheQuiz: boolean;
  certificatesCount: number;
  applicationsCount: number;
  hireReady: boolean;
}) {
  const stages = getJourneyStages(profile);
  const completedCount = stages.filter((s) => s.completed).length;
  const progress = Math.round((completedCount / stages.length) * 100);

  return (
    <div className="panel p-7">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-1">Career Journey</p>
          <p className="text-[13.5px] text-ink-500">{completedCount}/{stages.length} stages completed</p>
        </div>
        <div className="font-mono text-[22px] text-gold-400 leading-none">{progress}%</div>
      </div>

      {/* Journey path */}
      <div className="relative">
        {/* Connector line */}
        <div className="absolute left-[19px] top-[24px] bottom-[24px] w-[2px] bg-navy-700" />
        <div
          className="absolute left-[19px] top-[24px] w-[2px] bg-gold-400 transition-all duration-500"
          style={{ height: `calc(${progress}% - 48px)` }}
        />

        <div className="space-y-1">
          {stages.map((stage, i) => (
            <div
              key={stage.id}
              className={`relative flex items-center gap-4 p-3 rounded-[3px] transition-colors ${
                stage.current
                  ? "bg-gold-400/5"
                  : stage.completed
                  ? "opacity-70"
                  : ""
              }`}
            >
              {/* Node */}
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-[18px] shrink-0 transition-colors ${
                stage.completed
                  ? "bg-gold-400 text-navy-950"
                  : stage.current
                  ? "bg-gold-400/20 ring-2 ring-gold-400"
                  : "bg-navy-800 text-ink-500"
              }`}>
                {stage.completed ? "✓" : stage.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[14px] font-medium ${stage.current ? "text-gold-300" : stage.completed ? "text-ink-50" : "text-ink-500"}`}>
                    {stage.label}
                  </span>
                  {stage.current && (
                    <span className="font-mono text-[9.5px] text-navy-950 bg-gold-400 rounded-full px-2 py-0.5 uppercase tracking-wide">
                      You&apos;re here
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-ink-500 mt-0.5">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
