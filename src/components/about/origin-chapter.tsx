"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SmartImage } from "@/components/ui/smart-image";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ChapterTag } from "./chapter-rail";
import { img } from "@/lib/brand/assets";

/** Chapter 01 — The Beginning. A sticky portrait scales as the origin story
 *  reveals block by block beside it. */
export function OriginChapter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section id="beginning" ref={ref} className="relative bg-ink">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-0 lg:grid-cols-2">
        {/* Sticky image */}
        <div className="relative h-[60vh] lg:sticky lg:top-0 lg:h-screen">
          <motion.div style={{ scale, y: imgY }} className="absolute inset-0 overflow-hidden">
            <SmartImage src={img("T-3", 3)} alt="Reckless Lab — the beginning" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" style={{ objectPosition: "50% 35%" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
          </motion.div>
          <div className="absolute bottom-8 left-8 z-10">
            <span className="text-mono text-[0.6rem] uppercase tracking-[0.3em] text-onphoto-dim">Frame 001 — Origin</span>
          </div>
        </div>

        {/* Story */}
        <div className="flex flex-col justify-center px-6 py-24 sm:px-12 lg:px-20 lg:py-[16vh]">
          <ChapterTag index={1} label="The Beginning" />
          <SplitText as="h2" text="They had the world in their hands." className="font-display display-lg text-bone" />

          <div className="mt-10 space-y-7 text-lg leading-relaxed text-bone-dim">
            <Reveal>
              <p>
                Reckless Lab was born from two teenagers who had opportunities, influence, and the
                ability to inspire the people around them.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                Instead of following the obvious path, they chose to move differently. They embraced
                uncertainty. They took risks. They made something <span className="text-bone">authentic</span>.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="border-l-2 border-acid pl-6 text-2xl font-medium leading-snug text-bone">
                “If you have to ask, it was never for you.”
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
