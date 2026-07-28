import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { SmartImage } from "@/components/ui/smart-image";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { Marquee } from "@/components/motion/marquee";
import { ButtonLink } from "@/components/ui/button-link";
import { img } from "@/lib/brand/assets";

export const metadata: Metadata = {
  title: "The Lab",
  description: "The story behind Reckless Lab — an experimental fashion laboratory born in Banjul.",
};

const VALUES = [
  { n: "01", t: "Silent confidence", d: "Nothing loud. The clothing speaks before the person wearing it does." },
  { n: "02", t: "Break the formula", d: "We treat every piece as an experiment. Rules exist to be tested." },
  { n: "03", t: "Made to last", d: "Heavyweight fabrics, considered construction, no throwaway trends." },
  { n: "04", t: "Hard to impress", d: "Built for people who don't follow — they're followed." },
];

export default function AboutPage() {
  return (
    <div className="pb-24">
      <PageHero
        code="[ BEHIND THE LAB ]"
        title="Reckless Lab"
        tagline="An experimental fashion laboratory born from two teenagers who chose to move differently."
      />

      {/* Full-bleed image */}
      <section className="container-edge">
        <div className="relative aspect-[16/9] overflow-hidden bg-carbon">
          <Parallax speed={0.15} className="absolute inset-0 scale-110">
            <SmartImage src={img("T-Mix", 3)} alt="Reckless Lab campaign" fill sizes="100vw" className="object-cover" style={{ objectPosition: "50% 40%" }} />
          </Parallax>
        </div>
      </section>

      {/* Story */}
      <section className="container-edge py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <span className="eyebrow lg:pt-3">[ THE ORIGIN ]</span>
          <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-fog">
            <SplitText
              as="p"
              text="They had the world in their hands."
              className="font-display text-3xl text-bone md:text-5xl"
            />
            <Reveal>
              <p>
                Reckless Lab was born from two teenagers who had opportunities, influence, and the ability to
                inspire people around them. Instead of following the obvious path, they chose to move differently.
                They embraced uncertainty. They took risks. They created something authentic.
              </p>
              <p>
                That decision became Reckless Lab — a brand for people who are hard to impress. People who don&apos;t
                follow trends. People who don&apos;t wear clothes because everyone else does. People who naturally stand
                out without trying.
              </p>
              <p className="text-bone-dim">
                This is a laboratory where fashion rules are broken to create something that feels alive.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Marquee
        items={["CALM", "BOLD", "NONCHALANT", "FEARLESS", "MINIMAL", "EXPERIMENTAL", "MYSTERIOUS"]}
        className="border-y border-smoke py-5 font-display text-3xl uppercase text-bone md:text-5xl"
        duration={35}
      />

      {/* Values */}
      <section className="container-edge py-20 md:py-28">
        <span className="eyebrow">[ WHAT WE STAND FOR ]</span>
        <div className="mt-10 grid gap-px overflow-hidden border border-smoke bg-smoke md:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.n} className="bg-ink p-8 md:p-10">
              <span className="text-mono text-xs uppercase tracking-[0.3em] text-acid">{v.n}</span>
              <h3 className="mt-4 font-display text-2xl text-bone md:text-3xl">{v.t}</h3>
              <p className="mt-3 text-fog">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Image duo */}
      <section className="container-edge grid gap-4 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-carbon">
          <SmartImage src={img("T-1", 12)} alt="RECKLESS print detail" fill sizes="50vw" className="object-cover" />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-carbon">
          <SmartImage src={img("T-Mix", 5)} alt="Reckless Lab editorial" fill sizes="50vw" className="object-cover" />
        </div>
      </section>

      {/* CTA */}
      <section className="container-edge py-24 text-center md:py-32">
        <SplitText as="h2" text="Move differently." className="mx-auto font-display display-xl text-bone" />
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/collections/new-arrivals" variant="solid" cursor="enter">
            Enter the Lab
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
