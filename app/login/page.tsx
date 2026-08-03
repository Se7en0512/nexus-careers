import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="py-20 px-8">
      <div className="auth-card">
        <div className="eyebrow">// Welcome Back</div>
        <h1 className="font-serif font-medium text-[28px] mt-3 mb-8">Sign in to your account.</h1>
        <LoginForm />
      </div>
    </div>
  );
}
