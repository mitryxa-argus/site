'use client';

interface JsonLdProps {
  data: Record<string, unknown>;
}

const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mitryxa",
  legalName: "Mitryxa Labs LLC",
  url: "https://mitryxa.com",
  description: "Mitryxa builds AI-powered decision platforms that guide customers, qualify leads, and help professional businesses convert more high-value clients.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    url: "https://mitryxa.com/contact",
    contactType: "customer service",
  },
};

export default JsonLd;
