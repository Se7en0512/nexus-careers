"use client";

import { useState } from "react";

interface Question {
  id: string;
  q: string;
  options: { label: string; score: number }[];
}

const EQUIPMENT_QUESTIONS: Question[] = [
  {
    id: "laptop",
    q: "What kind of laptop do you have?",
    options: [
      { label: "No laptop yet", score: 0 },
      { label: "Old/second-hand — works but slow", score: 1 },
      { label: "Decent laptop — handles video calls fine", score: 2 },
      { label: "Good laptop — fast, reliable, enough RAM", score: 3 },
    ],
  },
  {
    id: "internet",
    q: "What's your internet setup?",
    options: [
      { label: "Mobile data only — unstable", score: 0 },
      { label: "Fiber 35 Mbps or similar", score: 2 },
      { label: "Fiber 100 Mbps or faster", score: 3 },
      { label: "Dual connection (fiber + mobile backup)", score: 4 },
    ],
  },
  {
    id: "headset",
    q: "What do you use for calls?",
    options: [
      { label: "No headset — using laptop mic/speaker", score: 0 },
      { label: "Basic headset — okay but sometimes echoey", score: 1 },
      { label: "Good headset — clear audio, noise isolation", score: 3 },
      { label: "Noise-cancelling headset — professional quality", score: 4 },
    ],
  },
  {
    id: "camera",
    q: "How's your video setup?",
    options: [
      { label: "No webcam — using laptop camera (blurry)", score: 0 },
      { label: "Laptop camera — okay in good lighting", score: 1 },
      { label: "External webcam — 1080p, clear", score: 3 },
      { label: "External webcam + ring light or good window light", score: 4 },
    ],
  },
  {
    id: "power",
    q: "What about power backup?",
    options: [
      { label: "No backup — power outages kill my work", score: 0 },
      { label: "UPS or AVR — keeps me going during brownouts", score: 3 },
      { label: "UPS + backup internet (mobile data)", score: 4 },
    ],
  },
];

interface VerificationStep {
  key: string;
  label: string;
  icon: string;
  desc: string;
  pct: number;
  action: string;
  href: string;
}

const VERIFICATION_STEPS: VerificationStep[] = [
  {
    key: "id",
    label: "Primary ID + Documents",
    icon: "🪪",
    desc: "Submit your primary government ID for verification",
    pct: 12.5,
    action: "Submit ID →",
    href: "#",
  },
  {
    key: "english",
    label: "English Exam Completed",
    icon: "🗣️",
    desc: "Take the free EF SET 50-minute test (choose 'EF SET 50' — NOT the 90-min version) and save your score",
    pct: 12.5,
    action: "Take EF SET 50 (50 min) →",
    href: "https://www.efset.org/ef-set-50/",
  },
  {
    key: "resume",
    label: "Resume / CV Upload",
    icon: "✅",
    desc: "Upload your resume or CV (PDF or Word, max 10MB) so employers can review your experience",
    pct: 12.5,
    action: "Upload Resume →",
    href: "#",
  },
  {
    key: "portfolio",
    label: "Portfolio Website Live",
    icon: "🌐",
    desc: "Paste your portfolio link — Rene AI, Canva, Behance, personal site, or any live portfolio URL",
    pct: 12.5,
    action: "View Rene AI Portfolio →",
    href: "#",
  },
  {
    key: "video",
    label: "Introduction Video Uploaded",
    icon: "🎬",
    desc: "Record and share your intro video using Loom",
    pct: 12.5,
    action: "Record Video →",
    href: "https://loom.com",
  },
];

type SpecStatus = "pass" | "warning" | "fail";

interface SpecCheck {
  label: string;
  value: string;
  status: SpecStatus;
  advice: string;
}

interface SpecsOverall {
  title: string;
  status: SpecStatus;
  tierHref: string | null;
  note: string;
}

