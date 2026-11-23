"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SplitHeading from "../SplitHeading";
import { formatLocal, useGeo } from "@/lib/countries";

export interface ProductOrbitItem {
  slug: string;
  name: string;
  img: string;
  pointsPv: number;
  category: string;
  sticks: string;
  audience: string;
  href: string;
}

export default function ProductSalesOrbit({
  items,
}: {
  items: ProductOrbitItem[];
}) {
  const [active, setActive] = useState(0);
  const { country } = useGeo();
  const cur = items[active] || items[0];

  // Comisión referencial estimada por unidad al 40% sobre base neta proporcional a PV
  const estProfitLocal = (cur.pointsPv / 20) * country.avgBoxLocal * 0.82 * 0.4;

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
      <div>
        <span className="eyebrow" data-reveal>
          Catálogo Oficial de Alta Recompra
        </span>
        <SplitHeading
          text="Productos reales que"
          accent={{ text: "se reponen cada 28 días", className: "text-fxblue" }}
          className="section-title mt-3"
        />
        <p className="mt-4 text-[var(--muted)]" data-reveal>
          Haz clic en cualquier bebida de la órbita para ver sus{" "}
          <strong>Puntos Volumen (PV)</strong>, su perfil comprador y cuánto
          representa de forma referencial al comercializarla por tu Tienda
          Virtual sin stock.
        </p>

        {/* Active Product Detail Card */}
        <div className="card spot mt-6 p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[var(--line)] bg-fxsky p-1.5">
              <Image
                src={cur.img}
                alt={cur.name}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </div>
            <div>
              <span className="rounded-full bg-fxsky px-2.5 py-0.5 text-[11px] font-bold text-fxbluedeep">
                {cur.category} · {cur.sticks}
              </span>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-fxink">
                {cur.name}
              </h3>
              <p className="text-xs font-bold text-emerald-700">
                Suma {cur.pointsPv} PV por unidad · Ganancia ref. al 40%: ~
                {formatLocal(estProfitLocal, country)}*
              </p>
            </div>
          </div>
          <p className="mt-3.5 text-sm text-[var(--muted)]">{cur.audience}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link href={cur.href} className="btn btn-buy !px-4 !py-2 text-xs">
              Cómo vender {cur.name} →
            </Link>
            <Link
              href="/vender-productos-fuxion/"
              className="btn btn-ghost !px-4 !py-2 text-xs"
            >
              Ver los 60 productos
            </Link>
          </div>
        </div>
      </div>

      {/* Rotating 360 Orbit */}
      <div className="mx-auto w-full max-w-[440px] py-4">
        <div className="orbit">
          <div className="orbit-ring" />
          <div className="orbit-ring r2" />
          <div className="absolute inset-[28%] grid place-items-center rounded-full border border-[var(--line)] bg-white p-4 text-center shadow-xl">
            <div>
              <Image
                src="/img/productos-fuxion/logo-fuxion-azul.webp"
                alt="FuXion Nutracéuticos"
                width={110}
                height={36}
                className="mx-auto h-auto w-24 object-contain"
              />
              <p className="mt-1.5 text-[11px] font-bold text-[var(--muted)]">
                Recompra cada 4 semanas
              </p>
            </div>
          </div>

          <div className="orbit-spin">
            {items.map((it, idx) => {
              const angle = (idx / items.length) * Math.PI * 2 - Math.PI / 2;
              const radiusPct = 42;
              const left = `${50 + Math.cos(angle) * radiusPct}%`;
              const top = `${50 + Math.sin(angle) * radiusPct}%`;
              const isSelected = idx === active;
              return (
                <div
                  key={it.slug}
                  className="orbit-item absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left, top }}
                >
                  <button
                    type="button"
                    onClick={() => setActive(idx)}
                    aria-label={`Ver datos comerciales de ${it.name}`}
                    className={`group flex flex-col items-center rounded-2xl border p-2 transition ${
                      isSelected
                        ? "scale-110 border-fxblue bg-white shadow-xl"
                        : "border-[var(--line)] bg-white/95 shadow-md hover:border-fxblue"
                    }`}
                  >
                    <span className="relative block h-11 w-11 overflow-hidden rounded-xl bg-fxsky">
                      <Image
                        src={it.img}
                        alt={it.name}
                        fill
                        sizes="44px"
                        className="object-contain p-0.5"
                      />
                    </span>
                    <span className="mt-1 max-w-[76px] truncate font-display text-[10px] font-extrabold text-fxink">
                      {it.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
