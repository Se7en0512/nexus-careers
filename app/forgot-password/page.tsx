import type { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="py-20 px-8">
      <div className="auth-card">
        <div className="eyebrow">// Password Reset</div>
        <h1 className="font-serif font-medium text-[28px] mt-3 mb-2">
          Where should we send the link?
        </h1>
        <p className="text-[14px] text-ink-500 mb-8">
          We'll send a link that's valid for 1 hour.
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
