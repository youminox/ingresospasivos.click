import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import { LEGAL_EMAIL, LEGAL_LOCATION, LEGAL_OWNER, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Descargo de Ingresos Referenciales (Income Disclaimer)",
  description:
    "Metodología de cálculo y descargo oficial sobre ingresos, comisiones y bonos referenciales de FuXion en ingresospasivos.click.",
  alternates: { canonical: `${SITE_URL}/descargo-de-ingresos/` },
};

export default function DescargoIngresosPage() {
  return (
    <SimplePage
      title="Descargo de Ingresos Referenciales"
      eyebrow="Transparencia Financiera Obligatoria"
      path="/descargo-de-ingresos/"
    >
      <h2>1. Naturaleza estrictamente referencial de las cifras</h2>
      <p>
        Todos los cálculos, simulaciones de la calculadora con inteligencia
        artificial, porcentajes de comisión (20% a 50%) y montos asociados a los
        bonos <strong>Pro 1, Pro 2, Pro 3</strong> y rangos del Plan Pro-Lev
        expuestos en <strong>ingresospasivos.click</strong> son{" "}
        <strong>estrictamente referenciales, ilustrativos y educativos</strong>.
      </p>

      <h2>2. Factores que hacen variar los importes reales</h2>
      <ul>
        <li>
          <strong>País y tipo de cambio interno:</strong> FuXion opera en 34
          países con listas de precios propias, factores de conversión de
          Volumen Comisionable (CV) e impuestos indirectos (IGV, IVA, Sales Tax)
          específicos de cada jurisdicción.
        </li>
        <li>
          <strong>Mix de productos comercializados:</strong> cada bebida o línea
          posee una relación particular entre su precio al público y sus Puntos
          Volumen (PV).
        </li>
        <li>
          <strong>Esfuerzo y habilidades individuales:</strong> la venta directa
          y el mercadeo en red son actividades empresariales independientes; los
          resultados dependen de la constancia, ética comercial, servicio al
          cliente y capacidad de liderazgo de cada afiliado.
        </li>
      </ul>

      <h2>3. Titular responsable</h2>
      <p>
        Portal gestionado por <strong>{LEGAL_OWNER}</strong>, domiciliado en{" "}
        <strong>{LEGAL_LOCATION}</strong>. Para solicitar aclaraciones sobre el
        plan de pagos vigente en tu país escríbenos a{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </SimplePage>
  );
}
