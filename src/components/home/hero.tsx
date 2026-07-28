"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { shopConfig } from "@/lib/shop/config";
import { Magnetic } from "@/components/motion/magnetic";

// WebGL is client-only and lazy — the page paints instantly, the scene hydrates after.
const HeroCanvas = dynamic(() => import("@/components/three/hero-canvas"), { ssr: false });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const line1 = "FEARLESS";
  const line2 = "BY DESIGN";

  return (
    <section ref={ref} className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
      {/* WebGL specimen */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
      </div>

      {/* Vignette + grain sit above canvas, below type */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(120%_120%_at_50%_40%,transparent_30%,rgba(10,10,11,0.7)_100%)]" />

      {/* Type */}
      <motion.div style={{ y, opacity }} className="relative z-20 flex flex-col items-center px-6 text-center">
        <motion.span
          className="eyebrow mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {shopConfig.brand.locationLabel} — Experimental Fashion Laboratory
        </motion.span>

        <h1 className="font-display display-hero text-bone mix-blend-difference">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              {line1}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
            >
              BY DES<span className="text-acid">I</span>GN
            </motion.span>
          </span>
        </h1>

        <motion.div
          className="mt-10 flex flex-col items-center gap-5 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
        >
          <Magnetic strength={0.4}>
            <Link
              href="/collections/new-arrivals"
              data-cursor="enter"
              className="bg-bone px-10 py-4 text-mono text-xs font-bold uppercase tracking-[0.25em] text-ink transition-transform hover:scale-[1.02]"
            >
              Enter the Lab
            </Link>
          </Magnetic>
          <Link
            href="/collections/limited-drops"
            className="link-underline text-mono text-xs uppercase tracking-[0.25em] text-bone"
          >
            View Limited Drops
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <span className="text-mono text-[0.6rem] uppercase tracking-[0.3em] text-ash">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-acid to-transparent" />
      </motion.div>

      {/* Corner meta */}
      <div className="absolute bottom-8 left-6 z-20 hidden text-mono text-[0.65rem] uppercase tracking-[0.25em] text-ash md:block">
        [ SPECIMEN_01 ]
      </div>
      <div className="absolute bottom-8 right-6 z-20 hidden text-mono text-[0.65rem] uppercase tracking-[0.25em] text-ash md:block">
        FW / {shopConfig.brand.est}
      </div>
    </section>
  );
}
