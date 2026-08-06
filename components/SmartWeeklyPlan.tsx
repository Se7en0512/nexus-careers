"use client";

import { useState, useEffect } from "react";

interface WeeklyTask {
  id: string;
  day: string;
  task: string;
  category: "roadmap" | "portfolio" | "quiz" | "applications" | "skills" | "interview";
  completed: boolean;
  estimatedMinutes: number;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CATEGORY_COLORS: Record<string, string> = {
  roadmap: "bg-blue-500",
  portfolio: "bg-purple-500",
  quiz: "bg-amber-500",
  applications: "bg-green-500",
  skills: "bg-cyan-500",
  interview: "bg-rose-500",
};

const CATEGORY_ICONS: Record<string, string> = {
  roadmap: "🗺️",
  portfolio: "💼",
  quiz: "📝",
  applications: "📤",
  skills: "📚",
  interview: "🎤",
};

function generateWeeklyPlan(profile: {
  overallPct: number;
  hasPortfolio: boolean;
  hasReadinessQuiz: boolean;
  mainGoal: string;
  currentStage: string;
  applicationsCount: number;
  certificatesCount: number;
}): WeeklyTask[] {
  const tasks: WeeklyTask[] = [];
  const goal = profile.mainGoal || "first_client";

  // Day 1: always roadmap or quiz
  if (!profile.hasReadinessQuiz) {
    tasks.push({
      id: "mon-quiz",
      day: "Mon",
      task: "Take the Readiness Quiz",
      category: "quiz",
      completed: false,
      estimatedMinutes: 5,
    });
  } else if (profile.overallPct < 100) {
    tasks.push({
      id: "mon-roadmap",
      day: "Mon",
      task: `Continue ${profile.currentStage} stage on the roadmap`,
      category: "roadmap",
      completed: false,
      estimatedMinutes: 20,
    });
  }

  // Day 2: goal-specific
  if (goal === "first_client" || goal === "portfolio") {
    tasks.push({
      id: "tue-portfolio",
      day: "Tue",
      task: profile.hasPortfolio ? "Update your portfolio" : "Create your portfolio",
      category: "portfolio",
      completed: false,
      estimatedMinutes: 15,
    });
  } else if (goal === "learn_skills") {
    tasks.push({
      id: "tue-skills",
      day: "Tue",
      task: "Browse a free course from the library",
      category: "skills",
      completed: false,
      estimatedMinutes: 15,
    });
  } else if (goal === "interviews") {
    tasks.push({
      id: "tue-interview",
      day: "Tue",
      task: "Practice a mock interview",
      category: "interview",
      completed: false,
      estimatedMinutes: 10,
    });
  } else if (goal === "resume") {
    tasks.push({
      id: "tue-resume",
      day: "Tue",
      task: "Build or update your resume",
      category: "portfolio",
      completed: false,
      estimatedMinutes: 15,
    });
  }

  // Day 3: roadmap progress
  if (profile.overallPct < 100) {
    tasks.push({
      id: "wed-roadmap",
      day: "Wed",
      task: "Complete 2+ roadmap checklist items",
      category: "roadmap",
      completed: false,
      estimatedMinutes: 15,
    });
  }

  // Day 4: applications or interview
  if (profile.applicationsCount === 0 && profile.overallPct > 50) {
    tasks.push({
      id: "thu-apply",
      day: "Thu",
      task: "Track your first job application",
      category: "applications",
      completed: false,
      estimatedMinutes: 5,
    });
  } else if (goal === "interviews" || goal === "first_client") {
    tasks.push({
      id: "thu-interview",
      day: "Thu",
      task: "Review interview tips from the coach",
      category: "interview",
      completed: false,
      estimatedMinutes: 10,
    });
  }

  // Day 5: portfolio or niche quiz
  if (!profile.hasPortfolio) {
    tasks.push({
      id: "fri-portfolio",
      day: "Fri",
      task: "Work on your portfolio",
      category: "portfolio",
      completed: false,
      estimatedMinutes: 15,
    });
  } else {
    tasks.push({
      id: "fri-quiz",
      day: "Fri",
      task: "Take the Niche Finder quiz",
      category: "quiz",
      completed: false,
      estimatedMinutes: 5,
    });
  }

  // Day 6: light learning
  tasks.push({
    id: "sat-learn",
    day: "Sat",
    task: "Watch a tutorial or read a guide",
    category: "skills",
    completed: false,
    estimatedMinutes: 10,
  });

  // Day 7: review & plan
  tasks.push({
    id: "sun-review",
    day: "Sun",
    task: "Review your weekly progress and plan next week",
    category: "roadmap",
    completed: false,
    estimatedMinutes: 5,
  });

  return tasks;
}

export default function SmartWeeklyPlan(profile: {
  overallPct: number;
  hasPortfolio: boolean;
  hasReadinessQuiz: boolean;
  mainGoal: string;
  currentStage: string;
  applicationsCount: number;
  certificatesCount: number;
}) {
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const storageKey = `thrive_weekly_plan_${new Date().toISOString().split("T")[0]}`;

  useEffect(() => {
    const plan = generateWeeklyPlan(profile);
    setTasks(plan);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompletedIds(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, [profile.overallPct, profile.hasPortfolio, profile.hasReadinessQuiz, profile.mainGoal, profile.currentStage, profile.applicationsCount, profile.certificatesCount, storageKey]);

  const toggleTask = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const completedCount = tasks.filter((t) => completedIds.has(t.id)).length;
  const totalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const completedMinutes = tasks.filter((t) => completedIds.has(t.id)).reduce((sum, t) => sum + t.estimatedMinutes, 0);

  if (tasks.length === 0) return null;

  return (
    <div className="panel p-7">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-1">Smart Weekly Plan</p>
          <p className="text-[13.5px] text-ink-500">
            {completedCount}/{tasks.length} tasks · ~{completedMinutes}/{totalMinutes} min
          </p>
        </div>
        <div className="font-mono text-[22px] text-gold-400 leading-none">
          {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[4px] bg-navy-800 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gold-400 transition-all duration-300"
          style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
        />
      </div>

      {/* Tasks grouped by day */}
      <div className="space-y-4">
        {DAY_NAMES.map((day) => {
          const dayTasks = tasks.filter((t) => t.day === day);
          if (dayTasks.length === 0) return null;
          return (
            <div key={day}>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-500 mb-2">{day}</p>
              <div className="space-y-2">
                {dayTasks.map((task) => {
                  const done = completedIds.has(task.id);
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-[3px] border transition-all text-left ${
                        done
                          ? "border-green-500/30 bg-green-500/5 opacity-60"
                          : "border-navy-700 bg-navy-900 hover:border-navy-600"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors ${
                        done ? "border-green-500 bg-green-500" : "border-navy-600"
                      }`}>
                        {done && <span className="text-[10px] text-navy-950">✓</span>}
                      </div>
                      <span className="text-[13px] shrink-0">{CATEGORY_ICONS[task.category]}</span>
                      <span className={`text-[13px] flex-1 ${done ? "line-through text-ink-500" : "text-ink-50"}`}>
                        {task.task}
                      </span>
                      <span className="font-mono text-[10.5px] text-ink-500 shrink-0">{task.estimatedMinutes}m</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
