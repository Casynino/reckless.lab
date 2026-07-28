"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SmartImage } from "@/components/ui/smart-image";
import { ChapterTag } from "./chapter-rail";
import { img } from "@/lib/brand/assets";

const VALUES = [
  { name: "Minimal", src: img("T-6", 3), copy: "Nothing extra. Every line earns its place." },
  { name: "Experimental", src: img("T-4", 16), copy: "Washes, prints and cuts tested until they surprise." },
  { name: "Made to last", src: img("T-1", 6), copy: "Heavyweight fabrics, considered construction, no throwaway trends." },
  { name: "Hard to impress", src: img("T-3", 13), copy: "Built for people who don't follow — they're followed." },
  { name: "Mysterious", src: img("T-Mix", 7), copy: "Say it without saying it. If you know, you know." },
  { name: "Authentic", src: img("T-2", 13), copy: "Made by the people who wear it. No focus groups." },
];

/** Chapter 05 — What we stand for. A hover-reactive index: each principle
 *  swaps the preview plate beside it. */
export function ValuesChapter() {
  const [active, setActive] = useState(0);

  return (
    <section id="values" className="relative bg-carbon/40 py-28 md:py-40">
      <div className="container-edge">
        <ChapterTag index={5} label="What We Stand For" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Index */}
          <ul className="order-2 lg:order-1" onMouseLeave={() => setActive(0)}>
            {VALUES.map((v, i) => (
              <li key={v.name}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex w-full items-baseline gap-5 border-b border-smoke py-6 text-left transition-colors"
                >
                  <span className="text-mono text-sm text-acid">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={`font-display text-4xl uppercase tracking-tight transition-all duration-300 md:text-6xl ${
                      active === i ? "translate-x-2 text-bone" : "text-transparent [-webkit-text-stroke:1px_var(--color-ash)]"
                    }`}
                  >
                    {v.name}
                  </span>
                  <span
                    className={`ml-auto hidden max-w-[14rem] text-sm text-fog transition-opacity duration-300 md:block ${
                      active === i ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {v.copy}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Preview */}
          <div className="relative order-1 h-[52vh] overflow-hidden rounded-sm lg:sticky lg:top-24 lg:order-2 lg:h-[70vh]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.06, filter: "blur(14px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(14px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <SmartImage src={VALUES[active].src} alt={VALUES[active].name} fill sizes="45vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                <span className="absolute bottom-6 left-6 font-display text-3xl uppercase text-onphoto md:hidden">{VALUES[active].name}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
