"use client";

import { useState, useRef } from "react";

export default function PortfolioActions({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const portfolioUrl = `https://thrive-ph.vercel.app/portfolio/${slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({ title: `${slug} — Portfolio`, url: portfolioUrl });
    }
  };

  const printPortfolio = () => window.print();

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(portfolioUrl)}`;

  return (
    <div className="flex items-center gap-2">
      {/* Copy Link */}
      <button onClick={copyLink}
        className="font-mono text-[11px] text-ink-500 hover:text-gold-400 border border-navy-700 hover:border-gold-400/50 rounded-[3px] px-3 py-1.5 transition-colors"
        title="Copy portfolio link">
        {copied ? "✓ Copied" : "📋 Copy Link"}
      </button>

      {/* Share */}
      <button onClick={shareNative}
        className="font-mono text-[11px] text-ink-500 hover:text-gold-400 border border-navy-700 hover:border-gold-400/50 rounded-[3px] px-3 py-1.5 transition-colors"
        title="Share portfolio">
        ↗ Share
      </button>

      {/* QR Code */}
      <div className="relative">
        <button onClick={() => setShowQR(!showQR)}
          className="font-mono text-[11px] text-ink-500 hover:text-gold-400 border border-navy-700 hover:border-gold-400/50 rounded-[3px] px-3 py-1.5 transition-colors"
          title="Show QR code">
          ⊞ QR
        </button>
        {showQR && (
          <div className="absolute right-0 top-full mt-2 bg-navy-900 border border-navy-700 rounded-[3px] p-4 z-50 shadow-xl" ref={qrRef}>
            <img src={qrUrl} alt="QR Code" width={160} height={160} className="rounded" />
            <p className="font-mono text-[10px] text-ink-500 mt-2 text-center">Scan to view portfolio</p>
          </div>
        )}
      </div>

      {/* Print */}
      <button onClick={printPortfolio}
        className="font-mono text-[11px] text-ink-500 hover:text-gold-400 border border-navy-700 hover:border-gold-400/50 rounded-[3px] px-3 py-1.5 transition-colors"
        title="Print portfolio">
        🖨 Print
      </button>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .max-w-\\[760px\\], .max-w-\\[760px\\] * { visibility: visible !important; }
          .max-w-\\[760px\\] { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
