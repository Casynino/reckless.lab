"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-scrubbed manifesto: the words brighten from carbon to bone as they
 * pass through the viewport centre — a reading spotlight.
 */
const WORDS =
  "We are a laboratory where fashion rules are broken to make something alive. For the ones who are hard to impress. For the ones who stand out without trying.".split(
    " ",
  );

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });

  return (
    <section className="container-edge py-28 md:py-40">
      <span className="eyebrow mb-10 block">[ MANIFESTO ]</span>
      <div ref={ref} className="flex flex-wrap gap-x-[0.28em] gap-y-1">
        {WORDS.map((word, i) => {
          const start = i / WORDS.length;
          const end = start + 1 / WORDS.length;
          return <Word key={i} word={word} range={[start, end]} progress={scrollYProgress} />;
        })}
      </div>
    </section>
  );
}

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const accent = word.replace(/[.,]/g, "").toLowerCase();
  const isAccent = ["alive.", "alive", "reckless", "impress."].includes(word.toLowerCase());
  return (
    <motion.span
      style={{ opacity }}
      className={`font-display text-3xl leading-tight md:text-5xl lg:text-6xl ${
        isAccent ? "text-acid" : "text-bone"
      }`}
      data-word={accent}
    >
      {word}
    </motion.span>
  );
}
