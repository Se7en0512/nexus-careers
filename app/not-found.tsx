import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-32 px-8">
      <div className="text-center max-w-[480px]">
        <div className="font-mono text-[48px] font-semibold text-gold-400 mb-4">404</div>
        <h1 className="font-serif text-[28px] font-medium mb-4">Page not found</h1>
        <p className="text-[15px] text-ink-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or head back to the homepage.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link href="/get-started" className="btn-secondary">
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
