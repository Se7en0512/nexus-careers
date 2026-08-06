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

  return (
    <div className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center gap-8 text-center">
      <h1 className="font-serif text-[32px] font-medium">Support Thrive</h1>
      <p className="text-ink-400 text-[15px] leading-relaxed max-w-md">
        Thrive is free and will stay free. But running this site — servers, database, AI tools — costs real money every month. We&apos;re a small team doing this for the Filipino VA community, and every little bit helps us keep the lights on.
      </p>
      <p className="text-ink-500 text-[13px] max-w-md">
        No pressure. If Thrive has helped you land a client, learn a skill, or avoid a scam, consider donating via GCash or PayPal.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        {gcashNumber && (
          <div className="flex-1 panel p-6 flex flex-col items-center gap-3">
            <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-gold-400">GCash</p>
            <img
              src="/gcash-qr.jpg"
              alt="GCash QR Code"
              width={180}
              height={180}
              className="rounded-lg"
            />
            <p className="text-ink-500 text-[12px]">Scan with GCash app</p>
          </div>
        )}

        <div className="flex-1 panel p-6 flex flex-col items-center gap-3">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-gold-400">PayPal</p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paypalLink)}&bgcolor=ffffff&color=000000`}
            alt="PayPal QR Code"
            width={180}
            height={180}
            className="rounded-lg bg-white p-2"
          />
          <p className="text-ink-500 text-[12px]">Scan with PayPal app</p>
        </div>
      </div>

      <div className="panel p-6 w-full text-left">
        <h3 className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-gold-400 mb-3">Why donate?</h3>
        <p className="text-ink-400 text-[13px] leading-relaxed mb-3">
          Thrive is built and maintained by a small team with no corporate backing. Here&apos;s what your support helps cover:
        </p>
        <ul className="text-ink-400 text-[13px] space-y-2 mb-3">
          <li>• Server and database hosting</li>
          <li>• AI tools (chatbot, mock interview, cover letter generator)</li>
          <li>• New features and content updates</li>
          <li>• Keeping everything 100% free for all users</li>
        </ul>
        <p className="text-ink-500 text-[13px] leading-relaxed">
          We believe every Filipino VA deserves access to quality career tools — no paywalls, no hidden fees. If you&apos;ve found value in Thrive, a small donation goes a long way.
        </p>
        <p className="text-ink-500 text-[12px] mt-2 italic">
          There&apos;s no minimum amount and absolutely no obligation. Give only if you want to.
        </p>
      </div>
    </div>
  );
}
