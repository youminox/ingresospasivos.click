import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import EnrollLink from "@/components/EnrollLink";
import { LEGAL_EMAIL, LEGAL_LOCATION, LEGAL_OWNER, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sobre el Distribuidor Oficial Charlie Lingan y Nuestro Equipo",
  description: `Conoce a ${LEGAL_OWNER} (Charlie Lingan), distribuidor independiente FuXion en ${LEGAL_LOCATION}, y al equipo de personas que apoya tu negocio de afiliación.`,
  alternates: { canonical: `${SITE_URL}/sobre-el-distribuidor/` },
};

export default function SobreDistribuidorPage() {
  return (
    <SimplePage
      title="Sobre el Distribuidor y Nuestro Equipo"
      eyebrow="Liderazgo, Sistemas Digitales y Mentoría"
      path="/sobre-el-distribuidor/"
    >
      <h2>Quién está detrás de IngresosPasivos.click</h2>
      <p>
        <strong>ingresospasivos.click</strong> ha sido desarrollado y es
        dirigido por <strong>{LEGAL_OWNER}</strong> (conocido comercialmente
        como <strong>Charlie Lingan</strong>), emprendedor digital y
        Distribuidor Independiente de FuXion domiciliado en{" "}
        <strong>{LEGAL_LOCATION}</strong>, con correo electrónico directo{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>

      <h2>Un equipo de personas reales para impulsarte</h2>
      <p>
        Creemos en modernizar la venta directa uniendo tecnología (SEO,
        calculadoras interactivas e inteligencia artificial responsable) con el
        calor humano de un equipo colaborador. Cuando activas tu registro en
        nuestra red accedes a:
      </p>
      <ul>
        <li>
          <strong>Acompañamiento de arranque:</strong> te guiamos en la
          configuración de tu Tienda Virtual de Dropshipping y en tu estrategia
          para los primeros 6 Clientes Preferentes (Bono Pro 1).
        </li>
        <li>
          <strong>Apoyo para afiliados:</strong> nuestro equipo de mentores te
          respalda explicando el modelo de negocio a tus invitados mientras
          desarrollas tus habilidades para calificar a Pro 2.
        </li>
        <li>
          <strong>Alcance internacional en 34 países:</strong> operamos con
          socios y clientes en Sudamérica, Norteamérica, Centroamérica y Europa.
        </li>
      </ul>

      <div className="my-8">
        <EnrollLink
          source="about-page-cta"
          className="btn btn-lime shine text-sm"
        >
          Registrarme ahora en el equipo de Charlie Lingan →
        </EnrollLink>
      </div>
    </SimplePage>
  );
}
