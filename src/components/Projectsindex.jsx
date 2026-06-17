// ProjectsIndex.jsx — Kayvion Labs · Projects page
// Matches KayvionLabs.jsx design system exactly
// Fonts: Clash Display + Cabinet Grotesk (Fontshare CDN)
// Animations: Framer Motion

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";

/* ─── TOKENS (identical to main site) ────────────────────────────────────── */
const T = {
  bg: "#F2F1ED",        // warm off‑white (unchanged)
  bgAlt: "#EBE9E4",     // soft greige (unchanged)
  ink: "#1A1A1A",       // softer near‑black, less harsh than #0A0A0A
  muted: "#8F8C83",     // warmer grey with a hint of olive
  border: "#D9D5CE",    // subtle warm border, slightly darker than bgAlt
  accent: "#2255FF",    // brand blue (unchanged)
  white: "#FFFFFF",     // pure white (unchanged)
};

/* ─── HOOKS ───────────────────────────────────────────────────────────────── */
function useBreakpoint() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
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

/* ─── YOUR ORIGINAL PROJECT DATA ─────────────────────────────────────────── */
const RAW_PROJECTS = [
  {
    title: "Kenyan Real Estate Website",
    type: "Web Application",
    description:
      "Full-stack real estate platform connecting clients, landlords, and administrators through property listings, real-time messaging, and payment processing. Features role-based dashboards, Google Maps integration, M-Pesa payments, and comprehensive property management with secure JWT authentication.",
    tech: ["React", "Node.js", "MongoDB", "Socket.IO", "M-Pesa API", "Cloudinary"],
    features: [
      "Property Management – Complete CRUD operations for listings",
      "Real-time chat between clients and landlords (Socket.IO)",
      "Google Maps integration for property location",
      "M-Pesa payment processing for landlord subscriptions",
      "Role-based dashboards (Client, Landlord, Admin)",
      "Media uploads (images/videos) via Cloudinary",
      "Review and rating system for properties",
    ],
    sector: "Real Estate",
  },
  {
    title: "Xgene Labs - Molecular Diagnostics Website",
    type: "Corporate Website",
    description:
      "Professional website for Xgene Labs, a clinical-grade molecular diagnostics company in Kenya. Showcases genetic testing services, diagnostic kits, medical equipment, and transparent prepaid testing programs with M-Pesa integration.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Lucide Icons", "shadcn/ui", "Vite", "Vercel"],
    features: [
      "Service showcase – genetic testing, diagnostic kits, medical equipment",
      "Prepaid testing program with M-Pesa tokens for healthcare facilities",
      "Clear pricing and target audience segmentation (patients, clinics, hospitals)",
      "Mobile-responsive, trust‑focused UI",
      "Smooth animations with Framer Motion",
    ],
    sector: "Healthcare",
  },
  {
    title: "Siprosa Foundation - Educational Non-Profit Website",
    type: "Non-Profit Website",
    description:
      "Website for Siprosa Foundation, a non-profit transforming education in Kenya through 'Futures Green Schools' – focusing on early childhood education, environmental stewardship, and holistic child development.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Lucide Icons", "shadcn/ui", "Vite", "Vercel"],
    features: [
      "Mission & values communication",
      "Futures Green Schools model showcase",
      "Founder story (Dr. Mary Otieno)",
      "Call‑to‑action for donations, partnerships, volunteering",
      "Fully responsive and emotionally engaging design",
    ],
    sector: "Education / Non-Profit",
  },
  {
    title: "Somanasi - Tech Training & Solutions Company",
    type: "Corporate Website",
    description:
      "Corporate website for Somanasi, a Kenyan tech training and solutions provider offering courses in AI, software development, data analytics, and cybersecurity, plus custom AI agents and chatbots.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Lucide Icons", "shadcn/ui", "Vite", "Vercel"],
    features: [
      "Course listings – digital literacy, cybersecurity, web dev, AI agent dev",
      "Business services – full‑stack apps, AI agents, chatbots",
      "Learning model – expert‑led, self‑paced, job‑ready skills",
      "Clear target audience (individuals, businesses, organisations)",
      "Tech‑forward, modern UI",
    ],
    sector: "EdTech",
  },
  {
    title: "DigiMagicTech - Computer Programming Educator",
    type: "Educational Website",
    description:
      "Educational website for DigiMagicTech, teaching computer programming and digital skills to primary and secondary school students and teachers in Kenya. Structured courses with age-appropriate content.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Lucide Icons", "shadcn/ui", "Vite", "Vercel"],
    features: [
      "Age‑based courses (Primary – KES 15k, Secondary – KES 19.5k, Teachers – digital literacy)",
      "Expert team (professors of education, software engineering academics)",
      "Partners – Liberating Education (Germany), Matakiri Tumaini Trust, Ministry of Education",
      "Bright, engaging design for young learners",
      "Clear pricing and audience targeting",
    ],
    sector: "EdTech",
  },
  {
    title: "Gym Sable One - Fitness Landing Page",
    type: "Landing Page",
    description:
      "A sleek and modern fitness website showcasing gym programs, membership plans, and services with a responsive React-based interface and smooth animations.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Lucide Icons", "Vite", "Vercel"],
    features: [
      "Hero section with strong call‑to‑action",
      "Program highlights (training options)",
      "Membership plans with pricing",
      "Fully responsive design",
      "Smooth Framer Motion animations",
    ],
    sector: "Fitness",
  },
  {
    title: "The Eleventh Hour - Coffee Shop Demo Site (UK)",
    type: "Landing Page",
    description:
      "Demo website for a UK-based coffee shop. Showcases menu items, shop ambiance, location, and contact details with a warm, inviting design – built as a modern frontend prototype.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Lucide Icons", "Vite", "Vercel"],
    features: [
      "Hero section with menu call‑to‑action",
      "Categorised menu display (coffee, tea, food) with prices",
      "Photo gallery showcasing shop ambiance and products",
      "Location with Google Maps and opening hours",
      "Contact form for inquiries",
    ],
    sector: "Food & Beverage",
  },
  {
    title: "Matakiri Client Portal - Community Organisation Website",
    type: "Non-Profit Website",
    description:
      "Client-facing website for Matakiri, a community organisation. Showcases mission, community projects, impact stories, and ways to get involved (donate, volunteer, partner). Fully responsive and accessible.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Lucide Icons", "React Router DOM", "Vite", "Vercel"],
    features: [
      "Mission & values communication",
      "Projects/initiatives timeline or cards",
      "Impact stories from beneficiaries",
      "Get involved sections (donate, volunteer, partner)",
      "Contact form with validation",
    ],
    sector: "Non-Profit",
  },
  {
    title: "Matakiri Admin Dashboard - Content Management System",
    type: "Dashboard",
    description:
      "Secure admin dashboard for Matakiri community organisation. Manage website content (projects, success stories, team bios) and view contact form submissions. Empowers non-technical staff to update the site.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Lucide Icons", "Chart.js / Recharts", "React Router DOM", "Vite", "Vercel"],
    features: [
      "Authentication (JWT or session‑based)",
      "Manage projects, success stories, team members (CRUD)",
      "View contact form submissions with timestamps",
      "Analytics dashboard with charts (page views, submissions)",
      "Mobile‑responsive admin interface",
    ],
    sector: "Non-Profit / Tech",
  },
  {
    title: "Dantra Limited - FMCG Distributor Website",
    type: "Corporate Website",
    description:
      "Professional web platform for Dantra Limited, a leading FMCG distributor in Kenya. Showcases services, product categories, and brand partnerships with a sleek, mobile-first React interface.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Lucide Icons", "shadcn/ui", "Vite", "Vercel"],
    features: [
      "Hero section with animated headline and CTA buttons",
      "Product category display (Beverages, Snacks, Personal Care, etc.)",
      "Services showcase for FMCG distribution capabilities",
      "Partnership inquiry via WhatsApp integration",
      "Click‑to‑call for quick communication",
      "Brand partners section",
    ],
    sector: "FMCG Distribution",
  },
  {
    title: "Sonar-Rock-vs-Mine-UI",
    type: "Machine Learning",
    description:
      "Advanced machine learning-powered web application that analyzes sonar signatures to classify underwater objects as mines or rocks. Features real-time classification, confidence scoring, and comprehensive data validation with a modern React interface.",
    tech: ["React", "Machine Learning", "Tailwind CSS", "Lucide Icons", "JavaScript"],
    features: [
      "Real‑time classification (Mine vs Rock)",
      "Confidence scoring (70‑100%)",
      "Comprehensive input validation with user‑friendly errors",
      "Pre‑loaded sample data for testing",
      "One‑click clipboard integration for sample data",
      "Color‑coded results with visual feedback",
    ],
    sector: "Maritime / Defence",
  },
];

