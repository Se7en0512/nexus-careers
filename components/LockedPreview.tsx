import Link from "next/link";

interface LockedPreviewProps {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  nextPath: string;
}

export default function LockedPreview({ eyebrow, title, description, highlights, nextPath }: LockedPreviewProps) {
  const signupHref = `/signup?next=${encodeURIComponent(nextPath)}`;
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>

      <section className="wrap py-16">
        <div className="max-w-[760px]">
          {/* What's inside */}
          <div className="panel p-7 mb-4">
            <div className="eyebrow mb-5">What&apos;s inside</div>
            <div className="flex flex-col gap-3.5">
              {highlights.map((h) => (
                <div key={h} className="flex items-start gap-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-gold-400)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p className="text-[14px] text-ink-300 leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Locked card */}
          <div className="border border-gold-400/25 bg-navy-900 p-7 flex flex-col items-center text-center gap-4">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-gold-400)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-[15px] font-medium">
              Create a free account to unlock this.
            </p>
            <p className="text-[12.5px] text-ink-500 text-center max-w-[400px]">
              No payment, no trial that expires — every tool, course, and
              resource stays free for all members.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-2">
              <Link href={signupHref} className="btn-primary !py-[11px] !px-[22px] !text-[13px] w-full sm:w-auto text-center">
                Create Free Account
              </Link>
            </div>
            <p className="text-[12.5px] text-ink-500">
              Already have an account?{" "}
              <Link href={loginHref} className="accent-link">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}