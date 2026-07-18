import { site } from "@/lib/content";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jinja",
      addressCountry: "UG",
    },
    url: "https://www.jackfruitsafaris.org/",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
