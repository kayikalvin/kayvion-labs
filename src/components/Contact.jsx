import { useInView, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useBreakpoint } from "./useBreakpoint";


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




export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [ref, inView] = useAnimInView();
  const { isTablet, isMobile } = useBreakpoint();
  const [focusedField, setFocusedField] = useState(null);

  const getInputStyle = (fieldKey) => ({
    background: T.white,
    border: `1.5px solid ${focusedField === fieldKey ? T.accent : T.border}`,
    color: T.ink,
    padding: "15px 18px",
    borderRadius: 10,
    fontFamily: "'Cabinet Grotesk', sans-serif",
    fontSize: 15,
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow:
      focusedField === fieldKey
        ? `0 0 0 4px ${T.accent}1A`
        : "0 1px 2px rgba(0,0,0,0.03)",
  });

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
                { l: "Email", v: "info@kayvionlabs.com" },
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
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    background: T.white,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: isMobile ? "24px" : "32px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                    height: isMobile ? "auto" : 460,
                    overflowY: "auto",
                  }}
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
                        style={getInputStyle(f.k)}
                        onFocus={() => setFocusedField(f.k)}
                        onBlur={() => setFocusedField(null)}
                      />
                    ))}
                  </div>

                  <div style={{ position: "relative" }}>
                    <select
                      value={form.service}
                      onChange={(e) =>
                        setForm({ ...form, service: e.target.value })
                      }
                      onFocus={() => setFocusedField("service")}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        ...getInputStyle("service"),
                        color: form.service ? T.ink : T.muted,
                        appearance: "none",
                        cursor: "pointer",
                        paddingRight: 40,
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
                    <span
                      style={{
                        position: "absolute",
                        right: 18,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: T.accent,
                        fontSize: 12,
                        pointerEvents: "none",
                      }}
                    >
                      ▾
                    </span>
                  </div>

                  <textarea
                    placeholder="Tell us about your project…"
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    style={{ ...getInputStyle("message"), height: 180,  resize: "none" }}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSent(true)}
                    style={{
                      cursor: "pointer",
                      background: T.ink,
                      color: T.white,
                      border: "none",
                      padding: "17px",
                      borderRadius: 10,
                      fontFamily: "'Clash Display', sans-serif",
                      fontWeight: 700,
                      fontSize: 17,
                      letterSpacing: "-0.3px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    Send message
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 1.2,
                      }}
                    >
                      →
                    </motion.span>
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
