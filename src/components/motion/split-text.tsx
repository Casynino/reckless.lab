"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  /** Delay before the first word (s). */
  delay?: number;
  /** Stagger between words (s). */
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  once?: boolean;
}

/**
 * Word-by-word mask reveal — each word rises out of an overflow-hidden line.
 * The signature "editorial" headline animation.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  as = "h2",
  once = true,
}: SplitTextProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
  };

  const Tag = motion[as];

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span variants={word} className="inline-block">
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
