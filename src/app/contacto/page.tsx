import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import OpenChatButton from "@/components/OpenChatButton";
import EnrollLink from "@/components/EnrollLink";
import { LEGAL_EMAIL, LEGAL_LOCATION, LEGAL_OWNER, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contacto Directo con Charlie Lingan",
  description: `Comunícate con el distribuidor oficial ${LEGAL_OWNER} (${LEGAL_EMAIL}) en ${LEGAL_LOCATION} o consulta en nuestro Chat Online IA.`,
  alternates: { canonical: `${SITE_URL}/contacto/` },
};

export default function ContactoPage() {
  return (
    <SimplePage
      title="Contacto Directo"
      eyebrow="Atención al Emprendedor y Cliente"
      path="/contacto/"
    >
      <h2>Canales oficiales de atención</h2>
      <p>
        Para cualquier consulta sobre cómo afiliarte al sistema de FuXion, cómo
        operar tu Tienda Virtual de Dropshipping sin stock, funcionamiento
        referencial de los bonos Pro 1 y Pro 2 o dudas sobre productos, puedes
        comunicarte directamente con nosotros:
      </p>
      <ul>
        <li>
          <strong>Distribuidor Oficial / Titular:</strong> {LEGAL_OWNER}{" "}
          (Charlie Lingan)
        </li>
        <li>
          <strong>Ciudad y País:</strong> {LEGAL_LOCATION}
        </li>
        <li>
          <strong>Correo electrónico directo:</strong>{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
      </ul>

      <div className="my-8 flex flex-wrap gap-3">
        <OpenChatButton
          label="💬 Iniciar Chat Online IA"
          className="btn btn-buy text-sm"
        />
        <EnrollLink
          source="contact-page-cta"
          className="btn btn-lime shine text-sm"
        >
          Ir al Registro Oficial FuXion →
        </EnrollLink>
      </div>
    </SimplePage>
  );
}
