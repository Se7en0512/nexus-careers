"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function VerifyContent() {
  const params = useSearchParams();
  const success = params.get("success") === "1";
  const error = params.get("error");

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-4xl">✅</div>
        <h2 className="font-serif text-[22px] font-medium">Email verified!</h2>
        <p className="text-ink-400 text-[14px]">Your account is now fully activated.</p>
        <Link href="/dashboard" className="btn-primary !px-8 !py-2.5">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (error === "expired") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-4xl">⏰</div>
        <h2 className="font-serif text-[22px] font-medium">Link expired</h2>
        <p className="text-ink-400 text-[14px]">This verification link has expired. Please sign in and request a new one.</p>
        <Link href="/login" className="btn-primary !px-8 !py-2.5">
          Sign In
        </Link>
      </div>
    );
  }

  if (error === "invalid") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-4xl">❌</div>
        <h2 className="font-serif text-[22px] font-medium">Invalid link</h2>
        <p className="text-ink-400 text-[14px]">This verification link is invalid.</p>
        <Link href="/login" className="btn-primary !px-8 !py-2.5">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="text-4xl">📧</div>
      <h2 className="font-serif text-[22px] font-medium">Check your email</h2>
      <p className="text-ink-400 text-[14px] max-w-sm leading-relaxed">
        We&apos;ve sent a verification link to your email address. Please click the link to verify your account.
      </p>
      <p className="text-ink-500 text-[12px]">
        Didn&apos;t receive it? Check your spam folder, or{" "}
        <button className="accent-link" onClick={() => window.location.reload()}>
          try again
        </button>
        .
      </p>
      <Link href="/login" className="text-ink-400 text-[13px] hover:text-white transition-colors mt-4">
        Back to Sign In
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center">
      <Suspense>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
