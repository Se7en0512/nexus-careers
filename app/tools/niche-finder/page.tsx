import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import QuizNiche from "@/components/QuizNiche";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "Niche Finder" };

export const dynamic = "force-dynamic";

export default async function NicheFinderPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Interactive Tool · 2 Minutes"
        title="Niche Finder"
        description="Eight questions to find out which specialization fits your personality, skills, and interests. The result is a recommendation — not a verdict."
        highlights={[
          "Eight questions, two minutes",
          "A recommendation matched to your skills",
          "Save your result to your dashboard",
        ]}
        nextPath="/tools/niche-finder"
      />
    );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Interactive Tool · 2 Minutes</div>
          <h1>Niche Finder</h1>
          <p>
            Eight questions to find out which specialization fits your personality, skills, and
            interests. The result is a recommendation — not a verdict.
          </p>
        </div>
      </section>
      <div className="wrap py-16 max-w-[720px]">
        <QuizNiche userId={user.id} />
      </div>
    </>
  );
}
