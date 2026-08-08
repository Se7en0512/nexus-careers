"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Announcement {
  id: number;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export default function AnnouncementBell() {
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(Array.isArray(data.announcements) ? data.announcements : []);
      }
    } catch {
      // non-critical
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const unreadCount = announcements.filter((a) => !a.read).length;

  const markRead = async (id: number) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    try {
      await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", id }),
      });
    } catch {
      // non-critical
    }
  };

  const markAllRead = async () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })));
    try {
      await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
      });
    } catch {
      // non-critical
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Announcements${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
        className="relative nav-link"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-gold-400 text-navy-950 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] w-[320px] max-w-[85vw] bg-navy-900 border border-navy-700 rounded-[3px] shadow-2xl z-50">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-navy-700">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400">Updates</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="font-mono text-[10.5px] uppercase tracking-wider text-ink-500 hover:text-gold-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {loading ? (
              <p className="px-5 py-6 text-[12.5px] text-ink-500 text-center">Loading updates...</p>
            ) : announcements.length === 0 ? (
              <p className="px-5 py-6 text-[12.5px] text-ink-500 text-center">
                No updates yet — anything new will show up here.
              </p>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className={`px-5 py-4 border-b border-navy-800 flex flex-col gap-1.5 ${!a.read ? "bg-navy-800/60" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] font-medium leading-snug">{a.title}</p>
                    {!a.read && (
                      <button
                        type="button"
                        onClick={() => markRead(a.id)}
                        className="font-mono text-[10px] uppercase tracking-wider text-ink-500 hover:text-gold-300 transition-colors flex-shrink-0 mt-0.5"
                      >
                        Read
                      </button>
                    )}
                  </div>
                  <p className="text-[12.5px] text-ink-400 leading-relaxed whitespace-pre-line">{a.message}</p>
                  <p className="text-[10.5px] text-ink-500">
                    {new Date(a.created_at + "Z").toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}