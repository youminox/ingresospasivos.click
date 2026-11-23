"use client";

export default function OpenChatButton({
  label = "Consultar al Asesor IA",
  prompt,
  className = "btn btn-buy",
}: {
  label?: string;
  prompt?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("open-ip-chat", { detail: { prompt } })
        )
      }
    >
      {label}
    </button>
  );
}
