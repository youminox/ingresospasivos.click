import type { CSSProperties } from "react";

export default function SplitHeading({
  text,
  accent,
  className = "",
  as: Tag = "h2",
}: {
  text: string;
  accent?: { text: string; className?: string };
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const words = text.split(" ");
  const accentWords = accent ? accent.text.split(" ") : [];
  return (
    <Tag className={`split ${className}`}>
      {words.map((w, i) => (
        <span key={w + i} style={{ "--i": i } as CSSProperties}>
          {w}
          {i < words.length - 1 || accentWords.length > 0 ? "\u00A0" : ""}
        </span>
      ))}
      {accentWords.map((w, j) => (
        <span
          key={"acc-" + w + j}
          className={accent?.className || ""}
          style={{ "--i": words.length + j } as CSSProperties}
        >
          {w}
          {j < accentWords.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}
