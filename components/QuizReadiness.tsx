"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readinessQuestions, scoreReadiness, STAGE_LABELS } from "@/lib/quizzes";
import ScoreRing from "./ScoreRing";

interface ReadinessProps {
  userId: number;
}

interface Answer {
  value: string;
  w: number;
}

export default function QuizReadiness({ userId }: ReadinessProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<{ stage: string; label: string; score: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const total = readinessQuestions.length;
  const q = readinessQuestions[step];

  const answer = async (value: string, w: number) => {
    const next = [...answers, { value, w }];
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      const r = scoreReadiness(next);
      setResult({ stage: r.stage, label: r.label, score: r.score });
      setSaving(true);
      try {
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz: "readiness",
            result: r.label,
            payload: JSON.stringify({ stage: r.stage, score: r.score, answers: next }),
          }),
        });
        if (!res.ok) throw new Error("save failed");
      } catch {
        setError("Your result could not be saved — you may not have an account yet. It's still your result.");
      } finally {
        setSaving(false);
      }
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
    setError("");
  };

  if (result) {
    const stageHref = `/get-started#${result.stage}`;
    return (
      <div className="panel p-8">
        <div className="eyebrow">Readiness Check Result</div>
        <div className="flex flex-col md:flex-row md:items-center gap-8 mt-6">
          <ScoreRing score={result.score} label="VA Score" />
          <div>
            <h2 className="font-serif text-[26px] font-medium">
              Start with: <em className="text-gold-300 italic">{result.label}</em>
            </h2>
            <p className="text-ink-300 mt-3 text-[15.5px] max-w-[480px]">
              {result.score < 30
                ? "Your score is still low — that's normal when you're just getting started. The Getting Started stage will tell you what to fix first."
                : result.score < 55
                  ? "You already have a foundation. You still need to fix a few things before you can apply consistently."
                  : result.score < 80
                    ? "You're ready to apply seriously. Make sure the Get Hired stage checklist is complete."
                    : "Your score is high — you're close to, or already in, the Thrive/Level Up stage. Keep the momentum going."}
            </p>
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="flex gap-3 flex-wrap mt-7">
          <a href={stageHref} className="btn-primary">
            Go to {result.label}
          </a>
          <button onClick={restart} className="btn-secondary">
            Retake the Quiz
          </button>
          <button onClick={() => router.push("/dashboard")} className="btn-secondary">
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel p-8">
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-xs text-ink-500">
          QUESTION {step + 1} / {total}
        </span>
        <div className="h-px flex-1 mx-4 bg-navy-700" />
        <span className="font-mono text-xs text-gold-400">{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-[3px] bg-navy-700 mb-8">
        <div
          className="h-full bg-gold-400 transition-all"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <h2 className="font-serif text-[22px] font-medium leading-snug max-w-[560px]">{q.q}</h2>
      <div className="flex flex-col gap-2 mt-6">
        {q.options.map((opt) => (
          <button
            key={opt.value + opt.label}
            onClick={() => answer(opt.value, opt.w ?? 0)}
            disabled={saving}
            className="text-left border border-navy-700 bg-navy-900 hover:border-gold-400 px-5 py-4 rounded-[3px] transition-colors text-[14.5px]"
          >
            {opt.label}
          </button>
        ))}
      </div>
      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="font-mono text-xs text-ink-500 hover:text-ink-300 mt-5"
        >
          ← Back to the previous question
        </button>
      )}
    </div>
  );
}
