import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * ingresospasivos-chat — Asesor IA y Motor de Planificación Personalizada para ingresospasivos.click
 * Modelo predeterminado: gpt-4o-mini (configurable en vivo desde el panel admin de charlielingan.com).
 * Soporta:
 *   - GET / mode="config"        -> Configuración viva + URL de inscripción oficial
 *   - mode="track_click"         -> Registro de clics a afiliación, productos y artículos
 *   - mode="log_calc"            -> Registro de simulaciones de calculadora geolocalizada
 *   - mode="simulate_plan"       -> Hoja de ruta personalizada con IA para la calculadora
 *   - mode="seed_articles"       -> Sincronización de los +2,500 artículos en Supabase
 *   - mode="chat"                -> Chat interactivo buscando productos FuXion + guías del sitio
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-sync-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SITE = "https://ingresospasivos.click";
const SYNC_KEY = "ingresospasivos-sync-2026";
const DEFAULT_ENROLLMENT_URL =
  "https://ifuxion.com/Lingan/enrollment/enrollmentconfiguration?SessionID=QfThE_gNirau5B7cEIkwOvmltztUrSwxWH01zkWDmxq9SFmrkLVDwYBucZMk8MFIHWOLW4XMoR9bmocerBmWRU0m5fNTnzbi";
const DEFAULT_SHOP_URL = "https://carlos-lingan.site.fuxion.com/";
const ALLOWED_MODELS = ["gpt-4o-mini", "gpt-4o"];

interface ArticleRow {
  slug: string;
  title: string;
  category: string;
  category_name: string;
  is_transactional: boolean;
  excerpt: string | null;
  featured_image: string | null;
  read_time: string | null;
  search_text: string | null;
}

interface ArticleCard {
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  url: string;
  image: string;
  readTime: string;
  excerpt: string;
}

interface ProductCard {
  slug: string;
  name: string;
  category: string;
  pointsPv: number;
  sticks: string;
  image: string;
  shopUrl: string;
  articleUrl: string;
  shortDesc: string;
}

