// SEO.jsx — Centralized per-page SEO component
// Drop this into any page/route to set unique title, description, canonical,
// Open Graph, Twitter Card, and JSON-LD structured data.
//
// Usage:
//   <SEO
//     title="AI & Machine Learning Services in Kenya"
//     description="..."
//     path="/services/ai-machine-learning"
//     jsonLd={[serviceSchema]}
//   />

import { Helmet } from "react-helmet-async";

const SITE_NAME = "Kayvion Labs";
const SITE_URL = "https://kayvionlabs.com"; // ⬅ update once domain is live
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  "Kayvion Labs is a Nairobi-based ICT services company delivering software engineering, AI & machine learning, cloud architecture, and data analytics for organisations across Africa.";
const TWITTER_HANDLE = "@kayvionlabs"; // ⬅ update if you have a real handle

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
  jsonLd = [],
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Software Engineering, AI & Cloud Services`;
  const canonical = `${SITE_URL}${path === "/" ? "" : path}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_KE" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD structured data — one <script> per object passed in */}
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, DEFAULT_DESCRIPTION };