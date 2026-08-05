import { cookies, headers } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db } from "./db";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const SESSION_COOKIE = "nexus_session";

export interface UserRow {
  id: number;
  email: string;
  name: string;
  plan: string;
  role: string;
  created_at: string;
  expires_at?: number;
}

export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(pw: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(pw, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(
    token,
    userId,
    Date.now() + SESSION_TTL_SECONDS * 1000
  );
  const jar = await cookies();
  const h = await headers();
  const isHttps = (h.get("x-forwarded-proto") || "http").startsWith("https");
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
    secure: isHttps,
  });
  return token;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }
  jar.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<UserRow | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = (await db
    .prepare(
    `SELECT u.id, u.email, u.name, u.plan, u.role, u.created_at, s.expires_at
        FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token = ?`
    )
    .get(token)) as (UserRow & { expires_at: number }) | undefined;
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    await db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }
  return row;
}

export async function requireUser(): Promise<UserRow> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("AUTH_REQUIRED");
  }
  return user;
}

export function isAdmin(user: UserRow): boolean {
  return user.role === "admin";
}
