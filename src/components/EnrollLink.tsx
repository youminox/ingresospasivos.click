"use client";

import type { ReactNode } from "react";
import { useGeo } from "@/lib/countries";
import { trackSiteClick } from "@/lib/client-constants";

export default function EnrollLink({
  source,
  children,
  className = "btn btn-lime shine",
  magnetic = false,
  mode = "enrollment",
  productSlug,
  productName,
  customUrl,
}: {
  source: string;
  children: ReactNode;
  className?: string;
  magnetic?: boolean;
  mode?: "enrollment" | "product";
  productSlug?: string;
  productName?: string;
  customUrl?: string;
}) {
  const { enrollmentUrl, shopUrl, country } = useGeo();
  const href =
    customUrl || (mode === "product" ? shopUrl : enrollmentUrl);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
      {...(magnetic ? { "data-magnetic": "" } : {})}
      onClick={() =>
        trackSiteClick({
          targetUrl: href,
          source,
          clickType: mode,
          productSlug,
          productName,
          countryCode: country.code,
        })
      }
    >
      {children}
    </a>
  );
}
