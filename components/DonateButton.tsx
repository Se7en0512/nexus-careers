"use client";

import { useState } from "react";
import DonateModal from "./DonateModal";

export default function DonateButton({
  paypalLink,
  gcashNumber,
}: {
  paypalLink: string;
  gcashNumber: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-10 right-6 z-50 bg-gold-400 hover:bg-gold-300 text-navy-950 font-mono text-[13px] font-bold px-5 py-3 rounded-full shadow-lg transition-all hover:scale-105"
        title="Support Thrive"
      >
        ☕ Donate
      </button>
      {open && (
        <DonateModal
          paypalLink={paypalLink}
          gcashNumber={gcashNumber}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
