import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import InterviewCoach from "@/components/InterviewCoach";

export const metadata: Metadata = { title: "Interview Coach" };

export const dynamic = "force-dynamic";

export default async function InterviewCoachPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/tools/interview-coach");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Tool</div>
          <h1>Interview Coach</h1>
          <p>
            20+ real interview questions with model answers — practice out loud
            before your next call.
          </p>
        </div>
      </section>
      <div className="wrap py-16">
        <InterviewCoach />
      </div>
    </>
  );
}