"use client";

import { useEffect, useState } from "react";

interface ProfileStrengthCelebrationProps {
  milestone: number;
  onDismiss: () => void;
}

const MESSAGES: Record<number, { emoji: string; title: string; sub: string }> = {
  25: { emoji: "🚀", title: "Great start!", sub: "Your profile is now 25% complete. Keep going!" },
  50: { emoji: "⚡", title: "Halfway there!", sub: "Your profile is now 50% complete. You're building momentum." },
  75: { emoji: "🎉", title: "Almost there!", sub: "Your profile is now 75% complete. Just a few more steps." },
  100: { emoji: "🏆", title: "Profile complete!", sub: "Your profile is 100% complete. You're ready to shine!" },
};

export default function ProfileStrengthCelebration({ milestone, onDismiss }: ProfileStrengthCelebrationProps) {
  const [visible, setVisible] = useState(false);
  const msg = MESSAGES[milestone] || MESSAGES[25];

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={() => { setVisible(false); setTimeout(onDismiss, 400); }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/80 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      {/* Card */}
      <div
        className="relative bg-navy-900 border border-gold-400/40 rounded-lg p-10 max-w-[380px] text-center transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)",
        }}
      >
        <div className="text-5xl mb-4">{msg.emoji}</div>
        <h3 className="font-serif text-[22px] font-medium text-gold-300 mb-2">{msg.title}</h3>
        <p className="text-[14.5px] text-ink-300 mb-6">{msg.sub}</p>
        <button
          onClick={(e) => { e.stopPropagation(); setVisible(false); setTimeout(onDismiss, 400); }}
          className="btn-primary !py-[10px] !px-[20px] !text-[12.5px]"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
