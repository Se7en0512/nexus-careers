"use server";

import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function saveProgressAction(stageKey: string, checked: number[]) {
  const user = await getSessionUser();
  if (!user) return;
  const existing = (await db
    .prepare("SELECT checks FROM progress WHERE user_id = ?")
    .get(user.id)) as { checks: string } | undefined;
  const checks = existing ? (JSON.parse(existing.checks) as Record<string, number[]>) : {};
  checks[stageKey] = checked;
  await db.prepare(
    `INSERT INTO progress (user_id, stage, checks, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET checks = excluded.checks, updated_at = excluded.updated_at`
  ).run(user.id, stageKey, JSON.stringify(checks));
}