const FLAGSHIP_PRODUCTS: Record<string, ProductCard> = {
  prunex1: {
    slug: "prunex1",
    name: "Prunex1",
    category: "Limpieza & Tránsito Digestivo",
    pointsPv: 10,
    sticks: "28 sticks (o 7 sticks)",
    image: `${SITE}/img/productos-fuxion/prunex1-bodegon.webp`,
    shopUrl: "https://carlos-lingan.site.fuxion.com/prunex1/",
    articleUrl: `${SITE}/vender-productos-fuxion/como-vender-prunex1-de-fuxion-sin-stock-comisiones-y-puntos/`,
    shortDesc:
      "Bebida funcional de fibras solubles (psyllium, inulina, guindón). Producto #1 puerta de entrada en ventas por dropshipping.",
  },
  "thermo-t3": {
    slug: "thermo-t3",
    name: "Thermo T3",
    category: "Control de Peso & Metabolismo",
    pointsPv: 20,
    sticks: "28 sticks",
    image: `${SITE}/img/productos-fuxion/thermo-t3-bodegon.webp`,
    shopUrl: "https://carlos-lingan.site.fuxion.com/thermo-t3/",
    articleUrl: `${SITE}/vender-productos-fuxion/como-vender-thermo-t3-de-fuxion-margen-puntos-pv-y-recompra/`,
    shortDesc:
      "Mix de tres tés (rojo, verde, negro) con L-carnitina y tamarindo malabar. 20 PV por unidad y altísima rotación mensual.",
  },
  "vita-xtra-t": {
    slug: "vita-xtra-t",
    name: "Vita Xtra T+",
    category: "Energía & Vitalidad Diaria",
    pointsPv: 20,
    sticks: "28 sticks",
    image: `${SITE}/img/productos-fuxion/vita-xtra-t-bodegon.webp`,
    shopUrl: "https://carlos-lingan.site.fuxion.com/vita-xtra-t/",
    articleUrl: `${SITE}/vender-productos-fuxion/como-vender-vita-xtra-t-fuxion-energia-diaria-y-comisiones/`,
    shortDesc:
      "Bebida antioxidante energizante con guayusa, té verde, acai berry, goji y ginseng. Ideal para profesionales y deportistas.",
  },
  "beauty-in": {
    slug: "beauty-in",
    name: "Beauty-In",
    category: "Antiedad & Colágeno Péptidos",
    pointsPv: 25,
    sticks: "28 sticks",
    image: `${SITE}/img/productos-fuxion/beauty-in-bodegon.webp`,
    shopUrl: "https://carlos-lingan.site.fuxion.com/beauty-in/",
    articleUrl: `${SITE}/vender-productos-fuxion/como-vender-beauty-in-colageno-fuxion-25-puntos-pv-y-margen/`,
    shortDesc:
      "Péptidos de colágeno bioactivo con coenzima Q10, biotina y vitamina E. Uno de los mayores tickets y 25 PV por caja.",
  },
  "nocarb-t": {
    slug: "nocarb-t",
    name: "NoCarb-T",
    category: "Control de Carbohidratos",
    pointsPv: 20,
    sticks: "28 sticks",
    image: `${SITE}/img/productos-fuxion/nocarb-t-bodegon.webp`,
    shopUrl: "https://carlos-lingan.site.fuxion.com/nocarb-t/",
    articleUrl: `${SITE}/vender-productos-fuxion/como-vender-nocarb-t-fuxion-ticket-cruzado-y-clientes/`,
    shortDesc:
      "Fibras solubles, yacón, inulina, canela y té verde sabor manzana-canela. Excelente para venta cruzada junto a Thermo T3.",
  },
  "no-stress": {
    slug: "no-stress",
    name: "No Stress (Off)",
    category: "Vigor Mental & Relajación",
    pointsPv: 22,
    sticks: "28 sticks",
    image: `${SITE}/img/productos-fuxion/no-stress-bodegon.webp`,
    shopUrl: "https://carlos-lingan.site.fuxion.com/no-stress/",
    articleUrl: `${SITE}/vender-productos-fuxion/como-vender-no-stress-fuxion-bienestar-mental-y-comisiones/`,
    shortDesc:
      "Aminoácidos (L-teanina, glicina, triptófano), magnesio y complejo B. 22 PV por doypack con gran fidelización.",
  },
  "biopro-fit": {
    slug: "biopro-fit",
    name: "BioPro+ Fit",
    category: "Proteínas & Control de Peso",
    pointsPv: 16,
    sticks: "14 sobres",
    image: `${SITE}/img/productos-fuxion/biopro-fit-bodegon.webp`,
    shopUrl: "https://carlos-lingan.site.fuxion.com/biopro-fit/",
    articleUrl: `${SITE}/vender-productos-fuxion/como-vender-biopro-fit-proteina-fuxion-clientes-recurrentes/`,
    shortDesc:
      "Batido proteico bajo en calorías con calostro, suero lácteo, albúmina y soya. Consumo quincenal que acelera el Pro 1.",
  },
  "biopro-sport": {
    slug: "biopro-sport",
    name: "BioPro+ Sport",
    category: "Línea Deportiva",
    pointsPv: 20,
    sticks: "14 sobres",
    image: `${SITE}/img/productos-fuxion/biopro-sport-bodegon.webp`,
    shopUrl: "https://carlos-lingan.site.fuxion.com/biopro-sport/",
    articleUrl: `${SITE}/vender-productos-fuxion/como-vender-biopro-sport-fuxion-en-gimnasios-y-redes/`,
    shortDesc:
      "Proteína de alta biodisponibilidad enriquecida con Actinos y BCAA para entrenadores y atletas. 20 PV cada 14 días.",
  },
  "biopro-tect": {
    slug: "biopro-tect",
    name: "BioPro+ Tect",
    category: "Sistema Inmunológico",
    pointsPv: 18,
    sticks: "14 sobres",
    image: `${SITE}/img/productos-fuxion/biopro-tect-bodegon.webp`,
    shopUrl: "https://carlos-lingan.site.fuxion.com/biopro-tect/",
    articleUrl: `${SITE}/vender-productos-fuxion/como-vender-biopro-tect-fuxion-nutricion-familiar/`,
    shortDesc:
      "Proteína con Bioferrin y calostro bovino orientada al bienestar familiar. Alta recompra en hogares.",
  },
  "youth-elixir": {
    slug: "youth-elixir",
    name: "Youth Elixir (HGH)",
    category: "Antiedad & Descanso Nocturno",
    pointsPv: 20,
    sticks: "28 sticks",
    image: `${SITE}/img/productos-fuxion/youth-elixir-bodegon.webp`,
    shopUrl: "https://carlos-lingan.site.fuxion.com/youth-elixir/",
    articleUrl: `${SITE}/vender-productos-fuxion/como-vender-youth-elixir-fuxion-nicho-antiedad/`,
    shortDesc:
      "Aminoácidos, resveratrol, amalaki y antioxidantes sabor uva para ritual nocturno. 20 PV por doypack.",
  },
};

