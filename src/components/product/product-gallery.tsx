"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import type { MediaAsset } from "@/lib/types";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

/**
 * Product gallery: sticky thumbnail rail + large image with hover-zoom and a
 * fullscreen lightbox. Supports video assets too.
 */
export function ProductGallery({ media, name }: { media: MediaAsset[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const current = media[active];

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <>
      <div className="flex flex-col-reverse gap-3 md:flex-row">
        {/* Thumbnails */}
        <div className="flex gap-3 md:flex-col">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-carbon transition-opacity md:w-20",
                i === active ? "opacity-100 ring-1 ring-acid" : "opacity-50 hover:opacity-90",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <SmartImage src={m.src} alt={m.alt} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>

        {/* Main */}
        <div
          className="relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden bg-carbon"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={onMove}
          onClick={() => setLightbox(true)}
          data-cursor="zoom"
        >
          {current.video ? (
            <video src={current.video} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <SmartImage
              src={current.src}
              alt={current.alt}
              fill
              priority
              sizes="(max-width:768px) 100vw, 55vw"
              className="object-cover transition-transform duration-300 ease-out"
              style={{ transform: zoom ? "scale(1.6)" : "scale(1)", transformOrigin: origin }}
            />
          )}
          <span className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-ink/70 px-3 py-1.5 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone backdrop-blur">
            <ZoomIn className="h-3.5 w-3.5" /> Expand
          </span>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/95 p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute right-5 top-5 text-bone hover:text-acid"
              onClick={() => setLightbox(false)}
              aria-label="Close"
            >
              <X className="h-7 w-7" />
            </button>
            <motion.div
              className="relative h-full w-full max-w-3xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImage src={current.src} alt={current.alt} fill sizes="90vw" className="object-contain" />
            </motion.div>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              {media.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={cn("h-1.5 w-6 transition-colors", i === active ? "bg-acid" : "bg-smoke")}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
