"use client";

import { useState } from "react";

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
    <div
      style={{
        background: "#FFF3CD",
        border: "1px solid #D4A94E",
        borderRadius: 8,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <span style={{ color: "#555" }}>
        <strong>Email not verified.</strong>{" "}
        {status === "sent"
          ? msg
          : "Please check your inbox or resend the verification link."}
      </span>
      {status !== "sent" && (
        <button
          onClick={handleResend}
          disabled={status === "sending"}
          style={{
            background: "#D9A94E",
            color: "#1a1a2e",
            border: "none",
            borderRadius: 4,
            padding: "6px 16px",
            fontWeight: 600,
            cursor: status === "sending" ? "not-allowed" : "pointer",
            opacity: status === "sending" ? 0.6 : 1,
          }}
        >
          {status === "sending" ? "Sending..." : "Resend"}
        </button>
      )}
      {status === "error" && (
        <span style={{ color: "#c00", fontSize: 13 }}>{msg}</span>
      )}
    </div>
  );
}
