"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    hcaptcha: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id: string) => void };
  }
}

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [updatesOptIn, setUpdatesOptIn] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pwHint, setPwHint] = useState("");
  const captchaRef = useRef<HTMLDivElement>(null);
  const [captchaToken, setCaptchaToken] = useState("");

  useEffect(() => {
    if (!captchaRef.current || captchaRef.current.dataset.rendered) return;
    const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;
    if (!sitekey || !window.hcaptcha) return;
    const id = window.hcaptcha.render(captchaRef.current, {
      sitekey,
      callback: (token: string) => setCaptchaToken(token),
      "expired-callback": () => setCaptchaToken(""),
      theme: "light",
    });
    captchaRef.current.dataset.rendered = id;
  }, []);

  useEffect(() => {
    if (password.length < 8) { setPwHint(""); return; }
    const checks: string[] = [];
    if (password.length > 128) checks.push("max 128 chars");
    if (!/[A-Z]/.test(password)) checks.push("add uppercase");
    if (!/[^a-zA-Z0-9]/.test(password)) checks.push("add special char");
    if (!/[0-9]/.test(password)) checks.push("add number");
    setPwHint(checks.length ? `Weak: ${checks.join(", ")}` : "");
  }, [password]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, updates_opt_in: updatesOptIn, captcha_token: captchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong — please try again.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div>
        <label className="form-label" htmlFor="s-name">Name</label>
        <input
          id="s-name"
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Maria Santos"
          required
        />
      </div>
      <div>
        <label className="form-label" htmlFor="s-email">Email</label>
        <input
          id="s-email"
          type="email"
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
        />
      </div>
      <div>
        <label className="form-label" htmlFor="s-pass">Password</label>
        <input
          id="s-pass"
          type="password"
          className="field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="8+ chars, uppercase, number, special"
          minLength={8}
          maxLength={128}
          required
        />
        {pwHint && <p className="text-xs text-amber-500 mt-1">{pwHint}</p>}
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={updatesOptIn}
          onChange={(e) => setUpdatesOptIn(e.target.checked)}
          className="accent-[#D9A94E] w-4 h-4 mt-1"
        />
<span className="text-[12.5px] text-ink-500 leading-relaxed">
           Email me updates about new courses and tools — I can opt out
           anytime. (<em>Not required to sign up.</em>)
         </span>
      </label>
      <div ref={captchaRef} className="flex justify-center"></div>
      {error && <p className="form-error">{error}</p>}
      <button className="btn-primary w-full" disabled={busy}>
        {busy ? "Working..." : "Create Account"}
      </button>
      <p className="form-note text-center">
        Already have an account?{" "}
        <Link href="/login" className="accent-link">Sign in</Link>
      </p>
    </form>
  );
}
