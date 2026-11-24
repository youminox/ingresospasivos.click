"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { CHAT_ENDPOINT, trackSiteClick } from "@/lib/client-constants";
import { useGeo } from "@/lib/countries";

interface ChatProductCard {
  slug: string;
  name: string;
  category: string;
  pointsPv: number;
  sticks: string;
  image: string;
  shopUrl: string;
  articleUrl: string;
  shortDesc: string;
}

interface ChatArticleCard {
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  url: string;
  readTime: string;
  excerpt: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedProducts?: ChatProductCard[];
  recommendedArticles?: ChatArticleCard[];
  suggestedOptions?: string[];
  showEnrollmentCta?: boolean;
}

const STORAGE_VISITOR = "ip_chat_visitor_v1";
const STORAGE_SESSION = "ip_chat_session_v1";
const STORAGE_MSGS = "ip_chat_messages_v1";

const QUICK_OPTIONS = [
  "📦 ¿Cómo funciona el Dropshipping sin comprar stock?",
  "🏆 ¿Cómo logro el Bono Pro 1 y Pro 2 en mi moneda?",
  "🥤 ¿Qué productos FuXion se venden más rápido?",
  "🤝 ¿Cómo me ayuda el equipo de Charlie Lingan?",
  "🚀 Quiero el link para registrarme en FuXion",
];

