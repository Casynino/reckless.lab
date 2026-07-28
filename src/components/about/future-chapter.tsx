"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SmartImage } from "@/components/ui/smart-image";
import { SplitText } from "@/components/motion/split-text";
import { ButtonLink } from "@/components/ui/button-link";
import { img } from "@/lib/brand/assets";

/** Chapter 07 — The Future. A full-bleed close with a slow push and the call
 *  back into the drop. */
export function FutureChapter() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="future" ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink">
      <motion.div style={{ scale, y }} className="absolute -inset-10">
        <SmartImage src={img("T-Mix", 2)} alt="Reckless Lab — the future" fill sizes="100vw" className="object-cover" style={{ objectPosition: "50% 45%" }} />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_60%,rgba(10,10,11,0.35)_0%,rgba(10,10,11,0.9)_80%)]" />

      <div className="container-edge relative z-10 text-center">
        <motion.span
          className="eyebrow mb-8 block"
          style={{ color: "var(--color-onphoto-dim)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          [ 07 — The Future ]
        </motion.span>

        <SplitText as="h2" text="The future is Reckless." className="font-display display-hero text-onphoto" />

        <motion.p
          className="mx-auto mt-8 max-w-lg text-lg text-onphoto-dim"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          The first drop is live. The rest is being written. Move first — or watch from the outside.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.35 }}
        >
          <ButtonLink href="/collections/new-arrivals" variant="solid" cursor="enter">
            Shop the Drop
          </ButtonLink>
          <ButtonLink href="/collections" variant="ghost">
            View all series
          </ButtonLink>
        </motion.div>

        <p className="mt-16 text-mono text-[0.6rem] uppercase tracking-[0.35em] text-onphoto-dim">555 · EST 2026 · Banjul → Worldwide</p>
      </div>
    </section>
  );
}
