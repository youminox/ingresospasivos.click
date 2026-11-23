"use client";

import Link from "next/link";
import CountrySelector from "../CountrySelector";
import EnrollLink from "../EnrollLink";
import SplitHeading from "../SplitHeading";
import { formatLocalFromUsd, useGeo } from "@/lib/countries";

export default function Pro1Pro2GeoSection() {
  const { country } = useGeo();

  const pro1BonusLow = formatLocalFromUsd(50, country);
  const pro1BonusHigh = formatLocalFromUsd(100, country);
  const pro1TotalEst = formatLocalFromUsd(240, country);
  const pro2Bonus = formatLocalFromUsd(200, country);
  const pro2TotalEst = formatLocalFromUsd(720, country);
  const pro3Bonus = formatLocalFromUsd(500, country);

  return (
    <section
      id="pro1-pro2"
      className="relative isolate overflow-hidden bg-[#07131d] py-24 text-white"
    >
      <div className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-fxblue/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-fxlime/20 blur-3xl" />
      <div className="hero-grid opacity-45" />

      <div className="wrap relative">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow !text-fxlime" data-reveal>
              Plan de Pagos Pro-Lev Geolocalizado
            </span>
            <SplitHeading
              text="Comisiones de venta,"
              accent={{ text: "Bono Pro 1 y Pro 2", className: "text-gradient" }}
              className="section-title mt-3"
            />
            <p className="mt-4 text-white/75" data-reveal>
              Selecciona cualquiera de los <strong>34 países donde opera FuXion</strong>{" "}
              para visualizar los importes aproximados en tu moneda local (
              <strong>
                {country.flag} {country.name} · {country.currency}
              </strong>
              ). Todas las cifras son referenciales y pueden variar.
            </p>
          </div>
          <CountrySelector variant="dark" />
        </div>

        {/* Escalera de Venta Directa */}
        <div
          className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          data-reveal
        >
          {[
            ["0 – 99 PV", "20%", "Arranque inmediato desde tu primera venta online"],
            ["100 – 299 PV", "25%", "Unas 5 a 14 cajas acumuladas en 4 semanas"],
            ["300 – 499 PV", "30%", "Escalón intermedio de cartera recurrente"],
            ["500+ PV (Pro 1)", "40% – 50%", "Máximo tramo comercial + Bono en efectivo*"],
          ].map(([pv, pct, desc], idx) => (
            <div
              key={pv}
              className={`rounded-2xl border p-5 ${
                idx === 3
                  ? "border-fxlime/60 bg-gradient-to-br from-fxlime/20 to-fxblue/20"
                  : "border-white/12 bg-white/6"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-white/65">
                {pv}
              </span>
              <p className="mt-1 font-display text-3xl font-extrabold text-fxlime">
                {pct}
              </p>
              <p className="mt-1.5 text-xs text-white/75">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bloques Visuales Pro 1 y Pro 2 */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* PRO 1 */}
          <div
            className="spot spot-dark rounded-3xl border border-white/15 bg-white/7 p-7 backdrop-blur"
            data-reveal
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-fxlime px-3.5 py-1 font-display text-xs font-extrabold text-[#1b2d04]">
                ESCALÓN 1 · VENTA DIRECTA
              </span>
              <span className="text-xs font-bold text-white/70">
                Ciclo 4 semanas
              </span>
            </div>
            <h3 className="mt-4 font-display text-3xl font-extrabold">
              Bono Cliente Preferente{" "}
              <span className="text-fxlime">PRO 1</span>
            </h3>
            <p className="mt-2 text-sm text-white/80">
              El cimiento de estabilidad comercial en FuXion. Ideal incluso si{" "}
              <strong>solo quieres vender productos sin afiliar socios</strong>.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-[#041019]/75 p-4 text-xs">
              <div>
                <p className="text-white/60">Requisito de Volumen</p>
                <p className="mt-0.5 font-display text-base font-extrabold text-white">
                  500+ PV en Clientes
                </p>
              </div>
              <div>
                <p className="text-white/60">Cartera Mínima</p>
                <p className="mt-0.5 font-display text-base font-extrabold text-white">
                  6 Clientes (&ge;35 PV c/u)
                </p>
              </div>
              <div>
                <p className="text-white/60">Bono Extra Pro 1 ({country.currency})</p>
                <p className="mt-0.5 font-display text-base font-extrabold text-fxlime">
                  +{pro1BonusLow} a {pro1BonusHigh}*
                </p>
              </div>
              <div>
                <p className="text-white/60">Comisión + Bono Estimado</p>
                <p className="mt-0.5 font-display text-base font-extrabold text-amber-300">
                  ~{pro1TotalEst} / período*
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-xs text-white/80">
              <li>
                ✓ 100% lograble mediante tu enlace de Tienda Virtual
                (Dropshipping).
              </li>
              <li>
                ✓ Suele incluir producto de recompensa gratis según mercado
                vigente.
              </li>
            </ul>
          </div>

          {/* PRO 2 */}
          <div
            className="spot spot-dark rounded-3xl border border-amber-400/35 bg-gradient-to-br from-amber-500/12 via-white/6 to-fxblue/15 p-7 backdrop-blur"
            data-reveal
            data-reveal-delay="1"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-amber-400 px-3.5 py-1 font-display text-xs font-extrabold text-slate-950">
                ESCALÓN 2 · DUPLICACIÓN Y EQUIPO
              </span>
              <span className="text-xs font-bold text-amber-200">
                Tú + 4 Socios Directos
              </span>
            </div>
            <h3 className="mt-4 font-display text-3xl font-extrabold">
              Bono de Liderazgo <span className="text-amber-300">PRO 2</span>
            </h3>
            <p className="mt-2 text-sm text-white/80">
              Premia enseñar a otros a ganar con sus clientes. Además habilita
              la ruta hacia <strong>Pro 3 (+{pro3Bonus}*)</strong> y{" "}
              <strong>Leader X</strong>.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-[#041019]/75 p-4 text-xs">
              <div>
                <p className="text-white/60">Tu Calificación</p>
                <p className="mt-0.5 font-display text-base font-extrabold text-white">
                  Mantener tu Pro 1
                </p>
              </div>
              <div>
                <p className="text-white/60">Estructura de Equipo</p>
                <p className="mt-0.5 font-display text-base font-extrabold text-white">
                  4 Directos en Pro 1
                </p>
              </div>
              <div>
                <p className="text-white/60">Bono Extra Pro 2 ({country.currency})</p>
                <p className="mt-0.5 font-display text-base font-extrabold text-amber-300">
                  +{pro2Bonus} adicionales*
                </p>
              </div>
              <div>
                <p className="text-white/60">Total Integrado Estimado</p>
                <p className="mt-0.5 font-display text-base font-extrabold text-fxlime">
                  ~{pro2TotalEst}+ / período*
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-xs text-white/80">
              <li>
                ✓ Nuestro equipo de mentores te ayuda a presentar el negocio a
                tus prospectos.
              </li>
              <li>
                ✓ Suma además Bono Pack Profesional, Bono Familia y Bono Balance
                Binario.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/12 bg-white/5 p-5 text-xs text-white/70">
          <p>
            *Nota de transparencia: Conversiones a{" "}
            <strong>
              {country.name} ({country.currency})
            </strong>{" "}
            calculadas con fines estrictamente referenciales. Los valores
            oficiales de puntos PV/CV y tablas de pago vigentes los define
            FuXion en cada país.
          </p>
          <div className="flex flex-wrap gap-3">
            <EnrollLink
              source="pro1-pro2-cta"
              className="btn btn-lime shine !px-5 !py-2.5 text-xs"
            >
              Registrarme Ahora →
            </EnrollLink>
            <Link
              href="/plan-de-pagos-y-bonos-fuxion/"
              className="btn btn-glass !px-4 !py-2.5 text-xs"
            >
              Ver las 90 guías de Bonos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
