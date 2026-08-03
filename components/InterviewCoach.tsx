"use client";

import { useState } from "react";
import { INTERVIEW_GROUPS } from "@/data/interview-questions";
import CopyScript from "@/components/CopyScript";

export default function InterviewCoach() {
  const [practice, setPractice] = useState(false);
  const [openQ, setOpenQ] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState(0);

  const group = INTERVIEW_GROUPS[activeGroup];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 font-mono text-[12px]">
        <button
          onClick={() => setPractice(!practice)}
          className={`px-4 py-2 rounded-[3px] border transition-colors ${
            practice
              ? "border-gold-400 bg-[rgba(217,169,78,0.15)] text-gold-300"
              : "border-navy-600 text-ink-400 hover:border-navy-500"
          }`}
        >
          {practice ? "Practice Mode ON" : "Practice Mode OFF"}
        </button>
        <span className="text-ink-500">
          {INTERVIEW_GROUPS.length} categories
        </span>
      </div>

      <div className="flex gap-2 mb-6 font-mono text-[12px] overflow-x-auto">
        {INTERVIEW_GROUPS.map((g, i) => (
          <button
            key={g.group}
            onClick={() => setActiveGroup(i)}
            className={`px-4 py-2 rounded-[3px] border transition-colors whitespace-nowrap ${
              activeGroup === i
                ? "border-gold-400 bg-[rgba(217,169,78,0.15)] text-gold-300"
                : "border-navy-600 text-ink-400 hover:border-navy-500"
            }`}
          >
            {g.group}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {group.items.map((item, idx) => {
          const id = `${activeGroup}-${idx}`;
          const isOpen = openQ === id;
          return (
            <div
              key={id}
              className="panel p-5 border border-navy-700 bg-navy-900"
            >
              <button
                onClick={() => setOpenQ(isOpen ? null : id)}
                className="w-full text-left flex items-start justify-between gap-4"
              >
                <h3 className="font-semibold text-[15px] pr-4">
                  {item.q}
                </h3>
                <span className="font-mono text-[11px] text-gold-400 flex-shrink-0 mt-0.5">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div className="mt-4 flex flex-col gap-4">
                  <div>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-1">
                      Why this question
                    </p>
                    <p className="text-[13.5px] text-ink-300">{item.why}</p>
                  </div>

                  <div>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-1">
                      How to answer
                    </p>
                    <p className="text-[13.5px] text-ink-300">{item.how}</p>
                  </div>

                  {item.example && (
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-1">
                        Model answer
                      </p>
                      {practice ? (
                        <button
                          onClick={() => setOpenQ(null)}
                          className="text-[13.5px] text-gold-400 hover:text-gold-300 underline"
                        >
                          Click to reveal model answer
                        </button>
                      ) : (
                        <div className="flex gap-3 items-start">
                          <p className="text-[13.5px] text-ink-300 flex-1 italic">
                            "{item.example}"
                          </p>
                          <CopyScript script={item.example} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}