/* ─── TRANSFORM TO PROJECT CARD SHAPE ────────────────────────────────────── */
const ACCENT_COLORS = [
  "#2255FF", "#00C9A7", "#FF6B6C", "#845EC2", "#FF9671",
  "#F9F871", "#FF4B6E", "#39A2DB", "#A133FF", "#FF9F1C",
];
const DARK_COLORS = [
  "#0A1628", "#0F1A0A", "#110A1A", "#1A1000", "#0A0A1A",
  "#001A0F", "#1A1A0A", "#0A1A1A", "#1A0A1A", "#0A0A0A",
];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const PROJECTS = RAW_PROJECTS.map((p, i) => {
  const client = p.title.split(" - ")[0] || p.title;
  const headline = `${p.features.length} key features delivered.`;
  const tags = [p.type]; // use the 'type' field as the single tag

  return {
    id: slugify(p.title),
    index: String(i + 1).padStart(2, "0"),
    name: p.title,
    client: client,
    sector: p.sector || "Technology",
    year: "2025",
    services: p.tech,
    headline,
    summary: p.description,
    metric: {
      value: p.features.length.toString(),
      label: "Key Features",
    },
    tags,                  // <-- now contains the type string
    color: DARK_COLORS[i % DARK_COLORS.length],
    accentColor: ACCENT_COLORS[i % ACCENT_COLORS.length],
  };
});

/* ─── AUTO‑GENERATED FILTER TAGS (from type field) ───────────────────────── */
const ALL_TAGS = [
  "All",
  ...Array.from(new Set(PROJECTS.flatMap((p) => p.tags))),
];

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
    const move = (e) => { cx.set(e.clientX); cy.set(e.clientY); };
    const over = (e) => { if (e.target.closest("button, a, [data-hover]")) setHovered(true); };
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
        top: 0, left: 0,
        width: 10, height: 10,
        borderRadius: "50%",
        background: T.accent,
        pointerEvents: "none",
        zIndex: 9999,
        x: sx, y: sy,
        translateX: "-50%", translateY: "-50%",
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
      <path d="M6 4 L6 28" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M6 16 L22 5" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M6 16 L22 27" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M18 8 Q26 4 27 11 Q28 17 20 17" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ─── NAVBAR ──────────────────────────────────────────────────────────────── */
