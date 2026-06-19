import { useRef } from "react";
import { useBreakpoint } from "./useBreakpoint";
import { useInView, motion } from "framer-motion";


const PLANS = [
  {
    tier: "Starter",
    tag: "Startups & Small Teams",
    features: [
      "Web or mobile application",
      "Basic API integration",
      "Cloud deployment",
      "30-day support",
    ],
  },
  {
    tier: "Growth",
    tag: "Scaling Organisations",
    features: [
      "Full-stack development",
      "AI/ML integration",
      "Cloud architecture & DevOps",
      "90-day SLA",
      "Dedicated PM",
    ],
    hot: true,
  },
  {
    tier: "Enterprise",
    tag: "Complex & Mission-Critical",
    features: [
      "Multi-system architecture",
      "Cybersecurity layer",
      "Data science pipelines",
      "24/7 monitoring",
      "On-site consulting",
    ],
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




/* ─── PRICING ─────────────────────────────────────────────────────────────── */
export default function Pricing() {
  const [ref, inView] = useAnimInView();
  const { isTablet } = useBreakpoint();

  return (
    <section
      id="pricing"
      style={{ background: T.bg, padding: "clamp(72px,10vw,120px) 0" }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: `0 clamp(20px,5vw,40px)`,
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
            Engagement models
          </motion.p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 60,
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <motion.h2
              variants={clipReveal}
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(28px,5vw,64px)",
                fontWeight: 700,
                letterSpacing: isTablet ? "-1.5px" : "-2px",
                color: T.ink,
                lineHeight: 1.04,
              }}
            >
              Every project
              <br />
              scoped for you.
            </motion.h2>
            <motion.p
              variants={fadeSlide()}
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 16,
                color: T.muted,
                maxWidth: 380,
                lineHeight: 1.7,
              }}
            >
              No off-the-shelf pricing. These tiers are a starting framework —
              every engagement is shaped in a discovery conversation.
            </motion.p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {PLANS.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeSlide()}
                style={{
                  display: "flex",
                  flexDirection: isTablet ? "column" : "row",
                  justifyContent: isTablet ? "flex-start" : "space-between",
                  alignItems: isTablet ? "flex-start" : "center",
                  flexWrap: "wrap",
                  gap: isTablet ? 20 : 24,
                  padding: isTablet ? "28px 24px" : "36px 40px",
                  borderBottom:
                    i < PLANS.length - 1 ? `1px solid ${T.border}` : "none",
                  background: p.hot ? T.ink : T.white,
                  position: "relative",
                }}
              >
                {p.hot && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: T.accent,
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "3px 10px",
                      borderRadius: 100,
                      letterSpacing: "0.1em",
                    }}
                  >
                    POPULAR
                  </div>
                )}
                <div style={{ minWidth: 160 }}>
                  <div
                    style={{
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      color: p.hot ? "rgba(255,255,255,0.5)" : T.muted,
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    {p.tag}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: "clamp(22px,2.5vw,36px)",
                      fontWeight: 700,
                      letterSpacing: "-1px",
                      color: p.hot ? T.white : T.ink,
                    }}
                  >
                    {p.tier}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: isTablet ? "10px 16px" : "12px 20px",
                    flex: isTablet ? "unset" : 1,
                    justifyContent: isTablet ? "flex-start" : "center",
                  }}
                >
                  {p.features.map((f, j) => (
                    <span
                      key={j}
                      style={{
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontSize: 14,
                        color: p.hot ? "rgba(255,255,255,0.65)" : T.muted,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span style={{ color: T.accent, fontSize: 12 }}>✓</span>{" "}
                      {f}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  style={{
                    cursor: "pointer",
                    background: p.hot ? T.white : T.ink,
                    color: p.hot ? T.ink : T.white,
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: 100,
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Talk to us →
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}