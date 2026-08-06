"use client";

import { useEffect, useState } from "react";

interface Stats {
  online: number;
  totalUsers: number;
  todayViews: number;
  weekViews: number;
  totalViews: number;
  todayVisitors: number;
  topPages: Array<{ path: string; views: number }>;
}

export default function LiveDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return <div className="panel p-6 text-center text-ink-500 text-[13px]">Loading dashboard...</div>;
  }

  if (!stats) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-serif font-medium text-[19px]">Live Dashboard</h3>

      {/* Main stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="panel p-4 flex flex-col gap-1">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Online Now
          </span>
          <p className="font-serif text-[28px] font-medium text-green-400">{stats.online}</p>
        </div>
        <div className="panel p-4 flex flex-col gap-1">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500">Today&apos;s Views</span>
          <p className="font-serif text-[28px] font-medium text-gold-400">{stats.todayViews}</p>
        </div>
        <div className="panel p-4 flex flex-col gap-1">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500">Today&apos;s Visitors</span>
          <p className="font-serif text-[28px] font-medium text-gold-400">{stats.todayVisitors}</p>
        </div>
        <div className="panel p-4 flex flex-col gap-1">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500">Total Users</span>
          <p className="font-serif text-[28px] font-medium text-gold-400">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="panel p-4 flex flex-col gap-1">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500">This Week Views</span>
          <p className="font-serif text-[22px] font-medium text-ink-50">{stats.weekViews}</p>
        </div>
        <div className="panel p-4 flex flex-col gap-1">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500">Total Views</span>
          <p className="font-serif text-[22px] font-medium text-ink-50">{stats.totalViews}</p>
        </div>
      </div>

      {/* Top pages */}
      {stats.topPages.length > 0 && (
        <div className="panel p-4 flex flex-col gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500">Top Pages Today</span>
          {stats.topPages.map((page, i) => (
            <div key={i} className="flex items-center justify-between text-[13px]">
              <span className="text-ink-300 font-mono truncate">{page.path}</span>
              <span className="text-gold-400 font-medium">{page.views}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-ink-500 text-center">Auto-refreshes every 15 seconds</p>
    </div>
  );
}
