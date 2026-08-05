"use client";

import { useEffect, useState } from "react";

export default function DonatePage() {
  const [paypalLink, setPaypalLink] = useState("https://paypal.me/PhillipWendyll");
  const [gcashNumber, setGcashNumber] = useState("");

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((data) => {
        if (data?.paypal_link) setPaypalLink(data.paypal_link);
        if (data?.gcash_number) setGcashNumber(data.gcash_number);
      })
      .catch(() => {});
  }, []);

  const gcashQrUrl = gcashNumber
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(gcashNumber)}&bgcolor=ffffff&color=000000`
    : "";

  return (
    <div className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center gap-8 text-center">
      <h1 className="font-serif text-[32px] font-medium">Support Thrive</h1>
      <p className="text-ink-400 text-[15px] leading-relaxed max-w-md">
        Thrive is free and built for the Filipino VA community. If this platform has helped you in any way, consider supporting us so we can keep it running and improving.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        {gcashNumber && (
          <div className="flex-1 panel p-6 flex flex-col items-center gap-3">
            <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-gold-400">GCash</p>
            <img
              src={gcashQrUrl}
              alt="GCash QR Code"
              width={180}
              height={180}
              className="rounded-lg bg-white p-2"
            />
            <p className="text-ink-500 text-[12px]">Scan with GCash app</p>
          </div>
        )}

        <div className="flex-1 panel p-6 flex flex-col items-center gap-3 justify-center">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-gold-400">PayPal</p>
          <div className="w-[180px] h-[180px] bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#253B80] font-bold text-[26px]">Pay</span>
            <span className="text-[#179BD7] font-bold text-[26px]">Pal</span>
          </div>
          <a
            href={paypalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !px-6 !py-2 !text-[13px]"
          >
            Donate via PayPal
          </a>
        </div>
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
