import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ onboarding_completed: false });

  const row = await db
    .prepare("SELECT completed_at FROM user_onboarding WHERE user_id = ?")
    .get(user.id);

  return NextResponse.json({
    onboarding_completed: !!(row as { completed_at: number } | undefined)?.completed_at,
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const experienceLevel = String(data.experience_level || "").slice(0, 50);
  const mainGoal = String(data.main_goal || "").slice(0, 50);
  const weeklyHours = String(data.weekly_hours || "").slice(0, 20);
  const interests = Array.isArray(data.interests)
    ? data.interests.map((s: string) => String(s).slice(0, 40)).slice(0, 15)
    : [];

  await db
    .prepare(
      `INSERT INTO user_onboarding (user_id, experience_level, main_goal, weekly_hours, interests, completed_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         experience_level = excluded.experience_level,
         main_goal = excluded.main_goal,
         weekly_hours = excluded.weekly_hours,
         interests = excluded.interests,
         completed_at = excluded.completed_at`
    )
    .run(user.id, experienceLevel, mainGoal, weeklyHours, JSON.stringify(interests), Date.now());

  await logActivity(user.id, "wizard_completed", {
    experience: experienceLevel,
    goal: mainGoal,
    time: weeklyHours,
    interests,
  });

  return NextResponse.json({ ok: true });
}
