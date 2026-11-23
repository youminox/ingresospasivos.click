import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import { LEGAL_EMAIL, LEGAL_LOCATION, LEGAL_OWNER, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Aviso Legal y Titularidad del Sitio",
  description: `Aviso legal oficial de ingresospasivos.click, titularidad de ${LEGAL_OWNER}, domiciliado en ${LEGAL_LOCATION} (${LEGAL_EMAIL}).`,
  alternates: { canonical: `${SITE_URL}/aviso-legal/` },
};

export default function AvisoLegalPage() {
  return (
    <SimplePage title="Aviso Legal" path="/aviso-legal/">
      <h2>1. Datos identificativos del titular</h2>
      <p>
        En cumplimiento del deber de transparencia e información aplicable a los
        servicios de la sociedad de la información y comercio electrónico, se
        informa que el presente sitio web <strong>ingresospasivos.click</strong>{" "}
        es propiedad y está operado por:
      </p>
      <ul>
        <li>
          <strong>Titular:</strong> {LEGAL_OWNER}
        </li>
        <li>
          <strong>Domicilio:</strong> {LEGAL_LOCATION}
        </li>
        <li>
          <strong>Correo electrónico oficial:</strong>{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
        <li>
          <strong>Condición comercial:</strong> Distribuidor / Emprendedor
          Independiente autorizado del sistema FuXion.
        </li>
      </ul>

      <h2>2. Independencia respecto de la marca matriz</h2>
      <p>
        <strong>ingresospasivos.click</strong> es un portal informativo,
        educativo y de orientación comercial gestionado de manera independiente
        por <strong>{LEGAL_OWNER}</strong>. No constituye el sitio web
        corporativo oficial ni representa legalmente a la sociedad matriz FuXion
        Biotech S.A.C. ni a sus filiales internacionales. Las marcas, nombres de
        productos y logotipos de FuXion citados pertenecen a sus respectivos
        titulares y se emplean únicamente con fines descriptivos de distribución
        autorizada.
      </p>

      <h2>3. Carácter referencial de los cálculos y ejemplos de ingresos</h2>
      <p>
        Toda calculadora, tabla, porcentaje o proyección económica mostrada en{" "}
        <strong>ingresospasivos.click</strong> tiene finalidad estrictamente{" "}
        <strong>referencial, educativa e ilustrativa</strong>. Los importes
        reales que un distribuidor independiente puede percibir varían según el
        país, la moneda local, los puntos volumen (PV/CV) efectivamente
        comercializados a clientes reales, las retenciones tributarias y la
        dedicación individual, sin que exista garantía de ingresos fijos ni
        relación laboral.
      </p>

      <h2>4. Naturaleza nutracéutica de los productos</h2>
      <p>
        Los productos de la marca FuXion mencionados en este sitio son alimentos
        y bebidas funcionales en polvo; <strong>no son medicamentos</strong> y
        no están destinados a diagnosticar, tratar, curar ni prevenir ninguna
        enfermedad.
      </p>
    </SimplePage>
  );
}
