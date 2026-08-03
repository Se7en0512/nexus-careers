"use client";

import { useMemo, useState } from "react";

function formatPeso(n: number): string {
  return "₱" + n.toLocaleString("en-PH", { maximumFractionDigits: 0 });
}

// SSS (2025): monthly salary credit bracketed in 500 steps, 4% employee share.
function sssMsc(monthly: number): number {
  const msc = Math.min(Math.max(8250, Math.ceil(monthly / 500) * 500), 29750);
  return msc;
}

// PhilHealth: 5% of monthly base, base capped at 10,000; employee pays half.
function philHealthBase(monthly: number): number {
  return Math.min(Math.max(2000, monthly), 10000);
}

// Pag-IBIG: 1% employee share, min 20, max 100 per month.
function pagibigShare(monthly: number): number {
  return Math.min(Math.max(monthly * 0.01, 20), 100);
}

// BIR 8% flat tax: 8% of annual gross above 250k (small taxpayer option), per month.
function birEightPercent(monthly: number): number {
  const annual = monthly * 12;
  if (annual <= 250000) return 0;
  return ((annual - 250000) * 0.08) / 12;
}

export default function ContributionsCalculator() {
  const [monthly, setMonthly] = useState("25000");
  const [showEmployer, setShowEmployer] = useState(true);

  const m = Math.max(0, Number(monthly) || 0);

  const calc = useMemo(() => {
    const sss = sssMsc(m) * 0.04;
    const ph = philHealthBase(m) * 0.025;
    const pagibig = pagibigShare(m);
    const bir = birEightPercent(m);
    const totalDeductions = sss + ph + pagibig + bir;
    return {
      sss,
      ph,
      pagibig,
      bir,
      totalDeductions,
      takeHome: m - totalDeductions,
      employer: {
        sss: sssMsc(m) * 0.10,
        ph: philHealthBase(m) * 0.025,
        pagibig: pagibigShare(m),
      },
    };
  }, [m]);

  const rows = [
    { label: "SSS (employee 4%)", value: calc.sss, hint: "of the bracketed Monthly Salary Credit" },
    { label: "PhilHealth (employee 2.5%)", value: calc.ph, hint: "5% of base split equally, base capped at ₱10,000" },
    { label: "Pag-IBIG (employee 1%)", value: calc.pagibig, hint: "min ₱20, max ₱100" },
    { label: "BIR income tax (8% flat)", value: calc.bir, hint: "on annual gross above ₱250,000" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10 items-start">
      <div className="panel p-7">
        <label className="form-label">Monthly income (₱)</label>
        <input
          type="number"
          min="0"
          className="field"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap mt-3">
          {["12000", "18000", "25000", "35000", "50000", "75000"].map((v) => (
            <button
              key={v}
              onClick={() => setMonthly(v)}
              className={`font-mono text-[12px] px-3 py-1.5 rounded-[3px] border transition-colors ${
                monthly === v
                  ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300"
                  : "border-navy-700 text-ink-400 hover:border-navy-500"
              }`}
            >
              {formatPeso(Number(v))}
            </button>
          ))}
        </div>

        <label className="form-label mt-6">
          <input
            type="checkbox"
            checked={showEmployer}
            onChange={(e) => setShowEmployer(e.target.checked)}
            className="mr-2 accent-[#d9a94e]"
          />
          Show employer share (if employed)
        </label>

        <div className="border-t border-navy-700 mt-6 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 mb-2">Monthly take-home</p>
          <p className="font-serif text-[34px] font-medium text-gold-300">{formatPeso(calc.takeHome)}</p>
          <p className="text-[13px] text-ink-500 mt-1">
            after {formatPeso(calc.totalDeductions)} in contributions and tax
          </p>
        </div>

        <p className="text-[12px] text-ink-500 mt-6 leading-relaxed">
          Estimate only, for freelance VAs using the 8% BIR flat tax option. Actual amounts
          vary by registration (TIN, self-employed filing) and updated SSS/PhilHealth rules.
          Verify with official sources.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="panel p-7">
          <h2 className="font-serif font-medium text-[20px] mb-5">Your monthly deductions</h2>
          <div className="flex flex-col">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between py-3 border-b border-navy-700 last:border-b-0">
                <div>
                  <p className="text-[14.5px] text-ink-200">{r.label}</p>
                  <p className="text-[12px] text-ink-500">{r.hint}</p>
                </div>
                <p className="font-mono text-[15px] text-ink-100">{formatPeso(r.value)}</p>
              </div>
            ))}
          </div>
        </div>

        {showEmployer && (
          <div className="panel p-7">
            <h2 className="font-serif font-medium text-[20px] mb-5">Employer share (if employed)</h2>
            <div className="flex flex-col">
              {[
                { label: "SSS (employer 10%)", value: calc.employer.sss },
                { label: "PhilHealth (employer 2.5%)", value: calc.employer.ph },
                { label: "Pag-IBIG (employer 1%)", value: calc.employer.pagibig },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between py-3 border-b border-navy-700 last:border-b-0">
                  <p className="text-[14.5px] text-ink-200">{r.label}</p>
                  <p className="font-mono text-[15px] text-ink-100">{formatPeso(r.value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-l-2 border-gold-400 pl-5 max-w-[640px]">
          <p className="text-[14px] text-ink-300">
            <strong className="text-ink-50">Tip:</strong> as a freelancer you pay the full
            contribution yourself, so add ~10% on top of your target rate to cover SSS,
            PhilHealth, Pag-IBIG, and tax. That's what the{" "}
            <a href="/tools/pitch-calculator" className="accent-link">Pitch Calculator</a>{" "}
            is for.
          </p>
        </div>
      </div>
    </div>
  );
}
