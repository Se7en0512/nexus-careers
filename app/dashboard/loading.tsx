export default function DashboardLoading() {
  return (
    <div className="wrap py-14" role="status" aria-label="Loading your dashboard">
      <div className="animate-pulse">
        {/* HERO — greeting + stats */}
        <div className="mb-12">
          <div className="h-[22px] w-40 bg-navy-800 rounded-[3px] mb-3" />
          <div className="h-[15px] w-72 bg-navy-800/60 rounded-[3px] mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="panel p-6">
                <div className="h-[11px] w-24 bg-navy-800/70 rounded-[3px] mb-4" />
                <div className="h-[28px] w-16 bg-navy-800 rounded-[3px]" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 items-start">
          {/* SECTION NAV skeleton */}
          <nav aria-hidden="true" className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[34px] lg:h-7 w-36 lg:w-full bg-navy-800/60 rounded-[3px]" />
            ))}
          </nav>

          {/* MAIN CONTENT skeleton */}
          <div className="flex flex-col gap-10 min-w-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <section key={i} aria-hidden="true">
                <div className="h-[11px] w-44 bg-gold-400/20 rounded-[3px] mb-2" />
                <div className="h-[22px] w-64 bg-navy-800 rounded-[3px] mb-6" />
                <div className="panel p-7">
                  <div className="h-[14px] w-full bg-navy-800/60 rounded-[3px] mb-3" />
                  <div className="h-[14px] w-5/6 bg-navy-800/60 rounded-[3px] mb-3" />
                  <div className="h-[14px] w-2/3 bg-navy-800/60 rounded-[3px]" />
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
