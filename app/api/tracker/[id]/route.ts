import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordDailyActivity } from "@/lib/gamification";

const STATUSES = ["applied", "interviewing", "offered", "rejected", "ghosted"];

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { id } = await params;
  const appId = parseInt(id, 10);
  if (isNaN(appId)) {
    return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
  }

  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  // Verify ownership
  const app = (await db
    .prepare("SELECT user_id FROM job_applications WHERE id = ?")
    .get(appId)) as { user_id: number } | undefined;

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  if (app.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const company = String(data.company || "").trim().slice(0, 80);
  const role = String(data.role || "").trim().slice(0, 120);
  const platform = String(data.platform || "").trim().slice(0, 60);
  const status = String(data.status || "applied").trim();
  const appliedDate = String(data.applied_date || "").trim();
  const sourceUrl = String(data.source_url || "").trim().slice(0, 300);
  const followUpDate = data.follow_up_date ? String(data.follow_up_date).trim().slice(0, 10) : null;
  const notes = String(data.notes || "").trim().slice(0, 500);

  if (!company) return NextResponse.json({ error: "Company name is required." }, { status: 400 });
  if (!role) return NextResponse.json({ error: "Role is required." }, { status: 400 });
  if (!platform) return NextResponse.json({ error: "Platform is required." }, { status: 400 });
  if (!appliedDate) return NextResponse.json({ error: "Applied date is required." }, { status: 400 });
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status. Choose from the list." }, { status: 400 });
  }
  if (sourceUrl && !sourceUrl.startsWith("http")) {
    return NextResponse.json({ error: "The source URL must start with http." }, { status: 400 });
  }

  await db.prepare(
    `UPDATE job_applications
     SET company = ?, role = ?, platform = ?, status = ?, applied_date = ?, source_url = ?, follow_up_date = ?, notes = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(company, role, platform, status, appliedDate, sourceUrl, followUpDate, notes, appId);

  await recordDailyActivity(user.id);

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { id } = await params;
  const appId = parseInt(id, 10);
  if (isNaN(appId)) {
    return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
  }

  // Verify ownership
  const app = (await db
    .prepare("SELECT user_id FROM job_applications WHERE id = ?")
    .get(appId)) as { user_id: number } | undefined;

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  if (app.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await db.prepare("DELETE FROM job_applications WHERE id = ?").run(appId);

  await recordDailyActivity(user.id);

  return NextResponse.json({ ok: true });
}