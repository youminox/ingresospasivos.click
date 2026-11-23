import fs from "node:fs";
import path from "node:path";
import categories from "@/data/categories.json";
import fuxionProducts from "@/data/fuxion_products.json";

export const SITE_URL = "https://ingresospasivos.click";
export const SITE_NAME = "IngresosPasivos.click";
export const LEGAL_OWNER = "CARLOS LINGAN BORJA";
export const LEGAL_LOCATION = "Lima, Perú";
export const LEGAL_EMAIL = "info@charlielingan.com";
export const LEGAL_LINE =
  "Titular del sitio web: CARLOS LINGAN BORJA, domiciliado en Lima, Perú · Correo electrónico: info@charlielingan.com";
export const FUXION_DISCLAIMER =
  "IngresosPasivos.click es un portal informativo y de emprendimiento operado de manera independiente por el distribuidor autorizado CARLOS LINGAN BORJA (Lima, Perú · info@charlielingan.com); no es la página corporativa matriz de FuXion Biotech S.A.C. Todos los cálculos de comisiones, porcentajes, tipos de cambio y bonos (Pro 1, Pro 2, Pro 3 y red) son estrictamente referenciales e ilustrativos y pueden variar por país y volumen real comercializado. Los productos FuXion son alimentos y bebidas nutracéuticas, no medicamentos.";
export const PUBLISHED = "2026-11-23";
export const VERIFIED_LABEL = "23/11/2026";
export const CHAT_ENDPOINT =
  "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/ingresospasivos-chat";

