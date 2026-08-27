"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { shopConfig } from "@/lib/shop/config";
import { maintenance } from "@/lib/shop/maintenance";

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

/**
 * The dark-store screen. Deliberately bare: no header, no nav, nothing that
 * links back into a storefront that isn't serving. Just the mark, the reason,
 * the ETA, and the channels that still work.
 */
export function MaintenanceScreen() {
  const wa = `https://wa.me/${shopConfig.whatsapp.number}`;

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden px-6 py-10 md:px-12 md:py-14">
      {/* Slow acid bloom behind the type — the only motion on the page. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-acid) 14%, transparent) 0%, transparent 62%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.header
        variants={rise}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-ash"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acid" />
        </span>
        {shopConfig.brand.name}
        <span className="text-smoke">/</span>
        EST {shopConfig.brand.est}
      </motion.header>

      <motion.main
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.09, delayChildren: 0.15 }}
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-16"
      >
        <motion.p
          variants={rise}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[11px] uppercase tracking-[0.32em] text-acid"
        >
          Store offline
        </motion.p>

        <motion.h1
          variants={rise}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 font-display text-[clamp(2.6rem,9vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-bone"
        >
          {maintenance.headline}
        </motion.h1>

        {/* Indeterminate sweep: work is happening, we're not saying how much. */}
        <motion.div
          variants={rise}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-8 h-px w-full overflow-hidden bg-smoke"
        >
          <motion.span
            aria-hidden
            className="absolute inset-y-0 w-1/3 bg-acid"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.p
          variants={rise}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-base leading-relaxed text-fog md:text-lg"
        >
          {maintenance.body}
        </motion.p>

        <motion.p
          variants={rise}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 inline-flex w-fit items-center gap-3 border border-smoke px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-bone-dim"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-acid" />
          {maintenance.eta}
        </motion.p>
      </motion.main>

      <motion.footer
        variants={rise}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-4 border-t border-smoke pt-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ash">
          Already ordered? We&rsquo;re still on WhatsApp.
        </p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bone transition-colors hover:text-acid"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
            {shopConfig.whatsapp.label}
          </a>
          <a
            href={shopConfig.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bone transition-colors hover:text-acid"
          >
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            {shopConfig.social.instagramHandle}
          </a>
          <a
            href={`mailto:${shopConfig.contact.email}`}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bone transition-colors hover:text-acid"
          >
            <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
            {shopConfig.contact.email}
          </a>
        </nav>
      </motion.footer>
    </div>
  );
}
