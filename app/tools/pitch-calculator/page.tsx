import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import PitchCalculator from "@/components/PitchCalculator";

export const metadata: Metadata = { title: "Pitch Calculator" };

export const dynamic = "force-dynamic";

export default async function PitchCalculatorPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/tools/pitch-calculator");

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
