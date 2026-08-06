"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("thrive_vid");
  if (!id) {
    id = crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("thrive_vid", id);
  }
  return id;
}

export default function Heartbeat() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    const send = () => {
      try {
        navigator.sendBeacon?.(
          "/api/analytics/heartbeat",
          new Blob([JSON.stringify({ visitor_id: visitorId, path: pathname })], {
            type: "application/json",
          })
        );
      } catch {
        fetch("/api/analytics/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitor_id: visitorId, path: pathname }),
          keepalive: true,
        }).catch(() => {});
      }
    };

    // Send on load
    send();

    // Send every 60 seconds
    const interval = setInterval(send, 60000);

    // Send on page hide (user leaving)
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") send();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pathname]);

  return null;
}
