"use client";

import { useEffect, useRef } from "react";

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let started = false;
    let nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number; isMain: boolean }> = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // When the system has reduced motion enabled, slow it down instead of
    // stopping it entirely, so the network effect stays visible.
    const speed = prefersReduced ? 0.25 : 9;
    const mousePull = prefersReduced ? 0.012 : 0.09;

    const spawnNodes = () => {
      if (w === 0 || h === 0) return;
      const N = 20;
      nodes = [];
      for (let i = 0; i < N; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          r: Math.random() * 1.6 + 1.2,
          isMain: false,
        });
      }
      nodes[0].r = 4.5;
      nodes[0].isMain = true;
      started = true;
    };

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!started && w > 0 && h > 0) spawnNodes();
    };

    const start = () => {
      if (raf) return;
      step();
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const maxDist = 130;
    const mouseDist = 170;

    const step = () => {
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(step);
        return;
      }
      if (!started) spawnNodes();

      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx * speed;
        n.y += n.vy * speed;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        if (mouse.active) {
          const dxm = mouse.x - n.x;
          const dym = mouse.y - n.y;
          const dm = Math.sqrt(dxm * dxm + dym * dym);
          if (dm < mouseDist) {
            const pull = (1 - dm / mouseDist) * mousePull * speed;
            n.x += (dxm / dm) * pull;
            n.y += (dym / dm) * pull;
          }
        }
      }

      if (mouse.active) {
        for (const n of nodes) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.55;
            ctx.strokeStyle = `rgba(239,203,128,${opacity})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.35;
            ctx.strokeStyle = `rgba(217,169,78,${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = n.isMain ? "#EFCB80" : "rgba(217,169,78,0.75)";
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        if (n.isMain) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(239,203,128,0.35)";
          ctx.lineWidth = 1;
          ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(step);
    };

    resize();

    const getPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onPointerMove = (e: PointerEvent) => {
      const p = getPos(e);
      mouse.x = p.x;
      mouse.y = p.y;
      mouse.active = true;
    };
    const onPointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    // Watches the container's actual size — if it's still 0 at mount
    // (normal during SSR/hydration), the animation starts once it has a size.
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver === "function") {
      observer = new ResizeObserver(() => resize());
      observer.observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

    // Resumes the animation when returning to the tab or scrolling back into
    // view — in case the browser paused rAF while hidden.
    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let visible = true;
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
        else stop();
      });
      io.observe(canvas);
    }

    start();

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      if (observer) observer.disconnect();
      else window.removeEventListener("resize", resize);
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-hidden
      style={{ display: "block" }}
    />
  );
}
