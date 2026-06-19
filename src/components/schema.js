// schema.js — JSON-LD structured data generators
// These produce plain objects that get JSON.stringify'd inside <SEO jsonLd={[...]} />.
// Reference: https://schema.org and https://developers.google.com/search/docs/appearance/structured-data

import { SITE_URL, SITE_NAME } from "../components/SEO";

/* ─── ORGANIZATION (use on every page, ideally once site-wide) ───────────── */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Kayvion",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description:
      "ICT services company delivering software engineering, AI & machine learning, cloud architecture, and data analytics for organisations across Africa.",
    email: "info@kayvionlabs.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    sameAs: [
      "https://linkedin.com/company/kayvionlabs",
      "https://x.com/kayvionlabs",
      "https://github.com/kayvionlabs",
      "https://instagram.com/kayvionlabs",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@kayvionlabs.com",
      contactType: "sales",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Swahili"],
    },
  };
}

/* ─── LOCAL BUSINESS (helps with "near me" / local-intent searches) ──────── */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    image: `${SITE_URL}/og-image.jpg`,
    url: SITE_URL,
    telephone: "", // ⬅ add a phone number if you want this field populated
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    priceRange: "$$",
    areaServed: ["Kenya", "East Africa", "Worldwide (remote)"],
  };
}

/* ─── WEBSITE (enables sitelinks search box in some cases) ───────────────── */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/* ─── SERVICE (one per service offered — use on /services or service detail pages) */
export function serviceSchema({ name, description, serviceType }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: serviceType || name,
    name,
    description,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: ["Kenya", "East Africa", "Worldwide"],
  };
}

/* ─── ITEM LIST of services (use on home/services page to list all offerings) */
export function serviceListSchema(services) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.body,
        provider: { "@id": `${SITE_URL}/#organization` },
      },
    })),
  };
}

/* ─── CREATIVE WORK / PROJECT (use on each /projects/:slug case study page) */
export function projectSchema(project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.summary,
    creator: { "@id": `${SITE_URL}/#organization` },
    about: project.sector,
    keywords: project.services?.join(", "),
    url: `${SITE_URL}/projects/${project.id}`,
  };
}

/* ─── BREADCRUMBS (use on project detail pages) ──────────────────────────── */
export function breadcrumbSchema(items) {
  // items: [{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }, ...]
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}