import type { Metadata } from "next";
import BudgetCalculator from "@/components/BudgetCalculator";

export const metadata: Metadata = { title: "Freelance Budget Planner" };

export default function BudgetPlannerPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Free Tool</div>
          <h1>Freelance Budget Planner</h1>
          <p>
            Find out your real income. This tool uses the 50/30/20 budget framework
            tailored for Filipino freelancers and VAs, with statutory deductions
            and overhead calculations included.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <BudgetCalculator />
      </div>
    </>
  );
}
