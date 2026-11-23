import Link from "next/link";
import EnrollLink from "./EnrollLink";
import OpenChatButton from "./OpenChatButton";
import Inline, { slugify } from "./Inline";
import type { Block } from "@/lib/content";

const CALLOUT_STYLES = {
  etiqueta: "border-fxblue/40 bg-fxsky/80 text-fxink",
  fabricante: "border-emerald-400/50 bg-emerald-50/80 text-fxink",
  tip: "border-fxlime/60 bg-[#f6fde8] text-fxink",
  aviso: "border-amber-400/60 bg-amber-50/80 text-fxink",
};

export default function ArticleBody({
  blocks,
  source,
}: {
  blocks: Block[];
  source: string;
}) {
  return (
    <div className="prose-fx">
      {blocks.map((b, idx) => {
        if (b.type === "p") {
          return (
            <p key={idx}>
              <Inline text={b.text} />
            </p>
          );
        }
        if (b.type === "h2") {
          return (
            <h2 key={idx} id={slugify(b.text)}>
              <Inline text={b.text} />
            </h2>
          );
        }
        if (b.type === "h3") {
          return (
            <h3 key={idx} id={slugify(b.text)}>
              <Inline text={b.text} />
            </h3>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={idx}>
              {b.items.map((it, j) => (
                <li key={j}>
                  <Inline text={it} />
                </li>
              ))}
            </ul>
          );
        }
        if (b.type === "ol") {
          return (
            <ol key={idx}>
              {b.items.map((it, j) => (
                <li key={j}>
                  <Inline text={it} />
                </li>
              ))}
            </ol>
          );
        }
        if (b.type === "steps") {
          return (
            <div key={idx} className="my-6 grid gap-3.5">
              {b.items.map((st, j) => (
                <div
                  key={j}
                  className="flex items-start gap-4 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-fxblue to-fxlime font-display text-sm font-extrabold text-white">
                    {j + 1}
                  </span>
                  <div>
                    <p className="!mb-1 font-display text-base font-extrabold text-fxink">
                      {st.name}
                    </p>
                    <p className="!mb-0 text-sm text-[var(--muted)]">
                      <Inline text={st.text} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          );
        }
        if (b.type === "table") {
          return (
            <div
              key={idx}
              className="my-6 overflow-x-auto rounded-2xl border border-[var(--line)] bg-white shadow-sm"
            >
              <table>
                {b.caption && (
                  <caption className="border-b border-[var(--line)] bg-slate-50 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    {b.caption}
                  </caption>
                )}
                <thead>
                  <tr>
                    {b.headers.map((h, j) => (
                      <th key={j}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((r, rIdx) => (
                    <tr key={rIdx}>
                      {r.map((cell, cIdx) => (
                        <td key={cIdx}>
                          <Inline text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (b.type === "callout") {
          return (
            <aside
              key={idx}
              className={`my-6 rounded-2xl border-l-4 p-5 ${
                CALLOUT_STYLES[b.variant] || CALLOUT_STYLES.etiqueta
              }`}
            >
              {b.title && (
                <p className="!mb-1 font-display text-sm font-extrabold uppercase tracking-wide">
                  {b.title}
                </p>
              )}
              <p className="!mb-0 text-sm leading-relaxed">
                <Inline text={b.text} />
              </p>
            </aside>
          );
        }
        if (b.type === "cta") {
          return (
            <div
              key={idx}
              className="my-8 rounded-3xl bg-gradient-to-br from-[#062a44] via-[#07131d] to-[#0a3c5f] p-6 text-white shadow-xl"
            >
              <p className="!mb-4 font-display text-lg font-bold leading-snug text-white">
                {b.text}
              </p>
              <div className="flex flex-wrap gap-3">
                <EnrollLink
                  source={`cta-${source}`}
                  className="btn btn-lime shine !px-5 !py-2.5 text-sm"
                >
                  Registrarme en FuXion Aquí →
                </EnrollLink>
                <Link
                  href="/calculadora-de-ingresos/"
                  className="btn btn-glass !px-5 !py-2.5 text-sm"
                >
                  🧮 Calcular mis Ingresos
                </Link>
                <OpenChatButton
                  label="💬 Preguntar en el Chat IA"
                  className="btn btn-glass !px-5 !py-2.5 text-sm"
                />
              </div>
              <p className="!mb-0 mt-3 text-[11px] text-white/65">
                *Cálculos y comisiones referenciales sujetos a variación por
                país y volumen PV. Soporte directo: info@charlielingan.com
              </p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
