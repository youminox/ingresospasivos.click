"use client";

import { FUXION_COUNTRIES, useGeo } from "@/lib/countries";

export default function CountrySelector({
  variant = "light",
  compact = false,
}: {
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  const { country, setCountryCode } = useGeo();

  return (
    <label className="inline-flex items-center gap-1.5 text-xs font-semibold">
      {!compact && (
        <span
          className={
            variant === "dark" ? "text-white/75" : "text-[var(--muted)]"
          }
        >
          País / Moneda:
        </span>
      )}
      <select
        aria-label="Seleccionar país y moneda referencial de FuXion"
        value={country.code}
        onChange={(e) => setCountryCode(e.target.value)}
        className={`rounded-full border px-3 py-1.5 font-display text-xs font-bold transition focus:outline-none ${
          variant === "dark"
            ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
            : "border-[var(--line)] bg-fxsky text-fxink hover:border-fxblue"
        }`}
      >
        {(["Sudamérica", "Norte y Centroamérica", "Europa"] as const).map(
          (region) => (
            <optgroup
              key={region}
              label={`FuXion — ${region}`}
              className="bg-slate-900 text-white"
            >
              {FUXION_COUNTRIES.filter((c) => c.region === region).map((c) => (
                <option
                  key={c.code}
                  value={c.code}
                  className="bg-slate-900 text-white"
                >
                  {c.flag} {c.name} ({c.currency})
                </option>
              ))}
            </optgroup>
          )
        )}
      </select>
    </label>
  );
}
