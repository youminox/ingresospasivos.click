"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface FuxionCountry {
  code: string;
  name: string;
  flag: string;
  region: "Sudamérica" | "Norte y Centroamérica" | "Europa" | "Internacional";
  currency: string;
  symbol: string;
  /** Tipo de cambio referencial respecto a 1 USD (solo ilustrativo) */
  usdRate: number;
  /** Precio referencial promedio de una caja/doypack de 20 PV en moneda local */
  avgBoxLocal: number;
  decimals: number;
}

export const FUXION_COUNTRIES: FuxionCountry[] = [
  // Sudamérica (8)
  {
    code: "PE",
    name: "Perú",
    flag: "🇵🇪",
    region: "Sudamérica",
    currency: "PEN",
    symbol: "S/",
    usdRate: 3.75,
    avgBoxLocal: 129.5,
    decimals: 0,
  },
  {
    code: "CO",
    name: "Colombia",
    flag: "🇨🇴",
    region: "Sudamérica",
    currency: "COP",
    symbol: "COP $",
    usdRate: 4150,
    avgBoxLocal: 152000,
    decimals: 0,
  },
  {
    code: "CL",
    name: "Chile",
    flag: "🇨🇱",
    region: "Sudamérica",
    currency: "CLP",
    symbol: "CLP $",
    usdRate: 960,
    avgBoxLocal: 35900,
    decimals: 0,
  },
  {
    code: "EC",
    name: "Ecuador",
    flag: "🇪🇨",
    region: "Sudamérica",
    currency: "USD",
    symbol: "US$",
    usdRate: 1,
    avgBoxLocal: 39,
    decimals: 0,
  },
  {
    code: "BO",
    name: "Bolivia",
    flag: "🇧🇴",
    region: "Sudamérica",
    currency: "BOB",
    symbol: "Bs.",
    usdRate: 6.96,
    avgBoxLocal: 275,
    decimals: 0,
  },
  {
    code: "AR",
    name: "Argentina",
    flag: "🇦🇷",
    region: "Sudamérica",
    currency: "ARS",
    symbol: "ARS $",
    usdRate: 1080,
    avgBoxLocal: 42500,
    decimals: 0,
  },
  {
    code: "BR",
    name: "Brasil",
    flag: "🇧🇷",
    region: "Sudamérica",
    currency: "BRL",
    symbol: "R$",
    usdRate: 5.75,
    avgBoxLocal: 215,
    decimals: 0,
  },
  {
    code: "UY",
    name: "Uruguay",
    flag: "🇺🇾",
    region: "Sudamérica",
    currency: "UYU",
    symbol: "$U",
    usdRate: 42.5,
    avgBoxLocal: 1690,
    decimals: 0,
  },

  // Norteamérica y Centroamérica (6)
  {
    code: "US",
    name: "Estados Unidos",
    flag: "🇺🇸",
    region: "Norte y Centroamérica",
    currency: "USD",
    symbol: "US$",
    usdRate: 1,
    avgBoxLocal: 42,
    decimals: 0,
  },
  {
    code: "MX",
    name: "México",
    flag: "🇲🇽",
    region: "Norte y Centroamérica",
    currency: "MXN",
    symbol: "MX$",
    usdRate: 20.1,
    avgBoxLocal: 790,
    decimals: 0,
  },
  {
    code: "CR",
    name: "Costa Rica",
    flag: "🇨🇷",
    region: "Norte y Centroamérica",
    currency: "CRC",
    symbol: "₡",
    usdRate: 515,
    avgBoxLocal: 21500,
    decimals: 0,
  },
  {
    code: "GT",
    name: "Guatemala",
    flag: "🇬🇹",
    region: "Norte y Centroamérica",
    currency: "GTQ",
    symbol: "Q",
    usdRate: 7.75,
    avgBoxLocal: 315,
    decimals: 0,
  },
  {
    code: "HN",
    name: "Honduras",
    flag: "🇭🇳",
    region: "Norte y Centroamérica",
    currency: "HNL",
    symbol: "L",
    usdRate: 25.2,
    avgBoxLocal: 995,
    decimals: 0,
  },
  {
    code: "PA",
    name: "Panamá",
    flag: "🇵🇦",
    region: "Norte y Centroamérica",
    currency: "USD",
    symbol: "US$",
    usdRate: 1,
    avgBoxLocal: 40,
    decimals: 0,
  },

  // Europa — Eurozona Oficial FuXion (20 países)
  ...[
    ["ES", "España", "🇪🇸"],
    ["DE", "Alemania", "🇩🇪"],
    ["IT", "Italia", "🇮🇹"],
    ["FR", "Francia", "🇫🇷"],
    ["PT", "Portugal", "🇵🇹"],
    ["NL", "Países Bajos", "🇳🇱"],
    ["BE", "Bélgica", "🇧🇪"],
    ["AT", "Austria", "🇦🇹"],
    ["IE", "Irlanda", "🇮🇪"],
    ["GR", "Grecia", "🇬🇷"],
    ["FI", "Finlandia", "🇫🇮"],
    ["CY", "Chipre", "🇨🇾"],
    ["HR", "Croacia", "🇭🇷"],
    ["SK", "Eslovaquia", "🇸🇰"],
    ["SI", "Eslovenia", "🇸🇮"],
    ["EE", "Estonia", "🇪🇪"],
    ["LV", "Letonia", "🇱🇻"],
    ["LT", "Lituania", "🇱🇹"],
    ["LU", "Luxemburgo", "🇱🇺"],
    ["MT", "Malta", "🇲🇹"],
  ].map(([code, name, flag]) => ({
    code,
    name,
    flag,
    region: "Europa" as const,
    currency: "EUR",
    symbol: "€",
    usdRate: 0.93,
    avgBoxLocal: 39,
    decimals: 0,
  })),
];

