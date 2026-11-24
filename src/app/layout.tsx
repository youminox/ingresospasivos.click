import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { GeoProvider } from "@/lib/countries";
import SmoothScroll from "@/components/SmoothScroll";
import ChatWidget from "@/components/ChatWidget";
import { JsonLd } from "@/components/Breadcrumbs";
import {
  OG_DEFAULT,
  SITE_NAME,
  SITE_URL,
  absolute,
  organizationLd,
  personLd,
} from "@/lib/content";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Ingresos con FuXion: Dropshipping sin Stock, Bono Pro 1, Pro 2 y Calculadora IA",
    template: "%s | IngresosPasivos.click",
  },
  description:
    "Aprende las 2 formas de generar ingresos referenciales con productos FuXion: venta por Dropshipping sin comprar stock (20%–50% + Bono Pro 1) y Red de Afiliados (Pro 2) en 34 países con Calculadora IA.",
  openGraph: {
    siteName: SITE_NAME,
    locale: "es_PE",
    type: "website",
    images: [{ url: absolute(OG_DEFAULT()), width: 1200, height: 675 }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: [
      "google07464c8c60a81e7a",
      "172C7_Myoxhj0Y7awkbiE22513T05NSfBYUdmPFvxgY",
    ],
  },
  other: {
    "google-adsense-account": "ca-pub-1070738569472471",
  },
};

export const viewport: Viewport = {
  themeColor: "#0093DD",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1070738569472471"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              organizationLd,
              personLd,
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: `${SITE_URL}/`,
                name: SITE_NAME,
                inLanguage: "es",
                publisher: { "@id": `${SITE_URL}/#org` },
              },
            ],
          }}
        />
        <GeoProvider>
          <SmoothScroll />
          {children}
          <ChatWidget />
        </GeoProvider>
      </body>
    </html>
  );
}
