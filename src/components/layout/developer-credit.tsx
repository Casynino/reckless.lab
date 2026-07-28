"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/layout/logo-mark";

/** Footer developer credit — opens a card with Nino's bio + contacts. */
export function DeveloperCredit() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-1.5 text-mono text-[0.65rem] uppercase tracking-[0.25em] text-ash transition-colors hover:text-bone"
      >
        Developed by <span className="text-acid transition-colors group-hover:text-bone">Nino</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-ink/85 backdrop-blur-md" onClick={() => setOpen(false)} />

            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg overflow-hidden rounded-sm border border-smoke bg-ink-soft p-8 md:p-10"
            >
              {/* Ambient red glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(224,52,42,0.22),transparent)]" />

              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-5 top-5 z-10 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash transition-colors hover:text-bone"
              >
                Close ✕
              </button>

              <div className="relative">
                <div className="flex items-center gap-3">
                  <LogoMark size={40} />
                  <span className="text-mono text-[0.6rem] uppercase tracking-[0.3em] text-acid">The Build</span>
                </div>

                <h3 className="mt-6 font-display text-5xl uppercase tracking-tight text-bone md:text-6xl">Nino</h3>
                <p className="mt-2 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-fog">
                  Full-stack developer &amp; design engineer
                </p>

                <p className="mt-6 leading-relaxed text-bone-dim">
                  I design and build premium, cinematic web experiences — the kind that make a brand
                  impossible to forget. This whole platform, storefront to admin, was crafted end-to-end.
                  Splitting my time between Tanzania and China, chasing where code, design and culture meet.
                </p>

                <div className="mt-8 flex flex-col gap-3 border-t border-smoke pt-6">
                  <a href="mailto:casmiry21@icloud.com" className="link-underline w-fit text-sm text-bone-dim transition-colors hover:text-bone">
                    casmiry21@icloud.com
                  </a>
                  <a href="https://wa.me/255752828082" target="_blank" rel="noreferrer" className="link-underline w-fit text-sm text-bone-dim transition-colors hover:text-acid">
                    WhatsApp · +255 752 828 082
                  </a>
                  <a href="https://wa.me/8615527610603" target="_blank" rel="noreferrer" className="link-underline w-fit text-sm text-bone-dim transition-colors hover:text-acid">
                    WhatsApp · +86 155 2761 0603
                  </a>
                </div>

                <p className="mt-8 text-mono text-[0.55rem] uppercase tracking-[0.3em] text-ash">
                  Available for select projects
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
