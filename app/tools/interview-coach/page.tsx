import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import InterviewCoach from "@/components/InterviewCoach";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "Interview Coach" };

export const dynamic = "force-dynamic";

export default async function InterviewCoachPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Study Guide · 20+ Questions"
        title="Interview Coach"
        description="20+ real interview questions with model answers — practice out loud before your next call."
        highlights={[
          "20+ real VA interview questions",
          "Model answers for each one",
          "Practice out loud before your call",
        ]}
        nextPath="/tools/interview-coach"
      />
    );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Study Guide · 20+ Questions</div>
          <h1>Interview Coach</h1>
          <p>
            20+ real interview questions with model answers — practice out loud
            before your next call.
          </p>
          <p className="text-[14px] text-ink-400 mt-3">
            Ready to practice out loud with real-time feedback?{" "}
            <a href="/tools/mock-interview" className="accent-link">Try the Mock Interview</a>.
          </p>
        </div>
      </section>
      <div className="wrap py-16">
        <InterviewCoach />
      </div>
    </>
  );
}