"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SmartImage } from "@/components/ui/smart-image";
import { Marquee } from "@/components/motion/marquee";
import { SplitText } from "@/components/motion/split-text";
import { img } from "@/lib/brand/assets";

/** Chapter 02 — The Mindset. A moody full-bleed statement, then a double
 *  marquee of the brand's adjectives running in opposite directions. */
export function MindsetChapter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const grade = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 0.7, 0.9]);

  return (
    <section id="mindset" ref={ref} className="relative overflow-hidden bg-ink">
      <div className="relative flex min-h-[110vh] items-center justify-center py-32">
        {/* Background plate */}
        <motion.div style={{ y: bgY }} className="absolute -inset-16">
          <SmartImage src={img("T-4", 7)} alt="Reckless Lab mindset" fill sizes="100vw" className="object-cover" style={{ objectPosition: "50% 30%" }} />
        </motion.div>
        <motion.div style={{ opacity: grade }} className="absolute inset-0 bg-ink" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_0%,rgba(10,10,11,0.85)_75%)]" />

        {/* Statement */}
        <motion.div style={{ y: textY }} className="container-edge relative z-10 text-center">
          <p className="eyebrow mb-8 text-fog">[ The Mindset ]</p>
          <SplitText as="h2" text="Move differently." className="font-display display-hero text-onphoto" />
          <motion.p
            className="mx-auto mt-10 max-w-xl text-lg text-onphoto-dim"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9 }}
          >
            A brand for people who are hard to impress. Who don&rsquo;t follow trends. Who don&rsquo;t
            wear clothes because everyone else does — and stand out without trying.
          </motion.p>
        </motion.div>
      </div>

      {/* Adjective marquees */}
      <div className="relative z-10 -mt-4 space-y-3 pb-24">
        <Marquee
          items={["RECKLESS", "MINIMAL", "EXPERIMENTAL", "MYSTERIOUS", "AUTHENTIC"]}
          duration={34}
          className="font-display text-6xl uppercase text-onphoto md:text-8xl"
        />
        <Marquee
          items={["FOR THE FEW", "NOT FOR YOU", "EST 2026", "MADE TO LAST", "555"]}
          duration={40}
          reverse
          className="font-display text-6xl uppercase text-transparent [-webkit-text-stroke:1px_var(--color-onphoto-dim)] md:text-8xl"
        />
      </div>
    </section>
  );
}
