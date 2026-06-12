import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet-async";

function App() {
  return (
    <>
      <Helmet
        defaultTitle="Kayvion – Future‑Ready ICT Solutions"
        titleTemplate="%s | Kayvion"
      >
        <html lang="en" />
        <meta
          name="description"
          content="Software engineering, AI, cloud, cybersecurity…"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Kayvion – Future‑Ready ICT Solutions"
        />
        <meta
          property="og:description"
          content="We build future‑ready ICT solutions."
        />
        <meta
          property="og:image"
          content="https://yourdomain.com/og-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://yourdomain.com" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Kayvion",
            url: "https://yourdomain.com",
            description: "ICT services: software, AI, cloud, cybersecurity.",
            contactPoint: {
              "@type": "ContactPoint",
              email: "hello@Kayvion.com",
              contactType: "sales",
            },
          })}
        </script>
      </Helmet>
      <div className="overflow-hidden">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <About />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
