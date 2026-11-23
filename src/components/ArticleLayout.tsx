import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs, { JsonLd } from "./Breadcrumbs";
import ArticleBody from "./ArticleBody";
import ArticleCard from "./ArticleCard";
import OpportunityBox from "./OpportunityBox";
import LegalNotice from "./LegalNotice";
import ClientEffects from "./ClientEffects";
import ReadingProgress from "./ReadingProgress";
import OpenChatButton from "./OpenChatButton";
import { slugify, stripMd } from "./Inline";
import type { Article, Block } from "@/lib/content";
import {
  SITE_URL,
  OG_DEFAULT,
  LEGAL_OWNER,
  absolute,
  getArticlesIn,
  getByPath,
  getCategory,
  getFuxionProduct,
} from "@/lib/content";

const fmt = (d: string) =>
  new Date(d + "T12:00:00").toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function ArticleLayout({ a }: { a: Article }) {
  const cat = getCategory(a.pillar)!;
  const url = `${SITE_URL}${a.path}`;
  const h2s = a.blocks.filter((b) => b.type === "h2") as {
    type: "h2";
    text: string;
  }[];
  const steps = a.blocks.find((b) => b.type === "steps") as
    | { type: "steps"; items: { name: string; text: string }[] }
    | undefined;
  const related = a.related
    .map((p) => getByPath(p))
    .filter(Boolean) as Article[];
  const children = a.isPillar ? getArticlesIn(a.pillar) : [];
  const product = getFuxionProduct(a.productSlug);

  const crumbs = a.isPillar
    ? [{ name: cat.name, href: `/${cat.slug}/` }]
    : [
        { name: cat.name, href: `/${cat.slug}/` },
        { name: a.title, href: a.path },
      ];
  const image = a.imageUrl ? absolute(a.imageUrl) : absolute(OG_DEFAULT());

  const h2Indices = a.blocks
    .map((b, idx) => (b.type === "h2" ? idx : -1))
    .filter((idx) => idx >= 0);
  const splitIndex =
    h2Indices.length >= 2 ? h2Indices[1] : Math.ceil(a.blocks.length / 2);
  const firstHalfBlocks: Block[] = a.blocks.slice(0, splitIndex);
  const secondHalfBlocks: Block[] = a.blocks.slice(splitIndex);

  const graph: Record<string, unknown>[] = [
    {
      "@type": a.isPillar ? "CollectionPage" : "Article",
      "@id": `${url}#article`,
      ...(a.isPillar ? { name: a.title } : { headline: a.title }),
      description: a.metaDescription,
      image,
      inLanguage: "es",
      datePublished: a.datePublished,
      dateModified: a.dateModified,
      author: { "@id": `${SITE_URL}/#carlos` },
      publisher: { "@id": `${SITE_URL}/#org` },
      mainEntityOfPage: url,
    },
  ];

  if (a.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: a.faqs.map((f) => ({
        "@type": "Question",
        name: stripMd(f.q),
        acceptedAnswer: { "@type": "Answer", text: stripMd(f.a) },
      })),
    });
  }
  if (steps) {
    graph.push({
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: a.title,
      image,
      step: steps.items.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: stripMd(s.text),
      })),
    });
  }

  return (
    <>
      <ReadingProgress />
      <Header />
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
      <main className="pt-[68px]">
        <section className="relative overflow-hidden bg-gradient-to-b from-fxsky via-white to-white">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-fxblue/12 blur-3xl" />
          <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-fxlime/15 blur-3xl" />
          <div className="wrap relative pb-10 pt-10">
            <Breadcrumbs items={crumbs} />
            <div
              className={`mt-6 grid items-center gap-10 ${
                a.imageUrl ? "lg:grid-cols-[1.15fr_1fr]" : ""
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/${cat.slug}/`}
                    className="eyebrow hover:underline"
                  >
                    {a.isPillar ? "Hub Central de Categoría" : cat.name}
                  </Link>
                  {a.isTransactional && (
                    <span className="rounded-full bg-[#07131d] px-2.5 py-0.5 text-[11px] font-extrabold text-fxlime">
                      💼 Guía Comercial FuXion
                    </span>
                  )}
                </div>
                <h1 className="mt-3 text-[2rem] font-extrabold leading-[1.07] sm:text-5xl">
                  {a.title}
                </h1>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
                  <span>
                    Por{" "}
                    <Link
                      href="/sobre-el-distribuidor/"
                      className="font-semibold text-fxink hover:text-fxblue"
                    >
                      {LEGAL_OWNER}
                    </Link>
                  </span>
                  <span aria-hidden>·</span>
                  <time dateTime={a.dateModified}>
                    Verificado el {fmt(a.dateModified)}
                  </time>
                  <span aria-hidden>·</span>
                  <span>{a.readingMinutes || 7} min de lectura</span>
                </div>
                <div className="mt-6 rounded-2xl border-l-4 border-fxlime bg-white p-5 shadow-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-fxbluedeep">
                    Respuesta Rápida (Enfoque Realista y Referencial)
                  </p>
                  <p className="mt-1.5 text-[1.01rem] leading-relaxed text-fxink">
                    {stripMd(a.quickAnswer)}
                  </p>
                </div>
              </div>

              {a.imageUrl && (
                <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-2xl">
                  <Image
                    src={a.imageUrl}
                    alt={a.image.alt}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className={
                      a.imageUrl.includes("/productos-fuxion/")
                        ? "object-contain p-4"
                        : "object-cover"
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="wrap grid grid-cols-1 gap-12 pb-10 lg:grid-cols-[minmax(0,1fr)_310px]">
          <article className="min-w-0">
            {a.isTransactional && (
              <OpportunityBox
                source={a.slug}
                product={product}
                variant="top"
              />
            )}

            <ArticleBody blocks={firstHalfBlocks} source={a.slug} />

            {!a.isTransactional && (
              <OpportunityBox
                source={a.slug}
                product={product}
                variant="inline"
              />
            )}

            {secondHalfBlocks.length > 0 && (
              <ArticleBody blocks={secondHalfBlocks} source={`${a.slug}-b`} />
            )}

            {a.isPillar && children.length > 0 && (
              <section className="mt-14">
                <h2
                  className="font-display text-3xl font-extrabold"
                  id="todas-las-guias"
                >
                  Todas las guías de {cat.name} ({children.length})
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {children.map((c) => (
                    <ArticleCard key={c.path} a={c} />
                  ))}
                </div>
              </section>
            )}

            {a.faqs?.length > 0 && (
              <section className="mt-14" aria-labelledby="faq">
                <h2 id="faq" className="font-display text-3xl font-extrabold">
                  Preguntas frecuentes
                </h2>
                <div className="mt-5 space-y-3">
                  {a.faqs.map((f) => (
                    <details key={f.q} className="card group p-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold">
                        {stripMd(f.q)}
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fxsky text-fxblue transition group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-[var(--muted)]">{stripMd(f.a)}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {a.sources && a.sources.length > 0 && (
              <section className="mt-12 rounded-2xl border border-[var(--line)] bg-slate-50/70 p-5">
                <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-fxink">
                  Fuentes y referencias de consulta
                </h3>
                <ul className="mt-2.5 space-y-1.5 text-xs text-[var(--muted)]">
                  {a.sources.map((s) => (
                    <li key={s.url}>
                      •{" "}
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-fxbluedeep underline"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {related.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-2xl font-extrabold">
                  Guías relacionadas recomendadas
                </h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {related.map((r) => (
                    <ArticleCard key={r.path} a={r} />
                  ))}
                </div>
              </section>
            )}

            <LegalNotice />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-[88px] lg:self-start">
            <OpportunityBox source={a.slug} variant="sidebar" />
            {h2s.length > 1 && (
              <div className="toc hidden rounded-2xl border border-[var(--line)] bg-white p-5 text-sm lg:block">
                <p className="font-display text-xs font-extrabold uppercase tracking-wider text-fxink">
                  En esta guía
                </p>
                <ol className="mt-3 space-y-2 text-xs leading-snug">
                  {h2s.map((h) => (
                    <li key={h.text}>
                      <a href={`#${slugify(h.text)}`}>{stripMd(h.text)}</a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className="rounded-2xl border border-[var(--line)] bg-fxsky/60 p-5 text-xs">
              <p className="font-display text-sm font-extrabold text-fxink">
                ¿Tienes una consulta específica?
              </p>
              <p className="mt-1.5 text-[var(--muted)]">
                Nuestro Asesor IA responde al instante o escríbele directo al
                distribuidor oficial Charlie Lingan en{" "}
                <strong>info@charlielingan.com</strong>.
              </p>
              <OpenChatButton
                label="Abrir Chat Online IA"
                prompt={`Hola, acabo de leer "${a.title}" y quisiera saber cómo empezar.`}
                className="btn btn-buy mt-3 w-full !py-2.5 text-xs"
              />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <ClientEffects stickySource={`sticky-${a.slug}`} />
    </>
  );
}
