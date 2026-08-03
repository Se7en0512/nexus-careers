import { db } from "./db";

const GLOBAL_DAILY_CAP = 1200;
const USER_MONTHLY_CAP = 10;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
function thisMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export async function canGenerate(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  const day = today();
  const globalRow = (await db
    .prepare("SELECT count FROM ai_usage_daily WHERE date = ?")
    .get(day)) as { count: number } | undefined;
  if (globalRow && globalRow.count >= GLOBAL_DAILY_CAP) {
    return {
      allowed: false,
      reason: "Today's global limit of AI generations has been reached. Please try again tomorrow.",
    };
  }

  const month = thisMonth();
  const userRow = (await db
    .prepare("SELECT count FROM ai_usage_monthly WHERE user_id = ? AND month = ?")
    .get(userId, month)) as { count: number } | undefined;
  if (userRow && userRow.count >= USER_MONTHLY_CAP) {
    return {
      allowed: false,
      reason: `You've reached your ${USER_MONTHLY_CAP} generations for this month. It resets next month.`,
    };
  }

  return { allowed: true };
}

export async function recordGeneration(userId: number): Promise<void> {
  const day = today();
  const month = thisMonth();
  await db
    .prepare(
      "INSERT INTO ai_usage_daily (date, count) VALUES (?, 1) ON CONFLICT(date) DO UPDATE SET count = count + 1"
    )
    .run(day);
  await db
    .prepare(
      "INSERT INTO ai_usage_monthly (user_id, month, count) VALUES (?, ?, 1) ON CONFLICT(user_id, month) DO UPDATE SET count = count + 1"
    )
    .run(userId, month);
}

const CHAT_DAILY_CAP = 40;

export async function canChat(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  const day = today();
  const row = (await db
    .prepare("SELECT count FROM ai_chat_usage WHERE user_id = ? AND date = ?")
    .get(userId, day)) as { count: number } | undefined;
  if (row && row.count >= CHAT_DAILY_CAP) {
    return {
      allowed: false,
      reason: `You've reached the ${CHAT_DAILY_CAP} messages limit for today. It resets tomorrow.`,
    };
  }
  return { allowed: true };
}

export async function recordChat(userId: number): Promise<void> {
  const day = today();
  await db
    .prepare(
      "INSERT INTO ai_chat_usage (user_id, date, count) VALUES (?, ?, 1) ON CONFLICT(user_id, date) DO UPDATE SET count = count + 1"
    )
    .run(userId, day);
}
