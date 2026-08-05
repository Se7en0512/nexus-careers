"use client";

export default function DonateModal({ paypalLink, onClose }: { paypalLink: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-navy-900 border border-navy-700 rounded-lg p-8 max-w-md w-full flex flex-col items-center gap-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-ink-500 hover:text-white text-lg">✕</button>
        <h2 className="font-serif text-[22px] font-medium text-white">Support Thrive</h2>
        <p className="text-ink-400 text-[14px] text-center leading-relaxed">
          Thrive is free and community-driven. If this site helped you, consider buying us a coffee to keep it running.
        </p>
        <a
          href={paypalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary !px-8 !py-3 !text-[15px] inline-flex items-center gap-2"
        >
          ☕ Donate via PayPal
        </a>
        <p className="text-ink-500 text-[11px] text-center">
          You&apos;ll be redirected to PayPal. Any amount helps!
        </p>
      </div>
    </div>
  );
}
