import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnrollLink from "@/components/EnrollLink";
import ClientEffects from "@/components/ClientEffects";
import ArticleCard from "@/components/ArticleCard";
import ReadingProgress from "@/components/ReadingProgress";
import SplitHeading from "@/components/SplitHeading";
import OpenChatButton from "@/components/OpenChatButton";
import { JsonLd } from "@/components/Breadcrumbs";
import Hero from "@/components/home/Hero";
import DropshippingScrollStory from "@/components/home/DropshippingScrollStory";
import IncomeCalculatorIA from "@/components/home/IncomeCalculatorIA";
import Pro1Pro2GeoSection from "@/components/home/Pro1Pro2GeoSection";
import ProductSalesOrbit, {
  type ProductOrbitItem,
} from "@/components/home/ProductSalesOrbit";
import BusinessCounters, {
  type CounterMetric,
} from "@/components/home/BusinessCounters";
import LeverageLabSection from "@/components/home/LeverageLabSection";
import ProfilesCarousel, {
  type ProfileMoment,
} from "@/components/home/ProfilesCarousel";
import {
  LEGAL_EMAIL,
  LEGAL_LOCATION,
  LEGAL_OWNER,
  OG_DEFAULT,
  SITE_URL,
  absolute,
  ambient,
  getArticlesIn,
  getByPath,
  getCategories,
  safeHref,
  type Article,
} from "@/lib/content";

export const metadata: Metadata = {
  title:
    "Cómo Generar Ingresos con FuXion: Dropshipping sin Stock, Bono Pro 1, Pro 2 y Calculadora IA",
  description:
    "Descubre las 2 vías para generar ingresos referenciales con FuXion en 34 países: 1) Venta de productos por Dropshipping sin comprar stock y 2) Red Multinivel (Pro 1 y Pro 2). Incluye Calculadora IA.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    title:
      "Cómo Generar Ingresos con FuXion: Dropshipping sin Stock y Red Multinivel",
    description:
      "Simula tus comisiones referenciales con IA en 34 países, entiende el Dropshipping FuXion sin comprar stock y regístrate con el equipo de Charlie Lingan.",
    images: [
      {
        url: absolute(OG_DEFAULT()),
        width: 1200,
        height: 675,
        alt: "Negocio de Dropshipping y Afiliados FuXion — IngresosPasivos.click",
      },
    ],
  },
};

const MARQUEE_1 = [
  "Sin comprar stock acumulado",
  "34 países oficiales en América y Europa",
  "Tienda Virtual gratuita al afiliarte",
  "FuXion cobra, factura y envía al cliente",
  "Venta Directa referencial: 20% a 50%",
  "Bono Pro 1 (500 PV · 6 Clientes)",
  "Bono Pro 2 (Duplicación de Equipo)",
  "Mentoría del equipo Charlie Lingan",
];

const MARQUEE_2 = [
  "Prunex1 · 10 PV",
  "Thermo T3 · 20 PV",
  "Vita Xtra T+ · 20 PV",
  "Beauty-In Colágeno · 25 PV",
  "NoCarb-T · 20 PV",
  "No Stress · 22 PV",
  "BioPro+ Fit · 16 PV",
  "Youth Elixir · 20 PV",
  "Clean Label · 0 g Azúcares Añadidos",
];

