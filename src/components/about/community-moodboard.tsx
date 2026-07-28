"use client";

import { SmartImage } from "@/components/ui/smart-image";
import { Parallax } from "@/components/motion/parallax";
import { SplitText } from "@/components/motion/split-text";
import { ChapterTag } from "./chapter-rail";
import { img } from "@/lib/brand/assets";

function Tile({ src, ratio = "aspect-[3/4]" }: { src: string; ratio?: string }) {
  return (
    <div className={`relative w-full overflow-hidden rounded-sm ${ratio} group`}>
      <SmartImage src={src} alt="Reckless Lab community" fill sizes="30vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
    </div>
  );
}

const COLS = [
  { speed: 0.12, tiles: [{ s: img("T-3", 2), r: "aspect-[3/4]" }, { s: img("T-1", 20), r: "aspect-square" }, { s: img("T-3", 28), r: "aspect-[4/5]" }] },
  { speed: -0.14, tiles: [{ s: img("T-1", 3), r: "aspect-[4/5]" }, { s: img("T-Mix", 6), r: "aspect-[3/4]" }, { s: img("T-3", 6), r: "aspect-square" }] },
  { speed: 0.22, tiles: [{ s: img("T-4", 10), r: "aspect-square" }, { s: img("T-3", 13), r: "aspect-[3/4]" }, { s: img("T-1", 14), r: "aspect-[4/5]" }] },
];

/** Chapter 06 — The Community. A living wall of moments, columns drifting at
 *  different parallax speeds. */
export function CommunityMoodboard() {
  return (
    <section id="community" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="container-edge mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div>
          <ChapterTag index={6} label="The Community" />
          <SplitText as="h2" text="Worn by the ones who move first." className="max-w-3xl font-display display-lg text-bone" />
        </div>
        <p className="max-w-xs text-bone-dim md:text-right">
          Not customers — a movement. Tag <span className="text-acid">@be_reck1ess</span> and become part of the wall.
        </p>
      </div>

      <div className="container-edge grid grid-cols-2 items-start gap-4 md:grid-cols-3 md:gap-6">
        {COLS.map((col, i) => (
          <Parallax key={i} speed={col.speed} className={`flex flex-col gap-4 md:gap-6 ${i === 2 ? "hidden md:flex" : ""}`}>
            {col.tiles.map((t, j) => (
              <Tile key={j} src={t.s} ratio={t.r} />
            ))}
          </Parallax>
        ))}
      </div>
    </section>
  );
}
