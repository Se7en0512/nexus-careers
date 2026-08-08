import { NextResponse } from "next/server";
import { sendWeeklyFollowUpReminders } from "@/lib/reminders";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const querySecret = new URL(req.url).searchParams.get("secret") || "";

  if (!CRON_SECRET || (bearer !== CRON_SECRET && querySecret !== CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sendWeeklyFollowUpReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("[cron] Weekly reminders run failed", e);
    return NextResponse.json({ ok: false, error: "Reminder run failed" }, { status: 500 });
  }
}