"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";

const NEXT_KEY = "thrive-next";

declare global {
  interface Window {
    hcaptcha: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id: string) => void };
  }
}

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
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
      // Honor the ?next= param captured from a locked page — e.g. come back
      // to the Resume Builder after creating the account.
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
      if (data.verified === false) {
        // Account still needs email verification — remember the destination
        // so verify-email can finish the journey once verified.
        if (safeNext) {
          try { sessionStorage.setItem(NEXT_KEY, safeNext); } catch {}
        }
        router.push("/verify-email");
      } else if (safeNext) {
        try { sessionStorage.removeItem(NEXT_KEY); } catch {}
        router.push(safeNext);
      } else {
        router.push("/onboarding");
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors"
      tabIndex={-1}
    >
      {show ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

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
        <div className="relative">
          <input
            id="s-pass"
            type={showPassword ? "text" : "password"}
            className="field !pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8+ chars, uppercase, number, special"
            minLength={8}
            maxLength={128}
            required
          />
          <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
        </div>
        {pwHint && <p className="text-xs text-amber-500 mt-1">{pwHint}</p>}
      </div>
      <div>
        <label className="form-label" htmlFor="s-pass-confirm">Confirm Password</label>
        <div className="relative">
          <input
            id="s-pass-confirm"
            type={showConfirm ? "text" : "password"}
            className="field !pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            minLength={8}
            maxLength={128}
            required
          />
          <PasswordToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
        )}
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
      <Button loading={busy} className="w-full">
        {busy ? "Creating account..." : "Create Account"}
      </Button>

      {/* Trust signals */}
      <div className="border-t border-navy-700 pt-4 mt-1">
        <div className="flex items-center justify-center gap-1.5 text-ink-500 text-[11px] mb-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Your data is encrypted and never shared</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Verified" },
            { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "Protected" },
            { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: "Encrypted" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
              </div>
              <span className="text-[10px] text-ink-500 font-mono uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="form-note text-center">
        Already have an account?{" "}
        <Link href="/login" className="accent-link">Sign in</Link>
      </p>
    </form>
  );
}
