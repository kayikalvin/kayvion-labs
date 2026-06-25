// ProjectDetail.jsx — Kayvion Labs · Individual case study page
// Matches KayvionLabs.jsx design system exactly
// Signature element: scroll-progress scrubber with floating section label on left edge
// Fonts: Clash Display + Cabinet Grotesk (Fontshare CDN)
// Animations: Framer Motion
// Now uses React Router params & navigation

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";
import SEO from "./SEO";
import { organizationSchema, projectSchema, breadcrumbSchema } from "./schema";
import { RAW_PROJECTS } from "../utils/projectdata";
import {MagneticBtn} from './MagneticBtn'

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

/* ─── HOOKS ───────────────────────────────────────────────────────────────── */
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

function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);
  return touch;
}

function useAnimInView(once = true) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px" });
  return [ref, inView];
}

/* ─── ANIMATION HELPERS ───────────────────────────────────────────────────── */
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
const clipReveal = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  show: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
  },
};

/* ─── COLOUR PALETTE (per project) ──────────────────────────────────────── */
const ACCENT_COLORS = [
  "#2255FF",
  "#00C9A7",
  "#FF6B6C",
  "#845EC2",
  "#FF9671",
  "#F9F871",
  "#FF4B6E",
  "#39A2DB",
  "#A133FF",
  "#FF9F1C",
];
const BG_COLOR = "#0A0A0A";

/* ─── SLUGIFY HELPER ─────────────────────────────────────────────────────── */
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ─── TRANSFORM RAW DATA INTO REQUIRED SHAPE ──────────────────────────────── */
const ALL_PROJECTS = RAW_PROJECTS.map((p, i) => ({
  id: slugify(p.title),
  name: p.title,
  image: p.image,
  color: BG_COLOR,
  accentColor: ACCENT_COLORS[i % ACCENT_COLORS.length],
  metric: {
    value: p.features.length.toString(),
    label: "Key Features",
  },
  client: p.title.split(" - ")[0] || p.title,
  sector: p.sector || "Technology",
  year: "2025",
  services: p.tech,
  url: p.url,
}));

/* ─── EXTENDED PROJECT DETAILS (using your data) ──────────────────────────── */
const PROJECT_DETAILS = {};
RAW_PROJECTS.forEach((p, i) => {
  const id = slugify(p.title);
  PROJECT_DETAILS[id] = {
    overview: p.description,
    challenge: p.challenges.join(" | "),
    approach: p.challenges.map((c, idx) => ({
      phase: `Challenge ${idx + 1}`,
      detail: c,
    })),
    outcome:
      "Successfully delivered and deployed, meeting all client requirements with a modern, scalable architecture.",
    metrics: [
      { value: p.features.length.toString(), label: "Key Features" },
      { value: p.challenges.length.toString(), label: "Challenges Overcome" },
      { value: p.tech.length.toString(), label: "Technologies Used" },
      { value: "100%", label: "Responsive Design" },
    ],
    services: p.tech,
    deliverables: p.features,
    quote: null,
  };
});

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

import logoLight from "../../public/logo_light.png";

// function LogoImage({ size = 20 }) {
//   return (
//     <img
//       src={logoDark}
//       alt="Kayvion Labs"
//       style={{ height: size, width: "auto", objectFit: "contain" }}
//     />
//   );
// }

function LogoLight({ height = 68, maxWidth = 320 }) {
  return (
    <img
      src={logoLight}
      alt="Kayvion Labs Logo"
      style={{ height, width: "auto", maxWidth, objectFit: "contain" }}
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

/* ─── SCROLL PROGRESS SCRUBBER (signature element) ───────────────────────── */
const SECTIONS = ["Overview", "Challenge", "Approach", "Outcome", "Metrics"];

function ScrollScrubber() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [activeSection, setActiveSection] = useState("Overview");
  const { isTablet } = useBreakpoint();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.dataset.section || "Overview");
          }
        });
      },
      { threshold: 0.4, rootMargin: "-20% 0px -60% 0px" },
    );

    SECTIONS.forEach((s) => {
      const el = document.querySelector(`[data-section="${s}"]`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (isTablet) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 20,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        gap: 12,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 2,
          height: 120,
          background: T.border,
          borderRadius: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            background: T.accent,
            scaleY,
            transformOrigin: "top",
            height: "100%",
            borderRadius: 1,
          }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={activeSection}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={{ duration: 0.25 }}
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: T.muted,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
          }}
        >
          {activeSection}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ─── NAVBAR (uses navigate) ──────────────────────────────────────────────── */
