// ProjectDetail.jsx — Kayvion Labs · Individual case study page
// Matches KayvionLabs.jsx design system exactly
// Signature element: scroll-progress scrubber with floating section label on left edge
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

/* ─── TOKENS ──────────────────────────────────────────────────────────────── */
const T = {
  bg: "#F7F7F5",
  bgAlt: "#F0F0EC",
  ink: "#0A0A0A",
  muted: "#8B8B85",
  border: "#E2E2DC",
  accent: "#2255FF",
  white: "#FFFFFF",
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
  return { isMobile: width < 560, isTablet: width < 768, isDesktop: width >= 960, width };
}

function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => { setTouch(window.matchMedia("(hover: none)").matches); }, []);
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
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
});
const stag = (d = 0.08) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });
const clipReveal = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  show: { clipPath: "inset(0 0% 0 0)", opacity: 1, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
};

/* ─── EXTENDED PROJECT DATA ───────────────────────────────────────────────── */
// This data extends the base PROJECTS array from ProjectsIndex.
// In a real app you'd keep it in one place; here it's self-contained.
const PROJECT_DETAILS = {
  "finedge-platform": {
    overview:
      "FinEdge Africa's payment infrastructure had grown organically for six years — bolted-together services, single points of failure, and a database that locked under load. When transaction volume spiked during month-end payroll cycles, the platform failed. They needed a complete rebuild, with zero tolerance for downtime during migration.",
    challenge:
      "The existing monolith handled everything from user authentication to settlement in a single Node.js process. Migrating without a maintenance window — while the system processed live money — required a strangler-fig pattern: new microservices absorbing routes one by one, with dual writes during transition and exhaustive reconciliation at every step.",
    approach: [
      {
        phase: "Discovery & threat model",
        detail:
          "We spent three weeks mapping every data flow, integration point, and failure mode in the existing system before writing a single line of new code. You can't migrate what you don't fully understand.",
      },
      {
        phase: "Architecture design",
        detail:
          "Designed a microservices topology on AWS EKS — separate services for auth, payments, ledger, notifications, and settlement — with event sourcing via Kafka and a CQRS read model for reporting.",
      },
      {
        phase: "Strangler migration",
        detail:
          "Deployed new services behind a routing layer, incrementally shifting traffic. Each service went live with dual-write mode, reconciliation jobs ran nightly, and rollback was one config change.",
      },
      {
        phase: "Load testing & hardening",
        detail:
          "Simulated 3× peak load before cutover. Identified and resolved three race conditions in the settlement service that wouldn't have surfaced under normal conditions.",
      },
    ],
    outcome:
      "The rebuilt platform handled FinEdge's busiest month-end on record — 73,000 transactions in a single day — without a single failure. Infrastructure costs dropped 34% due to right-sized autoscaling. The engineering team shipped their first feature on the new platform within two weeks of cutover.",
    metrics: [
      { value: "50K", label: "Daily transaction capacity" },
      { value: "99.99%", label: "Uptime since launch" },
      { value: "34%", label: "Infrastructure cost reduction" },
      { value: "0", label: "Data integrity issues during migration" },
    ],
    services: ["Software Engineering", "Cloud Architecture", "API & Integration"],
    deliverables: [
      "Microservices architecture on AWS EKS",
      "Kafka event-sourcing backbone",
      "Zero-downtime migration playbook",
      "Custom reconciliation and audit tooling",
      "Runbook and 30-day hypercare support",
    ],
    quote: {
      text: "They delivered a platform handling 50,000 daily transactions without a hiccup. Rare to say this honestly — the engineering quality is exceptional.",
      name: "Amara Diallo",
      role: "CTO, FinEdge Africa",
      init: "AD",
    },
  },
  "petrologic-ai": {
    overview:
      "PetroLogic's operational analysts spent most of their working week producing reports that leadership then spent the rest of the week questioning. The data was in the system — extracting meaning from it was a full-time job. The ask: eliminate the manual work, not the analysts.",
    challenge:
      "The company ran on SAP for operations and a bespoke data warehouse built over a decade. Neither was designed for ML access. Before any model could be trained, the data needed significant engineering: normalisation, deduplication, and a pipeline that could ingest updates in near-real-time without touching production systems.",
    approach: [
      {
        phase: "Data archaeology",
        detail:
          "Four weeks of schema mapping, data quality assessment, and domain interviews with senior analysts to understand what 'correct' looked like before we tried to automate it.",
      },
      {
        phase: "Feature engineering",
        detail:
          "Built 140+ features from raw operational signals. The most predictive turned out to be lagged equipment utilisation ratios — not the obvious candidates the team initially suggested.",
      },
      {
        phase: "Model development",
        detail:
          "Trained gradient-boosted and transformer-based models for the three core report types. Final architecture used an ensemble, with per-segment confidence scores surfaced to analysts so they could spot where the model was less certain.",
      },
      {
        phase: "Dashboard & integration",
        detail:
          "Built a React dashboard on top of a FastAPI inference service. Reports generate in under 90 seconds. Analysts review, annotate, and approve before distribution.",
      },
    ],
    outcome:
      "Analysts who previously spent 35 hours a week on reporting now spend fewer than 10 — the rest goes to actual analysis. The models catch anomalies that were previously noticed only after they became problems. Three months in, the system flagged a developing equipment issue six days before the maintenance team would have caught it.",
    metrics: [
      { value: "70%", label: "Reduction in analyst report time" },
      { value: "90s", label: "Report generation time" },
      { value: "140+", label: "Engineered features" },
      { value: "6 days", label: "Early fault detection lead time" },
    ],
    services: ["AI & Machine Learning", "Data & Analytics"],
    deliverables: [
      "Production ML inference service (FastAPI + Docker)",
      "Feature pipeline with near-real-time ingestion",
      "Three trained models with ensemble voting",
      "Executive dashboard (React)",
      "Model monitoring and drift detection",
    ],
    quote: {
      text: "Our AI reporting system cut analyst time by 70%. Kayvion understood our data immediately and built something we couldn't have imagined doing alone.",
      name: "Seun Adeyemi",
      role: "Head of Ops, PetroLogic",
      init: "SA",
    },
  },
  "healthtrack-platform": {
    overview:
      "HealthTrack's founder had a working prototype and a launch deadline driven by an investor milestone. What they didn't have was a security-compliant architecture, a production-ready mobile app, or an engineering team. They had 14 weeks.",
    challenge:
      "Health data is regulated. Every design decision — from where data is stored to how authentication tokens expire — had compliance implications. The constraint wasn't the deadline; it was building something genuinely secure without letting compliance concerns slow the product to a standstill.",
    approach: [
      {
        phase: "Compliance-first scoping",
        detail:
          "Week one was a compliance workshop. We mapped required controls to product features and identified which decisions were irreversible. Data residency, encryption at rest, audit logging — all locked before any code.",
      },
      {
        phase: "Parallel tracks",
        detail:
          "Split the team: one track building the React Native mobile app, one building the clinical web dashboard, one handling infrastructure and security controls. Weekly integration checkpoints kept them converging.",
      },
      {
        phase: "Security by design",
        detail:
          "Role-based access control at the API and database layer. Field-level encryption for sensitive health attributes. Automated compliance scanning in CI. Penetration test at week 10 — two medium findings, both resolved before launch.",
      },
      {
        phase: "Staged rollout",
        detail:
          "Launched to a closed beta of 50 clinicians at week 13. Collected structured feedback, shipped 12 fixes, and opened the full launch at week 14.",
      },
    ],
    outcome:
      "Launched on deadline. The platform passed its external security audit on the first attempt. Within 60 days of launch, HealthTrack had onboarded 12 clinics and was processing 800+ patient interactions per week.",
    metrics: [
      { value: "14wk", label: "Idea to compliant launch" },
      { value: "0", label: "Audit findings at launch" },
      { value: "12", label: "Clinics onboarded in 60 days" },
      { value: "800+", label: "Weekly patient interactions" },
    ],
    services: ["Web & Mobile Apps", "Cloud Architecture", "Cybersecurity"],
    deliverables: [
      "React Native patient app (iOS + Android)",
      "Clinical web dashboard (React)",
      "HIPAA-aligned Node.js API",
      "Infrastructure-as-code (Terraform + AWS)",
      "Security audit report and remediation",
    ],
    quote: {
      text: "From discovery to deployment — clear, on-schedule, outcome exceeded expectations. That combination is genuinely rare in the industry.",
      name: "Ngozi Okafor",
      role: "Founder, HealthTrack",
      init: "NO",
    },
  },
};

