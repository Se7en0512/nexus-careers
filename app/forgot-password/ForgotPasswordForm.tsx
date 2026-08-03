"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setLink("");
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong — please try again.");
        return;
      }
      if (data.resetLink) {
        setLink(data.resetLink);
      } else {
        setSent(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div>
        <label className="form-label" htmlFor="f-email">Your account email</label>
        <input
          id="f-email"
          type="email"
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      {link && (
        <div className="border border-gold-400/40 bg-[rgba(217,169,78,0.16)] rounded-md p-4 text-[13.5px] text-ink-300 leading-relaxed">
          <strong className="text-gold-300">Development mode:</strong> the email service isn't
          configured yet, so here is the direct link to reset your password (valid for 1
          hour):
          <br />
          <a href={link} className="accent-link break-all mt-1 inline-block">{link}</a>
        </div>
      )}
      {sent && (
        <div className="border border-gold-400/40 bg-[rgba(217,169,78,0.16)] rounded-md p-4 text-[13.5px] text-ink-300 leading-relaxed">
          If an account exists for this email, the reset link has been sent. Check your
          inbox (or contact the admin if the email doesn't arrive).
        </div>
      )}
      {!link && !sent && (
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? "Sending..." : "Send Reset Link"}
        </button>
      )}
      <p className="form-note text-center">
        <Link href="/login" className="accent-link">← Back to sign in</Link>
      </p>
    </form>
  );
}
