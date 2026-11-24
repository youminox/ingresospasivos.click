"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import CountrySelector from "../CountrySelector";
import EnrollLink from "../EnrollLink";
import {
  CHAT_ENDPOINT,
  REFERENTIAL_INCOME_NOTICE,
} from "@/lib/client-constants";
import {
  calculateFuXionIncome,
  formatLocal,
  useGeo,
} from "@/lib/countries";

interface AiRoadmap {
  headline: string;
  summary: string;
  steps: string[];
  disclaimer: string;
}

interface AiProduct {
  slug: string;
  name: string;
  pointsPv: number;
  image: string;
  articleUrl: string;
}

export default function IncomeCalculatorIA() {
  const { country } = useGeo();

  const [tab, setTab] = useState<"sales" | "hybrid">("hybrid");
  const [boxesPerMonth, setBoxesPerMonth] = useState<number>(26);
  const [avgPvPerBox, setAvgPvPerBox] = useState<number>(20);
  const [preferredCustomers, setPreferredCustomers] = useState<number>(7);
  const [directPartners, setDirectPartners] = useState<number>(4);
  const [pro1Partners, setPro1Partners] = useState<number>(4);
  const [pro2Partners, setPro2Partners] = useState<number>(0);

  // Asesor IA conectado a Supabase
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(7);
  const [goalText, setGoalText] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiRoadmap, setAiRoadmap] = useState<AiRoadmap | null>(null);
  const [aiProducts, setAiProducts] = useState<AiProduct[]>([]);

  const result = calculateFuXionIncome({
    country,
    boxesPerMonth,
    avgPvPerBox,
    preferredCustomers,
    includeMlm: tab === "hybrid",
    directPartners,
    pro1Partners,
    pro2Partners,
  });

  const handleGenerateAiPlan = async (e: FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const vid =
        (typeof window !== "undefined" &&
          localStorage.getItem("ip_chat_visitor_v1")) ||
        "calc-anon";
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "simulate_plan",
          visitor_id: vid,
          country_code: country.code,
          currency_code: country.currency,
          calc_mode: tab,
          boxes_per_month: boxesPerMonth,
          preferred_customers: preferredCustomers,
          direct_partners: tab === "hybrid" ? directPartners : 0,
          pro1_partners: tab === "hybrid" ? pro1Partners : 0,
          estimated_pv: result.totalPv,
          estimated_monthly_usd: Number(result.totalMonthlyUsd.toFixed(2)),
          estimated_monthly_local: Math.round(result.totalMonthlyLocal),
          hours_per_week: hoursPerWeek,
          goal_text: goalText,
          page_url:
            typeof window !== "undefined"
              ? window.location.href
              : "https://ingresospasivos.click/",
        }),
      });
      const data = await res.json();
      if (data?.plan) {
        setAiRoadmap(data.plan);
        setAiProducts(data.products || []);
      }
    } catch {
      setAiRoadmap({
        headline: `Hoja de Ruta Referencial para ${country.name} (${country.currency})`,
        summary:
          "Enfócate primero en construir tu cartera de al menos 6 Clientes Preferentes (500 PV en 4 semanas) usando tu Tienda Virtual de Dropshipping sin comprar stock, y apóyate en nuestro equipo para duplicar tus primeros 4 socios hacia Pro 2.",
        steps: [
          "Activa tu registro oficial en el equipo de Charlie Lingan para habilitar tu tienda online en los 34 países.",
          "Comparte productos de alta rotación (Prunex1, Thermo T3 y Vita Xtra T+) mediante atención consultiva.",
          "Consolida 500+ PV con 6 Clientes Preferentes para alcanzar el Bono Pro 1.",
          "Enseña el mismo sistema a 4 socios directos para activar el Bono Pro 2.",
        ],
        disclaimer: REFERENTIAL_INCOME_NOTICE,
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <section id="calculadora-ia" className="wrap py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="eyebrow">Simulador Interactivo con Inteligencia Artificial</span>
          <h2 className="section-title mt-3">
            Calcula tus ingresos{" "}
            <span className="text-fxblue">referenciales en {country.currency}</span>
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Simula comisiones por <strong>venta directa de productos</strong>{" "}
            (Dropshipping + Pro 1) y por{" "}
            <strong>construcción de red de afiliados</strong> (Pro 2, Pro 3 y
            volumen grupal). Importes geolocalizados de carácter referencial.
          </p>
        </div>
        <CountrySelector variant="light" />
      </div>

      {/* Mode Switcher con efecto interactivo "Haz clic para elegir" */}
      <div className="mb-8 rounded-3xl border border-fxblue/20 bg-fxsky/75 p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-fxbluedeep">
          <span className="tap-finger text-base" aria-hidden>
            👆
          </span>
          <span>Haz clic en una opción para cambiar el cálculo:</span>
        </div>

        <div
          role="radiogroup"
          aria-label="Seleccionar modalidad de ingresos FuXion"
          className="grid gap-3.5 md:grid-cols-2"
        >
          {/* Opción 1: Solo Venta de Productos */}
          <button
            type="button"
            role="radio"
            aria-checked={tab === "sales"}
            onClick={() => setTab("sales")}
            className={`group relative flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.985] sm:p-5 ${
              tab === "sales"
                ? "shine border-fxblue bg-gradient-to-r from-fxblue to-fxbluedeep text-white shadow-[0_18px_36px_-14px_rgba(0,147,221,0.8)]"
                : "choice-idle bg-white text-fxink hover:-translate-y-0.5 hover:bg-white"
            }`}
          >
            <div className="flex items-start gap-3.5">
              {/* Radio Circle */}
              <span
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
                  tab === "sales"
                    ? "border-white bg-white text-fxblue"
                    : "border-fxblue/50 bg-fxsky text-transparent group-hover:border-fxblue"
                }`}
                aria-hidden
              >
                <span className="text-xs font-black">✓</span>
              </span>
              <div>
                <span className="block font-display text-base font-extrabold leading-snug sm:text-lg">
                  🥤 Tipo 1: Solo Venta de Productos
                </span>
                <span
                  className={`mt-0.5 block text-xs font-medium ${
                    tab === "sales" ? "text-white/85" : "text-[var(--muted)]"
                  }`}
                >
                  Dropshipping sin stock · Bono Pro 1
                </span>
              </div>
            </div>

            {tab === "sales" ? (
              <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 font-display text-[11px] font-extrabold uppercase tracking-wide text-white">
                ✓ Activo
              </span>
            ) : (
              <span className="tap-cue shrink-0 rounded-full border border-fxblue/30 bg-fxsky px-3 py-1.5 font-display text-xs font-extrabold text-fxbluedeep shadow-sm group-hover:bg-fxblue group-hover:text-white">
                <span className="tap-ring text-fxblue group-hover:text-white" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-current" />
                </span>
                <span className="tap-finger" aria-hidden>
                  👆
                </span>
                <span>Haz clic</span>
              </span>
            )}
          </button>

          {/* Opción 2: Ventas + Red Multinivel */}
          <button
            type="button"
            role="radio"
            aria-checked={tab === "hybrid"}
            onClick={() => setTab("hybrid")}
            className={`group relative flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.985] sm:p-5 ${
              tab === "hybrid"
                ? "shine border-[#8cc63f] bg-gradient-to-r from-[#07131d] via-[#0c273d] to-[#07131d] text-white shadow-[0_18px_36px_-14px_rgba(7,19,29,0.75)]"
                : "choice-idle bg-white text-fxink hover:-translate-y-0.5 hover:bg-white"
            }`}
          >
            <div className="flex items-start gap-3.5">
              {/* Radio Circle */}
              <span
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
                  tab === "hybrid"
                    ? "border-fxlime bg-fxlime text-[#1b2d04]"
                    : "border-fxblue/50 bg-fxsky text-transparent group-hover:border-fxblue"
                }`}
                aria-hidden
              >
                <span className="text-xs font-black">✓</span>
              </span>
              <div>
                <span
                  className={`block font-display text-base font-extrabold leading-snug sm:text-lg ${
                    tab === "hybrid" ? "text-fxlime" : "text-fxink"
                  }`}
                >
                  🚀 Tipo 2: Ventas + Red Multinivel
                </span>
                <span
                  className={`mt-0.5 block text-xs font-medium ${
                    tab === "hybrid" ? "text-white/80" : "text-[var(--muted)]"
                  }`}
                >
                  Pro 1 · Pro 2 · Comisiones de Equipo
                </span>
              </div>
            </div>

            {tab === "hybrid" ? (
              <span className="shrink-0 rounded-full bg-fxlime/20 px-3 py-1 font-display text-[11px] font-extrabold uppercase tracking-wide text-fxlime">
                ✓ Activo
              </span>
            ) : (
              <span className="tap-cue shrink-0 rounded-full border border-fxlime/60 bg-[#f3fce1] px-3 py-1.5 font-display text-xs font-extrabold text-[#2b4c07] shadow-sm group-hover:bg-fxlime group-hover:text-[#1b2d04]">
                <span className="tap-ring text-[#62961d]" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-current" />
                </span>
                <span className="tap-finger" aria-hidden>
                  👆
                </span>
                <span>Haz clic</span>
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.95fr]">
        {/* Sliders Panel */}
        <div className="card card-static space-y-6 p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="boxes-slider"
                className="font-display text-base font-extrabold text-fxink"
              >
                Cajas / Doypacks vendidos en 4 semanas
              </label>
              <span className="rounded-full bg-fxsky px-3 py-1 font-display text-sm font-extrabold text-fxbluedeep">
                {boxesPerMonth} cajas ({result.totalPv} PV)
              </span>
            </div>
            <input
              id="boxes-slider"
              type="range"
              min={2}
              max={80}
              value={boxesPerMonth}
              onChange={(e) => setBoxesPerMonth(Number(e.target.value))}
              className="mt-3 w-full accent-fxblue"
            />
            <div className="mt-1 flex justify-between text-[11px] text-[var(--muted)]">
              <span>2 cajas (inicio)</span>
              <span>25 cajas (~500 PV Pro 1)</span>
              <span>80 cajas</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between text-sm font-bold">
                <label htmlFor="pv-select">Promedio PV por producto</label>
                <span className="text-fxbluedeep">{avgPvPerBox} PV</span>
              </div>
              <select
                id="pv-select"
                value={avgPvPerBox}
                onChange={(e) => setAvgPvPerBox(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-[var(--line)] bg-slate-50 px-3 py-2 text-xs font-semibold text-fxink"
              >
                <option value={15}>Mix Entrada (~15 PV: Prunex1 + Té)</option>
                <option value={20}>
                  Mix Estándar (~20 PV: Thermo T3 / Vita Xtra T+)
                </option>
                <option value={24}>
                  Mix Alto Ticket (~24 PV: Beauty-In / Flora Liv)
                </option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm font-bold">
                <label htmlFor="cp-slider">Clientes Preferentes activos</label>
                <span className="text-fxbluedeep">{preferredCustomers} CP</span>
              </div>
              <input
                id="cp-slider"
                type="range"
                min={1}
                max={25}
                value={preferredCustomers}
                onChange={(e) => setPreferredCustomers(Number(e.target.value))}
                className="mt-3 w-full accent-fxblue"
              />
              <p className="mt-1 text-[11px] text-[var(--muted)]">
                Mínimo 6 clientes (&ge;35 PV c/u) para Bono Pro 1.
              </p>
            </div>
          </div>

          {tab === "hybrid" && (
            <div className="space-y-5 rounded-2xl border border-fxblue/20 bg-fxsky/50 p-5">
              <p className="font-display text-sm font-extrabold uppercase tracking-wider text-fxbluedeep">
                🤝 Parámetros de Red de Afiliados (Multinivel)
              </p>

              <div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <label htmlFor="partners-slider">
                    Socios directos activos en tu equipo
                  </label>
                  <span>{directPartners} socios</span>
                </div>
                <input
                  id="partners-slider"
                  type="range"
                  min={0}
                  max={20}
                  value={directPartners}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setDirectPartners(v);
                    if (pro1Partners > v) setPro1Partners(v);
                  }}
                  className="mt-2 w-full accent-fxblue"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <label htmlFor="pro1-partners">
                      Socios directos que logran Pro 1
                    </label>
                    <span className="text-emerald-700">{pro1Partners}</span>
                  </div>
                  <input
                    id="pro1-partners"
                    type="range"
                    min={0}
                    max={Math.max(directPartners, 1)}
                    value={Math.min(pro1Partners, directPartners)}
                    onChange={(e) => setPro1Partners(Number(e.target.value))}
                    className="mt-2 w-full accent-emerald-600"
                  />
                  <p className="mt-1 text-[10px] text-[var(--muted)]">
                    Con 4 socios en Pro 1 desbloqueas Bono Pro 2.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <label htmlFor="pro2-partners">
                      Socios directos que logran Pro 2
                    </label>
                    <span className="text-amber-700">{pro2Partners}</span>
                  </div>
                  <input
                    id="pro2-partners"
                    type="range"
                    min={0}
                    max={Math.min(pro1Partners, 6)}
                    value={Math.min(pro2Partners, pro1Partners)}
                    onChange={(e) => setPro2Partners(Number(e.target.value))}
                    className="mt-2 w-full accent-amber-500"
                  />
                  <p className="mt-1 text-[10px] text-[var(--muted)]">
                    Con 2 socios en Pro 2 desbloqueas Bono Pro 3.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setTab("sales");
                setBoxesPerMonth(25);
                setAvgPvPerBox(20);
                setPreferredCustomers(6);
              }}
              className="rounded-full border border-[var(--line)] bg-slate-50 px-3 py-1.5 text-xs font-bold text-fxink hover:border-fxblue"
            >
              ⚡ Cargar Ejemplo Pro 1 (Solo Ventas)
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("hybrid");
                setBoxesPerMonth(26);
                setAvgPvPerBox(20);
                setPreferredCustomers(7);
                setDirectPartners(4);
                setPro1Partners(4);
                setPro2Partners(0);
              }}
              className="rounded-full border border-[var(--line)] bg-slate-50 px-3 py-1.5 text-xs font-bold text-fxink hover:border-fxblue"
            >
              🏆 Cargar Ejemplo Pro 2 (4 Socios Pro 1)
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("hybrid");
                setBoxesPerMonth(30);
                setAvgPvPerBox(22);
                setPreferredCustomers(10);
                setDirectPartners(8);
                setPro1Partners(6);
                setPro2Partners(2);
              }}
              className="rounded-full border border-[var(--line)] bg-slate-50 px-3 py-1.5 text-xs font-bold text-fxink hover:border-fxblue"
            >
              💎 Cargar Ejemplo Pro 3 + Liderazgo
            </button>
          </div>
        </div>

        {/* Live Output Panel */}
        <div className="flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-[#07131d] via-[#0a2b44] to-[#061c2c] p-6 text-white shadow-2xl sm:p-8">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-fxlime">
                {country.flag} Estimación en {country.name} ({country.currency})
              </span>
              <span className="text-xs font-semibold text-white/70">
                Tramo: {result.directCommissionPct}% Venta Directa
              </span>
            </div>

            <p className="mt-5 text-xs uppercase tracking-wider text-white/65">
              Ingreso Mensual Referencial Estimado (Ciclo 4 Semanas)*
            </p>
            <p className="mt-1 font-display text-4xl font-extrabold text-fxlime sm:text-5xl">
              {formatLocal(result.totalMonthlyLocal, country)}
            </p>
            <p className="mt-1 text-xs text-white/65">
              Equivalente referencial aprox.: US${" "}
              {Math.round(result.totalMonthlyUsd).toLocaleString("es-PE")} /
              período*
            </p>

            {/* Breakdown lines */}
            <div className="mt-6 space-y-2.5 rounded-2xl border border-white/12 bg-white/6 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/80">
                  1. Comisión Venta Directa ({result.directCommissionPct}%):
                </span>
                <strong className="font-display">
                  {formatLocal(result.directSalesProfitLocal, country)}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">
                  2. Bono Cliente Preferente Pro 1:
                </span>
                <strong
                  className={
                    result.qualifiesPro1
                      ? "font-display text-fxlime"
                      : "text-xs text-white/45"
                  }
                >
                  {result.qualifiesPro1
                    ? `+ ${formatLocal(result.pro1BonusLocal, country)}`
                    : "Faltan PV o 6 clientes"}
                </strong>
              </div>
              {tab === "hybrid" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">
                      3. Bono Liderazgo Pro 2 (4 socios Pro 1):
                    </span>
                    <strong
                      className={
                        result.qualifiesPro2
                          ? "font-display text-amber-300"
                          : "text-xs text-white/45"
                      }
                    >
                      {result.qualifiesPro2
                        ? `+ ${formatLocal(result.pro2BonusLocal, country)}`
                        : "Requiere Pro 1 + 4 socios"}
                    </strong>
                  </div>
                  {result.qualifiesPro3 && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">
                        4. Bono Consolidación Pro 3:
                      </span>
                      <strong className="font-display text-cyan-300">
                        + {formatLocal(result.pro3BonusLocal, country)}
                      </strong>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-white/10 pt-2">
                    <span className="text-white/80">
                      Comisiones residuales de red (est.):
                    </span>
                    <strong className="font-display text-white">
                      + {formatLocal(result.teamResidualLocal, country)}
                    </strong>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <EnrollLink
              source="calculator-main-cta"
              className="btn btn-lime shine w-full !py-3.5 text-sm sm:text-base"
            >
              Quiero registrarme en FuXion (Clic Aquí) →
            </EnrollLink>
            <p className="mt-3 text-[11px] leading-relaxed text-white/60">
              {REFERENTIAL_INCOME_NOTICE}
            </p>
          </div>
        </div>
      </div>

      {/* AI Custom Plan Generator via Supabase */}
      <div className="mt-8 rounded-3xl border border-fxblue/25 bg-gradient-to-r from-fxsky via-white to-[#f6fde8] p-6 sm:p-8">
        <form
          onSubmit={handleGenerateAiPlan}
          className="grid items-end gap-4 lg:grid-cols-[180px_1fr_auto]"
        >
          <div>
            <label
              htmlFor="ai-hours"
              className="block text-xs font-extrabold uppercase tracking-wider text-fxbluedeep"
            >
              Horas / Semana
            </label>
            <select
              id="ai-hours"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-bold text-fxink"
            >
              <option value={4}>4 horas / semana</option>
              <option value={7}>7 horas / semana (1h/día)</option>
              <option value={12}>12 horas / semana</option>
              <option value={25}>+25 horas (Tiempo completo)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="ai-goal"
              className="block text-xs font-extrabold uppercase tracking-wider text-fxbluedeep"
            >
              🤖 Cuéntale tu objetivo a nuestra IA
            </label>
            <input
              id="ai-goal"
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder={`Ej: Vivo en ${country.name}, quiero empezar vendiendo por WhatsApp sin stock y llegar a Pro 1...`}
              className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm text-fxink focus:border-fxblue focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={aiLoading}
            className="btn btn-buy !py-3 text-sm disabled:opacity-50"
          >
            {aiLoading
              ? "⏳ Generando Plan con IA..."
              : "✨ Crear mi Hoja de Ruta con IA"}
          </button>
        </form>

        {aiRoadmap && (
          <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-6 shadow-md">
            <h3 className="font-display text-xl font-extrabold text-fxink">
              {aiRoadmap.headline}
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {aiRoadmap.summary}
            </p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2">
              {aiRoadmap.steps.map((st, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-fxsky/65 p-3.5 text-xs leading-relaxed text-fxink"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fxblue font-display font-extrabold text-white">
                    {i + 1}
                  </span>
                  <span>{st}</span>
                </li>
              ))}
            </ol>

            {aiProducts.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-fxbluedeep">
                  Productos FuXion sugeridos para iniciar tu cartera:
                </p>
                <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
                  {aiProducts.map((p) => (
                    <div
                      key={p.slug}
                      className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-2.5"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-fxsky">
                        <Image
                          src={p.image.replace(
                            "https://ingresospasivos.click",
                            ""
                          )}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-display text-xs font-extrabold">
                          {p.name}
                        </p>
                        <p className="text-[11px] font-semibold text-fxbluedeep">
                          {p.pointsPv} PV / unidad
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-4 text-[11px] text-[var(--muted)]">
              {aiRoadmap.disclaimer}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
