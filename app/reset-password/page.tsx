"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong — please try again.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <p className="form-error">
        No valid reset link. Request a new one{" "}
        <Link href="/forgot-password" className="accent-link">here</Link>.
      </p>
    );
  }

  if (done) {
    return (
      <p className="text-[14.5px] text-ink-300">
        Your password has been reset. Taking you to login...
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div>
        <label className="form-label" htmlFor="r-pass">New Password</label>
        <input
          id="r-pass"
          type="password"
          className="field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="btn-primary w-full" disabled={busy}>
        {busy ? "Saving..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="py-20 px-8">
      <div className="auth-card">
        <div className="eyebrow">// New Password</div>
        <h1 className="font-serif font-medium text-[28px] mt-3 mb-8">Reset your password.</h1>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
