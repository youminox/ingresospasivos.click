"use client";

import Image from "next/image";
import { useState } from "react";

export default function DropshippingComparisonSlider() {
  const [pos, setPos] = useState(52);

  return (
    <div className="daynight border border-[var(--line)] bg-[#07131d] shadow-2xl">
      <div className="relative aspect-[16/9] min-h-[290px] w-full overflow-hidden sm:aspect-[21/9]">
        {/* Right Layer (Modern FuXion Dropshipping) */}
        <Image
          src="/img/ambiente/home-dropshipping-laptop.webp"
          alt="Emprendedor operando tienda virtual FuXion sin inventario acumulado"
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07131d]/90 via-[#07131d]/30 to-transparent" />
        <div className="absolute bottom-5 right-5 max-w-xs rounded-2xl border border-fxlime/40 bg-[#07131d]/85 p-4 text-right text-white backdrop-blur sm:bottom-8 sm:right-8">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-fxlime">
            ✓ Sistema FuXion Dropshipping
          </span>
          <p className="mt-1 font-display text-base font-extrabold sm:text-lg">
            $0 en stock acumulado · 34 países
          </p>
          <p className="mt-0.5 text-xs text-white/75">
            FuXion cobra, empaca en planta y entrega al cliente.
          </p>
        </div>

        {/* Left Clipped Layer (Traditional Stock E-commerce) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src="/img/ambiente/home-comparativa-stock.webp"
            alt="Comercio tradicional con cajas de inventario acumuladas y envíos manuales"
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
          <div className="absolute bottom-5 left-5 max-w-xs rounded-2xl border border-amber-400/40 bg-slate-950/85 p-4 text-white backdrop-blur sm:bottom-8 sm:left-8">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
              ✕ Venta Tradicional con Inventario
            </span>
            <p className="mt-1 font-display text-base font-extrabold sm:text-lg">
              Capital atrapado en cajas y envíos
            </p>
            <p className="mt-0.5 text-xs text-white/75">
              Riesgo de vencimiento, almacenaje, cobros y reparto propio.
            </p>
          </div>
        </div>

        {/* Divider Line */}
        <div
          className="pointer-events-none absolute inset-y-0 w-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)]"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-fxblue bg-white font-display text-xs font-black text-fxink shadow-xl">
            ↔
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white px-6 py-4">
        <span className="text-xs font-bold text-amber-700">
          ← Con Stock Físico
        </span>
        <div className="flex-1">
          <input
            type="range"
            aria-label="Comparar negocio tradicional con stock frente a Dropshipping FuXion"
            min={8}
            max={92}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
          />
        </div>
        <span className="text-xs font-bold text-emerald-700">
          Dropshipping FuXion →
        </span>
      </div>
    </div>
  );
}
