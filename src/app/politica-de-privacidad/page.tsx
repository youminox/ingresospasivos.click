import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import { LEGAL_EMAIL, LEGAL_LOCATION, LEGAL_OWNER, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Política de Privacidad y Protección de Datos",
  description: `Política de privacidad de ingresospasivos.click conforme a la Ley N.° 29733 del Perú y estándares internacionales. Responsable: ${LEGAL_OWNER}.`,
  alternates: { canonical: `${SITE_URL}/politica-de-privacidad/` },
};

export default function PrivacidadPage() {
  return (
    <SimplePage
      title="Política de Privacidad"
      path="/politica-de-privacidad/"
    >
      <h2>1. Responsable del tratamiento de datos</h2>
      <p>
        El responsable del tratamiento de los datos recabados a través de{" "}
        <strong>ingresospasivos.click</strong> es{" "}
        <strong>{LEGAL_OWNER}</strong>, domiciliado en{" "}
        <strong>{LEGAL_LOCATION}</strong>, con correo electrónico de contacto{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>, en observancia de
        la Ley N.° 29733 — Ley de Protección de Datos Personales de la República
        del Perú, su Reglamento, y los principios internacionales aplicables
        (incluyendo el RGPD para visitantes del Espacio Económico Europeo).
      </p>

      <h2>2. Qué información recopilamos</h2>
      <ul>
        <li>
          <strong>Consultas en el Chat Online IA y Calculadora:</strong>{" "}
          mensajes enviados voluntariamente por el usuario, identificador de
          sesión anónimo en navegador, país aproximado por cabecera de red para
          mostrar moneda referencial y métricas agregadas de clics.
        </li>
        <li>
          <strong>Comunicaciones por correo electrónico:</strong> cuando nos
          escribes directamente a <strong>{LEGAL_EMAIL}</strong>, tratamos tu
          nombre, correo y consulta exclusivamente para responderte.
        </li>
      </ul>

      <h2>3. Finalidad y encargados tecnológicos</h2>
      <p>
        Los datos técnicos se emplean para brindar orientación automatizada
        mediante el asistente virtual (operado sobre infraestructura segura en
        Supabase e inteligencia artificial de OpenAI), mejorar la precisión de
        las guías y medir el rendimiento de nuestros enlaces de registro. No
        vendemos ni cedemos bases de datos personales a terceros.
      </p>

      <h2>4. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de acceso,
        rectificación, supresión u oposición enviando una solicitud gratuita al
        correo electrónico <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>{" "}
        dirigida a <strong>{LEGAL_OWNER}</strong> ({LEGAL_LOCATION}).
      </p>
    </SimplePage>
  );
}
