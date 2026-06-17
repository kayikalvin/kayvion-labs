// KayvionLabs.jsx — Award-tier redesign, fully responsive
// Fonts: Clash Display + Cabinet Grotesk (Fontshare CDN)
// Animations: Framer Motion

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";

// Import project pages
import ProjectsIndex, { PROJECTS } from "./components/Projectsindex";
import ProjectDetail from "./components/Projectdetail";

/* ─── TOKENS ──────────────────────────────────────────────────────────────── */
const T = {
  bg: "#F2F1ED",        // warm off‑white (unchanged)
  bgAlt: "#EBE9E4",     // soft greige (unchanged)
  ink: "#1A1A1A",       // softer near‑black, less harsh than #0A0A0A
  muted: "#8F8C83",     // warmer grey with a hint of olive
  border: "#D9D5CE",    // subtle warm border, slightly darker than bgAlt
  accent: "#2255FF",    // brand blue (unchanged)
  white: "#FFFFFF",     // pure white (unchanged)
};

/* ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────── */
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

/* ─── TOUCH DETECT ────────────────────────────────────────────────────────── */
function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);
  return touch;
}

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

const TESTIMONIALS = [
  {
    q: "They delivered a platform handling 50,000 daily transactions without a hiccup. Rare to say this honestly — the engineering quality is exceptional.",
    name: "Amara Diallo",
    role: "CTO, FinEdge Africa",
    init: "AD",
  },
  {
    q: "Our AI reporting system cut analyst time by 70%. Kayvion understood our data immediately and built something we couldn't have imagined doing alone.",
    name: "Seun Adeyemi",
    role: "Head of Ops, PetroLogic",
    init: "SA",
  },
  {
    q: "From discovery to deployment — clear, on-schedule, outcome exceeded expectations. That combination is genuinely rare in the industry.",
    name: "Ngozi Okafor",
    role: "Founder, HealthTrack",
    init: "NO",
  },
];

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

const STATS = [
  { v: "120+", l: "Projects shipped" },
  { v: "98%", l: "Client retention" },
  { v: "14", l: "Countries" },
  { v: "8yr", l: "In operation" },
];

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

/* ─── CURSOR ──────────────────────────────────────────────────────────────── */
function Cursor() {
  const isTouch = useIsTouch();
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness: 180, damping: 22 });
  const sy = useSpring(cy, { stiffness: 180, damping: 22 });
  const [hovered, setHovered] = useState(false);
  const scale = useSpring(hovered ? 3.5 : 1, { stiffness: 200, damping: 20 });

  useEffect(() => {
    if (isTouch) return;
    const move = (e) => {
      cx.set(e.clientX);
      cy.set(e.clientY);
    };
    const over = (e) => {
      if (e.target.closest("button, a, [data-hover]")) setHovered(true);
    };
    const out = () => setHovered(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: T.accent,
        pointerEvents: "none",
        zIndex: 9999,
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        scale,
        mixBlendMode: "multiply",
      }}
    />
  );
}

/* ─── LOGO MARK ───────────────────────────────────────────────────────────── */
function KMark({ size = 32, color = T.accent }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M6 4 L6 28"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M6 16 L22 5"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M6 16 L22 27"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M18 8 Q26 4 27 11 Q28 17 20 17"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

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

/* ─── NAVBAR ──────────────────────────────────────────────────────────────── */
/* ─── NAVBAR ──────────────────────────────────────────────────────────────── */
/* Drop-in replacement. Uses the same T tokens, KMark, useBreakpoint, useIsTouch
   already defined in KayvionLabs.jsx. Pass onNavigate the same way Navbar's
   "go" worked before — internally it calls handleNavigate(id) if provided,
   otherwise falls back to scrollIntoView for standalone use. */

const NAV_LINKS = ["Services", "About", "Pricing", "Projects", "Testimonials", "Contact"];

function NavTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Nairobi",
      });
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 1000 * 30);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      style={{
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontSize: 12,
        color: "rgba(255,255,255,0.4)",
        letterSpacing: "0.02em",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {time} NBO
    </span>
  );
}

function ScrambleLink({ label, active, onClick, onMouseEnter }) {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [display, setDisplay] = useState(label);
  const frame = useRef(0);
  const raf = useRef(null);

  const scramble = useCallback(() => {
    let iterations = 0;
    const total = label.length;
    cancelAnimationFrame(raf.current);

    const tick = () => {
      const next = label
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < iterations) return label[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setDisplay(next);
      iterations += 1 / 2.2;
      if (iterations < total) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setDisplay(label);
      }
    };
    raf.current = requestAnimationFrame(tick);
  }, [label]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <motion.button
      data-hover
      onClick={onClick}
      onMouseEnter={() => {
        scramble();
        onMouseEnter?.();
      }}
      style={{
        position: "relative",
        background: "none",
        border: "none",
        cursor: "none",
        padding: "4px 0",
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        color: active ? T.ink : T.muted,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {display}
      <motion.span
        initial={false}
        whileHover={{ scaleX: 1, opacity: 1 }}
        animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          left: 0,
          bottom: -3,
          height: 1.5,
          width: "100%",
          background: T.accent,
          transformOrigin: "left",
          borderRadius: 2,
        }}
      />
    </motion.button>
  );
}

