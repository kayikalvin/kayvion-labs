import { useInView, motion,AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useBreakpoint } from "./useBreakpoint";






const TESTIMONIALS_DATA = [
  {
    q: "The prepaid testing program with M-Pesa tokens was the piece that mattered most to us — it let clinics pay as they went instead of carrying a balance. Kayvion got the pricing logic and the trust-focused design right on the first pass.",
    name: "Dr. Kemboi Langat",
    role: "Founder, Xgene Labs",
    init: "KL",
    stat: "M-Pesa",
    statLabel: "native prepaid testing tokens",
  },
  {
    q: "We needed our non-technical staff to update success stories and team bios without calling a developer every time. The admin dashboard Kayvion built alongside our public site means our team manages everything themselves now.",
    name: "Grace Wanjiru",
    role: "Executive Director, Matakiri",
    init: "GW",
    stat: "2-in-1",
    statLabel: "public site + admin CMS, one engagement",
  },
  {
    q: "Distribution is a relationship business, so the WhatsApp integration for partnership inquiries mattered more to us than any contact form ever could. It fits how our partners actually reach out.",
    name: "Otieno Mbugua",
    role: "Managing Director, Dantra Limited",
    init: "OM",
    stat: "WhatsApp",
    statLabel: "native partner inquiry channel",
  },
  {
    q: "Our learners range from total beginners to people already working in IT. Kayvion structured the course pathways so each audience finds its own track immediately, instead of one generic curriculum page.",
    name: "Amani Kiprotich",
    role: "Co-Founder, Somanasi",
    init: "AK",
    stat: "3",
    statLabel: "distinct learner tracks, one platform",
  },
  {
    q: "Pricing transparency was non-negotiable for us — parents and schools needed to see exact costs by age group before enrolling. Kayvion built that clarity into the site itself rather than hiding it behind a quote request.",
    name: "Esther Nyambura",
    role: "Director, DigiMagicTech",
    init: "EN",
    stat: "3",
    statLabel: "age-based pricing tiers, fully transparent",
  },
  {
    q: "Confidence scoring was the hard part — a classifier that just says 'mine' or 'rock' isn't useful without knowing how sure it is. Getting that calibrated and visible in the UI took the model from a demo to something a field analyst could actually trust.",
    name: "Brian Otieno",
    role: "Lead ML Engineer, Kayvion Labs",
    init: "BO",
    stat: "70–100%",
    statLabel: "calibrated confidence range, every prediction",
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





export default function Testimonials() {
  const [ref, inView] = useAnimInView();
  const { isTablet, isMobile } = useBreakpoint();
  const [active, setActive] = useState(0);
  const current = TESTIMONIALS_DATA[active];

  return (
    <section
      id="testimonials"
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
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 20,
              marginBottom: 56,
            }}
          >
            <div>
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
                }}
              >
                Clients who took
                <br />
                the leap.
              </motion.h2>
            </div>

            {/* Index counter, echoes the About section's pattern */}
            <motion.span
              variants={fadeSlide()}
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: T.accent,
                letterSpacing: "0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              0{active + 1} / 0{TESTIMONIALS_DATA.length}
            </motion.span>
          </div>

          {/* Featured quote panel */}
          <motion.div
            variants={fadeSlide()}
            style={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
              gap: isTablet ? 36 : 0,
              background: T.white,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Quote side */}
            <div
              style={{
                flex: isTablet ? "1 1 auto" : "1 1 64%",
                padding: isTablet
                  ? "40px clamp(24px,6vw,40px) 8px"
                  : "64px 56px",
                minHeight: isTablet ? "auto" : 320,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: isTablet
                      ? "clamp(19px,4.2vw,24px)"
                      : "clamp(22px,2.3vw,29px)",
                    fontWeight: 600,
                    letterSpacing: "-0.4px",
                    color: T.ink,
                    lineHeight: 1.4,
                    marginBottom: 36,
                  }}
                >
                  {current.q}
                </motion.p>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    paddingTop: 28,
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
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
                    {current.init}
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
                      {current.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontSize: 12,
                        color: T.muted,
                        marginTop: 2,
                      }}
                    >
                      {current.role}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stat side — pulled detail, sets it apart from a generic card */}
            <div
              style={{
                flex: isTablet ? "1 1 auto" : "1 1 36%",
                background: T.ink,
                padding: isTablet ? "32px clamp(24px,6vw,40px)" : "64px 48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                  pointerEvents: "none",
                }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "relative" }}
                >
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: isTablet
                        ? "clamp(32px,9vw,44px)"
                        : "clamp(36px,5vw,52px)",
                      fontWeight: 700,
                      letterSpacing: "-2px",
                      color: T.white,
                      lineHeight: 1,
                      marginBottom: 12,
                    }}
                  >
                    {current.stat}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontSize: 14,
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.5,
                      maxWidth: 220,
                    }}
                  >
                    {current.statLabel}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Selector grid — 6 entries wrap to 2 rows on desktop/tablet, stacked list on mobile */}
          <motion.div
            variants={fadeSlide()}
            style={{
              display: isMobile ? "flex" : "grid",
              flexDirection: isMobile ? "column" : undefined,
              gridTemplateColumns: isMobile
                ? undefined
                : isTablet
                  ? "1fr 1fr"
                  : "repeat(3, 1fr)",
              gap: isMobile ? 0 : 8,
              marginTop: 24,
              borderTop: isMobile ? `1px solid ${T.border}` : "none",
            }}
          >
            {TESTIMONIALS_DATA.map((t, i) => {
              const isActive = active === i;
              return (
                <button
                  key={i}
                  data-hover
                  onClick={() => setActive(i)}
                  style={{
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: isMobile ? "18px 4px" : "16px 18px",
                    borderBottom: isMobile
                      ? i < TESTIMONIALS_DATA.length - 1
                        ? `1px solid ${T.border}`
                        : "none"
                      : "none",
                    borderTop: !isMobile ? "2px solid" : "none",
                    borderTopColor: !isMobile
                      ? isActive
                        ? T.accent
                        : T.border
                      : undefined,
                    transition: "border-color 0.3s",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      color: isActive ? T.accent : T.muted,
                      letterSpacing: "0.06em",
                      flexShrink: 0,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: isActive ? T.ink : T.muted,
                        letterSpacing: "-0.2px",
                        transition: "color 0.3s",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t.role}
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}