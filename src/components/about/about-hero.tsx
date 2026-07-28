"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { SmartImage } from "@/components/ui/smart-image";
import { img } from "@/lib/brand/assets";

/**
 * Chapter 00 — the cover. A full-bleed campaign plate with a slow ken-burns
 * push, mouse-reactive parallax layers, and a masked title that splits on load.
 * "Opening a Reckless Lab exhibition."
 */
export function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const bgX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const bgY = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const cardX = useTransform(sx, [-0.5, 0.5], [-46, 46]);
  const cardY = useTransform(sy, [-0.5, 0.5], [-28, 28]);

  function onMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <section ref={ref} onMouseMove={onMove} className="relative h-[100svh] min-h-[680px] overflow-hidden bg-ink">
      {/* Base plate */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <motion.div style={{ x: bgX, y: bgY }} className="absolute -inset-12 animate-kenburns">
          <SmartImage src={img("T-Mix", 3)} alt="Reckless Lab campaign" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: "50% 38%" }} />
        </motion.div>
      </motion.div>

      {/* Floating framed plate */}
      <motion.div
        style={{ x: cardX, y: cardY, opacity: fade }}
        className="pointer-events-none absolute right-[6%] top-[16%] hidden h-[46vh] w-[20vw] overflow-hidden rounded-sm shadow-[0_40px_120px_rgba(0,0,0,0.6)] ring-1 ring-white/10 lg:block"
      >
        <SmartImage src={img("T-4", 3)} alt="Reckless Lab editorial" fill sizes="20vw" className="object-cover" />
      </motion.div>

      {/* Scrims */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,11,0.86)_0%,rgba(10,10,11,0.4)_46%,rgba(10,10,11,0.15)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(10,10,11,0.9)_0%,rgba(10,10,11,0.05)_44%,transparent_66%)]" />

      {/* Type */}
      <motion.div style={{ opacity: fade }} className="container-edge relative z-10 flex h-full flex-col justify-end pb-[10vh]">
        <motion.span
          className="eyebrow mb-6"
          style={{ color: "var(--color-onphoto-dim)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          [ Behind the Lab ] — EST 2026 · Banjul
        </motion.span>

        <h1 className="font-display display-hero text-onphoto" style={{ textShadow: "0 2px 60px rgba(10,10,11,0.6)" }}>
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "115%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease, delay: 0.15 }} className="block">
              Reckless
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "115%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease, delay: 0.27 }} className="block text-transparent [-webkit-text-stroke:1.5px_var(--color-onphoto)]">
              Laboratory<span className="text-acid [-webkit-text-stroke:0]">.</span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-8 max-w-xl text-lg text-onphoto-dim"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
        >
          Not a brand. A movement — born from two teenagers who chose to move differently.
          Scroll to move through it.
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        style={{ opacity: fade }}
      >
        <span className="text-mono text-[0.6rem] uppercase tracking-[0.3em] text-onphoto-dim">Enter</span>
        <span className="h-12 w-px animate-pulse bg-gradient-to-b from-acid to-transparent" />
      </motion.div>
    </section>
  );
}
