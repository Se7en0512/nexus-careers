"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nicheQuestions, scoreNiche, NICHE_DETAILS } from "@/lib/quizzes";

export default function QuizNiche({ userId }: { userId: number }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<{ niche: string; label: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const total = nicheQuestions.length;
  const q = nicheQuestions[step];

  const answer = async (value: string) => {
    const next = [...answers, value];
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      const r = scoreNiche(next);
      setResult({ niche: r.niche, label: r.label });
      setSaving(true);
      try {
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz: "niche",
            result: r.label,
            payload: JSON.stringify({ niche: r.niche, answers: next }),
          }),
        });
        if (!res.ok) throw new Error("save failed");
      } catch {
        setError("Your result could not be saved — you may not have an account. It's still your result.");
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
    const d = NICHE_DETAILS[result.niche as keyof typeof NICHE_DETAILS] ?? {
      desc: "Explore this niche to find the right tools and skills.",
      skills: [],
      tools: [],
      rate: "",
    };
    return (
      <div className="panel p-8">
        <div className="eyebrow">Niche Finder Result</div>
        <h2 className="font-serif text-[28px] font-medium mt-3">
          Best fit for you: <em className="text-gold-300 italic">{result.label}</em>
        </h2>
        <p className="text-ink-300 mt-3 text-[15.5px] max-w-[560px]">{d.desc}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h3 className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-ink-500 mb-3">
              Skills to learn
            </h3>
            <ul className="flex flex-col gap-2">
              {d.skills.map((s) => (
                <li key={s} className="text-[14.5px] text-ink-300 flex gap-2">
                  <span className="text-gold-400 font-mono text-sm">—</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-ink-500 mb-3">
              Tools you'll use
            </h3>
            <ul className="flex flex-col gap-2">
              {d.tools.map((t) => (
                <li key={t} className="text-[14.5px] text-ink-300 flex gap-2">
                  <span className="text-gold-400 font-mono text-sm">—</span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[13.5px] text-ink-500">{d.rate}</p>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
        <div className="flex gap-3 flex-wrap mt-8">
          <a href="/niches" className="btn-primary">
            View the Guide for This Niche
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
            onClick={() => answer(opt.value)}
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
