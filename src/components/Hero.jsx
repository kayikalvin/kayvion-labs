import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { MagneticBtn } from "./MagneticBtn";

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

const STATS = [
  { v: "10+", l: "Projects shipped" },
  { v: "98%", l: "Client retention" },
  { v: "5+", l: "Counties" },
  { v: "3yr", l: "In operation" },
];

const HERO_CHARS = "Intelligent".split("");

const HERO_SECTORS = [
  "Healthcare",
  "FMCG Distribution",
  "Real Estate",
  "EdTech",
  "Non-Profit",
  "Maritime / Defence",
];

function SectorTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % HERO_SECTORS.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        height: 14,
        overflow: "hidden",
        verticalAlign: "middle",
        minWidth: 182,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            left: 0,
            top: -6,
            whiteSpace: "nowrap",
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 18,
            fontWeight: 600,
            color: T.accent,
          }}
        >
          {HERO_SECTORS[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ─── LOGO IMAGES ───────────────────────────────────────────────────────────── */
import logoDark from "../../public/k.png";

function LogoImage({ size = 20 }) {
  return (
    <img
      src={logoDark}
      alt="Kayvion Labs"
      style={{ height: size, width: "auto", objectFit: "contain" }}
    />
  );
}



function useBreakpoint() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return {
    isMobile: width < 560,
    isTablet: width < 768,
    isDesktop: width >= 960,
    width,
  };
}

export default function Hero() {
  const [ready, setReady] = useState(false);
  const { scrollY } = useScroll();
  const { isMobile } = useBreakpoint();
  const y = useTransform(scrollY, [0, 600], [0, isMobile ? 40 : 100]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  const heroFontSize = "clamp(52px, 11vw, 180px)";
  const heroLetterSpacing = isMobile ? "-2px" : "-4px";

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: 64,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      <motion.div
        style={{
          y,
          maxWidth: 1280,
          margin: "0 auto",
          padding:
            "clamp(48px,8vw,80px) clamp(20px,5vw,40px) clamp(60px,8vw,100px)",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Eyebrow — now points at proof (real sectors) instead of restating the headline */}
        <AnimatePresence className="align-center justify-center">
          {ready && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: isMobile ? 32 : 48,
                flexWrap: "wrap",
              }}
            >
              <LogoImage size={20} />
              <span
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: T.muted,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Currently shipping for
              </span>
              <SectorTicker />
              <span
                style={{
                  width: 1,
                  height: 18,
                  background: T.border,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 13,
                  color: T.muted,
                }}
              >
                Nairobi · Global
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character-stagger headline */}
        <div style={{ overflow: "hidden" }}>
          <motion.div
            style={{ display: "flex", flexWrap: "wrap", lineHeight: 0.95 }}
          >
            {ready &&
              HERO_CHARS.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.75,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3 + i * 0.04,
                  }}
                  style={{
                    display: "inline-block",
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: heroFontSize,
                    fontWeight: 700,
                    letterSpacing: heroLetterSpacing,
                    color: ch === " " ? "transparent" : T.ink,
                    lineHeight: 0.92,
                  }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              ))}
          </motion.div>
        </div>

        {/* "Systems." */}
        <div style={{ overflow: "hidden" }}>
          {ready && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.75,
              }}
              style={{
                display: "inline-flex",
                alignItems: "flex-end",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: heroFontSize,
                  fontWeight: 700,
                  letterSpacing: heroLetterSpacing,
                  color: T.accent,
                  lineHeight: 0.92,
                  display: "inline-block",
                }}
              >
                Systems.
              </span>
            </motion.div>
          )}
        </div>

        {/* Sub + CTA */}
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            style={{
              marginTop: isMobile ? 36 : 52,
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "flex-end",
              flexWrap: "wrap",
              gap: 28,
            }}
          >
            <p
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "clamp(15px,1.8vw,20px)",
                color: T.muted,
                lineHeight: 1.65,
                maxWidth: 440,
              }}
            >
              Kayvion Labs is a Nairobi‑based ICT partner delivering software
              engineering, AI solutions for organisations all across Healthcare,
              Real Estate, EdTech, and Non‑Profit. We build technology that
              drives measurable outcomes — no products, just outcomes built to
              last.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <MagneticBtn
                dark
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Start a project
              </MagneticBtn>
              <MagneticBtn
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View services
              </MagneticBtn>
            </div>
          </motion.div>
        )}

        {/* Stats — same numbers, refined visual treatment: accent corner tick instead of plain borders */}
        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            style={{
              marginTop: isMobile ? 56 : 88,
              paddingTop: 0,
              borderTop: `1px solid ${T.border}`,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
              gap: isMobile ? "0" : 0,
            }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: "relative",
                  paddingTop: 28,
                  paddingLeft: (isMobile ? i % 2 !== 0 : i !== 0) ? 24 : 0,
                  paddingRight: 24,
                  paddingBottom: isMobile && i < 2 ? 24 : 0,
                  borderRight: isMobile
                    ? i % 2 === 0
                      ? `1px solid ${T.border}`
                      : "none"
                    : i < 3
                      ? `1px solid ${T.border}`
                      : "none",
                  borderBottom:
                    isMobile && i < 2 ? `1px solid ${T.border}` : "none",
                }}
              >
                {/* Accent tick mark above each stat, replaces plain top border for the whole row */}
                <span
                  style={{
                    position: "absolute",
                    top: -1,
                    left: (isMobile ? i % 2 !== 0 : i !== 0) ? 24 : 0,
                    width: 20,
                    height: 2,
                    background: T.accent,
                  }}
                />
                <div
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: "clamp(24px,3.5vw,48px)",
                    fontWeight: 700,
                    letterSpacing: "-1.5px",
                    color: T.ink,
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 13,
                    color: T.muted,
                    marginTop: 4,
                  }}
                >
                  {s.l}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll cue — signals there's more below on a full-height hero */}
      {ready && !isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{
            opacity: { delay: 1.8, duration: 0.6 },
            y: {
              delay: 2.4,
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{
            position: "absolute",
            bottom: 28,
            right: "clamp(20px,5vw,40px)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: T.muted,
            }}
          >
            Scroll
          </span>
          <span
            style={{
              width: 24,
              height: 1,
              background: T.border,
              display: "inline-block",
            }}
          />
        </motion.div>
      )}
    </section>
  );
}
