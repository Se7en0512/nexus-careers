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

          <div className="flex-1 panel p-4 flex flex-col items-center gap-2 justify-center">
            <p className="font-mono text-[11px] uppercase tracking-wider text-gold-400">PayPal</p>
            <svg viewBox="0 0 124 33" className="w-[80px] h-auto" xmlns="http://www.w3.org/2000/svg">
              <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537-.146.871-.89 5.613a.604.604 0 0 0 .594.708h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.765-6.5.306-1.89.013-3.375-.872-4.405-.781-.915-2.149-1.372-4.031-1.372zm.789 6.375c-.375 2.454-2.249 2.454-4.061 2.454h-1.031l.72-4.583a.548.548 0 0 1 .538-.461h.473c1.235 0 2.4 0 2.961.754.315.421.427 1.071.39 1.836z" fill="#253B80"/>
              <path d="M14.983 6.749h-6.84a.949.949 0 0 0-.938.802l-2.766 17.537-.145.871-.813 5.157a1.104 1.104 0 0 0 1.093 1.265h4.346c.746 0 1.393-.543 1.513-1.28l.476-3.044.083-.532.589-3.749a.604.604 0 0 1 .593-.514h.283c3.615 0 6.225-1.64 6.92-6.353.299-2.011.008-3.585-.872-4.653-.782-.955-2.177-1.441-4.287-1.441zm.651 6.375c-.327 2.216-2.001 2.216-3.735 2.216h-.9l.663-4.231a.548.548 0 0 1 .538-.462h.414c.935 0 1.8 0 2.261.555.391.467.526 1.2.459 1.922z" fill="#253B80"/>
              <path d="M47.904 3.43h-6.839a.949.949 0 0 0-.939.802L37.36 21.77l-.145.871-.813 5.157a1.104 1.104 0 0 0 1.093 1.265h4.346c.746 0 1.393-.543 1.513-1.28l.476-3.044.083-.532.589-3.749a.604.604 0 0 1 .593-.514h.283c3.615 0 6.225-1.64 6.92-6.353.299-2.011.008-3.585-.872-4.653-.782-.955-2.177-1.441-4.287-1.441zm.651 6.375c-.327 2.216-2.001 2.216-3.735 2.216h-.9l.663-4.231a.548.548 0 0 1 .538-.462h.414c.935 0 1.8 0 2.261.555.391.467.526 1.2.459 1.922z" fill="#179BD7"/>
              <path d="M62.954 3.43h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537-.073.46-.447 2.837-.026.164a5.108 5.108 0 0 0 4.258 2.361h4.031l.558-3.539.083-.532.589-3.749a.604.604 0 0 1 .593-.514h.283c3.615 0 6.225-1.64 6.92-6.353.299-2.011.008-3.585-.872-4.653-.782-.955-2.177-1.441-4.287-1.441zm.651 6.375c-.327 2.216-2.001 2.216-3.735 2.216h-.9l.663-4.231a.548.548 0 0 1 .538-.462h.414c.935 0 1.8 0 2.261.555.391.467.526 1.2.459 1.922z" fill="#179BD7"/>
              <path d="M86.211 3.43h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537-.073.46-.372 2.363-.027.164a5.108 5.108 0 0 0 4.258 2.361h4.031l.558-3.539.083-.532.589-3.749a.604.604 0 0 1 .593-.514h.283c3.615 0 6.225-1.64 6.92-6.353.299-2.011.008-3.585-.872-4.653-.782-.955-2.177-1.441-4.287-1.441zm.651 6.375c-.327 2.216-2.001 2.216-3.735 2.216h-.9l.663-4.231a.548.548 0 0 1 .538-.462h.414c.935 0 1.8 0 2.261.555.391.467.526 1.2.459 1.922z" fill="#179BD7"/>
              <path d="M109.471 3.43h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537-.072.46-.373 2.363-.027.164a5.108 5.108 0 0 0 4.258 2.361h4.031l.558-3.539.082-.532.59-3.749a.604.604 0 0 1 .592-.514h.284c3.614 0 6.224-1.64 6.919-6.353.3-2.011.009-3.585-.871-4.653-.782-.955-2.177-1.441-4.288-1.441zm.652 6.375c-.326 2.216-2.001 2.216-3.734 2.216h-.9l.662-4.231a.548.548 0 0 1 .539-.462h.413c.936 0 1.801 0 2.262.555.391.467.525 1.2.458 1.922z" fill="#179BD7"/>
              <path d="M110.166 11.394c-.327 2.216-2.001 2.216-3.735 2.216h-.9l.663-4.231a.548.548 0 0 1 .538-.462h.414c.935 0 1.8 0 2.261.555.391.467.526 1.2.459 1.922z" fill="#179BD7"/>
              <path d="M92.119 17.769h-3.265a.95.95 0 0 0-.939.803l-.746 4.73a.95.95 0 0 0 .939.803h3.265a.95.95 0 0 0 .938-.803l.746-4.73a.95.95 0 0 0-.938-.803z" fill="#253B80"/>
            </svg>
            <a
              href={paypalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !px-5 !py-1.5 !text-[12px]"
            >
              Donate
            </a>
          </div>
        </div>

        <p className="text-ink-500 text-[11px] text-center">
          Any amount helps — even the price of a coffee!
        </p>
      </div>
    </div>
  );
}
