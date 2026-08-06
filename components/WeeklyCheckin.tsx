"use client";

import { useState } from "react";
import Button from "@/components/Button";

interface WeeklyCheckinProps {
    initialApps: number;
    streak: number;
    checkedIn: boolean;
}

export default function WeeklyCheckin({ initialApps, streak, checkedIn }: WeeklyCheckinProps) {
    const [applicationsSent, setApplicationsSent] = useState(initialApps > 0 ? initialApps : "");
    const [note, setNote] = useState("");
    const [saved, setSaved] = useState(checkedIn);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const n = parseInt(String(applicationsSent), 10);
        if (isNaN(n) || n < 0) return setError("Enter a valid number of applications sent.");

        setBusy(true);
        try {
            const res = await fetch("/api/checkins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applications_sent: n, note }),
            });
            if (!res.ok) {
                const d = await res.json().catch(() => null);
                throw new Error(d?.error || "Failed to save check-in.");
            }
            setSaved(true);
        } catch (e: any) {
            setError(e.message || "Failed to save check-in.");
        } finally {
            setBusy(false);
        }
    };

    if (saved) {
        return (
            <div className="panel p-7 border border-green-400/30 bg-green-400/5 rounded-[3px]">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-green-400 mb-3">
                    ✅ You've checked in for this week
                </p>
                <p className="text-[14px] text-ink-200">
                    Great job! Keep the momentum going — come back next Monday to maintain your weekly streak.
                </p>
                {streak > 0 && (
                    <p className="font-mono text-sm text-gold-400 mt-3">
                        🔥 {streak}-week weekly check-in streak
                    </p>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="panel p-7 border border-navy-700 rounded-[3px]">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-1">
                Weekly Check-In
            </p>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-green-400 mb-3">
                🔥 {streak > 0 ? `${streak}-week streak (weekly)` : "Start your weekly streak"}
            </p>

            <label className="form-label" htmlFor="checkin-apps">
                How many jobs did you apply to this week?
            </label>
            <input
                id="checkin-apps"
                type="number"
                min={0}
                className="field mb-4"
                placeholder="e.g. 5"
                value={applicationsSent}
                onChange={(e) => setApplicationsSent(e.target.value)}
            />

            <label className="form-label" htmlFor="checkin-note">
                Short note (optional)
            </label>
            <textarea
                id="checkin-note"
                className="field min-h-[60px] mb-4"
                placeholder="e.g. 3 interviews, 2 follow-ups sent"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />

            {error && <p className="text-xs text-red-400 font-mono mb-3">{error}</p>}

            <Button type="submit" loading={busy} className="!py-2.5 !px-5 !text-xs font-mono">
                SAVE CHECK-IN
            </Button>
        </form>
    );
}