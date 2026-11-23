#!/usr/bin/env python3
"""
Generador fotorrealista y diverso de imágenes (< 100 KB) para ingresospasivos.click
vía la Edge Function ingresospasivos-images (Supabase charlielingan -> OpenAI ChatGPT Image API, quality="medium").

Cada imagen se recorta en 16:9 (1200x675) y se comprime adaptativamente en WebP <= 68 KB
(estrictamente < 100 KB para máximo rendimiento Core Web Vitals y SEO en Google), más variantes -800 y -400.

Uso:
  python3 scripts/gen_images.py home                  # genera las 76 escenas base de Home + 15 Silos + Matriz Anti-Similitud
  python3 scripts/gen_images.py articles [limit] [offset]  # genera portadas individuales por artículo desde image.prompt
  python3 scripts/gen_images.py one <slug> "<prompt>"
"""
import concurrent.futures as cf
import io
import json
import pathlib
import sys
import time
import urllib.request
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENDPOINT = "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/ingresospasivos-images"
TOKEN = "ingresospasivos-img-2026"
RAW = ROOT / "scripts/.cache/raw"
RAW.mkdir(parents=True, exist_ok=True)

# 76 escenas fotorrealistas radicalmente distintas (ángulos, lentes, ciudades, iluminación y sujetos)
HOME_PROMPTS = {
    # Home y OG (11 escenas)
    "home-hero-fuxion": "Three-quarter 50mm editorial photograph of a bright modern Lima apartment desk overlooking city trees, sleek laptop and smartphone beside a clear glass mug of vibrant ruby-berry herbal infusion and a clean notebook, warm morning sunlight, generous composition",
    "og-default": "Wide 35mm editorial workspace scene on warm light oak wood featuring a laptop, a smartphone, a small sealed kraft courier parcel ready for home delivery and a glass cup of golden-citrus wellness tea, crisp morning daylight",
    "home-dropshipping-laptop": "Over-the-shoulder 50mm close-up of a young Hispanic entrepreneur seated at a sunlit wooden dining table holding a smartphone while a small courier delivery box sits on a clean console in the background, authentic candid daylight",
    "home-logistica-envio": "Wide 28mm realistic photograph inside a spotless modern automated e-commerce fulfillment center where neat small brown shipping parcels move along a clean roller conveyor under bright industrial skylight, zero logos or labels",
    "home-pro1-pro2": "Overhead 35mm flat-lay on walnut wood showing an open leather planner, fountain pen, modern brass calculator, two smartphones and a ceramic cup of warm herbal tea, crisp studio daylight",
    "home-equipo-mentoria": "Eye-level 50mm candid lifestyle photograph of four diverse Latin American entrepreneurs collaborating smilingly around a sunlit coworking wooden table with laptops and glasses of fruit-infused water in Miraflores Lima, warm natural light",
    "home-comparativa-stock": "Split environmental studio scene: on the left side a cluttered dim storage corner stacked high with heavy cardboard inventory cartons; on the right side an airy minimalist sunlit desk with only a slim laptop and a cup of tea",
    "home-calculadora-ia": "Close-up 85mm shallow depth-of-field photograph of hands typing on an ultrabook keyboard on a marble cafe table next to a smartphone and an iced citrus wellness drink, warm afternoon bokeh",
    "home-paises-global": "Editorial 35mm travel-desk composition featuring a passport holder, world map globe in soft background focus, wireless earbuds, laptop and a steaming ceramic mug by a sunny window in Madrid",
    "home-bebida-funcional": "Macro 85mm sunlit kitchen counter still life of a tall glass filled with chilled purple-berry botanical drink with ice cubes, fresh blueberries, lemon twist and mint leaves on light stone, zero packaging",
    "home-entrega-puerta": "Candid 35mm residential porch photograph of a friendly courier handing a neat small parcel box to a smiling customer at a bright modern apartment doorway, soft afternoon sunlight",

    # 15 Hubs Pilares de Categoría (15 escenas únicas)
    "cat-vender-productos-fuxion": "Editorial 50mm kitchen-island photograph with three distinct glass cups of colorful botanical infusions—ruby berry, golden citrus and emerald green tea—beside fresh fruits and a tablet on white quartz, bright daylight",
    "cat-afiliarse-a-fuxion-por-pais": "Sunlit modern architectural terrace overlooking an international skyline with a laptop, leather portfolio and glass of sparkling fruit infusion on a teak table, 35mm lens",
    "cat-plan-de-pagos-y-bonos-fuxion": "Crisp 50mm angled desktop shot of clean geometric wooden stepping blocks ascending beside a sleek calculator, pen and espresso-sized herbal cup on light birch wood, morning light",
    "cat-dropshipping-y-tienda-virtual-fuxion": "Clean 35mm e-commerce dispatch scene showing a compact sealed parcel on a minimalist scale next to barcode scanner light and sleek laptop in a tidy modern logistics studio, no text",
    "cat-comparativas-de-negocio-y-afiliacion": "Symmetrical overhead 35mm composition on two-tone wood comparing a compact mobile digital setup on one half and traditional retail notebook tools on the other half, natural studio light",
    "cat-fundamentos-de-ingresos-pasivos": "Calm early-morning 50mm window scene in a cozy Scandinavian living room with a steaming ceramic mug, open hardcover finance book shape without text and indoor olive tree, golden sunrise",
    "cat-ingresos-extra-por-perfil-y-profesion": "Warm evening 50mm home-studio photograph of a professional working serenely on a laptop after hours under a brass desk lamp with headphones and herbal infusion, shallow depth of field",
    "cat-guia-dropshipping-sin-inventario": "Modern last-mile electric delivery van parked on a leafy European cobblestone street while a courier carries a small parcel, 35mm documentary style daylight",
    "cat-marketing-de-afiliados-y-comisiones": "Creative content creator desk in Mexico City with ring-light reflection, mirrorless camera on mini tripod, smartphone mount and glass of iced hibiscus tea, 35mm editorial angle",
    "cat-redes-de-mercadeo-eticas-y-modernas": "Authentic 50mm coffee-shop mentorship meeting between two smiling professionals reviewing notes on a tablet over glasses of cold botanical drink, natural window light",
    "cat-ventas-por-whatsapp-y-redes-sociales": "Close-up 85mm candid shot of a woman sitting on a linen sofa recording a friendly voice note on her smartphone near a sunlit balcony plant, warm natural tones",
    "cat-negocios-de-salud-bienestar-y-recompra": "Bright morning fitness and wellness kitchen counter with a shaker bottle of smooth vanilla protein shake, fresh strawberries, almonds and a smartwatch, 50mm lens",
    "cat-emprender-por-presupuesto-tiempo-y-pais": "Minimalist 35mm flat-lay of an analog minimalist wristwatch, glass jar with coins, neat planner and smartphone on warm travertine stone, crisp daylight",
    "cat-inteligencia-artificial-para-vendedores": "Futuristic yet warm 50mm dual-monitor minimalist desk in dark walnut wood with soft cyan and warm amber ambient backlighting, ergonomic mouse and ceramic cup, evening mood",
    "cat-finanzas-para-comisionistas-y-emprendedores": "Clean 50mm financial planning table in Bogota with neat wooden organizer, metallic pen, minimalist tablet stylus and warm cup ofgolden infusion by a rain-kissed window",

    # 50 Variantes Anti-Similitud para los Silos (diferentes ópticas, horas del día, ciudades y encuadres)
    "scene-ventas-1": "Close-up 85mm studio-lit glass mug of hot spiced apple-cinnamon infusion on rustic oak beside cinnamon sticks and a sleek smartphone, warm autumn light",
    "scene-ventas-2": "Outdoor sunny gym-terrace bench in Miami with a frosty sports bottle of pink electrolyte drink, towel and wireless earbuds, 35mm crisp daylight",
    "scene-ventas-3": "Overhead flat-lay on white marble featuring a glass cup ofpassionfruit infusion, halved maracuya, mint sprigs and a minimalist tablet, bright airy light",
    "scene-ventas-4": "Cozy nighttime bedside wooden table with a warm chamomile-purple berry infusion in a glass teacup next to reading glasses, soft warm lamp glow, 50mm",
    "scene-paises-1": "Bright Madrid balcony bistro table with wrought iron railing, laptop, sunglasses and chilled citrus drink overlooking European historic rooftops, 35mm",
    "scene-paises-2": "Modern Bogota brick-and-wood apartment study with mountain clouds outside the window, laptop, notebook and hot herbal mug, 50mm natural light",
    "scene-paises-3": "Sunlit Santiago de Chile minimalist glass office corner with Andes silhouette far in soft bokeh, tablet and glass carafe of water, 35mm",
    "scene-paises-4": "Vibrant Buenos Aires neighborhood cafe wooden table by a large window with notebook, pen and glass of iced botanical tea, golden afternoon light",
    "scene-bonos-1": "Macro 100mm shot of a sleek silver fountain pen resting on a crisp grid notebook next to a modern pocket calculator in warm directional morning light",
    "scene-bonos-2": "Three-quarter 50mm view of an organized home-office shelf with indoor pothos plant, wooden calendar blocks, tablet and ceramic cup",
    "scene-bonos-3": "Sunlit glass conference room table after a productive strategy session with clean notebooks, water glasses and warm sunlight streaks, 35mm",
    "scene-bonos-4": "Minimalist Scandinavian desk corner with brass desk lamp, neat leather tray, smartphone and warm amber herbal drink, dusk twilight",
    "scene-dropshipping-1": "Close-up 50mm shot of hands sealing a small recyclable kraft shipping box with paper tape on a spotless packing station, bright natural light",
    "scene-dropshipping-2": "Neat row of small unbranded parcels organized on clean birch shelving inside a boutique micro-fulfillment hub, 35mm architectural symmetry",
    "scene-dropshipping-3": "Bicycle courier in a sunny green city lane carrying a compact delivery backpack, candid 50mm motion-frozen street photography",
    "scene-dropshipping-4": "Minimalist apartment entryway console table where a freshly delivered small parcel rests beside house keys and a ceramic vase, morning sunbeam",
    "scene-comparativas-1": "Side-by-side 50mm still life on split slate and oak stone showing a heavy key ring on left versus a sleek smartphone on right, dramatic soft studio light",
    "scene-comparativas-2": "Architectural crossroads walkway seen from above with clean modern geometric paving in warm sunlight, symbolic decision perspective, 35mm",
    "scene-comparativas-3": "Two distinct chairs in a sunlit studio—one classic heavy leather armchair and one agile modern ergonomic mesh chair—50mm editorial",
    "scene-pasivos-1": "Serene coastal terrace in Miraflores Lima at sunrise with a laptop closed on a linen table, glass of fresh juice and ocean horizon in soft bokeh, 50mm",
    "scene-pasivos-2": "Macro close-up of young green plant shoots growing in a terracotta pot on a sunlit wooden windowsill beside a notebook, 85mm lens",
    "scene-pasivos-3": "Peaceful library-style home study with floor-to-ceiling wooden bookshelves, leather notebook and afternoon sunbeams, 35mm",
    "scene-pasivos-4": "Minimalist hammock chair on a bright apartment balcony next to a small side table with a laptop and iced herbal drink, relaxed daylight",
    "scene-perfiles-1": "University student backpack, sleek tablet, headphones and insulated tumbler on a sunny campus wooden bench under green trees, 50mm",
    "scene-perfiles-2": "Bright family kitchen table in mid-morning after school drop-off with a laptop, fruit bowl and cup of warm tea, 35mm authentic home life",
    "scene-perfiles-3": "Personal trainer studio wooden bench with resistance bands, stopwatch, tablet and chilled protein shake in plain glass, crisp gym daylight",
    "scene-perfiles-4": "Nutritionist minimalist consultation desk with fresh apples, measuring tape, clean notepad and glass of green botanical infusion, 50mm",
    "scene-ecommerce-1": "Close-up 85mm of a contactless credit card tap near a sleek wireless payment terminal on a modern wooden counter, soft bokeh",
    "scene-ecommerce-2": "Clean warehouse loading bay at sunrise with electric vans ready for dispatch, crisp geometric lines, 28mm wide lens",
    "scene-ecommerce-3": "Overhead flat-lay of protective honeycomb kraft wrapping paper, twine, small parcel box and scissors on a pale grey desk, studio daylight",
    "scene-afiliados-1": "Podcaster / creator desk with dynamic studio microphone on boom arm, acoustic wood slat wall, laptop and glass of berry tea, 50mm",
    "scene-afiliados-2": "Sunlit minimalist coworking lounge booth with laptop, wireless mouse and espresso-style herbal shot on terrazzo table, 35mm",
    "scene-afiliados-3": "Close-up of hands sketching a clean funnel diagram with arrows (no words) using colored markers in a dotted notebook, 50mm",
    "scene-afiliados-4": "Modern dual-device setup on a bamboo standing desk in front of a bright apartment window with green plants, morning light",
    "scene-red-1": "Warm circular wooden table with five notebooks and five glasses of colorful fruit infusions ready for a team workshop, overhead 35mm",
    "scene-red-2": "Two entrepreneurs shaking hands warmly across a sunlit wooden cafe table with laptops, candid 50mm shallow depth of field",
    "scene-red-3": "Small modern seminar room with natural oak chairs, warm spotlighting and a clean wooden podium, welcoming atmosphere, 35mm",
    "scene-whatsapp-1": "Over-the-shoulder 85mm close-up of a man walking in a sunny business district holding his smartphone with wireless earphones, crisp bokeh",
    "scene-whatsapp-2": "Vertical smartphone mounted on a sleek desktop stand filming a glass of vibrant orange citrus drink being stirred with ice on a kitchen counter, 50mm",
    "scene-whatsapp-3": "Cozy armchair corner with a woman smiling naturally while typing on her phone beside a small round table and plant, soft window light",
    "scene-whatsapp-4": "Flat-lay of smartphone, portable power bank, wireless lapel microphone clip and notebook on a café table, 35mm",
    "scene-bienestar-1": "Fresh farmers-market basket of guindones, lemons, ginger root, blueberries and mint on a rustic wooden kitchen table, 50mm morning sun",
    "scene-bienestar-2": "Post-run morning park bench scene with running shoes, smartwatch and a cold bottle of golden electrolyte infusion in dappled tree sunlight, 50mm",
    "scene-bienestar-3": "Spa-like minimalist bathroom/vanity shelf in travertine stone with a glass of collagen-style berry drink and fresh orchid, soft daylight",
    "scene-tiempo-1": "Sand hourglass beside a sleek ultrabook and cup of tea on a clean walnut desk, soft lateral afternoon light, 85mm",
    "scene-tiempo-2": "Early 6 AM quiet kitchen island with soft dawn blue light outside and warm pendant light over a laptop and steaming mug, 35mm",
    "scene-tiempo-3": "Weekend sunny patio table with laptop, straw hat, notebook and refreshing iced green tea with lemon, 50mm",
    "scene-tiempo-4": "Compact commuter leather messenger bag next to a smartphone, metro card blank prop and travel tumbler on a bench, 50mm",
    "scene-ia-1": "Minimalist white aluminum desk with sleek laptop, glowing subtle desk light strip, headphones and succulent plant, crisp editorial 50mm",
    "scene-ia-2": "Close-up 85mm of eyeglasses resting on a laptop palm-rest reflecting soft warm screen glow in a cozy evening study",
    "scene-ia-3": "Clean studio overhead view of keyboard, trackpad, smartphone and neat index cards arranged in a workflow grid on grey felt mat, 35mm",
    "scene-finanzas-1": "Three glass jars of escalating heights holding coins on a sunlit oak windowsill symbolizing progressive savings, 50mm",
    "scene-finanzas-2": "Crisp overhead shot of a leather wallet, calculator, fountain pen and neat notebook on dark green desk blotter, classic editorial light",
    "scene-finanzas-3": "Couple sitting together at a bright dining table calmly reviewing household finances on a laptop with cups of tea, 50mm candid",
    "scene-finanzas-4": "Minimalist architectural staircase ascending toward a bright skylight in a modern building, clean upward perspective, 35mm",
}


