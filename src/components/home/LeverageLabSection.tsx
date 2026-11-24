"use client";

import { useEffect, useState } from "react";
import CountrySelector from "../CountrySelector";
import EnrollLink from "../EnrollLink";
import { formatLocalFromUsd, useGeo } from "@/lib/countries";

type LabMode = "race" | "infra" | "snowball";

interface TargetDestination {
  code: string;
  flag: string;
  city: string;
  countryName: string;
  currencyLabel: string;
  sanitaryAgency: string;
  orderExample: string;
}

const DESTINATIONS: TargetDestination[] = [
  {
    code: "ES",
    flag: "🇪🇸",
    city: "Madrid",
    countryName: "España (Unión Europea)",
    currencyLabel: "Euros (€)",
    sanitaryAgency: "Normativa Alimentaria UE",
    orderExample: "1 Thermo T3 + 1 Prunex1 (30 PV)",
  },
  {
    code: "US",
    flag: "🇺🇸",
    city: "Miami",
    countryName: "Estados Unidos",
    currencyLabel: "Dólares (US$)",
    sanitaryAgency: "Regulación FDA EE. UU.",
    orderExample: "1 Beauty-In + 1 Vita Xtra T+ (45 PV)",
  },
  {
    code: "MX",
    flag: "🇲🇽",
    city: "Ciudad de México",
    countryName: "México",
    currencyLabel: "Pesos Mexicanos (MX$)",
    sanitaryAgency: "Registro COFEPRIS",
    orderExample: "2 Thermo T3 + 1 NoCarb-T (60 PV)",
  },
  {
    code: "PE",
    flag: "🇵🇪",
    city: "Lima",
    countryName: "Perú",
    currencyLabel: "Soles (S/)",
    sanitaryAgency: "Registro DIGESA / DIGEMID",
    orderExample: "1 Prunex1 + 1 Vita Xtra T+ + 1 No Stress (52 PV)",
  },
  {
    code: "CO",
    flag: "🇨🇴",
    city: "Bogotá",
    countryName: "Colombia",
    currencyLabel: "Pesos (COP $)",
    sanitaryAgency: "Registro INVIMA",
    orderExample: "1 Beauty-In + 1 Thermo T3 (45 PV)",
  },
];

interface MonthStage {
  id: string;
  label: string;
  badge: string;
  reorderClients: number;
  newClients: number;
  teamPartnersPro1: number;
  totalPv: number;
  estimatedUsd: number;
  normalDropshipSales: number;
  headline: string;
  explanation: string;
}

const SNOWBALL_MONTHS: MonthStage[] = [
  {
    id: "m1",
    label: "Mes 1",
    badge: "Meta Pro 1",
    reorderClients: 0,
    newClients: 6,
    teamPartnersPro1: 0,
    totalPv: 500,
    estimatedUsd: 240,
    normalDropshipSales: 6,
    headline: "Mes 1: Tus primeros 6 Clientes Preferentes (28 sticks c/u)",
    explanation:
      "Empiezas compartiendo tu link. Con al menos 6 clientes comprando sus bebidas para el mes alcanzas los 500 PV y activas tu Bono Pro 1 sin haber comprado stock.",
  },
  {
    id: "m3",
    label: "Mes 3",
    badge: "Recompra Activa",
    reorderClients: 9,
    newClients: 5,
    teamPartnersPro1: 1,
    totalPv: 1180,
    estimatedUsd: 430,
    normalDropshipSales: 5,
    headline: "Mes 3: ¡Se acaban los 28 sobres y tus clientes vuelven a pedir!",
    explanation:
      "Mientras en un dropshipping de relojes o ropa tendrías que buscar clientes desde cero otra vez, en FuXion tus clientes de los meses 1 y 2 recompran porque consumieron sus 28 sticks diarios.",
  },
  {
    id: "m6",
    label: "Mes 6",
    badge: "Salto a Pro 2",
    reorderClients: 15,
    newClients: 4,
    teamPartnersPro1: 4,
    totalPv: 2950,
    estimatedUsd: 860,
    normalDropshipSales: 5,
    headline: "Mes 6: Cartera fidelizada + 4 socios directos en Pro 1 (Bono Pro 2)",
    explanation:
      "Varios consumidores satisfechos deciden afiliarse contigo. Con el apoyo del equipo de Charlie Lingan ayudas a 4 directos a lograr su Pro 1 y desbloqueas el Bono Pro 2 más residual.",
  },
  {
    id: "m12",
    label: "Mes 12",
    badge: "Escala & Red",
    reorderClients: 24,
    newClients: 5,
    teamPartnersPro1: 8,
    totalPv: 6400,
    estimatedUsd: 1650,
    normalDropshipSales: 6,
    headline: "Mes 12: Efecto compuesto de recompra nutracéutica en varios países",
    explanation:
      "Tu base de hogares consume cada 4 semanas en automático desde su cuenta vinculada a tu código, mientras tu red duplica bloques hacia Pro 3 y rangos ejecutivos Leader X.",
  },
];

