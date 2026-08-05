"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center py-32 px-8">
      <div className="text-center max-w-[480px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-4">Something went wrong</div>
        <h1 className="font-serif text-[28px] font-medium mb-4">Unexpected error</h1>
        <p className="text-[15px] text-ink-400 mb-8 leading-relaxed">
          An error occurred while loading this page. Please try again — if it keeps happening, the issue may be on our end.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <a href="/" className="btn-secondary">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
