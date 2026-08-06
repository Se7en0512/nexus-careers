"use client";

export default function DonateModal({
  paypalLink,
  gcashNumber,
  onClose,
}: {
  paypalLink: string;
  gcashNumber: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-navy-900 border border-navy-700 rounded-lg p-8 max-w-sm w-full flex flex-col items-center gap-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-ink-500 hover:text-white text-lg">✕</button>
        <h2 className="font-serif text-[22px] font-medium text-white">Support Thrive</h2>
        <p className="text-ink-400 text-[13px] text-center leading-relaxed">
          Thrive is free and will stay free. But running this site costs real money every month. If it helped you, consider a small donation.
        </p>

        {gcashNumber && (
          <div className="flex flex-col items-center gap-2">
            <img
              src="/gcash-qr.png"
              alt="GCash QR Code"
              width={200}
              height={200}
              className="rounded-lg"
            />
            <p className="text-ink-500 text-[11px]">Scan with GCash app</p>
          </div>
        )}

        <div className="w-full border-t border-navy-700 pt-4 flex flex-col items-center gap-2">
          <p className="text-ink-500 text-[12px]">or</p>
          <a
            href={paypalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !px-8 !py-2.5 !text-[13px] w-full text-center"
          >
            Donate via PayPal
          </a>
        </div>

        <p className="text-ink-500 text-[10px] text-center italic">
          No obligation. Give only if you want to.
        </p>
      </div>
    </div>
  );
}
