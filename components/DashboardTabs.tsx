"use client";

import { useCallback, useEffect, useState } from "react";

export interface DashboardTabGroup {
  id: string;
  label: string;
  sections: string[];
}

const STORAGE_KEY = "thrive-dashboard-tab";

export default function DashboardTabs({ groups }: { groups: DashboardTabGroup[] }) {
  const [groupsKey, setGroupsKey] = useState(groups.map((g) => g.id).join(","));
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const apply = useCallback(
    (id: string) => {
      if (!groups.some((g) => g.id === id)) return;
      setActiveTab(id);
      document.querySelectorAll<HTMLElement>("[data-tab-group]").forEach((el) => {
        el.classList.toggle("hidden", el.getAttribute("data-tab-group") !== id);
      });
      try {
        sessionStorage.setItem(STORAGE_KEY, id);
      } catch {
        /* noop */
      }
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [groups]
  );

  useEffect(() => {
    if (groupsKey !== groups.map((g) => g.id).join(",")) {
      setGroupsKey(groups.map((g) => g.id).join(","));
      return;
    }
    let preferred: string | null = window.location.hash.replace(/^#/, "") || null;
    if (!preferred) preferred = new URLSearchParams(window.location.search).get("tab");
    if (!preferred || !groups.some((g) => g.id === preferred)) {
      try {
        preferred = sessionStorage.getItem(STORAGE_KEY);
      } catch {
        preferred = null;
      }
    }
    if (!preferred || !groups.some((g) => g.id === preferred)) {
      preferred = groups[0]?.id ?? null;
    }
    if (preferred) apply(preferred);
  }, [groups, groupsKey, apply]);

  return (
    <nav aria-label="Dashboard" role="tablist" className="lg:sticky lg:top-24 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-8 px-8 lg:mx-0 lg:px-0">
      {groups.map((g) => {
        const active = activeTab === g.id;
        return (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`tab-panel-${g.id}`}
            onClick={() => apply(g.id)}
            className={`whitespace-nowrap lg:whitespace-normal font-mono text-[12px] uppercase tracking-[0.08em] text-left rounded-[3px] px-3.5 lg:px-0 py-2 lg:py-1.5 min-h-[44px] transition-colors border lg:border-0 lg:border-l-2 ${
              active
                ? "text-gold-300 border-gold-400/50 lg:border-gold-400"
                : "text-ink-500 hover:text-gold-300 border-navy-800 lg:border-transparent"
            }`}
          >
            {g.label}
          </button>
        );
      })}
    </nav>
  );
}