function Navbar({ onNavigate }) {
  const [solid, setSolid] = useState(false);
  const { isDesktop } = useBreakpoint();
  const isTouch = useIsTouch();

  useEffect(() => {
    const h = () => setSolid(window.scrollY > 32);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
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
        borderBottom: solid ? `1px solid ${T.border}` : "1px solid transparent",
      }}
    >
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "0 clamp(20px,5vw,40px)",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          data-hover
          onClick={() => onNavigate?.("home")}
          style={{ background: "none", border: "none", cursor: isTouch ? "pointer" : "none", display: "flex", alignItems: "center", gap: 8 }}
        >
          <KMark size={28} />
          <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 17, fontWeight: 600, color: T.ink, letterSpacing: "-0.4px" }}>
            Kayvion<span style={{ color: T.accent }}>Labs</span>
          </span>
        </button>

        {isDesktop && (
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            {["Services", "About", "Pricing", "Projects", "Contact"].map((l) => (
              <button
                key={l}
                data-hover
                onClick={() => onNavigate?.(l.toLowerCase())}
                style={{
                  background: "none", border: "none",
                  cursor: isTouch ? "pointer" : "none",
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 14, fontWeight: l === "Projects" ? 700 : 500,
                  color: l === "Projects" ? T.ink : T.muted,
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.ink)}
                onMouseLeave={(e) => (e.currentTarget.style.color = l === "Projects" ? T.ink : T.muted)}
              >
                {l}
              </button>
            ))}
            <motion.button
              data-hover
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate?.("contact")}
              style={{
                cursor: isTouch ? "pointer" : "none",
                background: T.ink, color: T.white, border: "none",
                padding: "10px 24px", borderRadius: 100,
                fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 14,
                letterSpacing: "0.01em",
              }}
            >
              Let's talk
            </motion.button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

/* ─── HERO ────────────────────────────────────────────────────────────────── */
const TITLE_CHARS = "Projects.".split("");

function Hero() {
  const [ready, setReady] = useState(false);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        minHeight: "56vh",
        background: T.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingTop: 64,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
        backgroundSize: "80px 80px", opacity: 0.5, pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 1280, margin: "0 auto", width: "100%",
        padding: "clamp(40px,6vw,80px) clamp(20px,5vw,40px) 0",
        position: "relative",
      }}>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: isMobile ? 24 : 36, flexWrap: "wrap" }}
          >
            <KMark size={18} />
            <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Selected projects
            </span>
            <span style={{ width: 1, height: 12, background: T.border, display: "inline-block" }} />
            <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, color: T.muted }}>
              {PROJECTS.length} case studies
            </span>
          </motion.div>
        )}

        {/* Big title */}
        <div style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", lineHeight: 0.92 }}>
            {ready && TITLE_CHARS.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.06 }}
                style={{
                  display: "inline-block",
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(72px, 14vw, 200px)",
                  fontWeight: 700,
                  letterSpacing: isMobile ? "-3px" : "-6px",
                  color: ch === "." ? T.accent : T.ink,
                  lineHeight: 0.92,
                }}
              >
                {ch}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Sub-row */}
        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{
              marginTop: 40,
              paddingTop: 28,
              borderTop: `1px solid ${T.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 20,
              paddingBottom: 56,
            }}
          >
            <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "clamp(14px,1.6vw,18px)", color: T.muted, lineHeight: 1.65, maxWidth: 480 }}>
              A selection of engineering, AI, and infrastructure projects delivered for clients across Africa and beyond. Every number on this page is real.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {[
                { v: `${PROJECTS.length}`, l: "Projects shown" },
                { v: "14", l: "Countries" },
                { v: "8yr", l: "Track record" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(18px,2vw,28px)", fontWeight: 700, letterSpacing: "-0.8px", color: T.ink }}>{s.v}</div>
                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, color: T.muted, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ─── FILTER BAR ──────────────────────────────────────────────────────────── */
function FilterBar({ active, setActive }) {
  const ref = useRef(null);

  return (
    <div style={{ position: "sticky", top: 63, zIndex: 100, background: "rgba(247,247,245,0.94)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>
        <div
          ref={ref}
          style={{
            display: "flex",
            gap: 0,
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: "16px 0",
          }}
        >
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              data-hover
              onClick={() => setActive(tag)}
              style={{
                flexShrink: 0,
                background: active === tag ? T.ink : "transparent",
                color: active === tag ? T.white : T.muted,
                border: active === tag ? "none" : `1px solid ${T.border}`,
                padding: "7px 16px",
                borderRadius: 100,
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "0.02em",
                cursor: "pointer",
                marginRight: 8,
                transition: "background 0.2s, color 0.2s, border-color 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (active !== tag) {
                  e.currentTarget.style.borderColor = T.ink;
                  e.currentTarget.style.color = T.ink;
                }
              }}
              onMouseLeave={(e) => {
                if (active !== tag) {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.color = T.muted;
                }
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PROJECT CARD ────────────────────────────────────────────────────────── */
function ProjectCard({ project, index, onClick }) {
  const isTouch = useIsTouch();
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useAnimInView();

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
      onClick={() => onClick(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        cursor: isTouch ? "pointer" : "none",
        background: hovered ? project.color : T.white,
        border: `1px solid ${hovered ? "transparent" : T.border}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "background 0.4s ease, border-color 0.4s ease",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Number + year strip */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 24px 0",
      }}>
        <span style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          color: hovered ? "rgba(255,255,255,0.35)" : T.muted,
          transition: "color 0.4s",
        }}>
          {project.index}
        </span>
        <span style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
          color: hovered ? "rgba(255,255,255,0.35)" : T.muted,
          transition: "color 0.4s",
        }}>
          {project.year}
        </span>
      </div>

      {/* Big metric */}
      <div style={{ padding: "12px 24px 0" }}>
        <motion.div
          animate={{ color: hovered ? project.accentColor : T.ink }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(44px, 6vw, 72px)",
            fontWeight: 700,
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          {project.metric.value}
        </motion.div>
        <div style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontSize: 12, color: hovered ? "rgba(255,255,255,0.45)" : T.muted,
          marginTop: 4, transition: "color 0.4s",
        }}>
          {project.metric.label}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        margin: "20px 24px",
        height: 1,
        background: hovered ? "rgba(255,255,255,0.08)" : T.border,
        transition: "background 0.4s",
      }} />

      {/* Content */}
      <div style={{ padding: "0 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: hovered ? "rgba(255,255,255,0.35)" : T.muted,
          marginBottom: 10, transition: "color 0.4s",
        }}>
          {project.client} · {project.sector}
        </div>
        <h2 style={{
          fontFamily: "'Clash Display', sans-serif",
          fontSize: "clamp(18px, 2vw, 22px)",
          fontWeight: 700, letterSpacing: "-0.5px",
          color: hovered ? T.white : T.ink,
          lineHeight: 1.18, marginBottom: 12,
          transition: "color 0.4s",
        }}>
          {project.name}
        </h2>
        <p style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontSize: 14, lineHeight: 1.68,
          color: hovered ? "rgba(255,255,255,0.55)" : T.muted,
          flex: 1, transition: "color 0.4s",
        }}>
          {project.summary}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 20 }}>
          {project.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
              color: hovered ? "rgba(255,255,255,0.5)" : T.muted,
              background: hovered ? "rgba(255,255,255,0.07)" : T.bgAlt,
              border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : T.border}`,
              padding: "4px 10px", borderRadius: 100,
              transition: "all 0.4s",
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <motion.div
            animate={{
              x: hovered ? 0 : -6,
              opacity: hovered ? 1 : 0,
              color: project.accentColor,
            }}
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 700 }}
          >
            View case study →
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── LIST ROW (alternate layout for larger screens) ─────────────────────── */
function ProjectRow({ project, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useAnimInView();
  const isTouch = useIsTouch();

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      onClick={() => onClick(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        cursor: isTouch ? "pointer" : "none",
        borderBottom: `1px solid ${T.border}`,
        padding: "32px 0",
        display: "grid",
        gridTemplateColumns: "80px 1fr auto auto",
        gap: "0 32px",
        alignItems: "center",
        position: "relative",
        transition: "padding 0.25s",
      }}
    >
      {/* Hover accent line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        style={{
          position: "absolute", bottom: -1, left: 0, right: 0,
          height: 2, background: T.accent, transformOrigin: "left",
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: "0.08em" }}>
        {project.index}
      </span>

      <div>
        <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 6 }}>
          {project.client} · {project.sector} · {project.year}
        </div>
        <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(18px,2vw,26px)", fontWeight: 700, letterSpacing: "-0.6px", color: hovered ? T.accent : T.ink, transition: "color 0.2s" }}>
          {project.name}
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(22px,2.5vw,36px)", fontWeight: 700, letterSpacing: "-1px", color: T.ink }}>{project.metric.value}</div>
        <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, color: T.muted, marginTop: 2 }}>{project.metric.label}</div>
      </div>

      <motion.div
        animate={{ x: hovered ? 0 : -8, opacity: hovered ? 1 : 0 }}
        style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 20, color: T.accent }}
      >
        →
      </motion.div>
    </motion.article>
  );
}

/* ─── PROJECTS GRID ───────────────────────────────────────────────────────── */
function ProjectsGrid({ filter, onSelect }) {
  const { isTablet, isMobile } = useBreakpoint();

  const filtered = filter === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.tags.includes(filter));

  const gridCols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)";

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px clamp(20px,5vw,40px) 120px" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: gridCols, gap: 20 }}
        >
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onClick={onSelect} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 24, fontWeight: 700, color: T.ink, marginBottom: 8 }}>No projects here yet.</p>
          <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.muted }}>Try a different filter.</p>
        </div>
      )}
    </div>
  );
}

/* ─── CTA BAND ────────────────────────────────────────────────────────────── */
function CTABand({ onNavigate }) {
  const [ref, inView] = useAnimInView();
  const { isTablet } = useBreakpoint();

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={stag(0.1)}
      style={{ background: T.bgAlt, borderTop: `1px solid ${T.border}` }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px clamp(20px,5vw,40px)" }}>
        <motion.div
          variants={fadeSlide()}
          style={{
            background: T.ink, borderRadius: 20,
            padding: isTablet ? "48px clamp(24px,6vw,48px)" : "64px 64px",
            display: "flex",
            justifyContent: "space-between", alignItems: "center",
            flexDirection: isTablet ? "column" : "row",
            gap: 32, position: "relative", overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`, backgroundSize: "28px 28px", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(22px,3.5vw,48px)", fontWeight: 700, color: T.white, letterSpacing: "-1.2px", lineHeight: 1.1, marginBottom: 12 }}>
              Your project could be next.
            </h2>
            <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 380, lineHeight: 1.65 }}>
              Tell us what you're building. We'll tell you honestly if and how we can help.
            </p>
          </div>
          <button
            onClick={() => onNavigate?.("contact")}
            style={{
              position: "relative", flexShrink: 0,
              cursor: "pointer", background: T.white, color: T.ink,
              border: "none", padding: "16px 36px", borderRadius: 100,
              fontFamily: "'Clash Display', sans-serif", fontWeight: 700,
              fontSize: 16, letterSpacing: "-0.3px", whiteSpace: "nowrap",
            }}
          >
            Start a conversation →
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ─── ROOT ────────────────────────────────────────────────────────────────── */
export default function ProjectsIndex({ onNavigate, onSelectProject }) {
  const [filter, setFilter] = useState("All");

  const handleSelect = (project) => {
    onSelectProject?.(project);
  };

  return (
    <div style={{ background: T.bg, color: T.ink, overflowX: "hidden" }}>
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
        div[style*="overflow-x: auto"]::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
      <Cursor />
      {/* <Navbar onNavigate={onNavigate} /> */}
      <Hero />
      <FilterBar active={filter} setActive={setFilter} />
      <ProjectsGrid filter={filter} onSelect={handleSelect} />
      <CTABand onNavigate={onNavigate} />
    </div>
  );
}









































