import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import { LEGAL_EMAIL, LEGAL_LOCATION, LEGAL_OWNER, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Política de Cookies y Almacenamiento Local",
  description: `Información sobre el uso de almacenamiento local y cookies técnicas en ingresospasivos.click (${LEGAL_OWNER}).`,
  alternates: { canonical: `${SITE_URL}/politica-de-cookies/` },
};

export default function CookiesPage() {
  return (
    <SimplePage title="Política de Cookies" path="/politica-de-cookies/">
      <h2>1. Uso responsable de almacenamiento técnico</h2>
      <p>
        En <strong>ingresospasivos.click</strong>, sitio titularidad de{" "}
        <strong>{LEGAL_OWNER}</strong> (domiciliado en{" "}
        <strong>{LEGAL_LOCATION}</strong>, correo{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>), priorizamos una
        navegación ligera, rápida y respetuosa con tu privacidad.
      </p>

      <h2>2. Elementos técnicos almacenados en tu navegador</h2>
      <ul>
        <li>
          <strong>Preferencia de país y moneda (localStorage):</strong> guarda
          el código del país seleccionado en nuestra calculadora y bloques Pro 1
          / Pro 2 para que no tengas que volver a elegirlo en cada página.
        </li>
        <li>
          <strong>Historial local del Chat Online IA:</strong> conserva en tu
          propio dispositivo los últimos mensajes de tu conversación con nuestro
          asesor virtual para mantener continuidad mientras recorres las guías.
        </li>
      </ul>

      <h2>3. Cómo gestionar o borrar estos datos</h2>
      <p>
        Puedes borrar en cualquier instante el almacenamiento local y las
        cookies desde los ajustes de privacidad de Chrome, Safari, Firefox o
        Edge. Para cualquier duda escríbenos a{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </SimplePage>
  );
}
