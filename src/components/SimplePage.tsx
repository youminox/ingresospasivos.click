import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import LegalNotice from "./LegalNotice";
import ClientEffects from "./ClientEffects";

export default function SimplePage({
  title,
  eyebrow = "Información Oficial y Legal",
  path,
  children,
}: {
  title: string;
  eyebrow?: string;
  path: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-[68px]">
        <section className="bg-gradient-to-b from-fxsky to-white py-12">
          <div className="wrap max-w-4xl">
            <Breadcrumbs items={[{ name: title, href: path }]} />
            <span className="eyebrow mt-5">{eyebrow}</span>
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-5xl">
              {title}
            </h1>
          </div>
        </section>
        <div className="wrap max-w-4xl pb-12">
          <div className="prose-fx">{children}</div>
          <LegalNotice />
        </div>
      </main>
      <Footer />
      <ClientEffects stickySource={`legal-${path}`} />
    </>
  );
}