export type Block =
  | { type: "p" | "h2" | "h3"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | {
      type: "callout";
      variant: "etiqueta" | "fabricante" | "aviso" | "tip";
      title?: string;
      text: string;
    }
  | { type: "steps"; items: { name: string; text: string }[] }
  | { type: "cta"; text: string };

export type Article = {
  slug: string;
  pillar: string;
  path: string;
  isPillar: boolean;
  isTransactional?: boolean;
  productSlug?: string | null;
  countryFocus?: string | null;
  primaryKeyword: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  quickAnswer: string;
  readingMinutes: number;
  image: { prompt: string; alt: string };
  blocks: Block[];
  faqs: { q: string; a: string }[];
  sources?: { label: string; url: string }[];
  related: string[];
  datePublished: string;
  dateModified: string;
  imageUrl: string | null;
};

export type Category = (typeof categories)[number];
export type FuxionProduct = (typeof fuxionProducts)[number];

const DIR = path.join(process.cwd(), "src/content/articles");
const PUBLIC = path.join(process.cwd(), "public");

interface ContentStore {
  all: Article[];
  byPath: Map<string, Article>;
  byPillarSlug: Map<string, Article>;
  pillarsBySlug: Map<string, Article>;
  childrenByPillar: Map<string, Article[]>;
}

let storeCache: ContentStore | null = null;
let existingPublicImagesCache: Set<string> | null = null;

function getExistingPublicImages(): Set<string> {
  if (existingPublicImagesCache) return existingPublicImagesCache;
  const set = new Set<string>();
  for (const sub of ["img/articulos", "img/ambiente", "img/productos-fuxion"]) {
    const full = path.join(PUBLIC, sub);
    if (fs.existsSync(full)) {
      for (const f of fs.readdirSync(full)) {
        if (f.endsWith(".webp") || f.endsWith(".png") || f.endsWith(".jpg")) {
          set.add(`/${sub}/${f}`);
        }
      }
    }
  }
  existingPublicImagesCache = set;
  return set;
}

const PILLAR_SCENE_POOLS: Record<string, string[]> = {
  "vender-productos-fuxion": [
    "cat-vender-productos-fuxion",
    "scene-ventas-1",
    "scene-ventas-2",
    "scene-ventas-3",
    "scene-ventas-4",
    "home-dropshipping-laptop",
    "home-bebida-funcional",
  ],
  "afiliarse-a-fuxion-por-pais": [
    "cat-afiliarse-a-fuxion-por-pais",
    "scene-paises-1",
    "scene-paises-2",
    "scene-paises-3",
    "scene-paises-4",
    "home-paises-global",
  ],
  "plan-de-pagos-y-bonos-fuxion": [
    "cat-plan-de-pagos-y-bonos-fuxion",
    "scene-bonos-1",
    "scene-bonos-2",
    "scene-bonos-3",
    "scene-bonos-4",
    "home-pro1-pro2",
  ],
  "dropshipping-y-tienda-virtual-fuxion": [
    "cat-dropshipping-y-tienda-virtual-fuxion",
    "scene-dropshipping-1",
    "scene-dropshipping-2",
    "scene-dropshipping-3",
    "scene-dropshipping-4",
    "home-logistica-envio",
    "home-dropshipping-laptop",
  ],
  "comparativas-de-negocio-y-afiliacion": [
    "cat-comparativas-de-negocio-y-afiliacion",
    "scene-comparativas-1",
    "scene-comparativas-2",
    "scene-comparativas-3",
    "home-comparativa-stock",
  ],
  "fundamentos-de-ingresos-pasivos": [
    "cat-fundamentos-de-ingresos-pasivos",
    "scene-pasivos-1",
    "scene-pasivos-2",
    "scene-pasivos-3",
    "scene-pasivos-4",
  ],
  "ingresos-extra-por-perfil-y-profesion": [
    "cat-ingresos-extra-por-perfil-y-profesion",
    "scene-perfiles-1",
    "scene-perfiles-2",
    "scene-perfiles-3",
    "scene-perfiles-4",
  ],
  "guia-dropshipping-sin-inventario": [
    "cat-guia-dropshipping-sin-inventario",
    "scene-ecommerce-1",
    "scene-ecommerce-2",
    "scene-ecommerce-3",
    "home-logistica-envio",
  ],
  "marketing-de-afiliados-y-comisiones": [
    "cat-marketing-de-afiliados-y-comisiones",
    "scene-afiliados-1",
    "scene-afiliados-2",
    "scene-afiliados-3",
    "scene-afiliados-4",
  ],
  "redes-de-mercadeo-eticas-y-modernas": [
    "cat-redes-de-mercadeo-eticas-y-modernas",
    "scene-red-1",
    "scene-red-2",
    "scene-red-3",
    "home-equipo-mentoria",
  ],
  "ventas-por-whatsapp-y-redes-sociales": [
    "cat-ventas-por-whatsapp-y-redes-sociales",
    "scene-whatsapp-1",
    "scene-whatsapp-2",
    "scene-whatsapp-3",
    "scene-whatsapp-4",
  ],
  "negocios-de-salud-bienestar-y-recompra": [
    "cat-negocios-de-salud-bienestar-y-recompra",
    "scene-bienestar-1",
    "scene-bienestar-2",
    "scene-bienestar-3",
    "home-bebida-funcional",
  ],
  "emprender-por-presupuesto-tiempo-y-pais": [
    "cat-emprender-por-presupuesto-tiempo-y-pais",
    "scene-tiempo-1",
    "scene-tiempo-2",
    "scene-tiempo-3",
    "scene-tiempo-4",
  ],
  "inteligencia-artificial-para-vendedores": [
    "cat-inteligencia-artificial-para-vendedores",
    "scene-ia-1",
    "scene-ia-2",
    "scene-ia-3",
    "home-calculadora-ia",
  ],
  "finanzas-para-comisionistas-y-emprendedores": [
    "cat-finanzas-para-comisionistas-y-emprendedores",
    "scene-finanzas-1",
    "scene-finanzas-2",
    "scene-finanzas-3",
    "scene-finanzas-4",
  ],
};

function isValidArticle(a: Partial<Article>): a is Article {
  return Boolean(
    a && a.slug && a.pillar && a.path && a.title && Array.isArray(a.blocks)
  );
}

function resolveArticleImage(
  a: Article,
  pillarCountMap: Map<string, number>,
  existingImgs: Set<string>
): string {
  const directArt = `/img/articulos/${a.slug}.webp`;
  if (existingImgs.has(directArt)) return directArt;

  if (a.isPillar) {
    const catImg = `/img/ambiente/cat-${a.pillar}.webp`;
    if (existingImgs.has(catImg)) return catImg;
  }

  // Si es ficha comercial de un producto FuXion con imagen local oficial en productos-fuxion, alternar con ambientes
  if (a.productSlug) {
    const prodBodegon = `/img/productos-fuxion/${a.productSlug}-bodegon.webp`;
    if (existingImgs.has(prodBodegon)) return prodBodegon;
  }

  const idx = pillarCountMap.get(a.pillar) || 0;
  pillarCountMap.set(a.pillar, idx + 1);
  const pool = PILLAR_SCENE_POOLS[a.pillar] || ["home-hero-fuxion"];
  const candidate = `/img/ambiente/${pool[idx % pool.length]}.webp`;
  if (existingImgs.has(candidate)) return candidate;

  const fallbackCat = `/img/ambiente/cat-${a.pillar}.webp`;
  if (existingImgs.has(fallbackCat)) return fallbackCat;

  return "/img/ambiente/home-hero-fuxion.webp";
}

function loadStore(): ContentStore {
  if (storeCache) return storeCache;

  const existingImgs = getExistingPublicImages();
  const files = fs.existsSync(DIR)
    ? fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).sort()
    : [];

  const all: Article[] = [];
  const byPath = new Map<string, Article>();
  const byPillarSlug = new Map<string, Article>();
  const pillarsBySlug = new Map<string, Article>();
  const childrenByPillar = new Map<string, Article[]>();
  const pillarCountMap = new Map<string, number>();

  for (const f of files) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
      if (!isValidArticle(raw) || byPath.has(raw.path)) continue;
      const imageUrl = resolveArticleImage(raw, pillarCountMap, existingImgs);
      const art: Article = {
        ...raw,
        isPillar: Boolean(raw.isPillar),
        isTransactional: Boolean(raw.isTransactional),
        image:
          raw.image && raw.image.alt ? raw.image : { prompt: "", alt: raw.title },
        faqs: Array.isArray(raw.faqs) ? raw.faqs : [],
        related: Array.isArray(raw.related) ? raw.related : [],
        quickAnswer: raw.quickAnswer || raw.excerpt || "",
        excerpt: raw.excerpt || raw.metaDescription || "",
        seoTitle: raw.seoTitle || raw.title,
        metaDescription: raw.metaDescription || raw.excerpt || "",
        datePublished: raw.datePublished || PUBLISHED,
        dateModified: raw.dateModified || PUBLISHED,
        imageUrl,
      };
      all.push(art);
      byPath.set(art.path, art);
      if (art.isPillar) {
        pillarsBySlug.set(art.pillar, art);
      } else {
        byPillarSlug.set(`${art.pillar}/${art.slug}`, art);
        const arr = childrenByPillar.get(art.pillar) || [];
        arr.push(art);
        childrenByPillar.set(art.pillar, arr);
      }
    } catch {
      // ignore malformed json during generation
    }
  }

  storeCache = {
    all,
    byPath,
    byPillarSlug,
    pillarsBySlug,
    childrenByPillar,
  };
  return storeCache;
}

