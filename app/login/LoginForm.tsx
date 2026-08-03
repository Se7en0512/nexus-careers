"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Wrong email or password.");
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
        <label className="form-label" htmlFor="l-email">Email</label>
        <input
          id="l-email"
          type="email"
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="form-label" htmlFor="l-pass">Password</label>
        <input
          id="l-pass"
          type="password"
          className="field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="text-right -mt-2">
        <Link href="/forgot-password" className="form-note accent-link">
          Forgot your password?
        </Link>
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="btn-primary w-full" disabled={busy}>
        {busy ? "Signing in..." : "Sign In"}
      </button>
      <p className="form-note text-center">
        Don't have an account?{" "}
        <Link href="/signup" className="accent-link">Create one</Link>
      </p>
    </form>
  );
}
