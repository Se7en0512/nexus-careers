"use client";

import { useState } from "react";

interface Question {
  id: string;
  q: string;
  options: { label: string; score: number }[];
}

const EQUIPMENT_QUESTIONS: Question[] = [
  {
    id: "laptop",
    q: "What kind of laptop do you have?",
    options: [
      { label: "No laptop yet", score: 0 },
      { label: "Old/second-hand — works but slow", score: 1 },
      { label: "Decent laptop — handles video calls fine", score: 2 },
      { label: "Good laptop — fast, reliable, enough RAM", score: 3 },
    ],
  },
  {
    id: "internet",
    q: "What's your internet setup?",
    options: [
      { label: "Mobile data only — unstable", score: 0 },
      { label: "Fiber 35 Mbps or similar", score: 2 },
      { label: "Fiber 100 Mbps or faster", score: 3 },
      { label: "Dual connection (fiber + mobile backup)", score: 4 },
    ],
  },
  {
    id: "headset",
    q: "What do you use for calls?",
    options: [
      { label: "No headset — using laptop mic/speaker", score: 0 },
      { label: "Basic headset — okay but sometimes echoey", score: 1 },
      { label: "Good headset — clear audio, noise isolation", score: 3 },
      { label: "Noise-cancelling headset — professional quality", score: 4 },
    ],
  },
  {
    id: "camera",
    q: "How's your video setup?",
    options: [
      { label: "No webcam — using laptop camera (blurry)", score: 0 },
      { label: "Laptop camera — okay in good lighting", score: 1 },
      { label: "External webcam — 1080p, clear", score: 3 },
      { label: "External webcam + ring light or good window light", score: 4 },
    ],
  },
  {
    id: "power",
    q: "What about power backup?",
    options: [
      { label: "No backup — power outages kill my work", score: 0 },
      { label: "UPS or AVR — keeps me going during brownouts", score: 3 },
      { label: "UPS + backup internet (mobile data)", score: 4 },
    ],
  },
];

interface VerificationStep {
  key: string;
  label: string;
  icon: string;
  desc: string;
  pct: number;
  action: string;
  href: string;
}

const VERIFICATION_STEPS: VerificationStep[] = [
  {
    key: "id",
    label: "Primary ID + Documents",
    icon: "🪪",
    desc: "Submit your primary government ID for verification",
    pct: 12.5,
    action: "Submit ID →",
    href: "#",
  },
  {
    key: "english",
    label: "English Exam Completed",
    icon: "🗣️",
    desc: "Take the free EF SET 50-minute test (choose 'EF SET 50' — NOT the 90-min version) and save your score",
    pct: 12.5,
    action: "Take EF SET 50 (50 min) →",
    href: "https://www.efset.org/ef-set-50/",
  },
  {
    key: "resume",
    label: "Resume / CV Upload",
    icon: "✅",
    desc: "Upload your resume or CV (PDF or Word, max 10MB) so employers can review your experience",
    pct: 12.5,
    action: "Upload Resume →",
    href: "#",
  },
  {
    key: "portfolio",
    label: "Portfolio Website Live",
    icon: "🌐",
    desc: "Paste your portfolio link — Rene AI, Canva, Behance, personal site, or any live portfolio URL",
    pct: 12.5,
    action: "View Rene AI Portfolio →",
    href: "#",
  },
  {
    key: "video",
    label: "Introduction Video Uploaded",
    icon: "🎬",
    desc: "Record and share your intro video using Loom",
    pct: 12.5,
    action: "Record Video →",
    href: "https://loom.com",
  },
];