export const getAllContent = (): Article[] => loadStore().all;
export const getCategories = (): Category[] => categories;
export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);
export const getPillar = (slug: string) => loadStore().pillarsBySlug.get(slug);
export const getArticle = (pillar: string, slug: string) =>
  loadStore().byPillarSlug.get(`${pillar}/${slug}`);
export const getArticlesIn = (pillar: string) =>
  loadStore().childrenByPillar.get(pillar) || [];
export const getByPath = (p: string) => loadStore().byPath.get(p);
export const getFuxionProducts = (): FuxionProduct[] => fuxionProducts;
export const getFuxionProduct = (slug?: string | null) =>
  slug ? fuxionProducts.find((p) => p.slug === slug) : undefined;

export function safeHref(p: string): string {
  if (loadStore().byPath.has(p)) return p;
  const pillar = p.split("/").filter(Boolean)[0];
  if (pillar && getCategory(pillar)) return `/${pillar}/`;
  return "/";
}

export function ambient(
  name: string,
  fallback = "/img/ambiente/home-hero-fuxion.webp"
): string {
  const rel = `/img/ambiente/${name}.webp`;
  return getExistingPublicImages().has(rel) ? rel : fallback;
}

export const OG_DEFAULT = () =>
  ambient("og-default", "/img/ambiente/home-hero-fuxion.webp");

export function absolute(url: string) {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export function trimTitle(t: string) {
  return t.replace(/\s*\|\s*IngresosPasivos(?:\.click)?\s*$/i, "");
}

export const organizationLd = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#org`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon.svg`,
  founder: { "@id": `${SITE_URL}/#carlos` },
  email: LEGAL_EMAIL,
  description:
    "Portal independiente sobre generación de ingresos referenciales con productos nutracéuticos FuXion mediante Dropshipping sin stock (Tienda Virtual) y Red de Afiliados (Pro 1 y Pro 2), liderado por el distribuidor autorizado Carlos Lingan Borja.",
};

export const personLd = {
  "@type": "Person",
  "@id": `${SITE_URL}/#carlos`,
  name: LEGAL_OWNER,
  alternateName: "Charlie Lingan",
  email: LEGAL_EMAIL,
  jobTitle: "Distribuidor Independiente FuXion & Fundador de IngresosPasivos.click",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lima",
    addressCountry: "PE",
  },
  url: `${SITE_URL}/sobre-el-distribuidor/`,
};
