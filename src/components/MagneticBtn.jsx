import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,

} from "framer-motion";


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


/* ─── TOUCH DETECT ────────────────────────────────────────────────────────── */
function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);
  return touch;
}




export function MagneticBtn({ children, dark, onClick }) {
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
      // onMouseLeave={onLeave}
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
