import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import { LEGAL_EMAIL, LEGAL_LOCATION, LEGAL_OWNER, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Política Editorial y Criterios de Verificación",
  description: `Estándares de calidad, transparencia comercial y uso responsable de IA en ingresospasivos.click (${LEGAL_OWNER}).`,
  alternates: { canonical: `${SITE_URL}/politica-editorial/` },
};

export default function PoliticaEditorialPage() {
  return (
    <SimplePage title="Política Editorial" path="/politica-editorial/">
      <h2>1. Dirección y supervisión responsable</h2>
      <p>
        Todas las guías, tablas comparativas y herramientas publicadas en{" "}
        <strong>ingresospasivos.click</strong> se encuentran bajo la
        responsabilidad editorial de <strong>{LEGAL_OWNER}</strong>, domiciliado
        en <strong>{LEGAL_LOCATION}</strong> (contacto:{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>).
      </p>

      <h2>2. Principios de redacción sin humo</h2>
      <ul>
        <li>
          <strong>Cero promesas de enriquecimiento automático:</strong>{" "}
          explicamos siempre que todo ingreso en venta directa o red de
          afiliados proviene exclusivamente de la comercialización real de
          productos a consumidores finales.
        </li>
        <li>
          <strong>Datos nutricionales de etiqueta:</strong> cuando citamos
          productos FuXion usamos sus presentaciones reales, puntos volumen (PV)
          aproximados e ingredientes públicos, sin hacer afirmaciones médicas.
        </li>
        <li>
          <strong>Arquitectura sin canibalización:</strong> cada URL aborda una
          pregunta concreta para ahorrar tiempo al lector.
        </li>
      </ul>

      <h2>3. Correcciones y contacto</h2>
      <p>
        Si detectas algún dato desactualizado por cambio reciente de catálogo o
        moneda en alguno de los 34 países de FuXion, escríbenos a{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> para revisarlo y
        actualizarlo de inmediato.
      </p>
    </SimplePage>
  );
}
