import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?error=invalid", url.origin));
  }

  const row = (await db
    .prepare("SELECT user_id, expires_at FROM email_verifications WHERE token = ?")
    .get(token)) as { user_id: number; expires_at: number } | undefined;

  if (!row || row.expires_at < Date.now()) {
    return NextResponse.redirect(new URL("/verify-email?error=expired", url.origin));
  }

  // Mark email as verified
  await db.prepare("UPDATE users SET email_verified = 1 WHERE id = ?").run(row.user_id);
  // Delete verification token
  await db.prepare("DELETE FROM email_verifications WHERE token = ?").run(token);

  return NextResponse.redirect(new URL("/verify-email?success=1", url.origin));
}
