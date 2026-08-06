import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getProfileStrength } from "@/lib/profile-strength";
import { logActivity } from "@/lib/activity";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const result = await getProfileStrength(user.id);

  // Log milestone if the score crossed a threshold
  if (result.milestone) {
    await logActivity(user.id, "profile_milestone", { milestone: result.milestone, score: result.score });
  }

  return NextResponse.json(result);
}
