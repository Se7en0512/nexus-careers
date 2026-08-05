"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NICHE_LEARNING } from "@/data/niche-learning";

const PLATFORM_TYPES = ["job_board", "marketplace", "agency"];
const BADGES = ["Free", "Audit", "Trial"];
const COURSE_CATEGORIES = ["Marketing", "Productivity Tools", "Data & Tech", "CRM & Sales", "Career & Freelancing", "Design & Web"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

interface Site {
  id: number;
  name: string;
  url: string;
  category: string;
  description: string;
  platform_type: string;
  niche_tags: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  url: string;
  niche: string;
  description: string;
  rate_range: string;
  client_type: string;
}

interface Course {
  id: number;
  title: string;
  provider: string;
  url: string;
  description: string;
  badge: string;
  category: string;
  difficulty: string;
}

interface FeedbackItem {
  id: number;
  name: string;
  content: string;
  rating: number;
  status: string;
  created_at: string;
}

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  meta: string;
  read: number;
  created_at: string;
}

export default function AdminPanel({
  sites,
  jobs,
  courses,
  feedback,
  notifications,
  config,
}: {
  sites: Site[];
  jobs: Job[];
  courses: Course[];
  feedback: FeedbackItem[];
  notifications: NotificationItem[];
  config: Record<string, string>;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"site" | "job" | "course" | "feedback" | "notifications" | "config">("site");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [site, setSite] = useState({ name: "", url: "", category: "Global Job Board", description: "", platformType: "job_board", nicheTags: "all" });
  const [job, setJob] = useState({ title: "", company: "", url: "", niche: "admin", description: "", rateRange: "", clientType: "" });
  const [course, setCourse] = useState({ title: "", provider: "", url: "", description: "", badge: "Free", category: "Marketing", difficulty: "Beginner" });
  const [siteConfig, setSiteConfig] = useState({ marquee_text: config.marquee_text || "", paypal_link: config.paypal_link || "", gcash_number: config.gcash_number || "" });

  const handleSiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "site",
          ...site,
          nicheTags: site.nicheTags === "all" ? [] : site.nicheTags.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Error");
      setMsg("Platform added.");
      setSite({ ...site, name: "", url: "", description: "" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "job", ...job, rateRange: job.rateRange, clientType: job.clientType }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Error");
      setMsg("Job post added.");
      setJob({ ...job, title: "", url: "", description: "", rateRange: "", clientType: "" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "course", ...course }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Error");
      setMsg("Course added.");
      setCourse({ ...course, title: "", provider: "", url: "", description: "" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (type: string, id: number) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin?type=${type}&id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMsg("Deleted.");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  const setFeedbackStatus = async (id: number, status: string) => {
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "feedback", id, status }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Error");
      setMsg(status === "published" ? "Feedback published." : "Feedback rejected.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const saveConfig = async (key: string, value: string) => {
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "config", key, value }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Error");
      setMsg("Saved.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-2">
        <button
          onClick={() => setTab("site")}
          className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
            tab === "site" ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300" : "border-navy-700 text-ink-400"
          }`}
        >
          Apply Sites
        </button>
        <button
          onClick={() => setTab("job")}
          className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
            tab === "job" ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300" : "border-navy-700 text-ink-400"
          }`}
        >
          Job Posts
        </button>
        <button
          onClick={() => setTab("course")}
          className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
            tab === "course" ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300" : "border-navy-700 text-ink-400"
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setTab("feedback")}
          className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
            tab === "feedback" ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300" : "border-navy-700 text-ink-400"
          }`}
        >
          Feedback
        </button>
        <button
          onClick={() => {
            setTab("notifications");
            const unread = notifications.filter((n) => !n.read).length;
            if (unread > 0) {
              fetch("/api/admin/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "mark_all_read" }),
              }).then(() => router.refresh());
            }
          }}
          className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
            tab === "notifications" ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300" : "border-navy-700 text-ink-400"
          }`}
        >
          Notifications {notifications.filter((n) => !n.read).length > 0 && (
            <span className="ml-1 bg-gold-400 text-navy-950 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("config")}
          className={`font-mono text-[12px] px-4 py-2 rounded-[3px] border transition-colors ${
            tab === "config" ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300" : "border-navy-700 text-ink-400"
          }`}
        >
          Site Config
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
      {msg && <p className="form-note text-gold-300">{msg}</p>}

      {tab === "site" && (
        <form onSubmit={handleSiteSubmit} className="panel p-7 flex flex-col gap-4">
          <h3 className="font-serif font-medium text-[19px]">Add a platform</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="field" placeholder="Name (e.g. Upwork)" value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} required />
            <input className="field" placeholder="URL (https://...)" value={site.url} onChange={(e) => setSite({ ...site, url: e.target.value })} required />
            <input className="field" placeholder="Category (e.g. Global Job Board)" value={site.category} onChange={(e) => setSite({ ...site, category: e.target.value })} required />
            <select className="field" value={site.platformType} onChange={(e) => setSite({ ...site, platformType: e.target.value })}>
              {PLATFORM_TYPES.map((p) => (
                <option key={p} value={p}>{p.replace("_", " ")}</option>
              ))}
            </select>
            <input className="field md:col-span-2" placeholder="Description" value={site.description} onChange={(e) => setSite({ ...site, description: e.target.value })} />
            <input className="field md:col-span-2" placeholder='Niche tags — comma separated (blank = "all")' value={site.nicheTags} onChange={(e) => setSite({ ...site, nicheTags: e.target.value })} />
          </div>
          <button className="btn-primary self-start" disabled={busy}>{busy ? "Saving..." : "Add platform"}</button>
        </form>
      )}

      {tab === "job" && (
        <form onSubmit={handleJobSubmit} className="panel p-7 flex flex-col gap-4">
          <h3 className="font-serif font-medium text-[19px]">Add a job post</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="field" placeholder="Job title" value={job.title} onChange={(e) => setJob({ ...job, title: e.target.value })} required />
            <input className="field" placeholder="Company (optional)" value={job.company} onChange={(e) => setJob({ ...job, company: e.target.value })} />
            <input className="field" placeholder="Application URL" value={job.url} onChange={(e) => setJob({ ...job, url: e.target.value })} required />
            <select className="field" value={job.niche} onChange={(e) => setJob({ ...job, niche: e.target.value })}>
              {NICHE_LEARNING.map((n) => (
                <option key={n.key} value={n.key}>{n.title}</option>
              ))}
            </select>
            <input className="field" placeholder="Rate range (e.g. ₱1,000-₱3,000/hr)" value={job.rateRange} onChange={(e) => setJob({ ...job, rateRange: e.target.value })} />
            <select className="field" value={job.clientType} onChange={(e) => setJob({ ...job, clientType: e.target.value })}>
              <option value="">Client type (optional)</option>
              <option value="agency">Agency</option>
              <option value="direct_client">Direct Client</option>
              <option value="marketplace">Marketplace</option>
            </select>
            <textarea className="field md:col-span-2 min-h-[80px]" placeholder="Description" value={job.description} onChange={(e) => setJob({ ...job, description: e.target.value })} />
          </div>
          <button className="btn-primary self-start" disabled={busy}>{busy ? "Saving..." : "Add job"}</button>
        </form>
      )}

      {tab === "course" && (
        <form onSubmit={handleCourseSubmit} className="panel p-7 flex flex-col gap-4">
          <h3 className="font-serif font-medium text-[19px]">Add a course</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="field" placeholder="Course title" value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} required />
            <input className="field" placeholder="Provider (e.g. Google)" value={course.provider} onChange={(e) => setCourse({ ...course, provider: e.target.value })} required />
            <input className="field md:col-span-2" placeholder="Course URL (https://...)" value={course.url} onChange={(e) => setCourse({ ...course, url: e.target.value })} required />
            <select className="field" value={course.badge} onChange={(e) => setCourse({ ...course, badge: e.target.value })}>
              {BADGES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select className="field" value={course.category} onChange={(e) => setCourse({ ...course, category: e.target.value })}>
              {COURSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select className="field" value={course.difficulty} onChange={(e) => setCourse({ ...course, difficulty: e.target.value })}>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <textarea className="field md:col-span-2 min-h-[80px]" placeholder="Description" value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
          </div>
          <button className="btn-primary self-start" disabled={busy}>{busy ? "Saving..." : "Add course"}</button>
        </form>
      )}

      {tab === "config" && (
        <div className="panel p-7 flex flex-col gap-5">
          <h3 className="font-serif font-medium text-[19px]">Site Configuration</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="form-label">Marquee Text (scrolling announcement bar)</label>
              <div className="flex gap-2">
                <input
                  className="field flex-1"
                  value={siteConfig.marquee_text}
                  onChange={(e) => setSiteConfig({ ...siteConfig, marquee_text: e.target.value })}
                  placeholder="Welcome message..."
                />
                <button onClick={() => saveConfig("marquee_text", siteConfig.marquee_text)} disabled={busy} className="btn-primary !px-4">
                  Save
                </button>
              </div>
            </div>
            <div>
              <label className="form-label">PayPal.me Link</label>
              <div className="flex gap-2">
                <input
                  className="field flex-1"
                  value={siteConfig.paypal_link}
                  onChange={(e) => setSiteConfig({ ...siteConfig, paypal_link: e.target.value })}
                  placeholder="https://paypal.me/YourUsername"
                />
                <button onClick={() => saveConfig("paypal_link", siteConfig.paypal_link)} disabled={busy} className="btn-primary !px-4">
                  Save
                </button>
              </div>
            </div>
            <div>
              <label className="form-label">GCash Number (shown as QR only, not as text)</label>
              <div className="flex gap-2">
                <input
                  className="field flex-1"
                  type="tel"
                  value={siteConfig.gcash_number}
                  onChange={(e) => setSiteConfig({ ...siteConfig, gcash_number: e.target.value })}
                  placeholder="09XXXXXXXXX"
                />
                <button onClick={() => saveConfig("gcash_number", siteConfig.gcash_number)} disabled={busy} className="btn-primary !px-4">
                  Save
                </button>
              </div>
              <p className="text-[11px] text-ink-500 mt-1">Number is encoded in QR code only — never displayed as readable text on the site.</p>
            </div>
          </div>
        </div>
      )}

      <section className="flex flex-col gap-2">
        <h3 className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-gold-400 mb-1">
          {tab === "site" ? `Platforms (${sites.length})` : tab === "job" ? `Job posts (${jobs.length})` : tab === "course" ? `Courses (${courses.length})` : tab === "notifications" ? `Notifications (${notifications.length})` : `Feedback (${feedback.length})`}
        </h3>
        {tab === "notifications" ? (
          notifications.length === 0 ? (
            <p className="panel p-8 text-center text-ink-500 text-[14px]">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`panel p-4 flex flex-col gap-1.5 ${!n.read ? "border-gold-400/30 bg-navy-800" : ""}`}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[13px] font-medium">
                    {n.type === "signup" ? "👤" : "🔔"} {n.title}
                  </p>
                  <div className="flex items-center gap-3">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" />}
                    <p className="text-[11px] text-ink-500 flex-shrink-0">
                      {new Date(n.created_at + "Z").toLocaleString("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <p className="text-[13px] text-ink-300">{n.message}</p>
              </div>
            ))
          )
        ) : tab === "feedback" ? (
          feedback.map((item) => (
            <div key={item.id} className="panel p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[13px] font-medium">
                  {item.name} <span className="text-gold-400">{"★".repeat(item.rating)}</span>{" "}
                  <span className={`font-mono text-[10.5px] uppercase tracking-wider ${item.status === "pending" ? "text-amber-400" : "text-ink-500"}`}>
                    · {item.status}
                  </span>
                </p>
                <p className="text-[11px] text-ink-500 flex-shrink-0">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <p className="text-[13px] text-ink-300">{item.content}</p>
              <div className="flex gap-2 mt-1">
                {item.status !== "published" && (
                  <button onClick={() => setFeedbackStatus(item.id, "published")} disabled={busy} className="btn-primary !py-[8px] !px-[14px] !text-[12px]">
                    Publish
                  </button>
                )}
                {item.status !== "rejected" && (
                  <button onClick={() => setFeedbackStatus(item.id, "rejected")} disabled={busy} className="btn-danger !py-[8px] !px-[14px] !text-[12px]">
                    Reject
                  </button>
                )}
                <button onClick={() => remove("feedback", item.id)} disabled={busy} className="btn-danger !py-[8px] !px-[14px] !text-[12px]">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          (tab === "site" ? sites : tab === "job" ? jobs : courses).map((item) => (
            <div key={item.id} className="panel p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[14px] font-medium truncate">
                  {tab === "site" ? (item as Site).name : tab === "job" ? (item as Job).title : (item as Course).title}
                </p>
                <p className="text-[12px] text-ink-500 truncate">
                  {tab === "site" ? (item as Site).url : tab === "job" ? `${(item as Job).company || "Remote"} · ${(item as Job).url}` : `${(item as Course).provider} · ${(item as Course).badge} · ${(item as Course).category}`}
                </p>
              </div>
              <button onClick={() => remove(tab === "site" ? "site" : tab === "job" ? "job" : "course", item.id)} disabled={busy} className="btn-danger !py-[8px] !px-[14px] !text-[12px] flex-shrink-0">
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
