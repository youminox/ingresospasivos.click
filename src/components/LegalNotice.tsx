import Link from "next/link";
import { LEGAL_EMAIL, LEGAL_LOCATION, LEGAL_OWNER } from "@/lib/content";

export default function LegalNotice() {
  return (
    <aside className="mt-10 rounded-2xl border border-[var(--line)] bg-fxsky/65 p-5 text-xs leading-relaxed text-[var(--muted)]">
      <p className="font-bold text-fxink">
        Aviso de Titularidad e Ingresos Referenciales
      </p>
      <p className="mt-1.5">
        Este sitio web (<strong>ingresospasivos.click</strong>) pertenece a{" "}
        <strong>{LEGAL_OWNER}</strong>, domiciliado en{" "}
        <strong>{LEGAL_LOCATION}</strong>, con correo electrónico de contacto{" "}
        <a
          href={`mailto:${LEGAL_EMAIL}`}
          className="font-semibold text-fxbluedeep underline"
        >
          {LEGAL_EMAIL}
        </a>
        , quien actúa como Distribuidor / Emprendedor Independiente de FuXion
        (no es la página corporativa matriz de FuXion Biotech S.A.C.). Todos los
        importes de comisiones, porcentajes, tipos de cambio y simulaciones de
        la calculadora son <strong>estrictamente referenciales</strong> y pueden
        variar según el país, el volumen real comercializado y los impuestos
        locales. Revisa nuestro{" "}
        <Link
          href="/descargo-de-ingresos/"
          className="font-semibold text-fxbluedeep underline"
        >
          descargo de ingresos
        </Link>{" "}
        y{" "}
        <Link
          href="/aviso-legal/"
          className="font-semibold text-fxbluedeep underline"
        >
          aviso legal
        </Link>
        .
      </p>
    </aside>
  );
}
