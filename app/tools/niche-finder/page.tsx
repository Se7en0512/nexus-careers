import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import QuizNiche from "@/components/QuizNiche";

export const metadata: Metadata = { title: "Niche Finder" };

export const dynamic = "force-dynamic";

export default async function NicheFinderPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/tools/niche-finder");

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
