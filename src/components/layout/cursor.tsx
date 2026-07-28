"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Custom cursor: a small dot that trails a larger ring. The ring grows and
 * shows a label when hovering elements marked with [data-cursor] or links.
 * Falls back to the native cursor on touch devices.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    function move(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor], input, textarea, select",
      );
      if (el) {
        setHovering(true);
        setLabel(el.getAttribute("data-cursor"));
      } else {
        setHovering(false);
        setLabel(null);
      }
    }
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid"
        style={{ x, y }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/50 text-[0.55rem] uppercase tracking-[0.2em] text-bone"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: label ? 76 : hovering ? 52 : 34,
          height: label ? 76 : hovering ? 52 : 34,
          backgroundColor: label ? "rgba(198,242,78,0.12)" : "rgba(0,0,0,0)",
          borderColor: hovering ? "rgba(198,242,78,0.9)" : "rgba(236,232,225,0.4)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {label}
      </motion.div>
    </>
  );
}
