"use client";

import { useState } from "react";
import Link from "next/link";
import { SkillQuiz as SkillQuizData } from "@/data/skill-quizzes";

interface SkillQuizProps {
    quiz: SkillQuizData;
    isLoggedIn: boolean;
    existingResult?: { score: number; total: number; passed: number } | null;
}

export default function SkillQuiz({ quiz, isLoggedIn, existingResult }: SkillQuizProps) {
    const [answers, setAnswers] = useState<number[]>(Array(quiz.questions.length).fill(-1));
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(existingResult);
    const [error, setError] = useState<string | null>(null);

    const allAnswered = answers.every((a) => a >= 0);

    const handleSubmit = async () => {
        if (!isLoggedIn) return;
        setError(null);
        try {
            const res = await fetch("/api/skill-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skill_key: quiz.key, answers }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
            setResult({ score: data.score, total: data.total, passed: data.passed ? 1 : 0 });
            setSubmitted(true);
        } catch (e: any) {
            setError(e.message || "Failed to submit quiz.");
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="panel p-6 border border-navy-700 rounded-[3px]">
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-gold-400 mb-2">Skill Quiz</p>
                <p className="text-sm text-ink-300 mb-4">
                    There is a {quiz.questions.length}-question quiz for this category.{" "}
                    <Link href="/signup?next=/tutorials" className="text-gold-300 underline">Create an account</Link> to take it.
                </p>
            </div>
        );
    }

    if (submitted && result) {
        const passed = result.passed === 1;
        return (
            <div className={`panel p-6 border rounded-[3px] ${passed ? "border-green-400/30 bg-green-400/5" : "border-amber-400/30 bg-amber-400/5"}`}>
                <p className={`font-mono text-xs uppercase tracking-[0.1em] mb-2 ${passed ? "text-green-400" : "text-amber-400"}`}>
                    {passed ? "PASSED" : "TRY AGAIN"}
                </p>
                <p className="text-lg font-semibold text-ink-50 mb-1">
                    Score: {result.score}/{result.total}
                </p>
                <p className="text-sm text-ink-300 mb-4">
                    {passed
                        ? "Well done! You passed this skill quiz."
                        : "You need 80% to pass. Try again!"}
                </p>
                <button onClick={() => { setSubmitted(false); setAnswers(Array(quiz.questions.length).fill(-1)); }} className="btn-secondary !py-2 !px-4 !text-xs font-mono">
                    RETAKE QUIZ
                </button>
            </div>
        );
    }

    return (
        <div className="panel p-6 border border-navy-700 rounded-[3px]">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-gold-400 mb-4">
                Skill Quiz — {quiz.title} ({quiz.questions.length} questions)
            </p>
            {result && (
                <p className="text-xs text-ink-500 mb-4">
                    Last attempt: {result.score}/{result.total} {result.passed === 1 ? "(PASSED)" : ""}
                </p>
            )}
            <div className="flex flex-col gap-5">
                {quiz.questions.map((q, qi) => (
                    <div key={qi}>
                        <p className="text-sm font-medium text-ink-100 mb-2">{qi + 1}. {q.q}</p>
                        <div className="flex flex-col gap-1.5">
                            {q.options.map((opt, oi) => (
                                <label key={oi} className="flex items-center gap-2.5 cursor-pointer text-sm text-ink-300 hover:text-ink-50">
                                    <input
                                        type="radio"
                                        name={`q${qi}`}
                                        checked={answers[qi] === oi}
                                        onChange={() => setAnswers(answers.map((a, i) => (i === qi ? oi : a)))}
                                        className="accent-gold-400"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {error && <p className="text-xs text-red-400 font-mono mt-4">{error}</p>}
            <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="btn-primary !py-2.5 !px-5 !text-xs font-mono mt-5 disabled:opacity-40"
            >
                SUBMIT QUIZ
            </button>
        </div>
    );
}