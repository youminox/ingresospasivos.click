import Link from "next/link";
import EnrollLink from "./EnrollLink";
import {
  FUXION_DISCLAIMER,
  LEGAL_EMAIL,
  LEGAL_LOCATION,
  LEGAL_OWNER,
} from "@/lib/content";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#07131d] text-white">
      <div className="wrap py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fxblue to-fxlime font-display text-lg font-black text-white">
                IP
              </span>
              <span className="font-display text-xl font-extrabold">
                IngresosPasivos<span className="text-fxlime">.click</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Guía especializada sobre las dos vías de ingresos referenciales
              con productos nutracéuticos FuXion: venta por Dropshipping sin
              stock y desarrollo de equipos Pro 1 / Pro 2 en 34 países.
            </p>
            <div className="mt-5">
              <EnrollLink
                source="footer-cta"
                className="btn btn-lime shine !px-5 !py-2.5 text-xs"
              >
                Inscribirme en FuXion →
              </EnrollLink>
            </div>
          </div>

          <div>
            <p className="font-display text-sm font-extrabold uppercase tracking-wider text-fxlime">
              Negocio & Herramientas
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li>
                <Link href="/calculadora-de-ingresos/" className="hover:text-white">
                  Calculadora IA de Comisiones
                </Link>
              </li>
              <li>
                <Link
                  href="/vender-productos-fuxion/"
                  className="hover:text-white"
                >
                  Vender Productos FuXion (60 SKUs)
                </Link>
              </li>
              <li>
                <Link
                  href="/dropshipping-y-tienda-virtual-fuxion/"
                  className="hover:text-white"
                >
                  Dropshipping y Tienda Virtual
                </Link>
              </li>
              <li>
                <Link
                  href="/plan-de-pagos-y-bonos-fuxion/"
                  className="hover:text-white"
                >
                  Plan Pro-Lev: Pro 1, Pro 2 y Rangos
                </Link>
              </li>
              <li>
                <Link
                  href="/afiliarse-a-fuxion-por-pais/"
                  className="hover:text-white"
                >
                  Afiliarse en los 34 Países
                </Link>
              </li>
              <li>
                <Link
                  href="/comparativas-de-negocio-y-afiliacion/"
                  className="hover:text-white"
                >
                  Comparativas de Negocio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-extrabold uppercase tracking-wider text-fxlime">
              Guías Educativas SEO
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li>
                <Link
                  href="/fundamentos-de-ingresos-pasivos/"
                  className="hover:text-white"
                >
                  Fundamentos de Ingresos Pasivos
                </Link>
              </li>
              <li>
                <Link
                  href="/ingresos-extra-por-perfil-y-profesion/"
                  className="hover:text-white"
                >
                  Ingresos Extra por Profesión
                </Link>
              </li>
              <li>
                <Link
                  href="/redes-de-mercadeo-eticas-y-modernas/"
                  className="hover:text-white"
                >
                  Redes de Mercadeo Éticas
                </Link>
              </li>
              <li>
                <Link
                  href="/ventas-por-whatsapp-y-redes-sociales/"
                  className="hover:text-white"
                >
                  Ventas por WhatsApp y Redes
                </Link>
              </li>
              <li>
                <Link
                  href="/inteligencia-artificial-para-vendedores/"
                  className="hover:text-white"
                >
                  IA para Vendedores
                </Link>
              </li>
              <li>
                <Link
                  href="/finanzas-para-comisionistas-y-emprendedores/"
                  className="hover:text-white"
                >
                  Finanzas para Comisionistas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-extrabold uppercase tracking-wider text-fxlime">
              Titularidad Legal y Contacto
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              <li>
                <strong className="text-white">Titular:</strong> {LEGAL_OWNER}
              </li>
              <li>
                <strong className="text-white">Domicilio:</strong>{" "}
                {LEGAL_LOCATION}
              </li>
              <li>
                <strong className="text-white">Email oficial:</strong>{" "}
                <a
                  href={`mailto:${LEGAL_EMAIL}`}
                  className="text-fxlime underline"
                >
                  {LEGAL_EMAIL}
                </a>
              </li>
            </ul>
            <ul className="mt-4 space-y-2 text-xs text-white/65">
              <li>
                <Link
                  href="/sobre-el-distribuidor/"
                  className="hover:text-white underline"
                >
                  Sobre el Distribuidor y Equipo
                </Link>
              </li>
              <li>
                <Link href="/contacto/" className="hover:text-white underline">
                  Contacto Directo
                </Link>
              </li>
              <li>
                <Link
                  href="/descargo-de-ingresos/"
                  className="hover:text-white underline"
                >
                  Descargo de Ingresos Referenciales
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-editorial/"
                  className="hover:text-white underline"
                >
                  Política Editorial
                </Link>
              </li>
              <li>
                <Link
                  href="/aviso-legal/"
                  className="hover:text-white underline"
                >
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-privacidad/"
                  className="hover:text-white underline"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-cookies/"
                  className="hover:text-white underline"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/55">
          <p>{FUXION_DISCLAIMER}</p>
          <p className="mt-2">
            © {new Date().getFullYear()} {LEGAL_OWNER} · {LEGAL_LOCATION} ·{" "}
            {LEGAL_EMAIL} · Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