// // ProjectsIndex.jsx — Kayvion Labs · Projects page
// // Matches KayvionLabs.jsx design system exactly
// // Fonts: Clash Display + Cabinet Grotesk (Fontshare CDN)
// // Animations: Framer Motion

// import { useState, useEffect, useRef } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useTransform,
//   useSpring,
//   useMotionValue,
//   useInView,
// } from "framer-motion";

// /* ─── TOKENS (identical to main site) ────────────────────────────────────── */
// const T = {
//   bg: "#F7F7F5",
//   bgAlt: "#F0F0EC",
//   ink: "#0A0A0A",
//   muted: "#8B8B85",
//   border: "#E2E2DC",
//   accent: "#2255FF",
//   accentDim: "rgba(34,85,255,0.08)",
//   white: "#FFFFFF",
// };

// /* ─── HOOKS ───────────────────────────────────────────────────────────────── */
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
//     isMobile: width < 560,
//     isTablet: width < 768,
//     isDesktop: width >= 960,
//     width,
//   };
// }

// function useIsTouch() {
//   const [touch, setTouch] = useState(false);
//   useEffect(() => {
//     setTouch(window.matchMedia("(hover: none)").matches);
//   }, []);
//   return touch;
// }

// function useAnimInView(once = true) {
//   const ref = useRef(null);
//   const inView = useInView(ref, { once, margin: "-60px" });
//   return [ref, inView];
// }

// /* ─── ANIMATION HELPERS ───────────────────────────────────────────────────── */
// const clipReveal = {
//   hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
//   show: {
//     clipPath: "inset(0 0% 0 0)",
//     opacity: 1,
//     transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
//   },
// };
// const fadeSlide = (dir = 1) => ({
//   hidden: { opacity: 0, y: 40 * dir },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
//   },
// });
// const stag = (d = 0.08) => ({
//   hidden: {},
//   show: { transition: { staggerChildren: d } },
// });