export default function ChatWidget() {
  const { country, enrollmentUrl } = useGeo();
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showTeaser, setShowTeaser] = useState(true);
  const [visitorId, setVisitorId] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "¡Hola! 👋 Soy el Asesor IA de IngresosPasivos.click (modelo mini rápido). Te explico cómo generar ingresos referenciales con FuXion por Dropshipping sin stock o Red de Afiliados (Pro 1 y Pro 2), y busco productos o guías para ti. Cualquier consulta directa puedes escribir al distribuidor oficial Charlie Lingan en info@charlielingan.com."
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [compactMobile, setCompactMobile] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const persist = useCallback(
    (nextMsgs: ChatMessage[], nextSess?: string | null) => {
      setMessages(nextMsgs);
      try {
        localStorage.setItem(
          STORAGE_MSGS,
          JSON.stringify(nextMsgs.slice(-20))
        );
        if (nextSess) localStorage.setItem(STORAGE_SESSION, nextSess);
      } catch {
        // ignore
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: "u-" + Date.now(),
        role: "user",
        content: trimmed,
      };
      const optimistic = [...messages, userMsg];
      persist(optimistic, sessionId);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "chat",
            message: trimmed,
            visitor_id: visitorId || "anon",
            session_id: sessionId,
            country_code: country.code,
            currency_code: country.currency,
            page_url:
              typeof window !== "undefined"
                ? window.location.href
                : "https://ingresospasivos.click/",
            history: optimistic.slice(-8).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });
        const data = await res.json();
        if (data?.session_id && data.session_id !== sessionId) {
          setSessionId(data.session_id);
        }
        const assistantMsg: ChatMessage = {
          id: "a-" + Date.now(),
          role: "assistant",
          content:
            data?.reply ||
            "Cualquier consulta personalizada puedes escribir al distribuidor oficial Charlie Lingan al email info@charlielingan.com.",
          recommendedProducts: data?.recommended_products || [],
          recommendedArticles: data?.recommended_articles || [],
          suggestedOptions: data?.suggested_options || [],
          showEnrollmentCta: data?.show_enrollment_cta !== false,
        };
        persist([...optimistic, assistantMsg], data?.session_id || sessionId);
      } catch {
        const fallbackMsg: ChatMessage = {
          id: "e-" + Date.now(),
          role: "assistant",
          content:
            "En este momento hubo un corte de conexión. Para cualquier consulta escríbele directo al distribuidor oficial Charlie Lingan en info@charlielingan.com.",
          showEnrollmentCta: true,
        };
        persist([...optimistic, fallbackMsg], sessionId);
      } finally {
        setIsLoading(false);
      }
    },
    [country.code, country.currency, isLoading, messages, persist, sessionId, visitorId]
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        let vid = localStorage.getItem(STORAGE_VISITOR);
        if (!vid) {
          vid =
            "ip-" +
            Math.random().toString(36).slice(2, 10) +
            "-" +
            Date.now().toString(36);
          localStorage.setItem(STORAGE_VISITOR, vid);
        }
        setVisitorId(vid);
        const savedSess = localStorage.getItem(STORAGE_SESSION);
        if (savedSess) setSessionId(savedSess);
        const savedMsgs = localStorage.getItem(STORAGE_MSGS);
        if (savedMsgs) {
          const parsed = JSON.parse(savedMsgs);
          if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
        }
      } catch {
        // ignore storage errors
      }
    });

    fetch(CHAT_ENDPOINT, { method: "GET" })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.is_enabled === "boolean") setIsEnabled(d.is_enabled);
        if (d?.welcome_message) setWelcomeMessage(d.welcome_message);
      })
      .catch(() => {});

    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const handler = (ev: Event) => {
      const custom = ev as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      setShowTeaser(false);
      if (custom.detail?.prompt) {
        setTimeout(() => {
          sendMessage(custom.detail!.prompt!);
        }, 120);
      }
    };
    window.addEventListener("open-ip-chat", handler);
    return () => window.removeEventListener("open-ip-chat", handler);
  }, [sendMessage]);

  useEffect(() => {
    const onScroll = () => setCompactMobile(window.scrollY > 550);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(
        () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
        60
      );
    }
  }, [messages, isOpen, isLoading]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isEnabled) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 md:bottom-5 md:right-6 ${
        compactMobile && !isOpen ? "bottom-[82px] right-3.5" : "bottom-5 right-4"
      }`}
    >
      {!isOpen && showTeaser && (
        <div className="mb-3 hidden max-w-[285px] rounded-2xl border border-[var(--line)] bg-white p-3.5 text-xs shadow-2xl sm:block">
          <div className="flex items-start justify-between gap-2">
            <p className="font-display font-extrabold text-fxink">
              💬 Asesor FuXion IA ({country.flag} {country.currency})
            </p>
            <button
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => setShowTeaser(false)}
              className="text-[var(--muted)] hover:text-fxink"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-[var(--muted)]">
            ¿Dudas sobre Dropshipping sin stock, Pro 1 / Pro 2 o qué producto
            vender? Pregúntame aquí.
          </p>
        </div>
      )}

      {!isOpen ? (
        <button
          type="button"
          aria-label="Abrir Chat Asesor IA"
          onClick={() => {
            setIsOpen(true);
            setShowTeaser(false);
          }}
          className={`flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#062a44] via-fxblue to-[#007cbc] font-display text-sm font-extrabold text-white shadow-[0_18px_38px_-12px_rgba(0,147,221,0.85)] transition-all hover:scale-[1.03] md:h-auto md:w-auto md:px-5 md:py-3.5 ${
            compactMobile ? "h-12 w-12 p-0" : "px-4 py-3 sm:px-5 sm:py-3.5"
          }`}
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fxlime opacity-80" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-fxlime" />
          </span>
          <span className={compactMobile ? "hidden md:inline" : "inline"}>
            Chat Asesor IA
          </span>
          {compactMobile && (
            <span className="text-base leading-none md:hidden" aria-hidden>
              💬
            </span>
          )}
        </button>
      ) : (
        <div className="flex h-[min(80svh,630px)] w-[min(92vw,410px)] flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[0_30px_70px_-20px_rgba(7,19,29,0.65)]">
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#07131d] via-[#0a314d] to-fxbluedeep px-4 py-3.5 text-white">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-fxlime" />
                <p className="truncate font-display text-sm font-extrabold">
                  Asesor IA — IngresosPasivos.click
                </p>
              </div>
              <p className="truncate text-[11px] text-white/75">
                Distribuidor oficial: Charlie Lingan · info@charlielingan.com
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Minimizar chat"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-sm font-bold text-white hover:bg-white/25"
            >
              ✕
            </button>
          </div>

          <div
            data-lenis-prevent
            className="flex-1 space-y-3.5 overflow-y-auto bg-slate-50/70 p-4 text-sm"
          >
            <div className="rounded-2xl rounded-tl-sm border border-[var(--line)] bg-white p-3.5 text-[13px] leading-relaxed text-fxink shadow-sm">
              <p>{welcomeMessage}</p>
              <div className="mt-2.5 rounded-xl bg-fxsky/80 px-3 py-2 text-[11px] text-[var(--muted)]">
                📩 Contacto directo: <strong>Charlie Lingan</strong> ·{" "}
                <a
                  href="mailto:info@charlielingan.com"
                  className="font-bold text-fxbluedeep underline"
                >
                  info@charlielingan.com
                </a>
              </div>
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-1.5">
                {QUICK_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => sendMessage(opt)}
                    className="rounded-full border border-fxblue/30 bg-white px-3 py-1.5 text-left text-xs font-semibold text-fxbluedeep transition hover:bg-fxblue hover:text-white"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-[13px] leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "rounded-tr-sm bg-fxblue text-white"
                      : "rounded-tl-sm border border-[var(--line)] bg-white text-fxink"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>

                {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                  <div className="mt-2 grid w-full gap-2">
                    {m.recommendedProducts.map((p) => (
                      <div
                        key={p.slug}
                        className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-2.5 shadow-sm"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-fxsky">
                          <Image
                            src={p.image.replace(
                              "https://ingresospasivos.click",
                              ""
                            )}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-xs font-extrabold text-fxink">
                            {p.name} ·{" "}
                            <span className="text-fxbluedeep">
                              {p.pointsPv} PV
                            </span>
                          </p>
                          <p className="line-clamp-1 text-[11px] text-[var(--muted)]">
                            {p.shortDesc}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[11px] font-bold">
                            <Link
                              href={p.articleUrl.replace(
                                "https://ingresospasivos.click",
                                ""
                              )}
                              onClick={() => setIsOpen(false)}
                              className="text-fxbluedeep underline"
                            >
                              Cómo venderlo
                            </Link>
                            <span>·</span>
                            <a
                              href={p.shopUrl}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              onClick={() =>
                                trackSiteClick({
                                  targetUrl: p.shopUrl,
                                  source: "chat-product",
                                  clickType: "product",
                                  productSlug: p.slug,
                                  productName: p.name,
                                  countryCode: country.code,
                                })
                              }
                              className="text-emerald-700 underline"
                            >
                              Tienda ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {m.recommendedArticles && m.recommendedArticles.length > 0 && (
                  <div className="mt-2 grid w-full gap-1.5">
                    {m.recommendedArticles.map((art) => (
                      <Link
                        key={art.slug}
                        href={art.url.replace(
                          "https://ingresospasivos.click",
                          ""
                        )}
                        onClick={() => setIsOpen(false)}
                        className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-xs hover:border-fxblue"
                      >
                        <span className="block text-[10px] font-bold uppercase text-fxbluedeep">
                          {art.categoryName}
                        </span>
                        <span className="font-bold text-fxink">
                          {art.title} →
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {m.role === "assistant" && m.showEnrollmentCta && (
                  <a
                    href={enrollmentUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() =>
                      trackSiteClick({
                        targetUrl: enrollmentUrl,
                        source: "chat-enroll-cta",
                        clickType: "enrollment",
                        countryCode: country.code,
                      })
                    }
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-fxlime px-3.5 py-1.5 font-display text-xs font-extrabold text-[#1b2d04] shadow"
                  >
                    🚀 Registrarme aquí en FuXion →
                  </a>
                )}

                {m.suggestedOptions && m.suggestedOptions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.suggestedOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => sendMessage(opt)}
                        className="rounded-full border border-fxblue/25 bg-white px-2.5 py-1 text-[11px] font-semibold text-fxbluedeep hover:bg-fxsky"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-white px-3.5 py-2 text-xs text-[var(--muted)]">
                <span className="h-2 w-2 animate-ping rounded-full bg-fxblue" />
                Analizando catálogo y guías...
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={onSubmit}
            className="border-t border-[var(--line)] bg-white p-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu duda sobre FuXion, Pro 1 o productos..."
                className="flex-1 rounded-full border border-[var(--line)] bg-slate-50 px-3.5 py-2 text-xs text-fxink focus:border-fxblue focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-fxblue px-4 py-2 font-display text-xs font-extrabold text-white disabled:opacity-45"
              >
                Enviar
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-[var(--muted)]">
              Importes referenciales · Charlie Lingan:{" "}
              <a
                href="mailto:info@charlielingan.com"
                className="font-semibold underline"
              >
                info@charlielingan.com
              </a>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