function Navbar() {
  const navigate = useNavigate();
  const { isDesktop } = useBreakpoint();
  const isTouch = useIsTouch();

  return (
    <motion.nav
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        inset: "0 0 auto 0",
        zIndex: 500,
        background: "rgba(247,247,245,0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${T.border}`,
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
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
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
          <span style={{ color: T.border, fontSize: 18 }}>·</span>
          <button
            data-hover
            onClick={() => navigate("/projects")}
            style={{
              background: "none",
              border: "none",
              cursor: isTouch ? "pointer" : "none",
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: T.muted,
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Work
          </button>
        </div>

        {isDesktop && (
          <motion.button
            data-hover
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/?scroll=contact")}
            style={{
              cursor: isTouch ? "pointer" : "none",
              background: T.ink,
              color: T.white,
              border: "none",
              padding: "10px 24px",
              borderRadius: 100,
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Let's talk
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
}

/* ─── HERO ────────────────────────────────────────────────────────────────── */
// function DetailHero({ project }) {
//   const [ready, setReady] = useState(false);
//   const { isMobile } = useBreakpoint();
//   const { scrollY } = useScroll();
//   const bgY = useTransform(scrollY, [0, 500], [0, 80]);

//   useEffect(() => {
//     const t = setTimeout(() => setReady(true), 100);
//     return () => clearTimeout(t);
//   }, []);

//   return (
//     <section
//       style={{
//         minHeight: "55vh",
//         background: project.color,
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "flex-end",
//         paddingTop: 64,
//         overflow: "hidden",
//         position: "relative",
//       }}
//     >
//       <motion.div
//         style={{
//           y: bgY,
//           position: "absolute",
//           inset: 0,
//           backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
//           backgroundSize: "32px 32px",
//           pointerEvents: "none",
//         }}
//       />
//       <div
//         style={{
//           position: "absolute",
//           top: "20%",
//           right: "10%",
//           width: 400,
//           height: 400,
//           borderRadius: "50%",
//           background: project.accentColor,
//           opacity: 0.07,
//           filter: "blur(80px)",
//           pointerEvents: "none",
//         }}
//       />

//       <div
//         style={{
//           maxWidth: 1280,
//           margin: "0 auto",
//           width: "100%",
//           padding: "clamp(48px,8vw,100px) clamp(20px,5vw,40px) 64px",
//           position: "relative",
//         }}
//       >
//         {ready && (
//           <motion.div
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               marginBottom: isMobile ? 32 : 48,
//             }}
//           >
//             <KMark size={18} color={project.accentColor} />
//             <span
//               style={{
//                 fontFamily: "'Cabinet Grotesk', sans-serif",
//                 fontSize: 12,
//                 fontWeight: 600,
//                 color: "rgba(255,255,255,0.4)",
//                 letterSpacing: "0.1em",
//                 textTransform: "uppercase",
//               }}
//             >
//               Case study
//             </span>
//             <span
//               style={{
//                 width: 1,
//                 height: 12,
//                 background: "rgba(255,255,255,0.15)",
//                 display: "inline-block",
//               }}
//             />
//             <span
//               style={{
//                 fontFamily: "'Cabinet Grotesk', sans-serif",
//                 fontSize: 12,
//                 color: "rgba(255,255,255,0.4)",
//               }}
//             >
//               {project.index} /{" "}
//               {ALL_PROJECTS.length.toString().padStart(2, "0")}
//             </span>
//           </motion.div>
//         )}

//         <div style={{ overflow: "hidden", marginBottom: 20 }}>
//           {ready && (
//             <motion.h1
//               initial={{ y: "100%" }}
//               animate={{ y: "0%" }}
//               transition={{
//                 duration: 0.85,
//                 ease: [0.22, 1, 0.36, 1],
//                 delay: 0.1,
//               }}
//               style={{
//                 fontFamily: "'Clash Display', sans-serif",
//                 fontSize: "clamp(36px, 7vw, 100px)",
//                 fontWeight: 700,
//                 letterSpacing: isMobile ? "-2px" : "-4px",
//                 color: T.white,
//                 lineHeight: 0.96,
//               }}
//             >
//               {project.name}
//             </motion.h1>
//           )}
//         </div>

//         {ready && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.45 }}
//             style={{ marginBottom: 48 }}
//           >
//             <span
//               style={{
//                 fontFamily: "'Clash Display', sans-serif",
//                 fontSize: "clamp(52px, 10vw, 140px)",
//                 fontWeight: 700,
//                 letterSpacing: isMobile ? "-3px" : "-6px",
//                 color: project.accentColor,
//                 lineHeight: 0.92,
//                 display: "block",
//               }}
//             >
//               {project.metric.value}
//             </span>
//             <span
//               style={{
//                 fontFamily: "'Cabinet Grotesk', sans-serif",
//                 fontSize: 15,
//                 color: "rgba(255,255,255,0.45)",
//                 marginTop: 8,
//                 display: "block",
//               }}
//             >
//               {project.metric.label}
//             </span>
//           </motion.div>
//         )}

//         {ready && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.65, duration: 0.5 }}
//             style={{
//               paddingTop: 32,
//               borderTop: "1px solid rgba(255,255,255,0.1)",
//               display: "flex",
//               flexWrap: "wrap",
//               gap: isMobile ? 24 : 48,
//             }}
//           >
//             {[
//               { l: "Client", v: project.client },
//               { l: "Sector", v: project.sector },
//               { l: "Year", v: project.year },
//               { l: "Services", v: project.services.join(", ") },
//             ].map((item, i) => (
//               <div key={i}>
//                 <div
//                   style={{
//                     fontFamily: "'Cabinet Grotesk', sans-serif",
//                     fontSize: 10,
//                     fontWeight: 700,
//                     letterSpacing: "0.12em",
//                     textTransform: "uppercase",
//                     color: "rgba(255,255,255,0.28)",
//                     marginBottom: 6,
//                   }}
//                 >
//                   {item.l}
//                 </div>
//                 <div
//                   style={{
//                     fontFamily: "'Cabinet Grotesk', sans-serif",
//                     fontSize: 14,
//                     fontWeight: 500,
//                     color: "rgba(255,255,255,0.65)",
//                     lineHeight: 1.5,
//                   }}
//                 >
//                   {item.v}
//                 </div>
//               </div>
//             ))}
//           </motion.div>
//         )}

//         {/* ── Live demo CTA ── */}
//         {ready && project.url && (
//           <motion.div
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.8, duration: 0.5 }}
//             style={{ marginTop: isMobile ? 32 : 40 }}
//           >
//             <MagneticBtn
//               dark
//               onClick={() =>
//                 window.open(project.url, "_blank", "noopener,noreferrer")
//               }
//             >
//               View live site
//             </MagneticBtn>
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// }

function DetailHero({ project }) {
  const [ready, setReady] = useState(false);
  const { isMobile } = useBreakpoint();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 80]);
  
  // Parallax scale for the background image
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.2]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        minHeight: "55vh",
        background: project.color,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingTop: 64,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Dot grid animated background */}
      <motion.div
        style={{
          y: bgY,
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />
      
      {/* Colored glow blob */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: project.accentColor,
          opacity: 0.07,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Blurred background image (parallax) ── */}
      {project.image && (
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${project.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
            filter: "blur(8px)",
            scale: imageScale,
          }}
        />
      )}

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          padding: "clamp(48px,8vw,100px) clamp(20px,5vw,40px) 64px",
          position: "relative",
        }}
      >
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: isMobile ? 32 : 48,
            }}
          >
            <KMark size={18} color={project.accentColor} />
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Case study
            </span>
            <span
              style={{
                width: 1,
                height: 12,
                background: "rgba(255,255,255,0.15)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {project.index} / {ALL_PROJECTS.length.toString().padStart(2, "0")}
            </span>
          </motion.div>
        )}

        <div style={{ overflow: "hidden", marginBottom: 20 }}>
          {ready && (
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1,
              }}
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(36px, 7vw, 100px)",
                fontWeight: 700,
                letterSpacing: isMobile ? "-2px" : "-4px",
                color: T.white,
                lineHeight: 0.96,
              }}
            >
              {project.name}
            </motion.h1>
          )}
        </div>

        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{ marginBottom: 48 }}
          >
            <span
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(52px, 10vw, 140px)",
                fontWeight: 700,
                letterSpacing: isMobile ? "-3px" : "-6px",
                color: project.accentColor,
                lineHeight: 0.92,
                display: "block",
              }}
            >
              {project.metric.value}
            </span>
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 15,
                color: "rgba(255,255,255,0.45)",
                marginTop: 8,
                display: "block",
              }}
            >
              {project.metric.label}
            </span>
          </motion.div>
        )}

        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            style={{
              paddingTop: 32,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? 24 : 48,
            }}
          >
            {[
              { l: "Client", v: project.client },
              { l: "Sector", v: project.sector },
              { l: "Year", v: project.year },
              { l: "Services", v: project.services.join(", ") },
            ].map((item, i) => (
              <div key={i}>
                <div
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.28)",
                    marginBottom: 6,
                  }}
                >
                  {item.l}
                </div>
                <div
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.5,
                  }}
                >
                  {item.v}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Live demo CTA ── */}
        {ready && project.url && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{ marginTop: isMobile ? 32 : 40 }}
          >
            <MagneticBtn
              dark
              onClick={() =>
                window.open(project.url, "_blank", "noopener,noreferrer")
              }
            >
              View live site
            </MagneticBtn>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ─── PROSE SECTION ───────────────────────────────────────────────────────── */
