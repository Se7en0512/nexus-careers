"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

interface StageSummary {
  key: string;
  title: string;
  complete: boolean;
}

interface CertSummary {
  id: number;
  stage_key: string;
  stage_title: string;
}

export default function CertificateSection({
  stages,
  earned,
}: {
  stages: StageSummary[];
  earned: CertSummary[];
}) {
  const router = useRouter();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const claim = async (key: string) => {
    setBusyKey(key);
    setError("");
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageKey: key }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong — try again.");
        return;
      }
      router.refresh();
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="panel p-7">
      <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-ink-500 mb-1">
        Certificate
      </h3>
      <p className="text-[12.5px] text-ink-500 mb-5">
        Complete a stage to claim your certificate.
      </p>

      {earned.length > 0 && (
        <div className="flex flex-col gap-2 mb-5">
          {earned.map((c) => (
            <a
              key={c.id}
              href={`/certificate/${c.id}`}
              className="text-[13.5px] py-2.5 px-4 border border-gold-400/50 bg-[rgba(217,169,78,0.08)] text-gold-300 rounded-[3px] hover:bg-[rgba(217,169,78,0.16)] transition-colors"
            >
              ✓ {c.stage_title} — view the certificate →
            </a>
          ))}
        </div>
      )}

      {stages.filter((s) => s.complete).length > 0 && (
        <div className="flex flex-col gap-2">
          {stages
            .filter((s) => s.complete)
            .map((s) => {
              const hasEarned = earned.some((c) => c.stage_key === s.key);
              return hasEarned ? null : (
                <Button
                  key={s.key}
                  variant="secondary"
                  loading={busyKey === s.key}
                  onClick={() => claim(s.key)}
                  className="!py-[10px] !px-[16px] !text-[12.5px] text-center"
                >
                  {busyKey === s.key ? "Issuing..." : `Claim your ${s.title} Stage certificate`}
                </Button>
              );
            })}
        </div>
      )}

      {error && <p className="form-error !mt-4">{error}</p>}
      {stages.filter((s) => s.complete).length === 0 && earned.length === 0 && (
        <div className="mt-4">
          <EmptyState
            icon="🏆"
            title="Your first certificate is within reach"
            description="Complete all checklist items in a roadmap stage to claim your certificate. Every stage you finish brings you one step closer."
            variant="motivational"
          />
        </div>
      )}
    </div>
  );
}
