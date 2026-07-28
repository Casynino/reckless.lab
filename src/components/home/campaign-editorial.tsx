"use client";

import Link from "next/link";
import { SmartImage } from "@/components/ui/smart-image";
import { Parallax } from "@/components/motion/parallax";
import { motion } from "framer-motion";

/** Fullscreen campaign scene — huge overlaid statement + parallax image. */
export function CampaignEditorial({
  image,
  alt,
  kicker,
  statement,
  href,
  focus = "50% 50%",
}: {
  image: string;
  alt: string;
  kicker: string;
  statement: string;
  href: string;
  focus?: string;
}) {
  return (
    <section className="relative h-[110svh] min-h-[600px] overflow-hidden">
      <Parallax speed={0.25} className="absolute inset-0 h-[130%] -top-[15%]">
        <SmartImage
          src={image}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: focus }}
          priority={false}
        />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/50 to-[#0a0a0b]/40" />

      <div className="container-edge relative z-10 flex h-full flex-col justify-end pb-20 md:pb-28">
        <span className="eyebrow mb-4" style={{ color: "var(--color-onphoto-dim)" }}>{kicker}</span>
        <div className="overflow-hidden">
          <motion.h2
            className="max-w-4xl font-display display-xl text-onphoto"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {statement}
          </motion.h2>
        </div>
        <Link
          href={href}
          data-cursor="shop"
          className="mt-10 w-fit bg-acid px-10 py-4 text-mono text-xs font-bold uppercase tracking-[0.25em] text-ink transition-transform hover:scale-[1.02]"
        >
          Shop the Campaign
        </Link>
      </div>
    </section>
  );
}
