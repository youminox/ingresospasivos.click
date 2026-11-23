"use client";

import { useEffect, useRef } from "react";
import EnrollLink from "../EnrollLink";

const STEPS = [
  {
    n: "01",
    t: "Activas tu Tienda Virtual FuXion",
    d: "Te registras como distribuidor independiente y recibes al instante tu e-commerce oficial replicado en 34 países, sin pagar servidores ni inventario.",
  },
  {
    n: "02",
    t: "Compartes tu Link Personalizado",
    d: "Recomiendas la bebida ideal por WhatsApp, redes sociales o contenido SEO enviando tu enlace directo de Cliente Preferente.",
  },
  {
    n: "03",
    t: "FuXion Cobra, Empaca y Envía desde Planta",
    d: "El cliente paga online en su moneda local. FuXion factura, prepara el pedido sellado en su almacén y lo entrega en la puerta del comprador.",
  },
  {
    n: "04",
    t: "Tú Sumas Puntos PV y Cobras Comisiones",
    d: "El sistema acredita automáticamente los Puntos Volumen (PV) a tu código y deposita tus comisiones referenciales (20%–50% + Bono Pro 1) en tu cuenta bancaria.",
  },
];

export default function DropshippingScrollStory() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
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
        if (reduce) {
          gsap.set(q(".ds-node, .ds-line, .ds-badge"), { opacity: 1 });
          gsap.set(q(".bar"), { scaleX: 1 });
          return;
        }
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=1900",
            scrub: 0.65,
            pin: q(".pin")[0],
            anticipatePin: 1,
          },
        });
        tl.to(q(".bar"), { scaleX: 1, duration: 3.2, ease: "none" }, 0)
          .to(q(".step-0 .dot"), { backgroundColor: "#0093DD", color: "#fff", duration: 0.3 }, 0)
          .fromTo(q(".node-1"), { scale: 0.85, opacity: 0.35 }, { scale: 1, opacity: 1, duration: 0.5 }, 0)
          .to(q(".line-1"), { strokeDashoffset: 0, opacity: 1, duration: 0.6 }, 0.4)
          .to(q(".step-1 .dot"), { backgroundColor: "#0093DD", color: "#fff", duration: 0.3 }, 0.8)
          .fromTo(q(".node-2"), { scale: 0.85, opacity: 0.35 }, { scale: 1, opacity: 1, duration: 0.5 }, 0.8)
          .to(q(".line-2"), { strokeDashoffset: 0, opacity: 1, duration: 0.6 }, 1.3)
          .to(q(".step-2 .dot"), { backgroundColor: "#F59E0B", color: "#111", duration: 0.3 }, 1.6)
          .fromTo(q(".node-3"), { scale: 0.85, opacity: 0.35 }, { scale: 1, opacity: 1, duration: 0.5 }, 1.6)
          .to(q(".line-3"), { strokeDashoffset: 0, opacity: 1, duration: 0.6 }, 2.1)
          .to(q(".step-3 .dot"), { backgroundColor: "#8CC63F", color: "#1b2d04", duration: 0.3 }, 2.4)
          .fromTo(q(".node-4"), { scale: 0.85, opacity: 0.35 }, { scale: 1, opacity: 1, duration: 0.5 }, 2.4)
          .fromTo(q(".ds-badge"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 2.7);
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

  return (
    <section
      id="como-funciona-dropshipping"
      ref={root}
      className="relative bg-gradient-to-b from-fxsky via-white to-fxsky"
    >
      <div className="pin flex min-h-[100svh] items-center overflow-hidden py-12">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <span className="eyebrow">Apalancamiento Logístico FuXion</span>
            <h2 className="section-title mt-3">
              Cómo funciona el Dropshipping:{" "}
              <span className="text-fxblue">tú no compras stock</span>
            </h2>
            <p className="mt-3 text-[var(--muted)]">
              Desliza para ver cómo nos apalancamos al 100% en las plantas,
              pasarelas y almacenes de FuXion en 34 países:
            </p>
            <div className="mt-4 h-1.5 w-full max-w-md overflow-hidden rounded bg-[var(--line)]">
              <div className="bar h-full origin-left scale-x-0 bg-gradient-to-r from-fxblue via-amber-400 to-fxlime" />
            </div>

            <ol className="mt-6 space-y-4">
              {STEPS.map((s, i) => (
                <li key={s.n} className={`step-${i} flex items-start gap-3.5`}>
                  <span className="dot grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white font-display text-sm font-extrabold text-fxink shadow-md transition-colors">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-display text-base font-extrabold sm:text-lg">
                      {s.t}
                    </p>
                    <p className="text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
                      {s.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Interactive Animated SVG Diagram */}
          <div className="mx-auto w-full max-w-[500px] rounded-[32px] border border-[var(--line)] bg-[#07131d] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
              <span className="font-display font-bold text-fxlime">
                ⚡ Flujo Cero Inventario Acumulado
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px]">
                34 Países Activos
              </span>
            </div>

            <svg
              viewBox="0 0 440 360"
              className="mt-4 w-full"
              role="img"
              aria-label="Diagrama visual del sistema de Dropshipping FuXion en 4 pasos sin stock"
            >
              {/* Connecting Animated Paths */}
              <path
                className="ds-line line-1"
                d="M195 75 L255 75"
                stroke="#0093DD"
                strokeWidth="4"
                strokeDasharray="80"
                strokeDashoffset="80"
                strokeLinecap="round"
                fill="none"
              />
              <path
                className="ds-line line-2"
                d="M335 125 L335 195"
                stroke="#F59E0B"
                strokeWidth="4"
                strokeDasharray="90"
                strokeDashoffset="90"
                strokeLinecap="round"
                fill="none"
              />
              <path
                className="ds-line line-3"
                d="M255 245 L195 245"
                stroke="#8CC63F"
                strokeWidth="4"
                strokeDasharray="80"
                strokeDashoffset="80"
                strokeLinecap="round"
                fill="none"
              />

              {/* Node 1: Tu Celular / Link */}
              <g className="ds-node node-1">
                <rect
                  x="22"
                  y="28"
                  width="172"
                  height="96"
                  rx="18"
                  fill="#0f2940"
                  stroke="#0093DD"
                  strokeWidth="2"
                />
                <text x="40" y="58" fontSize="22">
                  📱
                </text>
                <text
                  x="72"
                  y="56"
                  fill="#fff"
                  fontSize="13"
                  fontWeight="800"
                  fontFamily="Outfit, sans-serif"
                >
                  1. Tu Tienda Online
                </text>
                <text x="40" y="80" fill="#9cc7de" fontSize="10.5">
                  Compartes tu link oficial
                </text>
                <text x="40" y="96" fill="#8CC63F" fontSize="10" fontWeight="700">
                  Stock comprado por ti: 0 cajas
                </text>
              </g>

              {/* Node 2: Cliente Final */}
              <g className="ds-node node-2" opacity="0.45">
                <rect
                  x="255"
                  y="28"
                  width="165"
                  height="96"
                  rx="18"
                  fill="#0f2940"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <text x="272" y="58" fontSize="22">
                  🛒
                </text>
                <text
                  x="304"
                  y="56"
                  fill="#fff"
                  fontSize="13"
                  fontWeight="800"
                  fontFamily="Outfit, sans-serif"
                >
                  2. Cliente Compra
                </text>
                <text x="272" y="80" fill="#9cc7de" fontSize="10.5">
                  Paga con tarjeta / medio
                </text>
                <text x="272" y="96" fill="#38bdf8" fontSize="10" fontWeight="700">
                  En su propia moneda local
                </text>
              </g>

              {/* Node 3: Planta & Logística FuXion */}
              <g className="ds-node node-3" opacity="0.45">
                <rect
                  x="255"
                  y="196"
                  width="165"
                  height="102"
                  rx="18"
                  fill="#1f2414"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />
                <text x="272" y="226" fontSize="22">
                  🏭
                </text>
                <text
                  x="304"
                  y="224"
                  fill="#fff"
                  fontSize="13"
                  fontWeight="800"
                  fontFamily="Outfit, sans-serif"
                >
                  3. FuXion Despacha
                </text>
                <text x="272" y="248" fill="#fde68a" fontSize="10.5">
                  Cobra, factura, empaca
                </text>
                <text x="272" y="264" fill="#fbbf24" fontSize="10" fontWeight="700">
                  y entrega en casa del cliente
                </text>
              </g>

              {/* Node 4: Tu Banco / Comisión */}
              <g className="ds-node node-4" opacity="0.45">
                <rect
                  x="22"
                  y="196"
                  width="172"
                  height="102"
                  rx="18"
                  fill="#132a17"
                  stroke="#8CC63F"
                  strokeWidth="2"
                />
                <text x="40" y="226" fontSize="22">
                  💰
                </text>
                <text
                  x="72"
                  y="224"
                  fill="#fff"
                  fontSize="13"
                  fontWeight="800"
                  fontFamily="Outfit, sans-serif"
                >
                  4. Tu Comisión*
                </text>
                <text x="40" y="248" fill="#d9f99d" fontSize="10.5">
                  Sumas PV + 20% a 50%
                </text>
                <text x="40" y="264" fill="#8CC63F" fontSize="10" fontWeight="700">
                  + Bono Pro 1 en tu banco
                </text>
              </g>

              {/* Bottom Summary Pill */}
              <g className="ds-badge" opacity="0">
                <rect
                  x="45"
                  y="316"
                  width="350"
                  height="32"
                  rx="16"
                  fill="rgba(140,198,63,0.18)"
                  stroke="#8CC63F"
                />
                <text
                  x="220"
                  y="336"
                  textAnchor="middle"
                  fill="#d9f99d"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="Outfit, sans-serif"
                >
                  ✓ Sin almacén · Sin envíos manuales · Sin riesgo de stock
                </text>
              </g>
            </svg>

            <div className="mt-4 flex items-center justify-between gap-3 pt-2">
              <p className="text-[11px] text-white/60">
                *Porcentajes referenciales sobre volumen CV.
              </p>
              <EnrollLink
                source="dropshipping-diagram"
                className="btn btn-lime shine !px-4 !py-2 text-xs"
              >
                Activar mi Tienda →
              </EnrollLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
