import { useInView, motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useBreakpoint } from "./useBreakpoint";
import { MagneticBtn } from "./MagneticBtn";


/* ─── DATA ────────────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: "01",
    title: "Software Engineering",
    body: "Enterprise systems, SaaS platforms, and full-stack applications engineered to production-grade standards. We write code meant to last.",
  },
  {
    id: "02",
    title: "AI & Machine Learning",
    body: "Predictive models, NLP pipelines, computer vision, and ML inference systems — deployed in the real world, not just notebooks.",
  },
  {
    id: "03",
    title: "Web Sites & Web Apps",
    body: "High-performance web applications and native mobile experiences. Designed to convert, built to scale without rewrites.",
  },
  // {
  //   id: "04",
  //   title: "Cloud Architecture",
  //   body: "AWS, Azure, GCP — migration, infrastructure-as-code, and managed cloud at every scale. Resilient, observable, cost-efficient.",
  // },
  // {
  //   id: "05",
  //   title: "Cybersecurity",
  //   body: "Threat modelling, penetration testing, compliance, and continuous monitoring. Security that ships with your product, not after.",
  // },
  {
    id: "06",
    title: "Data & Analytics",
    body: "Pipelines, warehouses, dashboards, and forecasting models. From raw logs to decisions your leadership will act on.",
  },
  {
    id: "07",
    title: "API & Integration",
    body: "RESTful APIs, microservices, and enterprise integration that eliminates silos, reduces latency, and unlocks velocity.",
  },
  // {
  //   id: "08",
  //   title: "Business Automation",
  //   body: "Workflow design and intelligent automation that multiplies throughput. We find the friction and engineer it out.",
  // },
  {
    id: "09",
    title: "Technology Consulting",
    body: "Roadmapping, architecture reviews, digital transformation. Strategic advisory from engineers who have shipped, not just advised.",
  },
];














/* ─── TOKENS ──────────────────────────────────────────────────────────────── */
const T = {
  bg: "#F2F1ED", // warm off‑white (unchanged)
  bgAlt: "#EBE9E4", // soft greige (unchanged)
  ink: "#1A1A1A", // softer near‑black, less harsh than #0A0A0A
  muted: "#8F8C83", // warmer grey with a hint of olive
  border: "#D9D5CE", // subtle warm border, slightly darker than bgAlt
  accent: "#2255FF", // brand blue (unchanged)
  white: "#FFFFFF", // pure white (unchanged)
};




/* ─── ANIMATION HELPERS ───────────────────────────────────────────────────── */
const clipReveal = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  show: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
  },
};
const fadeSlide = (dir = 1) => ({
  hidden: { opacity: 0, y: 40 * dir },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
});
const stag = (d = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: d } },
});

function useAnimInView(once = true) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px" });
  return [ref, inView];
}



const TICKER_ITEMS = [
  "Software Engineering",
  "AI Systems",
  "Cloud Architecture",
  "Cybersecurity",
  "Data Science",
  "Mobile Apps",
  "API Development",
  "Business Automation",
  "Technology Consulting",
];

