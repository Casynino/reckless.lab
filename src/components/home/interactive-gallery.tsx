"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { SmartImage } from "@/components/ui/smart-image";

interface GalleryRow {
  label: string;
  meta: string;
  href: string;
  image: string;
}

/**
 * A list of chapters; hovering a row floats its image next to the cursor.
 * The kind of interaction that makes people scroll back up to do it again.
 */
export function InteractiveGallery({ rows }: { rows: GalleryRow[] }) {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 18, mass: 0.4 });
  const wrap = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  return (
    <section className="container-edge py-24 md:py-36">
      <span className="eyebrow mb-10 block">[ THE INDEX ]</span>
      <div ref={wrap} onMouseMove={onMove} className="relative">
        {rows.map((row, i) => (
          <Link
            key={row.href}
            href={row.href}
            data-cursor="open"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className="group flex items-center justify-between border-t border-smoke py-6 last:border-b md:py-9"
          >
            <span
              className={`font-display text-4xl transition-all duration-500 md:text-7xl ${
                active === i ? "translate-x-4 text-acid" : "text-bone"
              } ${active !== null && active !== i ? "opacity-30" : "opacity-100"}`}
            >
              {row.label}
            </span>
            <span className="text-mono text-[0.65rem] uppercase tracking-[0.3em] text-ash">{row.meta}</span>
          </Link>
        ))}

        {/* Floating preview */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              className="pointer-events-none absolute left-0 top-0 z-20 hidden aspect-[3/4] w-64 overflow-hidden md:block"
              style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <SmartImage src={rows[active].image} alt={rows[active].label} fill sizes="256px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
