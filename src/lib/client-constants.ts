export const SITE_URL = "https://ingresospasivos.click";
export const SITE_NAME = "IngresosPasivos.click";

export const LEGAL_OWNER = "CARLOS LINGAN BORJA";
export const LEGAL_ALIAS = "Charlie Lingan";
export const LEGAL_LOCATION = "Lima, Perú";
export const LEGAL_EMAIL = "info@charlielingan.com";

export const DEFAULT_ENROLLMENT_URL =
  "https://ifuxion.com/Lingan/enrollment/enrollmentconfiguration?SessionID=QfThE_gNirau5B7cEIkwOvmltztUrSwxWH01zkWDmxq9SFmrkLVDwYBucZMk8MFIHWOLW4XMoR9bmocerBmWRU0m5fNTnzbi";

export const DEFAULT_SHOP_URL = "https://carlos-lingan.site.fuxion.com/";

export const CHAT_ENDPOINT =
  "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/ingresospasivos-chat";

export const REFERENTIAL_INCOME_NOTICE =
  "Aviso importante: Todos los importes, porcentajes de comisión, bonos (Pro 1, Pro 2, Pro 3 y red) y tipos de cambio mostrados son estrictamente referenciales e ilustrativos según el Plan de Pagos Pro-Lev de FuXion. Los ingresos reales pueden variar según el país, puntos volumen (PV/CV) de cada producto, impuestos locales y desempeño individual, sin constituir sueldo fijo ni garantía de ganancias.";

export function trackSiteClick(params: {
  targetUrl: string;
  source: string;
  clickType?: "enrollment" | "product" | "article";
  productSlug?: string;
  productName?: string;
  articleSlug?: string;
  articleTitle?: string;
  countryCode?: string;
}) {
  if (typeof window === "undefined") return;
  try {
    const vid =
      localStorage.getItem("ip_chat_visitor_v1") ||
      "ip-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("ip_chat_visitor_v1", vid);
    const sid = localStorage.getItem("ip_chat_session_v1") || null;

    fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "track_click",
        session_id: sid,
        visitor_id: vid,
        source: params.source,
        click_type: params.clickType || "enrollment",
        product_slug: params.productSlug || null,
        product_name: params.productName || null,
        article_slug: params.articleSlug || null,
        article_title: params.articleTitle || null,
        country_code: params.countryCode || null,
        target_url: params.targetUrl,
        page_url: window.location.href,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore tracking failures
  }
}
