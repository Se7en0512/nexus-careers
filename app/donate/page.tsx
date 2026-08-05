"use client";

import { useEffect, useState } from "react";

export default function DonatePage() {
  const [paypalLink, setPaypalLink] = useState("https://paypal.me/PhillipWendyll");

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((data) => {
        if (data?.paypal_link) setPaypalLink(data.paypal_link);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center gap-8 text-center">
      <h1 className="font-serif text-[32px] font-medium">Support Thrive</h1>
      <p className="text-ink-400 text-[15px] leading-relaxed max-w-md">
        Thrive is free and built for the Filipino VA community. If this platform has helped you in any way, consider supporting us so we can keep it running and improving.
      </p>
      <div className="panel p-8 flex flex-col items-center gap-4 w-full">
        <p className="text-ink-300 text-[14px]">Click the button below to donate any amount via PayPal:</p>
        <a
          href={paypalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary !px-10 !py-3.5 !text-[16px] inline-flex items-center gap-2"
        >
          ☕ Donate via PayPal
        </a>
        <p className="text-ink-500 text-[12px]">Any amount helps — even the price of a coffee!</p>
      </div>
      <div className="panel p-6 w-full text-left">
        <h3 className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-gold-400 mb-3">Why donate?</h3>
        <ul className="text-ink-400 text-[13px] space-y-2">
          <li>• Covers server and database hosting costs</li>
          <li>• Keeps all tools and resources 100% free</li>
          <li>• Helps us add new features and content</li>
          <li>• Supports the Filipino VA community</li>
        </ul>
      </div>
    </div>
  );
}
