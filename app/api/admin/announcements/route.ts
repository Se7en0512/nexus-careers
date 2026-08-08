import { NextResponse } from "next/server";
import { requireUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendAnnouncementEmail } from "@/lib/email";

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 1000;

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export async function GET() {
  const user = await requireUser();
  if (!isAdmin(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await db
    .prepare("SELECT * FROM announcements ORDER BY created_at DESC LIMIT 50")
    .all();
  return NextResponse.json({ announcements: rows });
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!isAdmin(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const sendEmail = data.send_email === true;

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (title.length > 150) return NextResponse.json({ error: "Title must be 150 characters or fewer" }, { status: 400 });
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });
  if (message.length > 2000) return NextResponse.json({ error: "Message must be 2000 characters or fewer" }, { status: 400 });

  await db
    .prepare("INSERT INTO announcements (title, message, emailed) VALUES (?, ?, ?)")
    .run(title, message, sendEmail ? 1 : 0);

  let emailedCount = 0;
  let failedCount = 0;

  if (sendEmail) {
    const recipients = (await db
      .prepare("SELECT email FROM users WHERE updates_opt_in = 1 AND email_verified = 1")
      .all()) as Array<{ email: string }>;

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map(async (r) => {
          try {
            const ok = await sendAnnouncementEmail(r.email, title, message);
            return ok;
          } catch {
            return false;
          }
        })
      );
      emailedCount += results.filter(Boolean).length;
      failedCount += results.filter((r) => !r).length;
      if (i + BATCH_SIZE < recipients.length) await sleep(BATCH_DELAY_MS);
    }
  }

  const summary = sendEmail
    ? `'${title}' posted — ${emailedCount} emails sent`
    : `'${title}' posted — in-app only`;
  await db
    .prepare("INSERT INTO notifications (type, title, message) VALUES ('announcement_sent', 'Update posted', ?)")
    .run(summary);

  return NextResponse.json({ ok: true, emailedCount, failedCount });
}