export default function EquipmentChecker() {
  const [tab, setTab] = useState<"equipment" | "readiness">("equipment");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [verification, setVerification] = useState<Record<string, boolean>>({});

  const eqQuestion = EQUIPMENT_QUESTIONS[current];
  const eqTotal = EQUIPMENT_QUESTIONS.length;
  const eqPct = Math.round((current / eqTotal) * 100);

  const selectEq = (score: number) => {
    const next = { ...answers, [eqQuestion.id]: score };
    setAnswers(next);
    if (current < eqTotal - 1) {
      setCurrent(current + 1);
    } else {
      setDone(true);
    }
  };

  const eqScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const eqMaxScore = eqTotal * 4;
  const eqPctScore = Math.round((eqScore / eqMaxScore) * 100);

  let eqTier: string;
  let eqTierColor: string;
  if (eqPctScore < 30) {
    eqTier = "Budget";
    eqTierColor = "text-ink-50";
  } else if (eqPctScore < 60) {
    eqTier = "Mid-Range";
    eqTierColor = "text-gold-400";
  } else {
    eqTier = "Comfortable";
    eqTierColor = "text-gold-300";
  }

  const eqNeeds = EQUIPMENT_QUESTIONS.filter((q) => (answers[q.id] ?? 0) <= 1).map((q) => q.q);

  const verifDone = VERIFICATION_STEPS.filter((s) => verification[s.key]).length;
  const verifPct = Math.round((verifDone / VERIFICATION_STEPS.length) * 100);
  const overallPct = Math.round((eqPctScore * 0.4 + verifPct * 0.6));

  const toggleVerif = (key: string) => {
    setVerification((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="panel p-7">
      <div className="flex gap-2 mb-6 font-mono text-[12px]">
        <button
          onClick={() => setTab("equipment")}
          className={`px-4 py-2 rounded-[3px] border transition-colors ${
            tab === "equipment"
              ? "border-gold-400 bg-[rgba(217,169,78,0.15)] text-gold-300"
              : "border-navy-600 text-ink-400 hover:border-navy-500"
          }`}
        >
            Equipment Specs
          </button>
        <button
          onClick={() => setTab("readiness")}
          className={`px-4 py-2 rounded-[3px] border transition-colors ${
            tab === "readiness"
              ? "border-gold-400 bg-[rgba(217,169,78,0.15)] text-gold-300"
              : "border-navy-600 text-ink-400 hover:border-navy-500"
          }`}
        >
            VA Readiness Score
          </button>
      </div>

      {tab === "equipment" ? (
        !done ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-50">
                Question {current + 1} of {eqTotal}
              </p>
              <div className="h-[3px] w-32 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-400 transition-all"
                  style={{ width: `${eqPct}%` }}
                />
              </div>
            </div>
            <h3 className="font-serif font-medium text-[20px] mb-6">{eqQuestion.q}</h3>
            <div className="flex flex-col gap-3">
              {eqQuestion.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => selectEq(opt.score)}
                  className="w-full text-left px-5 py-4 border border-navy-700 bg-navy-900 rounded-[3px] hover:border-gold-400/50 hover:bg-navy-800 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400 mb-2">
                Equipment score
              </p>
              <p className={`font-mono text-[48px] font-semibold ${eqTierColor}`}>{eqPctScore}%</p>
              <p className="text-[15px] text-ink-300 mt-2">
                You're in the <strong className="text-ink-50">{eqTier}</strong> tier.
              </p>
            </div>
            {eqNeeds.length > 0 ? (
              <div className="mb-6">
                <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400 mb-3">
                  Fix these first
                </h4>
                <div className="flex flex-col gap-2">
                  {eqNeeds.map((n) => (
                    <div
                      key={n}
                      className="flex items-center gap-3 px-4 py-3 bg-navy-950 border border-navy-700 rounded-[3px]"
                    >
                      <span className="text-gold-400 font-mono text-sm">→</span>
                      <span className="text-[14px] text-ink-300">{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 px-4 py-3 bg-navy-950 border border-gold-400/30 rounded-[3px]">
                <p className="text-[14px] text-gold-300">
                  Your equipment looks solid. Now check your VA readiness below.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrent(0);
                  setAnswers({});
                  setDone(false);
                }}
                className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px]"
              >
                Retake
              </button>
              <button
                onClick={() => setTab("readiness")}
                className="btn-primary !py-[10px] !px-[16px] !text-[12.5px]"
              >
                Check VA Readiness →
              </button>
            </div>
          </>
        )
      ) : (
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400">
                Overall VA Readiness
              </p>
              <span className={`font-mono text-[24px] font-semibold ${
                overallPct >= 80 ? "text-gold-300" : overallPct >= 50 ? "text-gold-400" : "text-ink-50"
              }`}>
                {overallPct}%
              </span>
            </div>
            <div className="h-[6px] bg-navy-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-400 transition-all"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <p className="text-[12.5px] text-ink-500 mt-2">
              {verifDone} of {VERIFICATION_STEPS.length} verification steps complete
              {verifDone < 5 && " — finish the remaining steps to unlock your full readiness score"}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {VERIFICATION_STEPS.map((step) => {
              const completed = verification[step.key];
              return (
                <div
                  key={step.key}
                  className={`p-5 border rounded-[3px] transition-colors ${
                    completed
                      ? "border-gold-400/30 bg-navy-950"
                      : "border-navy-700 bg-navy-900"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[20px] flex-shrink-0 mt-0.5">{step.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-[14.5px]">{step.label}</h4>
                        <span className="font-mono text-[10.5px] text-gold-400">{step.pct}%</span>
                      </div>
                      <p className="text-[12.5px] text-ink-500 mb-3">{step.desc}</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleVerif(step.key)}
                          className={`font-mono text-[11.5px] px-3 py-1.5 rounded-full border transition-colors ${
                            completed
                              ? "border-gold-400/50 text-gold-300 bg-[rgba(217,169,78,0.1)]"
                              : "border-navy-600 text-ink-400 hover:border-gold-400 hover:text-gold-300"
                          }`}
                        >
                          {completed ? "✓ Completed" : step.action}
                        </button>
                        {completed && (
                          <button
                            onClick={() => toggleVerif(step.key)}
                            className="font-mono text-[11.5px] text-ink-500 hover:text-ink-300 transition-colors"
                          >
                            Undo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setTab("equipment")}
              className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px]"
            >
              ← Back to Equipment
            </button>
            <a
              href="/portfolio-builder"
              className="btn-primary !py-[10px] !px-[16px] !text-[12.5px]"
            >
              Build your portfolio →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}