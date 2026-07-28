"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/layout/logo-mark";
import { Marquee } from "@/components/motion/marquee";

const STACK: { group: string; items: string[] }[] = [
  { group: "Framework", items: ["Next.js 16", "React 19", "App Router · RSC"] },
  { group: "Language", items: ["TypeScript"] },
  { group: "Styling", items: ["Tailwind CSS v4", "Design tokens", "Light / dark"] },
  { group: "Motion", items: ["Framer Motion", "Lenis smooth-scroll"] },
  { group: "Data", items: ["Prisma ORM", "PostgreSQL · Neon"] },
  { group: "Auth", items: ["JWT · jose", "scrypt hashing"] },
  { group: "Media", items: ["Vercel Blob", "sharp pipeline"] },
  { group: "Infra", items: ["Vercel", "Git · CI/CD"] },
];

const NAME = "NINO".split("");

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
        className="group inline-flex items-center gap-2 text-mono text-[0.65rem] uppercase tracking-[0.25em] text-ash transition-colors hover:text-bone"
      >
        Developed by
        <span className="inline-flex items-center gap-1 text-acid transition-colors group-hover:text-bone">
          Nino
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
            {/* Ambient red glows */}
            <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[50vh] w-[50vh] rounded-full bg-[radial-gradient(closest-side,rgba(224,52,42,0.22),transparent)]" />
            <div className="pointer-events-none fixed bottom-[-15%] right-[-8%] h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(closest-side,rgba(224,52,42,0.14),transparent)]" />

            {/* Top bar */}
            <div className="container-edge sticky top-0 z-10 flex items-center justify-between bg-ink/70 py-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <LogoMark size={30} />
                <span className="text-mono text-[0.6rem] uppercase tracking-[0.3em] text-acid">The Build</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-mono text-[0.65rem] uppercase tracking-[0.25em] text-ash transition-colors hover:text-bone"
              >
                Close ✕
              </button>
            </div>

            <div className="container-edge relative pb-24 pt-6">
              {/* Hero */}
              <motion.span
                className="eyebrow block text-fog"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                Designed &amp; developed by
              </motion.span>

              <h2 className="mt-4 flex overflow-hidden font-display text-[22vw] leading-[0.85] tracking-tight text-bone md:text-[16vw] lg:text-[13rem]">
                {NAME.map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ delay: 0.55 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    {ch}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="text-acid"
                >
                  .
                </motion.span>
              </h2>

              <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  <p className="text-mono text-[0.7rem] uppercase tracking-[0.25em] text-acid">
                    Full-stack Developer · Product Designer
                  </p>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone-dim md:text-xl">
                    Self-taught developer and product designer from <span className="text-bone">Moshi</span>, raised
                    at the foot of <span className="text-bone">Kilimanjaro</span> — now moving between Tanzania and
                    China. I design and engineer premium, cinematic digital products end-to-end: brand, interface,
                    motion, and the systems underneath.
                  </p>
                  <p className="mt-5 max-w-xl leading-relaxed text-fog">
                    This entire platform — the storefront, the exhibition, the checkout, and the admin operating
                    system — was designed and built from a blank page. No templates. Every detail intentional.
                  </p>
                </motion.div>

                {/* Contacts */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.05, duration: 0.8 }}
                  className="flex flex-col justify-center gap-1 lg:border-l lg:border-smoke lg:pl-12"
                >
                  <span className="mb-4 text-mono text-[0.6rem] uppercase tracking-[0.3em] text-ash">Work with me</span>
                  <a href="mailto:casmiry21@icloud.com" className="group flex items-center justify-between border-b border-smoke py-4 text-bone transition-colors hover:text-acid">
                    <span className="text-lg">casmiry21@icloud.com</span>
                    <span className="text-mono text-xs text-ash group-hover:text-acid">Email ↗</span>
                  </a>
                  <a href="https://wa.me/255752828082" target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-smoke py-4 text-bone transition-colors hover:text-acid">
                    <span className="text-lg">+255 752 828 082</span>
                    <span className="text-mono text-xs text-ash group-hover:text-acid">🇹🇿 WhatsApp ↗</span>
                  </a>
                  <a href="https://wa.me/8615527610603" target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-smoke py-4 text-bone transition-colors hover:text-acid">
                    <span className="text-lg">+86 155 2761 0603</span>
                    <span className="text-mono text-xs text-ash group-hover:text-acid">🇨🇳 WhatsApp ↗</span>
                  </a>
                </motion.div>
              </div>

              {/* Tech stack flex */}
              <div className="mt-20 border-t border-smoke pt-10">
                <div className="flex items-baseline gap-4">
                  <span className="text-mono text-sm text-acid">▚</span>
                  <span className="text-mono text-[0.65rem] uppercase tracking-[0.3em] text-fog">Built with — the stack</span>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4">
                  {STACK.map((s, i) => (
                    <motion.div
                      key={s.group}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04, duration: 0.5 }}
                    >
                      <p className="text-mono text-[0.55rem] uppercase tracking-[0.25em] text-ash">{s.group}</p>
                      <ul className="mt-3 space-y-1.5">
                        {s.items.map((it) => (
                          <li key={it} className="font-display text-lg uppercase tracking-tight text-bone md:text-xl">{it}</li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Signature marquee */}
            <Marquee
              items={["DESIGN", "CODE", "CULTURE", "KILIMANJARO", "MOSHI → WORLDWIDE", "AVAILABLE FOR SELECT PROJECTS"]}
              duration={32}
              className="border-y border-smoke py-4 font-display text-3xl uppercase text-transparent [-webkit-text-stroke:1px_var(--color-bone-dim)] md:text-5xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
