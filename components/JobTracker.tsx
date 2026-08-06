"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";

export interface JobApplication {
  id: number;
  company: string;
  role: string;
  platform: string;
  status: "applied" | "interviewing" | "offered" | "rejected" | "ghosted";
  applied_date: string;
  source_url: string;
  follow_up_date: string | null;
  notes: string;
}

interface JobTrackerProps {
  initialApplications: JobApplication[];
  isGuest: boolean;
}

const PLATFORMS = [
  "OnlineJobs.ph",
  "Upwork",
  "LinkedIn",
  "Indeed",
  "Freelancer.com",
  "Fiverr",
  "Agency (Athena/Wing/etc.)",
  "Cold Outreach",
  "Other",
];

const STATUSES: { value: JobApplication["status"]; label: string; bg: string; text: string }[] = [
  { value: "applied", label: "Applied", bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa" },
  { value: "interviewing", label: "Interviewing", bg: "rgba(217, 169, 78, 0.15)", text: "#efcb80" },
  { value: "offered", label: "Offered", bg: "rgba(16, 185, 129, 0.15)", text: "#34d399" },
  { value: "rejected", label: "Rejected", bg: "rgba(217, 126, 107, 0.15)", text: "#f87171" },
  { value: "ghosted", label: "Ghosted", bg: "rgba(136, 145, 166, 0.15)", text: "#9ca3af" },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function JobTracker({ initialApplications = [], isGuest }: JobTrackerProps) {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [platform, setPlatform] = useState("OnlineJobs.ph");
  const [customPlatform, setCustomPlatform] = useState("");
  const [status, setStatus] = useState<JobApplication["status"]>("applied");
  const [appliedDate, setAppliedDate] = useState(todayStr);
  const [sourceUrl, setSourceUrl] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isGuest) {
      const stored = localStorage.getItem("nexus_job_applications");
      if (stored) {
        try {
          setApps(JSON.parse(stored));
        } catch {
          setApps([]);
        }
      } else {
        setApps(initialApplications);
      }
    } else {
      setApps(initialApplications);
    }
    setLoading(false);
  }, [initialApplications, isGuest]);

  const saveLocal = (updatedApps: JobApplication[]) => {
    localStorage.setItem("nexus_job_applications", JSON.stringify(updatedApps));
  };

  const handleResetForm = () => {
    setCompany("");
    setRole("");
    setPlatform("OnlineJobs.ph");
    setCustomPlatform("");
    setStatus("applied");
    setAppliedDate(todayStr());
    setSourceUrl("");
    setFollowUpDate("");
    setNotes("");
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const actualPlatform = platform === "Other" ? customPlatform.trim() : platform;

    if (!company.trim()) return setError("Company name is required.");
    if (!role.trim()) return setError("Role is required.");
    if (!actualPlatform.trim()) return setError("Platform is required.");

    const payload = {
      company: company.trim(),
      role: role.trim(),
      platform: actualPlatform,
      status,
      applied_date: appliedDate,
      source_url: sourceUrl.trim(),
      follow_up_date: followUpDate || null,
      notes: notes.trim(),
    };

    if (isGuest) {
      let updated: JobApplication[];
      if (editingId !== null) {
        updated = apps.map((a) => (a.id === editingId ? { ...a, ...payload, follow_up_date: payload.follow_up_date } : a));
      } else {
        const newApp: JobApplication = {
          id: Date.now(),
          ...payload,
        };
        updated = [newApp, ...apps];
      }
      setApps(updated);
      saveLocal(updated);
      handleResetForm();
    } else {
      try {
        const url = editingId !== null ? `/api/tracker/${editingId}` : "/api/tracker";
        const method = editingId !== null ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");

        if (editingId !== null) {
          setApps(apps.map((a) => (a.id === editingId ? { ...a, ...payload } : a)));
        } else {
          setApps([data.application, ...apps]);
        }
        handleResetForm();
      } catch (err: any) {
        setError(err.message || "Failed to save. Try again.");
      }
    }
  };

  const handleEdit = (app: JobApplication) => {
    setEditingId(app.id);
    setCompany(app.company);
    setRole(app.role);
    if (PLATFORMS.includes(app.platform)) {
      setPlatform(app.platform);
      setCustomPlatform("");
    } else {
      setPlatform("Other");
      setCustomPlatform(app.platform);
    }
    setStatus(app.status);
    setAppliedDate(app.applied_date);
    setSourceUrl(app.source_url || "");
    setFollowUpDate(app.follow_up_date || "");
    setNotes(app.notes);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    if (isGuest) {
      const updated = apps.filter((a) => a.id !== id);
      setApps(updated);
      saveLocal(updated);
    } else {
      try {
        const res = await fetch(`/api/tracker/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        setApps(apps.filter((a) => a.id !== id));
      } catch {
        alert("Failed to delete application.");
      }
    }
  };

  const stats = {
    total: apps.length,
    applied: apps.filter((a) => a.status === "applied").length,
    interviewing: apps.filter((a) => a.status === "interviewing").length,
    offered: apps.filter((a) => a.status === "offered").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
    ghosted: apps.filter((a) => a.status === "ghosted").length,
  };

  if (loading) {
    return <p className="font-mono text-sm text-ink-500">Loading Job Tracker...</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {isGuest && (
        <div className="p-4 bg-gold-400/10 border border-gold-400/30 rounded-[3px] text-sm text-ink-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p>
            💡 <strong>Guest Mode:</strong> Data is only saved on this browser.{" "}
            <Link href="/signup?next=/tools/tracker" className="text-gold-300 font-semibold underline hover:text-gold-400 transition-colors">
              Create a free account
            </Link>{" "}
            to sync to the cloud and access anywhere!
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-navy-700 border border-navy-700">
        {[
          { label: "Total Applications", val: stats.total, color: "text-ink-50" },
          { label: "Active (Applied)", val: stats.applied, color: "text-blue-400" },
          { label: "Interviewing", val: stats.interviewing, color: "text-gold-300" },
          { label: "Offers Received", val: stats.offered, color: "text-green-400 font-bold" },
          { label: "Inactive (Ghost/No)", val: stats.ghosted + stats.rejected, color: "text-ink-500" },
        ].map((s, idx) => (
          <div key={idx} className="bg-navy-900 p-5 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-500 mb-1">{s.label}</p>
            <p className={`font-mono text-2xl ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="font-serif font-medium text-2xl mb-0">Job Applications</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary !py-2.5 !px-5 !text-xs font-mono">
            + Add Application
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel p-6 border border-navy-600 bg-navy-900 rounded-[3px] max-w-[800px] flex flex-col gap-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-2">
            {editingId !== null ? "Edit Application" : "New Application"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="company">Company / Client Name</label>
              <input
                id="company"
                type="text"
                className="field"
                placeholder="e.g. Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="role">Role / Position</label>
              <input
                id="role"
                type="text"
                className="field"
                placeholder="e.g. Administrative Assistant"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label" htmlFor="platform">Platform</label>
              <select
                id="platform"
                className="field bg-navy-900"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            {platform === "Other" && (
              <div>
                <label className="form-label" htmlFor="custom-platform">Custom Platform</label>
                <input
                  id="custom-platform"
                  type="text"
                  className="field"
                  placeholder="e.g. Email Outreach"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                className="field bg-navy-900"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="date">Date Applied</label>
              <input
                id="date"
                type="date"
                className="field"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="source-url">Job Post URL / Source Link</label>
              <input
                id="source-url"
                type="url"
                className="field"
                placeholder="https://www.onlinejobs.ph/jobs/..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="follow-up">Follow-Up Date</label>
              <input
                id="follow-up"
                type="date"
                className="field"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="notes">Notes / Observations (Scam indicators, interview status, etc.)</label>
            <textarea
              id="notes"
              className="field min-h-[80px]"
              placeholder="e.g. Sent sample file. Re-verified client domain. No upfront fee requested."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && <p className="text-xs text-red-400 font-mono">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="submit" className="btn-primary !py-2.5 !px-5 !text-xs font-mono">
              {editingId !== null ? "Save Changes" : "Save Application"}
            </button>
            <button type="button" onClick={handleResetForm} className="btn-secondary !py-2.5 !px-5 !text-xs font-mono">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="panel border border-navy-700 rounded-[3px]">
        {apps.length === 0 ? (
          <EmptyState
            icon="📤"
            title="No tracked applications yet"
            description="Click &quot;+ Add Application&quot; to start tracking where you've applied."
            variant="motivational"
          />
        ) : (
          <>
            {/* Mobile card layout */}
            <div className="md:hidden flex flex-col">
              {apps.map((app) => {
                const s = STATUSES.find((item) => item.value === app.status) || STATUSES[0];
                const isOverdue = app.follow_up_date && app.follow_up_date < todayStr();
                return (
                  <div key={app.id} className="p-5 border-b border-navy-800 last:border-b-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink-50 truncate">{app.company}</p>
                        <p className="text-[13px] text-ink-300 truncate">{app.role}</p>
                      </div>
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
                        style={{ backgroundColor: s.bg, color: s.text }}
                      >
                        {s.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-500 font-mono mb-2">
                      <span>{app.applied_date}</span>
                      <span>{app.platform}</span>
                      {app.follow_up_date && (
                        <span className={isOverdue ? "text-red-400" : ""}>
                          {isOverdue ? "! " : ""}Follow-up: {app.follow_up_date}
                        </span>
                      )}
                    </div>
                    {app.notes && <p className="text-[12px] text-ink-400 truncate mb-2" title={app.notes}>{app.notes}</p>}
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(app)} className="text-[11px] font-mono text-gold-400 hover:text-gold-300">[Edit]</button>
                      <button onClick={() => handleDelete(app.id)} className="text-[11px] font-mono text-red-400 hover:text-red-300">[Delete]</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-[13.5px]">
                <thead>
                  <tr className="bg-navy-950 border-b border-navy-700 font-mono text-[11px] uppercase tracking-wider text-ink-500">
                    <th className="p-4 pl-6">Date</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Platform</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Follow-Up</th>
                    <th className="p-4">Notes</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => {
                    const s = STATUSES.find((item) => item.value === app.status) || STATUSES[0];
                    const isOverdue = app.follow_up_date && app.follow_up_date < todayStr();
                    return (
                      <tr key={app.id} className="border-b border-navy-800 hover:bg-navy-900/50 transition-colors">
                        <td className="p-4 pl-6 font-mono text-ink-300">{app.applied_date}</td>
                        <td className="p-4 font-semibold text-ink-50">{app.company}</td>
                        <td className="p-4 text-ink-100">{app.role}</td>
                        <td className="p-4 text-ink-300">{app.platform}</td>
                        <td className="p-4">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: s.bg, color: s.text }}
                          >
                            {s.label}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {app.follow_up_date ? (
                            <span
                              className={`font-mono text-xs ${isOverdue ? "text-red-400" : "text-ink-300"}`}
                              title={isOverdue ? "Overdue — follow up now!" : "Follow-up date"}
                            >
                              {isOverdue ? "!" : ""}
                              {app.follow_up_date}
                            </span>
                          ) : (
                            <em className="text-ink-600 font-mono">—</em>
                          )}
                        </td>
                        <td className="p-4 text-ink-400 max-w-[200px] truncate" title={app.notes}>
                          {app.notes || <em className="text-ink-600 font-mono">—</em>}
                        </td>
                        <td className="p-4 pr-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(app)}
                            className="text-xs font-mono text-gold-400 hover:text-gold-300 mr-4 transition-colors"
                          >
                            [Edit]
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors"
                          >
                            [Delete]
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}