"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const CHAPTERS = [
  { id: "beginning", label: "The Beginning" },
  { id: "mindset", label: "The Mindset" },
  { id: "movement", label: "The Movement" },
  { id: "laboratory", label: "The Laboratory" },
  { id: "values", label: "We Stand For" },
  { id: "community", label: "The Community" },
  { id: "future", label: "The Future" },
];

/** Fixed museum-style chapter index + a scroll progress line. */
export function ChapterRail() {
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = CHAPTERS.findIndex((c) => c.id === e.target.id);
            if (i >= 0) setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Top scroll progress line */}
      <motion.div
        className="fixed left-0 top-0 z-40 h-[2px] w-full origin-left bg-acid"
        style={{ scaleX: bar }}
      />

      {/* Chapter index — desktop only */}
      <nav aria-label="Chapters" className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
        {CHAPTERS.map((c, i) => (
          <a key={c.id} href={`#${c.id}`} className="group flex items-center gap-3">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "scale-150 bg-acid" : "bg-bone/30 group-hover:bg-bone/60"
                }`}
              />
            </span>
            <span
              className={`text-mono text-[0.58rem] uppercase tracking-[0.2em] transition-all duration-300 ${
                i === active ? "text-bone opacity-100" : "text-fog opacity-0 group-hover:opacity-70"
              }`}
            >
              {String(i + 1).padStart(2, "0")} · {c.label}
            </span>
          </a>
        ))}
      </nav>
    </>
  );
}

/** Small chapter kicker used above each section heading. */
export function ChapterTag({ index, label }: { index: number; label: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="text-mono text-sm text-acid">{String(index).padStart(2, "0")}</span>
      <span className="h-px w-12 bg-acid/50" />
      <span className="text-mono text-[0.65rem] uppercase tracking-[0.3em] text-fog">{label}</span>
    </div>
  );
}
