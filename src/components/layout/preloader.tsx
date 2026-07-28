"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { shopConfig } from "@/lib/shop/config";

/**
 * Intro sequence — a statement, not a spinner.
 *
 *   Beat 1  "IT'S NOT FOR YOU."   · ACCESS // RESTRICTED
 *   Beat 2  "I EXIST"             · ACCESS // GRANTED
 *   Beat 3  panel wipes up → hero
 *
 * Shown once per session. Hard-stop safety so a throttled/background tab can
 * never trap a visitor behind the gate.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05 } },
};
const line: Variants = {
  hidden: { y: "120%" },
  show: { y: "0%", transition: { duration: 0.85, ease: EASE } },
  exit: { y: "-120%", transition: { duration: 0.6, ease: EASE } },
};

/** A masked line that rises in and rises out. */
function MaskLine({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className="block overflow-hidden">
      <motion.span variants={line} className={`block ${className ?? ""}`}>
        {children}
      </motion.span>
    </span>
  );
}

export function Preloader() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<0 | 1>(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Plays on every full page load / reload. It does NOT replay on in-app
    // navigation because this lives in the root layout, which Next.js keeps
    // mounted across route changes.
    setActive(true);
    document.body.style.overflow = "hidden";

    const finish = () => {
      document.body.style.overflow = "";
      setDone(true);
    };

    const toAssert = setTimeout(() => setPhase(1), 2000);
    const toDone = setTimeout(finish, 3350);
    const hardStop = setTimeout(finish, 6000); // safety net for throttled tabs
    const onVisible = () => {
      if (document.visibilityState === "visible") setPhase((p) => p);
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(toAssert);
      clearTimeout(toDone);
      clearTimeout(hardStop);
      document.removeEventListener("visibilitychange", onVisible);
      document.body.style.overflow = "";
    };
  }, []);

  if (!active) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink px-6 py-6 md:px-10 md:py-8"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
        >
          {/* Top meta */}
          <div className="flex items-center justify-between text-mono text-[0.7rem] uppercase tracking-[0.3em] text-ash">
            <span>{shopConfig.brand.locationLabel}</span>
            <span>EST {shopConfig.brand.estYear}</span>
          </div>

          {/* Statement */}
          <div className="flex flex-1 items-center">
            <AnimatePresence mode="wait">
              {phase === 0 ? (
                <motion.div
                  key="reject"
                  variants={group}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="font-display display-xl text-bone"
                >
                  <MaskLine>IT&rsquo;S NOT</MaskLine>
                  <MaskLine>
                    FOR YOU<span className="text-acid">.</span>
                  </MaskLine>
                </motion.div>
              ) : (
                <motion.div
                  key="assert"
                  variants={group}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="font-display display-hero text-bone"
                >
                  <MaskLine>
                    &ldquo;I EX<span className="text-acid">I</span>ST&rdquo;
                  </MaskLine>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom status + progress */}
          <div>
            <div className="flex items-end justify-between">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className={`text-mono text-[0.7rem] uppercase tracking-[0.3em] ${
                    phase === 1 ? "text-acid" : "text-ash"
                  }`}
                >
                  {phase === 1 ? "Access // Granted" : "Access // Restricted"}
                </motion.span>
              </AnimatePresence>
              <span className="text-mono text-[0.7rem] uppercase tracking-[0.3em] text-ash">
                {shopConfig.brand.name}
              </span>
            </div>
            {/* Progress line — CSS driven so it runs even when rAF is throttled */}
            <div className="mt-4 h-px w-full bg-smoke">
              <div
                className="h-px bg-acid"
                style={{ animation: "preload-bar 3.35s cubic-bezier(0.16,1,0.3,1) forwards" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