def call_api(slug: str, prompt: str, preferred_model: str = "full") -> bytes:
    payload = json.dumps(
        {"slug": slug, "prompt": prompt, "preferredModel": preferred_model}
    ).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "x-ingresospasivos-token": TOKEN,
        },
    )
    with urllib.request.urlopen(req, timeout=240) as r:
        res = json.loads(r.read().decode("utf-8"))
    if not res.get("ok"):
        raise RuntimeError(res.get("error") or "Unknown API error")
    with urllib.request.urlopen(res["url"] + f"?v={int(time.time())}", timeout=120) as r:
        return r.read()


def save_variants(slug: str, raw_bytes: bytes, outdir: pathlib.Path) -> dict:
    outdir.mkdir(parents=True, exist_ok=True)
    im = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    w, h = im.size
    target = 16 / 9
    if w / h > target:
        nw = int(h * target)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))

    sizes = {"": 1200, "-800": 800, "-400": 400}
    # Estricto < 100 KB: tope de 68 KB para 1200x675
    limits = {"": 68_000, "-800": 40_000, "-400": 16_000}
    out = {}
    for suf, width in sizes.items():
        resized = im.resize((width, round(width * 9 / 16)), Image.Resampling.LANCZOS)
        q = 78
        while True:
            buf = io.BytesIO()
            resized.save(buf, "WEBP", quality=q, method=6)
            if buf.tell() <= limits[suf] or q <= 38:
                break
            q -= 5
        dst = outdir / f"{slug}{suf}.webp"
        dst.write_bytes(buf.getvalue())
        out[suf] = buf.tell()
    return out


