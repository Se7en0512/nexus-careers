"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [updatesOptIn, setUpdatesOptIn] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, updates_opt_in: updatesOptIn }),
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
          placeholder="8+ characters"
          minLength={8}
          required
        />
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