export const COUNTRY_BY_CODE: Record<string, FuxionCountry> = Object.fromEntries(
  FUXION_COUNTRIES.map((c) => [c.code, c])
);

export const DEFAULT_COUNTRY = COUNTRY_BY_CODE["PE"];

export const FALLBACK_INTL_COUNTRY: FuxionCountry = {
  code: "US",
  name: "Internacional (USD)",
  flag: "🌎",
  region: "Internacional",
  currency: "USD",
  symbol: "US$",
  usdRate: 1,
  avgBoxLocal: 40,
  decimals: 0,
};

export function resolveCountry(code?: string | null): FuxionCountry {
  if (!code) return DEFAULT_COUNTRY;
  const up = code.trim().toUpperCase();
  return COUNTRY_BY_CODE[up] || FALLBACK_INTL_COUNTRY;
}

export function formatLocalFromUsd(
  usdAmount: number,
  country: FuxionCountry
): string {
  const local = usdAmount * country.usdRate;
  const rounded =
    country.usdRate >= 100
      ? Math.round(local / 100) * 100
      : Math.round(local);
  return `${country.symbol} ${rounded.toLocaleString("es-PE", {
    maximumFractionDigits: country.decimals,
  })}`;
}

export function formatLocal(
  localAmount: number,
  country: FuxionCountry
): string {
  const rounded =
    country.usdRate >= 100
      ? Math.round(localAmount / 100) * 100
      : Math.round(localAmount);
  return `${country.symbol} ${rounded.toLocaleString("es-PE", {
    maximumFractionDigits: country.decimals,
  })}`;
}

export interface FuXionIncomeBreakdown {
  totalPv: number;
  directCommissionPct: number;
  directSalesProfitLocal: number;
  directSalesProfitUsd: number;
  qualifiesPro1: boolean;
  pro1BonusUsd: number;
  pro1BonusLocal: number;
  qualifiesPro2: boolean;
  pro2BonusUsd: number;
  pro2BonusLocal: number;
  qualifiesPro3: boolean;
  pro3BonusUsd: number;
  pro3BonusLocal: number;
  teamResidualUsd: number;
  teamResidualLocal: number;
  totalMonthlyUsd: number;
  totalMonthlyLocal: number;
}

/**
 * Motor matemático referencial inspirado en la escala Pro-Lev de FuXion.
 * Todos los resultados son ilustrativos y pueden variar por país, SKU, CV/PV e impuestos.
 */
