import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { recordWeeklyCheckin, getCheckinStreak, hasCheckedInThisWeek, phWeekStart } from "@/lib/gamification";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const data = await req.json().catch(() => null);
    if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

    const apps = parseInt(String(data.applications_sent || "0"), 10);
    if (isNaN(apps) || apps < 0 || apps > 999) {
        return NextResponse.json({ error: "Enter a valid number of applications (0-999)." }, { status: 400 });
    }

    const note = String(data.note || "").trim().slice(0, 500);
    await recordWeeklyCheckin(user.id, apps, note);
    const streak = await getCheckinStreak(user.id);
    const checkedIn = await hasCheckedInThisWeek(user.id);

    return NextResponse.json({ ok: true, streak, checked_in: checkedIn, week_start: phWeekStart() });
}

export async function GET() {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const row = (await db
        .prepare("SELECT week_start, applications_sent, note, created_at FROM weekly_checkins WHERE user_id = ? ORDER BY week_start DESC LIMIT 1")
        .get(user.id)) as { week_start: string; applications_sent: number; note: string; created_at: string } | undefined;

    return NextResponse.json({
        streak: await getCheckinStreak(user.id),
        checked_in: await hasCheckedInThisWeek(user.id),
        current: row ?? null,
    });
}