import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import MockInterview from "@/components/MockInterview";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "AI Mock Interview" };

export const dynamic = "force-dynamic";

export default async function MockInterviewPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="AI Practice · Live Feedback"
        title="Mock interview, with real feedback."
        description="Five realistic questions for your niche, answered by you — then graded out loud. Practice now so the real interview feels like a repeat."
        highlights={[
          "Five realistic questions for your niche",
          "Answers graded out loud with feedback",
          "Practice until the real interview feels like a repeat",
        ]}
        nextPath="/tools/mock-interview"
      />
    );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">AI Practice · Live Feedback</div>
          <h1>Mock interview, with real feedback.</h1>
          <p>
            Five realistic questions for your niche, answered by you — then graded out loud.
            Practice now so the real interview feels like a repeat.
          </p>
          <p className="text-[14px] text-ink-400 mt-3">
            Want to review sample answers first?{" "}
            <a href="/tools/interview-coach" className="accent-link">Check the Interview Coach</a>.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <MockInterview />
      </div>
    </>
  );
}
