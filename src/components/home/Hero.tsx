"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import EnrollLink from "../EnrollLink";
import CountrySelector from "../CountrySelector";
import { formatLocalFromUsd, useGeo } from "@/lib/countries";

interface SearchItem {
  t: string;
  p: string;
  c: string;
  k: string;
  x: number;
}

function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let running = false;
    let w = 0,
      h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const COLORS = [
      "140,198,63",
      "0,147,221",
      "92,200,255",
      "251,191,36",
      "189,240,111",
    ];
    const N = w < 700 ? 40 : 95;
    const ps = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.3 + 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.05,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      a: Math.random() * 0.55 + 0.25,
    }));
    let mx = -999,
      my = -999;
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        const dx = p.x - mx,
          dy = p.y - my,
          d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = (16000 - d2) / 16000;
          p.vx += (dx / 4000) * f;
          p.vy += (dy / 4000) * f;
        }
        p.vx *= 0.975;
        p.vy = p.vy * 0.975 - 0.006;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([e]) =>
      e.isIntersecting ? play() : pause()
    );
    const ric =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).requestIdleCallback ||
      ((f: () => void) => setTimeout(f, 300));
    ric(() => io.observe(c));
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      pause();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-[1] h-full w-full"
      aria-hidden
    />
  );
}

export default function Hero() {
  const { country } = useGeo();
  const card = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchItem[] | null>(null);

  useEffect(() => {
    const el = card.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `rotateY(${cx}deg) rotateX(${cy}deg)`;
      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01)
        raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = (e.clientX / window.innerWidth - 0.5) * 20;
      ty = -(e.clientY / window.innerHeight - 0.5) * 14;
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const ensureIndex = () => {
    if (index) return;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((d) => setIndex(d))
      .catch(() => {});
  };

  const results =
    query.trim().length >= 2 && index
      ? index
          .filter((it) =>
            `${it.t} ${it.k}`.toLowerCase().includes(query.trim().toLowerCase())
          )
          .slice(0, 6)
      : [];

  const pro1Local = formatLocalFromUsd(240, country);
  const pro2Local = formatLocalFromUsd(720, country);

  return (
    <section className="hero min-h-[100svh] pt-[68px]">
      <div className="hero-aurora" />
      <div className="hero-grid" />
      <Particles />
      <div className="wrap grid min-h-[calc(100svh-68px)] items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.95fr]">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="chip">
              <span className="h-2 w-2 animate-pulse rounded-full bg-fxlime" />
              2 Vías Reales con FuXion · 34 Países Oficiales
            </span>
            <CountrySelector variant="dark" compact />
          </div>

          <h1 className="hero-title mt-6">
            <span className="block">
              {["Ingresos", "con", "FuXion"].map((w, i) => (
                <span key={w}>
                  <span
                    className="hw"
                    style={{ animationDelay: `${0.08 + i * 0.11}s` }}
                  >
                    {w}
                  </span>
                  {i < 2 ? " " : ""}
                </span>
              ))}
            </span>
            <span className="mt-3 block text-[0.42em] font-bold leading-[1.2] tracking-[-0.02em] text-white/92">
              {["Dropshipping", "sin", "stock", "y", "Red", "Multinivel"].map(
                (w, i) => (
                  <Fragment key={w + i}>
                    <span className="reveal-word">
                      <span style={{ animationDelay: `${0.38 + i * 0.06}s` }}>
                        {w}
                      </span>
                    </span>{" "}
                  </Fragment>
                )
              )}
              <span className="reveal-word">
                <span
                  style={{ animationDelay: "0.78s" }}
                  className="text-fxlime"
                >
                  explicados con datos*
                </span>
              </span>
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Elige tu modalidad o combina ambas:{" "}
            <strong className="text-white">
              1) Vende bebidas nutracéuticas FuXion sin comprar inventario
            </strong>{" "}
            (FuXion cobra, empaca y despacha por ti) o{" "}
            <strong className="text-white">
              2) Construye equipos de afiliados (Pro 1 y Pro 2)
            </strong>{" "}
            acompañado paso a paso por el equipo de{" "}
            <strong className="text-fxlime">Charlie Lingan</strong>.
          </p>

          {/* Instant Search across 2,535 Guides */}
          <div className="relative mt-6 max-w-xl">
            <input
              type="search"
              value={query}
              onFocus={ensureIndex}
              onChange={(e) => {
                ensureIndex();
                setQuery(e.target.value);
              }}
              placeholder="🔍 Buscar en +2,500 guías (ej: Bono Pro 1, Prunex1, España, México, WhatsApp)..."
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 backdrop-blur-md focus:border-fxlime focus:bg-[#07131d]/90 focus:outline-none"
            />
            {results.length > 0 && (
              <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[var(--line)] bg-white text-fxink shadow-2xl">
                {results.map((r) => (
                  <Link
                    key={r.p}
                    href={r.p}
                    className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 text-xs hover:bg-fxsky"
                  >
                    <span className="font-semibold text-fxink">{r.t}</span>
                    <span className="shrink-0 rounded-full bg-fxsky px-2 py-0.5 text-[10px] font-bold text-fxbluedeep">
                      {r.x ? "Negocio" : "Guía"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <EnrollLink
              source="hero-primary"
              className="btn btn-lime shine text-sm sm:text-base"
              magnetic
            >
              Hacer clic aquí para registrarme →
            </EnrollLink>
            <a
              href="#calculadora-ia"
              className="btn btn-glass text-sm sm:text-base"
              data-magnetic
            >
              🧮 Calcular mis Ingresos ({country.currency})
            </a>
          </div>

          <p className="mt-3 text-[11px] text-white/60">
            *Todos los montos y porcentajes en esta web son referenciales y
            pueden variar según país y desempeño.
          </p>
        </div>

        {/* 3D Tilt Stage */}
        <div className="tilt-stage relative z-10 mx-auto w-full max-w-[540px]">
          <div ref={card} className="tilt-card relative">
            <div className="tilt-glow" />
            <div className="halo-ring" />
            <div
              className="relative overflow-hidden rounded-[30px] border border-white/20 bg-[#07131d]/80 p-3 shadow-2xl"
              style={{ transform: "translateZ(45px)" }}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <Image
                  src="/img/ambiente/home-hero-fuxion.webp"
                  alt="Emprendedor gestionando su tienda virtual de dropshipping y red de afiliados FuXion"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 92vw, 520px"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2.5 p-1">
                <div className="rounded-2xl bg-white/8 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-fxlime">
                    Vía 1 · Dropshipping Pro 1
                  </p>
                  <p className="mt-1 font-display text-xl font-extrabold text-white">
                    ~{pro1Local}*
                  </p>
                  <p className="text-[11px] text-white/65">
                    Sin comprar stock · 20% a 50%
                  </p>
                </div>
                <div className="rounded-2xl bg-white/8 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Vía 2 · Equipo Pro 2 + Red
                  </p>
                  <p className="mt-1 font-display text-xl font-extrabold text-white">
                    ~{pro2Local}+*
                  </p>
                  <p className="text-[11px] text-white/65">
                    Duplicando 4 socios en Pro 1
                  </p>
                </div>
              </div>
            </div>

            <div
              className="price-badge -right-2 -top-4 sm:right-2 sm:-top-5"
              aria-label="34 países oficiales sin stock obligatorio"
            >
              <svg viewBox="0 0 128 128" aria-hidden>
                <defs>
                  <path
                    id="ip-circle"
                    d="M64,64 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0"
                  />
                </defs>
                <text
                  fontSize="8.8"
                  fontWeight="700"
                  fill="#1d2f06"
                  fontFamily="Outfit, sans-serif"
                >
                  <textPath
                    href="#ip-circle"
                    textLength="310"
                    lengthAdjust="spacing"
                  >
                    DROPSHIPPING FUXION · SIN STOCK · 34 PAÍSES ·
                  </textPath>
                </text>
              </svg>
              <div className="relative">
                <p className="font-display text-2xl font-extrabold leading-none">
                  $0
                </p>
                <p className="mt-0.5 text-[0.62rem] font-bold">en stock físico</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
