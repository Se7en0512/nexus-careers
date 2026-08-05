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
  const gcashQrUrl = gcashNumber
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(gcashNumber)}&bgcolor=ffffff&color=000000`
    : "";

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

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {gcashNumber && (
            <div className="flex-1 panel p-4 flex flex-col items-center gap-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-gold-400">GCash</p>
              <img
                src={gcashQrUrl}
                alt="GCash QR Code"
                width={160}
                height={160}
                className="rounded-lg bg-white p-2"
              />
              <p className="text-ink-500 text-[11px] text-center">Scan with GCash app</p>
            </div>
          )}

          <div className="flex-1 panel p-4 flex flex-col items-center gap-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-gold-400">PayPal</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paypalLink)}&bgcolor=ffffff&color=000000`}
              alt="PayPal QR Code"
              width={160}
              height={160}
              className="rounded-lg bg-white p-2"
            />
            <p className="text-ink-500 text-[11px] text-center">Scan with PayPal app</p>
          </div>
        </div>

        <p className="text-ink-500 text-[11px] text-center">
          Any amount helps — even the price of a coffee!
        </p>
      </div>
    </div>
  );
}
