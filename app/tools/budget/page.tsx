import type { Metadata } from "next";
import CalculatorHub from "@/components/CalculatorHub";

export const metadata: Metadata = { title: "Freelance Calculators Hub" };

export default function BudgetPlannerPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Free Tools · One Place</div>
          <h1>Every calculator a freelancer needs, in one place.</h1>
          <p>
            Plan your income with the 50/30/20 budget, price a project with the pitch
            calculator, check your SSS / PhilHealth / Pag-IBIG contributions, and keep
            client time zones straight — no more digging through the footer.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <CalculatorHub />
      </div>
    </>
  );
}