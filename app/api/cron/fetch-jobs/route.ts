import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchAllSources } from "@/lib/job-sources";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const querySecret = new URL(req.url).searchParams.get("secret") || "";

  if (!CRON_SECRET || (bearer !== CRON_SECRET && querySecret !== CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidates = await fetchAllSources();

  // Load existing URLs for the sources we're about to insert from, to dedupe.
  const existingRows = (await db
    .prepare("SELECT url FROM jobs WHERE source IN ('remoteok', 'jobicy', 'remotive')")
    .all()) as Array<{ url: string }>;
  const existingUrls = new Set(existingRows.map((r) => r.url));

  let inserted = 0;
  for (const job of candidates) {
    if (existingUrls.has(job.url)) continue;
    await db
      .prepare(
        `INSERT INTO jobs (title, company, url, niche, description, source)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(job.title, job.company, job.url, job.niche, job.description, job.source);
    existingUrls.add(job.url); // guard against duplicates within the same batch
    inserted++;
  }

  return NextResponse.json({
    ok: true,
    fetched: candidates.length,
    inserted,
    skipped: candidates.length - inserted,
  });
}