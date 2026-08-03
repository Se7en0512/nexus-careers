import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSkillQuiz } from "@/data/skill-quizzes";
import { recordDailyActivity } from "@/lib/gamification";

export async function POST(req: Request) {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const data = await req.json().catch(() => null);
    if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

    const skillKey = String(data.skill_key || "").trim();
    const quiz = getSkillQuiz(skillKey);
    if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });

    const answers: number[] = Array.isArray(data.answers) ? data.answers : [];
    if (answers.length !== quiz.questions.length) {
        return NextResponse.json({ error: `${quiz.questions.length} answers are required.` }, { status: 400 });
    }

    const score = answers.reduce<number>((acc, a, i) => acc + (a === quiz.questions[i].correct ? 1 : 0), 0);
    const passed = score >= Math.ceil(quiz.questions.length * 0.8) ? 1 : 0;

    await db.prepare(
        `INSERT INTO skill_quiz_results (user_id, skill_key, score, total, passed) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id, skill_key) DO UPDATE SET score = excluded.score, total = excluded.total, passed = excluded.passed`
    ).run(user.id, skillKey, score, quiz.questions.length, passed);

    await recordDailyActivity(user.id);

    return NextResponse.json({ ok: true, score, total: quiz.questions.length, passed: passed === 1 });
}

export async function GET(req: Request) {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const url = new URL(req.url);
    const skillKey = url.searchParams.get("skill_key");
    if (!skillKey) {
        return NextResponse.json({ error: "skill_key parameter required" }, { status: 400 });
    }

    const row = (await db.prepare("SELECT score, total, passed FROM skill_quiz_results WHERE user_id = ? AND skill_key = ?").get(user.id, skillKey)) as
        | { score: number; total: number; passed: number }
        | undefined;
    return NextResponse.json({ result: row ?? null });
}