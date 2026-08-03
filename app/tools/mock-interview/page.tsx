import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import MockInterview from "@/components/MockInterview";

export const metadata: Metadata = { title: "AI Mock Interview" };

export const dynamic = "force-dynamic";

export default async function MockInterviewPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/tools/mock-interview");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Free Tool · AI Powered</div>
          <h1>Mock interview, with real feedback.</h1>
          <p>
            Five realistic questions for your niche, answered by you — then graded out loud.
            Practice now so the real interview feels like a repeat.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <MockInterview />
      </div>
    </>
  );
}
