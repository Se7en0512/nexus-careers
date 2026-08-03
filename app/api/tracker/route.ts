import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordDailyActivity } from "@/lib/gamification";

const STATUSES = ["applied", "interviewing", "offered", "rejected", "ghosted"];

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const rows = (await db
    .prepare("SELECT * FROM job_applications WHERE user_id = ? ORDER BY applied_date DESC, id DESC")
    .all(user.id)) as Array<{
      id: number;
      user_id: number;
      company: string;
      role: string;
      platform: string;
      status: string;
      applied_date: string;
      source_url: string;
      follow_up_date: string | null;
      notes: string;
      updated_at: string;
    }>;

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  const company = String(data.company || "").trim().slice(0, 80);
  const role = String(data.role || "").trim().slice(0, 120);
  const platform = String(data.platform || "").trim().slice(0, 60);
  const status = String(data.status || "applied").trim();
  const appliedDate = String(data.applied_date || new Date().toISOString().slice(0, 10)).trim();
  const sourceUrl = String(data.source_url || "").trim().slice(0, 300);
  const followUpDate = data.follow_up_date ? String(data.follow_up_date).trim().slice(0, 10) : null;
  const notes = String(data.notes || "").trim().slice(0, 500);

  if (!company) return NextResponse.json({ error: "Company name is required." }, { status: 400 });
  if (!role) return NextResponse.json({ error: "Role is required." }, { status: 400 });
  if (!platform) return NextResponse.json({ error: "Platform is required." }, { status: 400 });
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status. Choose from the list." }, { status: 400 });
  }
  if (sourceUrl && !sourceUrl.startsWith("http")) {
    return NextResponse.json({ error: "The source URL must start with http." }, { status: 400 });
  }

  const result = await db
    .prepare(
      `INSERT INTO job_applications (user_id, company, role, platform, status, applied_date, source_url, follow_up_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(user.id, company, role, platform, status, appliedDate, sourceUrl, followUpDate, notes);

  await recordDailyActivity(user.id);

  return NextResponse.json({
    ok: true,
    application: {
      id: Number(result.lastInsertRowid),
      user_id: user.id,
      company,
      role,
      platform,
      status,
      applied_date: appliedDate,
      source_url: sourceUrl,
      follow_up_date: followUpDate,
      notes,
    },
  });
}

export async function PATCH(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  const id = parseInt(String(data.id || ""), 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });

  // Verify ownership
  const app = (await db
    .prepare("SELECT user_id FROM job_applications WHERE id = ? AND user_id = ?")
    .get(id, user.id)) as { user_id: number } | undefined;
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const status = data.status !== undefined ? String(data.status).trim() : undefined;
  const notes = data.notes !== undefined ? String(data.notes).trim().slice(0, 500) : undefined;
  const followUpDate = data.follow_up_date !== undefined
    ? (String(data.follow_up_date).trim().slice(0, 10) || null)
    : undefined;

  if (status !== undefined) {
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status. Choose from the list." }, { status: 400 });
    }
  }

  await db.prepare(
    `UPDATE job_applications SET
       status = COALESCE(?, status),
       notes = COALESCE(?, notes),
       follow_up_date = CASE WHEN ? IS NULL THEN NULL ELSE COALESCE(?, follow_up_date) END,
       updated_at = datetime('now')
     WHERE id = ?`
  ).run(status ?? null, notes ?? null, followUpDate === undefined ? "KEEP" : null, followUpDate ?? null, id);

  await recordDailyActivity(user.id);

  return NextResponse.json({ ok: true });
}