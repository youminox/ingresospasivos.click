"use client";

import { useEffect, useRef, useState } from "react";

export interface CounterMetric {
  value: number;
  suffix: string;
  label: string;
  sub: string;
}

export default function BusinessCounters({
  items,
}: {
  items: CounterMetric[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1100;
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur"
        >
          <p className="font-display text-4xl font-extrabold text-fxlime">
            {Math.round(it.value * progress).toLocaleString("es-PE")}
            <span className="text-2xl text-white">{it.suffix}</span>
          </p>
          <p className="mt-1.5 font-display text-base font-bold text-white">
            {it.label}
          </p>
          <p className="mt-1 text-xs text-white/65">{it.sub}</p>
        </div>
      ))}
    </div>
  );
}
