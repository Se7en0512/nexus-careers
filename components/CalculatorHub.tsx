"use client";

import { useState } from "react";
import Link from "next/link";
import BudgetCalculator from "./BudgetCalculator";
import PitchCalculator from "./PitchCalculator";
import ContributionsCalculator from "./ContributionsCalculator";
import TimezoneConverter from "./TimezoneConverter";

const TABS = [
  { key: "budget", label: "Budget Planner" },
  { key: "pitch", label: "Pitch Calculator" },
  { key: "contrib", label: "Contributions Calculator" },
  { key: "timezone", label: "Timezone Converter" },
];

export default function CalculatorHub() {
  const [tab, setTab] = useState("budget");

  return (
    <>
      <div className="panel p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">
            Invoice Generator
          </p>
          <h3 className="font-semibold text-[16px] mb-1">Need to bill a client?</h3>
          <p className="text-[13.5px] text-ink-500">
            Build a professional invoice with BIR-compliant details — no save needed, PDF-ready.
          </p>
        </div>
        <Link
          href="/tools/invoice-generator"
          className="btn-primary !py-[10px] !px-[16px] !text-[12.5px] whitespace-nowrap self-start md:self-center"
        >
          Try the Invoice Generator →
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 font-mono text-[12px]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-[3px] border transition-colors ${
              tab === t.key
                ? "border-gold-400 bg-[rgba(217,169,78,0.15)] text-gold-300"
                : "border-navy-600 text-ink-400 hover:border-navy-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={tab === "budget" ? "" : "hidden"}>
        <BudgetCalculator />
      </div>
      <div className={tab === "pitch" ? "" : "hidden"}>
        <PitchCalculator />
      </div>
      <div className={tab === "contrib" ? "" : "hidden"}>
        <ContributionsCalculator />
      </div>
      <div className={tab === "timezone" ? "" : "hidden"}>
        <TimezoneConverter />
      </div>
    </>
  );
}