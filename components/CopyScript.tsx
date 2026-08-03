"use client";

import { useState } from "react";

export default function CopyScript({ script }: { script: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = script;
    try {
      // navigator.clipboard is only available in secure contexts (HTTPS or localhost).
      // On LAN IP / plain HTTP, use the execCommand fallback.
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (!ok) throw new Error("execCommand copy failed");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: highlight and let the user copy manually
      setCopied(false);
      window.prompt("Copy the script (Ctrl+C):", text);
    }
  };

  return (
    <button onClick={copy} className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px] flex-shrink-0">
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}
