import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

const SECTIONS = [
  {
    title: "What we collect",
    body: "To let you sign up and save progress, we collect your name, email, and an encrypted password. We never ask for your card number or any payment details — everything on this site is free.",
  },
  {
    title: "How we use your data",
    body: "Your data is used only to run the site: saving your roadmap progress, quiz results, portfolio, certificate, and streak. If you've opted into updates, you'll get emails about new courses and tools — you can switch this off anytime from Account Settings without any questions.",
  },
  {
    title: "What we do NOT do",
    body: "We don't sell, rent, or share your personal data with third parties for marketing. We don't put your email on any list except our own updates — and only there if you agreed. We don't store your password anywhere except in a hashed form that even we can't read.",
  },
  {
    title: "How we protect your data",
    body: "Your account is protected by an encrypted session, rate limiting on login and signup to stop brute-force attacks, and security headers on every page. The database stays inside the server and never leaves it — no third-party cloud handles your information.",
  },
  {
    title: "Email updates and communication",
    body: "When you sign up, email updates start OFF by default. If you want to receive updates, tick the box in Account Settings — or just tell us at signup. Transactional communication (like password reset) doesn't need permission because it's required for the service to work.",
  },
  {
    title: "How to delete your account and data",
    body: "You can request a full account deletion from Account Settings — we call this a 'Right to Erasure', in line with the Data Privacy Act of 2012 (RA 10173). We process it within 5 banking days and remove everything: progress, results, portfolio, certificates, streak, and all personal data. It can't be undone afterward, so we double-check with you before finalizing.",
  },
  {
    title: "How long we keep your data",
    body: "We keep your data as long as your account is active. When you request deletion, we remove everything within 5 banking days. The only exception is if a legal requirement means some records must be kept for a while.",
  },
  {
    title: "Cookies and local storage",
    body: "We use a session cookie so you stay logged in. We don't use tracking or advertising cookies, and we don't follow your activity outside this site. Your quiz answers and other settings are stored in your browser as local storage for a faster experience.",
  },
  {
    title: "Changes to this policy",
    body: "If this policy changes, we'll update this page and add a notice on the dashboard. Any changes affecting how your data is used will be announced before they take effect, and you always have the right to delete your account if you don't agree.",
  },
  {
    title: "Contact for data privacy",
    body: "For any questions about your data or about exercising your rights under the Data Privacy Act, get in touch with us via your account email. We take privacy seriously — we respond to all privacy requests within 5 banking days.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Legal · Data Privacy Act (RA 10173)</div>
          <h1>Privacy Policy — your data, in your control.</h1>
          <p>
            Made for people who trust us. Here's the full detail — what we
            collect, why, and how you can stop it or wipe it out.
          </p>
        </div>
      </section>

      <div className="wrap py-16 max-w-[760px]">
        <div className="flex flex-col gap-8">
          {SECTIONS.map((s, i) => (
            <section key={s.title} className="border-l-2 border-gold-400 pl-6">
              <span className="font-mono text-xs text-ink-500">0{i + 1}</span>
              <h2 className="font-serif font-medium text-[22px] mt-1 mb-2.5">{s.title}</h2>
              <p className="text-[14.5px] text-ink-300 leading-[1.65]">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="panel p-7 mt-12">
          <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-gold-400 mb-3">
            From now on
          </h3>
          <p className="text-[14px] text-ink-300 leading-[1.65]">
            You don't have to trust us blindly — verify. Create a test account,
            request its deletion from Account Settings, and see how quickly
            we remove everything about you.
          </p>
        </div>
      </div>
    </>
  );
}