const HOME_FAQS = [
  {
    q: "¿Cuáles son las dos formas de generar ingresos con FuXion?",
    a: "La primera vía es la venta directa de bebidas nutracéuticas mediante tu Tienda Virtual de Dropshipping (sin comprar stock ni hacer envíos físicos, ganando del 20% al 50% referencial sobre volumen comisionable más el Bono Pro 1). La segunda vía es construir una red multinivel enseñando el sistema a nuevos socios para desbloquear el Bono Pro 2, Pro 3 y comisiones residuales sobre el volumen de equipo.",
  },
  {
    q: "¿De verdad no necesito comprar inventario ni almacenar cajas en casa?",
    a: "Correcto. Al activar tu código de distribuidor independiente recibes tu enlace personalizado de Tienda Virtual. Cuando un cliente compra en línea, FuXion procesa el pago, emite el comprobante oficial, empaca el producto en su centro logístico y lo despacha directo a la dirección del cliente en cualquiera de los 34 países habilitados.",
  },
  {
    q: "¿Cómo funcionan el Bono Pro 1 y el Bono Pro 2?",
    a: "El Bono Pro 1 se alcanza acumulando al menos 500 puntos volumen (PV) de Clientes Preferentes en un período de 4 semanas con un mínimo de 6 clientes activos (cada uno con compras de 35+ PV). El Bono Pro 2 se logra cuando tú mantienes tu Pro 1 y ayudas a 4 socios directos de tu equipo a calificar también a su propio Pro 1 dentro del mismo período.",
  },
  {
    q: "¿Los montos de la calculadora y del sitio son fijos o garantizados?",
    a: "No. Todos los importes, porcentajes y conversiones de moneda son estrictamente referenciales e ilustrativos basados en el Plan Pro-Lev de FuXion. Los ingresos reales dependen de las ventas efectivas realizadas, el país, los puntos PV/CV de cada producto y los impuestos locales.",
  },
  {
    q: "¿En qué países puedo registrarme y vender productos FuXion?",
    a: "Actualmente FuXion opera oficialmente en 34 países: Perú, Colombia, Chile, Ecuador, Bolivia, Argentina, Brasil, Uruguay, Estados Unidos, México, Costa Rica, Guatemala, Honduras, Panamá y 20 países de la Eurozona en Europa (incluyendo España, Alemania, Italia, Francia, Portugal y Países Bajos).",
  },
  {
    q: "¿Tendré apoyo humano si recién empiezo en afiliación o ventas digitales?",
    a: "Sí. Contamos con un equipo activo de personas y mentores liderado por el distribuidor oficial Carlos Lingan Borja (Charlie Lingan) que te acompaña con herramientas digitales, presentaciones de negocio para tus prospectos y atención directa en info@charlielingan.com.",
  },
];

const CAT_ICONS: Record<string, string> = {
  cup: "🥤",
  globe: "🌎",
  trophy: "🏆",
  truck: "📦",
  scale: "⚖️",
  spark: "✨",
  users: "👥",
  box: "🛒",
  link: "🔗",
  network: "🤝",
  chat: "💬",
  leaf: "🌿",
  clock: "⏱️",
  cpu: "🤖",
  chart: "📈",
};

