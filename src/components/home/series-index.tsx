"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SmartImage } from "@/components/ui/smart-image";
import { ChapterTag } from "@/components/about/chapter-rail";
import { img } from "@/lib/brand/assets";

const SERIES = [
  { slug: "i-exist", name: "‘I Exist’", meta: "SET // 01", copy: "Arched RECKLESS front, a quiet ‘I EXIST’ on the back.", src: img("T-1", 14) },
  { slug: "identity", name: "‘Identity’", meta: "SET // 02", copy: "The R-Serpent, printed big on the back. Three washes.", src: img("T-2", 3) },
  { slug: "reckless", name: "‘Reckless’", meta: "SET // 03", copy: "The R-Serpent + wordmark lockup. The signature.", src: img("T-4", 1) },
];

/**
 * Three series, one hover-reactive index. The preview plate crossfades as you
 * move between names — navigation that reads like an editorial contents page.
 */
export function SeriesIndex() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-carbon/40 py-24 md:py-36">
      <div className="container-edge">
        <ChapterTag index={2} label="The Series" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Preview */}
          <div className="relative order-1 h-[46vh] overflow-hidden rounded-sm lg:h-[64vh]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.06, filter: "blur(16px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(16px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <SmartImage src={SERIES[active].src} alt={SERIES[active].name} fill sizes="45vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              </motion.div>
            </AnimatePresence>
            <span className="absolute bottom-5 left-5 text-mono text-[0.6rem] uppercase tracking-[0.3em] text-onphoto-dim">{SERIES[active].meta}</span>
          </div>

          {/* Index */}
          <ul className="order-2 flex flex-col justify-center">
            {SERIES.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/collections/${s.slug}`}
                  data-cursor="explore"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-center justify-between gap-6 border-b border-smoke py-7 md:py-9"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="text-mono text-sm text-acid">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`font-display text-4xl uppercase tracking-tight transition-all duration-300 md:text-7xl ${
                        active === i ? "translate-x-2 text-bone" : "text-transparent [-webkit-text-stroke:1px_var(--color-ash)]"
                      }`}
                    >
                      {s.name}
                    </span>
                  </div>
                  <span className={`hidden max-w-[15rem] text-sm text-fog transition-opacity duration-300 md:block ${active === i ? "opacity-100" : "opacity-0"}`}>
                    {s.copy}
                  </span>
                  <span className="text-mono text-lg text-bone transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