function ProseSection({ label, eyebrow, children }) {
  const [ref, inView] = useAnimInView();
  const { isMobile } = useBreakpoint();

  return (
    <section
      data-section={label}
      style={{ background: T.bg, padding: "clamp(64px,8vw,100px) 0" }}
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
              gap: isMobile ? 0 : 80,
              flexDirection: isMobile ? "column" : "row",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: isMobile ? "auto" : 200,
                flexShrink: 0,
                marginBottom: isMobile ? 28 : 0,
              }}
            >
              <motion.p
                variants={fadeSlide()}
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: T.muted,
                  textTransform: "uppercase",
                }}
              >
                {eyebrow || label}
              </motion.p>
            </div>
            <motion.div variants={fadeSlide()} style={{ flex: 1, minWidth: 0 }}>
              {children}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── APPROACH STEPS ──────────────────────────────────────────────────────── */
function ApproachSteps({ steps }) {
  const [ref, inView] = useAnimInView();
  const { isMobile } = useBreakpoint();

  return (
    <section
      data-section="Approach"
      style={{ background: T.bgAlt, padding: "clamp(64px,8vw,100px) 0" }}
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
              gap: isMobile ? 0 : 80,
              flexDirection: isMobile ? "column" : "row",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: isMobile ? "auto" : 200,
                flexShrink: 0,
                marginBottom: isMobile ? 28 : 0,
              }}
            >
              <motion.p
                variants={fadeSlide()}
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: T.muted,
                  textTransform: "uppercase",
                }}
              >
                Approach
              </motion.p>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeSlide()}
                  style={{
                    display: "flex",
                    gap: 24,
                    alignItems: "flex-start",
                    padding: "32px 0",
                    borderBottom:
                      i < steps.length - 1 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: "clamp(36px, 4vw, 56px)",
                      fontWeight: 700,
                      letterSpacing: "-2px",
                      color: T.border,
                      lineHeight: 1,
                      flexShrink: 0,
                      width: 72,
                      textAlign: "right",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: "-0.4px",
                        color: T.ink,
                        marginBottom: 10,
                      }}
                    >
                      {step.phase}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontSize: 16,
                        color: T.muted,
                        lineHeight: 1.72,
                      }}
                    >
                      {step.detail}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── METRICS BAND ────────────────────────────────────────────────────────── */
