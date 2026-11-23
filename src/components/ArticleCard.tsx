import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/content";
import { getCategory } from "@/lib/content";

export default function ArticleCard({ a }: { a: Article }) {
  const cat = getCategory(a.pillar);
  return (
    <Link
      href={a.path}
      className="card spot group flex h-full flex-col overflow-hidden"
    >
      {a.imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden bg-fxsky">
          <Image
            src={a.imageUrl}
            alt={a.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {a.isTransactional && (
            <span className="absolute left-3 top-3 rounded-full bg-[#07131d]/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-fxlime backdrop-blur">
              Negocio & Comisiones
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-fxbluedeep">
          {cat?.name || a.pillar}
        </span>
        <h3 className="mt-1.5 font-display text-lg font-extrabold leading-snug text-fxink group-hover:text-fxblue">
          {a.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">
          {a.excerpt}
        </p>
        <span className="mt-auto pt-4 text-xs font-bold text-fxbluedeep">
          Leer guía ({a.readingMinutes || 7} min) →
        </span>
      </div>
    </Link>
  );
}
