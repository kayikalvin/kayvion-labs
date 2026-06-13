// KayvionLabs.jsx — Award-tier redesign
// Fonts: Clash Display + Cabinet Grotesk (Fontshare CDN)
// Animations: Framer Motion (npm install framer-motion)

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion, AnimatePresence, useScroll, useTransform,
  useSpring, useMotionValue, useInView, animate, stagger as fmStagger
} from "framer-motion";

/* ─── TOKENS ──────────────────────────────────────────────────────────────── */
const T = {
  bg:       "#F7F7F5",
  bgAlt:    "#F0F0EC",
  ink:      "#0A0A0A",
  muted:    "#8B8B85",
  border:   "#E2E2DC",
  accent:   "#2255FF",
  accentDim:"rgba(34,85,255,0.08)",
  white:    "#FFFFFF",
};

/* ─── DATA ────────────────────────────────────────────────────────────────── */
const SERVICES = [
  { id: "01", title: "Software Engineering",     body: "Enterprise systems, SaaS platforms, and full-stack applications engineered to production-grade standards. We write code meant to last." },
  { id: "02", title: "AI & Machine Learning",    body: "Predictive models, NLP pipelines, computer vision, and ML inference systems — deployed in the real world, not just notebooks." },
  { id: "03", title: "Web & Mobile Apps",        body: "High-performance web applications and native mobile experiences. Designed to convert, built to scale without rewrites." },
  { id: "04", title: "Cloud Architecture",       body: "AWS, Azure, GCP — migration, infrastructure-as-code, and managed cloud at every scale. Resilient, observable, cost-efficient." },
  { id: "05", title: "Cybersecurity",            body: "Threat modelling, penetration testing, compliance, and continuous monitoring. Security that ships with your product, not after." },
  { id: "06", title: "Data & Analytics",         body: "Pipelines, warehouses, dashboards, and forecasting models. From raw logs to decisions your leadership will act on." },
  { id: "07", title: "API & Integration",        body: "RESTful APIs, microservices, and enterprise integration that eliminates silos, reduces latency, and unlocks velocity." },
  { id: "08", title: "Business Automation",      body: "Workflow design and intelligent automation that multiplies throughput. We find the friction and engineer it out." },
  { id: "09", title: "Technology Consulting",    body: "Roadmapping, architecture reviews, digital transformation. Strategic advisory from engineers who have shipped, not just advised." },
];

const PLANS = [
  { tier: "Starter",    tag: "Startups & Small Teams",       features: ["Web or mobile application", "Basic API integration", "Cloud deployment", "30-day support"] },
  { tier: "Growth",     tag: "Scaling Organisations",        features: ["Full-stack development", "AI/ML integration", "Cloud architecture & DevOps", "90-day SLA", "Dedicated PM"], hot: true },
  { tier: "Enterprise", tag: "Complex & Mission-Critical",   features: ["Multi-system architecture", "Cybersecurity layer", "Data science pipelines", "24/7 monitoring", "On-site consulting"] },
];

const TESTIMONIALS = [
  { q: "They delivered a platform handling 50,000 daily transactions without a hiccup. Rare to say this honestly — the engineering quality is exceptional.", name: "Amara Diallo",  role: "CTO, FinEdge Africa",    init: "AD" },
  { q: "Our AI reporting system cut analyst time by 70%. Kayvion understood our data immediately and built something we couldn't have imagined doing alone.",  name: "Seun Adeyemi", role: "Head of Ops, PetroLogic", init: "SA" },
  { q: "From discovery to deployment — clear, on-schedule, outcome exceeded expectations. That combination is genuinely rare in the industry.",                name: "Ngozi Okafor", role: "Founder, HealthTrack",    init: "NO" },
];

const TICKER_ITEMS = ["Software Engineering", "AI Systems", "Cloud Architecture", "Cybersecurity", "Data Science", "Mobile Apps", "API Development", "Business Automation", "Technology Consulting"];

const STATS = [
  { v: "120+", l: "Projects shipped" },
  { v: "98%",  l: "Client retention" },
  { v: "14",   l: "Countries" },
  { v: "8yr",  l: "In operation" },
];

/* ─── ANIMATION HELPERS ───────────────────────────────────────────────────── */
const clipReveal = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  show:   { clipPath: "inset(0 0% 0 0)",   opacity: 1, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
};
const fadeSlide = (dir = 1) => ({
  hidden: { opacity: 0, y: 40 * dir },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
});
const stag = (d = 0.08) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });

