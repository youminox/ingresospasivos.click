"use client";

import Image from "next/image";
import Link from "next/link";
import EnrollLink from "./EnrollLink";
import CountrySelector from "./CountrySelector";
import { formatLocalFromUsd, useGeo } from "@/lib/countries";
import type { FuxionProduct } from "@/lib/content";

export default function OpportunityBox({
  source,
  product,
  variant = "inline",
}: {
  source: string;
  product?: FuxionProduct;
  variant?: "top" | "inline" | "sidebar";
}) {
  const { country } = useGeo();
  const pro1Ref = formatLocalFromUsd(240, country);
  const pro2Ref = formatLocalFromUsd(720, country);

  if (variant === "sidebar") {
    return (
      <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-b from-[#07131d] to-[#0b273d] p-5 text-white shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-fxlime/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-fxlime">
            {country.flag} {country.name}
          </span>
          <span className="text-[11px] text-white/65">{country.currency}</span>
        </div>
        <p className="mt-3 font-display text-lg font-extrabold leading-tight">
          Emprende con FuXion: Dropshipping o Red
        </p>
        <p className="mt-2 text-xs leading-relaxed text-white/75">
          Sin comprar stock obligatorio. Proyección mensual referencial:
        </p>
        <div className="mt-3 space-y-2 rounded-2xl bg-white/8 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-white/75">Ruta Ventas Pro 1:</span>
            <strong className="text-fxlime">~{pro1Ref}*</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/75">Ruta Equipo Pro 2:</span>
            <strong className="text-amber-300">~{pro2Ref}*</strong>
          </div>
        </div>
        <EnrollLink
          source={`sidebar-${source}`}
          className="btn btn-lime shine mt-4 w-full !py-3 text-xs"
        >
          Inscribirme en FuXion →
        </EnrollLink>
        <Link
          href="/calculadora-de-ingresos/"
          className="btn btn-glass mt-2 w-full !py-2.5 text-xs"
        >
          🧮 Abrir Calculadora IA
        </Link>
        <p className="mt-3 text-[10px] leading-snug text-white/55">
          *Importes estrictamente referenciales e ilustrativos; pueden variar
          según país y volumen real comercializado. Dudas:
          info@charlielingan.com
        </p>
      </div>
    );
  }

  return (
    <section className="my-8 overflow-hidden rounded-3xl border border-fxblue/25 bg-gradient-to-br from-fxsky via-white to-[#f5fce6] p-6 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div>
          <span className="eyebrow">Oportunidad Dual FuXion</span>
          <h3 className="mt-1 font-display text-xl font-extrabold text-fxink">
            {product
              ? `Distribuye ${product.name} (${product.pointsPv} PV) sin comprar stock`
              : "Genera ingresos referenciales por Dropshipping o Red de Afiliados"}
          </h3>
        </div>
        <CountrySelector variant="light" compact />
      </div>

      <div
        className={`mt-5 grid items-center gap-6 ${
          product ? "md:grid-cols-[150px_1fr]" : ""
        }`}
      >
        {product && product.image && (
          <div className="relative mx-auto aspect-square w-[140px] overflow-hidden rounded-2xl border border-[var(--line)] bg-white p-2 shadow-sm">
            <Image
              src={product.image}
              alt={`${product.name} oficial FuXion`}
              fill
              sizes="140px"
              className="object-contain p-2"
            />
          </div>
        )}
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-fxbluedeep">
                1. Solo Venta de Productos (Pro 1)
              </p>
              <p className="mt-1 font-display text-lg font-extrabold text-fxink">
                ~{pro1Ref} / mes*
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                20%–50% venta directa + Bono Pro 1 (500 PV con 6 Clientes
                Preferentes) vía Tienda Virtual.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                2. Ventas + Red de Afiliados (Pro 2)
              </p>
              <p className="mt-1 font-display text-lg font-extrabold text-fxink">
                ~{pro2Ref}+ / mes*
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Ayudando a 4 socios directos a calificar a Pro 1 con el soporte
                del equipo de Charlie Lingan.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <EnrollLink
              source={`${variant}-${source}`}
              className="btn btn-lime shine !px-5 !py-2.5 text-sm"
            >
              Hacer clic aquí para registrarme →
            </EnrollLink>
            <Link
              href="/calculadora-de-ingresos/"
              className="btn btn-ghost !px-4 !py-2.5 text-sm"
            >
              Simular en Calculadora IA
            </Link>
            {product && (
              <EnrollLink
                source={`prod-try-${source}`}
                mode="product"
                customUrl={product.shopUrl}
                productSlug={product.slug}
                productName={product.name}
                className="text-xs font-bold text-fxbluedeep underline hover:text-fxblue"
              >
                O ver {product.name} como cliente en tienda oficial ↗
              </EnrollLink>
            )}
          </div>
          <p className="mt-2.5 text-[11px] text-[var(--muted)]">
            *Montos referenciales en {country.name} ({country.currency}); pueden
            variar según catálogo, puntos PV e impuestos. No garantizan sueldo
            fijo.
          </p>
        </div>
      </div>
    </section>
  );
}
