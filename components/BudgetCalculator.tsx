"use client";

import { useMemo, useState } from "react";

interface OverheadItem {
  id: string;
  name: string;
  defaultAmount: number;
  note: string;
}

const OVERHEAD_ITEMS: OverheadItem[] = [
  { id: "bir_tax", name: "BIR Freelancer Tax (8% Flat Rate)", defaultAmount: 0.08, note: "8% of gross target. Highly recommended for legal registration (ITR, loans, visa)." },
  { id: "sss", name: "SSS Self-Employed Contribution", defaultAmount: 1500, note: "For retirement, maternity, and sickness benefits. Standard contribution ranges ₱500–₱3,000." },
  { id: "philhealth", name: "PhilHealth Contribution", defaultAmount: 500, note: "Essential healthcare insurance. Typical voluntary premium is ₱500/month." },
  { id: "pagibig", name: "Pag-IBIG HDMF Savings", defaultAmount: 200, note: "For housing loans and savings. Default self-employed contribution is ₱200." },
  { id: "hmo", name: "HMO / Private Health Insurance Buffer", defaultAmount: 2000, note: "Since freelancers don't have company HMOs, budgeting for health coverage is critical." },
  { id: "backup_net", name: "Backup Internet Plan (Mobile Data/Prepaid)", defaultAmount: 500, note: "Mobile hot-spots or secondary local ISP to prevent interview or task disconnection." },
  { id: "electricity_buffer", name: "Power Backup & Electricity Buffer", defaultAmount: 1500, note: "UPS battery backup costs, co-working space fees, or high electricity bills due to WFH." },
];