export function calculateFuXionIncome(params: {
  country: FuxionCountry;
  boxesPerMonth: number;
  avgPvPerBox?: number;
  preferredCustomers: number;
  includeMlm: boolean;
  directPartners: number;
  pro1Partners: number;
  pro2Partners: number;
}): FuXionIncomeBreakdown {
  const {
    country,
    boxesPerMonth,
    avgPvPerBox = 20,
    preferredCustomers,
    includeMlm,
    directPartners,
    pro1Partners,
    pro2Partners,
  } = params;

  const totalPv = Math.max(0, Math.round(boxesPerMonth * avgPvPerBox));

  // Escala referencial de comisión por venta directa según PV en ciclo de 4 semanas
  let directCommissionPct = 20;
  if (totalPv >= 800 && preferredCustomers >= 10) directCommissionPct = 50;
  else if (totalPv >= 500) directCommissionPct = 40;
  else if (totalPv >= 300) directCommissionPct = 30;
  else if (totalPv >= 100) directCommissionPct = 25;

  // Base comisionable neta (~82% del PVP antes de IGV/IVA promedio)
  const netCommissionablePerBoxLocal = country.avgBoxLocal * 0.82;
  const directSalesProfitLocal =
    boxesPerMonth * netCommissionablePerBoxLocal * (directCommissionPct / 100);
  const directSalesProfitUsd = directSalesProfitLocal / country.usdRate;

  // Bono Cliente Preferente Pro 1: >= 500 PV y mínimo 6 Clientes Preferentes
  const qualifiesPro1 = totalPv >= 500 && preferredCustomers >= 6;
  const pro1BonusUsd = qualifiesPro1 ? (totalPv >= 750 ? 100 : 50) : 0;
  const pro1BonusLocal = pro1BonusUsd * country.usdRate;

  // Bono Pro 2: Estar en Pro 1 + al menos 4 socios directos en Pro 1
  const effectivePro1Partners = includeMlm
    ? Math.min(directPartners, pro1Partners)
    : 0;
  const qualifiesPro2 =
    includeMlm && qualifiesPro1 && effectivePro1Partners >= 4;
  const pro2BonusUsd = qualifiesPro2 ? 200 : 0;
  const pro2BonusLocal = pro2BonusUsd * country.usdRate;

  // Bono Pro 3: Estar en Pro 2 + al menos 2 socios directos en Pro 2
  const effectivePro2Partners = includeMlm
    ? Math.min(effectivePro1Partners, pro2Partners)
    : 0;
  const qualifiesPro3 =
    includeMlm && qualifiesPro2 && effectivePro2Partners >= 2;
  const pro3BonusUsd = qualifiesPro3 ? 500 : 0;
  const pro3BonusLocal = pro3BonusUsd * country.usdRate;

  // Comisión residual de red (Bono Pack Profesional + Bono Familia + Balance referencial)
  const teamVolumePv = includeMlm
    ? directPartners * 220 +
      effectivePro1Partners * 380 +
      effectivePro2Partners * 1800
    : 0;
  const teamResidualUsd = includeMlm ? teamVolumePv * 0.085 : 0;
  const teamResidualLocal = teamResidualUsd * country.usdRate;

  const totalMonthlyUsd =
    directSalesProfitUsd +
    pro1BonusUsd +
    pro2BonusUsd +
    pro3BonusUsd +
    teamResidualUsd;
  const totalMonthlyLocal = totalMonthlyUsd * country.usdRate;

  return {
    totalPv,
    directCommissionPct,
    directSalesProfitLocal,
    directSalesProfitUsd,
    qualifiesPro1,
    pro1BonusUsd,
    pro1BonusLocal,
    qualifiesPro2,
    pro2BonusUsd,
    pro2BonusLocal,
    qualifiesPro3,
    pro3BonusUsd,
    pro3BonusLocal,
    teamResidualUsd,
    teamResidualLocal,
    totalMonthlyUsd,
    totalMonthlyLocal,
  };
}

interface GeoContextValue {
  country: FuxionCountry;
  setCountryCode: (code: string) => void;
  enrollmentUrl: string;
  shopUrl: string;
}

