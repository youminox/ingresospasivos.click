#!/usr/bin/env python3
"""Sincroniza los 2,535 artículos de ingresospasivos.click en public.ingresospasivos_articles vía ingresospasivos-chat."""
import json
import pathlib
import time
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENDPOINT = "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/ingresospasivos-chat"
SYNC_KEY = "ingresospasivos-sync-2026"


def main():
    cats = {
        c["slug"]: c["name"]
        for c in json.loads((ROOT / "src/data/categories.json").read_text())
    }
    rows = []
    for f in sorted((ROOT / "src/content/articles").glob("*.json")):
        a = json.loads(f.read_text())
        img = (
            f"/img/productos-fuxion/{a['productSlug']}-bodegon.webp"
            if a.get("productSlug")
            and (ROOT / f"public/img/productos-fuxion/{a['productSlug']}-bodegon.webp").exists()
            else f"/img/ambiente/cat-{a['pillar']}.webp"
        )
        rows.append(
            {
                "slug": a["slug"],
                "title": a["title"],
                "category": a["pillar"],
                "category_name": cats.get(a["pillar"], a["pillar"]),
                "is_transactional": bool(a.get("isTransactional")),
                "excerpt": a.get("excerpt") or a.get("metaDescription") or "",
                "featured_image": img,
                "read_time": f"{a.get('readingMinutes', 7)} min",
                "search_text": f"{a['title']} {a['primaryKeyword']} {a.get('excerpt', '')}".lower(),
                "active": True,
            }
        )

    total = 0
    batch_size = 120
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        data = json.dumps({"mode": "seed_articles", "articles": batch}).encode("utf-8")
        for attempt in range(4):
            try:
                req = urllib.request.Request(
                    ENDPOINT,
                    data=data,
                    headers={
                        "Content-Type": "application/json",
                        "x-sync-key": SYNC_KEY,
                    },
                )
                with urllib.request.urlopen(req, timeout=60) as r:
                    res = json.loads(r.read().decode("utf-8"))
                    total += res.get("count", 0)
                    print(f"Batch {i // batch_size + 1}: synced {res.get('count', 0)}", flush=True)
                    break
            except Exception as e:
                if attempt == 3:
                    raise e
                time.sleep(1.5)
    print(f"OK: Sincronizados {total} artículos en Supabase public.ingresospasivos_articles.")


if __name__ == "__main__":
    main()