def job(slug: str, prompt: str, outdir: pathlib.Path, preferred_model: str = "full"):
    final = outdir / f"{slug}.webp"
    if final.exists() and final.stat().st_size < 100_000:
        return slug, f"skip ({final.stat().st_size // 1024}KB)"
    rawp = RAW / f"{slug}.webp"
    if rawp.exists():
        b = rawp.read_bytes()
    else:
        last_err = None
        for attempt in range(4):
            try:
                b = call_api(slug, prompt, preferred_model)
                break
            except Exception as e:
                last_err = e
                time.sleep(2.5 * (attempt + 1))
        else:
            return slug, f"ERROR {last_err}"
        rawp.write_bytes(b)
    sizes = save_variants(slug, b, outdir)
    return slug, f"ok {sizes[''] // 1024}KB"


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "home"
    tasks = []
    if mode == "home":
        for idx, (s, p) in enumerate(HOME_PROMPTS.items()):
            # Usamos gpt-image-1 en Home y Hubs principales, y mini/full intercalado en escenas secundarias
            pref = "full" if idx < 26 else "mini"
            tasks.append((s, p, ROOT / "public/img/ambiente", pref))
    elif mode == "articles":
        limit = int(sys.argv[2]) if len(sys.argv) > 2 else 100
        offset = int(sys.argv[3]) if len(sys.argv) > 3 else 0
        files = sorted((ROOT / "src/content/articles").glob("*.json"))[offset : offset + limit]
        for f in files:
            a = json.loads(f.read_text())
            tasks.append((a["slug"], a["image"]["prompt"], ROOT / "public/img/articulos", "mini"))
    elif mode == "one":
        tasks.append((sys.argv[2], sys.argv[3], ROOT / "public/img/ambiente", "full"))

    print(f"Starting image generation: {len(tasks)} tasks...", flush=True)
    with cf.ThreadPoolExecutor(max_workers=6) as ex:
        for slug, status in ex.map(lambda t: job(*t), tasks):
            print(f"{slug}: {status}", flush=True)


if __name__ == "__main__":
    main()
