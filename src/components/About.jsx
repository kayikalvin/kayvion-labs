import { useRef, useState } from "react";
import { MagneticBtn } from "./MagneticBtn";
import { useBreakpoint } from "./useBreakpoint";
import { useInView, motion, AnimatePresence } from "framer-motion";


/* ─── ABOUT ───────────────────────────────────────────────────────────────── */
const ABOUT_PILLARS = [
  {
    t: "Engineering-first",
    d: "Every decision is made by practitioners, not account managers. You speak directly with the people building your system.",
  },
  {
    t: "Transparent process",
    d: "Weekly updates, shared repositories, no black-box delivery. You always know where your project stands.",
  },
  {
    t: "Security by design",
    d: "Compliance and threat modelling are built in from day one, not bolted on after launch.",
  },
  {
    t: "Long-term thinking",
    d: "We write code we'd be proud to maintain — because we often do. No quick fixes, no technical debt by default.",
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


function useAnimInView(once = true) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px" });
  return [ref, inView];
}


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


export default function About() {
  const [ref, inView] = useAnimInView();
  const { isTablet } = useBreakpoint();
  const [activePillar, setActivePillar] = useState(0);

  return (
    <section
      id="about"
      style={{ background: T.bgAlt, padding: "clamp(72px,10vw,140px) 0" }}
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
          <div
            style={{
              display: "flex",
              gap: isTablet ? 48 : 64,
              flexDirection: isTablet ? "column" : "row",
              alignItems: "flex-start",
            }}
          >
            {/* Left copy — slightly narrower than the right, breaks the 50/50 grid */}
            <div
              style={{
                flex: isTablet ? "1 1 100%" : "0 0 38%",
                minWidth: 0,
                position: isTablet ? "static" : "sticky",
                top: isTablet ? "auto" : 140,
              }}
            >
              <motion.div
                variants={fadeSlide()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 22,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: T.accent,
                    display: "inline-block",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: T.muted,
                    textTransform: "uppercase",
                  }}
                >
                  About Kayvion Labs
                </p>
              </motion.div>

              <motion.h2
                variants={clipReveal}
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(32px,5.5vw,58px)",
                  fontWeight: 700,
                  letterSpacing: isTablet ? "-1.5px" : "-2px",
                  color: T.ink,
                  lineHeight: 1.05,
                  marginBottom: 28,
                }}
              >
                Built by
                <br />
                engineers.
                <br />
                <span style={{ color: T.accent }}>Driven by outcomes.</span>
              </motion.h2>

              <motion.p
                variants={fadeSlide()}
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 17,
                  color: T.muted,
                  lineHeight: 1.78,
                  marginBottom: 18,
                  maxWidth: 420,
                }}
              >
                Kayvion Labs is an ICT services company that partners with
                organisations to solve hard technology problems. We don't sell
                products — we deliver outcomes.
              </motion.p>
              <motion.p
                variants={fadeSlide()}
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 17,
                  color: T.muted,
                  lineHeight: 1.78,
                  marginBottom: 40,
                  maxWidth: 420,
                }}
              >
                Our team spans out with experience in software engineers, data
                scientists, software designers, and ML and AI specialists .
              </motion.p>

              <motion.div
                variants={fadeSlide()}
                style={{ display: "flex", alignItems: "center", gap: 20 }}
              >
                <MagneticBtn
                  dark
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Work with us
                </MagneticBtn>
                <span
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 13,
                    color: T.muted,
                  }}
                >
                  5+ counties · 3yr in operation
                </span>
              </motion.div>
            </div>

            {/* Right — interactive pillar list with live index counter */}
            <motion.div
              variants={fadeSlide()}
              style={{ flex: "1 1 auto", minWidth: 0, width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  borderBottom: `1px solid ${T.border}`,
                  paddingBottom: 18,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: T.muted,
                    textTransform: "uppercase",
                  }}
                >
                  What sets us apart
                </span>
                <span
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.accent,
                    letterSpacing: "0.02em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  0{activePillar + 1} / 0{ABOUT_PILLARS.length}
                </span>
              </div>

              {ABOUT_PILLARS.map((v, i) => {
                const active = activePillar === i;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setActivePillar(i)}
                    onClick={() => setActivePillar(i)}
                    style={{
                      borderBottom: `1px solid ${T.border}`,
                      cursor: "pointer",
                      display: "flex",
                      gap: isTablet ? 18 : 28,
                      alignItems: "flex-start",
                      padding: active ? "30px 4px" : "26px 4px",
                      transition: "padding 0.4s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <motion.span
                      animate={{
                        color: active ? T.accent : T.muted,
                        scale: active ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: isTablet ? 26 : 34,
                        fontWeight: 700,
                        letterSpacing: "-1px",
                        flexShrink: 0,
                        width: isTablet ? 44 : 56,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      0{i + 1}
                    </motion.span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <motion.div
                        animate={{ color: active ? T.ink : T.muted }}
                        transition={{ duration: 0.3 }}
                        style={{
                          fontFamily: "'Clash Display', sans-serif",
                          fontSize: isTablet ? 19 : 23,
                          fontWeight: 600,
                          letterSpacing: "-0.3px",
                        }}
                      >
                        {v.t}
                      </motion.div>

                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.4,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{ overflow: "hidden" }}
                          >
                            <p
                              style={{
                                fontFamily: "'Cabinet Grotesk', sans-serif",
                                fontSize: 15.5,
                                color: T.muted,
                                lineHeight: 1.68,
                                maxWidth: 460,
                                marginTop: 10,
                                paddingRight: 12,
                              }}
                            >
                              {v.d}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.span
                      animate={{
                        opacity: active ? 1 : 0,
                        x: active ? 0 : -6,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        color: T.accent,
                        fontSize: 18,
                        flexShrink: 0,
                        marginTop: isTablet ? 3 : 6,
                      }}
                    >
                      →
                    </motion.span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}