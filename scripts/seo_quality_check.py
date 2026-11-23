#!/usr/bin/env python3
"""
Auditoría integral de Calidad SEO, Anti-Canibalización e Imágenes (< 100 KB + Diversidad Visual dHash)
para ingresospasivos.click.
"""
import json
import pathlib
import sys
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "src/content/articles"
IMG_AMB = ROOT / "public/img/ambiente"
IMG_ART = ROOT / "public/img/articulos"


def dhash(im_path: pathlib.Path, hash_size: int = 8) -> int:
    with Image.open(im_path) as im:
        gray = im.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
        pixels = list(gray.getdata())
        diff = []
        for row in range(hash_size):
            for col in range(hash_size):
                left = pixels[row * (hash_size + 1) + col]
                right = pixels[row * (hash_size + 1) + col + 1]
                diff.append(left > right)
        val = 0
        for b in diff:
            val = (val << 1) | int(b)
        return val


def main():
    files = sorted(ART_DIR.glob("*.json"))
    if len(files) < 2500:
        print(f"ERROR: Expected >= 2,500 articles, found {len(files)}")
        sys.exit(1)

    slugs, paths, kws, titles = set(), set(), set(), set()
    trans_count = 0
    seo_count = 0
    pillar_count = 0

    all_paths = set()
    parsed = []
    for f in files:
        a = json.loads(f.read_text())
        parsed.append(a)
        all_paths.add(a["path"])

    for a in parsed:
        assert a["slug"] not in slugs, f"Dup slug: {a['slug']}"
        assert a["path"] not in paths, f"Dup path: {a['path']}"
        kw = a["primaryKeyword"].strip().lower()
        assert kw not in kws, f"Dup keyword: {kw}"
        ttl = a["title"].strip().lower()
        assert ttl not in titles, f"Dup title: {ttl}"
        slugs.add(a["slug"])
        paths.add(a["path"])
        kws.add(kw)
        titles.add(ttl)

        if a.get("isPillar"):
            pillar_count += 1
        elif a.get("isTransactional"):
            trans_count += 1
        else:
            seo_count += 1

        for r in a.get("related", []):
            assert r in all_paths, f"Broken related path {r} in {a['slug']}"

    # Verificar tamaño < 100 KB en todas las imágenes generadas
    oversized = []
    hashes = {}
    exact_dups = []
    for folder in (IMG_AMB, IMG_ART):
        if not folder.exists():
            continue
        for img in sorted(folder.glob("*.webp")):
            sz = img.stat().st_size
            if sz > 100_000:
                oversized.append((img.name, sz))
            if not img.stem.endswith(("-800", "-400")):
                h = dhash(img)
                if h in hashes:
                    exact_dups.append((img.name, hashes[h]))
                else:
                    hashes[h] = img.name

    assert not oversized, f"Images exceeding 100 KB: {oversized}"
    print(
        f"SEO QUALITY CHECK PASSED:\n"
        f"  - Total JSON Articles: {len(parsed)} ({pillar_count} Pillars + {trans_count} Transactional + {seo_count} SEO Informational)\n"
        f"  - Zero Cannibalization: {len(kws)} unique primary keywords & {len(paths)} unique URLs\n"
        f"  - Generated Ambient/Article WebP Base Scenes Checked (<100KB): {len(hashes)} scenes, 0 oversized, {len(exact_dups)} exact perceptual collisions"
    )


if __name__ == "__main__":
    main()
