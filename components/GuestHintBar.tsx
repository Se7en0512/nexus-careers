"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TOOL_HINTS } from "@/lib/tool-hints";

export default function GuestHintBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TOOL_HINTS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const hint = TOOL_HINTS[index];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-navy-900 border-t border-navy-700 text-ink-300" style={{ minHeight: 40 }}>
      <div className="wrap flex items-center justify-center gap-3 py-2 px-4 text-[12px] flex-wrap text-center">
        <span>
          <span className="text-gold-400 font-medium">{hint.label}:</span> {hint.blurb}
        </span>
        <Link href="/signup" className="btn-primary !px-4 !py-1.5 !text-[11px] whitespace-nowrap">
          Create free account
        </Link>
      </div>
    </div>
  );
}