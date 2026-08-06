"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  exiting?: boolean;
}

let toastListeners: Array<(toast: ToastMessage) => void> = [];

export function showToast(type: ToastMessage["type"], message: string) {
  const toast: ToastMessage = {
    id: Date.now().toString(),
    type,
    message,
  };
  toastListeners.forEach((fn) => fn(toast));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);
      // Start exit animation at 2700ms, remove at 3000ms
      setTimeout(() => {
        setToasts((prev) => prev.map((t) => t.id === toast.id ? { ...t, exiting: true } : t));
      }, 2700);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };
    toastListeners.push(handler);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== handler);
    };
  }, []);

  if (toasts.length === 0) return null;

  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const colors = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    error: "border-red-400/30 bg-red-400/10 text-red-400",
    info: "border-gold-400/30 bg-gold-400/10 text-gold-400",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 border rounded-[3px] shadow-xl ${colors[toast.type]} ${toast.exiting ? "toast-exit" : "toast-enter"}`}
        >
          <span className="font-mono text-[14px] font-bold">{icons[toast.type]}</span>
          <span className="text-[13.5px] text-ink-50">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