export default function LeverageLabSection() {
  const { country } = useGeo();
  const [mode, setMode] = useState<LabMode>("race");

  // Estado Experiencia 1: Simulador de Pedido Internacional
  const [destIdx, setDestIdx] = useState<number>(0);
  const [raceStep, setRaceStep] = useState<number>(4);
  const [simCount, setSimCount] = useState<number>(0);

  // Estado Experiencia 2: Infraestructura $0 Riesgo
  const [selectedInfra, setSelectedInfra] = useState<number>(0);

  // Estado Experiencia 3: Bola de nieve 28 días
  const [monthIdx, setMonthIdx] = useState<number>(1);

  const dest = DESTINATIONS[destIdx] || DESTINATIONS[0];
  const isCrossBorder = dest.code !== country.code;

  // Animación paso a paso cuando el usuario dispara una simulación
  useEffect(() => {
    if (simCount === 0) return;
    const t1 = setTimeout(() => setRaceStep(1), 80);
    const t2 = setTimeout(() => setRaceStep(2), 520);
    const t3 = setTimeout(() => setRaceStep(3), 980);
    const t4 = setTimeout(() => setRaceStep(4), 1450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [simCount]);

  const triggerRace = (newDestIdx?: number) => {
    if (typeof newDestIdx === "number") setDestIdx(newDestIdx);
    setRaceStep(0);
    setSimCount((c) => c + 1);
  };

  const stockRiskLocal = formatLocalFromUsd(1450, country);
  const infraTotalSavedLocal = formatLocalFromUsd(18500, country);

  const infraItems = [
    {
      icon: "🧪",
      title: "Registros Sanitarios en 34 Países",
      soloCost: formatLocalFromUsd(11000, country) + "+",
      soloPain:
        "Meses de trámites legales ante DIGESA, FDA (EE. UU.), COFEPRIS (México), INVIMA y Unión Europea por cada fórmula.",
      fuxionAdvantage: "100% Cubierto por FuXion",
      fuxionDetail:
        "Todas las bebidas ya cuentan con permisos sanitarios vigentes en cada uno de los 34 mercados oficiales.",
    },
    {
      icon: "🏭",
      title: "Stock de +60 Bebidas en Almacén",
      soloCost: formatLocalFromUsd(3800, country) + "+",
      soloPain:
        "Comprar lotes mínimos, alquilar espacio fresco, controlar fechas de vencimiento y asumir pérdidas por cajas dañadas.",
      fuxionAdvantage: "$0 en Stock Obligatorio",
      fuxionDetail:
        "Todo el catálogo reposa en los centros de distribución de FuXion listo para despacharse cuando entra un pedido.",
    },
    {
      icon: "💳",
      title: "Tienda E-commerce y Pasarelas Bancarias",
      soloCost: formatLocalFromUsd(1900, country) + " / año",
      soloPain:
        "Pagar diseño web, hosting, mensualidades de Shopify, pasarelas multimoneda y asumir fraudes o contracargos.",
      fuxionAdvantage: "Incluida al Afiliarte",
      fuxionDetail:
        "Recibes tu Tienda Virtual replicada lista para cobrar en Soles, Dólares, Euros, Pesos y Reales desde el primer minuto.",
    },
    {
      icon: "🚚",
      title: "Flota Courier y Última Milla Internacional",
      soloCost: formatLocalFromUsd(1800, country) + " operativos",
      soloPain:
        "Imprimir etiquetas, embalar cajas con cinta cada tarde, hacer filas en agencias y responder reclamos de transporte.",
      fuxionAdvantage: "Despacho Directo a Puerta",
      fuxionDetail:
        "FuXion prepara el paquete en el país del comprador y lo envía hasta la puerta de su domicilio u oficina.",
    },
  ];

  const activeInfra = infraItems[selectedInfra] || infraItems[0];
  const curMonth = SNOWBALL_MONTHS[monthIdx] || SNOWBALL_MONTHS[1];

  return (
    <section className="wrap py-24" id="apalancamiento-interactivo">
      {/* Encabezado */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <span className="eyebrow">Laboratorio Interactivo de Negocio</span>
          <h2 className="section-title mt-3">
            Por qué el Sistema FuXion supera al{" "}
            <span className="text-fxblue">comercio tradicional y al dropshipping común</span>
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Interactúa con los 3 simuladores para comprobar cómo eliminas el
            riesgo de stock, vendes en 34 países sin aduanas propias y
            construyes recompra cada 28 días.
          </p>
        </div>
        <CountrySelector variant="light" />
      </div>

      {/* Contenedor Principal Oscuro de Alto Impacto */}
      <div className="overflow-hidden rounded-[30px] border border-slate-800 bg-gradient-to-b from-[#07131d] via-[#091c2c] to-[#061019] p-4 text-white shadow-[0_32px_70px_-25px_rgba(7,19,29,0.85)] sm:rounded-[36px] sm:p-8">
        {/* 3 Pestañas Interactivas con Efecto "👆 Haz clic" */}
        <div className="mb-6">
          <div className="mb-2.5 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-fxlime">
            <span className="tap-finger text-sm" aria-hidden>
              👆
            </span>
            <span>Haz clic en cualquiera de las 3 pruebas interactivas:</span>
          </div>

          <div
            role="tablist"
            aria-label="Laboratorio de ventajas FuXion"
            className="grid gap-3 md:grid-cols-3"
          >
            {(
              [
                [
                  "race",
                  "⚡ 1. Simular Pedido Real",
                  "Stock propio vs FuXion en 34 países",
                ],
                [
                  "infra",
                  "🛡️ 2. Ahorro $0 Riesgo",
                  "Todo lo que FuXion paga por ti",
                ],
                [
                  "snowball",
                  "🔄 3. Recompra 28 Días",
                  "Efecto bola de nieve mes a mes",
                ],
              ] as const
            ).map(([key, label, sub]) => {
              const active = mode === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMode(key)}
                  className={`group flex items-center justify-between gap-2.5 rounded-2xl border-2 p-3.5 text-left transition-all active:scale-[0.985] sm:p-4 ${
                    active
                      ? "shine border-fxlime bg-gradient-to-r from-fxblue/35 via-[#0e3552] to-fxlime/25 text-white shadow-lg"
                      : "choice-idle border-white/15 bg-white/6 text-white/85 hover:bg-white/12"
                  }`}
                >
                  <div className="min-w-0">
                    <span
                      className={`block font-display text-sm font-extrabold sm:text-base ${
                        active ? "text-fxlime" : "text-white"
                      }`}
                    >
                      {label}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-white/65">
                      {sub}
                    </span>
                  </div>

                  {active ? (
                    <span className="shrink-0 rounded-full bg-fxlime px-2.5 py-1 font-display text-[10px] font-black uppercase text-[#1b2d04]">
                      ✓ Viendo
                    </span>
                  ) : (
                    <span className="tap-cue shrink-0 rounded-full border border-sky-400/40 bg-sky-500/15 px-2.5 py-1 font-display text-[11px] font-extrabold text-sky-300 group-hover:bg-sky-400 group-hover:text-slate-950">
                      <span className="tap-finger" aria-hidden>
                        👆
                      </span>
                      <span>Clic</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            MODO 1: CARRERA EN VIVO DE UN PEDIDO EN 34 PAÍSES
           ========================================================= */}
        {mode === "race" && (
          <div className="space-y-6">
            {/* Selector de País del Comprador */}
            <div className="rounded-2xl border border-white/12 bg-white/5 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
                    🌎 Paso 1: Toca en qué ciudad te compra hoy un cliente
                  </p>
                  <p className="mt-0.5 text-xs text-white/70">
                    Tú estás en{" "}
                    <strong className="text-white">
                      {country.flag} {country.name}
                    </strong>{" "}
                    y entra un pedido de{" "}
                    <strong className="text-fxlime">{dest.orderExample}</strong>{" "}
                    desde:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerRace(destIdx)}
                  className="btn btn-lime shine !px-4 !py-2 text-xs"
                >
                  ⚡ Simular Pedido en Vivo
                </button>
              </div>

              <div className="mt-3.5 flex flex-wrap gap-2">
                {DESTINATIONS.map((d, i) => {
                  const isSel = i === destIdx;
                  return (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => triggerRace(i)}
                      className={`rounded-full border px-3.5 py-2 font-display text-xs font-extrabold transition active:scale-95 ${
                        isSel
                          ? "border-fxlime bg-fxlime text-[#1b2d04] shadow-md"
                          : "border-white/20 bg-white/8 text-white hover:border-sky-400 hover:bg-white/15"
                      }`}
                    >
                      {d.flag} {d.city} ({d.code})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Carrera Comparativa: Stock Propio vs Sistema FuXion */}
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Carril Rojo: Negocio con Stock Propio */}
              <div className="rounded-3xl border border-rose-500/35 bg-gradient-to-b from-rose-950/35 to-[#08121b] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-rose-500/20 px-3 py-1 font-display text-xs font-extrabold text-rose-300">
                    ✕ SI VENDIERAS CON STOCK PROPIO
                  </span>
                  <span className="text-xs font-bold text-rose-300/80">
                    Alto Riesgo
                  </span>
                </div>

                <ul className="mt-4 space-y-3 text-sm">
                  <li
                    className={`rounded-2xl border border-white/10 bg-black/25 p-3.5 transition duration-300 ${
                      raceStep >= 1 ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <p className="font-display font-bold text-rose-200">
                      💸 1. Capital atrapado antes de vender
                    </p>
                    <p className="mt-0.5 text-xs text-white/70">
                      Tuviste que adelantar ~<strong>{stockRiskLocal}</strong>{" "}
                      de tu bolsillo para tener variedad de cajas en casa.
                    </p>
                  </li>

                  <li
                    className={`rounded-2xl border border-white/10 bg-black/25 p-3.5 transition duration-300 ${
                      raceStep >= 2 ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <p className="font-display font-bold text-rose-200">
                      📦 2. Cobro manual, embalaje y tráfico
                    </p>
                    <p className="mt-0.5 text-xs text-white/70">
                      Verificar pago en {dest.currencyLabel}, buscar caja,
                      encintar y perder horas yendo a una agencia de envíos.
                    </p>
                  </li>

                  <li
                    className={`rounded-2xl border p-3.5 transition duration-300 ${
                      raceStep >= 3
                        ? "border-rose-500/50 bg-rose-500/15 opacity-100"
                        : "border-white/10 bg-black/25 opacity-30"
                    }`}
                  >
                    <p className="font-display font-extrabold text-rose-300">
                      {isCrossBorder
                        ? `🚫 3. BLOQUEADO EN ADUANA (${dest.city})`
                        : "⚠️ 3. Costo y reclamos de transporte tuyos"}
                    </p>
                    <p className="mt-0.5 text-xs text-white/80">
                      {isCrossBorder
                        ? `Como particular en ${country.name} no puedes exportar alimentos sueltos a ${dest.countryName} sin ${dest.sanitaryAgency}: pierdes el cliente.`
                        : "Si el motorizado demora o la caja llega golpeada, tú asumes el reclamo y la reposición."}
                    </p>
                  </li>
                </ul>

                <div className="mt-4 rounded-2xl bg-rose-950/50 px-4 py-3 text-xs font-bold text-rose-200">
                  Resultado:{" "}
                  {isCrossBorder
                    ? "0 ventas internacionales · Frontera cerrada"
                    : "3+ horas operativas perdidas por pedido"}
                </div>
              </div>

              {/* Carril Verde: Sistema FuXion */}
              <div className="rounded-3xl border-2 border-fxlime/60 bg-gradient-to-b from-[#132c16] via-[#0b2333] to-[#081520] p-5 shadow-[0_20px_50px_-20px_rgba(140,198,63,0.4)] sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-fxlime px-3 py-1 font-display text-xs font-black text-[#1b2d04]">
                    ✓ CON TU TIENDA VIRTUAL FUXION
                  </span>
                  <span className="text-xs font-bold text-fxlime">
                    $0 en Stock
                  </span>
                </div>

                <ul className="mt-4 space-y-3 text-sm">
                  <li
                    className={`rounded-2xl border border-white/12 bg-white/6 p-3.5 transition duration-300 ${
                      raceStep >= 1 ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <p className="font-display font-bold text-sky-300">
                      📱 1. Tú solo envías tu link (60 segundos)
                    </p>
                    <p className="mt-0.5 text-xs text-white/80">
                      Desde {country.name} mandas tu enlace oficial por WhatsApp
                      al cliente en <strong>{dest.city}</strong>.
                    </p>
                  </li>

                  <li
                    className={`rounded-2xl border border-white/12 bg-white/6 p-3.5 transition duration-300 ${
                      raceStep >= 2 ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <p className="font-display font-bold text-amber-300">
                      🏭 2. FuXion {dest.countryName.split(" ")[0]} cobra y despacha
                    </p>
                    <p className="mt-0.5 text-xs text-white/80">
                      FuXion cobra en {dest.currencyLabel}, factura legalmente y
                      despacha desde su almacén local con{" "}
                      <strong>{dest.sanitaryAgency}</strong>.
                    </p>
                  </li>

                  <li
                    className={`rounded-2xl border p-3.5 transition duration-300 ${
                      raceStep >= 4
                        ? "border-fxlime/60 bg-fxlime/20 opacity-100"
                        : "border-white/12 bg-white/6 opacity-30"
                    }`}
                  >
                    <p className="font-display font-extrabold text-fxlime">
                      💰 3. ¡Puntos PV y Comisión a tu banco en {country.name}!
                    </p>
                    <p className="mt-0.5 text-xs text-white/90">
                      Se suman los PV a tu código rumbo al{" "}
                      <strong>Bono Pro 1</strong> y cobras tu comisión
                      referencial en <strong>{country.currency}</strong>.
                    </p>
                  </li>
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-fxlime/20 px-4 py-3 text-xs font-extrabold text-[#d9f99d]">
                  <span>✓ Tiempo tuyo: 1 min · Stock comprado: 0 cajas</span>
                  <EnrollLink
                    source={`lab-race-${dest.code}`}
                    className="rounded-full bg-fxlime px-3.5 py-1.5 text-[11px] font-black text-[#1b2d04]"
                  >
                    Activar Código →
                  </EnrollLink>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            MODO 2: RADIOGRAFÍA DE INFRAESTRUCTURA ($0 RIESGO)
           ========================================================= */}
        {mode === "infra" && (
          <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.05fr]">
            <div className="space-y-2.5">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-sky-300">
                👆 Toca cada pilar para ver cuánto capital te ahorra FuXion:
              </p>
              {infraItems.map((it, i) => {
                const isSel = i === selectedInfra;
                return (
                  <button
                    key={it.title}
                    type="button"
                    onClick={() => setSelectedInfra(i)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                      isSel
                        ? "border-fxlime bg-white/14 shadow-lg"
                        : "border-white/12 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-2xl">
                        {it.icon}
                      </span>
                      <div>
                        <p className="font-display text-sm font-extrabold text-white sm:text-base">
                          {it.title}
                        </p>
                        <p className="text-xs text-fxlime font-bold">
                          Con FuXion: {it.fuxionAdvantage}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white/60">→</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-fxlime/45 bg-gradient-to-br from-[#0f2c44] via-[#091c2b] to-[#112a15] p-6 sm:p-7">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-fxlime">
                  {activeInfra.icon} Radiografía Financiera ({country.currency})
                </span>
                <h3 className="mt-4 font-display text-2xl font-extrabold text-white sm:text-3xl">
                  {activeInfra.title}
                </h3>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-rose-400/30 bg-rose-950/35 p-4">
                    <p className="text-[11px] font-extrabold uppercase text-rose-300">
                      ✕ Si lo montas tú solo
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold text-white">
                      ~{activeInfra.soloCost}*
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/75">
                      {activeInfra.soloPain}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-fxlime/50 bg-fxlime/15 p-4">
                    <p className="text-[11px] font-extrabold uppercase text-fxlime">
                      ✓ Apalancado en FuXion
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold text-fxlime">
                      {activeInfra.fuxionAdvantage}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/90">
                      {activeInfra.fuxionDetail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/12 bg-black/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/60">
                      Infraestructura tradicional equivalente ahorrada:
                    </p>
                    <p className="font-display text-2xl font-extrabold text-amber-300">
                      +{infraTotalSavedLocal}* puestos por FuXion
                    </p>
                  </div>
                  <EnrollLink
                    source="lab-infra-cta"
                    className="btn btn-lime shine !px-5 !py-2.5 text-xs"
                  >
                    Apalancarme Ahora →
                  </EnrollLink>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            MODO 3: SIMULADOR BOLA DE NIEVE DE LOS 28 DÍAS (RECOMPRA)
           ========================================================= */}
        {mode === "snowball" && (
          <div className="space-y-6">
            {/* Selector de Mes */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/12 bg-white/5 p-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
                👆 Toca cada etapa para ver el efecto de que cada caja traiga 28
                sticks diarios:
              </span>
              <div className="flex flex-wrap gap-2">
                {SNOWBALL_MONTHS.map((m, i) => {
                  const active = i === monthIdx;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMonthIdx(i)}
                      className={`rounded-xl border px-4 py-2 font-display text-xs font-extrabold transition ${
                        active
                          ? "border-fxlime bg-fxlime text-[#1b2d04] shadow-md"
                          : "border-white/20 bg-white/8 text-white hover:bg-white/15"
                      }`}
                    >
                      {m.label} · {m.badge}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              {/* Barras visuales comparativas */}
              <div className="space-y-5 rounded-3xl border border-white/12 bg-white/5 p-5 sm:p-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white/70">
                      ✕ Dropshipping Común (relojes / gadgets sin recompra)
                    </span>
                    <span className="text-rose-300">
                      {curMonth.normalDropshipSales} ventas sueltas (empiezas de
                      0)
                    </span>
                  </div>
                  <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-rose-400/75 transition-all duration-500"
                      style={{ width: "18%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-fxlime">
                      ✓ Bebidas FuXion (28 sticks = reposición mensual + Red)
                    </span>
                    <span className="text-fxlime">
                      {curMonth.totalPv.toLocaleString("es-PE")} PV acumulados
                    </span>
                  </div>
                  <div className="mt-2 h-5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-fxblue via-sky-400 to-fxlime transition-all duration-500"
                      style={{
                        width: `${Math.min(100, 22 + monthIdx * 26)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
                  <div className="rounded-2xl bg-black/30 p-3">
                    <p className="font-display text-2xl font-extrabold text-sky-300">
                      {curMonth.reorderClients}
                    </p>
                    <p className="text-[11px] text-white/70">
                      Clientes recomprando
                    </p>
                  </div>
                  <div className="rounded-2xl bg-black/30 p-3">
                    <p className="font-display text-2xl font-extrabold text-white">
                      +{curMonth.newClients}
                    </p>
                    <p className="text-[11px] text-white/70">Clientes nuevos</p>
                  </div>
                  <div className="rounded-2xl bg-black/30 p-3">
                    <p className="font-display text-2xl font-extrabold text-amber-300">
                      {curMonth.teamPartnersPro1}
                    </p>
                    <p className="text-[11px] text-white/70">
                      Socios en Pro 1
                    </p>
                  </div>
                </div>
              </div>

              {/* Explicación y Proyección Referencial del Mes */}
              <div className="rounded-3xl border border-fxlime/45 bg-gradient-to-br from-[#122c18] to-[#081a28] p-6">
                <span className="rounded-full bg-fxlime/20 px-3 py-1 font-display text-xs font-extrabold text-fxlime">
                  {curMonth.label} · {curMonth.badge}
                </span>
                <h3 className="mt-3 font-display text-xl font-extrabold text-white sm:text-2xl">
                  {curMonth.headline}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/85">
                  {curMonth.explanation}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/12 bg-black/30 p-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/60">
                      Proyección mensual referencial ({country.currency}):
                    </p>
                    <p className="font-display text-2xl font-extrabold text-fxlime sm:text-3xl">
                      ~{formatLocalFromUsd(curMonth.estimatedUsd, country)}*
                    </p>
                  </div>
                  <EnrollLink
                    source={`lab-snowball-${curMonth.id}`}
                    className="btn btn-lime shine !px-5 !py-2.5 text-xs"
                  >
                    Iniciar mi Mes 1 →
                  </EnrollLink>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="mt-5 border-t border-white/10 pt-3 text-[11px] text-white/55">
          *Todos los montos, costos comparados y proyecciones en{" "}
          {country.name} ({country.currency}) son estrictamente referenciales e
          ilustrativos; los resultados reales varían según el volumen
          efectivamente comercializado y cada país.
        </p>
      </div>
    </section>
  );
}
