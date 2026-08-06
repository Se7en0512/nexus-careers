"use client";

import { useEffect, useRef } from "react";

export default function MarqueeBar({ text }: { text: string }) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const speed = 0.5;
    const tick = () => {
      pos -= speed;
      if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  if (!text) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gold-400 text-navy-950 overflow-hidden" style={{ height: 32 }}>
      <div className="h-full flex items-center">
        <div ref={innerRef} className="whitespace-nowrap font-mono text-[12px] tracking-wide flex">
          <span className="px-8">{text}</span>
          <span className="px-8">{text}</span>
          <span className="px-8">{text}</span>
          <span className="px-8">{text}</span>
          <span className="px-8">{text}</span>
          <span className="px-8">{text}</span>
          <span className="px-8">{text}</span>
          <span className="px-8">{text}</span>
        </div>
      </div>
    </div>
  );
}
