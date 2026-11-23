"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div
      className="progress-bar w-full"
      style={{ transform: `scaleX(${p})` }}
      aria-hidden
    />
  );
}
