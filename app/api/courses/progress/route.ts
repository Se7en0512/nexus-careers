import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const rows = (await db
    .prepare("SELECT course_id, status FROM course_progress WHERE user_id = ?")
    .all(user.id)) as Array<{ course_id: number; status: string }>;
  return NextResponse.json(
    rows.map((r) => ({ course_id: r.course_id, status: r.status }))
  );
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const ip = getClientIp(req);
  if (!(await rateLimit(`course-progress:${ip}`, 30, 10 * 60 * 1000))) {
    return NextResponse.json({ error: "Too many requests — please wait 10 minutes." }, { status: 429 });
  }

  const data = await req.json().catch(() => null);
  const courseId = Number(data?.course_id);
  const status = data?.status === "completed" ? "completed" : "started";
  if (!Number.isInteger(courseId) || courseId <= 0) {
    return NextResponse.json({ error: "A valid course_id is required" }, { status: 400 });
  }

  const course = (await db.prepare("SELECT id, title FROM courses WHERE id = ?").get(courseId)) as
    | { id: number; title: string }
    | undefined;
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const prev = (await db
    .prepare("SELECT status FROM course_progress WHERE user_id = ? AND course_id = ?")
    .get(user.id, courseId)) as { status: string } | undefined;

  await db
    .prepare(
      `INSERT INTO course_progress (user_id, course_id, status) VALUES (?, ?, ?)
       ON CONFLICT(user_id, course_id) DO UPDATE SET
         status = excluded.status,
         updated_at = datetime('now')`
    )
    .run(user.id, courseId, status);

  if (status === "completed" && prev?.status !== "completed") {
    await logActivity(user.id, "course_completed", { courseId, title: course.title });
  }

  return NextResponse.json({ ok: true });
}