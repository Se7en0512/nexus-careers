import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import WelcomeWizard from "@/components/WelcomeWizard";

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const row = await db
    .prepare("SELECT completed_at FROM user_onboarding WHERE user_id = ?")
    .get(user.id);

  if ((row as { completed_at: number } | undefined)?.completed_at) {
    redirect("/dashboard");
  }

  return <WelcomeWizard />;
}
