import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="wrap py-32 text-center">
        <span className="eyebrow">Página no encontrada · 404</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
          Esta guía se ha movido o no existe
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[var(--muted)]">
          Explora nuestras 2,535 guías sobre Dropshipping sin stock, productos y
          afiliación FuXion o simula tus metas en la Calculadora IA.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-buy">
            Volver al Inicio
          </Link>
          <Link href="/calculadora-de-ingresos/" className="btn btn-ghost">
            Ir a la Calculadora IA
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
