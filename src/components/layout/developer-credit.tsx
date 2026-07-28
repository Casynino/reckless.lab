"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/layout/logo-mark";

const STACK: { group: string; items: string }[] = [
  { group: "Framework", items: "Next.js 16 · React 19" },
  { group: "Language", items: "TypeScript" },
  { group: "Styling", items: "Tailwind CSS · Design tokens" },
  { group: "Motion", items: "Framer Motion · Lenis" },
  { group: "Database", items: "Prisma · PostgreSQL (Neon)" },
  { group: "Auth", items: "JWT (jose) · scrypt" },
  { group: "Media", items: "Vercel Blob · sharp" },
  { group: "Infrastructure", items: "Vercel · Git CI/CD" },
];

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
        Developed by
        <span className="inline-flex items-center gap-1 text-acid transition-colors group-hover:text-bone">
          click here
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] overflow-y-auto bg-ink"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          >
            {/* Ambient red glow */}
            <div className="pointer-events-none fixed left-[-8%] top-[-12%] h-[52vh] w-[52vh] rounded-full bg-[radial-gradient(closest-side,rgba(224,52,42,0.16),transparent)]" />

            {/* Top bar */}
            <div className="container-edge sticky top-0 z-10 flex items-center justify-between bg-ink/60 py-6 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <LogoMark size={26} />
                <span className="text-mono text-[0.55rem] uppercase tracking-[0.3em] text-fog">The Build</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-mono text-[0.6rem] uppercase tracking-[0.25em] text-ash transition-colors hover:text-bone"
              >
                Close ✕
              </button>
            </div>

            <div className="container-edge relative mx-auto max-w-5xl pb-28 pt-10 md:pt-20">
              {/* Intro */}
              <motion.p
                className="text-mono text-[0.6rem] uppercase tracking-[0.3em] text-fog"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                Designed &amp; developed by
              </motion.p>

              <div className="mt-4 overflow-hidden">
                <motion.h2
                  className="font-display text-7xl leading-none tracking-tight text-bone md:text-8xl"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  Nino<span className="text-acid">.</span>
                </motion.h2>
              </div>

              <motion.p
                className="mt-5 text-lg text-fog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.7 }}
              >
                Full-stack developer &amp; product designer
              </motion.p>

              {/* Story */}
              <motion.div
                className="mt-12 max-w-2xl space-y-6 text-lg leading-relaxed text-bone-dim md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <p>
                  A self-taught developer and product designer from Moshi, at the foot of Kilimanjaro. I design
                  and engineer premium, cinematic digital products end-to-end — brand, interface, motion, and the
                  systems underneath.
                </p>
                <p className="text-fog">
                  This whole platform — the storefront, the exhibition, the checkout and the admin — was built from
                  a blank page. No templates. Every detail intentional.
                </p>
              </motion.div>

              {/* Tech stack — editorial spec sheet */}
              <div className="mt-16 border-t border-smoke pt-10 md:mt-20">
                <p className="mb-8 text-mono text-[0.6rem] uppercase tracking-[0.3em] text-fog">Built with</p>
                <dl className="divide-y divide-smoke/70">
                  {STACK.map((s, i) => (
                    <motion.div
                      key={s.group}
                      className="flex items-baseline justify-between gap-6 py-4"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03, duration: 0.5 }}
                    >
                      <dt className="text-sm text-fog">{s.group}</dt>
                      <dd className="text-right font-display text-lg tracking-tight text-bone md:text-xl">{s.items}</dd>
                    </motion.div>
                  ))}
                </dl>
              </div>

              {/* Contact */}
              <div className="mt-16 border-t border-smoke pt-10 md:mt-20">
                <p className="mb-8 text-mono text-[0.6rem] uppercase tracking-[0.3em] text-fog">Work with me</p>
                <div className="flex flex-col">
                  <a href="mailto:casmiry21@icloud.com" className="group flex items-center justify-between border-b border-smoke py-5 transition-colors">
                    <span className="text-xl text-bone transition-colors group-hover:text-acid md:text-2xl">casmiry21@icloud.com</span>
                    <span className="text-sm text-ash transition-colors group-hover:text-acid">Email ↗</span>
                  </a>
                  <a href="https://wa.me/255752828082" target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-smoke py-5 transition-colors">
                    <span className="text-xl text-bone transition-colors group-hover:text-acid md:text-2xl">+255 752 828 082</span>
                    <span className="text-sm text-ash transition-colors group-hover:text-acid">Tanzania · WhatsApp ↗</span>
                  </a>
                  <a href="https://wa.me/8615527610603" target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-smoke py-5 transition-colors">
                    <span className="text-xl text-bone transition-colors group-hover:text-acid md:text-2xl">+86 155 2761 0603</span>
                    <span className="text-sm text-ash transition-colors group-hover:text-acid">China · WhatsApp ↗</span>
                  </a>
                </div>
                <p className="mt-8 text-sm text-ash">Available for select projects.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