function MetricsBand({ metrics, project }) {
  const [ref, inView] = useAnimInView();
  const { isMobile } = useBreakpoint();

  if (!metrics || metrics.length === 0) return null;
  const cols = isMobile
    ? "1fr 1fr"
    : `repeat(${Math.min(metrics.length, 4)}, 1fr)`;

  return (
    <section
      data-section="Metrics"
      style={{ background: project.color, padding: "clamp(64px,8vw,100px) 0" }}
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
          variants={stag(0.12)}
        >
          <motion.p
            variants={fadeSlide()}
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              marginBottom: 48,
            }}
          >
            Results
          </motion.p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: cols,
              gap: isMobile ? "40px 0" : 0,
            }}
          >
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeSlide()}
                style={{
                  paddingLeft: (isMobile ? i % 2 !== 0 : i !== 0) ? 32 : 0,
                  paddingRight: 32,
                  borderRight: isMobile
                    ? i % 2 === 0
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none"
                    : i < metrics.length - 1
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                  borderBottom:
                    isMobile && i < metrics.length - 2
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                  paddingBottom: isMobile && i < metrics.length - 2 ? 40 : 0,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: "clamp(32px, 4.5vw, 64px)",
                    fontWeight: 700,
                    letterSpacing: "-2px",
                    color: project.accentColor,
                    lineHeight: 1,
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 8,
                  }}
                >
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── QUOTE BLOCK ─────────────────────────────────────────────────────────── */
function QuoteBlock({ quote }) {
  const [ref, inView] = useAnimInView();
  if (!quote) return null;
  return (
    <section
      style={{
        background: T.bg,
        padding: "clamp(64px,8vw,100px) 0",
        borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
      }}
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
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: 800 }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(64px, 8vw, 120px)",
              color: T.accent,
              opacity: 0.12,
              lineHeight: 0.7,
              marginBottom: 24,
              userSelect: "none",
            }}
          >
            "
          </div>
          <p
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(20px, 3vw, 36px)",
              fontWeight: 600,
              letterSpacing: "-0.8px",
              color: T.ink,
              lineHeight: 1.3,
              marginBottom: 36,
            }}
          >
            "{quote.text}"
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: T.ink,
                color: T.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Clash Display', sans-serif",
                flexShrink: 0,
              }}
            >
              {quote.init}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: T.ink,
                  letterSpacing: "-0.2px",
                }}
              >
                {quote.name}
              </div>
              <div
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 13,
                  color: T.muted,
                  marginTop: 2,
                }}
              >
                {quote.role}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── DELIVERABLES ────────────────────────────────────────────────────────── */
