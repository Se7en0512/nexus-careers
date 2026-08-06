"use client";

import { useState } from "react";

const GOAL_OPTIONS = [
  { value: "first_client", label: "Get my first client" },
  { value: "learn_skills", label: "Learn new VA skills" },
  { value: "resume", label: "Build a professional resume" },
  { value: "portfolio", label: "Improve my portfolio" },
  { value: "interviews", label: "Practice interviews" },
  { value: "earn_more", label: "Earn more as a VA" },
];

export default function AccountSettings({
  name,
  email,
  updatesOptIn,
  mainGoal,
}: {
  name: string;
  email: string;
  updatesOptIn: boolean;
  mainGoal?: string;
}) {
  const [displayName, setDisplayName] = useState(name);
  const [updatesOptInState, setUpdatesOptInState] = useState(updatesOptIn);
  const [goal, setGoal] = useState(mainGoal || "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const show = (ok: string, e = "") => {
    setMsg(ok);
    setErr(e);
  };

  const saveProfile = async () => {
    setBusy(true);
    setErr("");
    setMsg("");
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      show("Name saved.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const toggleUpdates = async (v: boolean) => {
    setUpdatesOptInState(v);
    setErr("");
    setMsg("");
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates_opt_in: v }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      show(v ? "You're subscribed to updates." : "Updates turned off.");
    } catch (e) {
      setUpdatesOptInState(!v);
      setErr(e instanceof Error ? e.message : "Error");
    }
  };

  const saveGoal = async () => {
    setBusy(true);
    setErr("");
    setMsg("");
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ main_goal: goal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      show("Goal updated.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const changePassword = async () => {
    setBusy(true);
    setErr("");
    setMsg("");
    try {
      const res = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", current_password: currentPw, new_password: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setCurrentPw("");
      setNewPw("");
      show("Password changed.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const [reason, setReason] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const requestDelete = async () => {
    setBusy(true);
    setDeleteMsg("");
    try {
      const res = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_request", reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setDeleteMsg("Your request has been submitted — we'll process it manually within 7 days.");
    } catch (e) {
      setDeleteMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-gold-400 mb-4">Profile</h3>
        <div className="flex flex-col sm:flex-row gap-3 max-w-[520px]">
<input className="field" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Name" />
          <button onClick={saveProfile} disabled={busy} className="btn-secondary !py-[12px] !px-[18px] !text-[12.5px] whitespace-nowrap">
            Save
          </button>
        </div>
        <p className="font-mono text-[11.5px] text-ink-500 mt-2">Email (can't be changed): {email}</p>
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-gold-400 mb-4">Career Goal</h3>
        <p className="text-[13px] text-ink-500 mb-3">Your current goal drives personalized recommendations.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-[520px]">
          {GOAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setGoal(opt.value)}
              className={`text-left p-3 rounded-[3px] border text-[13px] transition-colors ${
                goal === opt.value
                  ? "border-gold-400 bg-gold-400/10 text-ink-50"
                  : "border-navy-700 bg-navy-900 text-ink-500 hover:border-navy-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  goal === opt.value ? "border-gold-400" : "border-navy-600"
                }`}>
                  {goal === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
                </div>
                {opt.label}
              </div>
            </button>
          ))}
        </div>
        {goal !== mainGoal && (
          <button onClick={saveGoal} disabled={busy} className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px] mt-3">
            Save Goal
          </button>
        )}
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-gold-400 mb-4">Notifications</h3>
        <label className="flex items-center gap-3 border border-navy-700 rounded-[3px] px-4 py-3.5 cursor-pointer max-w-[520px]">
          <input
            type="checkbox"
            checked={updatesOptInState}
            onChange={(e) => toggleUpdates(e.target.checked)}
            className="accent-[#D9A94E] w-4 h-4"
          />
          <span>
            <span className="block text-[13.5px] font-medium">Receive updates</span>
            <span className="block text-[12px] text-ink-500">New free courses, tips, and community news.</span>
          </span>
        </label>
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-gold-400 mb-4">Change Password</h3>
        <div className="flex flex-col gap-3 max-w-[520px]">
          <input type="password" className="field" placeholder="Current password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
          <input type="password" className="field" placeholder="New password (8+ characters, letters + numbers)" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
          <button onClick={changePassword} disabled={busy} className="btn-secondary !py-[12px] !px-[18px] !text-[12.5px] self-start">
            Change Password
          </button>
        </div>
      </div>

      {msg && <p className="text-[13px] text-gold-300">{msg}</p>}
      {err && <p className="form-error">{err}</p>}

      <div className="border-t border-navy-700 pt-6">
        <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-red-400 mb-4">Delete My Data</h3>
        <p className="text-[13px] text-ink-500 max-w-[520px] mb-3">
          Under the Philippine Data Privacy Act, you may request the deletion of your account
          and all your data. The process is manual in this first version — we'll process it
          within 7 days.
        </p>
        <textarea
          className="field max-w-[520px] min-h-[70px]"
          placeholder="(Optional) Tell us why — it helps us improve"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <button
          onClick={requestDelete}
          disabled={busy}
          className="btn-danger !py-[10px] !px-[16px] !text-[12.5px] mt-3 block"
        >
          Request Account Deletion
        </button>
        {deleteMsg && <p className="text-[13px] text-gold-300 mt-3">{deleteMsg}</p>}
      </div>
    </div>
  );
}
