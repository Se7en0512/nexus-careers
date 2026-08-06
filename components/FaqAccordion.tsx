"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-px bg-navy-700 border border-navy-700">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            data-open={isOpen}
            className="faq-item bg-navy-900"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full text-left px-7 py-5 flex items-center justify-between gap-4 hover:bg-navy-800 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-[15.5px] text-ink-50">{item.q}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-5 h-5 text-gold-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className="faq-answer"
              style={{
                maxHeight: isOpen ? "200px" : "0",
                padding: isOpen ? "0 28px 20px" : "0 28px",
              }}
            >
              <p className="text-sm text-ink-300 leading-relaxed">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
