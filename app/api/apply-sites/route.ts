import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const rows = (await db
    .prepare("SELECT id, name, url, category, description FROM apply_sites ORDER BY category, name")
    .all()) as unknown as Array<Record<string, unknown>>;
  return NextResponse.json(rows);
}
