import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import QuizReadiness from "@/components/QuizReadiness";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "VA Readiness Check" };

export const dynamic = "force-dynamic";

export default async function ReadinessPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Interactive Tool · 2 Minutes"
        title="VA Readiness Check"
        description="Eight questions, one answer: which stage to start from. It isn't a grade — it's a guide so you don't waste your time on the wrong step."
        highlights={[
          "Eight questions, two minutes",
          "Tells you which stage to start from",
          "Save your result to your dashboard",
        ]}
        nextPath="/tools/readiness"
      />
    );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Interactive Tool · 2 Minutes</div>
          <h1>VA Readiness Check</h1>
          <p>
            Eight questions, one answer: which stage to start from. It isn't a grade —
            it's a guide so you don't waste your time on the wrong step.
          </p>
        </div>
      </section>
      <div className="wrap py-16 max-w-[720px]">
        <QuizReadiness userId={user.id} />
      </div>
    </>
  );
}
