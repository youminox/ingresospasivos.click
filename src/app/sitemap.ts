import type { MetadataRoute } from "next";
import { SITE_URL, absolute, getAllContent } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-23");
  const content = getAllContent().map((a) => ({
    url: `${SITE_URL}${a.path}`,
    lastModified: new Date(a.dateModified),
    changeFrequency: (a.isPillar ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: a.isPillar ? 0.9 : a.isTransactional ? 0.85 : 0.75,
    images: a.imageUrl ? [absolute(a.imageUrl)] : undefined,
  }));

  const fixed = [
    { path: "/", p: 1.0, f: "weekly" as const },
    { path: "/calculadora-de-ingresos/", p: 0.95, f: "weekly" as const },
    { path: "/sobre-el-distribuidor/", p: 0.65, f: "yearly" as const },
    { path: "/contacto/", p: 0.6, f: "yearly" as const },
    { path: "/descargo-de-ingresos/", p: 0.5, f: "yearly" as const },
    { path: "/politica-editorial/", p: 0.45, f: "yearly" as const },
    { path: "/aviso-legal/", p: 0.35, f: "yearly" as const },
    { path: "/politica-de-privacidad/", p: 0.35, f: "yearly" as const },
    { path: "/politica-de-cookies/", p: 0.35, f: "yearly" as const },
  ].map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.f,
    priority: r.p,
  }));

  return [...fixed, ...content];
}