// /* ─── PROJECT DATA ────────────────────────────────────────────────────────── */
// export const PROJECTS = [
//   {
//     id: "finedge-platform",
//     index: "01",
//     name: "FinEdge Transaction Platform",
//     client: "FinEdge Africa",
//     sector: "Fintech",
//     year: "2024",
//     services: ["Software Engineering", "Cloud Architecture", "API & Integration"],
//     headline: "50,000 daily transactions. Zero downtime.",
//     summary:
//       "Rebuilt FinEdge's core payment infrastructure from a failing monolith into a resilient microservices architecture capable of handling peak loads across East Africa.",
//     metric: { value: "50K", label: "Daily transactions" },
//     tags: ["Software Engineering", "Cloud Architecture"],
//     color: "#0A1628",
//     accentColor: "#2255FF",
//   },
//   {
//     id: "petrologic-ai",
//     index: "02",
//     name: "PetroLogic AI Reporting",
//     client: "PetroLogic",
//     sector: "Energy",
//     year: "2024",
//     services: ["AI & Machine Learning", "Data & Analytics"],
//     headline: "70% reduction in analyst time.",
//     summary:
//       "Designed and deployed an ML-powered reporting system that ingests raw operational data and surfaces executive-ready summaries, forecasts, and anomaly alerts automatically.",
//     metric: { value: "70%", label: "Analyst time saved" },
//     tags: ["AI & Machine Learning", "Data & Analytics"],
//     color: "#0F1A0A",
//     accentColor: "#22c55e",
//   },
//   {
//     id: "healthtrack-platform",
//     index: "03",
//     name: "HealthTrack Patient Platform",
//     client: "HealthTrack",
//     sector: "Healthtech",
//     year: "2023",
//     services: ["Web & Mobile Apps", "Cloud Architecture", "Cybersecurity"],
//     headline: "From idea to HIPAA-compliant launch in 14 weeks.",
//     summary:
//       "End-to-end design and build of a patient-facing mobile app and clinical dashboard, with security and data residency requirements baked into the architecture from day one.",
//     metric: { value: "14wk", label: "Idea to launch" },
//     tags: ["Web & Mobile Apps", "Cybersecurity"],
//     color: "#110A1A",
//     accentColor: "#8b5cf6",
//   },
//   {
//     id: "solarnet-iot",
//     index: "04",
//     name: "SolarNet IoT Dashboard",
//     client: "SolarNet",
//     sector: "Energy",
//     year: "2023",
//     services: ["Software Engineering", "Data & Analytics", "Cloud Architecture"],
//     headline: "Real-time monitoring for 3,200 solar installations.",
//     summary:
//       "Built a telemetry ingestion pipeline and live operations dashboard for a distributed solar network, enabling field engineers to triage faults remotely and cut response times in half.",
//     metric: { value: "3.2K", label: "Installations monitored" },
//     tags: ["Data & Analytics", "Cloud Architecture"],
//     color: "#1A1000",
//     accentColor: "#f59e0b",
//   },
//   {
//     id: "retailco-automation",
//     index: "05",
//     name: "RetailCo Warehouse Automation",
//     client: "RetailCo Group",
//     sector: "Retail",
//     year: "2022",
//     services: ["Business Automation", "API & Integration", "Software Engineering"],
//     headline: "Manual order processing: eliminated.",
//     summary:
//       "Replaced a 14-step manual fulfilment workflow with an intelligent automation layer that routes, validates, and dispatches orders across three warehouses without human intervention.",
//     metric: { value: "14→0", label: "Manual steps" },
//     tags: ["Business Automation", "API & Integration"],
//     color: "#0A0A1A",
//     accentColor: "#ec4899",
//   },
//   {
//     id: "govtech-security",
//     index: "06",
//     name: "GovTech Security Overhaul",
//     client: "Government Agency (NDA)",
//     sector: "Public Sector",
//     year: "2022",
//     services: ["Cybersecurity", "Technology Consulting", "Cloud Architecture"],
//     headline: "Zero critical vulnerabilities. Certified in 8 weeks.",
//     summary:
//       "Conducted a full threat model and penetration test of legacy government infrastructure, then led the remediation program to bring systems to ISO 27001 certification.",
//     metric: { value: "0", label: "Critical vulnerabilities remaining" },
//     tags: ["Cybersecurity", "Technology Consulting"],
//     color: "#001A0F",
//     accentColor: "#10b981",
//   },
// ];

// const ALL_TAGS = [
//   "All",
//   "Software Engineering",
//   "AI & Machine Learning",
//   "Cloud Architecture",
//   "Cybersecurity",
//   "Data & Analytics",
//   "Business Automation",
//   "API & Integration",
//   "Web & Mobile Apps",
//   "Technology Consulting",
// ];

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
//     const over = (e) => { if (e.target.closest("button, a, [data-hover]")) setHovered(true); };
//     const out = () => setHovered(false);
//     window.addEventListener("mousemove", move);
//     window.addEventListener("mouseover", over);
//     window.addEventListener("mouseout", out);
//     return () => {
//       window.removeEventListener("mousemove", move);
//       window.removeEventListener("mouseover", over);
//       window.removeEventListener("mouseout", out);
//     };
//   }, [isTouch]);

//   if (isTouch) return null;

//   return (
//     <motion.div
//       style={{
//         position: "fixed",
//         top: 0, left: 0,
//         width: 10, height: 10,
//         borderRadius: "50%",
//         background: T.accent,
//         pointerEvents: "none",
//         zIndex: 9999,
//         x: sx, y: sy,
//         translateX: "-50%", translateY: "-50%",
//         scale,
//         mixBlendMode: "multiply",
//       }}
//     />
//   );
// }

// /* ─── LOGO MARK ───────────────────────────────────────────────────────────── */
// function KMark({ size = 32, color = T.accent }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
//       <path d="M6 4 L6 28" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
//       <path d="M6 16 L22 5" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
//       <path d="M6 16 L22 27" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
//       <path d="M18 8 Q26 4 27 11 Q28 17 20 17" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
//     </svg>
//   );
// }

// /* ─── NAVBAR ──────────────────────────────────────────────────────────────── */
// function Navbar({ onNavigate }) {
//   const [solid, setSolid] = useState(false);
//   const { isDesktop } = useBreakpoint();
//   const isTouch = useIsTouch();

//   useEffect(() => {
//     const h = () => setSolid(window.scrollY > 32);
//     window.addEventListener("scroll", h);
//     return () => window.removeEventListener("scroll", h);
//   }, []);

