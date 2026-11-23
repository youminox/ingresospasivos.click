"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CountrySelector from "./CountrySelector";
import EnrollLink from "./EnrollLink";

export default function Header({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = variant === "dark" && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        dark
          ? "border-b border-white/10 bg-[#07131d]/75 text-white backdrop-blur-md"
          : "border-b border-[var(--line)] bg-white/92 text-fxink shadow-[0_8px_30px_-22px_rgba(7,19,29,0.35)] backdrop-blur-xl"
      }`}
    >
      <div className="wrap flex h-[68px] items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fxblue to-fxlime font-display text-lg font-black text-white shadow-md">
            IP
          </span>
          <span className="leading-none">
            <span className="block font-display text-lg font-extrabold tracking-tight">
              IngresosPasivos<span className="text-fxlime">.click</span>
            </span>
            <span
              className={`block text-[10px] font-semibold uppercase tracking-wider ${
                dark ? "text-white/65" : "text-[var(--muted)]"
              }`}
            >
              Negocio & Dropshipping FuXion
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-5 text-sm font-semibold xl:flex"
        >
          <Link
            href="/calculadora-de-ingresos/"
            className="hover:text-fxblue transition"
          >
            Calculadora IA
          </Link>
          <Link
            href="/dropshipping-y-tienda-virtual-fuxion/"
            className="hover:text-fxblue transition"
          >
            Dropshipping
          </Link>
          <Link
            href="/plan-de-pagos-y-bonos-fuxion/"
            className="hover:text-fxblue transition"
          >
            Pro 1 & Pro 2
          </Link>
          <Link
            href="/vender-productos-fuxion/"
            className="hover:text-fxblue transition"
          >
            Vender Productos
          </Link>
          <Link
            href="/afiliarse-a-fuxion-por-pais/"
            className="hover:text-fxblue transition"
          >
            34 Países
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block">
            <CountrySelector variant={dark ? "dark" : "light"} compact />
          </div>
          <EnrollLink
            source="header"
            className="btn btn-lime shine !px-4 !py-2 text-xs sm:!px-5 sm:!py-2.5 sm:text-sm"
          >
            Registrarme en FuXion
          </EnrollLink>
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setOpenMenu((v) => !v)}
            className={`grid h-9 w-9 place-items-center rounded-xl border xl:hidden ${
              dark
                ? "border-white/20 text-white"
                : "border-[var(--line)] text-fxink"
            }`}
          >
            {openMenu ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {openMenu && (
        <div className="border-t border-[var(--line)] bg-white px-5 py-4 text-fxink shadow-xl xl:hidden">
          <div className="mb-3 sm:hidden">
            <CountrySelector variant="light" />
          </div>
          <nav className="grid gap-2.5 text-sm font-semibold">
            <Link
              href="/calculadora-de-ingresos/"
              onClick={() => setOpenMenu(false)}
              className="rounded-lg px-2 py-1.5 hover:bg-fxsky"
            >
              🧮 Calculadora de Ingresos con IA
            </Link>
            <Link
              href="/dropshipping-y-tienda-virtual-fuxion/"
              onClick={() => setOpenMenu(false)}
              className="rounded-lg px-2 py-1.5 hover:bg-fxsky"
            >
              📦 Dropshipping Sin Stock
            </Link>
            <Link
              href="/plan-de-pagos-y-bonos-fuxion/"
              onClick={() => setOpenMenu(false)}
              className="rounded-lg px-2 py-1.5 hover:bg-fxsky"
            >
              🏆 Comisiones, Pro 1 y Pro 2
            </Link>
            <Link
              href="/vender-productos-fuxion/"
              onClick={() => setOpenMenu(false)}
              className="rounded-lg px-2 py-1.5 hover:bg-fxsky"
            >
              🥤 Vender Productos FuXion
            </Link>
            <Link
              href="/afiliarse-a-fuxion-por-pais/"
              onClick={() => setOpenMenu(false)}
              className="rounded-lg px-2 py-1.5 hover:bg-fxsky"
            >
              🌎 Afiliarse por País (34 Mercados)
            </Link>
            <Link
              href="/sobre-el-distribuidor/"
              onClick={() => setOpenMenu(false)}
              className="rounded-lg px-2 py-1.5 hover:bg-fxsky"
            >
              🤝 Equipo Charlie Lingan
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