/* ─── TICKER ──────────────────────────────────────────────────────────────── */
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
        padding: "14px 0",
        background: T.bg,
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
        style={{
          display: "flex",
          gap: 0,
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 28,
              padding: "0 28px",
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: T.muted,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {item}
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: T.accent,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}









export default function Services() {
  const [active, setActive] = useState(0);
  const [openIdx, setOpenIdx] = useState(null); // accordion for mobile
  const [ref, inView] = useAnimInView();
  const { isTablet } = useBreakpoint();

  const toggleAccordion = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <section id="services" style={{ background: T.bg, padding: "120px 0 0" }}>
      <Ticker />
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "100px clamp(20px,5vw,40px)",
        }}
      >
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={stag(0.1)}
        >
          <motion.p
            variants={fadeSlide()}
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: T.muted,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            What we do
          </motion.p>
          <motion.h2
            variants={clipReveal}
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(28px,5vw,72px)",
              fontWeight: 700,
              letterSpacing: isTablet ? "-1.5px" : "-2.5px",
              color: T.ink,
              marginBottom: 72,
              lineHeight: 1.02,
              maxWidth: 700,
            }}
          >
            A full spectrum of ICT capability
          </motion.h2>
        </motion.div>

        {isTablet ? (
          /* ── Mobile / Tablet: Accordion ── */
          <div style={{ borderTop: `1px solid ${T.border}` }}>
            {SERVICES.map((s, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                <button
                  onClick={() => toggleAccordion(i)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: "20px 4px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 14, alignItems: "center" }}
                  >
                    <span
                      style={{
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontSize: 11,
                        color: openIdx === i ? T.accent : T.muted,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {s.id}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 17,
                        fontWeight: 600,
                        color: openIdx === i ? T.ink : T.muted,
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {s.title}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: openIdx === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      fontSize: 22,
                      color: T.accent,
                      lineHeight: 1,
                      flexShrink: 0,
                      marginLeft: 12,
                    }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 4px 24px" }}>
                        <p
                          style={{
                            fontFamily: "'Cabinet Grotesk', sans-serif",
                            fontSize: 16,
                            color: T.muted,
                            lineHeight: 1.72,
                            marginBottom: 20,
                          }}
                        >
                          {s.body}
                        </p>
                        <button
                          onClick={() =>
                            document
                              .getElementById("contact")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                          style={{
                            background: "none",
                            border: `1.5px solid ${T.border}`,
                            color: T.ink,
                            padding: "10px 22px",
                            borderRadius: 100,
                            fontFamily: "'Cabinet Grotesk', sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            cursor: "pointer",
                          }}
                        >
                          Discuss this service →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          /* ── Desktop: Tab panel ── */
          <div
            style={{
              display: "flex",
              gap: 0,
              borderTop: `1px solid ${T.border}`,
            }}
          >
            {/* Left index */}
            <div
              style={{
                width: "40%",
                flexShrink: 0,
                borderRight: `1px solid ${T.border}`,
              }}
            >
              {SERVICES.map((s, i) => (
                <motion.button
                  key={i}
                  data-hover
                  onClick={() => setActive(i)}
                  whileHover={{ x: 6 }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: active === i ? T.bgAlt : "transparent",
                    border: "none",
                    borderBottom: `1px solid ${T.border}`,
                    padding: "22px 28px 22px 24px",
                    cursor: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "background 0.2s",
                    borderLeft:
                      active === i
                        ? `3px solid ${T.accent}`
                        : "3px solid transparent",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 16, alignItems: "center" }}
                  >
                    <span
                      style={{
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontSize: 11,
                        color: active === i ? T.accent : T.muted,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {s.id}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 16,
                        fontWeight: 600,
                        color: active === i ? T.ink : T.muted,
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {s.title}
                    </span>
                  </div>
                  <motion.span
                    animate={{
                      x: active === i ? 0 : -4,
                      opacity: active === i ? 1 : 0,
                    }}
                    style={{ color: T.accent, fontSize: 18 }}
                  >
                    →
                  </motion.span>
                </motion.button>
              ))}
            </div>
            {/* Right content */}
            <div
              style={{
                flex: 1,
                padding: "48px 52px",
                minHeight: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      color: T.accent,
                      textTransform: "uppercase",
                      marginBottom: 20,
                    }}
                  >
                    {SERVICES[active].id} /{" "}
                    {SERVICES.length.toString().padStart(2, "0")}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: "clamp(28px,3.5vw,52px)",
                      fontWeight: 700,
                      letterSpacing: "-1.5px",
                      color: T.ink,
                      marginBottom: 24,
                      lineHeight: 1.08,
                    }}
                  >
                    {SERVICES[active].title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontSize: 18,
                      color: T.muted,
                      lineHeight: 1.72,
                      maxWidth: 480,
                    }}
                  >
                    {SERVICES[active].body}
                  </p>
                  <div style={{ marginTop: 40 }}>
                    <MagneticBtn
                      onClick={() =>
                        document
                          .getElementById("contact")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Discuss this service
                    </MagneticBtn>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