function useAnimInView(once = true) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px" });
  return [ref, inView];
}

/* ─── CURSOR ──────────────────────────────────────────────────────────────── */
function Cursor() {
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness: 180, damping: 22 });
  const sy = useSpring(cy, { stiffness: 180, damping: 22 });
  const [hovered, setHovered] = useState(false);
  const scale = useSpring(hovered ? 3.5 : 1, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const move = (e) => { cx.set(e.clientX); cy.set(e.clientY); };
    const over = (e) => { if (e.target.closest("button, a, [data-hover]")) setHovered(true); };
    const out  = () => setHovered(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout",  out);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mouseout", out); };
  }, []);

  return (
    <motion.div style={{ position: "fixed", top: 0, left: 0, width: 10, height: 10, borderRadius: "50%", background: T.accent, pointerEvents: "none", zIndex: 9999, x: sx, y: sy, translateX: "-50%", translateY: "-50%", scale, mixBlendMode: "multiply" }} />
  );
}

/* ─── LOGO MARK ───────────────────────────────────────────────────────────── */
function KMark({ size = 32, color = T.accent }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M6 4 L6 28" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M6 16 L22 5"  stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M6 16 L22 27" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M18 8 Q26 4 27 11 Q28 17 20 17" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

/* ─── TICKER ──────────────────────────────────────────────────────────────── */
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "14px 0", background: T.bg }}>
      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 24, ease: "linear", repeat: Infinity }}
        style={{ display: "flex", gap: 0, whiteSpace: "nowrap", width: "max-content" }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 28, padding: "0 28px", fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: T.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {item}
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.accent, display: "inline-block", flexShrink: 0 }} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── NAVBAR ──────────────────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const h = () => setSolid(window.scrollY > 32);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };

  return (
    <>
      <motion.nav initial={{ y: -72 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", inset: "0 0 auto 0", zIndex: 500, transition: "background 0.3s, border-color 0.3s", background: solid ? "rgba(247,247,245,0.92)" : "transparent", backdropFilter: solid ? "blur(14px)" : "none", borderBottom: solid ? `1px solid ${T.border}` : "1px solid transparent" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button data-hover onClick={() => go("hero")} style={{ background: "none", border: "none", cursor: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <KMark size={28} />
            <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 17, fontWeight: 600, color: T.ink, letterSpacing: "-0.4px" }}>Kayvion<span style={{ color: T.accent }}>Labs</span></span>
          </button>

          <div className="kl-nav-links" style={{ display: "flex", alignItems: "center", gap: 40 }}>
            {["Services","About","Pricing","Testimonials","Contact"].map(l => (
              <button key={l} data-hover onClick={() => go(l.toLowerCase())}
                style={{ background: "none", border: "none", cursor: "none", fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 500, color: T.muted, letterSpacing: "0.01em" }}
                onMouseEnter={e => e.currentTarget.style.color = T.ink}
                onMouseLeave={e => e.currentTarget.style.color = T.muted}>
                {l}
              </button>
            ))}
            <motion.button data-hover whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => go("contact")}
              style={{ cursor: "none", background: T.ink, color: T.white, border: "none", padding: "10px 24px", borderRadius: 100, fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.01em" }}>
              Let's talk
            </motion.button>
          </div>

          <button onClick={() => setOpen(!open)} className="kl-hamburger" style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 4, padding: 4 }}>
            {[0, 1].map(i => (
              <motion.span key={i} animate={{ rotate: open ? (i===0?45:-45) : 0, y: open ? (i===0?6:-6) : 0 }}
                style={{ display: "block", width: 20, height: 1.5, background: T.ink, borderRadius: 1 }} />
            ))}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}
            style={{ position: "fixed", inset: 0, zIndex: 490, background: T.bg, paddingTop: 80, paddingLeft: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Services","About","Pricing","Testimonials","Contact"].map((l, i) => (
                <motion.button key={l} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} onClick={() => go(l.toLowerCase())}
                  style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(36px,8vw,64px)", fontWeight: 600, color: T.ink, letterSpacing: "-2px", lineHeight: 1.15, padding: "4px 0" }}>
                  {l}
                </motion.button>
              ))}
            </div>
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
  const y = useTransform(scrollY, [0, 600], [0, 100]);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  return (
    <section id="hero" style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 64, overflow: "hidden", position: "relative" }}>
      {/* Fine grid lines — structural not decorative */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`, backgroundSize: "80px 80px", opacity: 0.5, pointerEvents: "none" }} />

      <motion.div style={{ y, maxWidth: 1280, margin: "0 auto", padding: "80px 40px 100px", width: "100%", position: "relative" }}>
        {/* Eyebrow */}
        <AnimatePresence>
          {ready && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
              <KMark size={20} />
              <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Building Intelligent Systems</span>
              <span style={{ width: 1, height: 12, background: T.border, display: "inline-block" }} />
              <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, color: T.muted }}>Nairobi · Global</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signature: character-stagger hero headline */}
        <div style={{ overflow: "hidden" }}>
          <motion.div style={{ display: "flex", flexWrap: "wrap", lineHeight: 0.95, marginBottom: 0 }}>
            {ready && HERO_CHARS.map((ch, i) => (
              <motion.span key={i} initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.04 }}
                style={{ display: "inline-block", fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(72px, 12vw, 180px)", fontWeight: 700, letterSpacing: "-4px", color: ch === " " ? "transparent" : T.ink, lineHeight: 0.92 }}>
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Second line: "Systems." with accent underline */}
        <div style={{ overflow: "hidden" }}>
          {ready && (
            <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
              style={{ display: "inline-flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(72px, 12vw, 180px)", fontWeight: 700, letterSpacing: "-4px", color: T.accent, lineHeight: 0.92, display: "inline-block", position: "relative" }}>
                Systems.
              </span>
            </motion.div>
          )}
        </div>

        {/* Sub and CTA row */}
        {ready && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.1 }}
            style={{ marginTop: 52, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 32 }}>
            <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "clamp(16px, 1.8vw, 20px)", color: T.muted, lineHeight: 1.65, maxWidth: 440 }}>
              End-to-end ICT services — software engineering, AI, cloud, and cybersecurity — for organisations that need technology to actually work.
            </p>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <MagneticBtn dark onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Start a project
              </MagneticBtn>
              <MagneticBtn onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
                View services
              </MagneticBtn>
            </div>
          </motion.div>
        )}

        {/* Stats strip */}
        {ready && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.6 }}
            style={{ marginTop: 88, paddingTop: 36, borderTop: `1px solid ${T.border}`, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ paddingLeft: i === 0 ? 0 : 24, paddingRight: 24, borderRight: i < 3 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, letterSpacing: "-1.5px", color: T.ink }}>{s.v}</div>
                <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, color: T.muted, marginTop: 4 }}>{s.l}</div>
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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button ref={ref} data-hover onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      whileTap={{ scale: 0.95 }}
      style={{ x: sx, y: sy, cursor: "none", border: dark ? "none" : `1.5px solid ${T.border}`, background: dark ? T.ink : "transparent", color: dark ? T.white : T.ink, padding: "13px 30px", borderRadius: 100, fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.2s, color 0.2s, border-color 0.2s" }}
      onMouseEnter={e => { if (!dark) { e.currentTarget.style.borderColor = T.ink; } }}
      onMouseLeave2={e => { if (!dark) { e.currentTarget.style.borderColor = T.border; } }}>
      {children}
      {dark && <span style={{ fontSize: 16, marginLeft: 2 }}>→</span>}
    </motion.button>
  );
}

/* ─── SERVICES ────────────────────────────────────────────────────────────── */
function Services() {
  const [active, setActive] = useState(0);
  const [ref, inView] = useAnimInView();

  return (
    <section id="services" style={{ background: T.bg, padding: "120px 0 0" }}>
      <Ticker />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px" }}>
        <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>
          <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase", marginBottom: 14 }}>What we do</motion.p>
          <motion.h2 variants={clipReveal}
            style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(36px,5vw,72px)", fontWeight: 700, letterSpacing: "-2.5px", color: T.ink, marginBottom: 72, lineHeight: 1.02, maxWidth: 700 }}>
            A full spectrum of ICT capability
          </motion.h2>
        </motion.div>

        {/* Tab-style services layout */}
        <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${T.border}` }}>
          {/* Left: index list */}
          <div style={{ width: "40%", flexShrink: 0, borderRight: `1px solid ${T.border}` }}>
            {SERVICES.map((s, i) => (
              <motion.button key={i} data-hover onClick={() => setActive(i)}
                whileHover={{ x: 6 }}
                style={{ width: "100%", textAlign: "left", background: active === i ? T.bgAlt : "transparent", border: "none", borderBottom: `1px solid ${T.border}`, padding: "22px 28px 22px 24px", cursor: "none", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.2s", borderLeft: active === i ? `3px solid ${T.accent}` : "3px solid transparent" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, color: active === i ? T.accent : T.muted, fontWeight: 600, letterSpacing: "0.08em" }}>{s.id}</span>
                  <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 16, fontWeight: 600, color: active === i ? T.ink : T.muted, letterSpacing: "-0.3px" }}>{s.title}</span>
                </div>
                <motion.span animate={{ x: active === i ? 0 : -4, opacity: active === i ? 1 : 0 }} style={{ color: T.accent, fontSize: 18 }}>→</motion.span>
              </motion.button>
            ))}
          </div>

          {/* Right: content panel */}
          <div style={{ flex: 1, padding: "48px 52px", minHeight: 400, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: T.accent, textTransform: "uppercase", marginBottom: 20 }}>{SERVICES[active].id} / {SERVICES.length.toString().padStart(2, "0")}</div>
                <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px,3.5vw,52px)", fontWeight: 700, letterSpacing: "-1.5px", color: T.ink, marginBottom: 24, lineHeight: 1.08 }}>{SERVICES[active].title}</h3>
                <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 18, color: T.muted, lineHeight: 1.72, maxWidth: 480 }}>{SERVICES[active].body}</p>
                <div style={{ marginTop: 40 }}>
                  <MagneticBtn onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                    Discuss this service
                  </MagneticBtn>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ABOUT ───────────────────────────────────────────────────────────────── */
