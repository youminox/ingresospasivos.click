"use client";

import { useEffect, useRef, useState } from "react";
import EnrollLink from "../EnrollLink";

interface FlowStep {
  n: string;
  shortLabel: string;
  roleBadge: string;
  roleClass: string;
  borderClass: string;
  icon: string;
  title: string;
  desc: string;
  highlight: string;
  highlightClass: string;
  arrowLabel?: string;
  arrowColor?: string;
  arrowIcon?: string;
}

const STEPS: FlowStep[] = [
  {
    n: "01",
    shortLabel: "Tu Link",
    roleBadge: "👤 LO HACES TÚ · 1 MINUTO",
    roleClass: "bg-fxblue/25 text-sky-300 border-fxblue/50",
    borderClass: "border-fxblue/60 from-[#0d2a42] via-[#091c2e] to-[#07131d]",
    icon: "📱",
    title: "1. Tu Tienda Online",
    desc: "Te registras y recibes gratis tu e-commerce oficial FuXion. Solo compartes tu link por WhatsApp o redes.",
    highlight: "📦 Stock comprado por ti: 0 cajas",
    highlightClass: "bg-fxblue/20 text-sky-200 border-fxblue/40",
    arrowLabel: "Envías tu link oficial al cliente",
    arrowColor: "#38bdf8",
    arrowIcon: "🔗",
  },
  {
    n: "02",
    shortLabel: "Compra",
    roleBadge: "💳 PASARELA OFICIAL FUXION",
    roleClass: "bg-cyan-500/20 text-cyan-200 border-cyan-400/45",
    borderClass: "border-cyan-400/55 from-[#0b2e3d] via-[#081d29] to-[#07131d]",
    icon: "🛒",
    title: "2. Tu Cliente Compra",
    desc: "El cliente entra a tu enlace y paga seguro con tarjeta o medio local en su propia moneda.",
    highlight: "🌎 Activo en 34 países (América y Europa)",
    highlightClass: "bg-cyan-500/15 text-cyan-200 border-cyan-400/35",
    arrowLabel: "Orden automática a planta FuXion",
    arrowColor: "#fbbf24",
    arrowIcon: "⚡",
  },
  {
    n: "03",
    shortLabel: "Despacho",
    roleBadge: "🏭 LOGÍSTICA FUXION (TÚ NO ENVÍAS)",
    roleClass: "bg-amber-500/20 text-amber-200 border-amber-400/50",
    borderClass: "border-amber-400/60 from-[#2c220c] via-[#19170d] to-[#07131d]",
    icon: "🚚",
    title: "3. FuXion Despacha",
    desc: "FuXion cobra, emite factura, empaca el producto sellado en su almacén y lo entrega en casa del cliente.",
    highlight: "🙌 Cero almacén · Cero ir al correo",
    highlightClass: "bg-amber-500/20 text-amber-200 border-amber-400/40",
    arrowLabel: "Acreditación de puntos PV y pago",
    arrowColor: "#8cc63f",
    arrowIcon: "💸",
  },
  {
    n: "04",
    shortLabel: "Comisión",
    roleBadge: "💰 GANAS TÚ EN TU BANCO",
    roleClass: "bg-fxlime/25 text-[#d9f99d] border-fxlime/55",
    borderClass: "border-fxlime/65 from-[#173012] via-[#0e2012] to-[#07131d]",
    icon: "🏆",
    title: "4. Tu Comisión*",
    desc: "Sumas Puntos Volumen (PV) en automático y FuXion deposita tus comisiones en tu cuenta bancaria local.",
    highlight: "✨ 20% a 50% Venta Directa + Bono Pro 1",
    highlightClass: "bg-fxlime/20 text-[#d9f99d] border-fxlime/45",
  },
];

