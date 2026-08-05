import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const rows = (await db.prepare("SELECT key, value FROM site_config").all()) as Array<{ key: string; value: string }>;
  const config: Record<string, string> = {};
  for (const r of rows) config[r.key] = r.value;
  return NextResponse.json(config);
}
