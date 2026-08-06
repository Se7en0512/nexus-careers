import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getProfileStrength } from "@/lib/profile-strength";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const result = await getProfileStrength(user.id);
  return NextResponse.json(result);
}
