// src/components/Layout.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "framer-motion";

/* ─── TOKENS ──────────────────────────────────────────────────────────────── */
const T = {
  bg: "#F2F1ED",
  bgAlt: "#EBE9E4",
  ink: "#1A1A1A",
  muted: "#8F8C83",
  border: "#D9D5CE",
  accent: "#2255FF",
  white: "#FFFFFF",
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

/* ─── LOGO IMAGES ────────────────────────────────────────────────────────────── */
import logoDark from "../../public/logo_dark.png";
import logoLight from "../../public/logo_light.png";

function LogoDark({ height = 68, maxWidth = 320 }) {
  return (
    <img
      src={logoDark}
      alt="Kayvion Labs Logo"
      loading="lazy"
      decoding="async"
      style={{ height, width: "auto", maxWidth, objectFit: "contain" }}
    />
  );
}

function LogoLight({ height = 68, maxWidth = 320 }) {
  return (
    <img
      src={logoLight}
      alt="Kayvion Labs Logo"
      loading="lazy"
      decoding="async"
      style={{ height, width: "auto", maxWidth, objectFit: "contain" }}
    />
  );
}

/* ─── SCRAMBLE LINK (used in Navbar) ──────────────────────────────────────── */
function ScrambleLink({ label, active, onClick, onMouseEnter }) {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [display, setDisplay] = useState(label);
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
        padding: "12px 0", // was "4px 0" — increase top/bottom padding for more height
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontSize: 19, // optional: was 14, bump slightly for more presence
        fontWeight: 700,
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

/* ─── NAVBAR ──────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  "Services",
  "About",
  "Pricing",
  "Projects",
  "Testimonials",
  "Contact",
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
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
    // If it's the projects link, navigate to the projects route
    if (id === "projects") {
      navigate("/projects");
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    // For home sections: if already on home, just scroll; otherwise navigate to home then scroll
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      // Wait for the home page to mount, then scroll
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
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
            padding: "0 clamp(20px,25vw,40px)",
            height: 82,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <button
            data-hover
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              background: "none",
              border: "none",
              cursor: isDesktop ? "none" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
            }}
          >
            <LogoLight height={32} />
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
                  height: 28,
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
                  info@kayvionlabs.com
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

/* ─── SOCIAL ICON ─────────────────────────────────────────────────────────── */
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

/* ─── FOOTER ──────────────────────────────────────────────────────────────── */
const FOOTER_SERVICES = [
  "Software Engineering",
  "AI & Machine Learning",
  "Data & Analytics",
  "API & Integrations",
  "Technology Consulting",
];
const FOOTER_CONTACT = ["Start a project", "Pricing", "Support"];

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { isMobile, width } = useBreakpoint();
  const isNarrow = width < 860;

  const scrollToSection = (id) => {
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const col = {
    padding: isNarrow ? "0" : "0 28px",
    borderRight: !isNarrow ? `1px solid rgba(255,255,255,0.08)` : "none",
  };

  return (
    <footer style={{ background: T.ink }}>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 18,
            }}
          >
            <LogoDark height={42} />
          </div>
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
          <a
            href="mailto:info@kayvionlabs.com"
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
            info@kayvionlabs.com
          </a>

          {/* <div style={{ display: "flex", gap: 8 }}>
            {[
              {
                name: "LinkedIn",
                url: "https://linkedin.com/company/kayvionlabs",
              },
              { name: "X", url: "https://x.com/kayvionlabs" },
              { name: "GitHub", url: "https://github.com/kayikalvin" },
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
          </div> */}
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
              onClick={() => scrollToSection("services")}
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
              onClick={() => scrollToSection("contact")}
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
          onClick={() => scrollToSection("contact")}
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
          Start a conversation <span style={{ fontSize: 15 }}>→</span>
        </motion.button>
      </div>

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

/* ─── LAYOUT ──────────────────────────────────────────────────────────────── */
export default function Layout() {
  // Signal prerender-ready for prerendering plugin (fires after client mount)
  useEffect(() => {
    // small delay to allow per-page Helmet tags to be applied
    const t = setTimeout(() => {
      try {
        window.dispatchEvent(new Event("prerender-ready"));
      } catch (e) {
        // ignore in non-browser environments
      }
    }, 60);
    return () => clearTimeout(t);
  }, []);
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
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