//   return (
//     <motion.nav
//       initial={{ y: -72 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
//       style={{
//         position: "fixed",
//         inset: "0 0 auto 0",
//         zIndex: 500,
//         transition: "background 0.3s, border-color 0.3s",
//         background: solid ? "rgba(247,247,245,0.92)" : "transparent",
//         backdropFilter: solid ? "blur(14px)" : "none",
//         borderBottom: solid ? `1px solid ${T.border}` : "1px solid transparent",
//       }}
//     >
//       <div style={{
//         maxWidth: 1280, margin: "0 auto",
//         padding: "0 clamp(20px,5vw,40px)",
//         height: 64,
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//       }}>
//         <button
//           data-hover
//           onClick={() => onNavigate?.("home")}
//           style={{ background: "none", border: "none", cursor: isTouch ? "pointer" : "none", display: "flex", alignItems: "center", gap: 8 }}
//         >
//           <KMark size={28} />
//           <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 17, fontWeight: 600, color: T.ink, letterSpacing: "-0.4px" }}>
//             Kayvion<span style={{ color: T.accent }}>Labs</span>
//           </span>
//         </button>

//         {isDesktop && (
//           <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
//             {["Services", "About", "Pricing", "Work", "Contact"].map((l) => (
//               <button
//                 key={l}
//                 data-hover
//                 onClick={() => onNavigate?.(l.toLowerCase())}
//                 style={{
//                   background: "none", border: "none",
//                   cursor: isTouch ? "pointer" : "none",
//                   fontFamily: "'Cabinet Grotesk', sans-serif",
//                   fontSize: 14, fontWeight: l === "Work" ? 700 : 500,
//                   color: l === "Work" ? T.ink : T.muted,
//                   letterSpacing: "0.01em",
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.color = T.ink)}
//                 onMouseLeave={(e) => (e.currentTarget.style.color = l === "Work" ? T.ink : T.muted)}
//               >
//                 {l}
//               </button>
//             ))}
//             <motion.button
//               data-hover
//               whileHover={{ scale: 1.04 }}
//               whileTap={{ scale: 0.96 }}
//               onClick={() => onNavigate?.("contact")}
//               style={{
//                 cursor: isTouch ? "pointer" : "none",
//                 background: T.ink, color: T.white, border: "none",
//                 padding: "10px 24px", borderRadius: 100,
//                 fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 14,
//                 letterSpacing: "0.01em",
//               }}
//             >
//               Let's talk
//             </motion.button>
//           </div>
//         )}
//       </div>
//     </motion.nav>
//   );
// }

// /* ─── HERO ────────────────────────────────────────────────────────────────── */
// const TITLE_CHARS = "Work.".split("");

// function Hero() {
//   const [ready, setReady] = useState(false);
//   const { isMobile } = useBreakpoint();

//   useEffect(() => {
//     const t = setTimeout(() => setReady(true), 150);
//     return () => clearTimeout(t);
//   }, []);

//   return (
//     <section
//       style={{
//         minHeight: "56vh",
//         background: T.bg,
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "flex-end",
//         paddingTop: 64,
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Grid background */}
//       <div style={{
//         position: "absolute", inset: 0,
//         backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
//         backgroundSize: "80px 80px", opacity: 0.5, pointerEvents: "none",
//       }} />

//       <div style={{
//         maxWidth: 1280, margin: "0 auto", width: "100%",
//         padding: "clamp(40px,6vw,80px) clamp(20px,5vw,40px) 0",
//         position: "relative",
//       }}>
//         {ready && (
//           <motion.div
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: isMobile ? 24 : 36, flexWrap: "wrap" }}
//           >
//             <KMark size={18} />
//             <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
//               Selected projects
//             </span>
//             <span style={{ width: 1, height: 12, background: T.border, display: "inline-block" }} />
//             <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, color: T.muted }}>
//               {PROJECTS.length} case studies
//             </span>
//           </motion.div>
//         )}

//         {/* Big title */}
//         <div style={{ overflow: "hidden" }}>
//           <div style={{ display: "flex", lineHeight: 0.92 }}>
//             {ready && TITLE_CHARS.map((ch, i) => (
//               <motion.span
//                 key={i}
//                 initial={{ y: "110%", opacity: 0 }}
//                 animate={{ y: "0%", opacity: 1 }}
//                 transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.06 }}
//                 style={{
//                   display: "inline-block",
//                   fontFamily: "'Clash Display', sans-serif",
//                   fontSize: "clamp(72px, 14vw, 200px)",
//                   fontWeight: 700,
//                   letterSpacing: isMobile ? "-3px" : "-6px",
//                   color: ch === "." ? T.accent : T.ink,
//                   lineHeight: 0.92,
//                 }}
//               >
//                 {ch}
//               </motion.span>
//             ))}
//           </div>
//         </div>

//         {/* Sub-row */}
//         {ready && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7, duration: 0.6 }}
//             style={{
//               marginTop: 40,
//               paddingTop: 28,
//               borderTop: `1px solid ${T.border}`,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "flex-end",
//               flexWrap: "wrap",
//               gap: 20,
//               paddingBottom: 56,
//             }}
//           >
//             <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "clamp(14px,1.6vw,18px)", color: T.muted, lineHeight: 1.65, maxWidth: 480 }}>
//               A selection of engineering, AI, and infrastructure projects delivered for clients across Africa and beyond. Every number on this page is real.
//             </p>
//             <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
//               {[
//                 { v: `${PROJECTS.length}`, l: "Projects shown" },
//                 { v: "14", l: "Countries" },
//                 { v: "8yr", l: "Track record" },
//               ].map((s, i) => (
//                 <div key={i} style={{ textAlign: "right" }}>
//                   <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(18px,2vw,28px)", fontWeight: 700, letterSpacing: "-0.8px", color: T.ink }}>{s.v}</div>
//                   <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, color: T.muted, marginTop: 2 }}>{s.l}</div>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// }

// /* ─── FILTER BAR ──────────────────────────────────────────────────────────── */
// function FilterBar({ active, setActive }) {
//   const ref = useRef(null);

