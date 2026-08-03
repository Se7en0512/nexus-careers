"use client";

import { useMemo, useState } from "react";

const PH_MIN_WAGE = 645; // daily minimum wage (NCR, approx.) — placeholder reference

export default function PitchCalculator() {
  const [target, setTarget] = useState(40000);
  const [hours, setHours] = useState(20);
  const [weeks, setWeeks] = useState(4.33);
  const [overhead, setOverhead] = useState(20);

  const result = useMemo(() => {
    const billable = hours * weeks;
    const effTarget = target / (1 - overhead / 100);
    const rate = billable > 0 ? effTarget / billable : 0;
    const dailyMinWage = (target / weeks / 26) / PH_MIN_WAGE;
    return {
      billable,
      effTarget,
      rate,
      dailyMinWage: (target / weeks / 26),
    };
  }, [target, hours, weeks, overhead]);

  const num = (v: string) => {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <section className="flex flex-col gap-5">
        <div>
<label className="form-label" htmlFor="pc-target">
             Target monthly earnings (₱)
           </label>
          <input
            id="pc-target"
            type="number"
            className="field"
            value={target}
            onChange={(e) => setTarget(num(e.target.value))}
          />
        </div>
        <div>
<label className="form-label" htmlFor="pc-hours">
             Hours you can commit per week
           </label>
          <input
            id="pc-hours"
            type="number"
            className="field"
            value={hours}
            onChange={(e) => setHours(num(e.target.value))}
          />
        </div>
        <div>
<label className="form-label" htmlFor="pc-weeks">
             Weeks per month
           </label>
          <input
            id="pc-weeks"
            type="number"
            step="0.01"
            className="field"
            value={weeks}
            onChange={(e) => setWeeks(num(e.target.value))}
          />
        </div>
        <div>
<label className="form-label" htmlFor="pc-overhead">
             Non-billable hours (% of week — training, meetings, admin)
           </label>
          <input
            id="pc-overhead"
            type="number"
            className="field"
            value={overhead}
            onChange={(e) => setOverhead(num(e.target.value))}
          />
<p className="form-note mt-2">
             If your 20 hours include 4 hours of meetings and training, your overhead is 20%.
           </p>
        </div>
      </section>

      <section className="panel p-6">
        <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-6">
          Your Required Rate
        </h3>
        <div className="border border-navy-700 bg-navy-950 p-6 text-center mb-6">
          <p className="font-mono text-4xl font-semibold text-gold-400">
            ₱{Math.round(result.rate).toLocaleString()}
          </p>
          <p className="font-mono text-xs text-ink-500 mt-2">per hour</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-mono text-[11px] uppercase text-ink-500 mb-1">Billable hours / month</p>
            <p className="text-ink-50 font-mono text-lg">{Math.round(result.billable)}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase text-ink-500 mb-1">Effective earnings (with overhead)</p>
            <p className="text-ink-50 font-mono text-lg">₱{Math.round(result.effTarget).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase text-ink-500 mb-1">≈ per work day</p>
            <p className="text-ink-50 font-mono text-lg">₱{Math.round(result.dailyMinWage).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase text-ink-500 mb-1">≈ USD per hour</p>
            <p className="text-ink-50 font-mono text-lg">
              ${(result.rate / 58).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="border-l-2 border-gold-400 pl-4 mt-6">
<p className="text-[13.5px] text-ink-500">
             Real talk: don't set your rate based on this alone — check the market
             rate for your niche (see the{" "}
             <a href="/niches" className="accent-link">Niches</a>). If the market is higher, you win. If it's lower, you have two options: lower your target or add more billable hours.
           </p>
        </div>
      </section>
    </div>
  );
}
