import Link from "next/link";
import { Fragment, type ReactNode } from "react";

export function slugify(t: string): string {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function stripMd(t: string): string {
  return t
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

export default function Inline({ text }: { text: string }) {
  const tokens = text.split(
    /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*[^*]+\*)/g
  );
  return (
    <>
      {tokens.map((tok, i): ReactNode => {
        if (!tok) return null;
        if (tok.startsWith("**") && tok.endsWith("**")) {
          return <strong key={i}>{tok.slice(2, -2)}</strong>;
        }
        if (tok.startsWith("`") && tok.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-fxsky px-1.5 py-0.5 font-mono text-[0.9em] text-fxbluedeep"
            >
              {tok.slice(1, -1)}
            </code>
          );
        }
        if (tok.startsWith("*") && tok.endsWith("*")) {
          return <em key={i}>{tok.slice(1, -1)}</em>;
        }
        const m = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m) {
          const [, label, href] = m;
          if (href.startsWith("/")) {
            return (
              <Link key={i} href={href}>
                {label}
              </Link>
            );
          }
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {label}
            </a>
          );
        }
        return <Fragment key={i}>{tok}</Fragment>;
      })}
    </>
  );
}