function About() {
  const [ref, inView] = useAnimInView();
  return (
    <section id="about" style={{ background: T.bgAlt, padding: "120px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>
          <div style={{ display: "flex", gap: 80, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 44%", minWidth: 280 }}>
              <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase", marginBottom: 14 }}>About</motion.p>
              <motion.h2 variants={clipReveal}
                style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: 700, letterSpacing: "-2px", color: T.ink, lineHeight: 1.04, marginBottom: 32 }}>
                Built by engineers.<br />Driven by outcomes.
              </motion.h2>
              <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 17, color: T.muted, lineHeight: 1.78, marginBottom: 18 }}>
                Kayvion Labs is an ICT services company that partners with organisations to solve hard technology problems. We don't sell products — we deliver outcomes.
              </motion.p>
              <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 17, color: T.muted, lineHeight: 1.78, marginBottom: 44 }}>
                Our team spans software engineers, data scientists, cloud architects, and security specialists across 14 countries. What ties every engagement together is craft, reliability, and measurable impact.
              </motion.p>
              <motion.div variants={fadeSlide()}>
                <MagneticBtn dark onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                  Work with us
                </MagneticBtn>
              </motion.div>
            </div>

            <div style={{ flex: "1 1 44%", minWidth: 280 }}>
              {[
                { t: "Engineering-first",    d: "Every decision is made by practitioners, not account managers. You speak directly with the people building your system." },
                { t: "Transparent process",  d: "Weekly updates, shared repositories, no black-box delivery. You always know where your project stands." },
                { t: "Security by design",   d: "Compliance and threat modelling are built in from day one, not bolted on after launch." },
                { t: "Long-term thinking",   d: "We write code we'd be proud to maintain — because we often do. No quick fixes, no technical debt by default." },
              ].map((v, i) => (
                <motion.div key={i} variants={fadeSlide()} style={{ borderBottom: `1px solid ${T.border}`, padding: "28px 0", display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: "0.08em", marginTop: 4, flexShrink: 0 }}>0{i+1}</span>
                  <div>
                    <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: "-0.3px", marginBottom: 8 }}>{v.t}</div>
                    <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 15, color: T.muted, lineHeight: 1.65 }}>{v.d}</div>
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