function calculateCostUsd(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  if (model.includes("mini")) {
    return Number(
      (promptTokens * 0.00000015 + completionTokens * 0.0000006).toFixed(6)
    );
  }
  return Number(
    (promptTokens * 0.0000025 + completionTokens * 0.00001).toFixed(6)
  );
}

const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOPWORDS = new Set([
  "como",
  "cual",
  "cuales",
  "que",
  "quien",
  "donde",
  "cuando",
  "por",
  "para",
  "con",
  "sin",
  "una",
  "uno",
  "los",
  "las",
  "del",
  "al",
  "hola",
  "quiero",
  "puedo",
  "sobre",
  "mas",
  "muy",
  "tiene",
  "tengo",
  "fuxion",
  "ingresos",
  "pasivos",
]);

function extractTokens(text: string): string[] {
  return norm(text)
    .split(" ")
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
}

let catalogCache: {
  at: number;
  rows: ArticleRow[];
  bySlug: Map<string, ArticleRow>;
} | null = null;

async function loadCatalog(): Promise<{
  rows: ArticleRow[];
  bySlug: Map<string, ArticleRow>;
}> {
  if (
    catalogCache &&
    Date.now() - catalogCache.at < 10 * 60 * 1000 &&
    catalogCache.rows.length > 0
  ) {
    return catalogCache;
  }
  const [b1, b2, b3] = await Promise.all([
    supabase
      .from("ingresospasivos_articles")
      .select(
        "slug, title, category, category_name, is_transactional, excerpt, featured_image, read_time, search_text"
      )
      .eq("active", true)
      .range(0, 999),
    supabase
      .from("ingresospasivos_articles")
      .select(
        "slug, title, category, category_name, is_transactional, excerpt, featured_image, read_time, search_text"
      )
      .eq("active", true)
      .range(1000, 1999),
    supabase
      .from("ingresospasivos_articles")
      .select(
        "slug, title, category, category_name, is_transactional, excerpt, featured_image, read_time, search_text"
      )
      .eq("active", true)
      .range(2000, 2999),
  ]);

  const rows: ArticleRow[] = [];
  const bySlug = new Map<string, ArticleRow>();
  for (const data of [b1.data, b2.data, b3.data]) {
    if (Array.isArray(data)) {
      for (const r of data as ArticleRow[]) {
        if (!bySlug.has(r.slug)) {
          bySlug.set(r.slug, r);
          rows.push(r);
        }
      }
    }
  }
  catalogCache = { at: Date.now(), rows, bySlug };
  return catalogCache;
}

function toArticleCard(r: ArticleRow): ArticleCard {
  const img = r.featured_image || "/img/ambiente/home-hero-fuxion.webp";
  const url =
    r.slug === r.category
      ? `${SITE}/${r.category}/`
      : `${SITE}/${r.category}/${r.slug}/`;
  return {
    slug: r.slug,
    title: r.title,
    category: r.category,
    categoryName: r.category_name,
    url,
    image: img.startsWith("http") ? img : `${SITE}${img}`,
    readTime: r.read_time || "7 min",
    excerpt: (r.excerpt || "").slice(0, 145),
  };
}

