"use client";

import { useEffect, useMemo, useState } from "react";

const CLIENT_ZONES = [
    { label: "US Eastern (New York)", value: "America/New_York" },
    { label: "US Central (Chicago)", value: "America/Chicago" },
    { label: "US Pacific (Los Angeles)", value: "America/Los_Angeles" },
    { label: "UK / London", value: "Europe/London" },
    { label: "Australia Eastern (Sydney)", value: "Australia/Sydney" },
    { label: "Australia Western (Perth)", value: "Australia/Perth" },
    { label: "Canada Eastern (Toronto)", value: "America/Toronto" },
    { label: "United Arab Emirates (Dubai)", value: "Asia/Dubai" },
    { label: "Singapore", value: "Asia/Singapore" },
    { label: "Japan (Tokyo)", value: "Asia/Tokyo" },
];

const fmt = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
});

export default function TimezoneConverter() {
    const [clientZone, setClientZone] = useState("America/New_York");
    const [mode, setMode] = useState<"live" | "manual">("live");
    const [phTime, setPhTime] = useState("");

    // Live clock
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const clientLabel = useMemo(() => {
        return CLIENT_ZONES.find((z) => z.value === clientZone)?.label || clientZone;
    }, [clientZone]);

    const formatFor = (d: Date, zone: string) => {
        try {
            return new Intl.DateTimeFormat("en-PH", {
                timeZone: zone,
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }).format(d);
        } catch {
            return "Invalid timezone";
        }
    };

    const livePh = formatFor(now, "Asia/Manila");
    const liveClient = formatFor(now, clientZone);

    // Manual mode: parse PH time input
    const manualPh = useMemo(() => {
        if (!phTime) return null;
        const d = new Date(`2026-01-01T${phTime}:00+08:00`);
        return isNaN(d.getTime()) ? null : d;
    }, [phTime]);

    const manualClient = manualPh ? formatFor(manualPh, clientZone) : null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PH TIME PANEL */}
            <div className="panel p-8 bg-navy-900 border border-navy-700 rounded-[3px]">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-4">
                    🇵🇭 Philippines Time
                </p>
                <p className="font-mono text-[28px] text-ink-50 leading-tight mb-2">
                    {mode === "live" ? livePh : "—"}
                </p>
                <p className="text-xs text-ink-500 mb-6">Asia/Manila (PHST — no DST)</p>

                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMode("live")}
                            className={`btn-secondary !py-2 !px-4 !text-xs font-mono ${mode === "live" ? "!border-gold-400 !text-gold-300" : ""}`}
                        >
                            LIVE CLOCK
                        </button>
                        <button
                            onClick={() => setMode("manual")}
                            className={`btn-secondary !py-2 !px-4 !text-xs font-mono ${mode === "manual" ? "!border-gold-400 !text-gold-300" : ""}`}
                        >
                            PICK A TIME
                        </button>
                    </div>

                    {mode === "manual" && (
                        <div className="mt-4">
                            <label className="form-label" htmlFor="ph-time">If it's this time in the Philippines...</label>
                            <input
                                id="ph-time"
                                type="time"
                                className="field font-mono text-lg"
                                value={phTime}
                                onChange={(e) => setPhTime(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* CLIENT TIME PANEL */}
            <div className="panel p-8 bg-navy-900 border border-navy-700 rounded-[3px]">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-4">
                    🌍 Client Time
                </p>
                <p className="font-mono text-[28px] text-ink-50 leading-tight mb-2">
                    {mode === "live" ? liveClient : manualClient || "—"}
                </p>
                <p className="text-xs text-ink-500 mb-6">
                    {clientLabel} — automatically handles DST
                </p>

                <div>
                    <label className="form-label" htmlFor="client-zone">Choose the client's timezone</label>
                    <select
                        id="client-zone"
                        className="field bg-navy-900"
                        value={clientZone}
                        onChange={(e) => setClientZone(e.target.value)}
                    >
                        {CLIENT_ZONES.map((z) => (
                            <option key={z.value} value={z.value}>{z.label}</option>
                        ))}
                    </select>
                </div>

                <div className="mt-6 p-4 bg-navy-950 border border-navy-700 rounded-[3px] text-sm text-ink-300">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500 mb-2">
                        Quick check — for US/UK/AU clients
                    </p>
                    <ul className="flex flex-col gap-1.5">
                        <li><span className="text-gold-400">9:00 AM PH</span> = {formatFor(new Date("2026-01-01T09:00:00+08:00"), clientZone)} for the client</li>
                        <li><span className="text-gold-400">12:00 PM PH</span> = {formatFor(new Date("2026-01-01T12:00:00+08:00"), clientZone)} for the client</li>
                        <li><span className="text-gold-400">7:00 PM PH</span> = {formatFor(new Date("2026-01-01T19:00:00+08:00"), clientZone)} for the client</li>
                        <li><span className="text-gold-400">10:00 PM PH</span> = {formatFor(new Date("2026-01-01T22:00:00+08:00"), clientZone)} for the client</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}