//   return (
//     <div style={{ position: "sticky", top: 63, zIndex: 100, background: "rgba(247,247,245,0.94)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${T.border}` }}>
//       <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>
//         <div
//           ref={ref}
//           style={{
//             display: "flex",
//             gap: 0,
//             overflowX: "auto",
//             scrollbarWidth: "none",
//             msOverflowStyle: "none",
//             padding: "16px 0",
//           }}
//         >
//           {ALL_TAGS.map((tag) => (
//             <button
//               key={tag}
//               data-hover
//               onClick={() => setActive(tag)}
//               style={{
//                 flexShrink: 0,
//                 background: active === tag ? T.ink : "transparent",
//                 color: active === tag ? T.white : T.muted,
//                 border: active === tag ? "none" : `1px solid ${T.border}`,
//                 padding: "7px 16px",
//                 borderRadius: 100,
//                 fontFamily: "'Cabinet Grotesk', sans-serif",
//                 fontWeight: 600,
//                 fontSize: 12,
//                 letterSpacing: "0.02em",
//                 cursor: "pointer",
//                 marginRight: 8,
//                 transition: "background 0.2s, color 0.2s, border-color 0.2s",
//                 whiteSpace: "nowrap",
//               }}
//               onMouseEnter={(e) => {
//                 if (active !== tag) {
//                   e.currentTarget.style.borderColor = T.ink;
//                   e.currentTarget.style.color = T.ink;
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (active !== tag) {
//                   e.currentTarget.style.borderColor = T.border;
//                   e.currentTarget.style.color = T.muted;
//                 }
//               }}
//             >
//               {tag}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── PROJECT CARD ────────────────────────────────────────────────────────── */
// function ProjectCard({ project, index, onClick }) {
//   const isTouch = useIsTouch();
//   const [hovered, setHovered] = useState(false);
//   const [ref, inView] = useAnimInView();

//   return (
//     <motion.article
//       ref={ref}
//       initial={{ opacity: 0, y: 48 }}
//       animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
//       transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
//       onClick={() => onClick(project)}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       data-hover
//       style={{
//         cursor: isTouch ? "pointer" : "none",
//         background: hovered ? project.color : T.white,
//         border: `1px solid ${hovered ? "transparent" : T.border}`,
//         borderRadius: 14,
//         overflow: "hidden",
//         transition: "background 0.4s ease, border-color 0.4s ease",
//         display: "flex",
//         flexDirection: "column",
//         position: "relative",
//       }}
//     >
//       {/* Number + year strip */}
//       <div style={{
//         display: "flex", justifyContent: "space-between", alignItems: "center",
//         padding: "20px 24px 0",
//       }}>
//         <span style={{
//           fontFamily: "'Cabinet Grotesk', sans-serif",
//           fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
//           color: hovered ? "rgba(255,255,255,0.35)" : T.muted,
//           transition: "color 0.4s",
//         }}>
//           {project.index}
//         </span>
//         <span style={{
//           fontFamily: "'Cabinet Grotesk', sans-serif",
//           fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
//           color: hovered ? "rgba(255,255,255,0.35)" : T.muted,
//           transition: "color 0.4s",
//         }}>
//           {project.year}
//         </span>
//       </div>

//       {/* Big metric */}
//       <div style={{ padding: "12px 24px 0" }}>
//         <motion.div
//           animate={{ color: hovered ? project.accentColor : T.ink }}
//           transition={{ duration: 0.4 }}
//           style={{
//             fontFamily: "'Clash Display', sans-serif",
//             fontSize: "clamp(44px, 6vw, 72px)",
//             fontWeight: 700,
//             letterSpacing: "-2px",
//             lineHeight: 1,
//           }}
//         >
//           {project.metric.value}
//         </motion.div>
//         <div style={{
//           fontFamily: "'Cabinet Grotesk', sans-serif",
//           fontSize: 12, color: hovered ? "rgba(255,255,255,0.45)" : T.muted,
//           marginTop: 4, transition: "color 0.4s",
//         }}>
//           {project.metric.label}
//         </div>
//       </div>

//       {/* Divider */}
//       <div style={{
//         margin: "20px 24px",
//         height: 1,
//         background: hovered ? "rgba(255,255,255,0.08)" : T.border,
//         transition: "background 0.4s",
//       }} />

//       {/* Content */}
//       <div style={{ padding: "0 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{
//           fontFamily: "'Cabinet Grotesk', sans-serif",
//           fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
//           color: hovered ? "rgba(255,255,255,0.35)" : T.muted,
//           marginBottom: 10, transition: "color 0.4s",
//         }}>
//           {project.client} · {project.sector}
//         </div>
//         <h2 style={{
//           fontFamily: "'Clash Display', sans-serif",
//           fontSize: "clamp(18px, 2vw, 22px)",
//           fontWeight: 700, letterSpacing: "-0.5px",
//           color: hovered ? T.white : T.ink,
//           lineHeight: 1.18, marginBottom: 12,
//           transition: "color 0.4s",
//         }}>
//           {project.name}
//         </h2>
//         <p style={{
//           fontFamily: "'Cabinet Grotesk', sans-serif",
//           fontSize: 14, lineHeight: 1.68,
//           color: hovered ? "rgba(255,255,255,0.55)" : T.muted,
//           flex: 1, transition: "color 0.4s",
//         }}>
//           {project.summary}
//         </p>

//         {/* Tags */}
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 20 }}>
//           {project.tags.map((tag) => (
//             <span key={tag} style={{
//               fontFamily: "'Cabinet Grotesk', sans-serif",
//               fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
//               color: hovered ? "rgba(255,255,255,0.5)" : T.muted,
//               background: hovered ? "rgba(255,255,255,0.07)" : T.bgAlt,
//               border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : T.border}`,
//               padding: "4px 10px", borderRadius: 100,
//               transition: "all 0.4s",
//             }}>
//               {tag}
//             </span>
//           ))}
//         </div>

//         {/* CTA row */}
//         <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
//           <motion.div
//             animate={{
//               x: hovered ? 0 : -6,
//               opacity: hovered ? 1 : 0,
//               color: project.accentColor,
//             }}
//             style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 700 }}
//           >
//             View case study →
//           </motion.div>
//         </div>
//       </div>
//     </motion.article>
//   );
// }

// /* ─── LIST ROW (alternate layout for larger screens) ─────────────────────── */
// function ProjectRow({ project, index, onClick }) {
//   const [hovered, setHovered] = useState(false);
//   const [ref, inView] = useAnimInView();
//   const isTouch = useIsTouch();

