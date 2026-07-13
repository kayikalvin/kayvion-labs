// src/pages/Home.jsx
import Hero from "../components/Hero"; // you'll need to extract these as well
import Services from "../components/Services.jsx";
import About from "../components/About.jsx";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Kayvion Labs | Software Engineering, AI & Cloud Solutions</title>

        <meta
          name="description"
          content="Kayvion Labs builds enterprise software, AI solutions, cloud infrastructure, APIs and data platforms for businesses across Africa."
        />

        <meta
          name="keywords"
          content="software engineering, AI, machine learning, web development, cloud architecture, Kenya, Nairobi"
        />

        <link rel="canonical" href="https://www.kayvionlabs.com/" />

        <meta property="og:title" content="Kayvion Labs" />

        <meta
          property="og:description"
          content="Software Engineering • Artificial Intelligence • Cloud Solutions"
        />

        <meta
          property="og:image"
          content="https://www.kayvionlabs.com/og-image.png"
        />

        <meta property="og:url" content="https://www.kayvionlabs.com/" />

        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Kayvion Labs",
            url: "https://www.kayvionlabs.com",
            logo: "https://www.kayvionlabs.com/k.png",
            sameAs: ["https://www.linkedin.com/company/kayvion-labs"],
          })}
        </script>
      </Helmet>

      <Hero />
      <Services />
      <About />
      <Pricing />
      <Testimonials />
      <Contact />
    </>
  );
}
