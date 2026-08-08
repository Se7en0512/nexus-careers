import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import PitchCalculator from "@/components/PitchCalculator";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "Pitch Calculator" };

export const dynamic = "force-dynamic";

export default async function PitchCalculatorPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Tool"
        title="Pitch Calculator"
        description="Tell us your target income and the amount of time you can put in — and we'll tell you what rate you need to set."
        highlights={[
          "Target income + time = the rate you need",
          "Backs up your rate with simple math",
          "Bring it to your next negotiation",
        ]}
        nextPath="/tools/pitch-calculator"
      />
    );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Tool</div>
          <h1>Pitch Calculator</h1>
          <p>
            Tell us your target income and the amount of time you can put in — and we'll tell you
            what rate you need to set.
          </p>
        </div>
      </section>
      <div className="wrap py-16">
        <PitchCalculator />
      </div>
    </>
  );
}
