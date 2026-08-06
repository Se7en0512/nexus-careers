import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "Create Account" };

export default async function SignupPage() {
  return (
    <div className="py-20 px-8">
      <div className="auth-card">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <div className="eyebrow">// Create Account</div>
        </div>
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