const SPECS_CPU_OPTIONS = [
  { value: "very-old", label: "Celeron / Pentium / very old" },
  { value: "i3", label: "Core i3 / Ryzen 3" },
  { value: "i5", label: "Core i5 / Ryzen 5" },
  { value: "i7", label: "Core i7 / Ryzen 7 or better" },
  { value: "unsure", label: "Not sure" },
];

const SPECS_STORAGE_OPTIONS = [
  { value: "hdd", label: "HDD (spinning disk)" },
  { value: "ssd", label: "SSD" },
  { value: "unsure", label: "Not sure" },
];

const SPECS_OS_OPTIONS = [
  { value: "win11", label: "Windows 11" },
  { value: "win10", label: "Windows 10" },
  { value: "win8", label: "Windows 8 or older" },
  { value: "mac", label: "macOS" },
  { value: "unsure", label: "Not sure / other" },
];

const specLabel = (options: { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? "Not sure";

function computeSpecChecks(input: {
  ram: number | null;
  cpuTier: string;
  cpuModel: string;
  storageType: string;
  storageSize: number | null;
  os: string;
  internet: number | null;
}): SpecCheck[] {
  const checks: SpecCheck[] = [];
  const { ram, cpuTier, cpuModel, storageType, storageSize, os, internet } = input;

  if (ram !== null) {
    if (ram < 4) {
      checks.push({
        label: "RAM",
        value: `${ram} GB`,
        status: "fail",
        advice: "Under 4GB — will freeze up during video calls with the browser open.",
      });
    } else if (ram < 8) {
      checks.push({
        label: "RAM",
        value: `${ram} GB`,
        status: "warning",
        advice: "4GB is the bare minimum — close other apps before video calls.",
      });
    } else if (ram < 16) {
      checks.push({
        label: "RAM",
        value: `${ram} GB`,
        status: "pass",
        advice: "Handles video calls + documents + chat at the same time.",
      });
    } else {
      checks.push({
        label: "RAM",
        value: `${ram} GB`,
        status: "pass",
        advice: "Plenty — you can multitask comfortably.",
      });
    }
  }

  const cpuLabel = specLabel(SPECS_CPU_OPTIONS, cpuTier);
  const cpuValue = cpuModel.trim() ? `${cpuModel.trim()} (${cpuLabel})` : cpuLabel;
  switch (cpuTier) {
    case "very-old":
      checks.push({
        label: "CPU",
        value: cpuValue,
        status: "fail",
        advice: "That CPU class struggles with modern video-call apps.",
      });
      break;
    case "i3":
      checks.push({
        label: "CPU",
        value: cpuValue,
        status: "warning",
        advice: "Workable for basic VA tasks, but heavy multitasking will be slow.",
      });
      break;
    case "i7":
      checks.push({
        label: "CPU",
        value: cpuValue,
        status: "pass",
        advice: "Excellent — multitasking and video calls are easy.",
      });
      break;
    case "unsure":
      checks.push({
        label: "CPU",
        value: "Not sure",
        status: "warning",
        advice: "Can't verify — check Task Manager > Performance tab, or ask us in the AI Assistant with your laptop model.",
      });
      break;
    default:
      checks.push({
        label: "CPU",
        value: cpuValue,
        status: "pass",
        advice: "Good middle ground — handles most VA apps and calls.",
      });
  }

  const storageLabel = specLabel(SPECS_STORAGE_OPTIONS, storageType);
  const storageValue = storageSize !== null ? `${storageSize} GB ${storageLabel}` : storageLabel;
  if (storageType === "hdd") {
    checks.push({
      label: "Storage",
      value: storageValue,
      status: "warning",
      advice: "An HDD works, but boot and app start times feel slow. An SSD upgrade (often ₱1,500–₱3,000 for a basic 240GB SATA SSD) makes a huge difference.",
    });
  } else if (storageType === "ssd") {
    checks.push({
      label: "Storage",
      value: storageValue,
      status: "pass",
      advice: "SSD — snappy boot and fast app loads.",
    });
  } else {
    checks.push({
      label: "Storage",
      value: "Not sure",
      status: "warning",
      advice: "Can't verify — check in Settings, or ask in the AI Assistant with your laptop model.",
    });
  }

  if (storageSize !== null) {
    if (storageSize < 128) {
      checks.push({
        label: "Storage size",
        value: `${storageSize} GB`,
        status: "warning",
        advice: "Under 128GB runs out fast on Windows updates — keep files on a cloud drive.",
      });
    } else {
      checks.push({
        label: "Storage size",
        value: `${storageSize} GB`,
        status: "pass",
        advice: "Enough room for apps and files.",
      });
    }
  }

  const osLabel = specLabel(SPECS_OS_OPTIONS, os);
  switch (os) {
    case "win8":
      checks.push({
        label: "Operating system",
        value: osLabel,
        status: "fail",
        advice: "Too old — modern work software won't support it.",
      });
      break;
    case "win10":
      checks.push({
        label: "Operating system",
        value: osLabel,
        status: "warning",
        advice: "Windows 10 works, but plan an upgrade before it loses support.",
      });
      break;
    case "win11":
      checks.push({
        label: "Operating system",
        value: osLabel,
        status: "pass",
        advice: "Fully supported by the latest software.",
      });
      break;
    case "mac":
      checks.push({
        label: "Operating system",
        value: osLabel,
        status: "pass",
        advice: "Works great for VA work.",
      });
      break;
    default:
      checks.push({
        label: "Operating system",
        value: osLabel,
        status: "warning",
        advice: "Can't verify — check Settings > About, or ask in the AI Assistant.",
      });
  }

  if (internet !== null) {
    if (internet < 10) {
      checks.push({
        label: "Internet",
        value: `${internet} Mbps`,
        status: "fail",
        advice: "Under 10 Mbps — video calls will drop constantly. Check faster fiber plans.",
      });
    } else if (internet < 35) {
      checks.push({
        label: "Internet",
        value: `${internet} Mbps`,
        status: "warning",
        advice: "10–34 Mbps works, but expect buffering during calls with other apps running.",
      });
    } else {
      checks.push({
        label: "Internet",
        value: `${internet} Mbps`,
        status: "pass",
        advice: "Fast enough for video calls and file transfers.",
      });
    }
  }

  return checks;
}

function computeSpecsOverall(checks: SpecCheck[]): SpecsOverall {
  if (checks.some((c) => c.status === "fail")) {
    return {
      title: "Not ready yet — fix the red items first.",
      status: "fail",
      tierHref: "#pinakamura",
      note: "See the Budget tier below for the most affordable workable setup.",
    };
  }
  if (checks.some((c) => c.status === "warning")) {
    return {
      title: "Workable, but a few upgrades would help.",
      status: "warning",
      tierHref: "#gitna",
      note: "See the Mid-Range tier below for sensible upgrade targets.",
    };
  }
  return {
    title: "You're equipment-ready. Focus on skills next.",
    status: "pass",
    tierHref: null,
    note: "You don't need to spend anything else on hardware.",
  };
}

function SpecsChecker() {
  const [ram, setRam] = useState("");
  const [cpuModel, setCpuModel] = useState("");
  const [cpuTier, setCpuTier] = useState("unsure");
  const [storageType, setStorageType] = useState("unsure");
  const [storageSize, setStorageSize] = useState("");
  const [os, setOs] = useState("unsure");
  const [internet, setInternet] = useState("");
  const [results, setResults] = useState<{ checks: SpecCheck[]; overall: SpecsOverall } | null>(null);

  const toNum = (v: string) => {
    const n = parseInt(v, 10);
    return v.trim() !== "" && Number.isFinite(n) ? n : null;
  };

  const runCheck = () => {
    const checks = computeSpecChecks({
      ram: toNum(ram),
      cpuTier,
      cpuModel,
      storageType,
      storageSize: toNum(storageSize),
      os,
      internet: toNum(internet),
    });
    setResults({ checks, overall: computeSpecsOverall(checks) });
  };

  const clearAll = () => {
    setRam("");
    setCpuModel("");
    setCpuTier("unsure");
    setStorageType("unsure");
    setStorageSize("");
    setOs("unsure");
    setInternet("");
    setResults(null);
  };

  const pillClass = (status: SpecStatus) =>
    status === "fail"
      ? "border-red-400/50 text-red-400 bg-[rgba(217,126,107,0.12)]"
      : status === "warning"
      ? "border-gold-400/50 text-gold-300 bg-[rgba(217,169,78,0.12)]"
      : "border-green-400/50 text-green-400 bg-[rgba(74,222,128,0.1)]";

  const statusLabel = (s: SpecStatus) => (s === "fail" ? "Fail" : s === "warning" ? "Warning" : "Pass");

  return (
    <div>
      <p className="text-[12.5px] text-ink-500 mb-4">
        Enter your real specs below — we'll tell you what works and what to upgrade first.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="form-label" htmlFor="spec-ram">RAM (GB)</label>
          <input id="spec-ram" type="number" min="0" value={ram} onChange={(e) => setRam(e.target.value)} placeholder="e.g. 8" className="field" />
        </div>
        <div>
          <label className="form-label" htmlFor="spec-cpu-tier">CPU</label>
          <select id="spec-cpu-tier" value={cpuTier} onChange={(e) => setCpuTier(e.target.value)} className="field">
            {SPECS_CPU_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="spec-cpu-model">CPU model (optional)</label>
          <input id="spec-cpu-model" type="text" value={cpuModel} onChange={(e) => setCpuModel(e.target.value)} placeholder="e.g. i5-10210U" className="field" />
        </div>
        <div>
          <label className="form-label" htmlFor="spec-storage-type">Storage type</label>
          <select id="spec-storage-type" value={storageType} onChange={(e) => setStorageType(e.target.value)} className="field">
            {SPECS_STORAGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="spec-storage-size">Storage size (GB)</label>
          <input id="spec-storage-size" type="number" min="0" value={storageSize} onChange={(e) => setStorageSize(e.target.value)} placeholder="e.g. 512" className="field" />
        </div>
        <div>
          <label className="form-label" htmlFor="spec-os">Operating system</label>
          <select id="spec-os" value={os} onChange={(e) => setOs(e.target.value)} className="field">
            {SPECS_OS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="spec-internet">Internet speed (Mbps, optional)</label>
          <input id="spec-internet" type="number" min="0" value={internet} onChange={(e) => setInternet(e.target.value)} placeholder="e.g. 100" className="field" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={runCheck} className="btn-primary !py-[10px] !px-[16px] !text-[12.5px]">
          Check my setup →
        </button>
        <button onClick={clearAll} className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px]">
          Clear
        </button>
      </div>

      {results && (
        <div className="mt-8 pt-6 border-t border-navy-700">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400 mb-2">Overall</p>
          <div className={`inline-block px-4 py-2 rounded-full border font-mono text-[12.5px] ${pillClass(results.overall.status)}`}>
            {results.overall.title}
          </div>
          {results.overall.tierHref ? (
            <p className="text-[13px] text-ink-400 mt-3">
              Not sure what to buy?{" "}
              <a
                href={results.overall.tierHref}
                className="font-semibold text-gold-400 underline decoration-gold-400/40 underline-offset-4 hover:text-gold-300 transition-colors"
              >
                {results.overall.tierHref === "#pinakamura"
                  ? "See the Budget tier below"
                  : "See the Mid-Range tier below"}{" "}
                →
              </a>
            </p>
          ) : (
            <p className="text-[13px] text-ink-400 mt-3">{results.overall.note}</p>
          )}
          <div className="flex flex-col gap-3 mt-5">
            {results.checks.map((c) => (
              <div key={c.label} className="px-4 py-3 bg-navy-950 border border-navy-700 rounded-[3px]">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-50">{c.label}</span>
                  <span className="text-[13px] text-ink-300">{c.value}</span>
                  <span className={`font-mono text-[10.5px] uppercase tracking-[0.08em] px-2.5 py-0.5 rounded-full border ${pillClass(c.status)}`}>
                    {statusLabel(c.status)}
                  </span>
                </div>
                <p className="text-[12.5px] text-ink-500 mt-1.5">{c.advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EquipmentChecker() {
  const [tab, setTab] = useState<"equipment" | "readiness">("equipment");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [verification, setVerification] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<"quick" | "specs">("quick");

  const eqQuestion = EQUIPMENT_QUESTIONS[current];
  const eqTotal = EQUIPMENT_QUESTIONS.length;
  const eqPct = Math.round((current / eqTotal) * 100);

  const selectEq = (score: number) => {
    const next = { ...answers, [eqQuestion.id]: score };
    setAnswers(next);
    if (current < eqTotal - 1) {
      setCurrent(current + 1);
    } else {
      setDone(true);
    }
  };

  const eqScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const eqMaxScore = eqTotal * 4;
  const eqPctScore = Math.round((eqScore / eqMaxScore) * 100);

  let eqTier: string;
  let eqTierColor: string;
  if (eqPctScore < 30) {
    eqTier = "Budget";
    eqTierColor = "text-ink-50";
  } else if (eqPctScore < 60) {
    eqTier = "Mid-Range";
    eqTierColor = "text-gold-400";
  } else {
    eqTier = "Comfortable";
    eqTierColor = "text-gold-300";
  }

  const eqNeeds = EQUIPMENT_QUESTIONS.filter((q) => (answers[q.id] ?? 0) <= 1).map((q) => q.q);

  const verifDone = VERIFICATION_STEPS.filter((s) => verification[s.key]).length;
  const verifPct = Math.round((verifDone / VERIFICATION_STEPS.length) * 100);
  const overallPct = Math.round((eqPctScore * 0.4 + verifPct * 0.6));

  const toggleVerif = (key: string) => {
    setVerification((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="panel p-7">
      <div className="flex gap-2 mb-6 font-mono text-[12px]">
        <button
          onClick={() => setTab("equipment")}
          className={`px-4 py-2 rounded-[3px] border transition-colors ${
            tab === "equipment"
              ? "border-gold-400 bg-[rgba(217,169,78,0.15)] text-gold-300"
              : "border-navy-600 text-ink-400 hover:border-navy-500"
          }`}
        >
            Equipment Specs
          </button>
        <button
          onClick={() => setTab("readiness")}
          className={`px-4 py-2 rounded-[3px] border transition-colors ${
            tab === "readiness"
              ? "border-gold-400 bg-[rgba(217,169,78,0.15)] text-gold-300"
              : "border-navy-600 text-ink-400 hover:border-navy-500"
          }`}
        >
            VA Readiness Score
          </button>
      </div>

      {tab === "equipment" ? (
        <>
          <div className="flex gap-2 mb-6 font-mono text-[12px]">
            <button
              onClick={() => setMode("quick")}
              className={`px-4 py-2 rounded-[3px] border transition-colors ${
                mode === "quick"
                  ? "border-gold-400 bg-[rgba(217,169,78,0.15)] text-gold-300"
                  : "border-navy-600 text-ink-400 hover:border-navy-500"
              }`}
            >
              Quick Check
            </button>
            <button
              onClick={() => setMode("specs")}
              className={`px-4 py-2 rounded-[3px] border transition-colors ${
                mode === "specs"
                  ? "border-gold-400 bg-[rgba(217,169,78,0.15)] text-gold-300"
                  : "border-navy-600 text-ink-400 hover:border-navy-500"
              }`}
            >
              I Know My Specs
            </button>
          </div>
          {mode === "quick" ? (
        !done ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-50">
                Question {current + 1} of {eqTotal}
              </p>
              <div className="h-[3px] w-32 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-400 transition-all"
                  style={{ width: `${eqPct}%` }}
                />
              </div>
            </div>
            <h3 className="font-serif font-medium text-[20px] mb-6">{eqQuestion.q}</h3>
            <div className="flex flex-col gap-3">
              {eqQuestion.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => selectEq(opt.score)}
                  className="w-full text-left px-5 py-4 border border-navy-700 bg-navy-900 rounded-[3px] hover:border-gold-400/50 hover:bg-navy-800 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400 mb-2">
                Equipment score
              </p>
              <p className={`font-mono text-[48px] font-semibold ${eqTierColor}`}>{eqPctScore}%</p>
              <p className="text-[15px] text-ink-300 mt-2">
                You're in the <strong className="text-ink-50">{eqTier}</strong> tier.
              </p>
            </div>
            {eqNeeds.length > 0 ? (
              <div className="mb-6">
                <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400 mb-3">
                  Fix these first
                </h4>
                <div className="flex flex-col gap-2">
                  {eqNeeds.map((n) => (
                    <div
                      key={n}
                      className="flex items-center gap-3 px-4 py-3 bg-navy-950 border border-navy-700 rounded-[3px]"
                    >
                      <span className="text-gold-400 font-mono text-sm">→</span>
                      <span className="text-[14px] text-ink-300">{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 px-4 py-3 bg-navy-950 border border-gold-400/30 rounded-[3px]">
                <p className="text-[14px] text-gold-300">
                  Your equipment looks solid. Now check your VA readiness below.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrent(0);
                  setAnswers({});
                  setDone(false);
                }}
                className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px]"
              >
                Retake
              </button>
              <button
                onClick={() => setTab("readiness")}
                className="btn-primary !py-[10px] !px-[16px] !text-[12.5px]"
              >
                Check VA Readiness →
              </button>
            </div>
          </>
          )
        ) : (
            <SpecsChecker />
          )}
        </>
      ) : (
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400">
                Overall VA Readiness
              </p>
              <span className={`font-mono text-[24px] font-semibold ${
                overallPct >= 80 ? "text-gold-300" : overallPct >= 50 ? "text-gold-400" : "text-ink-50"
              }`}>
                {overallPct}%
              </span>
            </div>
            <div className="h-[6px] bg-navy-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-400 transition-all"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <p className="text-[12.5px] text-ink-500 mt-2">
              {verifDone} of {VERIFICATION_STEPS.length} verification steps complete
              {verifDone < 5 && " — finish the remaining steps to unlock your full readiness score"}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {VERIFICATION_STEPS.map((step) => {
              const completed = verification[step.key];
              return (
                <div
                  key={step.key}
                  className={`p-5 border rounded-[3px] transition-colors ${
                    completed
                      ? "border-gold-400/30 bg-navy-950"
                      : "border-navy-700 bg-navy-900"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[20px] flex-shrink-0 mt-0.5">{step.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-[14.5px]">{step.label}</h4>
                        <span className="font-mono text-[10.5px] text-gold-400">{step.pct}%</span>
                      </div>
                      <p className="text-[12.5px] text-ink-500 mb-3">{step.desc}</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleVerif(step.key)}
                          className={`font-mono text-[11.5px] px-3 py-1.5 rounded-full border transition-colors ${
                            completed
                              ? "border-gold-400/50 text-gold-300 bg-[rgba(217,169,78,0.1)]"
                              : "border-navy-600 text-ink-400 hover:border-gold-400 hover:text-gold-300"
                          }`}
                        >
                          {completed ? "✓ Completed" : step.action}
                        </button>
                        {completed && (
                          <button
                            onClick={() => toggleVerif(step.key)}
                            className="font-mono text-[11.5px] text-ink-500 hover:text-ink-300 transition-colors"
                          >
                            Undo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setTab("equipment")}
              className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px]"
            >
              ← Back to Equipment
            </button>
            <a
              href="/portfolio-builder"
              className="btn-primary !py-[10px] !px-[16px] !text-[12.5px]"
            >
              Build your portfolio →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}