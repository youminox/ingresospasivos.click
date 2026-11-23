import Link from "next/link";
import { SITE_URL } from "@/lib/content";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Breadcrumbs({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const full = [{ name: "Inicio", href: "/" }, ...items];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: full.map((it, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: it.name,
            item: `${SITE_URL}${it.href}`,
          })),
        }}
      />
      <nav aria-label="Ruta de navegación" className="text-xs text-[var(--muted)]">
        <ol className="flex flex-wrap items-center gap-1.5">
          {full.map((it, i) => (
            <li key={it.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {i === full.length - 1 ? (
                <span className="font-semibold text-fxink line-clamp-1 max-w-[260px] sm:max-w-md">
                  {it.name}
                </span>
              ) : (
                <Link href={it.href} className="hover:text-fxblue hover:underline">
                  {it.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