function Navbar({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const { isDesktop } = useBreakpoint();

  useEffect(() => {
    const h = () => setSolid(window.scrollY > 32);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id) => {
    setOpen(false);
    if (onNavigate) onNavigate(id);
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          inset: "0 0 auto 0",
          zIndex: 500,
          transition: "background 0.4s, border-color 0.4s",
          background: solid ? "rgba(242,241,237,0.86)" : "transparent",
          backdropFilter: solid ? "blur(16px) saturate(140%)" : "none",
          WebkitBackdropFilter: solid ? "blur(16px) saturate(140%)" : "none",
          borderBottom: solid
            ? `1px solid ${T.border}`
            : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(20px,5vw,40px)",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <button
            data-hover
            onClick={() => go("hero")}
            style={{
              background: "none",
              border: "none",
              cursor: isDesktop ? "none" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <span style={{ position: "relative", display: "inline-flex" }}>
              <KMark size={26} />
              <motion.span
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: T.accent,
                }}
              />
            </span>
            <span
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 17,
                fontWeight: 600,
                color: T.ink,
                letterSpacing: "-0.4px",
              }}
            >
              Kayvion<span style={{ color: T.accent }}>Labs</span>
            </span>
          </button>

          {/* Desktop nav links */}
          {isDesktop && (
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
              <div
                onMouseLeave={() => setHoveredLink(null)}
                style={{ display: "flex", alignItems: "center", gap: 34 }}
              >
                {NAV_LINKS.map((l) => (
                  <ScrambleLink
                    key={l}
                    label={l}
                    active={hoveredLink === l}
                    onMouseEnter={() => setHoveredLink(l)}
                    onClick={() => go(l.toLowerCase())}
                  />
                ))}
              </div>

              <span
                style={{
                  width: 1,
                  height: 22,
                  background: T.border,
                  display: "inline-block",
                }}
              />

              <motion.button
                data-hover
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => go("contact")}
                style={{
                  cursor: "none",
                  position: "relative",
                  overflow: "hidden",
                  background: T.ink,
                  color: T.white,
                  border: "none",
                  padding: "10px 22px",
                  borderRadius: 100,
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.01em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                Let's talk
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 1,
                  }}
                  style={{ fontSize: 14, color: T.accent }}
                >
                  →
                </motion.span>
              </motion.button>
            </div>
          )}

          {/* Hamburger — mobile/tablet */}
          {!isDesktop && (
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 8,
                zIndex: 600,
              }}
            >
              <span
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: T.muted,
                  textTransform: "uppercase",
                }}
              >
                {open ? "Close" : "Menu"}
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                {[0, 1].map((i) => (
                  <motion.span
                    key={i}
                    animate={{
                      rotate: open ? (i === 0 ? 45 : -45) : 0,
                      y: open ? (i === 0 ? 6.5 : -6.5) : 0,
                      width: open ? 18 : i === 0 ? 18 : 12,
                    }}
                    transition={{ duration: 0.25 }}
                    style={{
                      display: "block",
                      height: 1.5,
                      background: T.ink,
                      borderRadius: 1,
                      marginLeft: i === 1 && !open ? "auto" : 0,
                    }}
                  />
                ))}
              </div>
            </button>
          )}
        </div>
      </motion.nav>

      {/* Mobile full-screen menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 490,
              background: T.bg,
              paddingTop: 88,
              paddingLeft: "clamp(24px,8vw,48px)",
              paddingRight: "clamp(24px,8vw,48px)",
              paddingBottom: 40,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  borderTop: `1px solid ${T.border}`,
                  marginTop: 12,
                }}
              >
                {NAV_LINKS.map((l, i) => (
                  <motion.div
                    key={l}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.12 + i * 0.06,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      borderBottom: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "baseline",
                      gap: 18,
                      padding: "16px 0",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: T.muted,
                        letterSpacing: "0.08em",
                      }}
                    >
                      0{i + 1}
                    </span>
                    <button
                      onClick={() => go(l.toLowerCase())}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: "clamp(32px,8vw,56px)",
                        fontWeight: 600,
                        color: T.ink,
                        letterSpacing: "-1.5px",
                        lineHeight: 1.1,
                        flex: 1,
                      }}
                    >
                      {l}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile footer info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                marginTop: 40,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 14,
                    color: T.ink,
                    fontWeight: 500,
                  }}
                >
                  hello@kayvionlabs.com
                </p>
                <p
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 13,
                    color: T.muted,
                    marginTop: 4,
                  }}
                >
                  Nairobi, Kenya · Remote worldwide
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 12,
                  color: T.muted,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    background: "#22c55e",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
                Available for new work
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── HERO ────────────────────────────────────────────────────────────────── */
const HERO_CHARS = "Intelligent".split("");

function Hero() {
  const [ready, setReady] = useState(false);
  const { scrollY } = useScroll();
  const { isMobile, isTablet } = useBreakpoint();
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
        {/* Eyebrow */}
        <AnimatePresence>
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
              <KMark size={20} />
              <span
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.muted,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Building Intelligent Systems
              </span>
              <span
                style={{
                  width: 1,
                  height: 12,
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
              End-to-end ICT services — software engineering, AI, cloud, and
              cybersecurity — for organisations that need technology to actually
              work.
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

        {/* Stats */}
        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            style={{
              marginTop: isMobile ? 56 : 88,
              paddingTop: 36,
              borderTop: `1px solid ${T.border}`,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
              gap: isMobile ? "24px 0" : 0,
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  paddingLeft: (isMobile ? i % 2 !== 0 : i !== 0) ? 24 : 0,
                  paddingRight: 24,
                  borderRight: isMobile
                    ? i % 2 === 0
                      ? `1px solid ${T.border}`
                      : "none"
                    : i < 3
                      ? `1px solid ${T.border}`
                      : "none",
                  borderBottom:
                    isMobile && i < 2 ? `1px solid ${T.border}` : "none",
                  paddingBottom: isMobile && i < 2 ? 24 : 0,
                }}
              >
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
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

/* ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────── */
function MagneticBtn({ children, dark, onClick }) {
  const ref = useRef(null);
  const isTouch = useIsTouch();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = (e) => {
    if (isTouch) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      data-hover
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      style={{
        x: sx,
        y: sy,
        cursor: isTouch ? "pointer" : "none",
        border: dark ? "none" : `1.5px solid ${T.border}`,
        background: dark ? T.ink : "transparent",
        color: dark ? T.white : T.ink,
        padding: "13px 30px",
        borderRadius: 100,
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: 15,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        transition: "background 0.2s, color 0.2s, border-color 0.2s",
        whiteSpace: "nowrap",
        boxShadow: dark
          ? "none"
          : "0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        if (!dark) {
          e.currentTarget.style.borderColor = T.ink;
          e.currentTarget.style.boxShadow =
            "0 4px 20px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!dark) {
          e.currentTarget.style.borderColor = T.border;
          e.currentTarget.style.boxShadow =
            "0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)";
        }
      }}
    >
      {children}
      {dark && <span style={{ fontSize: 16, marginLeft: 2 }}>→</span>}
    </motion.button>
  );
}

/* ─── SERVICES ────────────────────────────────────────────────────────────── */
function Services() {
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

function About() {
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
                Our team spans software engineers, data scientists, cloud
                architects, and security specialists across 14 countries.
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
                  14 countries · 8yr in operation
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

/* ─── PRICING ─────────────────────────────────────────────────────────────── */
function Pricing() {
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

/* ─── TESTIMONIALS ────────────────────────────────────────────────────────── */
function Testimonials() {
  const [ref, inView] = useAnimInView();
  const { isTablet, isMobile } = useBreakpoint();

  const cols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3,1fr)";

  return (
    <section
      id="testimonials"
      style={{ background: T.bgAlt, padding: "clamp(72px,10vw,120px) 0" }}
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
            Testimonials
          </motion.p>
          <motion.h2
            variants={clipReveal}
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(28px,5vw,64px)",
              fontWeight: 700,
              letterSpacing: isTablet ? "-1.5px" : "-2px",
              color: T.ink,
              lineHeight: 1.04,
              marginBottom: 64,
            }}
          >
            Clients who took
            <br />
            the leap.
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: cols, gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeSlide()}
                whileHover={{ y: -6 }}
                style={{
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "36px clamp(20px,3vw,32px)",
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: 52,
                    color: T.accent,
                    opacity: 0.18,
                    lineHeight: 1,
                    marginBottom: 20,
                    userSelect: "none",
                  }}
                >
                  "
                </div>
                <p
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 16,
                    color: T.ink,
                    lineHeight: 1.72,
                    marginBottom: 32,
                  }}
                >
                  "{t.q}"
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    paddingTop: 24,
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: T.ink,
                      color: T.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "'Clash Display', sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    {t.init}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 15,
                        fontWeight: 600,
                        color: T.ink,
                        letterSpacing: "-0.2px",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontSize: 12,
                        color: T.muted,
                        marginTop: 2,
                      }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─────────────────────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [ref, inView] = useAnimInView();
  const { isTablet, isMobile } = useBreakpoint();

  const inp = {
    background: T.white,
    border: `1px solid ${T.border}`,
    color: T.ink,
    padding: "14px 18px",
    borderRadius: 8,
    fontFamily: "'Cabinet Grotesk', sans-serif",
    fontSize: 15,
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
  };

  return (
    <section
      id="contact"
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
          {/* CTA band */}
          <motion.div
            variants={fadeSlide()}
            style={{
              background: T.ink,
              borderRadius: isTablet ? 14 : 20,
              padding: isTablet ? "48px clamp(24px,6vw,48px)" : "72px 64px",
              marginBottom: 80,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isTablet ? "column" : "row",
              flexWrap: "wrap",
              gap: 32,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative" }}>
              <h2
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(24px,4vw,56px)",
                  fontWeight: 700,
                  color: T.white,
                  letterSpacing: isTablet ? "-1px" : "-1.5px",
                  lineHeight: 1.08,
                  marginBottom: 14,
                }}
              >
                Let's build something
                <br />
                worth building.
              </h2>
              <p
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 17,
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: 420,
                  lineHeight: 1.65,
                }}
              >
                Whether you have a brief, a vague idea, or just a deadline —
                we'll help you get to clarity and execution fast.
              </p>
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("contact-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                position: "relative",
                cursor: "pointer",
                background: T.white,
                color: T.ink,
                border: "none",
                padding: isTablet ? "14px 28px" : "18px 40px",
                borderRadius: 100,
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 700,
                fontSize: isTablet ? 16 : 18,
                letterSpacing: "-0.3px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Start a conversation →
            </button>
          </motion.div>

          {/* Form row */}
          <div
            id="contact-form"
            style={{
              display: "flex",
              gap: isTablet ? 40 : 80,
              flexDirection: isTablet ? "column" : "row",
              flexWrap: "wrap",
            }}
          >
            {/* Left info */}
            <motion.div
              variants={fadeSlide()}
              style={{ flex: "1 1 36%", minWidth: 0 }}
            >
              <p
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
                Contact
              </p>
              <h3
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(22px,3vw,42px)",
                  fontWeight: 700,
                  letterSpacing: "-1.2px",
                  color: T.ink,
                  lineHeight: 1.08,
                  marginBottom: 22,
                }}
              >
                Talk to the
                <br />
                right people.
              </h3>
              <p
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 16,
                  color: T.muted,
                  lineHeight: 1.72,
                  marginBottom: 40,
                }}
              >
                No sales scripts. You'll speak directly with engineers who
                understand what you're trying to build.
              </p>
              {[
                { l: "Email", v: "hello@kayvionlabs.com" },
                { l: "Location", v: "Nairobi, Kenya · Remote worldwide" },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 22 }}>
                  <div
                    style={{
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: T.muted,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {item.l}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontSize: 16,
                      color: T.ink,
                      fontWeight: 500,
                    }}
                  >
                    {item.v}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Right form */}
            <motion.div
              variants={fadeSlide()}
              style={{ flex: "1 1 52%", minWidth: 0 }}
            >
              {sent ? (
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: "64px 40px",
                    textAlign: "center",
                    background: T.white,
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: 48, marginBottom: 18 }}
                  >
                    ✓
                  </motion.div>
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 26,
                      fontWeight: 700,
                      color: T.ink,
                      letterSpacing: "-0.8px",
                      marginBottom: 10,
                    }}
                  >
                    Message received.
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontSize: 16,
                      color: T.muted,
                    }}
                  >
                    We'll be in touch within one business day.
                  </div>
                </motion.div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: 14,
                    }}
                  >
                    {[
                      { p: "Your name", k: "name" },
                      { p: "Email address", k: "email" },
                    ].map((f) => (
                      <input
                        key={f.k}
                        placeholder={f.p}
                        value={form[f.k]}
                        onChange={(e) =>
                          setForm({ ...form, [f.k]: e.target.value })
                        }
                        style={inp}
                        onFocus={(e) => (e.target.style.borderColor = T.accent)}
                        onBlur={(e) => (e.target.style.borderColor = T.border)}
                      />
                    ))}
                  </div>
                  <select
                    value={form.service}
                    onChange={(e) =>
                      setForm({ ...form, service: e.target.value })
                    }
                    style={{
                      ...inp,
                      color: form.service ? T.ink : T.muted,
                      appearance: "auto",
                    }}
                  >
                    <option value="" disabled>
                      Service of interest
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s.title} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Tell us about your project…"
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    style={{ ...inp, resize: "vertical" }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                  <button
                    onClick={() => setSent(true)}
                    style={{
                      cursor: "pointer",
                      background: T.ink,
                      color: T.white,
                      border: "none",
                      padding: "17px",
                      borderRadius: 8,
                      fontFamily: "'Clash Display', sans-serif",
                      fontWeight: 700,
                      fontSize: 17,
                      letterSpacing: "-0.3px",
                    }}
                  >
                    Send message →
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────────────────── */
// const SOCIAL_LINKS = [
//   { label: "LinkedIn",  icon: "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.5 5.5A.5.5 0 0 0 5 6v5.5a.5.5 0 0 0 1 0V6.5h1v5a.5.5 0 0 0 1 0V6a.5.5 0 0 0-.5-.5h-2zm-.5-.75A.75.75 0 1 1 6.25 6 .75.75 0 0 1 5 4.75zM8 6.5h1v1.25a1.75 1.75 0 1 1-1 0V6.5z", viewBox: "0 0 16 16" },
// ];

function SocialIcon({ title }) {
  const icons = {
    LinkedIn: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    X: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.264 5.638 5.9-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    GitHub: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
    Instagram: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  };
  return icons[title] || null;
}

const FOOTER_SERVICES = [
  "Software Engineering",
  "AI & Machine Learning",
  "Cloud Architecture",
  "Cybersecurity",
  "Data & Analytics",
  "Business Automation",
];
const FOOTER_COMPANY = [
  "About",
  "How we work",
  "Careers",
  "Case studies",
  "Blog",
];
const FOOTER_CONTACT = ["Start a project", "Pricing", "Support"];

function Footer() {
  const { isTablet, isMobile, width } = useBreakpoint();
  const isNarrow = width < 860;

  const col = {
    padding: isNarrow ? "0" : "0 28px",
    borderRight: !isNarrow ? `1px solid rgba(255,255,255,0.08)` : "none",
  };

  return (
    <footer style={{ background: T.ink }}>
      {/* ── Top: brand + nav columns ─────────────────────────────── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: `52px clamp(20px,5vw,40px) 48px`,
          display: "grid",
          gridTemplateColumns: isNarrow
            ? isMobile
              ? "1fr"
              : "1fr 1fr"
            : "1.7fr 1fr 1fr 1fr",
          gap: isNarrow ? "40px 32px" : "0",
          borderBottom: `1px solid rgba(255,255,255,0.08)`,
        }}
      >
        {/* Brand col */}
        <div
          style={{
            paddingRight: isNarrow ? 0 : 40,
            borderRight: isNarrow ? "none" : `1px solid rgba(255,255,255,0.08)`,
            gridColumn: isNarrow && !isMobile ? "1 / -1" : undefined,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 18,
            }}
          >
            <KMark size={26} color="#fff" />
            <span
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 17,
                fontWeight: 700,
                color: T.white,
                letterSpacing: "-0.4px",
              }}
            >
              Kayvion<span style={{ color: T.accent }}>Labs</span>
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 14,
              color: "rgba(255,255,255,0.42)",
              lineHeight: 1.72,
              maxWidth: 220,
              marginBottom: 24,
            }}
          >
            End-to-end ICT services for organisations that need technology to
            actually work.
          </p>

          {/* Email pill */}
          <a
            href="mailto:hello@kayvionlabs.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(34,85,255,0.12)",
              border: "1px solid rgba(34,85,255,0.28)",
              borderRadius: 100,
              padding: "8px 14px",
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              fontWeight: 500,
              textDecoration: "none",
              marginBottom: 28,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={T.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            hello@kayvionlabs.com
          </a>

          {/* Socials */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              {
                name: "LinkedIn",
                url: "https://linkedin.com/company/kayvionlabs",
              },
              { name: "X", url: "https://x.com/kayvionlabs" },
              { name: "GitHub", url: "https://github.com/kayvionlabs" },
              { name: "Instagram", url: "https://instagram.com/kayvionlabs" },
            ].map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                style={{
                  width: 34,
                  height: 34,
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  background: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                }}
              >
                <SocialIcon title={name} />
              </a>
            ))}
          </div>
        </div>

        {/* Services col */}
        <div style={{ ...col }}>
          <p
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
              marginBottom: 18,
            }}
          >
            Services
          </p>
          {FOOTER_SERVICES.map((l) => (
            <button
              key={l}
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                display: "block",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.48)",
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                marginBottom: 12,
                padding: 0,
                textAlign: "left",
                transition: "color 0.18s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.48)")
              }
            >
              {l}
            </button>
          ))}
        </div>

        {/* Company col */}
        <div style={{ ...col }}>
          <p
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
              marginBottom: 18,
            }}
          >
            Company
          </p>
          {FOOTER_COMPANY.map((l) => (
            <button
              key={l}
              style={{
                display: "block",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.48)",
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                marginBottom: 12,
                padding: 0,
                textAlign: "left",
                transition: "color 0.18s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.48)")
              }
            >
              {l}
            </button>
          ))}
        </div>

        {/* Contact col */}
        <div style={{ paddingLeft: isNarrow ? 0 : 28 }}>
          <p
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
              marginBottom: 18,
            }}
          >
            Contact
          </p>
          {FOOTER_CONTACT.map((l) => (
            <button
              key={l}
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                display: "block",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.48)",
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                marginBottom: 12,
                padding: 0,
                textAlign: "left",
                transition: "color 0.18s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.48)")
              }
            >
              {l}
            </button>
          ))}

          {/* Location badge */}
          <div
            style={{
              marginTop: 20,
              padding: "14px 16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
                marginBottom: 6,
              }}
            >
              Location
            </p>
            <p
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.6,
              }}
            >
              Nairobi, Kenya
              <br />
              Remote worldwide
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA band ─────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: `28px clamp(20px,5vw,40px)`,
          borderBottom: `1px solid rgba(255,255,255,0.08)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <p
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: isMobile ? 16 : 20,
            fontWeight: 700,
            letterSpacing: "-0.6px",
            color: T.white,
          }}
        >
          Ready to build something{" "}
          <span style={{ color: T.accent }}>worth building?</span>
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() =>
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          style={{
            cursor: "pointer",
            background: T.accent,
            color: T.white,
            border: "none",
            padding: "11px 24px",
            borderRadius: 100,
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          Start a conversation
          <span style={{ fontSize: 15 }}>→</span>
        </motion.button>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: `18px clamp(20px,5vw,40px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.22)",
          }}
        >
          © {new Date().getFullYear()} Kayvion Labs Ltd. All rights reserved.
        </span>

        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
            <button
              key={l}
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.3)",
                fontSize: 12,
                fontFamily: "'Cabinet Grotesk', sans-serif",
                padding: 0,
                transition: "color 0.18s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
              }
            >
              {l}
            </button>
          ))}
        </div>

        {/* Status indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              background: "#22c55e",
              borderRadius: "50%",
              display: "inline-block",
            }}
          />
          All systems operational
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT ────────────────────────────────────────────────────────────────── */
export default function KayvionLabs() {
  const isTouch = useIsTouch();
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProject, setSelectedProject] = useState(null);

  // Navigation handlers
  const handleNavigate = (destination) => {
    if (destination === "projects") {
      setCurrentPage("projects");
      setSelectedProject(null);
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (destination === "home") {
      setCurrentPage("home");
      setSelectedProject(null);
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (destination === "contact") {
      // Scroll to contact section if on home page, otherwise go home and scroll
      if (currentPage !== "home") {
        setCurrentPage("home");
        setSelectedProject(null);
        setTimeout(() => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // For other sections, scroll to them on home page
      if (currentPage !== "home") {
        setCurrentPage("home");
        setSelectedProject(null);
        setTimeout(() => {
          document.getElementById(destination)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById(destination)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setCurrentPage("project-detail");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleBackToProjects = () => {
    setCurrentPage("projects");
    setSelectedProject(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Update Navbar to pass handler
  const renderNavbar = () => {
    const NavbarWithNav = () => {
      const [open, setOpen] = useState(false);
      const [solid, setSolid] = useState(false);
      const { isDesktop } = useBreakpoint();

      useEffect(() => {
        const h = () => setSolid(window.scrollY > 32);
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
      }, []);

      useEffect(() => {
        if (isDesktop) setOpen(false);
      }, [isDesktop]);

      const go = (id) => {
        handleNavigate(id);
        setOpen(false);
      };

      return (
        <>
          <motion.nav
            initial={{ y: -72 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: "0 0 auto 0",
              zIndex: 500,
              transition: "background 0.3s, border-color 0.3s",
              background: solid ? "rgba(247,247,245,0.92)" : "transparent",
              backdropFilter: solid ? "blur(14px)" : "none",
              borderBottom: solid
                ? `1px solid ${T.border}`
                : "1px solid transparent",
            }}
          >
            <div
              style={{
                maxWidth: 1280,
                margin: "0 auto",
                padding: "0 clamp(20px,5vw,40px)",
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Logo */}
              <button
                data-hover
                onClick={() => go("hero")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: isDesktop ? "none" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <KMark size={28} />
                <span
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 24,
                    fontWeight: 600,
                    color: T.ink,
                    letterSpacing: "-0.4px",
                  }}
                >
                  Kayvion<span style={{ color: T.accent }}>Labs</span>
                </span>
              </button>

              {/* Desktop nav links */}
              {isDesktop && (
                <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
                  {["Services", "About", "Pricing", "Projects", "Testimonials", "Contact"].map(
                    (l) => (
                      <button
                        key={l}
                        data-hover
                        onClick={() => go(l.toLowerCase())}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "none",
                          fontFamily: "'Cabinet Grotesk', sans-serif",
                          fontSize: 24,
                          fontWeight: l === "Projects" ? 700 : 500,
                          color: l === "Projects" ? T.ink : T.muted,
                          letterSpacing: "0.01em",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = T.ink)}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = l === "Projects" ? T.ink : T.muted)
                        }
                      >
                        {l}
                      </button>
                    ),
                  )}
                  <motion.button
                    data-hover
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => go("contact")}
                    style={{
                      cursor: "none",
                      background: T.ink,
                      color: T.white,
                      border: "none",
                      padding: "10px 24px",
                      borderRadius: 100,
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      letterSpacing: "0.01em",
                    }}
                  >
                    Let's talk
                  </motion.button>
                </div>
              )}

              {/* Hamburger — mobile/tablet */}
              {!isDesktop && (
                <button
                  onClick={() => setOpen(!open)}
                  aria-label={open ? "Close menu" : "Open menu"}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 5,
                    padding: 8,
                    zIndex: 600,
                  }}
                >
                  {[0, 1].map((i) => (
                    <motion.span
                      key={i}
                      animate={{
                        rotate: open ? (i === 0 ? 45 : -45) : 0,
                        y: open ? (i === 0 ? 6.5 : -6.5) : 0,
                      }}
                      transition={{ duration: 0.25 }}
                      style={{
                        display: "block",
                        width: 22,
                        height: 1.5,
                        background: open ? T.ink : T.ink,
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </button>
              )}
            </div>
          </motion.nav>

          {/* Mobile full-screen menu overlay */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 490,
                  background: T.bg,
                  paddingTop: 88,
                  paddingLeft: "clamp(24px,8vw,48px)",
                  paddingBottom: 40,
                  overflowY: "auto",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {["Services", "About", "Pricing", "Projects", "Testimonials", "Contact"].map(
                    (l, i) => (
                      <motion.button
                        key={l}
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => go(l.toLowerCase())}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "'Clash Display', sans-serif",
                          fontSize: "clamp(36px,9vw,64px)",
                          fontWeight: 600,
                          color: T.ink,
                          letterSpacing: "-2px",
                          lineHeight: 1.2,
                          padding: "6px 0",
                        }}
                      >
                        {l}
                      </motion.button>
                    ),
                  )}
                </div>
                {/* Mobile contact info at bottom */}
                <div
                  style={{
                    marginTop: 40,
                    borderTop: `1px solid ${T.border}`,
                    paddingTop: 28,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontSize: 14,
                      color: T.muted,
                    }}
                  >
                    hello@kayvionlabs.com
                  </p>
                  <p
                    style={{
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontSize: 14,
                      color: T.muted,
                      marginTop: 4,
                    }}
                  >
                    Nairobi, Kenya · Remote worldwide
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      );
    };
    return <NavbarWithNav />;
  };

  // Render projects index page
  const renderProjectsIndex = () => (
    <ProjectsIndex 
      onNavigate={handleNavigate} 
      onSelectProject={handleSelectProject} 
    />
  );

// Render project detail page
  const renderProjectDetail = () => (
    <ProjectDetail 
      project={selectedProject} 
      allProjects={PROJECTS}
      onNavigate={handleNavigate} 
      onBack={handleBackToProjects}
      onSelectProject={handleSelectProject}
    />
  );

  // Render main home page content
  const renderHomePage = () => (
    <>
      <Hero />
      <Services />
      <About />
      <Pricing />
      <Testimonials />
      <Contact />
    </>
  );

  return (
    <div style={{ background: T.bg, color: T.ink, overflowX: "hidden" }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,600,700,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; }
        @media (hover: none) {
          body { cursor: auto !important; }
          button { cursor: pointer !important; }
          input, textarea, select { cursor: auto !important; }
        }
        @media (hover: hover) {
          body { cursor: none; }
        }
        ::selection { background: rgba(34,85,255,0.15); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        input, textarea, select {
          font-family: inherit;
          -webkit-appearance: none;
        }
        input::placeholder, textarea::placeholder { color: ${T.muted}; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      <Cursor />
      {renderNavbar()}
      <main>
        {currentPage === "home" && renderHomePage()}
        {currentPage === "projects" && renderProjectsIndex()}
        {currentPage === "project-detail" && renderProjectDetail()}
      </main>
      {currentPage === "home" && <Footer />}
    </div>
  );
}

// // KayvionLabs.jsx — Award-tier redesign, fully responsive
// // Fonts: Clash Display + Cabinet Grotesk (Fontshare CDN)
// // Animations: Framer Motion

// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   motion, AnimatePresence, useScroll, useTransform,
//   useSpring, useMotionValue, useInView,
// } from "framer-motion";

// /* ─── TOKENS ──────────────────────────────────────────────────────────────── */
// const T = {
//   bg:        "#F7F7F5",
//   bgAlt:     "#F0F0EC",
//   ink:       "#0A0A0A",
//   muted:     "#8B8B85",
//   border:    "#E2E2DC",
//   accent:    "#2255FF",
//   accentDim: "rgba(34,85,255,0.08)",
//   white:     "#FFFFFF",
// };

// /* ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────── */
// function useBreakpoint() {
//   const [width, setWidth] = useState(() =>
//     typeof window !== "undefined" ? window.innerWidth : 1280
//   );
//   useEffect(() => {
//     const h = () => setWidth(window.innerWidth);
//     window.addEventListener("resize", h);
//     return () => window.removeEventListener("resize", h);
//   }, []);
//   return {
//     isMobile:  width < 560,
//     isTablet:  width < 768,
//     isDesktop: width >= 960,
//     width,
//   };
// }

// /* ─── TOUCH DETECT ────────────────────────────────────────────────────────── */
// function useIsTouch() {
//   const [touch, setTouch] = useState(false);
//   useEffect(() => {
//     setTouch(window.matchMedia("(hover: none)").matches);
//   }, []);
//   return touch;
// }

// /* ─── DATA ────────────────────────────────────────────────────────────────── */
// const SERVICES = [
//   { id: "01", title: "Software Engineering",  body: "Enterprise systems, SaaS platforms, and full-stack applications engineered to production-grade standards. We write code meant to last." },
//   { id: "02", title: "AI & Machine Learning", body: "Predictive models, NLP pipelines, computer vision, and ML inference systems — deployed in the real world, not just notebooks." },
//   { id: "03", title: "Web & Mobile Apps",     body: "High-performance web applications and native mobile experiences. Designed to convert, built to scale without rewrites." },
//   { id: "04", title: "Cloud Architecture",    body: "AWS, Azure, GCP — migration, infrastructure-as-code, and managed cloud at every scale. Resilient, observable, cost-efficient." },
//   { id: "05", title: "Cybersecurity",         body: "Threat modelling, penetration testing, compliance, and continuous monitoring. Security that ships with your product, not after." },
//   { id: "06", title: "Data & Analytics",      body: "Pipelines, warehouses, dashboards, and forecasting models. From raw logs to decisions your leadership will act on." },
//   { id: "07", title: "API & Integration",     body: "RESTful APIs, microservices, and enterprise integration that eliminates silos, reduces latency, and unlocks velocity." },
//   { id: "08", title: "Business Automation",   body: "Workflow design and intelligent automation that multiplies throughput. We find the friction and engineer it out." },
//   { id: "09", title: "Technology Consulting", body: "Roadmapping, architecture reviews, digital transformation. Strategic advisory from engineers who have shipped, not just advised." },
// ];

// const PLANS = [
//   { tier: "Starter",    tag: "Startups & Small Teams",     features: ["Web or mobile application", "Basic API integration", "Cloud deployment", "30-day support"] },
//   { tier: "Growth",     tag: "Scaling Organisations",      features: ["Full-stack development", "AI/ML integration", "Cloud architecture & DevOps", "90-day SLA", "Dedicated PM"], hot: true },
//   { tier: "Enterprise", tag: "Complex & Mission-Critical", features: ["Multi-system architecture", "Cybersecurity layer", "Data science pipelines", "24/7 monitoring", "On-site consulting"] },
// ];

// const TESTIMONIALS = [
//   { q: "They delivered a platform handling 50,000 daily transactions without a hiccup. Rare to say this honestly — the engineering quality is exceptional.", name: "Amara Diallo",  role: "CTO, FinEdge Africa",    init: "AD" },
//   { q: "Our AI reporting system cut analyst time by 70%. Kayvion understood our data immediately and built something we couldn't have imagined doing alone.",  name: "Seun Adeyemi", role: "Head of Ops, PetroLogic", init: "SA" },
//   { q: "From discovery to deployment — clear, on-schedule, outcome exceeded expectations. That combination is genuinely rare in the industry.",                name: "Ngozi Okafor", role: "Founder, HealthTrack",    init: "NO" },
// ];

// const TICKER_ITEMS = ["Software Engineering","AI Systems","Cloud Architecture","Cybersecurity","Data Science","Mobile Apps","API Development","Business Automation","Technology Consulting"];

// const STATS = [
//   { v: "120+", l: "Projects shipped" },
//   { v: "98%",  l: "Client retention" },
//   { v: "14",   l: "Countries" },
//   { v: "8yr",  l: "In operation" },
// ];

// /* ─── ANIMATION HELPERS ───────────────────────────────────────────────────── */
// const clipReveal = {
//   hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
//   show:   { clipPath: "inset(0 0% 0 0)",   opacity: 1, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
// };
// const fadeSlide = (dir = 1) => ({
//   hidden: { opacity: 0, y: 40 * dir },
//   show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
// });
// const stag = (d = 0.08) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });

// function useAnimInView(once = true) {
//   const ref = useRef(null);
//   const inView = useInView(ref, { once, margin: "-60px" });
//   return [ref, inView];
// }

// /* ─── CURSOR ──────────────────────────────────────────────────────────────── */
// function Cursor() {
//   const isTouch = useIsTouch();
//   const cx = useMotionValue(-100);
//   const cy = useMotionValue(-100);
//   const sx = useSpring(cx, { stiffness: 180, damping: 22 });
//   const sy = useSpring(cy, { stiffness: 180, damping: 22 });
//   const [hovered, setHovered] = useState(false);
//   const scale = useSpring(hovered ? 3.5 : 1, { stiffness: 200, damping: 20 });

//   useEffect(() => {
//     if (isTouch) return;
//     const move = (e) => { cx.set(e.clientX); cy.set(e.clientY); };
//     const over  = (e) => { if (e.target.closest("button, a, [data-hover]")) setHovered(true); };
//     const out   = () => setHovered(false);
//     window.addEventListener("mousemove", move);
//     window.addEventListener("mouseover", over);
//     window.addEventListener("mouseout",  out);
//     return () => {
//       window.removeEventListener("mousemove", move);
//       window.removeEventListener("mouseover", over);
//       window.removeEventListener("mouseout",  out);
//     };
//   }, [isTouch]);

//   if (isTouch) return null;

//   return (
//     <motion.div
//       style={{
//         position: "fixed", top: 0, left: 0, width: 10, height: 10,
//         borderRadius: "50%", background: T.accent, pointerEvents: "none",
//         zIndex: 9999, x: sx, y: sy, translateX: "-50%", translateY: "-50%",
//         scale, mixBlendMode: "multiply",
//       }}
//     />
//   );
// }

// /* ─── LOGO MARK ───────────────────────────────────────────────────────────── */
// function KMark({ size = 32, color = T.accent }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
//       <path d="M6 4 L6 28"   stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
//       <path d="M6 16 L22 5"  stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
//       <path d="M6 16 L22 27" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
//       <path d="M18 8 Q26 4 27 11 Q28 17 20 17" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
//     </svg>
//   );
// }

// /* ─── TICKER ──────────────────────────────────────────────────────────────── */
// function Ticker() {
//   const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
//   return (
//     <div style={{ overflow: "hidden", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "14px 0", background: T.bg }}>
//       <motion.div
//         animate={{ x: ["0%", "-50%"] }}
//         transition={{ duration: 24, ease: "linear", repeat: Infinity }}
//         style={{ display: "flex", gap: 0, whiteSpace: "nowrap", width: "max-content" }}
//       >
//         {items.map((item, i) => (
//           <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 28, padding: "0 28px", fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: T.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
//             {item}
//             <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.accent, display: "inline-block", flexShrink: 0 }} />
//           </span>
//         ))}
//       </motion.div>
//     </div>
//   );
// }

// /* ─── NAVBAR ──────────────────────────────────────────────────────────────── */
// function Navbar() {
//   const [open, setOpen]   = useState(false);
//   const [solid, setSolid] = useState(false);
//   const { isDesktop }     = useBreakpoint();

//   useEffect(() => {
//     const h = () => setSolid(window.scrollY > 32);
//     window.addEventListener("scroll", h);
//     return () => window.removeEventListener("scroll", h);
//   }, []);

//   // Close menu if resized to desktop
//   useEffect(() => { if (isDesktop) setOpen(false); }, [isDesktop]);

//   const go = (id) => {
//     document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
//     setOpen(false);
//   };

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -72 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
//         style={{
//           position: "fixed", inset: "0 0 auto 0", zIndex: 500,
//           transition: "background 0.3s, border-color 0.3s",
//           background: solid ? "rgba(247,247,245,0.92)" : "transparent",
//           backdropFilter: solid ? "blur(14px)" : "none",
//           borderBottom: solid ? `1px solid ${T.border}` : "1px solid transparent",
//         }}
//       >
//         <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           {/* Logo */}
//           <button data-hover onClick={() => go("hero")} style={{ background: "none", border: "none", cursor: isDesktop ? "none" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
//             <KMark size={28} />
//             <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 17, fontWeight: 600, color: T.ink, letterSpacing: "-0.4px" }}>
//               Kayvion<span style={{ color: T.accent }}>Labs</span>
//             </span>
//           </button>

//           {/* Desktop nav links */}
//           {isDesktop && (
//             <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
//               {["Services","About","Pricing","Testimonials","Contact"].map(l => (
//                 <button key={l} data-hover onClick={() => go(l.toLowerCase())}
//                   style={{ background: "none", border: "none", cursor: "none", fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 500, color: T.muted, letterSpacing: "0.01em" }}
//                   onMouseEnter={e => e.currentTarget.style.color = T.ink}
//                   onMouseLeave={e => e.currentTarget.style.color = T.muted}>
//                   {l}
//                 </button>
//               ))}
//               <motion.button data-hover whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => go("contact")}
//                 style={{ cursor: "none", background: T.ink, color: T.white, border: "none", padding: "10px 24px", borderRadius: 100, fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.01em" }}>
//                 Let's talk
//               </motion.button>
//             </div>
//           )}

//           {/* Hamburger — mobile/tablet */}
//           {!isDesktop && (
//             <button onClick={() => setOpen(!open)}
//               aria-label={open ? "Close menu" : "Open menu"}
//               style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", gap: 5, padding: 8, zIndex: 600 }}>
//               {[0, 1].map(i => (
//                 <motion.span key={i}
//                   animate={{ rotate: open ? (i === 0 ? 45 : -45) : 0, y: open ? (i === 0 ? 6.5 : -6.5) : 0 }}
//                   transition={{ duration: 0.25 }}
//                   style={{ display: "block", width: 22, height: 1.5, background: open ? T.ink : T.ink, borderRadius: 1 }}
//                 />
//               ))}
//             </button>
//           )}
//         </div>
//       </motion.nav>

//       {/* Mobile full-screen menu overlay */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
//             transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
//             style={{ position: "fixed", inset: 0, zIndex: 490, background: T.bg, paddingTop: 88, paddingLeft: "clamp(24px,8vw,48px)", paddingBottom: 40, overflowY: "auto" }}>
//             <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//               {["Services","About","Pricing","Testimonials","Contact"].map((l, i) => (
//                 <motion.button key={l}
//                   initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
//                   onClick={() => go(l.toLowerCase())}
//                   style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(36px,9vw,64px)", fontWeight: 600, color: T.ink, letterSpacing: "-2px", lineHeight: 1.2, padding: "6px 0" }}>
//                   {l}
//                 </motion.button>
//               ))}
//             </div>
//             {/* Mobile contact info at bottom */}
//             <div style={{ marginTop: 40, borderTop: `1px solid ${T.border}`, paddingTop: 28 }}>
//               <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, color: T.muted }}>hello@kayvionlabs.com</p>
//               <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, color: T.muted, marginTop: 4 }}>Nairobi, Kenya · Remote worldwide</p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// /* ─── HERO ────────────────────────────────────────────────────────────────── */
// const HERO_CHARS = "Intelligent".split("");

// function Hero() {
//   const [ready, setReady]   = useState(false);
//   const { scrollY }         = useScroll();
//   const { isMobile, isTablet } = useBreakpoint();
//   const y = useTransform(scrollY, [0, 600], [0, isMobile ? 40 : 100]);

//   useEffect(() => {
//     const t = setTimeout(() => setReady(true), 200);
//     return () => clearTimeout(t);
//   }, []);

//   const heroFontSize = "clamp(52px, 11vw, 180px)";
//   const heroLetterSpacing = isMobile ? "-2px" : "-4px";

//   return (
//     <section id="hero" style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 64, overflow: "hidden", position: "relative" }}>
//       {/* Grid background */}
//       <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`, backgroundSize: "80px 80px", opacity: 0.5, pointerEvents: "none" }} />

//       <motion.div style={{ y, maxWidth: 1280, margin: "0 auto", padding: "clamp(48px,8vw,80px) clamp(20px,5vw,40px) clamp(60px,8vw,100px)", width: "100%", position: "relative" }}>

//         {/* Eyebrow */}
//         <AnimatePresence>
//           {ready && (
//             <motion.div
//               initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
//               style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: isMobile ? 32 : 48, flexWrap: "wrap" }}>
//               <KMark size={20} />
//               <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Building Intelligent Systems</span>
//               <span style={{ width: 1, height: 12, background: T.border, display: "inline-block" }} />
//               <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, color: T.muted }}>Nairobi · Global</span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Character-stagger headline */}
//         <div style={{ overflow: "hidden" }}>
//           <motion.div style={{ display: "flex", flexWrap: "wrap", lineHeight: 0.95 }}>
//             {ready && HERO_CHARS.map((ch, i) => (
//               <motion.span key={i}
//                 initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }}
//                 transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.04 }}
//                 style={{ display: "inline-block", fontFamily: "'Clash Display', sans-serif", fontSize: heroFontSize, fontWeight: 700, letterSpacing: heroLetterSpacing, color: ch === " " ? "transparent" : T.ink, lineHeight: 0.92 }}>
//                 {ch === " " ? "\u00A0" : ch}
//               </motion.span>
//             ))}
//           </motion.div>
//         </div>

//         {/* "Systems." */}
//         <div style={{ overflow: "hidden" }}>
//           {ready && (
//             <motion.div
//               initial={{ y: "100%" }} animate={{ y: "0%" }}
//               transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
//               style={{ display: "inline-flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
//               <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: heroFontSize, fontWeight: 700, letterSpacing: heroLetterSpacing, color: T.accent, lineHeight: 0.92, display: "inline-block" }}>
//                 Systems.
//               </span>
//             </motion.div>
//           )}
//         </div>

//         {/* Sub + CTA */}
//         {ready && (
//           <motion.div
//             initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.1 }}
//             style={{ marginTop: isMobile ? 36 : 52, display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-end", flexWrap: "wrap", gap: 28 }}>
//             <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "clamp(15px,1.8vw,20px)", color: T.muted, lineHeight: 1.65, maxWidth: 440 }}>
//               End-to-end ICT services — software engineering, AI, cloud, and cybersecurity — for organisations that need technology to actually work.
//             </p>
//             <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
//               <MagneticBtn dark onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
//                 Start a project
//               </MagneticBtn>
//               <MagneticBtn onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
//                 View services
//               </MagneticBtn>
//             </div>
//           </motion.div>
//         )}

//         {/* Stats */}
//         {ready && (
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.6 }}
//             style={{
//               marginTop: isMobile ? 56 : 88,
//               paddingTop: 36,
//               borderTop: `1px solid ${T.border}`,
//               display: "grid",
//               gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
//               gap: isMobile ? "24px 0" : 0,
//             }}>
//             {STATS.map((s, i) => (
//               <div key={i} style={{
//                 paddingLeft:  (isMobile ? i % 2 !== 0 : i !== 0) ? 24 : 0,
//                 paddingRight: 24,
//                 borderRight:  isMobile
//                   ? (i % 2 === 0 ? `1px solid ${T.border}` : "none")
//                   : (i < 3 ? `1px solid ${T.border}` : "none"),
//                 borderBottom: isMobile && i < 2 ? `1px solid ${T.border}` : "none",
//                 paddingBottom: isMobile && i < 2 ? 24 : 0,
//               }}>
//                 <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(24px,3.5vw,48px)", fontWeight: 700, letterSpacing: "-1.5px", color: T.ink }}>{s.v}</div>
//                 <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, color: T.muted, marginTop: 4 }}>{s.l}</div>
//               </div>
//             ))}
//           </motion.div>
//         )}
//       </motion.div>
//     </section>
//   );
// }

// /* ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────── */
// function MagneticBtn({ children, dark, onClick }) {
//   const ref      = useRef(null);
//   const isTouch  = useIsTouch();
//   const x        = useMotionValue(0);
//   const y        = useMotionValue(0);
//   const sx       = useSpring(x, { stiffness: 200, damping: 18 });
//   const sy       = useSpring(y, { stiffness: 200, damping: 18 });

//   const onMove  = (e) => {
//     if (isTouch) return;
//     const r = ref.current?.getBoundingClientRect();
//     if (!r) return;
//     x.set((e.clientX - r.left - r.width / 2) * 0.35);
//     y.set((e.clientY - r.top  - r.height / 2) * 0.35);
//   };
//   const onLeave = () => { x.set(0); y.set(0); };

//   return (
//     <motion.button
//       ref={ref} data-hover onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
//       whileTap={{ scale: 0.95 }}
//       style={{
//         x: sx, y: sy,
//         cursor: isTouch ? "pointer" : "none",
//         border:      dark ? "none" : `1.5px solid ${T.border}`,
//         background:  dark ? T.ink  : "transparent",
//         color:       dark ? T.white : T.ink,
//         padding:     "13px 30px",
//         borderRadius: 100,
//         fontFamily:  "'Cabinet Grotesk', sans-serif",
//         fontWeight:  700, fontSize: 15,
//         display:     "inline-flex", alignItems: "center", gap: 8,
//         transition:  "background 0.2s, color 0.2s, border-color 0.2s",
//         whiteSpace:  "nowrap",
//       }}
//       onMouseEnter={e => { if (!dark) e.currentTarget.style.borderColor = T.ink; }}
//       onMouseLeave={e => { if (!dark) e.currentTarget.style.borderColor = T.border; }}>
//       {children}
//       {dark && <span style={{ fontSize: 16, marginLeft: 2 }}>→</span>}
//     </motion.button>
//   );
// }

// /* ─── SERVICES ────────────────────────────────────────────────────────────── */
// function Services() {
//   const [active, setActive]   = useState(0);
//   const [openIdx, setOpenIdx] = useState(null); // accordion for mobile
//   const [ref, inView]         = useAnimInView();
//   const { isTablet }          = useBreakpoint();

//   const toggleAccordion = (i) => setOpenIdx(openIdx === i ? null : i);

//   return (
//     <section id="services" style={{ background: T.bg, padding: "120px 0 0" }}>
//       <Ticker />
//       <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px clamp(20px,5vw,40px)" }}>
//         <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>
//           <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase", marginBottom: 14 }}>
//             What we do
//           </motion.p>
//           <motion.h2 variants={clipReveal} style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px,5vw,72px)", fontWeight: 700, letterSpacing: isTablet ? "-1.5px" : "-2.5px", color: T.ink, marginBottom: 72, lineHeight: 1.02, maxWidth: 700 }}>
//             A full spectrum of ICT capability
//           </motion.h2>
//         </motion.div>

//         {isTablet ? (
//           /* ── Mobile / Tablet: Accordion ── */
//           <div style={{ borderTop: `1px solid ${T.border}` }}>
//             {SERVICES.map((s, i) => (
//               <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
//                 <button onClick={() => toggleAccordion(i)}
//                   style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "20px 4px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
//                     <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, color: openIdx === i ? T.accent : T.muted, fontWeight: 600, letterSpacing: "0.08em" }}>{s.id}</span>
//                     <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 17, fontWeight: 600, color: openIdx === i ? T.ink : T.muted, letterSpacing: "-0.3px" }}>{s.title}</span>
//                   </div>
//                   <motion.span animate={{ rotate: openIdx === i ? 45 : 0 }} transition={{ duration: 0.25 }}
//                     style={{ fontSize: 22, color: T.accent, lineHeight: 1, flexShrink: 0, marginLeft: 12 }}>
//                     +
//                   </motion.span>
//                 </button>
//                 <AnimatePresence>
//                   {openIdx === i && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
//                       style={{ overflow: "hidden" }}>
//                       <div style={{ padding: "0 4px 24px" }}>
//                         <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.muted, lineHeight: 1.72, marginBottom: 20 }}>{s.body}</p>
//                         <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
//                           style={{ background: "none", border: `1.5px solid ${T.border}`, color: T.ink, padding: "10px 22px", borderRadius: 100, fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
//                           Discuss this service →
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ))}
//           </div>
//         ) : (
//           /* ── Desktop: Tab panel ── */
//           <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${T.border}` }}>
//             {/* Left index */}
//             <div style={{ width: "40%", flexShrink: 0, borderRight: `1px solid ${T.border}` }}>
//               {SERVICES.map((s, i) => (
//                 <motion.button key={i} data-hover onClick={() => setActive(i)}
//                   whileHover={{ x: 6 }}
//                   style={{ width: "100%", textAlign: "left", background: active === i ? T.bgAlt : "transparent", border: "none", borderBottom: `1px solid ${T.border}`, padding: "22px 28px 22px 24px", cursor: "none", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.2s", borderLeft: active === i ? `3px solid ${T.accent}` : "3px solid transparent" }}>
//                   <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
//                     <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, color: active === i ? T.accent : T.muted, fontWeight: 600, letterSpacing: "0.08em" }}>{s.id}</span>
//                     <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 16, fontWeight: 600, color: active === i ? T.ink : T.muted, letterSpacing: "-0.3px" }}>{s.title}</span>
//                   </div>
//                   <motion.span animate={{ x: active === i ? 0 : -4, opacity: active === i ? 1 : 0 }} style={{ color: T.accent, fontSize: 18 }}>→</motion.span>
//                 </motion.button>
//               ))}
//             </div>
//             {/* Right content */}
//             <div style={{ flex: 1, padding: "48px 52px", minHeight: 400, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//               <AnimatePresence mode="wait">
//                 <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
//                   <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: T.accent, textTransform: "uppercase", marginBottom: 20 }}>
//                     {SERVICES[active].id} / {SERVICES.length.toString().padStart(2, "0")}
//                   </div>
//                   <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px,3.5vw,52px)", fontWeight: 700, letterSpacing: "-1.5px", color: T.ink, marginBottom: 24, lineHeight: 1.08 }}>
//                     {SERVICES[active].title}
//                   </h3>
//                   <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 18, color: T.muted, lineHeight: 1.72, maxWidth: 480 }}>
//                     {SERVICES[active].body}
//                   </p>
//                   <div style={{ marginTop: 40 }}>
//                     <MagneticBtn onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
//                       Discuss this service
//                     </MagneticBtn>
//                   </div>
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// /* ─── ABOUT ───────────────────────────────────────────────────────────────── */
// function About() {
//   const [ref, inView] = useAnimInView();
//   const { isTablet }  = useBreakpoint();

//   return (
//     <section id="about" style={{ background: T.bgAlt, padding: "clamp(72px,10vw,120px) 0" }}>
//       <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 clamp(20px,5vw,40px)` }}>
//         <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>
//           <div style={{ display: "flex", gap: isTablet ? 40 : 80, flexDirection: isTablet ? "column" : "row", alignItems: "flex-start" }}>
//             {/* Left copy */}
//             <div style={{ flex: "1 1 44%", minWidth: 0 }}>
//               <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase", marginBottom: 14 }}>About</motion.p>
//               <motion.h2 variants={clipReveal}
//                 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px,5vw,64px)", fontWeight: 700, letterSpacing: isTablet ? "-1.5px" : "-2px", color: T.ink, lineHeight: 1.04, marginBottom: 32 }}>
//                 Built by engineers.<br />Driven by outcomes.
//               </motion.h2>
//               <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 17, color: T.muted, lineHeight: 1.78, marginBottom: 18 }}>
//                 Kayvion Labs is an ICT services company that partners with organisations to solve hard technology problems. We don't sell products — we deliver outcomes.
//               </motion.p>
//               <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 17, color: T.muted, lineHeight: 1.78, marginBottom: 44 }}>
//                 Our team spans software engineers, data scientists, cloud architects, and security specialists across 14 countries. What ties every engagement together is craft, reliability, and measurable impact.
//               </motion.p>
//               <motion.div variants={fadeSlide()}>
//                 <MagneticBtn dark onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
//                   Work with us
//                 </MagneticBtn>
//               </motion.div>
//             </div>

//             {/* Right pillars */}
//             <div style={{ flex: "1 1 44%", minWidth: 0 }}>
//               {[
//                 { t: "Engineering-first",   d: "Every decision is made by practitioners, not account managers. You speak directly with the people building your system." },
//                 { t: "Transparent process", d: "Weekly updates, shared repositories, no black-box delivery. You always know where your project stands." },
//                 { t: "Security by design",  d: "Compliance and threat modelling are built in from day one, not bolted on after launch." },
//                 { t: "Long-term thinking",  d: "We write code we'd be proud to maintain — because we often do. No quick fixes, no technical debt by default." },
//               ].map((v, i) => (
//                 <motion.div key={i} variants={fadeSlide()} style={{ borderBottom: `1px solid ${T.border}`, padding: "28px 0", display: "flex", gap: 24, alignItems: "flex-start" }}>
//                   <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: "0.08em", marginTop: 4, flexShrink: 0 }}>0{i+1}</span>
//                   <div>
//                     <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: "-0.3px", marginBottom: 8 }}>{v.t}</div>
//                     <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 15, color: T.muted, lineHeight: 1.65 }}>{v.d}</div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// /* ─── PRICING ─────────────────────────────────────────────────────────────── */
// function Pricing() {
//   const [ref, inView] = useAnimInView();
//   const { isTablet }  = useBreakpoint();

//   return (
//     <section id="pricing" style={{ background: T.bg, padding: "clamp(72px,10vw,120px) 0" }}>
//       <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 clamp(20px,5vw,40px)` }}>
//         <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>
//           <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase", marginBottom: 14 }}>
//             Engagement models
//           </motion.p>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
//             <motion.h2 variants={clipReveal}
//               style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px,5vw,64px)", fontWeight: 700, letterSpacing: isTablet ? "-1.5px" : "-2px", color: T.ink, lineHeight: 1.04 }}>
//               Every project<br />scoped for you.
//             </motion.h2>
//             <motion.p variants={fadeSlide()}
//               style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.muted, maxWidth: 380, lineHeight: 1.7 }}>
//               No off-the-shelf pricing. These tiers are a starting framework — every engagement is shaped in a discovery conversation.
//             </motion.p>
//           </div>

//           <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
//             {PLANS.map((p, i) => (
//               <motion.div key={i} variants={fadeSlide()}
//                 style={{
//                   display: "flex",
//                   flexDirection: isTablet ? "column" : "row",
//                   justifyContent: isTablet ? "flex-start" : "space-between",
//                   alignItems: isTablet ? "flex-start" : "center",
//                   flexWrap: "wrap",
//                   gap: isTablet ? 20 : 24,
//                   padding: isTablet ? "28px 24px" : "36px 40px",
//                   borderBottom: i < PLANS.length - 1 ? `1px solid ${T.border}` : "none",
//                   background: p.hot ? T.ink : T.white,
//                   position: "relative",
//                 }}>
//                 {p.hot && (
//                   <div style={{ position: "absolute", top: 16, right: 16, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.1em" }}>POPULAR</div>
//                 )}
//                 <div style={{ minWidth: 160 }}>
//                   <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: p.hot ? "rgba(255,255,255,0.5)" : T.muted, textTransform: "uppercase", marginBottom: 6 }}>{p.tag}</div>
//                   <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(22px,2.5vw,36px)", fontWeight: 700, letterSpacing: "-1px", color: p.hot ? T.white : T.ink }}>{p.tier}</div>
//                 </div>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: isTablet ? "10px 16px" : "12px 20px", flex: isTablet ? "unset" : 1, justifyContent: isTablet ? "flex-start" : "center" }}>
//                   {p.features.map((f, j) => (
//                     <span key={j} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, color: p.hot ? "rgba(255,255,255,0.65)" : T.muted, display: "inline-flex", alignItems: "center", gap: 6 }}>
//                       <span style={{ color: T.accent, fontSize: 12 }}>✓</span> {f}
//                     </span>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
//                   style={{ cursor: "pointer", background: p.hot ? T.white : T.ink, color: p.hot ? T.ink : T.white, border: "none", padding: "12px 28px", borderRadius: 100, fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", flexShrink: 0 }}>
//                   Talk to us →
//                 </button>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// /* ─── TESTIMONIALS ────────────────────────────────────────────────────────── */
// function Testimonials() {
//   const [ref, inView] = useAnimInView();
//   const { isTablet, isMobile } = useBreakpoint();

//   const cols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3,1fr)";

//   return (
//     <section id="testimonials" style={{ background: T.bgAlt, padding: "clamp(72px,10vw,120px) 0" }}>
//       <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 clamp(20px,5vw,40px)` }}>
//         <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>
//           <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase", marginBottom: 14 }}>
//             Testimonials
//           </motion.p>
//           <motion.h2 variants={clipReveal}
//             style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px,5vw,64px)", fontWeight: 700, letterSpacing: isTablet ? "-1.5px" : "-2px", color: T.ink, lineHeight: 1.04, marginBottom: 64 }}>
//             Clients who took<br />the leap.
//           </motion.h2>

//           <div style={{ display: "grid", gridTemplateColumns: cols, gap: 20 }}>
//             {TESTIMONIALS.map((t, i) => (
//               <motion.div key={i} variants={fadeSlide()}
//                 whileHover={{ y: -6 }}
//                 style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "36px clamp(20px,3vw,32px)", cursor: "default" }}>
//                 <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 52, color: T.accent, opacity: 0.18, lineHeight: 1, marginBottom: 20, userSelect: "none" }}>"</div>
//                 <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.ink, lineHeight: 1.72, marginBottom: 32 }}>"{t.q}"</p>
//                 <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
//                   <div style={{ width: 38, height: 38, borderRadius: "50%", background: T.ink, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "'Clash Display', sans-serif", flexShrink: 0 }}>{t.init}</div>
//                   <div>
//                     <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 15, fontWeight: 600, color: T.ink, letterSpacing: "-0.2px" }}>{t.name}</div>
//                     <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, color: T.muted, marginTop: 2 }}>{t.role}</div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// /* ─── CONTACT ─────────────────────────────────────────────────────────────── */
// function Contact() {
//   const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
//   const [sent, setSent] = useState(false);
//   const [ref, inView]  = useAnimInView();
//   const { isTablet, isMobile } = useBreakpoint();

//   const inp = {
//     background: T.white, border: `1px solid ${T.border}`, color: T.ink,
//     padding: "14px 18px", borderRadius: 8,
//     fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 15,
//     outline: "none", width: "100%", transition: "border-color 0.2s",
//   };

//   return (
//     <section id="contact" style={{ background: T.bg, padding: "clamp(72px,10vw,120px) 0" }}>
//       <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 clamp(20px,5vw,40px)` }}>
//         <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>

//           {/* CTA band */}
//           <motion.div variants={fadeSlide()} style={{
//             background: T.ink, borderRadius: isTablet ? 14 : 20,
//             padding: isTablet ? "48px clamp(24px,6vw,48px)" : "72px 64px",
//             marginBottom: 80,
//             display: "flex", justifyContent: "space-between", alignItems: "center",
//             flexDirection: isTablet ? "column" : "row",
//             flexWrap: "wrap", gap: 32,
//             position: "relative", overflow: "hidden",
//           }}>
//             <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`, backgroundSize: "28px 28px", pointerEvents: "none" }} />
//             <div style={{ position: "relative" }}>
//               <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(24px,4vw,56px)", fontWeight: 700, color: T.white, letterSpacing: isTablet ? "-1px" : "-1.5px", lineHeight: 1.08, marginBottom: 14 }}>
//                 Let's build something<br />worth building.
//               </h2>
//               <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 420, lineHeight: 1.65 }}>
//                 Whether you have a brief, a vague idea, or just a deadline — we'll help you get to clarity and execution fast.
//               </p>
//             </div>
//             <button
//               onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
//               style={{ position: "relative", cursor: "pointer", background: T.white, color: T.ink, border: "none", padding: isTablet ? "14px 28px" : "18px 40px", borderRadius: 100, fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: isTablet ? 16 : 18, letterSpacing: "-0.3px", whiteSpace: "nowrap", flexShrink: 0 }}>
//               Start a conversation →
//             </button>
//           </motion.div>

//           {/* Form row */}
//           <div id="contact-form" style={{ display: "flex", gap: isTablet ? 40 : 80, flexDirection: isTablet ? "column" : "row", flexWrap: "wrap" }}>
//             {/* Left info */}
//             <motion.div variants={fadeSlide()} style={{ flex: "1 1 36%", minWidth: 0 }}>
//               <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase", marginBottom: 14 }}>Contact</p>
//               <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(22px,3vw,42px)", fontWeight: 700, letterSpacing: "-1.2px", color: T.ink, lineHeight: 1.08, marginBottom: 22 }}>
//                 Talk to the<br />right people.
//               </h3>
//               <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.muted, lineHeight: 1.72, marginBottom: 40 }}>
//                 No sales scripts. You'll speak directly with engineers who understand what you're trying to build.
//               </p>
//               {[{ l: "Email", v: "hello@kayvionlabs.com" }, { l: "Location", v: "Nairobi, Kenya · Remote worldwide" }].map((item, i) => (
//                 <div key={i} style={{ marginBottom: 22 }}>
//                   <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: T.muted, textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
//                   <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.ink, fontWeight: 500 }}>{item.v}</div>
//                 </div>
//               ))}
//             </motion.div>

//             {/* Right form */}
//             <motion.div variants={fadeSlide()} style={{ flex: "1 1 52%", minWidth: 0 }}>
//               {sent ? (
//                 <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
//                   style={{ border: `1px solid ${T.border}`, borderRadius: 12, padding: "64px 40px", textAlign: "center", background: T.white }}>
//                   <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5 }} style={{ fontSize: 48, marginBottom: 18 }}>✓</motion.div>
//                   <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 26, fontWeight: 700, color: T.ink, letterSpacing: "-0.8px", marginBottom: 10 }}>Message received.</div>
//                   <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.muted }}>We'll be in touch within one business day.</div>
//                 </motion.div>
//               ) : (
//                 <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//                   <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
//                     {[{ p: "Your name", k: "name" }, { p: "Email address", k: "email" }].map(f => (
//                       <input key={f.k} placeholder={f.p} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} style={inp}
//                         onFocus={e => e.target.style.borderColor = T.accent}
//                         onBlur={e  => e.target.style.borderColor = T.border} />
//                     ))}
//                   </div>
//                   <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
//                     style={{ ...inp, color: form.service ? T.ink : T.muted, appearance: "auto" }}>
//                     <option value="" disabled>Service of interest</option>
//                     {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
//                   </select>
//                   <textarea placeholder="Tell us about your project…" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
//                     style={{ ...inp, resize: "vertical" }}
//                     onFocus={e => e.target.style.borderColor = T.accent}
//                     onBlur={e  => e.target.style.borderColor = T.border} />
//                   <button onClick={() => setSent(true)}
//                     style={{ cursor: "pointer", background: T.ink, color: T.white, border: "none", padding: "17px", borderRadius: 8, fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" }}>
//                     Send message →
//                   </button>
//                 </div>
//               )}
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// const FOOTER_SERVICES = ["Software Engineering","AI & Machine Learning","Cloud Architecture","Cybersecurity","Data & Analytics","Business Automation"];
// const FOOTER_COMPANY  = ["About","How we work","Careers","Case studies","Blog"];
// const FOOTER_CONTACT  = ["Start a project","Pricing","Support"];

// function Footer() {
//   const { isTablet, isMobile, width } = useBreakpoint();
//   const isNarrow = width < 860;

//   const col = {
//     padding: isNarrow ? "0" : "0 28px",
//     borderRight: (!isNarrow) ? `1px solid rgba(255,255,255,0.08)` : "none",
//   };

//   return (
//     <footer style={{ background: T.ink }}>

//       {/* ── Top: brand + nav columns ─────────────────────────────── */}
//       <div style={{
//         maxWidth: 1280, margin: "0 auto",
//         padding: `52px clamp(20px,5vw,40px) 48px`,
//         display: "grid",
//         gridTemplateColumns: isNarrow ? (isMobile ? "1fr" : "1fr 1fr") : "1.7fr 1fr 1fr 1fr",
//         gap: isNarrow ? "40px 32px" : "40px",
//         borderBottom: `1px solid rgba(255,255,255,0.08)`,
//       }}>

//         {/* Brand col */}
//         <div style={{ paddingRight: isNarrow ? 0 : 40, borderRight: isNarrow ? "none" : `1px solid rgba(255,255,255,0.08)`, gridColumn: isNarrow && !isMobile ? "1 / -1" : undefined }}>
//           {/* Logo */}
//           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
//             <KMark size={26} color="#fff" />
//             <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 17, fontWeight: 700, color: T.white, letterSpacing: "-0.4px" }}>
//               Kayvion<span style={{ color: T.accent }}>Labs</span>
//             </span>
//           </div>

//           {/* Tagline */}
//           <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.72, maxWidth: 220, marginBottom: 24 }}>
//             End-to-end ICT services for organisations that need technology to actually work.
//           </p>

//           {/* Email pill */}
//           <a href="mailto:hello@kayvionlabs.com"
//             style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,85,255,0.12)", border: "1px solid rgba(34,85,255,0.28)", borderRadius: 100, padding: "8px 14px", fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 500, textDecoration: "none", marginBottom: 28 }}>
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
//             hello@kayvionlabs.com
//           </a>

//           {/* Socials */}
//           <div style={{ display: "flex", gap: 8 }}>
//             {["LinkedIn","X","GitHub","Instagram"].map(name => (
//               <button key={name} aria-label={name}
//                 style={{ width: 34, height: 34, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, background: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}
//                 onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.color = "#fff"; }}
//                 onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}>
//                 <SocialIcon title={name} />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Services col */}
//         <div style={{ ...col }}>
//           <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 18 }}>Services</p>
//           {FOOTER_SERVICES.map(l => (
//             <button key={l} onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
//               style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.48)", fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 12, padding: 0, textAlign: "left", transition: "color 0.18s" }}
//               onMouseEnter={e => e.currentTarget.style.color = "#fff"}
//               onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.48)"}>
//               {l}
//             </button>
//           ))}
//         </div>

//         {/* Company col */}
//         <div style={{ ...col }}>
//           <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 18 }}>Company</p>
//           {FOOTER_COMPANY.map(l => (
//             <button key={l}
//               style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.48)", fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 12, padding: 0, textAlign: "left", transition: "color 0.18s" }}
//               onMouseEnter={e => e.currentTarget.style.color = "#fff"}
//               onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.48)"}>
//               {l}
//             </button>
//           ))}
//         </div>

//         {/* Contact col */}
//         <div style={{ paddingLeft: isNarrow ? 0 : 28 }}>
//           <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 18 }}>Contact</p>
//           {FOOTER_CONTACT.map(l => (
//             <button key={l} onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
//               style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.48)", fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 12, padding: 0, textAlign: "left", transition: "color 0.18s" }}
//               onMouseEnter={e => e.currentTarget.style.color = "#fff"}
//               onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.48)"}>
//               {l}
//             </button>
//           ))}

//           {/* Location badge */}
//           <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
//             <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 6 }}>Location</p>
//             <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>Nairobi, Kenya<br />Remote worldwide</p>
//           </div>
//         </div>
//       </div>

//       {/* ── CTA band ─────────────────────────────────────────────── */}
//       <div style={{
//         maxWidth: 1280, margin: "0 auto",
//         padding: `28px clamp(20px,5vw,40px)`,
//         borderBottom: `1px solid rgba(255,255,255,0.08)`,
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         flexWrap: "wrap", gap: 20,
//       }}>
//         <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: isMobile ? 16 : 20, fontWeight: 700, letterSpacing: "-0.6px", color: T.white }}>
//           Ready to build something <span style={{ color: T.accent }}>worth building?</span>
//         </p>
//         <motion.button
//           whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
//           onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
//           style={{ cursor: "pointer", background: T.accent, color: T.white, border: "none", padding: "11px 24px", borderRadius: 100, fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
//           Start a conversation
//           <span style={{ fontSize: 15 }}>→</span>
//         </motion.button>
//       </div>

//       {/* ── Bottom bar ───────────────────────────────────────────── */}
//       <div style={{
//         maxWidth: 1280, margin: "0 auto",
//         padding: `18px clamp(20px,5vw,40px)`,
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         flexWrap: "wrap", gap: 12,
//       }}>
//         <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.22)" }}>
//           © {new Date().getFullYear()} Kayvion Labs Ltd. All rights reserved.
//         </span>

//         <div style={{ display: "flex", gap: 20 }}>
//           {["Privacy Policy","Terms of Service","Cookie Policy"].map(l => (
//             <button key={l} style={{ cursor: "pointer", background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "'Cabinet Grotesk', sans-serif", padding: 0, transition: "color 0.18s" }}
//               onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
//               onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
//               {l}
//             </button>
//           ))}
//         </div>

//         {/* Status indicator */}
//         <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
//           <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
//           All systems operational
//         </div>
//       </div>

//     </footer>
//   );
// }

// /* ─── ROOT ────────────────────────────────────────────────────────────────── */
// export default function KayvionLabs() {
//   const isTouch = useIsTouch();

//   return (
//     <div style={{ background: T.bg, color: T.ink, overflowX: "hidden" }}>
//       <style>{`
//         @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,600,700,800&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         html { scroll-behavior: smooth; }
//         body { -webkit-font-smoothing: antialiased; }
//         @media (hover: none) {
//           body { cursor: auto !important; }
//           button { cursor: pointer !important; }
//           input, textarea, select { cursor: auto !important; }
//         }
//         @media (hover: hover) {
//           body { cursor: none; }
//         }
//         ::selection { background: rgba(34,85,255,0.15); }
//         ::-webkit-scrollbar { width: 5px; }
//         ::-webkit-scrollbar-track { background: ${T.bg}; }
//         ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
//         input, textarea, select {
//           font-family: inherit;
//           -webkit-appearance: none;
//         }
//         input::placeholder, textarea::placeholder { color: ${T.muted}; }
//         @media (prefers-reduced-motion: reduce) {
//           *, *::before, *::after {
//             animation-duration: 0.01ms !important;
//             transition-duration: 0.01ms !important;
//           }
//         }
//       `}</style>
//       <Cursor />
//       <Navbar />
//       <main>
//         <Hero />
//         <Services />
//         <About />
//         <Pricing />
//         <Testimonials />
//         <Contact />
//       </main>
//       <Footer />
//     </div>
//   );
// }

// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import Services from "./components/Services";
// import About from "./components/About";
// import CTA from "./components/CTA";
// import Footer from "./components/Footer";
// import { Helmet } from "react-helmet-async";

// function App() {
//   return (
//     <>
//       <Helmet
//         defaultTitle="Kayvion – Future‑Ready ICT Solutions"
//         titleTemplate="%s | Kayvion"
//       >
//         <html lang="en" />
//         <meta
//           name="description"
//           content="Software engineering, AI, cloud, cybersecurity…"
//         />
//         <meta property="og:type" content="website" />
//         <meta
//           property="og:title"
//           content="Kayvion – Future‑Ready ICT Solutions"
//         />
//         <meta
//           property="og:description"
//           content="We build future‑ready ICT solutions."
//         />
//         <meta
//           property="og:image"
//           content="https://yourdomain.com/og-image.jpg"
//         />
//         <meta name="twitter:card" content="summary_large_image" />
//         <link rel="canonical" href="https://yourdomain.com" />

//         {/* Structured Data */}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "Organization",
//             name: "Kayvion",
//             url: "https://yourdomain.com",
//             description: "ICT services: software, AI, cloud, cybersecurity.",
//             contactPoint: {
//               "@type": "ContactPoint",
//               email: "hello@Kayvion.com",
//               contactType: "sales",
//             },
//           })}
//         </script>
//       </Helmet>
//       <div className="overflow-hidden">
//         <Navbar />
//         <main>
//           <Hero />
//           <Services />
//           <About />
//           <CTA />
//         </main>
//         <Footer />
//       </div>
//     </>
//   );
// }

// export default App;
