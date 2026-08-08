import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import VAAssistant from "@/components/VAAssistant";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "AI VA Assistant" };

export const dynamic = "force-dynamic";

export default async function AssistantPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Free Tool · AI Powered"
        title="Ask the Thrive Assistant."
        description="Rates, negotiations, interview answers, tool recommendations, scam spotting — ask anything about getting hired as a VA and get a direct, practical answer."
        highlights={[
          "Direct, practical answers in seconds",
          "Rates, interviews, tools, and scam spotting",
          "Free to use — no subscription needed",
        ]}
        nextPath="/assistant"
      />
    );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Free Tool · AI Powered</div>
          <h1>Ask the Thrive Assistant.</h1>
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
