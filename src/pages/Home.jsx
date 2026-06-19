// src/pages/Home.jsx
import Hero from "../components/Hero"; // you'll need to extract these as well
import Services from "../components/Services.jsx";
import About from "../components/About.jsx";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import SEO from "../components/SEO";
import { organizationSchema, websiteSchema } from "../components/schema";

export default function Home() {
  <SEO
    title="Software Engineering, AI & Cloud Services"
    description="Kayvion Labs is a Nairobi‑based ICT partner delivering software
              engineering, AI solutions, cloud architecture, and cybersecurity
              for organisations across Healthcare, FMCG, Real Estate, EdTech,
              and Non‑Profit. We build technology that drives measurable
              outcomes — no products, just outcomes built to last."
    path="/"
    jsonLd={[organizationSchema(), websiteSchema()]}
  />;
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Pricing />
      <Testimonials />
      <Contact />
    </>
  );
}