function Deliverables({ items }) {
  const [ref, inView] = useAnimInView();
  const { isMobile } = useBreakpoint();
  if (!items || items.length === 0) return null;

  return (
    <section
      style={{ background: T.bgAlt, padding: "clamp(64px,8vw,100px) 0" }}
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
              gap: isMobile ? 0 : 80,
              flexDirection: isMobile ? "column" : "row",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: isMobile ? "auto" : 200,
                flexShrink: 0,
                marginBottom: isMobile ? 28 : 0,
              }}
            >
              <motion.p
                variants={fadeSlide()}
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: T.muted,
                  textTransform: "uppercase",
                }}
              >
                What we built
              </motion.p>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeSlide()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 0",
                    borderBottom:
                      i < items.length - 1 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  <span
                    style={{
                      color: T.accent,
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontSize: 16,
                      color: T.ink,
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── NEXT PROJECT ────────────────────────────────────────────────────────── */
function NextProject({ current, allProjects, onSelect }) {
  const currentIdx = allProjects.findIndex((p) => p.id === current.id);
  const next = allProjects[(currentIdx + 1) % allProjects.length];
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useAnimInView();
  const isTouch = useIsTouch();

  return (
    <section style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => {
          onSelect(next);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-hover
        style={{
          cursor: isTouch ? "pointer" : "none",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "64px clamp(20px,5vw,40px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: T.muted,
              marginBottom: 12,
            }}
          >
            Next project
          </div>
          <div
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(24px,4vw,56px)",
              fontWeight: 700,
              letterSpacing: "-2px",
              color: hovered ? T.accent : T.ink,
              transition: "color 0.25s",
              lineHeight: 1.05,
            }}
          >
            {next.name}
          </div>
          <div
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 14,
              color: T.muted,
              marginTop: 8,
            }}
          >
            {next.client} · {next.year}
          </div>
        </div>
        <motion.div
          animate={{ x: hovered ? 8 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: 36, color: T.accent }}
        >
          →
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────────── */
export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const project = ALL_PROJECTS.find((p) => p.id === slug) || ALL_PROJECTS[0];
  const detail =
    PROJECT_DETAILS[project.id] ||
    PROJECT_DETAILS[slugify(RAW_PROJECTS[0].title)];

  // Scroll to top when project changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  return (
    <div style={{ background: T.bg, color: T.ink, overflowX: "hidden" }}>
      <SEO
        title={`${project.name} — Kayvion Labs Case Study`}
        description={detail.overview}
        path={`/projects/${slug}`}
        jsonLd={[
          organizationSchema(),
          projectSchema({
            name: project.name,
            summary: detail.overview,
            sector: project.sector,
            services: project.services,
            id: project.id,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.name, path: `/projects/${slug}` },
          ]),
        ]}
      />
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,600,700,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; }
        @media (hover: none) { body { cursor: auto !important; } button { cursor: pointer !important; } }
        @media (hover: hover) { body { cursor: none; } }
        ::selection { background: rgba(34,85,255,0.15); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
      `}</style>

      <Cursor />
      <ScrollScrubber />
      <Navbar />

      <DetailHero project={project} />

      <ProseSection label="Overview" eyebrow="The brief">
        <p
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: "clamp(16px, 2vw, 20px)",
            color: T.ink,
            lineHeight: 1.75,
          }}
        >
          {detail.overview}
        </p>
      </ProseSection>

      <section
        data-section="Challenge"
        style={{ background: T.bgAlt, padding: "clamp(64px,8vw,100px) 0" }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(20px,5vw,40px)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "clamp(0px, 8vw, 80px)",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div style={{ width: 200, flexShrink: 0 }}>
              <p
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: T.muted,
                  textTransform: "uppercase",
                }}
              >
                The challenge
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <p
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: "clamp(16px, 2vw, 20px)",
                  color: T.ink,
                  lineHeight: 1.75,
                }}
              >
                {detail.challenge}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ApproachSteps steps={detail.approach} />

      <ProseSection label="Outcome" eyebrow="The outcome">
        <p
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: "clamp(16px, 2vw, 20px)",
            color: T.ink,
            lineHeight: 1.75,
          }}
        >
          {detail.outcome}
        </p>
      </ProseSection>

      <MetricsBand metrics={detail.metrics} project={project} />

      <QuoteBlock quote={detail.quote} />

      <Deliverables items={detail.deliverables} />

      <NextProject
        current={project}
        allProjects={ALL_PROJECTS}
        onSelect={(next) => navigate(`/projects/${next.id}`)}
      />
    </div>
  );
}
