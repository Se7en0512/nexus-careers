import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import VAAssistant from "@/components/VAAssistant";

export const metadata: Metadata = { title: "AI VA Assistant" };

export const dynamic = "force-dynamic";

export default async function AssistantPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/assistant");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Free Tool · AI Powered</div>
          <h1>Ask the Nexus Assistant.</h1>
          <p>
            Rates, negotiations, interview answers, tool recommendations, scam spotting —
            ask anything about getting hired as a VA and get a direct, practical answer.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <VAAssistant />
      </div>
    </>
  );
}