export default function DropshippingScrollStory() {
  const rootRef = useRef<HTMLElement>(null);
  const triggerBoundsRef = useRef<{ start: number; end: number } | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    const init = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);

        // Estado inicial: Paso 1 grande y nítido en primer plano; los demás listos para entrar con zoom
        gsap.set(q(".zoom-card-0"), {
          opacity: 1,
          scale: 1,
          y: 0,
          zIndex: 4,
        });
        gsap.set(q(".zoom-card-1, .zoom-card-2, .zoom-card-3"), {
          opacity: 0,
          scale: 0.76,
          y: 34,
          zIndex: 1,
        });
        gsap.set(q(".arrow-bridge"), {
          opacity: 0,
          scale: 0.9,
        });
        gsap.set(q(".arrow-stroke"), {
          strokeDasharray: 220,
          strokeDashoffset: 220,
        });
        gsap.set(q(".arrow-head, .arrow-traveler"), {
          opacity: 0,
        });
        gsap.set(q(".story-fill"), { scaleX: 0 });
        gsap.set(q(".story-fill-0"), { scaleX: 0.25 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: q(".pin-wrap")[0],
            start: "top top",
            end: "+=2500",
            scrub: 0.55,
            pin: q(".pin-stage")[0],
            anticipatePin: 1,
            onRefresh: (self) => {
              triggerBoundsRef.current = { start: self.start, end: self.end };
            },
            onUpdate: (self) => {
              triggerBoundsRef.current = { start: self.start, end: self.end };
              const p = self.progress;
              if (p < 0.26) setActiveIdx(0);
              else if (p < 0.54) setActiveIdx(1);
              else if (p < 0.82) setActiveIdx(2);
              else setActiveIdx(3);
            },
          },
        });

        // --- FASE 1: Cuadro 1 se acerca un poco más (efecto foco) y luego se aleja ---
        tl.to(q(".story-fill-0"), { scaleX: 1, duration: 0.8, ease: "none" }, 0)
          .to(q(".zoom-card-0"), { scale: 1.02, duration: 0.45 }, 0)
          .to(
            q(".zoom-card-0"),
            { scale: 0.72, y: -36, opacity: 0, duration: 0.45 },
            0.65
          )

          // --- FLECHA 1 -> 2 ---
          .to(q(".arrow-bridge-0"), { opacity: 1, scale: 1, duration: 0.2 }, 0.82)
          .to(
            q(".arrow-stroke-0"),
            { strokeDashoffset: 0, duration: 0.45, ease: "power1.out" },
            0.85
          )
          .to(q(".arrow-head-0"), { opacity: 1, duration: 0.15 }, 1.15)
          .fromTo(
            q(".arrow-traveler-0"),
            { xPercent: -140, opacity: 0 },
            { xPercent: 140, opacity: 1, duration: 0.5, ease: "power1.inOut" },
            0.88
          )
          .to(q(".arrow-bridge-0"), { opacity: 0, scale: 1.08, duration: 0.22 }, 1.38)

          // --- FASE 2: Aparece Cuadro 2 haciendo Zoom In con letras grandes ---
          .set(q(".zoom-card-1"), { zIndex: 5 }, 1.32)
          .to(
            q(".zoom-card-1"),
            { opacity: 1, scale: 1, y: 0, duration: 0.48, ease: "back.out(1.2)" },
            1.35
          )
          .to(
            q(".story-fill-1"),
            { scaleX: 1, duration: 0.85, ease: "none" },
            1.35
          )
          .to(
            q(".zoom-card-1"),
            { scale: 0.72, y: -36, opacity: 0, duration: 0.45 },
            2.15
          )

          // --- FLECHA 2 -> 3 ---
          .to(q(".arrow-bridge-1"), { opacity: 1, scale: 1, duration: 0.2 }, 2.32)
          .to(
            q(".arrow-stroke-1"),
            { strokeDashoffset: 0, duration: 0.45, ease: "power1.out" },
            2.35
          )
          .to(q(".arrow-head-1"), { opacity: 1, duration: 0.15 }, 2.65)
          .fromTo(
            q(".arrow-traveler-1"),
            { xPercent: -140, opacity: 0 },
            { xPercent: 140, opacity: 1, duration: 0.5, ease: "power1.inOut" },
            2.38
          )
          .to(q(".arrow-bridge-1"), { opacity: 0, scale: 1.08, duration: 0.22 }, 2.88)

          // --- FASE 3: Aparece Cuadro 3 (FuXion Despacha) haciendo Zoom In ---
          .set(q(".zoom-card-2"), { zIndex: 6 }, 2.82)
          .to(
            q(".zoom-card-2"),
            { opacity: 1, scale: 1, y: 0, duration: 0.48, ease: "back.out(1.2)" },
            2.85
          )
          .to(
            q(".story-fill-2"),
            { scaleX: 1, duration: 0.85, ease: "none" },
            2.85
          )
          .to(
            q(".zoom-card-2"),
            { scale: 0.72, y: -36, opacity: 0, duration: 0.45 },
            3.65
          )

          // --- FLECHA 3 -> 4 ---
          .to(q(".arrow-bridge-2"), { opacity: 1, scale: 1, duration: 0.2 }, 3.82)
          .to(
            q(".arrow-stroke-2"),
            { strokeDashoffset: 0, duration: 0.45, ease: "power1.out" },
            3.85
          )
          .to(q(".arrow-head-2"), { opacity: 1, duration: 0.15 }, 4.15)
          .fromTo(
            q(".arrow-traveler-2"),
            { xPercent: -140, opacity: 0 },
            { xPercent: 140, opacity: 1, duration: 0.5, ease: "power1.inOut" },
            3.88
          )
          .to(q(".arrow-bridge-2"), { opacity: 0, scale: 1.08, duration: 0.22 }, 4.38)

          // --- FASE 4: Aparece Cuadro 4 (Tu Comisión) en grande y se sostiene ---
          .set(q(".zoom-card-3"), { zIndex: 7 }, 4.32)
          .to(
            q(".zoom-card-3"),
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" },
            4.35
          )
          .to(
            q(".story-fill-3"),
            { scaleX: 1, duration: 0.8, ease: "none" },
            4.35
          );
      }, el);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          init();
        }
      },
      { rootMargin: "500px 0px" }
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      ctx?.revert();
    };
  }, []);

  const jumpToStep = (idx: number) => {
    setActiveIdx(idx);
    const bounds = triggerBoundsRef.current;
    if (!bounds) return;
    const targets = [0.06, 0.36, 0.66, 0.94];
    const targetY =
      bounds.start + (bounds.end - bounds.start) * (targets[idx] ?? 0);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <section
      id="como-funciona-dropshipping"
      ref={rootRef}
      className="relative bg-gradient-to-b from-fxsky via-white to-fxsky"
    >
      {/* ESCENA FIJADA: En celular aparece ARRIBA desde el primer instante el efecto visual grande */}
      <div className="pin-wrap relative">
        <div className="pin-stage flex min-h-[100svh] items-center overflow-hidden pt-[68px] pb-16 lg:py-12">
          <div className="wrap grid w-full items-center gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
            {/* Cabecera compacta en móvil (para no empujar el cuadro) + Columna izquierda completa en PC */}
            <div className="order-1">
              <span className="eyebrow">Apalancamiento Logístico FuXion</span>
              <h2 className="mt-2 font-display text-[1.7rem] font-extrabold leading-[1.06] tracking-tight text-fxink sm:text-4xl lg:text-[2.85rem]">
                Cómo funciona el Dropshipping:{" "}
                <span className="text-fxblue">tú no compras stock</span>
              </h2>
              <p className="mt-2 hidden text-sm text-[var(--muted)] sm:block lg:mt-3 lg:text-base">
                Desliza para ver paso a paso cómo nos apalancamos al 100% en las
                plantas, pasarelas y almacenes de FuXion en 34 países:
              </p>

              {/* Lista lateral interactiva solo en Desktop (en celular va debajo de la animación) */}
              <ol className="mt-6 hidden space-y-3.5 lg:block">
                {STEPS.map((s, i) => {
                  const isActive = activeIdx === i;
                  return (
                    <li key={s.n}>
                      <button
                        type="button"
                        onClick={() => jumpToStep(i)}
                        className={`flex w-full items-start gap-3.5 rounded-2xl border p-3.5 text-left transition ${
                          isActive
                            ? "border-fxblue bg-white shadow-lg"
                            : "border-transparent bg-white/50 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <span
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-sm font-extrabold transition ${
                            isActive
                              ? "bg-fxblue text-white shadow"
                              : "bg-fxsky text-fxink"
                          }`}
                        >
                          {s.n}
                        </span>
                        <div>
                          <p className="font-display text-base font-extrabold text-fxink">
                            {s.title.replace(/^\d+\.\s*/, "")}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
                            {s.desc}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* ESCENARIO DE CÁMARA ZOOM + FLECHA VIAJERA (Visible de inmediato en celular y PC) */}
            <div className="order-2 mx-auto w-full max-w-[540px]">
              <div className="relative overflow-hidden rounded-[28px] border border-slate-800 bg-[#07131d] p-4 text-white shadow-[0_28px_65px_-20px_rgba(7,19,29,0.75)] sm:rounded-[32px] sm:p-6">
                {/* Barras superiores tipo Stories (tocables) */}
                <div className="grid grid-cols-4 gap-2">
                  {STEPS.map((s, i) => (
                    <button
                      key={s.n}
                      type="button"
                      onClick={() => jumpToStep(i)}
                      className="group text-left focus:outline-none"
                    >
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                        <div
                          className={`story-fill story-fill-${i} h-full origin-left rounded-full ${
                            i === 3
                              ? "bg-fxlime"
                              : i === 2
                              ? "bg-amber-400"
                              : "bg-sky-400"
                          }`}
                        />
                      </div>
                      <span
                        className={`mt-1.5 block truncate font-display text-[11px] font-bold transition sm:text-xs ${
                          activeIdx === i
                            ? "text-white"
                            : "text-white/45 group-hover:text-white/75"
                        }`}
                      >
                        {s.n} · {s.shortLabel}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Ventana de Cámara: 1 solo cuadro gigante a la vez + puente de flecha animada */}
                <div className="relative mt-4 flex min-h-[285px] items-center justify-center sm:min-h-[325px]">
                  {/* Glow de fondo sutil */}
                  <div className="pointer-events-none absolute inset-6 rounded-full bg-fxblue/15 blur-3xl" />

                  {/* Los 4 Cuadros Protagonistas con Letras Grandes */}
                  {STEPS.map((s, i) => (
                    <div
                      key={s.n}
                      className={`zoom-card-${i} ${
                        i === 0 ? "relative" : "absolute inset-0"
                      } flex w-full flex-col justify-between rounded-3xl border-2 bg-gradient-to-br p-5 shadow-2xl sm:p-7 ${
                        s.borderClass
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 font-display text-[11px] font-extrabold tracking-wide sm:text-xs ${s.roleClass}`}
                          >
                            {s.roleBadge}
                          </span>
                          <span className="font-display text-xs font-extrabold text-white/45">
                            PASO {s.n}/04
                          </span>
                        </div>

                        <div className="mt-4 flex items-center gap-3.5">
                          <span
                            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-3xl shadow-inner sm:h-16 sm:w-16 sm:text-4xl"
                            aria-hidden
                          >
                            {s.icon}
                          </span>
                          <h3 className="font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                            {s.title}
                          </h3>
                        </div>

                        <p className="mt-3.5 text-[15px] leading-relaxed text-white/90 sm:text-lg">
                          {s.desc}
                        </p>
                      </div>

                      <div
                        className={`mt-5 rounded-2xl border px-4 py-3 font-display text-sm font-extrabold sm:text-base ${s.highlightClass}`}
                      >
                        {s.highlight}
                      </div>
                    </div>
                  ))}

                  {/* Las 3 Flechas Luminosas de Transición entre Cuadros */}
                  {STEPS.slice(0, 3).map((s, i) => (
                    <div
                      key={`arrow-${s.n}`}
                      aria-hidden
                      className={`arrow-bridge arrow-bridge-${i} pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl bg-[#07131d]/92 px-6 text-center backdrop-blur-sm`}
                    >
                      <span
                        className="mb-3 grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-3xl shadow-lg"
                      >
                        {s.arrowIcon}
                      </span>
                      <p className="font-display text-lg font-extrabold text-white sm:text-xl">
                        {s.arrowLabel}
                      </p>
                      <div className="relative mt-4 w-full max-w-[260px]">
                        <svg
                          viewBox="0 0 240 44"
                          className="w-full overflow-visible"
                        >
                          <path
                            className={`arrow-stroke arrow-stroke-${i}`}
                            d="M 14 22 L 214 22"
                            stroke={s.arrowColor}
                            strokeWidth="6"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            className={`arrow-head arrow-head-${i}`}
                            d="M 202 10 L 224 22 L 202 34"
                            stroke={s.arrowColor}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                        <span
                          className={`arrow-traveler arrow-traveler-${i} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-0.5 font-display text-xs font-black text-slate-950 shadow-lg`}
                          style={{ backgroundColor: s.arrowColor }}
                        >
                          PASO 0{i + 1} → 0{i + 2}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Barra inferior del escenario */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3.5">
                  <span className="text-xs font-semibold text-white/70">
                    ✓ Sin almacén · Sin envíos manuales · 34 países
                  </span>
                  <EnrollLink
                    source="dropshipping-zoom-stage"
                    className="btn btn-lime shine !px-4 !py-2 text-xs sm:text-sm"
                  >
                    Activar mi Tienda →
                  </EnrollLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESGLOSE DE TEXTO EN CELULAR: Aparece DESPUÉS de haber visto el efecto animado */}
      <div className="wrap pb-16 pt-4 lg:hidden">
        <p className="mb-4 font-display text-sm font-extrabold uppercase tracking-wider text-fxbluedeep">
          Resumen de los 4 pasos del sistema sin stock:
        </p>
        <ol className="grid gap-3.5 sm:grid-cols-2">
          {STEPS.map((s) => (
            <li key={`mob-${s.n}`} className="card p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-fxblue font-display text-xs font-extrabold text-white">
                  {s.n}
                </span>
                <p className="font-display text-base font-extrabold text-fxink">
                  {s.title.replace(/^\d+\.\s*/, "")}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
