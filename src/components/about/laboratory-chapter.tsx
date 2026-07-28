"use client";

import { SmartImage } from "@/components/ui/smart-image";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ChapterTag } from "./chapter-rail";
import { img } from "@/lib/brand/assets";

function Plate({ src, alt, className, sizes = "40vw" }: { src: string; alt: string; className?: string; sizes?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-sm ${className}`}>
      <SmartImage src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

/** Chapter 04 — The Laboratory. Asymmetric, overlapping plates drifting at
 *  different parallax speeds for depth; process, detail, and texture. */
export function LaboratoryChapter() {
  return (
    <section id="laboratory" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="container-edge">
        <ChapterTag index={4} label="The Laboratory" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-end">
          <SplitText as="h2" text="Where the rules break." className="font-display display-xl text-bone" />
          <Reveal className="lg:pb-4">
            <p className="max-w-md text-lg leading-relaxed text-bone-dim">
              Heavyweight cotton, garment-dyed washes, arched prints and one serpent. Every piece is
              tested, torn apart, and rebuilt until it feels alive. Nothing here is throwaway.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Overlapping composition */}
      <div className="container-edge relative mt-16 grid grid-cols-12 gap-4 md:mt-24 md:gap-6">
        <Parallax speed={0.14} className="col-span-7 md:col-span-5">
          <Plate src={img("T-2", 3)} alt="R-Serpent back graphic" className="aspect-[3/4]" sizes="42vw" />
        </Parallax>

        <div className="col-span-5 flex flex-col gap-4 md:col-span-4 md:gap-6 md:pt-24">
          <Parallax speed={-0.1}>
            <Plate src={img("T-1", 12)} alt="RECKLESS print detail" className="aspect-square" sizes="34vw" />
          </Parallax>
          <Parallax speed={0.2}>
            <Plate src={img("T-6", 5)} alt="Storm grey detail" className="aspect-[4/5]" sizes="34vw" />
          </Parallax>
        </div>

        <Parallax speed={0.28} className="col-span-12 md:col-span-3 md:pt-48">
          <Plate src={img("T-5", 5)} alt="Washed brown texture" className="aspect-[3/4]" sizes="24vw" />
        </Parallax>
      </div>

      {/* Wide texture strip */}
      <Parallax speed={0.08} className="container-edge mt-6 md:mt-10">
        <div className="relative h-[42vh] overflow-hidden rounded-sm">
          <SmartImage src={img("T-4", 13)} alt="Reckless Lab — washed black texture" fill sizes="90vw" className="object-cover" style={{ objectPosition: "50% 45%" }} />
          <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
            <p className="font-display text-4xl uppercase tracking-tight text-onphoto md:text-6xl">Made to last.</p>
          </div>
        </div>
      </Parallax>
    </section>
  );
}
