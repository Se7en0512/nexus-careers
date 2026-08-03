import type { Metadata } from "next";
import ContributionsCalculator from "@/components/ContributionsCalculator";

export const metadata: Metadata = { title: "PH Contributions Calculator" };

export default function ContributionsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Free Tool</div>
          <h1>Philippine contributions calculator</h1>
          <p>
            Know your real take-home income — SSS, PhilHealth, Pag-IBIG, and BIR income
            tax, calculated the way a Filipino VA or freelancer pays them.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <ContributionsCalculator />
      </div>
    </>
  );
}
