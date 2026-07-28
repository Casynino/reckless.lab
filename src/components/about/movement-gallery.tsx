"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SmartImage } from "@/components/ui/smart-image";
import { img } from "@/lib/brand/assets";

const PANELS = [
  { src: img("T-Mix", 5), label: "Campaign", n: "01", focus: "50% 40%" },
  { src: img("T-1", 8), label: "Street", n: "02", focus: "50% 30%" },
  { src: img("T-3", 22), label: "Editorial", n: "03", focus: "50% 25%" },
  { src: img("T-4", 8), label: "Studio", n: "04", focus: "50% 35%" },
  { src: img("T-5", 6), label: "Texture", n: "05", focus: "50% 45%" },
  { src: img("T-6", 5), label: "Detail", n: "06", focus: "50% 30%" },
];

/** Chapter 03 — The Movement. Vertical scroll drives a horizontal filmstrip
 *  through the campaign; the section pins while the strip travels. */
export function MovementGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  useEffect(() => {
    const calc = () => {
      if (trackRef.current) setMaxX(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <section id="movement" ref={ref} className="relative bg-ink" style={{ height: "420vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex items-stretch gap-6 pl-6 sm:gap-8 sm:pl-12">
          {/* Intro panel */}
          <div className="flex h-[78vh] w-[86vw] shrink-0 flex-col justify-center sm:w-[42vw]">
            <span className="text-mono text-sm text-acid">03 — The Movement</span>
            <h2 className="mt-6 font-display display-lg text-bone">
              Scroll is a<br />campaign<span className="text-acid">.</span>
            </h2>
            <p className="mt-6 max-w-sm text-bone-dim">
              Six frames from the first drop — street, studio, and everything between. Keep going.
            </p>
            <span className="mt-10 text-mono text-[0.6rem] uppercase tracking-[0.3em] text-fog">Drag your scroll →</span>
          </div>

          {/* Image panels */}
          {PANELS.map((p) => (
            <figure key={p.n} className="group relative h-[78vh] w-[86vw] shrink-0 overflow-hidden rounded-sm sm:w-[62vw] lg:w-[44vw]">
              <SmartImage src={p.src} alt={`Reckless Lab — ${p.label}`} fill sizes="(max-width:640px) 86vw, 44vw" className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: p.focus }} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <figcaption className="absolute bottom-6 left-6 flex items-end gap-3">
                <span className="font-display text-5xl text-onphoto">{p.n}</span>
                <span className="mb-2 text-mono text-[0.7rem] uppercase tracking-[0.25em] text-onphoto-dim">{p.label}</span>
              </figcaption>
            </figure>
          ))}

          {/* Outro panel */}
          <div className="flex h-[78vh] w-[70vw] shrink-0 flex-col justify-center pr-12 sm:w-[34vw]">
            <h2 className="font-display display-lg text-transparent [-webkit-text-stroke:1px_var(--color-bone)]">
              Not for<br />you.
            </h2>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