/* ─── PRICING ─────────────────────────────────────────────────────────────── */
function Pricing() {
  const [ref, inView] = useAnimInView();
  return (
    <section id="pricing" style={{ background: T.bg, padding: "120px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>
          <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase", marginBottom: 14 }}>Engagement models</motion.p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
            <motion.h2 variants={clipReveal} style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: 700, letterSpacing: "-2px", color: T.ink, lineHeight: 1.04 }}>
              Every project<br />scoped for you.
            </motion.h2>
            <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.muted, maxWidth: 380, lineHeight: 1.7 }}>
              No off-the-shelf pricing. These tiers are a starting framework — every engagement is shaped in a discovery conversation.
            </motion.p>
          </div>

          {/* Horizontal full-width pricing cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
            {PLANS.map((p, i) => (
              <motion.div key={i} variants={fadeSlide()} data-hover
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24, padding: "36px 40px", borderBottom: i < PLANS.length - 1 ? `1px solid ${T.border}` : "none", background: p.hot ? T.ink : T.white, transition: "background 0.2s", cursor: "default", position: "relative" }}
                whileHover={{ background: p.hot ? "#111" : T.bgAlt }}>
                {p.hot && (
                  <div style={{ position: "absolute", top: 20, right: 20, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.1em" }}>POPULAR</div>
                )}
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: p.hot ? "rgba(255,255,255,0.5)" : T.muted, textTransform: "uppercase", marginBottom: 6 }}>{p.tag}</div>
                  <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(24px,2.5vw,36px)", fontWeight: 700, letterSpacing: "-1px", color: p.hot ? T.white : T.ink }}>{p.tier}</div>
                </div>
                <div style={{ display: "flex", gap: 20, flex: 1, flexWrap: "wrap", justifyContent: "center" }}>
                  {p.features.map((f, j) => (
                    <span key={j} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, color: p.hot ? "rgba(255,255,255,0.65)" : T.muted, display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: T.accent, fontSize: 12 }}>✓</span> {f}
                    </span>
                  ))}
                </div>
                <motion.button data-hover whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ cursor: "none", background: p.hot ? T.white : T.ink, color: p.hot ? T.ink : T.white, border: "none", padding: "12px 28px", borderRadius: 100, fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>
                  Talk to us →
                </motion.button>
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
  return (
    <section id="testimonials" style={{ background: T.bgAlt, padding: "120px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>
          <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase", marginBottom: 14 }}>Testimonials</motion.p>
          <motion.h2 variants={clipReveal} style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: 700, letterSpacing: "-2px", color: T.ink, lineHeight: 1.04, marginBottom: 64 }}>
            Clients who took<br />the leap.
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} variants={fadeSlide()} data-hover
                whileHover={{ y: -6 }}
                style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "36px 32px", cursor: "default" }}>
                <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 52, color: T.accent, opacity: 0.18, lineHeight: 1, marginBottom: 20, userSelect: "none" }}>"</div>
                <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.ink, lineHeight: 1.72, marginBottom: 32 }}>"{t.q}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: T.ink, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "'Clash Display', sans-serif", flexShrink: 0 }}>{t.init}</div>
                  <div>
                    <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 15, fontWeight: 600, color: T.ink, letterSpacing: "-0.2px" }}>{t.name}</div>
                    <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, color: T.muted, marginTop: 2 }}>{t.role}</div>
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
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [ref, inView] = useAnimInView();

  const inp = { background: T.white, border: `1px solid ${T.border}`, color: T.ink, padding: "14px 18px", borderRadius: 8, fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 15, outline: "none", width: "100%", transition: "border-color 0.2s" };

  return (
    <section id="contact" style={{ background: T.bg, padding: "120px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        {/* Big CTA band */}
        <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>
          <motion.div variants={fadeSlide()} style={{ background: T.ink, borderRadius: 20, padding: "72px 64px", marginBottom: 96, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 36, position: "relative", overflow: "hidden" }}>
            {/* Subtle dot pattern on dark bg */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`, backgroundSize: "28px 28px", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px,4vw,56px)", fontWeight: 700, color: T.white, letterSpacing: "-1.5px", lineHeight: 1.08, marginBottom: 14 }}>
                Let's build something<br />worth building.
              </h2>
              <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 420, lineHeight: 1.65 }}>
                Whether you have a brief, a vague idea, or just a deadline — we'll help you get to clarity and execution fast.
              </p>
            </div>
            <motion.button data-hover whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
              style={{ position: "relative", cursor: "none", background: T.white, color: T.ink, border: "none", padding: "18px 40px", borderRadius: 100, fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>
              Start a conversation →
            </motion.button>
          </motion.div>

          {/* Form area */}
          <div id="contact-form" style={{ display: "flex", gap: 80, flexWrap: "wrap" }}>
            <motion.div variants={fadeSlide()} style={{ flex: "1 1 36%", minWidth: 260 }}>
              <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase", marginBottom: 14 }}>Contact</p>
              <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(24px,3vw,42px)", fontWeight: 700, letterSpacing: "-1.2px", color: T.ink, lineHeight: 1.08, marginBottom: 22 }}>Talk to the<br />right people.</h3>
              <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.muted, lineHeight: 1.72, marginBottom: 40 }}>
                No sales scripts. You'll speak directly with engineers who understand what you're trying to build.
              </p>
              {[{ l: "Email", v: "hello@kayvionlabs.com" }, { l: "Location", v: "Nairobi, Kenya · Remote worldwide" }].map((item, i) => (
                <div key={i} style={{ marginBottom: 22 }}>
                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: T.muted, textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.ink, fontWeight: 500 }}>{item.v}</div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeSlide()} style={{ flex: "1 1 52%", minWidth: 280 }}>
              {sent ? (
                <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ border: `1px solid ${T.border}`, borderRadius: 12, padding: "64px 40px", textAlign: "center", background: T.white }}>
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5 }} style={{ fontSize: 48, marginBottom: 18 }}>✓</motion.div>
                  <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 26, fontWeight: 700, color: T.ink, letterSpacing: "-0.8px", marginBottom: 10 }}>Message received.</div>
                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.muted }}>We'll be in touch within one business day.</div>
                </motion.div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[{ p: "Your name", k: "name" }, { p: "Email address", k: "email" }].map(f => (
                      <input key={f.k} placeholder={f.p} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} style={inp}
                        onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
                    ))}
                  </div>
                  <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} style={{ ...inp, color: form.service ? T.ink : T.muted }}>
                    <option value="" disabled>Service of interest</option>
                    {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                  </select>
                  <textarea placeholder="Tell us about your project…" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inp, resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
                  <motion.button data-hover whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setSent(true)}
                    style={{ cursor: "none", background: T.ink, color: T.white, border: "none", padding: "17px", borderRadius: 8, fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" }}>
                    Send message →
                  </motion.button>
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
function Footer() {
  return (
    <footer style={{ background: T.ink, borderTop: `1px solid rgba(255,255,255,0.06)`, padding: "28px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <KMark size={22} color="#fff" />
          <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 15, fontWeight: 600, color: T.white, letterSpacing: "-0.3px" }}>Kayvion<span style={{ color: T.accent }}>Labs</span></span>
        </div>
        <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© {new Date().getFullYear()} Kayvion Labs. All rights reserved.</span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms"].map(l => (
            <button key={l} data-hover style={{ cursor: "none", background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 13, fontFamily: "'Cabinet Grotesk', sans-serif" }}>{l}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT ────────────────────────────────────────────────────────────────── */
export default function KayvionLabs() {
  return (
    <div style={{ background: T.bg, color: T.ink, overflowX: "hidden" }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,600,700,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; cursor: none; }
        ::selection { background: rgba(34,85,255,0.15); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }

        /* Responsive breakpoints */
        @media (max-width: 960px) {
          .kl-nav-links { display: none !important; }
          .kl-hamburger { display: flex !important; }
        }
        @media (max-width: 768px) {
          /* Services panel: stack */
          [data-services-wrap] { flex-direction: column !important; }
          /* Pricing: stack */
          [data-pricing-card] { flex-direction: column !important; gap: 16px !important; }
          /* About: stack */
          [data-about-grid] { flex-direction: column !important; gap: 40px !important; }
          /* Testimonials */
          [data-testi-grid] { grid-template-columns: 1fr !important; }
          /* Stats */
          [data-stats-grid] { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          [data-testi-grid] { grid-template-columns: 1fr !important; }
          [data-contact-grid] { flex-direction: column !important; gap: 40px !important; }
        }
        @media (max-width: 480px) {
          [data-name-email] { grid-template-columns: 1fr !important; }
        }
        @media (hover: none) {
          body { cursor: auto !important; }
          button { cursor: pointer !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Pricing />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}












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