const DEFAULT_ENROLLMENT =
  "https://ifuxion.com/Lingan/enrollment/enrollmentconfiguration?SessionID=QfThE_gNirau5B7cEIkwOvmltztUrSwxWH01zkWDmxq9SFmrkLVDwYBucZMk8MFIHWOLW4XMoR9bmocerBmWRU0m5fNTnzbi";
const DEFAULT_SHOP = "https://carlos-lingan.site.fuxion.com/";
const STORAGE_COUNTRY_KEY = "ip_country_code_v1";

const GeoContext = createContext<GeoContextValue>({
  country: DEFAULT_COUNTRY,
  setCountryCode: () => {},
  enrollmentUrl: DEFAULT_ENROLLMENT,
  shopUrl: DEFAULT_SHOP,
});

function guessCountryFromTimezone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const map: Record<string, string> = {
      "America/Lima": "PE",
      "America/Bogota": "CO",
      "America/Santiago": "CL",
      "America/Guayaquil": "EC",
      "America/La_Paz": "BO",
      "America/Argentina/Buenos_Aires": "AR",
      "America/Sao_Paulo": "BR",
      "America/Montevideo": "UY",
      "America/Mexico_City": "MX",
      "America/Monterrey": "MX",
      "America/Costa_Rica": "CR",
      "America/Guatemala": "GT",
      "America/Tegucigalpa": "HN",
      "America/Panama": "PA",
      "Europe/Madrid": "ES",
      "Europe/Berlin": "DE",
      "Europe/Rome": "IT",
      "Europe/Paris": "FR",
      "Europe/Lisbon": "PT",
      "Europe/Amsterdam": "NL",
      "Europe/Brussels": "BE",
      "Europe/Vienna": "AT",
      "Europe/Dublin": "IE",
      "Europe/Athens": "GR",
      "America/New_York": "US",
      "America/Chicago": "US",
      "America/Los_Angeles": "US",
    };
    return map[tz] || null;
  } catch {
    return null;
  }
}

export function GeoProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<FuxionCountry>(DEFAULT_COUNTRY);
  const [enrollmentUrl, setEnrollmentUrl] =
    useState<string>(DEFAULT_ENROLLMENT);
  const [shopUrl, setShopUrl] = useState<string>(DEFAULT_SHOP);

  useEffect(() => {
    let userSaved: string | null = null;
    try {
      userSaved = localStorage.getItem(STORAGE_COUNTRY_KEY);
    } catch {
      // ignore
    }
    const rafId = requestAnimationFrame(() => {
      if (userSaved && COUNTRY_BY_CODE[userSaved]) {
        setCountry(COUNTRY_BY_CODE[userSaved]);
      } else {
        const tzGuess = guessCountryFromTimezone();
        if (tzGuess) setCountry(resolveCountry(tzGuess));
      }
    });

    if (!userSaved || !COUNTRY_BY_CODE[userSaved]) {
      fetch("/api/geo/")
        .then((r) => r.json())
        .then((d) => {
          if (d?.country) {
            setCountry(resolveCountry(d.country));
          }
        })
        .catch(() => {});
    }

    // Sincronizar URL oficial viva desde Supabase (por si el SessionID se renueva en el admin)
    fetch(
      "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/ingresospasivos-chat",
      { method: "GET" }
    )
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg?.enrollment_url) setEnrollmentUrl(cfg.enrollment_url);
        if (cfg?.shop_url) setShopUrl(cfg.shop_url);
      })
      .catch(() => {});

    return () => cancelAnimationFrame(rafId);
  }, []);

  const setCountryCode = (code: string) => {
    const resolved = resolveCountry(code);
    setCountry(resolved);
    try {
      localStorage.setItem(STORAGE_COUNTRY_KEY, resolved.code);
    } catch {
      // ignore
    }
  };

  return (
    <GeoContext.Provider
      value={{ country, setCountryCode, enrollmentUrl, shopUrl }}
    >
      {children}
    </GeoContext.Provider>
  );
}

export function useGeo() {
  return useContext(GeoContext);
}
