"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

function calc(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    done: diff <= 0,
  };
}
const pad = (n: number) => String(n).padStart(2, "0");

/** Live, animated launch countdown. Ticks every second; each rolling number
 *  slides + un-blurs into place. Fires `onLive` the moment it hits zero. */
export function DropCountdown({
  launchAt,
  onLive,
  size = "lg",
}: {
  launchAt: string;
  onLive?: () => void;
  size?: "lg" | "sm";
}) {
  const target = new Date(launchAt).getTime();
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState(() => calc(target));

  useEffect(() => {
    setMounted(true);
    const tick = () => setT(calc(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  useEffect(() => {
    if (mounted && t.done) onLive?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, t.done]);

  // Reserve height until mounted so the layout doesn't jump (and no SSR mismatch).
  if (!mounted) return <div className={size === "lg" ? "h-24" : "h-10"} />;
  if (t.done) return null;

  const blocks = [
    { v: t.d, l: "Days" },
    { v: t.h, l: "Hrs" },
    { v: t.m, l: "Min" },
    { v: t.s, l: "Sec" },
  ];

  return (
    <div className={cn("flex items-start", size === "lg" ? "gap-2 sm:gap-4" : "gap-1.5")}>
      {blocks.map((b, i) => (
        <div key={b.l} className={cn("flex items-start", size === "lg" ? "gap-2 sm:gap-4" : "gap-1.5")}>
          <Unit value={b.v} label={b.l} size={size} />
          {i < blocks.length - 1 && (
            <span
              className={cn(
                "font-display text-acid/40",
                size === "lg" ? "pt-1 text-4xl sm:pt-2 sm:text-6xl md:text-7xl" : "text-lg",
              )}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function Unit({ value, label, size }: { value: number; label: string; size: "lg" | "sm" }) {
  const str = pad(value);
  const big = size === "lg";
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden font-display leading-none tracking-tight text-bone",
          big ? "h-[1.05em] w-[1.5em] text-5xl sm:text-7xl md:text-8xl" : "h-[1.05em] w-[1.5em] text-xl",
        )}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={str}
            initial={{ y: "70%", opacity: 0, filter: "blur(7px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-70%", opacity: 0, filter: "blur(7px)" }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="absolute tabular-nums"
          >
            {str}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className={cn(
          "text-mono uppercase text-ash",
          big ? "mt-2 text-[0.55rem] tracking-[0.3em] sm:text-[0.65rem]" : "mt-1 text-[0.45rem] tracking-[0.2em]",
        )}
      >
        {label}
      </span>
    </div>
  );
}
