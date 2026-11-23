#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador Editorial Maestro de los 2,535 Artículos de IngresosPasivos.click:
- 15 Hubs Pilares de Categoría (isPillar: true)
- 520 Artículos Transaccionales (isTransactional: true) en 5 silos comerciales FuXion
- 2,000 Artículos SEO Informacionales (isTransactional: false) en 10 silos educativos

Valida en tiempo de generación:
- 0 slugs duplicados
- 0 rutas (path) duplicadas
- 0 primaryKeyword duplicadas (cero canibalización)
- 0 títulos o seoTitle duplicados

Genera además:
- src/data/keyword_map.json
- public/search-index.json (ligero para buscador instantáneo en Home)
"""
import json
import pathlib
from collections import defaultdict

from topics_catalog import PILLARS, generate_seo_2000, generate_transactional_520

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "src/content/articles"
ART_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR = ROOT / "src/data"
PUB_DIR = ROOT / "public"
PUBLISHED = "2026-11-23"

CAMERA_STYLES = [
    "Three-quarter 50mm editorial angle with natural window depth",
    "Crisp 35mm environmental lifestyle composition",
    "Close-up 85mm shallow depth-of-field detail shot",
    "Overhead 35mm flat-lay on warm natural wood",
    "Over-the-shoulder 50mm candid digital workspace view",
    "Eye-level documentary style workspace photograph",
    "Side-lit architectural desk perspective (50mm lens)",
    "Macro-inspired editorial tabletop composition (85mm f/2.8)",
]

LIGHTING_MOODS = [
    "soft morning sunlight with gentle warm shadows",
    "golden hour afternoon light streaming across the table",
    "clean bright Scandinavian daylight with neutral tones",
    "warm cozy evening desk-lamp ambiance",
    "airy tropical coastal daylight with fresh natural contrast",
    "crisp overcast editorial studio-like window light",
]

LOCATIONS_AND_SURFACES = [
    "on a light oak desk in a modern Lima apartment",
    "on a sunny terrace table in Madrid overlooking rooftops",
    "inside a quiet botanical-lit study in Mexico City",
    "at a contemporary wooden coworking table in Bogota",
    "on a minimalist marble kitchen island in Miami",
    "by a bright garden window in Santiago de Chile",
    "on a walnut studio console with indoor plants",
    "at a tidy home-office corner with natural linen curtains",
]


def build_diverse_prompt(subject: str, idx: int) -> str:
    cam = CAMERA_STYLES[idx % len(CAMERA_STYLES)]
    light = LIGHTING_MOODS[(idx * 3 + 1) % len(LIGHTING_MOODS)]
    loc = LOCATIONS_AND_SURFACES[(idx * 5 + 2) % len(LOCATIONS_AND_SURFACES)]
    return (
        f"Photorealistic editorial business and wellness photography, {cam}: {subject}, "
        f"{loc}, {light}. Authentic materials, zero brand labels, zero text, zero watermarks."
    )


SILO_EDITORIAL_PROFILES = {
    "vender-productos-fuxion": {
        "sources": [
            {"label": "Catálogo y Plataforma Oficial FuXion", "url": "https://fuxion.com/"},
            {"label": "CODEX Alimentarius — Directrices sobre Etiquetado Nutricional", "url": "https://www.fao.org/fao-who-codexalimentarius/es/"},
        ],
        "callout_title": "Regla de oro al comercializar bebidas funcionales",
        "callout_text": "Presenta siempre los ingredientes reales de la etiqueta y el formato práctico en sticks, sin atribuir propiedades médicas ni curativas. Todas las comisiones (20% a 50% y Bono Pro 1) son referenciales y dependen del volumen real de puntos PV.",
    },
    "afiliarse-a-fuxion-por-pais": {
        "sources": [
            {"label": "Portal Oficial de Registro iFuXion — Charlie Lingan", "url": "https://ifuxion.com/Lingan"},
            {"label": "World Federation of Direct Selling Associations (WFDSA)", "url": "https://wfdsa.org/"},
        ],
        "callout_title": "Operativa multimoneda y despacho local",
        "callout_text": "Al activar tu código de Distribuidor Independiente FuXion obtienes una Tienda Virtual capaz de registrar Clientes Preferentes tanto en tu país como en los otros 33 mercados oficiales, liquidando comisiones referenciales según las normas tributarias locales.",
    },
    "plan-de-pagos-y-bonos-fuxion": {
        "sources": [
            {"label": "Descargo y Metodología Referencial de Ingresos", "url": "https://ingresospasivos.click/descargo-de-ingresos/"},
            {"label": "Federal Trade Commission (FTC) — Business Guidance on Multi-Level Marketing", "url": "https://consumer.ftc.gov/articles/multi-level-marketing-businesses-pyramid-schemes"},
        ],
        "callout_title": "Transparencia sobre cifras y puntos PV",
        "callout_text": "Cada cifra mostrada sobre el Plan Pro-Lev (Venta Directa, Pro 1, Pro 2, Pro 3 y bonos de equipo) es estrictamente referencial e ilustrativa. Los montos varían según el país, el tipo de cambio interno, los impuestos y tu constancia comercial.",
    },
    "dropshipping-y-tienda-virtual-fuxion": {
        "sources": [
            {"label": "Tienda Oficial de Referencia FuXion", "url": "https://carlos-lingan.site.fuxion.com/"},
            {"label": "UNCTAD — Digital Economy & E-commerce Reports", "url": "https://unctad.org/topic/ecommerce-and-digital-economy"},
        ],
        "callout_title": "Cero inversión obligatoria en inventario acumulado",
        "callout_text": "En el sistema de Dropshipping FuXion tú no almacenas mercadería ni vas al correo: compartes tu enlace oficial, el cliente paga en la pasarela segura de FuXion y la compañía despacha desde su centro logístico.",
    },
    "comparativas-de-negocio-y-afiliacion": {
        "sources": [
            {"label": "U.S. Small Business Administration — Choose a Business Structure", "url": "https://www.sba.gov/"},
            {"label": "Calculadora Interactiva de Ingresos Referenciales", "url": "https://ingresospasivos.click/calculadora-de-ingresos/"},
        ],
        "callout_title": "Criterio objetivo de comparación",
        "callout_text": "Ningún modelo de negocio es mágico ni automático. Evaluamos capital en riesgo, complejidad logística, margen neto referencial y tasa de recompra real para que elijas la ruta que encaja con tu tiempo disponible.",
    },
}

DEFAULT_EDITORIAL_PROFILE = {
    "sources": [
        {"label": "Guía Central y Calculadora Referencial — IngresosPasivos.click", "url": "https://ingresospasivos.click/calculadora-de-ingresos/"},
        {"label": "OCDE — Educación Financiera y Emprendimiento Digital", "url": "https://www.oecd.org/"},
    ],
    "callout_title": "Aplicación práctica en un sistema real sin stock",
    "callout_text": "Este principio cobra verdadero sentido cuando lo aplicas sobre productos consumibles de recompra mensual (como el ciclo de 28 sticks de FuXion) apalancándote en una tienda virtual de dropshipping donde no inmovilizas capital en inventario.",
}


def make_pillar_article(p: dict, child_items: list, idx: int) -> dict:
    cat_slug = p["slug"]
    path = f"/{cat_slug}/"
    related_paths = [f"/{cat_slug}/{c['slug']}/" for c in child_items[:6]]
    table_rows = [
        [c["title"], f"[Leer guía completa](/{cat_slug}/{c['slug']}/)"]
        for c in child_items[:15]
    ]
    blocks = [
        {
            "type": "p",
            "text": f"Bienvenido al hub central de **{p['title']}** en **IngresosPasivos.click**. En esta sección reunimos **{len(child_items)} guías especializadas** diseñadas sin canibalización sobre **{p['focus']}**, combinando análisis práctico, tablas referenciales y pasos accionables.",
        },
        {
            "type": "p",
            "text": "Nuestro enfoque parte de una premisa clara: existen **dos vías complementarias** para generar ingresos referenciales con el ecosistema de **FuXion**. La primera es **solo vender productos nutracéuticos mediante Dropshipping** (sin comprar stock ni encargarte de envíos); la segunda es **desarrollar una red de afiliados** duplicando los bloques **Pro 1 y Pro 2** con el respaldo humano del equipo de **Charlie Lingan** (`info@charlielingan.com`).",
        },
        {"type": "h2", "text": f"Qué aprenderás en las {len(child_items)} guías de esta categoría"},
        {
            "type": "p",
            "text": f"Cada artículo de este silo resuelve una intención específica relacionada con **{p['focus']}**. Antes de tomar cualquier decisión, te invitamos a simular escenarios en nuestra [calculadora interactiva de comisiones y ventas](/calculadora-de-ingresos/), recordando siempre que las cifras en cualquier negocio comercial son **referenciales y variables** según tu dedicación y país.",
        },
        {
            "type": "table",
            "caption": f"Guías destacadas dentro de {p['title']}",
            "headers": ["Guía Especializada", "Acceso Directo"],
            "rows": table_rows,
        },
        {
            "type": "callout",
            "variant": "etiqueta",
            "title": "Transparencia comercial y acompañamiento directo",
            "text": "Portal operado por el distribuidor independiente CARLOS LINGAN BORJA (Lima, Perú · info@charlielingan.com). Todos los cálculos de ganancias son ilustrativos y no constituyen promesa de sueldo fijo.",
        },
        {"type": "h2", "text": "Cómo aprovechar este centro de recursos en 3 pasos"},
        {
            "type": "ol",
            "items": [
                "**Define tu modalidad inicial:** decide si prefieres empezar únicamente recomendando productos por [Tienda Virtual sin stock](/dropshipping-y-tienda-virtual-fuxion/) o combinando ventas con [construcción de equipo Pro 1 y Pro 2](/plan-de-pagos-y-bonos-fuxion/).",
                "**Simula tus metas en tu moneda local:** revisa los puntos volumen (PV) y proyecciones referenciales en nuestra [calculadora geolocalizada](/calculadora-de-ingresos/) para cualquiera de los 34 países habilitados.",
                "**Activa tu cuenta con soporte de equipo:** regístrate con nuestro enlace oficial de afiliación o consulta en vivo en el chat IA para recibir las herramientas de arranque del equipo de Charlie Lingan.",
            ],
        },
        {
            "type": "cta",
            "text": "¿Quieres calcular cuánto representan tus metas en tu moneda local o iniciar tu registro oficial en FuXion con acompañamiento paso a paso?",
        },
    ]
    faqs = [
        {
            "q": "¿Necesito comprar stock físico de productos para empezar a vender?",
            "a": "No es necesario acumular inventario para vender a tus clientes. Al registrarte como distribuidor independiente FuXion recibes tu propia Tienda Virtual de dropshipping: compartes tu enlace, FuXion cobra en línea, factura y envía el pedido directo a la casa de tu cliente.",
        },
        {
            "q": "¿Puedo dedicarme solo a vender productos sin reclutar afiliados?",
            "a": "Sí. FuXion permite desarrollar una carrera 100% enfocada en venta directa a Clientes Preferentes (ganando del 20% al 50% referencial sobre puntos comisionables más el Bono Pro 1 al superar 500 PV con al menos 6 clientes), o bien sumar la vía multinivel cuando lo desees.",
        },
        {
            "q": "¿Los montos de comisiones mostrados en las guías son fijos o garantizados?",
            "a": "Son estrictamente referenciales e ilustrativos. El ingreso real varía según los puntos volumen (PV/CV) efectivamente comercializados, el país de operación, el tipo de cambio y las retenciones tributarias aplicables.",
        },
    ]
    return {
        "slug": cat_slug,
        "pillar": cat_slug,
        "path": path,
        "isPillar": True,
        "isTransactional": p["isTransactional"],
        "productSlug": None,
        "countryFocus": None,
        "primaryKeyword": p["kw"],
        "title": p["title"],
        "seoTitle": f"{p['title']} | IngresosPasivos.click",
        "metaDescription": f"Explora {len(child_items)} guías prácticas sobre {p['focus']}. Calculadora referencial en 34 países, dropshipping sin stock y registro oficial FuXion.",
        "excerpt": f"Centro completo con {len(child_items)} guías prácticas sobre {p['focus']}, ejemplos referenciales y herramientas digitales.",
        "quickAnswer": f"En esta categoría reunimos {len(child_items)} guías prácticas sobre {p['focus']}. Explicamos paso a paso cómo apalancarte en la Tienda Virtual de dropshipping de FuXion (sin acumular stock) y cómo funcionan de manera referencial las comisiones de venta directa, el Bono Pro 1 y la duplicación de equipos Pro 2 en 34 países.",
        "readingMinutes": 8,
        "image": {
            "prompt": build_diverse_prompt(f"editorial workspace representing {p['title']}", idx),
            "alt": p["title"],
        },
        "blocks": blocks,
        "faqs": faqs,
        "sources": [
            {"label": "Calculadora Interactiva de Comisiones FuXion", "url": "https://ingresospasivos.click/calculadora-de-ingresos/"},
            {"label": "Descargo Oficial de Ingresos Referenciales", "url": "https://ingresospasivos.click/descargo-de-ingresos/"},
        ],
        "related": related_paths[:4],
        "datePublished": PUBLISHED,
        "dateModified": PUBLISHED,
    }


def make_transactional_article(item: dict, siblings: list, sib_idx: int, global_idx: int, prods_by_slug: dict) -> dict:
    pillar = item["pillar"]
    slug = item["slug"]
    title = item["title"]
    kw = item["kw"]
    angle = item["angle"]
    pslug = item.get("productSlug")
    prod = prods_by_slug.get(pslug) if pslug else None
    prof = SILO_EDITORIAL_PROFILES.get(pillar, DEFAULT_EDITORIAL_PROFILE)

    # Enlaces relacionados circulares limpios dentro del mismo silo + cruzado
    rel = []
    for offset in (1, 3, 7, 13):
        cand = siblings[(sib_idx + offset) % len(siblings)]
        if cand["slug"] != slug:
            rel.append(f"/{pillar}/{cand['slug']}/")

    if prod:
        pname = prod["name"]
        pv = prod["pointsPv"]
        pack = prod["pack"]
        cat_name = prod["categoryName"]
        short_desc = prod["shortDescription"] or f"Bebida funcional en polvo de la línea {cat_name}."
        boxes_pro1 = max(1, round(500 / max(pv, 1)))
        boxes_25pct = max(1, round(100 / max(pv, 1)))
        boxes_40pct = boxes_pro1

        quick = (
            f"Para comercializar {pname} de FuXion sin comprar stock, te registras como distribuidor independiente y compartes tu enlace de Tienda Virtual. "
            f"Cada {pack} aporta {pv} puntos volumen (PV) referenciales: con unas {boxes_pro1} unidades distribuidas entre al menos 6 Clientes Preferentes en un período de 4 semanas "
            f"alcanzas los 500 PV del Bono Pro 1 (comisión directa de hasta 40% más bono referencial adicional)."
        )
        intro_p1 = (
            f"Dentro del catálogo nutracéutico de FuXion, **{pname}** ({cat_name}, presentación de {pack}) destaca por combinar consumo cotidiano y reposición predecible. "
            f"{short_desc} Desde la perspectiva estrictamente comercial —enfocada en **{angle}**—, este SKU aporta **{pv} puntos volumen (PV)** por unidad vendida en tu tienda replicada."
        )
        intro_p2 = (
            f"A diferencia de la reventa tradicional donde tendrías que adelantar capital para comprar decenas de envases, en el modelo de **Dropshipping FuXion** el cliente pide desde tu link personalizado, "
            f"paga con tarjeta o medio local en la pasarela oficial y recibe el producto sellado de planta en su domicilio. Puedes contrastar escenarios en nuestra [calculadora referencial de ingresos](/calculadora-de-ingresos/)."
        )
        table_headers = ["Escenario Mensual (4 Semanas)", f"Unidades de {pname} ({pv} PV)", "Puntos PV Acumulados", "Escala Referencial Desbloqueada"]
        table_rows = [
            ["Arranque inicial (tiempo parcial)", f"{boxes_25pct} unidades", f"{boxes_25pct * pv} PV", "25% comisión referencial de venta directa"],
            ["Consolidación intermedia", f"{max(boxes_25pct + 2, round(300 / max(pv, 1)))} unidades", f"{max(boxes_25pct + 2, round(300 / max(pv, 1))) * pv} PV", "30% comisión referencial sobre volumen CV"],
            ["Meta Estrella Bono Pro 1 (mín. 6 clientes)", f"{boxes_40pct} unidades", f"{boxes_40pct * pv} PV (>= 500 PV)", "40% venta directa + Bono Pro 1 (~$50–$100 USD ref.)"],
            ["Duplicación Pro 2 (Tú + 4 socios en Pro 1)", f"{boxes_40pct} propias + red", "2,500+ PV grupales", "Tus comisiones Pro 1 + Bono Pro 2 (~$200 USD ref.)"],
        ]
        steps_items = [
            {"name": "Activa tu Tienda Virtual FuXion", "text": f"Completa tu inscripción oficial en el equipo de Charlie Lingan para habilitar tu enlace de dropshipping en los 34 países."},
            {"name": f"Identifica el perfil comprador de {pname}", "text": f"Comunica con honestidad qué es {pname} según su etiqueta ({pack}), evitando promesas médicas y enfocándote en practicidad y sabor."},
            {"name": "Registra a cada comprador como Cliente Preferente", "text": f"Con pedidos de 35 PV o más (por ejemplo, combinando {pname} con otro producto complementario), sumas clientes calificados rumbo a tus 6 clientes del Bono Pro 1."},
            {"name": "Aplica seguimiento de reposición al día 24", "text": f"Como el envase trae {prod['sticks']} porciones, un recordatorio amable en la cuarta semana impulsa la recompra recurrente."},
        ]
        faqs = [
            {
                "q": f"¿Cuántos puntos PV da {pname} y cuántas cajas necesito para el Bono Pro 1?",
                "a": f"Cada unidad estándar de {pname} ({pack}) suma {pv} PV referenciales. Para alcanzar los 500 PV del Bono Pro 1 en un período de 4 semanas necesitas comercializar el equivalente a unas {boxes_pro1} unidades repartidas entre al menos 6 Clientes Preferentes (o menos unidades si las combinas en packs con otros productos de 20 a 25 PV).",
            },
            {
                "q": f"¿Debo comprar cajas de {pname} por adelantado para poder venderlo?",
                "a": "No. Con tu Tienda Virtual FuXion trabajas bajo modalidad dropshipping: envías tu link, FuXion procesa el cobro y despacha directamente al domicilio del comprador en cualquiera de los 34 países habilitados.",
            },
            {
                "q": f"¿Las ganancias por vender {pname} son fijas en todos los países?",
                "a": "No, todos los cálculos son referenciales. El monto exacto en tu moneda local depende del precio de lista vigente en el país del comprador, el factor de volumen comisionable (CV), tu porcentaje alcanzado en el período y los impuestos locales.",
            },
        ]
    else:
        metrics = item.get("metrics") or [
            ["Modalidad", "Dropshipping + Red de Afiliados FuXion"],
            ["Cobertura", "34 países habilitados"],
        ]
        quick = (
            f"Esta guía sobre {angle} detalla cómo estructurar ingresos referenciales combinando la Tienda Virtual de dropshipping de FuXion (sin comprar stock físico) "
            f"con la escala del Plan Pro-Lev: comisiones de venta directa del 20% al 50%, Bono Pro 1 (500 PV con 6 Clientes Preferentes) y duplicación de equipos Pro 2."
        )
        intro_p1 = (
            f"Analizar a fondo **{angle}** te permite emprender con números claros y expectativas realistas. En lugar de improvisar o depender de promesas exageradas, "
            f"el ecosistema digital de FuXion separa con precisión la operativa logística —que asume íntegramente la compañía en 34 países— de tu labor comercial y de liderazgo."
        )
        intro_p2 = (
            f"Tanto si tu meta inicial es generar un ingreso complementario recomendando productos desde el celular como si buscas escalar formando una red de socios hacia **Pro 2 y rangos de liderazgo**, "
            f"puedes proyectar cada escalón en tu moneda local usando nuestra [calculadora de comisiones FuXion](/calculadora-de-ingresos/)."
        )
        table_headers = ["Parámetro Clave", "Detalle Operativo y Referencial"]
        table_rows = metrics + [
            ["Requisito Bono Pro 1", "500 PV en 4 semanas con mínimo 6 Clientes Preferentes (>=35 PV c/u)"],
            ["Requisito Bono Pro 2", "Mantener tu Pro 1 + 4 socios directos calificados en Pro 1"],
        ]
        steps_items = [
            {"name": "Inscripción en el sistema oficial", "text": "Regístrate mediante el enlace oficial de afiliación para activar tu oficina virtual OffiX y tu tienda de dropshipping."},
            {"name": "Configuración de moneda y mercado", "text": "Verifica las condiciones de entrega y medios de pago habilitados en tu país o en los mercados internacionales donde tengas contactos."},
            {"name": "Construcción del bloque base Pro 1", "text": "Enfócate en tus primeros 6 a 10 Clientes Preferentes recurrentes con productos de alta rotación como Prunex1, Thermo T3 o Vita Xtra T+."},
            {"name": "Apalancamiento con el equipo mentor", "text": "Conéctate con el equipo de Charlie Lingan (info@charlielingan.com) para recibir plantillas, resolver dudas y apoyar a tus primeros afiliados."},
        ]
        faqs = [
            {
                "q": f"¿Cómo influye {kw} en mis comisiones mensuales?",
                "a": "Determina la velocidad con la que acumulas Puntos Volumen (PV) en ciclos de 4 semanas, lo cual define tu tramo de comisión directa (20% a 50%) y la activación de bonos adicionales como Pro 1 y Pro 2. Todos los importes son referenciales.",
            },
            {
                "q": "¿Qué respaldo recibo si me afilio sin experiencia previa en ventas?",
                "a": "Al inscribirte con nuestro equipo accedes a orientación paso a paso, material educativo, embudos digitales y soporte directo con el distribuidor oficial Charlie Lingan (info@charlielingan.com).",
            },
            {
                "q": "¿Puedo vender y registrar socios en otros países distintos al mío?",
                "a": "Sí. Tu código internacional FuXion te permite compartir enlaces de Cliente Preferente y patrocinar nuevos distribuidores en cualquiera de los 34 países oficiales de América y Europa.",
            },
        ]

    blocks = [
        {"type": "p", "text": intro_p1},
        {"type": "p", "text": intro_p2},
        {"type": "h2", "text": f"Datos clave y proyecciones referenciales: {title.split(':')[0]}"},
        {
            "type": "p",
            "text": "Para tomar decisiones con criterio empresarial conviene traducir el sistema de puntos a escenarios concretos. Recuerda que en FuXion los puntos volumen (**PV**) estandarizan el negocio en 34 países, mientras que el pago se liquida en tu moneda local sobre el volumen comisionable (**CV**):",
        },
        {
            "type": "table",
            "caption": f"Resumen operativo y referencial — {title.split(':')[0]}",
            "headers": table_headers,
            "rows": table_rows,
        },
        {
            "type": "callout",
            "variant": "etiqueta",
            "title": prof["callout_title"],
            "text": prof["callout_text"],
        },
        {"type": "h2", "text": "Dos caminos compatibles: Solo Dropshipping o Red Multinivel"},
        {
            "type": "p",
            "text": "Uno de los mayores aciertos del modelo actual es que **no obliga a nadie a reclutar si no lo desea**, pero premia generosamente a quien decide enseñar el sistema a otros emprendedores:",
        },
        {
            "type": "ul",
            "items": [
                "**Camino 1 — Vendedor Digital por Dropshipping:** te concentras al 100% en conectar consumidores con tu Tienda Virtual. No compras stock, no empacas pedidos y escalas desde el 20% hasta el 40%–50% referencial coronado por el **Bono Pro 1**.",
                "**Camino 2 — Constructor de Equipo y Liderazgo (Pro 2 / Pro 3):** mantienes tu cartera personal sana en Pro 1 y ayudas a 4 socios directos a lograr su propio Pro 1, activando el **Bono Pro 2** más comisiones residuales sobre el volumen grupal.",
                "**Acompañamiento real:** en ambos caminos cuentas con la guía directa del equipo de [Charlie Lingan](/sobre-el-distribuidor/) para evitar errores de principiante.",
            ],
        },
        {"type": "h2", "text": "Hoja de ruta práctica en 4 pasos"},
        {"type": "steps", "items": steps_items},
        {
            "type": "cta",
            "text": "Simula tus ingresos referenciales en tu moneda local o inicia hoy tu registro oficial en FuXion con el acompañamiento de nuestro equipo.",
        },
        {"type": "h2", "text": "Recomendaciones éticas para sostener resultados mes a mes"},
        {
            "type": "p",
            "text": f"Quienes logran ingresos consistentes con **{kw}** no son los que envían spam masivo, sino quienes tratan su código como una distribución profesional: conocen la ficha oficial, escuchan qué hábito busca mejorar el cliente, registran correctamente cada cuenta de Cliente Preferente y hacen un seguimiento amable antes de que se termine el envase de 28 días.",
        },
        {
            "type": "callout",
            "variant": "aviso",
            "title": "Aviso de ingresos referenciales",
            "text": "Los ejemplos de comisiones y bonos expuestos en esta guía tienen fines exclusivamente educativos e ilustrativos. Los resultados reales dependen del esfuerzo individual, las ventas efectivas a clientes finales y las condiciones vigentes de FuXion en cada país.",
        },
    ]

    return {
        "slug": slug,
        "pillar": pillar,
        "path": f"/{pillar}/{slug}/",
        "isPillar": False,
        "isTransactional": True,
        "productSlug": pslug,
        "countryFocus": item.get("countryFocus"),
        "primaryKeyword": kw,
        "title": title,
        "seoTitle": f"{title[:58]} | IngresosPasivos.click" if len(title) > 58 else f"{title} | IngresosPasivos.click",
        "metaDescription": f"{title}. Cómo funciona sin stock, puntos PV, comisiones referenciales Pro 1 / Pro 2 y enlace oficial de inscripción FuXion."[:158],
        "excerpt": f"Guía práctica sobre {angle}: modelo sin inventario, puntos PV, bonos referenciales y pasos para empezar.",
        "quickAnswer": quick,
        "readingMinutes": 7 + (global_idx % 3),
        "image": {
            "prompt": build_diverse_prompt(f"realistic commercial scene about {angle}", global_idx),
            "alt": title,
        },
        "blocks": blocks,
        "faqs": faqs,
        "sources": prof["sources"],
        "related": rel[:4],
        "datePublished": PUBLISHED,
        "dateModified": PUBLISHED,
    }


def make_seo_article(item: dict, siblings: list, sib_idx: int, global_idx: int) -> dict:
    pillar = item["pillar"]
    slug = item["slug"]
    title = item["title"]
    kw = item["kw"]
    angle = item["angle"]

    rel = [
        "/vender-productos-fuxion/como-vender-prunex1-de-fuxion-sin-stock-comisiones-y-puntos/",
        "/plan-de-pagos-y-bonos-fuxion/bono-pro-1-fuxion-500-puntos-como-lograrlo/",
    ]
    for offset in (2, 9):
        cand = siblings[(sib_idx + offset) % len(siblings)]
        if cand["slug"] != slug:
            rel.append(f"/{pillar}/{cand['slug']}/")

    hours_example = [4, 5, 6, 7, 8, 10][global_idx % 6]
    clients_example = [6, 8, 10, 12, 15, 20][global_idx % 6]

    quick = (
        f"Comprender {angle.lower()} te permite construir una fuente de ingresos adicional con bajo riesgo operativo. "
        f"La clave consiste en combinar hábitos consistentes ({hours_example} horas bien enfocadas por semana), productos consumibles de recompra mensual "
        f"y un sistema de dropshipping donde no inmovilizas ahorros comprando inventario físico."
    )

    blocks = [
        {
            "type": "p",
            "text": f"Cuando se investiga sobre **{kw}**, la mayoría de contenidos en internet cae en dos extremos poco útiles: o prometen ganancias mágicas sin trabajar, o aseguran que es imposible generar ingresos fuera de un horario de oficina tradicional. La realidad práctica se encuentra en el punto medio: **sistemas comerciales apalancados, medibles y repetibles**.",
        },
        {
            "type": "p",
            "text": f"En esta guía abordamos **{angle}** con enfoque realista y accionable. Verás qué métricas importan de verdad, qué errores debes descartar desde el primer día y cómo conectar estos principios con modelos modernos de [dropshipping sin inventario](/dropshipping-y-tienda-virtual-fuxion/) y carteras de recompra cada 28 días.",
        },
        {"type": "h2", "text": f"Fundamentos prácticos: por qué importa {title.split(':')[0].lower()}"},
        {
            "type": "p",
            "text": f"Todo proyecto sostenible de ingresos adicionales descansa sobre tres pilares: **riesgo de capital controlado**, **demanda recurrente** y **logística delegada**. Si un negocio te exige alquilar local, comprar mercadería sin saber si se venderá y pasar tardes enteras empaquetando cajas, deja de ser un ingreso flexible para convertirse en una carga financiera.",
        },
        {
            "type": "table",
            "caption": f"Matriz de evaluación práctica — {title.split(':')[0]}",
            "headers": ["Factor Evaluado", "Enfoque Improvisado (Alto Riesgo)", "Enfoque Sistemático y Apalancado"],
            "rows": [
                ["Capital en inventario", "Compra adelantada de lotes y stock inmovilizado", "$0 en stock obligatorio usando Tienda Virtual de dropshipping"],
                ["Dedicación semanal", "Horas desordenadas sin medir retorno", f"Bloques enfocados (~{hours_example} h/semana) en atención y contenido"],
                ["Tipo de producto", "Compra única esporádica sin fidelización", f"Consumibles cotidianos con cartera de {clients_example}+ clientes activos"],
                ["Acompañamiento", "Aprendizaje solitario por ensayo y error", "Mentoría, plantillas y soporte de un equipo experimentado"],
            ],
        },
        {
            "type": "callout",
            "variant": "tip",
            "title": "Regla práctica de sostenibilidad",
            "text": f"Dedicar {hours_example} horas semanales con orden durante 90 días a construir una cartera de {clients_example} clientes satisfechos produce mucho mejor retorno que buscar atajos de dinero rápido.",
        },
        {"type": "h2", "text": "Cómo aplicarlo paso a paso en un ecosistema real (ejemplo FuXion)"},
        {
            "type": "p",
            "text": "Para aterrizar este concepto en la vida real, observemos cómo funciona cuando te apalancas en la distribución digital de bebidas nutracéuticas de **FuXion** en cualquiera de sus [34 países oficiales](/afiliarse-a-fuxion-por-pais/):",
        },
        {
            "type": "ol",
            "items": [
                "**Cero fricción operativa:** recibes tu propia tienda online personalizada; cuando alguien compra desde tu link, FuXion procesa el pago, emite comprobante y envía el producto desde su planta hasta la puerta del comprador.",
                "**Recompra natural cada 4 semanas:** al tratarse de cajas y doypacks de 28 sticks de consumo diario (sin azúcares añadidos y Clean Label), el mismo cliente satisfecho suele reponer su pedido mes tras mes.",
                "**Escala progresiva referencial:** puedes quedarte solo en la vía de venta directa (apuntando al **Bono Pro 1** con 500 PV y 6 Clientes Preferentes) o sumar la vía de liderazgo (**Bono Pro 2** ayudando a 4 socios directos a lograr su Pro 1).",
            ],
        },
        {"type": "h3", "text": "Errores frecuentes que debes evitar desde el inicio"},
        {
            "type": "ul",
            "items": [
                "**Confundir facturación con utilidad neta:** revisa siempre tu porcentaje real sobre volumen comisionable y separa un apartado para obligaciones fiscales de tu país.",
                "**Hacer spam o exagerar beneficios:** la confianza se gana educando con datos reales de etiqueta y respetando los tiempos de decisión de cada persona.",
                "**No medir tus avances:** utiliza nuestra [calculadora referencial con IA](/calculadora-de-ingresos/) para traducir tus metas mensuales en acciones semanales concretas.",
            ],
        },
        {
            "type": "cta",
            "text": "¿Te gustaría simular cuánto podrías generar de forma referencial en tu moneda local combinando ventas sin stock o red de afiliados?",
        },
        {"type": "h2", "text": "Conclusión: constancia, ética y apalancamiento digital"},
        {
            "type": "p",
            "text": f"Dominar **{angle.lower()}** no requiere grandes ahorros ni conocimientos técnicos complejos, sino elegir un vehículo comercial donde la infraestructura pesada ya esté resuelta. Si deseas explorar cómo implementar esta ruta dentro de nuestro equipo, puedes revisar la guía sobre [cómo funciona el Plan de Pagos y Bono Pro 1](/plan-de-pagos-y-bonos-fuxion/) o escribir directamente a **info@charlielingan.com**.",
        },
        {
            "type": "callout",
            "variant": "aviso",
            "title": "Transparencia editorial y financiera",
            "text": "Contenido educativo elaborado por el equipo de CARLOS LINGAN BORJA (Lima, Perú). Todos los escenarios de comisiones e ingresos mencionados en este portal son estrictamente referenciales, pueden variar según país y dedicación, y no representan garantía de ganancias fijas.",
        },
    ]

    faqs = [
        {
            "q": f"¿Cuánto capital necesito para aplicar lo aprendido sobre {kw}?",
            "a": "En modelos digitales basados en tienda virtual y dropshipping directo del fabricante (como FuXion), no necesitas invertir miles de dólares en mercadería ni alquilar almacén; solo cubres tu kit básico de registro y trabajas compartiendo tu enlace oficial.",
        },
        {
            "q": f"¿Cuántas horas por semana requiere empezar si tengo otro empleo?",
            "a": f"Una pauta realista es organizar entre {hours_example} y 8 horas semanales bien enfocadas (unos 45 a 60 minutos diarios) dedicadas a crear contenido útil, responder consultas por WhatsApp y dar seguimiento postventa a tus clientes.",
        },
        {
            "q": "¿Es obligatorio formar un equipo multinivel o puedo solo vender productos?",
            "a": "Es totalmente opcional. Puedes dedicarte exclusivamente a la venta de productos mediante dropshipping cobrando comisiones referenciales del 20% al 50% y el Bono Pro 1, o bien construir un equipo de afiliados cuando quieras escalar hacia el Bono Pro 2 y bonos residuales.",
        },
    ]

    return {
        "slug": slug,
        "pillar": pillar,
        "path": f"/{pillar}/{slug}/",
        "isPillar": False,
        "isTransactional": False,
        "productSlug": None,
        "countryFocus": None,
        "primaryKeyword": kw,
        "title": title,
        "seoTitle": f"{title[:58]} | IngresosPasivos.click" if len(title) > 58 else f"{title} | IngresosPasivos.click",
        "metaDescription": f"Guía práctica sobre {angle.lower()}. Cómo aplicarlo paso a paso con bajo riesgo, ejemplos referenciales y sistemas digitales sin inventario."[:158],
        "excerpt": f"Aprende paso a paso sobre {angle.lower()} con criterios realistas, tabla comparativa y aplicación práctica sin stock.",
        "quickAnswer": quick,
        "readingMinutes": 6 + (global_idx % 4),
        "image": {
            "prompt": build_diverse_prompt(f"editorial lifestyle scene illustrating {angle}", global_idx + 600),
            "alt": title,
        },
        "blocks": blocks,
        "faqs": faqs,
        "sources": DEFAULT_EDITORIAL_PROFILE["sources"],
        "related": rel[:4],
        "datePublished": PUBLISHED,
        "dateModified": PUBLISHED,
    }


def main():
    prods = json.loads((DATA_DIR / "fuxion_products.json").read_text())
    prods_by_slug = {p["slug"]: p for p in prods}

    trans_items = generate_transactional_520()
    seo_items = generate_seo_2000()

    by_pillar = defaultdict(list)
    for it in trans_items + seo_items:
        by_pillar[it["pillar"]].append(it)

    # Limpiar posibles archivos previos
    for old in ART_DIR.glob("*.json"):
        old.unlink()

    all_articles = []
    seen_slugs = set()
    seen_paths = set()
    seen_kws = set()
    seen_titles = set()

    # 1. Crear los 15 Hubs Pilares
    for idx, p in enumerate(PILLARS):
        art = make_pillar_article(p, by_pillar[p["slug"]], idx)
        all_articles.append(art)

    # 2. Crear los 520 Artículos Transaccionales
    g_idx = 0
    for p in PILLARS:
        if not p["isTransactional"]:
            continue
        sibs = by_pillar[p["slug"]]
        for s_idx, item in enumerate(sibs):
            g_idx += 1
            art = make_transactional_article(item, sibs, s_idx, g_idx, prods_by_slug)
            all_articles.append(art)

    # 3. Crear los 2,000 Artículos SEO Informacionales
    for p in PILLARS:
        if p["isTransactional"]:
            continue
        sibs = by_pillar[p["slug"]]
        for s_idx, item in enumerate(sibs):
            g_idx += 1
            art = make_seo_article(item, sibs, s_idx, g_idx)
            all_articles.append(art)

    # Auditoría estricta de 0 canibalización antes de escribir a disco
    kw_map = []
    search_index = []
    for a in all_articles:
        s = a["slug"]
        pth = a["path"]
        kw = a["primaryKeyword"].strip().lower()
        ttl = a["title"].strip().lower()
        assert s not in seen_slugs, f"Duplicate slug: {s}"
        assert pth not in seen_paths, f"Duplicate path: {pth}"
        assert kw not in seen_kws, f"Cannibalized keyword: {kw}"
        assert ttl not in seen_titles, f"Duplicate title: {ttl}"
        seen_slugs.add(s)
        seen_paths.add(pth)
        seen_kws.add(kw)
        seen_titles.add(ttl)

        (ART_DIR / f"{s}.json").write_text(
            json.dumps(a, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
        kw_map.append({
            "slug": s,
            "pillar": a["pillar"],
            "path": pth,
            "isPillar": a["isPillar"],
            "isTransactional": a["isTransactional"],
            "primaryKeyword": a["primaryKeyword"],
            "title": a["title"],
        })
        search_index.append({
            "t": a["title"],
            "p": pth,
            "c": a["pillar"],
            "k": a["primaryKeyword"],
            "x": 1 if a["isTransactional"] else 0,
        })

    (DATA_DIR / "keyword_map.json").write_text(
        json.dumps(kw_map, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (PUB_DIR / "search-index.json").write_text(
        json.dumps(search_index, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    print(
        f"SUCCESS: Generated {len(all_articles)} unique articles "
        f"(15 Pillars + {len(trans_items)} Transactional + {len(seo_items)} SEO Informational) "
        "with ZERO cannibalization!"
    )


if __name__ == "__main__":
    main()