export default function HomePage() {
  const cats = getCategories();

  const orbitItems: ProductOrbitItem[] = [
    {
      slug: "prunex1",
      name: "Prunex1",
      img: "/img/productos-fuxion/prunex1-bodegon.webp",
      pointsPv: 10,
      category: "Limpieza Digestiva",
      sticks: "28 sticks",
      audience:
        "El producto puerta de entrada #1 en ventas digitales: bebida caliente de fibras solubles (psyllium, inulina, guindón) de altísima rotación.",
      href: safeHref(
        "/vender-productos-fuxion/como-vender-prunex1-de-fuxion-sin-stock-comisiones-y-puntos/"
      ),
    },
    {
      slug: "thermo-t3",
      name: "Thermo T3",
      img: "/img/productos-fuxion/thermo-t3-bodegon.webp",
      pointsPv: 20,
      category: "Control de Peso",
      sticks: "28 sticks",
      audience:
        "Mix de té rojo, verde y negro con L-carnitina. Aporta 20 PV completos por doypack: con 25 unidades en 4 semanas cubres los 500 PV del Pro 1.",
      href: safeHref(
        "/vender-productos-fuxion/como-vender-thermo-t3-de-fuxion-margen-puntos-pv-y-recompra/"
      ),
    },
    {
      slug: "vita-xtra-t",
      name: "Vita Xtra T+",
      img: "/img/productos-fuxion/vita-xtra-t-bodegon.webp",
      pointsPv: 20,
      category: "Energía Diaria",
      sticks: "28 sticks",
      audience:
        "Guayusa, té verde, acai berry y ginseng. Muy demandado por oficinistas, conductores, universitarios y emprendedores que evitan bebidas azucaradas.",
      href: safeHref(
        "/vender-productos-fuxion/como-vender-vita-xtra-t-fuxion-energia-diaria-y-comisiones/"
      ),
    },
    {
      slug: "beauty-in",
      name: "Beauty-In",
      img: "/img/productos-fuxion/beauty-in-bodegon.webp",
      pointsPv: 25,
      category: "Colágeno & Piel",
      sticks: "28 sticks",
      audience:
        "Péptidos de colágeno bioactivo con coenzima Q10 y biotina. Con 25 PV por caja solo requieres unas 20 unidades mensuales para llegar a 500 PV.",
      href: safeHref(
        "/vender-productos-fuxion/como-vender-beauty-in-colageno-fuxion-25-puntos-pv-y-margen/"
      ),
    },
    {
      slug: "nocarb-t",
      name: "NoCarb-T",
      img: "/img/productos-fuxion/nocarb-t-bodegon.webp",
      pointsPv: 20,
      category: "Línea Control",
      sticks: "28 sticks",
      audience:
        "Fibras solubles de yacón, inulina y canela. Ideal para armar combos de 40 PV junto a Thermo T3 y calificar clientes de 35+ PV fácilmente.",
      href: safeHref(
        "/vender-productos-fuxion/como-vender-nocarb-t-fuxion-ticket-cruzado-y-clientes/"
      ),
    },
    {
      slug: "no-stress",
      name: "No Stress",
      img: "/img/productos-fuxion/no-stress-bodegon.webp",
      pointsPv: 22,
      category: "Bienestar Mental",
      sticks: "28 sticks",
      audience:
        "L-teanina, aminoácidos y magnesio para el ritmo urbano moderno. Suma 22 PV por envase con una excelente tasa de fidelización mensual.",
      href: safeHref(
        "/vender-productos-fuxion/como-vender-no-stress-fuxion-bienestar-mental-y-comisiones/"
      ),
    },
    {
      slug: "biopro-fit",
      name: "BioPro+ Fit",
      img: "/img/productos-fuxion/biopro-fit-bodegon.webp",
      pointsPv: 16,
      category: "Proteína Funcional",
      sticks: "14 sobres",
      audience:
        "Batido proteico de 14 porciones: al reponerse cada dos semanas suele duplicar la frecuencia de pedidos por Cliente Preferente.",
      href: safeHref(
        "/vender-productos-fuxion/como-vender-biopro-fit-proteina-fuxion-clientes-recurrentes/"
      ),
    },
    {
      slug: "youth-elixir",
      name: "Youth Elixir",
      img: "/img/productos-fuxion/youth-elixir-bodegon.webp",
      pointsPv: 20,
      category: "Línea Antiedad",
      sticks: "28 sticks",
      audience:
        "Resveratrol, aminoácidos y antioxidantes de uva para consumo nocturno. 20 PV por caja en un segmento de alto poder adquisitivo.",
      href: safeHref(
        "/vender-productos-fuxion/como-vender-youth-elixir-fuxion-nicho-antiedad/"
      ),
    },
  ];

  const counters: CounterMetric[] = [
    {
      value: 34,
      suffix: " países",
      label: "Cobertura Internacional Oficial",
      sub: "Sudamérica, Norte/Centroamérica y 20 países de Europa",
    },
    {
      value: 0,
      suffix: " cajas",
      label: "Stock Físico Obligatorio",
      sub: "Operando mediante Tienda Virtual de Dropshipping FuXion",
    },
    {
      value: 50,
      suffix: "% máx.",
      label: "Escala Venta Directa Referencial",
      sub: "Desde 20% inicial hasta 40%–50% según puntos PV",
    },
    {
      value: 2535,
      suffix: "+",
      label: "Guías SEO y Comerciales",
      sub: "Análisis sin humo de productos, países, bonos y ventas",
    },
  ];

  const profileMoments: ProfileMoment[] = [
    {
      img: ambient("scene-perfiles-2"),
      alt: "Emprendedor desde casa gestionando su tienda virtual en horario flexible",
      tag: "45 a 60 min / día",
      title: "En paralelo a tu empleo o familia",
      desc: "Cómo organizar un bloque diario enfocado en WhatsApp Business y seguimiento de 6 a 10 clientes sin descuidar tu trabajo actual.",
      href: safeHref(
        "/ingresos-extra-por-perfil-y-profesion/empleados-de-oficina-lunes-a-viernes-rutina-de-45-minutos-al-dia/"
      ),
    },
    {
      img: ambient("scene-whatsapp-2"),
      alt: "Grabación sencilla de bebida funcional en cocina luminosa sin mostrar rostro",
      tag: "Solo Ventas Online",
      title: "Creador digital y Dropshipping puro",
      desc: "Ideal si no te interesa reclutar equipos: vende a través de videos cortos educativos y cobra comisiones + Bono Pro 1.",
      href: safeHref(
        "/dropshipping-y-tienda-virtual-fuxion/videos-cortos-demostrativos-de-preparacion-paso-a-paso-desde-cero/"
      ),
    },
    {
      img: ambient("scene-perfiles-3"),
      alt: "Entrenador personal con bebida funcional deportiva y tablet",
      tag: "Salud & Deporte",
      title: "Entrenadores, nutrición y bienestar",
      desc: "Monetiza de forma ética tu comunidad recomendando bebidas Clean Label sin azúcar añadida mediante códigos QR a tu tienda.",
      href: safeHref(
        "/ingresos-extra-por-perfil-y-profesion/entrenadores-personales-y-coaches-fitness-modelo-dropshipping-sin-comprar-stock/"
      ),
    },
    {
      img: ambient("home-paises-global"),
      alt: "Escritorio internacional conectando mercados en América y Europa",
      tag: "Multimoneda",
      title: "Expansión en EE. UU., España y Latam",
      desc: "Aprovecha un único código global para registrar clientes y socios en dólares, euros, soles, pesos y reales.",
      href: safeHref(
        "/afiliarse-a-fuxion-por-pais/como-afiliarse-a-fuxion-en-espana-requisitos-y-comisiones/"
      ),
    },
    {
      img: ambient("home-equipo-mentoria"),
      alt: "Reunión de liderazgo y duplicación de equipo de afiliados",
      tag: "Liderazgo Pro 2",
      title: "Constructor de equipos y redes",
      desc: "Aprende a formar 4 socios directos en Pro 1 apalancándote en el sistema de presentaciones del equipo de Charlie Lingan.",
      href: safeHref(
        "/plan-de-pagos-y-bonos-fuxion/bono-pro-2-fuxion-4-socios-directos-comisiones/"
      ),
    },
  ];

  const featuredPaths = [
    "/vender-productos-fuxion/como-vender-prunex1-de-fuxion-sin-stock-comisiones-y-puntos/",
    "/plan-de-pagos-y-bonos-fuxion/bono-pro-1-fuxion-500-puntos-como-lograrlo/",
    "/plan-de-pagos-y-bonos-fuxion/bono-pro-2-fuxion-4-socios-directos-comisiones/",
    "/afiliarse-a-fuxion-por-pais/como-afiliarse-a-fuxion-en-peru-requisitos-y-comisiones/",
    "/afiliarse-a-fuxion-por-pais/como-afiliarse-a-fuxion-en-mexico-requisitos-y-comisiones/",
    "/comparativas-de-negocio-y-afiliacion/dropshipping-fuxion-vs-shopify-aliexpress-inversion-inicial-y-riesgo/",
  ];
  const featuredArticles = featuredPaths
    .map((p) => getByPath(p))
    .filter(Boolean) as Article[];

  return (
    <>
      <ReadingProgress />
      <Header variant="dark" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${SITE_URL}/#webpage`,
              url: `${SITE_URL}/`,
              name: "Cómo Generar Ingresos con FuXion: Dropshipping y Multinivel",
              inLanguage: "es",
              isPartOf: { "@id": `${SITE_URL}/#website` },
            },
            {
              "@type": "FAQPage",
              "@id": `${SITE_URL}/#faq`,
              mainEntity: HOME_FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />

      <main>
        {/* 1–2. Hero 3D Tilt + Partículas + Buscador */}
        <Hero />

        {/* 3. Doble Cinta Marquee */}
        <div className="relative border-b border-[var(--line)] bg-white py-5">
          <div className="marquee">
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track font-display text-base font-bold text-fxink/85 sm:text-lg"
                aria-hidden={k === 1}
              >
                {MARQUEE_1.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 whitespace-nowrap"
                  >
                    <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-gradient-to-br from-fxlime to-fxblue" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="marquee reverse mt-3" aria-hidden>
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track text-xs font-semibold uppercase tracking-[0.14em] text-fxbluedeep/80 sm:text-sm"
              >
                {MARQUEE_2.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 whitespace-nowrap"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Las 2 Vías Reales de Ingresos con FuXion */}
        <section id="dos-tipos-de-ingresos" className="wrap py-24">
          <div className="mb-12 max-w-3xl">
            <span className="eyebrow" data-reveal>
              Dos Modelos en un Mismo Código
            </span>
            <SplitHeading
              text="Elige cómo generar ingresos:"
              accent={{
                text: "vendiendo productos o creando red",
                className: "text-fxblue",
              }}
              className="section-title mt-3"
            />
            <p className="mt-4 text-lg text-[var(--muted)]" data-reveal>
              Al inscribirte en FuXion no estás atado a un único formato. Puedes
              dedicarte <strong>exclusivamente al comercio electrónico</strong>{" "}
              de sus bebidas funcionales, enfocarte en{" "}
              <strong>construir equipos de afiliados</strong>, o integrar ambos
              motores.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Tipo 1: Venta de Productos */}
            <div className="card spot p-7 sm:p-9" data-reveal>
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-fxsky px-3.5 py-1 font-display text-xs font-extrabold text-fxbluedeep">
                  TIPO 1 · E-COMMERCE & DROPSHIPPING
                </span>
                <span className="text-2xl" aria-hidden>
                  🥤
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
                Venta de Productos FuXion sin Comprar Stock
              </h3>
              <p className="mt-3 text-[var(--muted)]">
                Diseñado para quien quiere{" "}
                <strong className="text-fxink">
                  solo recomendar y vender productos reales
                </strong>{" "}
                sin armar reuniones ni reclutar socios. Te apalancas en tu
                Tienda Virtual oficial y en la recompra mensual de bebidas de 28
                sticks.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-fxink">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-fxblue">✓</span>
                  <span>
                    <strong>Comisiones directas del 20% al 50%*</strong> según
                    tu volumen de puntos (PV) acumulado en 4 semanas.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-fxblue">✓</span>
                  <span>
                    <strong>Bono Cliente Preferente Pro 1:</strong> suma 500 PV
                    con mínimo 6 clientes registrados y recibe un bono extra en
                    efectivo más producto gratis*.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-fxblue">✓</span>
                  <span>
                    <strong>Cero logística pesada:</strong> FuXion procesa el
                    pago y envía directo desde su almacén al domicilio del
                    cliente.
                  </span>
                </li>
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/vender-productos-fuxion/"
                  className="btn btn-buy text-sm"
                  data-magnetic
                >
                  Explorar Productos y Márgenes →
                </Link>
                <a href="#como-funciona-dropshipping" className="btn btn-ghost text-sm">
                  Ver flujo Dropshipping
                </a>
              </div>
            </div>

            {/* Tipo 2: Negocio Multinivel / Afiliados */}
            <div
              className="card spot spot-dark border-transparent bg-gradient-to-br from-[#07131d] via-[#0b2a42] to-[#083856] p-7 text-white sm:p-9"
              data-reveal
              data-reveal-delay="1"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-fxlime px-3.5 py-1 font-display text-xs font-extrabold text-[#1b2d04]">
                  TIPO 2 · MULTINIVEL & AFILIACIÓN
                </span>
                <span className="text-2xl" aria-hidden>
                  🚀
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
                Red de Afiliados, Duplicación Pro 2 e Ingresos Residuales
              </h3>
              <p className="mt-3 text-white/80">
                Diseñado para quien busca{" "}
                <strong className="text-white">
                  escalar ingresos formando equipos comerciales
                </strong>{" "}
                en uno o varios de los 34 países de FuXion, ayudando a nuevos
                distribuidores a construir sus propias carteras.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-white/90">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-fxlime">✓</span>
                  <span>
                    <strong>Bono Pro 2 y Pro 3:</strong> mantén tu Pro 1 y
                    ayuda a 4 socios directos a lograr su Pro 1 para desbloquear
                    bonos superiores por período*.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-fxlime">✓</span>
                  <span>
                    <strong>Plan Pro-Lev Multinivel:</strong> Bono Pack
                    Profesional, Bono Familia, Bono Balance Binario y carrera de
                    rangos ejecutivos (Leader X, Diamond).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-fxlime">✓</span>
                  <span>
                    <strong>Respaldo de equipo real:</strong> nuestro equipo de
                    personas te apoya en capacitaciones y presentaciones para
                    tus prospectos.
                  </span>
                </li>
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <EnrollLink
                  source="home-two-paths"
                  className="btn btn-lime shine text-sm"
                  magnetic
                >
                  Registrarme en el Equipo →
                </EnrollLink>
                <a href="#pro1-pro2" className="btn btn-glass text-sm">
                  Ver Pro 1 y Pro 2 en mi moneda
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Escena Fijada GSAP: Cómo funciona el Dropshipping sin Stock */}
        <DropshippingScrollStory />

        {/* 6. Calculadora IA + Supabase Geolocalizada */}
        <IncomeCalculatorIA />

        {/* 7. Comisiones de Venta, Pro 1 y Pro 2 Geolocalizados */}
        <Pro1Pro2GeoSection />

        {/* 8. Órbita de Productos Oficiales FuXion */}
        <section className="wrap py-24">
          <ProductSalesOrbit items={orbitItems} />
        </section>

        {/* 9. Contadores Verificables del Sistema */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#052942] via-[#07131d] to-[#0d3b26] py-24 text-white">
          <div className="hero-aurora opacity-40" />
          <div className="wrap relative">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow !text-fxlime" data-reveal>
                Infraestructura Corporativa Real
              </span>
              <SplitHeading
                text="Te apalancas en una multinacional,"
                accent={{
                  text: "no empiezas en blanco",
                  className: "text-gradient",
                }}
                className="section-title mt-3"
              />
            </div>
            <BusinessCounters items={counters} />
          </div>
        </section>

        {/* 10. Laboratorio Interactivo de Apalancamiento FuXion (3 en 1) */}
        <LeverageLabSection />

        {/* 11. Equipo de Personas que nos Ayudan con el Negocio de Afiliación */}
        <section className="bg-fxsky/80 py-24">
          <div className="wrap grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-[var(--line)] shadow-2xl" data-reveal>
              <Image
                src={ambient("home-equipo-mentoria")}
                alt="Equipo de mentores y emprendedores ayudando en el negocio de afiliación FuXion"
                fill
                sizes="(max-width: 1024px) 100vw, 580px"
                className="object-cover"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-[#07131d]/90 px-4 py-1.5 text-xs font-bold text-fxlime backdrop-blur">
                🤝 Mentoría & Soporte con Charlie Lingan
              </span>
            </div>

            <div>
              <span className="eyebrow" data-reveal>
                Acompañamiento Humano y Digital
              </span>
              <SplitHeading
                text="No estás solo: tenemos un"
                accent={{
                  text: "equipo que te ayuda a crecer",
                  className: "text-fxbluedeep",
                }}
                className="section-title mt-3"
              />
              <p className="mt-4 text-lg text-[var(--muted)]" data-reveal>
                Uno de los mayores temores al iniciar en ventas o en el negocio
                de afiliación es no saber cómo explicar el sistema. Al
                registrarte con el distribuidor oficial{" "}
                <strong className="text-fxink">
                  {LEGAL_OWNER} (Charlie Lingan)
                </strong>
                , te integras a un equipo activo que trabaja contigo:
              </p>
              <div className="mt-6 grid gap-3.5 sm:grid-cols-2" data-reveal>
                {[
                  [
                    "🎓",
                    "Inducción de Primeras 72h",
                    "Configuramos juntos tu Tienda Virtual y tus enlaces de Cliente Preferente.",
                  ],
                  [
                    "🎤",
                    "Apoyo en Presentaciones",
                    "Líderes con experiencia te ayudan a explicar el negocio a tus primeros prospectos.",
                  ],
                  [
                    "📲",
                    "Guiones y Embudos Éticos",
                    "Plantillas probadas para WhatsApp Business, redes sociales y seguimiento de 28 días.",
                  ],
                  [
                    "✉️",
                    "Canal Directo",
                    `Contacto transparente en ${LEGAL_EMAIL} desde ${LEGAL_LOCATION} para todo el mundo.`,
                  ],
                ].map(([icon, t, d]) => (
                  <div key={t} className="card spot p-4">
                    <p className="font-display text-sm font-extrabold text-fxink">
                      {icon} {t}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <EnrollLink
                  source="team-section"
                  className="btn btn-lime shine text-sm"
                  magnetic
                >
                  Unirme al Equipo en FuXion →
                </EnrollLink>
                <OpenChatButton
                  label="Hablar con el Asesor IA"
                  prompt="Hola, quiero saber cómo funciona el apoyo del equipo de Charlie Lingan al afiliarme."
                  className="btn btn-ghost text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 12. Carrusel de Perfiles y Escenarios */}
        <section className="overflow-hidden py-24">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                Adaptado a tu Realidad
              </span>
              <SplitHeading
                text="Perfiles reales,"
                accent={{ text: "rutinas sostenibles", className: "text-fxblue" }}
                className="section-title mt-3"
              />
            </div>
            <ProfilesCarousel items={profileMoments} />
          </div>
        </section>

        {/* 13. Bento Grid de los 15 Silos + Guías Destacadas */}
        <section className="bg-gradient-to-b from-white to-fxsky py-24">
          <div className="wrap">
            <div className="mb-10 max-w-3xl">
              <span className="eyebrow" data-reveal>
                Biblioteca de +2,500 Guías Sin Canibalización
              </span>
              <SplitHeading
                text="Todo el ecosistema,"
                accent={{
                  text: "organizado en 15 centros temáticos",
                  className: "text-fxbluedeep",
                }}
                className="section-title mt-3"
              />
            </div>

            <div className="grid auto-rows-[minmax(180px,auto)] gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cats.map((c, i) => {
                const count = getArticlesIn(c.slug).length;
                const highlight = i === 0;
                return (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}/`}
                    className={`card spot group flex flex-col p-6 ${
                      highlight
                        ? "spot-dark border-transparent bg-gradient-to-br from-[#07131d] via-[#0a3859] to-fxblue text-white md:col-span-2"
                        : ""
                    }`}
                    data-reveal
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`grid h-11 w-11 place-items-center rounded-2xl text-xl ${
                          highlight ? "bg-white/15" : "bg-fxsky"
                        }`}
                        aria-hidden
                      >
                        {CAT_ICONS[c.icon] || "📌"}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${
                          highlight
                            ? "bg-fxlime text-[#1b2d04]"
                            : c.isTransactional
                            ? "bg-amber-100 text-amber-900"
                            : "bg-fxsky text-fxbluedeep"
                        }`}
                      >
                        {count} guías
                      </span>
                    </div>
                    <h3
                      className={`mt-4 font-display font-extrabold ${
                        highlight ? "text-2xl sm:text-3xl" : "text-xl"
                      }`}
                    >
                      {c.name}
                    </h3>
                    <p
                      className={`mt-2 text-sm ${
                        highlight ? "text-white/80" : "text-[var(--muted)]"
                      }`}
                    >
                      {c.description}
                    </p>
                    <span
                      className={`mt-auto pt-4 text-xs font-bold ${
                        highlight ? "text-fxlime" : "text-fxbluedeep"
                      }`}
                    >
                      Explorar categoría →
                    </span>
                  </Link>
                );
              })}
            </div>

            {featuredArticles.length > 0 && (
              <div className="mt-16">
                <h3 className="font-display text-2xl font-extrabold sm:text-3xl">
                  Guías más consultadas para empezar
                </h3>
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredArticles.map((a) => (
                    <ArticleCard key={a.path} a={a} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 14. Transparencia Ética (Datos vs Promesas Falsas) */}
        <section className="wrap py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Estándar Editorial de Confianza
              </span>
              <SplitHeading
                text="Números referenciales claros,"
                accent={{ text: "cero humo", className: "text-fxblue" }}
                className="section-title mt-3"
              />
              <p className="mt-4 text-[var(--muted)]" data-reveal>
                En internet sobran las capturas exageradas de “hazte rico sin
                hacer nada”. Aquí explicamos la matemática comercial real y
                referencial del sistema FuXion, cumpliendo estándares de
                transparencia internacional.
              </p>
              <div className="mt-6 flex flex-wrap gap-3" data-reveal>
                <Link
                  href="/descargo-de-ingresos/"
                  className="btn btn-ghost text-sm"
                >
                  Leer Descargo de Ingresos
                </Link>
                <Link
                  href="/politica-editorial/"
                  className="btn btn-ghost text-sm"
                >
                  Política Editorial
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card spot p-6" data-reveal>
                <span className="inline-flex rounded-full bg-fxlime/25 px-3 py-1 text-xs font-extrabold text-[#2e5008]">
                  ✓ Lo que sí ofrecemos aquí
                </span>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  <li>• Reglas públicas verificables de puntos PV, Pro 1 y Pro 2</li>
                  <li>• Simulaciones marcadas siempre como referenciales</li>
                  <li>• Distinción estricta entre alimento funcional y medicina</li>
                  <li>• Identidad legal visible: {LEGAL_OWNER} (Lima, Perú)</li>
                </ul>
              </div>
              <div
                className="card spot p-6"
                data-reveal
                data-reveal-delay="1"
              >
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-900">
                  ✕ Lo que jamás promovemos
                </span>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  <li>• Promesas de ganancias automáticas sin vender nada</li>
                  <li>• Compras forzadas de stock endeudando tu economía</li>
                  <li>• Spam invasivo a familiares o desconocidos</li>
                  <li>• Afirmaciones médicas sobre curar enfermedades</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 15. Preguntas Frecuentes + CTA Final Magnético */}
        <section className="wrap pb-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Preguntas Frecuentes
              </span>
              <SplitHeading
                text="Resolvemos tus dudas clave"
                className="section-title mt-3"
              />
              <p className="mt-4 text-[var(--muted)]" data-reveal>
                ¿Tienes otra inquietud puntual sobre tu país, impuestos o algún
                producto? Consulta al instante en nuestro Chat IA o escríbenos a{" "}
                <strong>{LEGAL_EMAIL}</strong>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3" data-reveal>
                <OpenChatButton
                  label="💬 Consultar en Chat Online IA"
                  className="btn btn-buy text-sm"
                />
                <Link href="/contacto/" className="btn btn-ghost text-sm">
                  Contacto Directo
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {HOME_FAQS.map((f) => (
                <details
                  key={f.q}
                  className="card card-static group p-5 open:shadow-lg"
                  data-reveal
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fxsky text-fxbluedeep transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="wrap pb-6">
          <div className="relative isolate overflow-hidden rounded-[36px] bg-gradient-to-br from-[#07131d] via-[#0a3656] to-fxblue px-6 py-14 text-white sm:px-14 sm:py-20">
            <Image
              src={ambient("home-paises-global")}
              alt=""
              fill
              sizes="1200px"
              className="-z-[2] object-cover opacity-20 mix-blend-luminosity"
            />
            <div className="hero-grid opacity-55" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.35fr_1fr]">
              <div>
                <span className="chip text-fxlime">
                  Registro Oficial FuXion · Equipo Charlie Lingan
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-5xl">
                  Activa hoy tu Tienda Virtual sin stock o construye tu equipo en{" "}
                  <span className="text-fxlime">34 países</span>
                </h2>
                <p className="mt-4 text-base text-white/85 sm:text-lg">
                  Si deseas registrarte directamente en FuXion con nuestro
                  acompañamiento, haz clic en el botón oficial de inscripción
                  abajo o escríbenos a <strong>{LEGAL_EMAIL}</strong>.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <EnrollLink
                    source="home-final-cta"
                    className="btn btn-lime shine text-base"
                    magnetic
                  >
                    Hacer clic aquí para registrarme →
                  </EnrollLink>
                  <Link
                    href="/calculadora-de-ingresos/"
                    className="btn btn-glass text-base"
                    data-magnetic
                  >
                    🧮 Simular en Calculadora IA
                  </Link>
                </div>
                <p className="mt-3 text-xs text-white/65">
                  *Todos los cálculos de comisiones y bonos son referenciales y
                  variables según desempeño y país.
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[340px]">
                <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
                  <Image
                    src="/img/productos-fuxion/prunex1-bodegon.webp"
                    alt="Productos oficiales FuXion disponibles en tu tienda virtual"
                    width={320}
                    height={320}
                    sizes="320px"
                    className="float-y mx-auto h-auto w-56 object-contain drop-shadow-2xl"
                  />
                  <p className="mt-2 text-center font-display text-sm font-bold text-white">
                    +60 Productos Nutracéuticos Oficiales Listos para tu Tienda
                    Online
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ClientEffects stickySource="home-sticky" />
    </>
  );
}
