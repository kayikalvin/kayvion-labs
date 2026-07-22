import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useBreakpoint } from "../components/useBreakpoint";

/**
 * GetQuote — self-serve quote page for kayvionlabs.com
 *
 * Visitor describes the site they want. On submit:
 *  - POSTs to /api/quote-request
 *  - Draft + lead land in Kayvion's inbox for manual review — nothing auto-sends to the client.
 *
 * Styling matches the rest of the site: Clash Display / Cabinet Grotesk,
 * warm off-white palette, clip-reveal headings, fade-slide stagger sections.
 */

/* ─── TOKENS ──────────────────────────────────────────────────────────────── */
const T = {
  bg: "#F2F1ED",
  bgAlt: "#EBE9E4",
  ink: "#1A1A1A",
  muted: "#8F8C83",
  border: "#D9D5CE",
  accent: "#2255FF",
  white: "#FFFFFF",
  error: "#E5484D",
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

/* ─── DATA ────────────────────────────────────────────────────────────────── */
const SITE_TYPES = [
  { value: "landing", label: "Landing page ", from: 25000 },
  { value: "business", label: "Business website (multi-page)", from: 65000 },
  { value: "ecommerce", label: "Online store", from: 95000 },
  { value: "webapp", label: "Web app / custom system", from: 150000 },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  business: "",
  siteType: "business",
  description: "",
  pages: "",
  features: "",
  timeline: "",
};

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────────── */
export default function GetQuote() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const { isTablet, isMobile } = useBreakpoint();
  const [heroRef, heroInView] = useAnimInView();

  const selectedType = SITE_TYPES.find((t) => t.value === form.siteType);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

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

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!form.name.trim() || !form.email.trim() || !form.description.trim()) {
      setStatus("error");
      setErrorMsg("Tell us your name, email, and what you want built.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err.message ||
          "Something went wrong sending your request. Please email us directly at info@kayvionlabs.com.",
      );
    }
  }

  return (
    <div style={{ background: T.bg }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,600,700,800&display=swap');
        input, textarea, select { font-family: inherit; -webkit-appearance: none; }
        input::placeholder, textarea::placeholder { color: ${T.muted}; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: T.bg,
          padding: "clamp(140px,16vw,200px) 0 clamp(48px,7vw,80px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid background, matches Hero.jsx */}
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
        <div
          ref={heroRef}
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(20px,5vw,40px)",
            position: "relative",
          }}
        >
          <motion.div
            initial="hidden"
            animate={heroInView ? "show" : "hidden"}
            variants={stag(0.1)}
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
                Get a quote
              </p>
            </motion.div>

            <motion.h1
              variants={clipReveal}
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(36px,6vw,80px)",
                fontWeight: 700,
                letterSpacing: isTablet ? "-1.5px" : "-3px",
                color: T.ink,
                lineHeight: 1.02,
                marginBottom: 24,
                maxWidth: 780,
              }}
            >
              Tell us what
              <br />
              you're building.
            </motion.h1>

            <motion.p
              variants={fadeSlide()}
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "clamp(15px,1.8vw,19px)",
                color: T.muted,
                lineHeight: 1.7,
                maxWidth: 560,
              }}
            >
              Basic sites start at{" "}
              <span style={{ color: T.ink, fontWeight: 600 }}>
                KES {selectedType.from.toLocaleString()}
              </span>
              . Describe what you want below — an engineer reviews every
              request before anything is sent back to you. No auto-generated
              quotes.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── FORM SECTION ─────────────────────────────────────────────── */}
      <section style={{ background: T.bg, padding: "0 0 clamp(80px,10vw,140px)" }}>
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
              gap: isTablet ? 40 : 80,
              flexDirection: isTablet ? "column" : "row",
              alignItems: "flex-start",
            }}
          >
            {/* Left info column — mirrors Contact.jsx layout */}
            <FormSideInfo isTablet={isTablet} selectedType={selectedType} />

            {/* Right form column */}
            <div style={{ flex: "1 1 52%", minWidth: 0, width: "100%" }}>
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      border: `1px solid ${T.border}`,
                      borderRadius: 16,
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
                      We're on it.
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontSize: 16,
                        color: T.muted,
                        maxWidth: 380,
                        margin: "0 auto",
                        lineHeight: 1.65,
                      }}
                    >
                      No auto-generated quote lands in your inbox — an
                      engineer reviews what you told us and replies with a
                      real number, usually within a day.
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      background: T.white,
                      border: `1px solid ${T.border}`,
                      borderRadius: 16,
                      padding: isMobile ? "24px" : "36px",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: 14,
                      }}
                    >
                      <input
                        placeholder="Your name"
                        value={form.name}
                        onChange={update("name")}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        style={getInputStyle("name")}
                        disabled={status === "sending"}
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={update("email")}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        style={getInputStyle("email")}
                        disabled={status === "sending"}
                      />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: 14,
                      }}
                    >
                      <input
                        placeholder="Phone (optional)"
                        value={form.phone}
                        onChange={update("phone")}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        style={getInputStyle("phone")}
                        disabled={status === "sending"}
                      />
                      <input
                        placeholder="Business name (optional)"
                        value={form.business}
                        onChange={update("business")}
                        onFocus={() => setFocusedField("business")}
                        onBlur={() => setFocusedField(null)}
                        style={getInputStyle("business")}
                        disabled={status === "sending"}
                      />
                    </div>

                    <div style={{ position: "relative" }}>
                      <select
                        value={form.siteType}
                        onChange={update("siteType")}
                        onFocus={() => setFocusedField("siteType")}
                        onBlur={() => setFocusedField(null)}
                        disabled={status === "sending"}
                        style={{
                          ...getInputStyle("siteType"),
                          appearance: "none",
                          cursor: "pointer",
                          paddingRight: 40,
                        }}
                      >
                        {SITE_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label} — from KES {t.from.toLocaleString()}
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
                      placeholder="Describe what you want built — e.g. a site for my hardware shop with a product catalogue, WhatsApp ordering, and an about page."
                      rows={5}
                      value={form.description}
                      onChange={update("description")}
                      onFocus={() => setFocusedField("description")}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        ...getInputStyle("description"),
                        height: 150,
                        resize: "none",
                      }}
                      disabled={status === "sending"}
                    />

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: 14,
                      }}
                    >
                      <input
                        type="number"
                        min="1"
                        placeholder="Estimated pages (optional)"
                        value={form.pages}
                        onChange={update("pages")}
                        onFocus={() => setFocusedField("pages")}
                        onBlur={() => setFocusedField(null)}
                        style={getInputStyle("pages")}
                        disabled={status === "sending"}
                      />
                      <input
                        placeholder="Timeline (e.g. 2 weeks, no rush)"
                        value={form.timeline}
                        onChange={update("timeline")}
                        onFocus={() => setFocusedField("timeline")}
                        onBlur={() => setFocusedField(null)}
                        style={getInputStyle("timeline")}
                        disabled={status === "sending"}
                      />
                    </div>

                    <input
                      placeholder="Specific features (optional) — e.g. M-Pesa payments, booking calendar"
                      value={form.features}
                      onChange={update("features")}
                      onFocus={() => setFocusedField("features")}
                      onBlur={() => setFocusedField(null)}
                      style={getInputStyle("features")}
                      disabled={status === "sending"}
                    />

                    {status === "error" && errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          fontFamily: "'Cabinet Grotesk', sans-serif",
                          fontSize: 13.5,
                          color: T.error,
                          background: "rgba(229,72,77,0.08)",
                          border: "1px solid rgba(229,72,77,0.25)",
                          borderRadius: 8,
                          padding: "10px 14px",
                          lineHeight: 1.5,
                        }}
                      >
                        {errorMsg}
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      whileHover={{ scale: status === "sending" ? 1 : 1.01 }}
                      whileTap={{ scale: status === "sending" ? 1 : 0.98 }}
                      disabled={status === "sending"}
                      style={{
                        cursor: status === "sending" ? "not-allowed" : "pointer",
                        opacity: status === "sending" ? 0.7 : 1,
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
                      {status === "sending" ? "Sending…" : "Request a quote"}
                      {status !== "sending" && (
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
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── LEFT INFO PANEL ─────────────────────────────────────────────────────── */
function FormSideInfo({ isTablet, selectedType }) {
  const [ref, inView] = useAnimInView();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={stag(0.08)}
      style={{
        flex: isTablet ? "1 1 100%" : "0 0 36%",
        minWidth: 0,
        position: isTablet ? "static" : "sticky",
        top: 140,
      }}
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
        How it works
      </motion.p>

      <motion.h3
        variants={fadeSlide()}
        style={{
          fontFamily: "'Clash Display', sans-serif",
          fontSize: "clamp(22px,3vw,34px)",
          fontWeight: 700,
          letterSpacing: "-1px",
          color: T.ink,
          lineHeight: 1.12,
          marginBottom: 24,
        }}
      >
        From brief to
        <br />
        real number.
      </motion.h3>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {[
          {
            n: "01",
            t: "You describe the project",
            d: "Fill in what you're building, roughly how big it is, and any must-have features.",
          },
          {
            n: "02",
            t: "An engineer reviews it",
            d: "No bot replies. A real person on our team looks at your brief and scopes it properly.",
          },
          {
            n: "03",
            t: "You get a real quote",
            d: "Usually within one business day, with a clear price and next steps if you want to proceed.",
          },
        ].map((step, i) => (
          <motion.div
            key={i}
            variants={fadeSlide()}
            style={{
              display: "flex",
              gap: 16,
              padding: "18px 0",
              borderBottom: i < 2 ? `1px solid ${T.border}` : "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: T.accent,
                flexShrink: 0,
                paddingTop: 2,
              }}
            >
              {step.n}
            </span>
            <div>
              <div
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: T.ink,
                  letterSpacing: "-0.2px",
                  marginBottom: 4,
                }}
              >
                {step.t}
              </div>
              <div
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 14,
                  color: T.muted,
                  lineHeight: 1.6,
                }}
              >
                {step.d}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={fadeSlide()}
        style={{
          marginTop: 28,
          padding: "18px 20px",
          background: T.bgAlt,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
        }}
      >
        <div
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: T.muted,
            marginBottom: 6,
          }}
        >
          Starting from
        </div>
        <div
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.8px",
            color: T.ink,
          }}
        >
          KES {selectedType.from.toLocaleString()}
        </div>
        <div
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 13,
            color: T.muted,
            marginTop: 2,
          }}
        >
          {selectedType.label}
        </div>
      </motion.div>
    </motion.div>
  );
}