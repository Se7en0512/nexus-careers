import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "Create Account" };

export default async function SignupPage() {
  return (
    <div className="py-20 px-8">
      <div className="auth-card">
        <div className="eyebrow">// Free Account</div>
        <h1 className="font-serif font-medium text-[28px] mt-3 mb-2">
          Start your journey.
        </h1>
        <p className="text-[14px] text-ink-500 mb-8">
          Full roadmap, quizzes, and progress tracking — no payment, no trial that expires.
        </p>
        <SignupForm />
      </div>
    </div>
  );
}
