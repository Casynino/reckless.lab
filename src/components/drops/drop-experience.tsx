"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { DropCountdown } from "./drop-countdown";
import { NotifyForm } from "./notify-form";
import type { Drop } from "@/lib/drops/store";

/** The full drop experience — cinematic hero, live countdown, notify capture,
 *  and a triumphant "it's live" reveal the instant the timer hits zero. */
export function DropExperience({ drop }: { drop: Drop }) {
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (Date.now() >= new Date(drop.launchAt).getTime()) setLive(true);
  }, [drop.launchAt]);

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink pt-28 pb-20">
      {drop.image && (
        <div className="absolute inset-0">
          <SmartImage
            src={drop.image}
            alt={drop.name}
            fill
            priority
            sizes="100vw"
            className="animate-kenburns object-cover opacity-55"
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(10,10,11,0.97)_0%,rgba(10,10,11,0.5)_55%,rgba(10,10,11,0.8)_100%)]" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full bg-acid/20 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#6d1740]/30 blur-[130px]" />
      <div className="grain" />

      <div className="container-edge relative z-10 w-full">
        <AnimatePresence mode="wait">
          {live ? (
            <motion.div key="live" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl">
              <motion.span
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="inline-flex items-center gap-2 text-mono text-xs uppercase tracking-[0.3em] text-acid"
              >
                <span className="h-2 w-2 rounded-full bg-acid" /> Live now
              </motion.span>
              <h1 className="mt-5 font-display display-hero text-onphoto">{drop.name}</h1>
              {drop.teaser && <p className="mt-6 max-w-xl text-lg leading-relaxed text-onphoto-dim">{drop.teaser}</p>}
              <Link
                href={drop.ctaHref}
                className="mt-10 inline-flex items-center gap-3 bg-acid px-10 py-5 text-mono text-sm font-bold uppercase tracking-[0.25em] text-ink transition-opacity hover:opacity-90"
              >
                Enter the drop <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          ) : (
            <motion.div key="pre" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="max-w-4xl">
              <span className="eyebrow" style={{ color: "var(--color-acid)" }}>[ Next Drop ]</span>
              <h1 className="mt-5 font-display display-xl text-onphoto">{drop.name}</h1>
              {drop.teaser && <p className="mt-5 max-w-xl text-lg leading-relaxed text-onphoto-dim">{drop.teaser}</p>}

              <div className="mt-12">
                <p className="mb-5 text-mono text-[0.6rem] uppercase tracking-[0.3em] text-ash">Dropping in</p>
                <DropCountdown launchAt={drop.launchAt} onLive={() => setLive(true)} />
              </div>

              {drop.description && <p className="mt-11 max-w-lg text-sm leading-relaxed text-fog">{drop.description}</p>}

              <div className="mt-9">
                <p className="mb-3 text-mono text-[0.6rem] uppercase tracking-[0.25em] text-ash">Be first through the door</p>
                <NotifyForm dropId={drop.id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
