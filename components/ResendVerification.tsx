"use client";

import { useState } from "react";
import Button from "@/components/Button";

export default function ResendVerification() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleResend() {
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setStatus("sent");
        setMsg("Verification email sent! Check your inbox.");
      } else {
        setStatus("error");
        setMsg(data.error || "Failed to send. Try again later.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Try again.");
    }
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-2 bg-amber-500/10 border border-amber-500/30 rounded-[3px] px-5 py-3">
      <span className="text-[13px] text-ink-300">
        <strong className="text-ink-50">Email not verified.</strong>{" "}
        {status === "sent"
          ? msg
          : "Please check your inbox or resend the verification link."}
      </span>
      {status !== "sent" && (
        <Button variant="secondary" loading={status === "sending"} onClick={handleResend} className="!py-[6px] !px-4 !text-[12px]">
          {status === "sending" ? "Sending..." : "Resend"}
        </Button>
      )}
      {status === "error" && (
        <span className="text-[13px] text-red-400 w-full">{msg}</span>
      )}
    </div>
  );
}