function searchArticles(
  rows: ArticleRow[],
  userMessage: string,
  historyText: string,
  limit = 12
): ArticleRow[] {
  const primaryTokens = extractTokens(userMessage);
  const contextTokens = extractTokens(historyText).filter(
    (t) => !primaryTokens.includes(t)
  );
  const fullPhrase = norm(userMessage);

  if (primaryTokens.length === 0 && contextTokens.length === 0) {
    return rows.filter((r) => r.is_transactional).slice(0, limit);
  }

  const scored: Array<{ row: ArticleRow; score: number }> = [];
  for (const r of rows) {
    const hay = norm(`${r.title} ${r.slug} ${r.search_text || ""}`);
    let s = r.is_transactional ? 1.5 : 0;
    if (fullPhrase.length > 4 && hay.includes(fullPhrase)) s += 18;
    for (const t of primaryTokens) {
      if (norm(r.title).includes(t)) s += 6;
      else if (hay.includes(t)) s += 3;
    }
    for (const t of contextTokens) {
      if (hay.includes(t)) s += 1.2;
    }
    if (s > 2) scored.push({ row: r, score: s });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.row);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const sendJson = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body =
      req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const mode = body.mode || (req.method === "GET" ? "config" : "chat");

    // 0. Sincronizar catálogo de artículos desde scripts/sync_articles_to_supabase.py
    if (mode === "seed_articles") {
      const syncHeader = req.headers.get("x-sync-key") || "";
      if (syncHeader !== SYNC_KEY) {
        return sendJson({ error: "Unauthorized sync" }, 401);
      }
      const articles = Array.isArray(body.articles) ? body.articles : [];
      if (!articles.length) return sendJson({ count: 0 });
      const { error } = await supabase
        .from("ingresospasivos_articles")
        .upsert(articles, { onConflict: "slug" });
      if (error) throw new Error(error.message);
      catalogCache = null;
      return sendJson({ ok: true, count: articles.length });
    }

    // 1. Cargar configuración viva
    const { data: cfgRow } = await supabase
      .from("ingresospasivos_chat_config")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    const config = cfgRow || {
      is_enabled: true,
      ai_model: "gpt-4o-mini",
      temperature: 0.4,
      max_messages_per_session: 30,
      daily_budget_usd: 8.0,
      welcome_message:
        "¡Hola! 👋 Soy el Asesor IA de IngresosPasivos.click (modelo mini rápido). Te explico cómo generar ingresos con FuXion vendiendo productos por Dropshipping sin stock o construyendo equipos (Pro 1 y Pro 2), y busco productos o guías para ti. Cualquier consulta directa puedes escribir al distribuidor oficial Charlie Lingan en info@charlielingan.com.",
      custom_instructions: "",
      enrollment_url: DEFAULT_ENROLLMENT_URL,
      shop_url: DEFAULT_SHOP_URL,
    };

    if (mode === "config") {
      return sendJson({
        is_enabled: config.is_enabled,
        welcome_message: config.welcome_message,
        ai_model: config.ai_model || "gpt-4o-mini",
        enrollment_url: config.enrollment_url || DEFAULT_ENROLLMENT_URL,
        shop_url: config.shop_url || DEFAULT_SHOP_URL,
        max_messages_per_session: config.max_messages_per_session || 30,
      });
    }

    // 2. Registrar clic (afiliación / producto / artículo)
    if (mode === "track_click") {
      const targetUrl = String(body.target_url || config.enrollment_url || DEFAULT_ENROLLMENT_URL);
      await supabase.from("ingresospasivos_chat_clicks").insert({
        session_id: body.session_id || null,
        visitor_id: body.visitor_id || "anon",
        source: body.source || "web",
        click_type: body.click_type || "enrollment",
        article_slug: body.article_slug || null,
        article_title: body.article_title || null,
        category: body.category || null,
        product_slug: body.product_slug || null,
        product_name: body.product_name || null,
        country_code: body.country_code || null,
        target_url: targetUrl,
        page_url: body.page_url || null,
      });

      if (body.session_id) {
        const { data: sess } = await supabase
          .from("ingresospasivos_chat_sessions")
          .select("clicks_count, clicked_urls")
          .eq("id", body.session_id)
          .maybeSingle();
        if (sess) {
          const urls = Array.isArray(sess.clicked_urls) ? sess.clicked_urls : [];
          if (!urls.includes(targetUrl)) urls.push(targetUrl);
          await supabase
            .from("ingresospasivos_chat_sessions")
            .update({
              clicks_count: (sess.clicks_count || 0) + 1,
              clicked_urls: urls,
            })
            .eq("id", body.session_id);
        }
      }
      return sendJson({ ok: true });
    }

    // 3. Registrar o simular plan con IA desde la Calculadora Interactiva
    if (mode === "log_calc" || mode === "simulate_plan") {
      const countryCode = String(body.country_code || "PE").toUpperCase();
      const currencyCode = String(body.currency_code || "PEN").toUpperCase();
      const calcMode = String(body.calc_mode || "hybrid");
      const boxes = Number(body.boxes_per_month || 25);
      const prefCustomers = Number(body.preferred_customers || 6);
      const directPartners = Number(body.direct_partners || 4);
      const pro1Partners = Number(body.pro1_partners || 4);
      const estPv = Number(body.estimated_pv || boxes * 20);
      const estUsd = Number(body.estimated_monthly_usd || 0);
      const estLocal = Number(body.estimated_monthly_local || 0);
      const goalText = String(body.goal_text || "").slice(0, 500);
      const hoursPerWeek = Number(body.hours_per_week || 7);

      if (mode === "log_calc") {
        await supabase.from("ingresospasivos_calc_logs").insert({
          visitor_id: body.visitor_id || "anon",
          country_code: countryCode,
          currency_code: currencyCode,
          mode: calcMode,
          boxes_per_month: boxes,
          preferred_customers: prefCustomers,
          direct_partners: directPartners,
          pro1_partners: pro1Partners,
          estimated_pv: estPv,
          estimated_monthly_usd: estUsd,
          estimated_monthly_local: estLocal,
          ai_goal_text: goalText || null,
          page_url: body.page_url || null,
        });
        return sendJson({ ok: true });
      }

      // mode === "simulate_plan" con OpenAI gpt-4o-mini
      const modelToUse = ALLOWED_MODELS.includes(config.ai_model)
        ? config.ai_model
        : "gpt-4o-mini";
      let planData = {
        headline: `Hoja de Ruta Referencial en ${countryCode} (${currencyCode})`,
        summary: `Con ${hoursPerWeek} horas por semana puedes enfocarte primero en consolidar tu Bono Pro 1 (500 PV con al menos 6 Clientes Preferentes usando tu Tienda Virtual de Dropshipping sin comprar stock) y luego duplicar el sistema hacia Pro 2 con el acompañamiento del equipo de Charlie Lingan.`,
        steps: [
          "Activa tu código de Distribuidor FuXion y personaliza tu enlace de Tienda Virtual gratuita.",
          "Elige 2 o 3 productos puerta de entrada de alta rotación (como Prunex1, Thermo T3 y Vita Xtra T+) para compartir en WhatsApp y redes.",
          "Fideliza mínimo 6 Clientes Preferentes con compras de 35+ PV en tu ciclo de 4 semanas para calificar al Bono Pro 1.",
          "Apóyate en nuestro equipo para presentar el modelo de afiliación a 4 socios que también logren su Pro 1 (activando tu Bono Pro 2).",
        ],
        recommended_products: ["prunex1", "thermo-t3", "vita-xtra-t"],
        disclaimer:
          "Todos los cálculos, bonos y proyecciones son estrictamente referenciales e ilustrativos según el Plan Pro-Lev de FuXion; los resultados dependen del volumen real comercializado y varían por país.",
      };

      if (OPENAI_API_KEY) {
        const sysPrompt = `Eres un consultor estratégico ético y realista del negocio FuXion en IngresosPasivos.click, sitio del distribuidor oficial Carlos Lingan Borja (Charlie Lingan, email info@charlielingan.com).
Genera en JSON estricto una hoja de ruta breve y accionable para un usuario en país ${countryCode} (moneda ${currencyCode}), que dispone de ${hoursPerWeek} horas/semana, modalidad "${calcMode}" (${boxes} cajas/mes estimadas, ${prefCustomers} clientes preferentes, ${directPartners} socios directos, ingreso referencial simulado ${estLocal} ${currencyCode} / ~${estUsd} USD). Objetivo escrito por el usuario: "${goalText || "Generar ingresos extra sostenibles"}".
Reglas obligatorias:
1. Aclara siempre que las cifras son referenciales y pueden variar, nunca prometas dinero fácil ni garantizado.
2. Explica cómo apalancarse en el Dropshipping de la Tienda Virtual FuXion sin comprar stock físico.
3. Menciona cómo alcanzar Pro 1 (500 PV + 6 Clientes Preferentes) y/o Pro 2 (4 socios directos en Pro 1) con ayuda del equipo de Charlie Lingan.
4. No hagas afirmaciones médicas sobre los productos.
Devuelve JSON con: {"headline": string, "summary": string, "steps": [4 strings concretos], "recommended_products": [hasta 3 slugs entre: prunex1, thermo-t3, vita-xtra-t, beauty-in, nocarb-t, no-stress, biopro-fit, biopro-sport, biopro-tect, youth-elixir], "disclaimer": string}`;

        const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelToUse,
            temperature: 0.4,
            response_format: { type: "json_object" },
            messages: [{ role: "system", content: sysPrompt }],
          }),
        });
        if (aiResp.ok) {
          const j = await aiResp.json();
          const parsed = JSON.parse(
            j?.choices?.[0]?.message?.content || "{}"
          );
          if (parsed.headline && Array.isArray(parsed.steps)) {
            planData = {
              headline: parsed.headline,
              summary: parsed.summary || planData.summary,
              steps: parsed.steps.slice(0, 4),
              recommended_products: Array.isArray(parsed.recommended_products)
                ? parsed.recommended_products.filter(
                    (s: string) => s in FLAGSHIP_PRODUCTS
                  )
                : planData.recommended_products,
              disclaimer: parsed.disclaimer || planData.disclaimer,
            };
          }
          const pt = j?.usage?.prompt_tokens || 0;
          const ct = j?.usage?.completion_tokens || 0;
          await supabase.from("token_usage").insert({
            source: "ingresospasivos.click",
            content_type: "ai_calculator",
            model: modelToUse,
            prompt_tokens: pt,
            completion_tokens: ct,
            total_tokens: pt + ct,
            images_generated: 0,
            estimated_cost_usd: calculateCostUsd(modelToUse, pt, ct),
          });
        }
      }

      await supabase.from("ingresospasivos_calc_logs").insert({
        visitor_id: body.visitor_id || "anon",
        country_code: countryCode,
        currency_code: currencyCode,
        mode: "ai_plan",
        boxes_per_month: boxes,
        preferred_customers: prefCustomers,
        direct_partners: directPartners,
        pro1_partners: pro1Partners,
        estimated_pv: estPv,
        estimated_monthly_usd: estUsd,
        estimated_monthly_local: estLocal,
        ai_goal_text: goalText || `${hoursPerWeek}h/sem · ${calcMode}`,
        ai_plan_summary: planData.summary,
        page_url: body.page_url || null,
      });

      return sendJson({
        ok: true,
        plan: planData,
        products: planData.recommended_products
          .map((s: string) => FLAGSHIP_PRODUCTS[s])
          .filter(Boolean),
        enrollment_url: config.enrollment_url || DEFAULT_ENROLLMENT_URL,
      });
    }

    // 4. Modo Chat Online IA
    const enrollUrl = config.enrollment_url || DEFAULT_ENROLLMENT_URL;
    if (!config.is_enabled) {
      return sendJson({
        reply: `En este momento el chat automático está en breve mantenimiento. Si deseas registrarte en FuXion puedes hacerlo directamente [haciendo clic aquí](${enrollUrl}) o consultar al distribuidor oficial **Charlie Lingan** al correo **info@charlielingan.com**.`,
        recommended_products: [],
        recommended_articles: [],
        suggested_options: ["Registrarme en FuXion"],
        enrollment_url: enrollUrl,
        disabled: true,
      });
    }

    const userMessage = String(body.message || "").trim();
    if (!userMessage) {
      return sendJson({ error: "Mensaje vacío" }, 400);
    }

    const visitorId =
      body.visitor_id || "ip-" + crypto.randomUUID().slice(0, 8);
    const countryCode = String(body.country_code || "PE").toUpperCase();
    const currencyCode = String(body.currency_code || "PEN").toUpperCase();
    const pageUrl = body.page_url || `${SITE}/`;
    const userAgent = body.user_agent || req.headers.get("user-agent") || "";
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    let sessionId: string | null = body.session_id || null;

    // Control de presupuesto diario
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const { data: todaySessions } = await supabase
      .from("ingresospasivos_chat_sessions")
      .select("estimated_cost_usd")
      .gte("last_message_at", startOfDay.toISOString());
    const spentToday = (todaySessions || []).reduce(
      (acc: number, r: { estimated_cost_usd?: number }) =>
        acc + Number(r.estimated_cost_usd || 0),
      0
    );

    if (spentToday >= Number(config.daily_budget_usd || 8)) {
      return sendJson({
        reply: `Hemos alcanzado el límite diario de consultas automáticas. Para cualquier duda personalizada escribe directamente al distribuidor oficial **Charlie Lingan** en **info@charlielingan.com** o regístrate en el equipo oficial [haciendo clic aquí](${enrollUrl}).`,
        recommended_products: [
          FLAGSHIP_PRODUCTS["prunex1"],
          FLAGSHIP_PRODUCTS["thermo-t3"],
        ],
        recommended_articles: [],
        suggested_options: [],
        enrollment_url: enrollUrl,
      });
    }

    // Crear o recuperar sesión
    if (!sessionId) {
      const { data: newSess } = await supabase
        .from("ingresospasivos_chat_sessions")
        .insert({
          visitor_id: visitorId,
          country_code: countryCode,
          currency_code: currencyCode,
          page_url: pageUrl,
          user_agent: userAgent.slice(0, 300),
          first_user_message: userMessage.slice(0, 280),
          last_user_message: userMessage.slice(0, 280),
          messages_count: 1,
          model_used: config.ai_model || "gpt-4o-mini",
        })
        .select("id")
        .single();
      sessionId = newSess?.id || null;
    }

    if (sessionId) {
      await supabase.from("ingresospasivos_chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: userMessage,
      });
    }

    const { rows: allArticles, bySlug } = await loadCatalog();
    const historyText = history
      .map((m: { content?: string }) => m.content || "")
      .join(" ");
    const candidateArticles = searchArticles(
      allArticles,
      userMessage,
      historyText,
      10
    );

    const articlesContext = candidateArticles
      .map(
        (a) =>
          `- slug: "${a.slug}" | título: "${a.title}" | categoría: "${a.category}" | resumen: "${(a.excerpt || "").slice(0, 120)}"`
      )
      .join("\n");

    const productsContext = Object.values(FLAGSHIP_PRODUCTS)
      .map(
        (p) =>
          `- slug: "${p.slug}" | nombre: "${p.name}" (${p.category}) | ${p.pointsPv} PV | ${p.sticks} | ${p.shortDesc}`
      )
      .join("\n");

    const modelToUse = ALLOWED_MODELS.includes(config.ai_model)
      ? config.ai_model
      : "gpt-4o-mini";

    const systemPrompt = `Eres el Asesor Oficial IA de IngresosPasivos.click (modelo rápido), portal educativo y de negocio sobre las 2 vías de ingresos con FuXion:
1) Venta de Productos por Dropshipping / Tienda Virtual sin stock: al registrarte recibes tu Tienda Virtual FuXion; compartes tu enlace, FuXion cobra, factura, empaca y envía al cliente en 34 países (Sudamérica, Norte/Centroamérica y 20 países de Europa). Comisiones referenciales de venta directa entre 20% y 50% según Puntos Volumen (PV). Con 500 PV en 4 semanas y mínimo 6 Clientes Preferentes (>=35 PV c/u) desbloqueas el Bono Pro 1 (~$50 a $100 USD referenciales + producto gratis).
2) Negocio Multinivel / Red de Afiliados: construyes equipo con apoyo humano y digital del equipo de Charlie Lingan. Con tú en Pro 1 + 4 socios directos en Pro 1 desbloqueas el Bono Pro 2 (~$200 USD adicionales referenciales por período), Pro 3 (~$500 USD referenciales con 2 socios en Pro 2), Bono Pack Profesional (20%-25%), Bono Familia y Bono Balance Binario.

REGLAS ESTRICTAS DE CUMPLIMIENTO:
- El usuario nos visita desde país "${countryCode}" (moneda "${currencyCode}").
- ACLARA SIEMPRE que todos los montos, porcentajes y comisiones son REFERENCIALES y pueden variar según país, catálogo, puntos PV e impuestos, sin constituir promesa de sueldo fijo.
- Si el usuario quiere registrarse o afiliarse, indícale hacer clic en este enlace oficial de inscripción: ${enrollUrl}
- Si solo desea comprar/probar un producto como cliente antes de afiliarse, puede usar la tienda oficial: ${config.shop_url || DEFAULT_SHOP_URL}
- INDICA SIEMPRE de forma amable que para cualquier consulta directa puede escribir al distribuidor oficial **Charlie Lingan** (Carlos Lingan Borja, Lima, Perú) al email **info@charlielingan.com**.
- Los productos FuXion son alimentos/bebidas nutracéuticas Clean Label, NO medicamentos (no curan, tratan ni previenen enfermedades).
${config.custom_instructions ? `\nInstrucciones adicionales del administrador:\n${config.custom_instructions}` : ""}

PRODUCTOS FUXION DISPONIBLES PARA RECOMENDAR (usa solo estos slugs exactos si aplica):
${productsContext}

GUÍAS Y ARTÍCULOS DE INGRESOSPASIVOS.CLICK RELACIONADOS (usa solo estos slugs exactos si aplica):
${articlesContext || "(Usa conocimiento general del sitio)"}

Responde en JSON válido con esta estructura exacta:
{
  "reply": "respuesta clara en markdown (máximo 2-3 párrafos breves, incluyendo nota referencial si hablas de montos y recordando contacto info@charlielingan.com)",
  "recommended_product_slugs": ["hasta 3 slugs de productos relevantes, o []"],
  "recommended_article_slugs": ["hasta 3 slugs de artículos relevantes de la lista, o []"],
  "suggested_options": ["3 preguntas cortas de seguimiento sugeridas al usuario"],
  "show_enrollment_cta": true
}`;

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...history
        .filter(
          (m: { role?: string; content?: string }) =>
            (m.role === "user" || m.role === "assistant") && m.content
        )
        .map((m: { role: string; content: string }) => ({
          role: m.role,
          content: String(m.content).slice(0, 700),
        })),
      { role: "user", content: userMessage },
    ];

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelToUse,
        temperature: Number(config.temperature ?? 0.4),
        response_format: { type: "json_object" },
        messages: chatMessages,
      }),
    });

    if (!aiRes.ok) {
      const errTxt = await aiRes.text();
      throw new Error(`OpenAI HTTP ${aiRes.status}: ${errTxt.slice(0, 200)}`);
    }

    const aiData = await aiRes.json();
    const rawContent = aiData?.choices?.[0]?.message?.content || "{}";
    let parsed: {
      reply?: string;
      recommended_product_slugs?: string[];
      recommended_article_slugs?: string[];
      suggested_options?: string[];
      show_enrollment_cta?: boolean;
    } = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = { reply: rawContent };
    }

    const reply =
      parsed.reply ||
      `Con FuXion puedes generar ingresos referenciales por Dropshipping sin stock o construyendo red de afiliados. Para consultas directas escribe al distribuidor oficial **Charlie Lingan** en **info@charlielingan.com** o regístrate [aquí](${enrollUrl}).`;

    const recommendedProducts = (parsed.recommended_product_slugs || [])
      .map((s) => FLAGSHIP_PRODUCTS[s])
      .filter(Boolean)
      .slice(0, 3);

    const recommendedArticles = (parsed.recommended_article_slugs || [])
      .map((s) => bySlug.get(s))
      .filter((r): r is ArticleRow => Boolean(r))
      .slice(0, 3)
      .map(toArticleCard);

    const suggestedOptions = Array.isArray(parsed.suggested_options)
      ? parsed.suggested_options.slice(0, 3)
      : [
          "💰 ¿Cómo funciona el Bono Pro 1 y Pro 2?",
          "📦 ¿Cómo vendo por Dropshipping sin stock?",
          "🚀 Quiero registrarme en el equipo de Charlie Lingan",
        ];

    const promptTokens = aiData?.usage?.prompt_tokens || 0;
    const completionTokens = aiData?.usage?.completion_tokens || 0;
    const totalTokens = promptTokens + completionTokens;
    const costUsd = calculateCostUsd(modelToUse, promptTokens, completionTokens);

    if (sessionId) {
      await supabase.from("ingresospasivos_chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: reply,
        recommended_articles: recommendedArticles,
        recommended_products: recommendedProducts,
        suggested_options: suggestedOptions,
        model: modelToUse,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost_usd: costUsd,
      });

      const { data: currSess } = await supabase
        .from("ingresospasivos_chat_sessions")
        .select(
          "messages_count, prompt_tokens, completion_tokens, total_tokens, estimated_cost_usd, recommended_articles, recommended_products"
        )
        .eq("id", sessionId)
        .maybeSingle();

      if (currSess) {
        const prevArt = Array.isArray(currSess.recommended_articles)
          ? currSess.recommended_articles
          : [];
        const prevProd = Array.isArray(currSess.recommended_products)
          ? currSess.recommended_products
          : [];
        for (const a of recommendedArticles) {
          if (!prevArt.includes(a.slug)) prevArt.push(a.slug);
        }
        for (const p of recommendedProducts) {
          if (!prevProd.includes(p.slug)) prevProd.push(p.slug);
        }

        await supabase
          .from("ingresospasivos_chat_sessions")
          .update({
            last_user_message: userMessage.slice(0, 280),
            messages_count: (currSess.messages_count || 1) + 1,
            prompt_tokens: (currSess.prompt_tokens || 0) + promptTokens,
            completion_tokens:
              (currSess.completion_tokens || 0) + completionTokens,
            total_tokens: (currSess.total_tokens || 0) + totalTokens,
            estimated_cost_usd:
              Number(currSess.estimated_cost_usd || 0) + costUsd,
            recommended_articles: prevArt,
            recommended_products: prevProd,
            model_used: modelToUse,
            last_message_at: new Date().toISOString(),
          })
          .eq("id", sessionId);
      }
    }

    await supabase.from("token_usage").insert({
      source: "ingresospasivos.click",
      content_type: "ai_chat",
      model: modelToUse,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      images_generated: 0,
      estimated_cost_usd: costUsd,
    });

    return sendJson({
      session_id: sessionId,
      reply,
      recommended_products: recommendedProducts,
      recommended_articles: recommendedArticles,
      suggested_options: suggestedOptions,
      show_enrollment_cta: parsed.show_enrollment_cta !== false,
      enrollment_url: enrollUrl,
      model: modelToUse,
    });
  } catch (err) {
    console.error("ingresospasivos-chat error:", err);
    return sendJson(
      {
        error: String((err as Error)?.message || err),
        reply: `Tuvimos un inconveniente temporal al procesar tu mensaje. Puedes escribir directamente al distribuidor oficial **Charlie Lingan** en **info@charlielingan.com** o [registrarte aquí en FuXion](${DEFAULT_ENROLLMENT_URL}).`,
      },
      500
    );
  }
});