export default function BudgetCalculator() {
  const [income, setIncome] = useState(50000);
  const [selectedOverhead, setSelectedOverhead] = useState<string[]>([
    "bir_tax",
    "sss",
    "philhealth",
    "pagibig",
    "backup_net",
  ]);

  // Overhead amounts (customizable by user)
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({
    sss: 1500,
    philhealth: 500,
    pagibig: 200,
    hmo: 2000,
    backup_net: 500,
    electricity_buffer: 1500,
  });

  const toggleOverhead = (id: string) => {
    if (selectedOverhead.includes(id)) {
      setSelectedOverhead(selectedOverhead.filter((x) => x !== id));
    } else {
      setSelectedOverhead([...selectedOverhead, id]);
    }
  };

  const handleAmountChange = (id: string, val: number) => {
    setCustomAmounts({
      ...customAmounts,
      [id]: isNaN(val) ? 0 : val,
    });
  };

  const result = useMemo(() => {
    let totalOverhead = 0;
    selectedOverhead.forEach((id) => {
      if (id === "bir_tax") {
        totalOverhead += income * 0.08;
      } else {
        totalOverhead += customAmounts[id] || 0;
      }
    });

    const netPay = Math.max(0, income - totalOverhead);
    const needs = netPay * 0.50;
    const wants = netPay * 0.30;
    const savings = netPay * 0.20;

    return {
      totalOverhead,
      netPay,
      needs,
      wants,
      savings,
    };
  }, [income, selectedOverhead, customAmounts]);

  const num = (v: string) => {
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
      {/* INPUTS PANEL */}
      <div className="flex flex-col gap-8">
        {/* Income Input */}
        <div className="panel p-6 bg-navy-900 border border-navy-700 rounded-[3px]">
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-6">
            1. Target Monthly Gross Income
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="form-label" htmlFor="target-income">Gross Target Income (₱)</label>
              <input
                id="target-income"
                type="number"
                className="field text-lg font-mono"
                value={income}
                onChange={(e) => setIncome(num(e.target.value))}
                min={0}
              />
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                className="w-full accent-gold-400 cursor-pointer h-1.5 bg-navy-800 rounded-lg appearance-none"
                min={20000}
                max={150000}
                step={5000}
                value={income}
                onChange={(e) => setIncome(num(e.target.value))}
              />
              <span className="font-mono text-sm text-ink-300 w-20 text-right">
                ₱{(income / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
        </div>

        {/* Overhead Toggles */}
        <div className="panel p-6 bg-navy-900 border border-navy-700 rounded-[3px]">
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-6">
            2. Freelance Overhead & Statutory Benefits
          </h3>
          <p className="text-sm text-ink-300 mb-6">
            Freelancing has no HR department — you set aside your own tax, health benefits, and
            back-up equipment savings yourself.
          </p>

          <div className="flex flex-col gap-5">
            {OVERHEAD_ITEMS.map((item) => {
              const isChecked = selectedOverhead.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`flex flex-col p-4 border rounded-[3px] transition-colors ${
                    isChecked
                      ? "border-gold-400/50 bg-navy-950/40"
                      : "border-navy-700 bg-transparent hover:bg-navy-950/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <label className="flex items-start gap-3 cursor-pointer select-none text-[14.5px] font-semibold text-ink-50">
                      <input
                        type="checkbox"
                        className="mt-1 accent-gold-400 rounded"
                        checked={isChecked}
                        onChange={() => toggleOverhead(item.id)}
                      />
                      <div>
                        <span>{item.name}</span>
                        <p className="text-xs text-ink-400 font-normal mt-1">{item.note}</p>
                      </div>
                    </label>

                    {isChecked && (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-ink-500">₱</span>
                        {item.id === "bir_tax" ? (
                          <span className="font-mono text-sm text-gold-400 font-semibold w-16 text-right">
                            {Math.round(income * 0.08).toLocaleString()}
                          </span>
                        ) : (
                          <input
                            type="number"
                            className="field !py-1 !px-2 w-20 text-right font-mono text-xs border border-navy-600 bg-navy-950 text-gold-400"
                            value={customAmounts[item.id] || 0}
                            onChange={(e) => handleAmountChange(item.id, num(e.target.value))}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RESULTS PANEL */}
      <div className="flex flex-col gap-6">
        <div className="panel p-6 bg-navy-900 border border-navy-700 rounded-[3px] sticky top-24">
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-6">
            Your True Net Budget
          </h3>

          {/* Core Numbers */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between text-sm text-ink-300">
              <span>Target Gross Income:</span>
              <span className="font-mono text-ink-50">₱{income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-ink-300">
              <span>Total Overhead Deductions:</span>
              <span className="font-mono text-red-400">-₱{Math.round(result.totalOverhead).toLocaleString()}</span>
            </div>
            <div className="border-t border-navy-700 pt-4 flex justify-between items-center">
              <span className="text-sm font-semibold text-gold-400">Actual Take-Home Pay (Net):</span>
              <span className="font-mono text-2xl font-bold text-gold-300">₱{Math.round(result.netPay).toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-ink-500 mb-8 border-l border-gold-400/40 pl-3">
            The 50/30/20 rule is applied to your <strong>Take-Home Pay</strong> to make sure the funds
            for taxes and statutory contributions don't run out.
          </p>

          {/* Breakdown Visualizer */}
          <div className="flex flex-col gap-6">
            {/* Needs */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-semibold text-ink-50">🏠 Needs (50%)</span>
                <span className="font-mono text-lg text-gold-400 font-semibold">
                  ₱{Math.round(result.needs).toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400" style={{ width: "50%" }} />
              </div>
              <p className="text-xs text-ink-500 mt-1.5">Renta, pagkain, internet, kuryente, load.</p>
            </div>

            {/* Wants */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-semibold text-ink-50">☕ Wants (30%)</span>
                <span className="font-mono text-lg text-gold-400 font-semibold">
                  ₱{Math.round(result.wants).toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: "30%" }} />
              </div>
              <p className="text-xs text-ink-500 mt-1.5">Pagkain sa labas, bagong gadgets, hobbies, travel.</p>
            </div>

            {/* Savings */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-semibold text-ink-50">💰 Savings (20%)</span>
                <span className="font-mono text-lg text-gold-400 font-semibold">
                  ₱{Math.round(result.savings).toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-400" style={{ width: "20%" }} />
              </div>
              <p className="text-xs text-ink-500 mt-1.5">Emergency fund (3–6 months), investments, backup computer buffer.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