// Fill in the remaining projects with plausible detail
["solarnet-iot", "retailco-automation", "govtech-security"].forEach((id) => {
  if (!PROJECT_DETAILS[id]) {
    PROJECT_DETAILS[id] = {
      overview: "Full case study available on request. Contact us to learn more about this engagement.",
      challenge: "Details withheld at client request.",
      approach: [{ phase: "Discovery", detail: "Full methodology available on request." }],
      outcome: "Delivered on brief, on schedule.",
      metrics: [],
      services: [],
      deliverables: [],
      quote: null,
    };
  }
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
    const move = (e) => { cx.set(e.clientX); cy.set(e.clientY); };
    const over = (e) => { if (e.target.closest("button, a, [data-hover]")) setHovered(true); };
    const out = () => setHovered(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mouseout", out); };
  }, [isTouch]);

  if (isTouch) return null;
  return (
    <motion.div
      style={{ position: "fixed", top: 0, left: 0, width: 10, height: 10, borderRadius: "50%", background: T.accent, pointerEvents: "none", zIndex: 9999, x: sx, y: sy, translateX: "-50%", translateY: "-50%", scale, mixBlendMode: "multiply" }}
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

/* ─── SCROLL PROGRESS SCRUBBER (signature element) ───────────────────────── */
// A thin vertical line on the left edge of the viewport that fills
// as the user scrolls, with the current section label floating beside it.
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
      { threshold: 0.4, rootMargin: "-20% 0px -60% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.querySelector(`[data-section="${s}"]`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (isTablet) return null;

  return (
    <div style={{
      position: "fixed",
      left: 20,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      gap: 12,
      pointerEvents: "none",
    }}>
      {/* Track */}
      <div style={{ width: 2, height: 120, background: T.border, borderRadius: 1, position: "relative", overflow: "hidden" }}>
        <motion.div
          style={{ position: "absolute", top: 0, left: 0, right: 0, background: T.accent, scaleY, transformOrigin: "top", height: "100%", borderRadius: 1 }}
        />
      </div>
      {/* Label */}
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

/* ─── NAVBAR ──────────────────────────────────────────────────────────────── */
function Navbar({ onNavigate, onBack }) {
  const [solid, setSolid] = useState(true);
  const { isDesktop } = useBreakpoint();
  const isTouch = useIsTouch();

  useEffect(() => {
    const h = () => setSolid(window.scrollY > 32);
    setSolid(true);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 500,
        transition: "background 0.3s, border-color 0.3s",
        background: "rgba(247,247,245,0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
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
          <span style={{ color: T.border, fontSize: 18 }}>·</span>
          <button
            data-hover
            onClick={onBack}
            style={{ background: "none", border: "none", cursor: isTouch ? "pointer" : "none", fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: T.muted, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 6 }}
          >
            ← Work
          </button>
        </div>

        {isDesktop && (
          <motion.button
            data-hover
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate?.("contact")}
            style={{ cursor: isTouch ? "pointer" : "none", background: T.ink, color: T.white, border: "none", padding: "10px 24px", borderRadius: 100, fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 14 }}
          >
            Let's talk
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
}

/* ─── HERO ────────────────────────────────────────────────────────────────── */
function DetailHero({ project }) {
  const [ready, setReady] = useState(false);
  const { isMobile } = useBreakpoint();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 80]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section style={{
      minHeight: "90vh",
      background: project.color,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
      paddingTop: 64, overflow: "hidden", position: "relative",
    }}>
      {/* Dot pattern overlay */}
      <motion.div style={{ y: bgY, position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`, backgroundSize: "32px 32px", pointerEvents: "none" }} />

      {/* Accent glow */}
      <div style={{ position: "absolute", top: "20%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: project.accentColor, opacity: 0.07, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", padding: "clamp(48px,8vw,100px) clamp(20px,5vw,40px) 64px", position: "relative" }}>

        {/* Breadcrumb */}
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isMobile ? 32 : 48 }}
          >
            <KMark size={18} color={project.accentColor} />
            <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Case study
            </span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.15)", display: "inline-block" }} />
            <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              {project.index} / 0{6}
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <div style={{ overflow: "hidden", marginBottom: 20 }}>
          {ready && (
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(36px, 7vw, 100px)",
                fontWeight: 700, letterSpacing: isMobile ? "-2px" : "-4px",
                color: T.white, lineHeight: 0.96,
              }}
            >
              {project.name}
            </motion.h1>
          )}
        </div>

        {/* Metric hero */}
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{ marginBottom: 48 }}
          >
            <span style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(52px, 10vw, 140px)",
              fontWeight: 700, letterSpacing: isMobile ? "-3px" : "-6px",
              color: project.accentColor, lineHeight: 0.92, display: "block",
            }}>
              {project.metric.value}
            </span>
            <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.45)", marginTop: 8, display: "block" }}>
              {project.metric.label}
            </span>
          </motion.div>
        )}

        {/* Meta row */}
        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            style={{
              paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex", flexWrap: "wrap", gap: isMobile ? 24 : 48,
            }}
          >
            {[
              { l: "Client", v: project.client },
              { l: "Sector", v: project.sector },
              { l: "Year", v: project.year },
              { l: "Services", v: project.services.join(", ") },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 6 }}>{item.l}</div>
                <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{item.v}</div>
              </div>
            ))}
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
    <section data-section={label} style={{ background: T.bg, padding: "clamp(64px,8vw,100px) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 clamp(20px,5vw,40px)` }}>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={stag(0.1)}
        >
          <div style={{ display: "flex", gap: isMobile ? 0 : 80, flexDirection: isMobile ? "column" : "row", alignItems: "flex-start" }}>
            {/* Left label col */}
            <div style={{ width: isMobile ? "auto" : 200, flexShrink: 0, marginBottom: isMobile ? 28 : 0 }}>
              <motion.p
                variants={fadeSlide()}
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase" }}
              >
                {eyebrow || label}
              </motion.p>
            </div>
            {/* Right content */}
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
    <section data-section="Approach" style={{ background: T.bgAlt, padding: "clamp(64px,8vw,100px) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 clamp(20px,5vw,40px)` }}>
        <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>
          <div style={{ display: "flex", gap: isMobile ? 0 : 80, flexDirection: isMobile ? "column" : "row", alignItems: "flex-start" }}>
            <div style={{ width: isMobile ? "auto" : 200, flexShrink: 0, marginBottom: isMobile ? 28 : 0 }}>
              <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase" }}>
                Approach
              </motion.p>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeSlide()}
                  style={{
                    display: "flex", gap: 24, alignItems: "flex-start",
                    padding: "32px 0",
                    borderBottom: i < steps.length - 1 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, letterSpacing: "-2px", color: T.border, lineHeight: 1, flexShrink: 0, width: 72, textAlign: "right" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: T.ink, marginBottom: 10 }}>
                      {step.phase}
                    </div>
                    <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.muted, lineHeight: 1.72 }}>
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

  const cols = isMobile ? "1fr 1fr" : `repeat(${Math.min(metrics.length, 4)}, 1fr)`;

  return (
    <section data-section="Metrics" style={{ background: project.color, padding: "clamp(64px,8vw,100px) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 clamp(20px,5vw,40px)` }}>
        <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.12)}>
          <motion.p
            variants={fadeSlide()}
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 48 }}
          >
            Results
          </motion.p>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: isMobile ? "40px 0" : 0 }}>
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeSlide()}
                style={{
                  paddingLeft: (isMobile ? i % 2 !== 0 : i !== 0) ? 32 : 0,
                  paddingRight: 32,
                  borderRight: isMobile
                    ? (i % 2 === 0 ? "1px solid rgba(255,255,255,0.08)" : "none")
                    : (i < metrics.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none"),
                  borderBottom: isMobile && i < metrics.length - 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  paddingBottom: isMobile && i < metrics.length - 2 ? 40 : 0,
                }}
              >
                <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(32px, 4.5vw, 64px)", fontWeight: 700, letterSpacing: "-2px", color: project.accentColor, lineHeight: 1 }}>
                  {m.value}
                </div>
                <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
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
    <section style={{ background: T.bg, padding: "clamp(64px,8vw,100px) 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 clamp(20px,5vw,40px)` }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: 800 }}
        >
          <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(64px, 8vw, 120px)", color: T.accent, opacity: 0.12, lineHeight: 0.7, marginBottom: 24, userSelect: "none" }}>
            "
          </div>
          <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(20px, 3vw, 36px)", fontWeight: 600, letterSpacing: "-0.8px", color: T.ink, lineHeight: 1.3, marginBottom: 36 }}>
            "{quote.text}"
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: T.ink, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: "'Clash Display', sans-serif", flexShrink: 0 }}>
              {quote.init}
            </div>
            <div>
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 16, fontWeight: 600, color: T.ink, letterSpacing: "-0.2px" }}>{quote.name}</div>
              <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, color: T.muted, marginTop: 2 }}>{quote.role}</div>
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
    <section style={{ background: T.bgAlt, padding: "clamp(64px,8vw,100px) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 clamp(20px,5vw,40px)` }}>
        <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={stag(0.1)}>
          <div style={{ display: "flex", gap: isMobile ? 0 : 80, flexDirection: isMobile ? "column" : "row", alignItems: "flex-start" }}>
            <div style={{ width: isMobile ? "auto" : 200, flexShrink: 0, marginBottom: isMobile ? 28 : 0 }}>
              <motion.p variants={fadeSlide()} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase" }}>
                What we built
              </motion.p>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeSlide()}
                  style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : "none" }}
                >
                  <span style={{ color: T.accent, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, color: T.ink, fontWeight: 500 }}>{item}</span>
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
        onClick={() => { onSelect(next); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-hover
        style={{
          cursor: isTouch ? "pointer" : "none",
          maxWidth: 1280, margin: "0 auto",
          padding: "64px clamp(20px,5vw,40px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: T.muted, marginBottom: 12 }}>
            Next project
          </div>
          <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(24px,4vw,56px)", fontWeight: 700, letterSpacing: "-2px", color: hovered ? T.accent : T.ink, transition: "color 0.25s", lineHeight: 1.05 }}>
            {next.name}
          </div>
          <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, color: T.muted, marginTop: 8 }}>
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

/* ─── ROOT ────────────────────────────────────────────────────────────────── */
export default function ProjectDetail({ project, allProjects, onNavigate, onBack, onSelectProject }) {
  const detail = PROJECT_DETAILS[project.id] || PROJECT_DETAILS["healthtrack-platform"];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [project.id]);

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
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
      `}</style>

      <Cursor />
      <ScrollScrubber />
      <Navbar onNavigate={onNavigate} onBack={onBack} />

      <DetailHero project={project} />

      {/* Overview */}
      <ProseSection label="Overview" eyebrow="The brief">
        <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "clamp(16px, 2vw, 20px)", color: T.ink, lineHeight: 1.75 }}>
          {detail.overview}
        </p>
      </ProseSection>

      {/* Challenge */}
      <section data-section="Challenge" style={{ background: T.bgAlt, padding: "clamp(64px,8vw,100px) 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>
          <div style={{ display: "flex", gap: "clamp(0px, 8vw, 80px)", flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ width: 200, flexShrink: 0 }}>
              <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase" }}>
                The challenge
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "clamp(16px, 2vw, 20px)", color: T.ink, lineHeight: 1.75 }}>
                {detail.challenge}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ApproachSteps steps={detail.approach} />

      {/* Outcome */}
      <ProseSection label="Outcome" eyebrow="The outcome">
        <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "clamp(16px, 2vw, 20px)", color: T.ink, lineHeight: 1.75 }}>
          {detail.outcome}
        </p>
      </ProseSection>

      <MetricsBand metrics={detail.metrics} project={project} />

      <QuoteBlock quote={detail.quote} />

      <Deliverables items={detail.deliverables} />

      {allProjects && allProjects.length > 1 && (
        <NextProject current={project} allProjects={allProjects} onSelect={onSelectProject} />
      )}
    </div>
  );
}