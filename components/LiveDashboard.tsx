"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";

interface Stats {
  online: number;
  totalUsers: number;
  todayViews: number;
  weekViews: number;
  totalViews: number;
  todayVisitors: number;
  topPages: Array<{ path: string; views: number }>;
  dailyTrend: Array<{ day: string; views: number }>;
  yesterdayViews: number;
  yesterdayVisitors: number;
}

function TrendBadge({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) {
    return <span className="font-mono text-[11px] text-ink-500">New</span>;
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) {
    return <span className="font-mono text-[11px] text-ink-500">—</span>;
  }
  if (pct > 0) {
    return <span className="font-mono text-[11px] text-green-400">▲ {pct}%</span>;
  }
  return <span className="font-mono text-[11px] text-red-400">▼ {Math.abs(pct)}%</span>;
}

function StatNumber({ value }: { value: number }) {
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value !== prevRef.current) {
      prevRef.current = value;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        flash ? "opacity-30 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {value}
    </span>
  );
}

const dayLabel = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short" });

function Icon({ d, extra }: { d: string; extra?: ReactNode }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0"
      aria-hidden="true"
    >
      <path d={d} />
      {extra}
    </svg>
  );
}

const PULSE_ICON = "M22 12h-4l-3 9L9 3l-3 9H2";
const EYE_ICON = "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z";
const PERSON_ICON = "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2";
const USERS_ICON = "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2";

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

  const topViews = stats.topPages.length > 0 ? stats.topPages[0].views : 1;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-serif font-medium text-[19px]">Live Dashboard</h3>

      {/* ONLINE NOW — the primary live number */}
      <div className="panel p-6 flex flex-col gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500 flex items-center gap-2">
          <Icon d={PULSE_ICON} />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          Online Now
        </span>
        <div className="flex items-end gap-3 flex-wrap">
          <p className="font-serif text-[42px] font-medium text-green-400 leading-none">
            <StatNumber value={stats.online} />
          </p>
          <p className="text-[12px] text-ink-500 pb-1">people on Thrive right now</p>
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="panel p-4 flex flex-col gap-1">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500 flex items-center gap-1.5">
            <Icon d={EYE_ICON} />
            Today&apos;s Views
          </span>
          <div className="flex items-baseline gap-2">
            <p className="font-serif text-[28px] font-medium text-gold-400">
              <StatNumber value={stats.todayViews} />
            </p>
            <TrendBadge current={stats.todayViews} previous={stats.yesterdayViews} />
          </div>
        </div>
        <div className="panel p-4 flex flex-col gap-1">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500 flex items-center gap-1.5">
            <Icon d={PERSON_ICON} />
            Today&apos;s Visitors
          </span>
          <div className="flex items-baseline gap-2">
            <p className="font-serif text-[28px] font-medium text-gold-400">
              <StatNumber value={stats.todayVisitors} />
            </p>
            <TrendBadge current={stats.todayVisitors} previous={stats.yesterdayVisitors} />
          </div>
        </div>
        <div className="panel p-4 flex flex-col gap-1">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500 flex items-center gap-1.5">
            <Icon d={USERS_ICON} />
            Total Users
          </span>
          <p className="font-serif text-[28px] font-medium text-gold-400">
            <StatNumber value={stats.totalUsers} />
          </p>
        </div>
        <div className="panel p-4 flex flex-col gap-1">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500 flex items-center gap-1.5">
            <Icon d={EYE_ICON} />
            Total Views
          </span>
          <p className="font-serif text-[28px] font-medium text-gold-400">
            <StatNumber value={stats.totalViews} />
          </p>
        </div>
      </div>

      {/* Trend chart */}
      <div className="panel p-4 flex flex-col gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500">7-Day Views</span>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={stats.dailyTrend} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="trendGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d9a94e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#d9a94e" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tickFormatter={dayLabel}
              tick={{ fill: "#8891a6", fontSize: 10, fontFamily: "IBM Plex Mono, monospace" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <Tooltip
              formatter={(value) => [`${value} views`, ""]}
              labelFormatter={(label) => dayLabel(String(label))}
              contentStyle={{
                background: "#0b1220",
                border: "1px solid #1c2a47",
                borderRadius: 3,
                fontSize: 11,
                color: "#eef0f5",
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#d9a94e"
              strokeWidth={1.5}
              fill="url(#trendGold)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-[11px] text-ink-500">
          This week: <StatNumber value={stats.weekViews} /> views
        </p>
      </div>

      {/* Top pages today */}
      {stats.topPages.length > 0 && (
        <div className="panel p-4 flex flex-col gap-1.5">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500">Top Pages Today</span>
          {stats.topPages.map((page, i) => (
            <div key={i} className="relative flex items-center justify-between gap-4 px-3 py-1.5 rounded-[3px] overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 z-0 ${i === 0 ? "bg-[var(--gold-dim)]" : "bg-[rgba(217,169,78,0.07)]"}`}
                style={{ width: `${(page.views / topViews) * 100}%` }}
                aria-hidden="true"
              />
              <span className="relative z-[1] text-ink-300 font-mono text-[13px] truncate">{page.path}</span>
              <span className="relative z-[1] text-gold-400 font-medium flex-shrink-0">{page.views}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-ink-500 text-center">Auto-refreshes every 15 seconds</p>
    </div>
  );
}