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
    <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center gap-8 text-center">
      <h1 className="font-serif text-[32px] font-medium">Support Thrive</h1>
      <p className="text-ink-400 text-[15px] leading-relaxed">
        Thrive is free and will stay free. But running this site — servers, database, AI tools — costs real money every month. We&apos;re a small team doing this for the Filipino VA community, and every little bit helps us keep the lights on.
      </p>
      <p className="text-ink-500 text-[13px]">
        No pressure. If Thrive has helped you land a client, learn a skill, or avoid a scam, consider donating.
      </p>

      <div className="panel p-8 flex flex-col items-center gap-5 w-full">
        {gcashNumber && (
          <div className="flex flex-col items-center gap-2">
            <img
              src="/gcash-qr.png"
              alt="GCash QR Code"
              width={220}
              height={220}
              className="rounded-lg"
            />
            <p className="text-ink-500 text-[12px]">Scan with GCash app</p>
          </div>
        )}

        <div className="w-full border-t border-navy-700 pt-5 flex flex-col items-center gap-2">
          <p className="text-ink-500 text-[12px]">or</p>
          <a
            href={paypalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !px-10 !py-3 !text-[15px] w-full text-center"
          >
            Donate via PayPal
          </a>
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
