"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef } from "react";
import { shopConfig } from "@/lib/shop/config";
import { HERO, img } from "@/lib/brand/assets";
import { SmartImage } from "@/components/ui/smart-image";
import { Magnetic } from "@/components/motion/magnetic";

/**
 * Cinematic campaign hero — a real Reckless Lab photograph full-bleed with a
 * slow ken-burns push, an ink scrim so type stays legible over the light
 * studio backdrop, and a masked headline. "Opening a Reckless Lab campaign."
 */
export function HeroEditorial() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Mouse-reactive parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const bgX = useTransform(sx, [-0.5, 0.5], [16, -16]);
  const bgY = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const cardX = useTransform(sx, [-0.5, 0.5], [-40, 40]);
  const cardY = useTransform(sy, [-0.5, 0.5], [-26, 26]);
  function onMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section ref={ref} onMouseMove={onMove} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
      {/* Photograph */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 -bottom-24">
        <motion.div style={{ x: bgX, y: bgY }} className="absolute -inset-8 animate-kenburns">
          <SmartImage
            src={HERO.src}
            alt={HERO.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: HERO.focus }}
          />
        </motion.div>
      </motion.div>

      {/* Floating campaign plate — drifts with the cursor for depth */}
      <motion.div
        style={{ x: cardX, y: cardY, opacity }}
        className="pointer-events-none absolute right-[6%] top-[18%] hidden h-[42vh] w-[18vw] overflow-hidden rounded-sm shadow-[0_40px_120px_rgba(0,0,0,0.6)] ring-1 ring-white/10 lg:block"
      >
        <SmartImage src={img("T-4", 3)} alt="Reckless Lab editorial" fill sizes="18vw" className="object-cover" />
      </motion.div>

      {/* Scrims — moody but transparent so the photograph stays the subject */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,11,0.82)_0%,rgba(10,10,11,0.42)_42%,rgba(10,10,11,0.2)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(10,10,11,0.85)_0%,rgba(10,10,11,0.05)_46%,transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.55)_0%,transparent_16%)]" />

      {/* Type */}
      <motion.div
        style={{ y, opacity }}
        className="container-edge relative z-10 flex h-full flex-col justify-end pb-16 md:justify-center md:pb-0"
      >
        <motion.span
          className="eyebrow mb-5"
          style={{ color: "var(--color-onphoto-dim)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
        >
          {shopConfig.brand.locationLabel} — EST {shopConfig.brand.estYear}
        </motion.span>

        <h1
          className="font-display display-xl text-onphoto"
          style={{ textShadow: "0 2px 40px rgba(10,10,11,0.55)" }}
        >
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              IT&rsquo;S NOT
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
            >
              FOR YOU<span className="text-acid">.</span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-6 max-w-md text-lg text-onphoto-dim"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9 }}
        >
          The first drop from the lab — the &lsquo;I Exist&rsquo;, &lsquo;Identity&rsquo; and &lsquo;Reckless&rsquo;
          tees. Washed heavyweight, for the ones who don&rsquo;t follow.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.9 }}
        >
          <Magnetic strength={0.4}>
            <Link
              href="/collections/new-arrivals"
              data-cursor="enter"
              className="bg-bone px-10 py-4 text-mono text-xs font-bold uppercase tracking-[0.25em] text-ink transition-transform hover:scale-[1.02]"
            >
              Shop the Drop
            </Link>
          </Magnetic>
          <Link
            href="/collections/reckless"
            className="link-underline text-mono text-xs uppercase tracking-[0.25em] text-onphoto"
          >
            The Reckless Series
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <span className="text-mono text-[0.6rem] uppercase tracking-[0.3em] text-onphoto-dim">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-acid to-transparent" />
      </motion.div>

      <div className="absolute bottom-8 right-6 z-10 hidden text-mono text-[0.65rem] uppercase tracking-[0.25em] text-onphoto-dim md:block">
        FW / EST {shopConfig.brand.estYear}
      </div>
    </section>
  );
}
