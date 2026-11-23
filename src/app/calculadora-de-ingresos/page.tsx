import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import IncomeCalculatorIA from "@/components/home/IncomeCalculatorIA";
import Pro1Pro2GeoSection from "@/components/home/Pro1Pro2GeoSection";
import LegalNotice from "@/components/LegalNotice";
import ClientEffects from "@/components/ClientEffects";
import { SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title:
    "Calculadora IA de Ingresos y Comisiones FuXion (Ventas, Pro 1 y Pro 2 en 34 Países)",
  description:
    "Calcula tus comisiones referenciales en FuXion por venta de productos sin stock (Dropshipping) y red de afiliados (Bono Pro 1, Pro 2 y Pro 3) en tu moneda local con planificador IA.",
  alternates: { canonical: `${SITE_URL}/calculadora-de-ingresos/` },
};

export default function CalculatorPage() {
  return (
    <>
      <Header />
      <main className="pt-[68px]">
        <div className="bg-gradient-to-b from-fxsky to-white pt-10">
          <div className="wrap">
            <Breadcrumbs
              items={[
                {
                  name: "Calculadora IA de Ingresos FuXion",
                  href: "/calculadora-de-ingresos/",
                },
              ]}
            />
          </div>
        </div>
        <IncomeCalculatorIA />
        <Pro1Pro2GeoSection />
        <div className="wrap pb-12">
          <LegalNotice />
        </div>
      </main>
      <Footer />
      <ClientEffects stickySource="calculator-page-sticky" />
    </>
  );
}
