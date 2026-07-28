"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

/** Measurements in cm for the washed heavyweight tees (garment, laid flat). */
const ROWS: { size: string; chest: string; length: string; shoulder: string }[] = [
  { size: "S", chest: "54", length: "70", shoulder: "50" },
  { size: "M", chest: "57", length: "72", shoulder: "53" },
  { size: "L", chest: "60", length: "74", shoulder: "56" },
  { size: "XL", chest: "63", length: "76", shoulder: "59" },
];

export function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg border border-smoke bg-ink-soft p-7 md:p-9"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="eyebrow">[ SIZE GUIDE ]</span>
                <h2 className="mt-2 font-display text-2xl text-bone">Find your fit</h2>
              </div>
              <button onClick={onClose} aria-label="Close" className="text-bone hover:text-acid">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-sm text-fog">
              Our tees are cut boxy and oversized. Garment measurements below (cm), laid flat. For a cropped,
              closer fit — size down.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-smoke text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
                    <th className="py-3 pr-4 font-normal">Size</th>
                    <th className="py-3 pr-4 font-normal">Chest</th>
                    <th className="py-3 pr-4 font-normal">Length</th>
                    <th className="py-3 font-normal">Shoulder</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.size} className="border-b border-smoke/50 text-sm text-bone">
                      <td className="py-3 pr-4 font-medium text-acid">{r.size}</td>
                      <td className="py-3 pr-4">{r.chest}</td>
                      <td className="py-3 pr-4">{r.length}</td>
                      <td className="py-3">{r.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 border-t border-smoke pt-5 text-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.15em] text-ash">
              How to measure — <span className="text-bone-dim">Chest:</span> armpit to armpit ×2.{" "}
              <span className="text-bone-dim">Length:</span> highest shoulder point to hem.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
