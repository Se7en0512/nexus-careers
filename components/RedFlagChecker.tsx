"use client";

import { useState } from "react";
import { scanRedFlags, RED_FLAG_PATTERNS } from "@/data/redflag-patterns";

const SAMPLE = `Hi! We'd like to offer you a position as a virtual assistant. 
There is a one-time training fee of ₱2,500 for the starter kit before you begin.
You're hired - no interview needed! Please send your SSS number and bank details
for payroll setup. The pay is $50/hour for simple data entry. We're a new company
with no website yet, but trust us - this is a great opportunity.`;

export default function RedFlagChecker() {
    const [text, setText] = useState("");
    const [results, setResults] = useState<ReturnType<typeof scanRedFlags>>([]);
    const [checked, setChecked] = useState(false);

    const handleCheck = () => {
        setResults(scanRedFlags(text));
        setChecked(true);
    };

    const highCount = results.filter((r) => r.severity === "high").length;
    const mediumCount = results.filter((r) => r.severity === "medium").length;
    const lowCount = results.filter((r) => r.severity === "low").length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
            {/* INPUT */}
            <div className="flex flex-col gap-6">
                <div className="panel p-6 bg-navy-900 border border-navy-700 rounded-[3px]">
                    <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-4">
                        Paste the client message or job post here
                    </h3>
                    <textarea
                        className="field min-h-[220px]"
                        placeholder="Paste job post, chat message, or contract excerpt..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-3 mt-4">
                        <button onClick={handleCheck} className="btn-primary !py-2.5 !px-5 !text-xs font-mono">
                            SCAN FOR RED FLAGS
                        </button>
                        <button
                            onClick={() => {
                                setText(SAMPLE);
                                setChecked(false);
                            }}
                            className="btn-secondary !py-2.5 !px-5 !text-xs font-mono"
                        >
                            Load Sample
                        </button>
                    </div>
                    <p className="text-xs text-ink-500 mt-4 font-mono">
                        🔒 Nothing is saved — processed and discarded.
                    </p>
                </div>

                <div className="panel p-6 bg-navy-900 border border-navy-700 rounded-[3px]">
                    <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-4">
                        Pattern Library ({RED_FLAG_PATTERNS.length} patterns)
                    </h3>
                    <div className="flex flex-col gap-2">
                        {RED_FLAG_PATTERNS.map((p) => (
                            <div key={p.id} className="flex items-start gap-3 text-sm">
                                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${p.severity === "high" ? "bg-red-400" : "bg-amber-400"}`} />
                                <div>
                                    <p className="text-ink-200 font-medium">{p.label}</p>
                                    <p className="text-ink-500 text-xs">{p.explanation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RESULTS */}
            <div className="flex flex-col gap-6">
                <div className="panel p-6 bg-navy-900 border border-navy-700 rounded-[3px] sticky top-24">
                    <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-6">
                        Scan Results
                    </h3>

                    {!checked ? (
                        <p className="text-sm text-ink-500">
                            Paste the text and click scan to see potential red flags.
                        </p>
                    ) : results.length === 0 ? (
                        <div className="p-6 bg-green-400/10 border border-green-400/30 rounded-[3px]">
                            <p className="font-semibold text-green-400">✅ No red flags found!</p>
                            <p className="text-sm text-ink-300 mt-2">
                                Remember: this is pattern matching only — always verify the client through a video call or research.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                <div className="bg-red-400/10 border border-red-400/30 rounded-[3px] p-3 text-center">
                                    <p className="font-mono text-xl text-red-400 font-bold">{highCount}</p>
                                    <p className="text-[10px] uppercase tracking-wider text-ink-500">High</p>
                                </div>
                                <div className="bg-amber-400/10 border border-amber-400/30 rounded-[3px] p-3 text-center">
                                    <p className="font-mono text-xl text-amber-400 font-bold">{mediumCount}</p>
                                    <p className="text-[10px] uppercase tracking-wider text-ink-500">Medium</p>
                                </div>
                                <div className="bg-navy-950 border border-navy-700 rounded-[3px] p-3 text-center">
                                    <p className="font-mono text-xl text-ink-50 font-bold">{lowCount}</p>
                                    <p className="text-[10px] uppercase tracking-wider text-ink-500">Low</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {results.map((r) => (
                                    <div
                                        key={r.id}
                                        className={`p-4 rounded-[3px] border ${r.severity === "high"
                                                ? "bg-red-400/10 border-red-400/30"
                                                : "bg-amber-400/10 border-amber-400/30"
                                            }`}
                                    >
                                        <p className={`text-sm font-semibold mb-1 ${r.severity === "high" ? "text-red-400" : "text-amber-400"}`}>
                                            {r.severity === "high" ? "⚠️ " : "⚡ "}
                                            {r.label}
                                        </p>
                                        <p className="text-xs text-ink-300">{r.explanation}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}