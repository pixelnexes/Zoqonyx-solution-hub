import { AREAS_SERVED, PARENT_LD } from "@/lib/company";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Contact Zoqonyx: Quotes, Support and Tool Requests",
  },
  description:
    "Contact Zoqonyx: ask for a project quote, request a free tool, send feedback or report a problem. We reply by email.",
  alternates: {
    canonical: "https://zoqonyx.com/contact",
  },
};

const contactLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://zoqonyx.com/contact#page",
      url: "https://zoqonyx.com/contact",
      name: "Contact Zoqonyx",
      about: { "@id": "https://zoqonyx.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://zoqonyx.com/#organization",
      name: "Zoqonyx",
      url: "https://zoqonyx.com",
      logo: "https://zoqonyx.com/logo/zoqonyx-logo-v2.png",
      email: "hello@zoqonyx.com",
      areaServed: AREAS_SERVED,
      parentOrganization: PARENT_LD,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://zoqonyx.com" },
        { "@type": "ListItem", position: 2, name: "Contact", item: "https://zoqonyx.com/contact" },
      ],
    },
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }} />
      {children}
    </>
  );
}