//   return (
//     <motion.article
//       ref={ref}
//       initial={{ opacity: 0, y: 32 }}
//       animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
//       transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
//       onClick={() => onClick(project)}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       data-hover
//       style={{
//         cursor: isTouch ? "pointer" : "none",
//         borderBottom: `1px solid ${T.border}`,
//         padding: "32px 0",
//         display: "grid",
//         gridTemplateColumns: "80px 1fr auto auto",
//         gap: "0 32px",
//         alignItems: "center",
//         position: "relative",
//         transition: "padding 0.25s",
//       }}
//     >
//       {/* Hover accent line */}
//       <motion.div
//         animate={{ scaleX: hovered ? 1 : 0 }}
//         initial={{ scaleX: 0 }}
//         style={{
//           position: "absolute", bottom: -1, left: 0, right: 0,
//           height: 2, background: T.accent, transformOrigin: "left",
//         }}
//         transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
//       />

//       <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: "0.08em" }}>
//         {project.index}
//       </span>

//       <div>
//         <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 6 }}>
//           {project.client} · {project.sector} · {project.year}
//         </div>
//         <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(18px,2vw,26px)", fontWeight: 700, letterSpacing: "-0.6px", color: hovered ? T.accent : T.ink, transition: "color 0.2s" }}>
//           {project.name}
//         </div>
//       </div>

//       <div style={{ textAlign: "right" }}>
//         <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(22px,2.5vw,36px)", fontWeight: 700, letterSpacing: "-1px", color: T.ink }}>{project.metric.value}</div>
//         <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, color: T.muted, marginTop: 2 }}>{project.metric.label}</div>
//       </div>

//       <motion.div
//         animate={{ x: hovered ? 0 : -8, opacity: hovered ? 1 : 0 }}
//         style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 20, color: T.accent }}
//       >
//         →
//       </motion.div>
//     </motion.article>
//   );
// }

// /* ─── PROJECTS GRID ───────────────────────────────────────────────────────── */
// function ProjectsGrid({ filter, onSelect }) {
//   const { isTablet, isMobile } = useBreakpoint();

//   const filtered = filter === "All"
//     ? PROJECTS
//     : PROJECTS.filter((p) => p.tags.includes(filter));

//   const gridCols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)";

//   return (
//     <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px clamp(20px,5vw,40px) 120px" }}>
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={filter}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           style={{ display: "grid", gridTemplateColumns: gridCols, gap: 20 }}
//         >
//           {filtered.map((project, i) => (
//             <ProjectCard key={project.id} project={project} index={i} onClick={onSelect} />
//           ))}
//         </motion.div>
//       </AnimatePresence>

//       {filtered.length === 0 && (
//         <div style={{ textAlign: "center", padding: "80px 0" }}>
//           <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 24, fontWeight: 700, color: T.ink, marginBottom: 8 }}>No projects here yet.</p>
//           <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.muted }}>Try a different filter.</p>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─── CTA BAND ────────────────────────────────────────────────────────────── */
// function CTABand({ onNavigate }) {
//   const [ref, inView] = useAnimInView();
//   const { isTablet } = useBreakpoint();

//   return (
//     <motion.section
//       ref={ref}
//       initial="hidden"
//       animate={inView ? "show" : "hidden"}
//       variants={stag(0.1)}
//       style={{ background: T.bgAlt, borderTop: `1px solid ${T.border}` }}
//     >
//       <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px clamp(20px,5vw,40px)" }}>
//         <motion.div
//           variants={fadeSlide()}
//           style={{
//             background: T.ink, borderRadius: 20,
//             padding: isTablet ? "48px clamp(24px,6vw,48px)" : "64px 64px",
//             display: "flex",
//             justifyContent: "space-between", alignItems: "center",
//             flexDirection: isTablet ? "column" : "row",
//             gap: 32, position: "relative", overflow: "hidden",
//           }}
//         >
//           <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`, backgroundSize: "28px 28px", pointerEvents: "none" }} />
//           <div style={{ position: "relative" }}>
//             <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(22px,3.5vw,48px)", fontWeight: 700, color: T.white, letterSpacing: "-1.2px", lineHeight: 1.1, marginBottom: 12 }}>
//               Your project could be next.
//             </h2>
//             <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 380, lineHeight: 1.65 }}>
//               Tell us what you're building. We'll tell you honestly if and how we can help.
//             </p>
//           </div>
//           <button
//             onClick={() => onNavigate?.("contact")}
//             style={{
//               position: "relative", flexShrink: 0,
//               cursor: "pointer", background: T.white, color: T.ink,
//               border: "none", padding: "16px 36px", borderRadius: 100,
//               fontFamily: "'Clash Display', sans-serif", fontWeight: 700,
//               fontSize: 16, letterSpacing: "-0.3px", whiteSpace: "nowrap",
//             }}
//           >
//             Start a conversation →
//           </button>
//         </motion.div>
//       </div>
//     </motion.section>
//   );
// }

// /* ─── ROOT ────────────────────────────────────────────────────────────────── */
// export default function ProjectsIndex({ onNavigate, onSelectProject }) {
//   const [filter, setFilter] = useState("All");

//   const handleSelect = (project) => {
//     onSelectProject?.(project);
//   };

//   return (
//     <div style={{ background: T.bg, color: T.ink, overflowX: "hidden" }}>
//       <style>{`
//         @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,600,700,800&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         html { scroll-behavior: smooth; }
//         body { -webkit-font-smoothing: antialiased; }
//         @media (hover: none) { body { cursor: auto !important; } button { cursor: pointer !important; } }
//         @media (hover: hover) { body { cursor: none; } }
//         ::selection { background: rgba(34,85,255,0.15); }
//         ::-webkit-scrollbar { width: 5px; }
//         ::-webkit-scrollbar-track { background: ${T.bg}; }
//         ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
//         div[style*="overflow-x: auto"]::-webkit-scrollbar { display: none; }
//         @media (prefers-reduced-motion: reduce) {
//           *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
//         }
//       `}</style>
//       <Cursor />
//       {/* <Navbar onNavigate={onNavigate} /> */}
//       <Hero />
//       <FilterBar active={filter} setActive={setFilter} />
//       <ProjectsGrid filter={filter} onSelect={handleSelect} />
//       <CTABand onNavigate={onNavigate} />
//     </div>
//   );
// }