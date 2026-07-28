"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

interface Section {
  title: string;
  body: React.ReactNode;
}

export function ProductAccordion({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-smoke">
      {sections.map((s, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-smoke">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="text-mono text-xs uppercase tracking-[0.25em] text-bone">{s.title}</span>
              <Plus
                className={`h-4 w-4 text-bone transition-transform duration-300 ${isOpen ? "rotate-45 text-acid" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-sm leading-relaxed text-fog">{s.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
