import { SmartImage } from "@/components/ui/smart-image";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ButtonLink } from "@/components/ui/button-link";
import { BEHIND } from "@/lib/brand/assets";

/** Behind-the-brand origin story with an offset image duo. */
export function BehindBrand() {
  return (
    <section className="container-edge py-24 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <span className="eyebrow">[ BEHIND THE LAB ]</span>
          <SplitText as="h2" text="Two teenagers who moved differently." className="mt-4 max-w-xl font-display display-lg text-bone" />
          <Reveal delay={0.1}>
            <div className="mt-8 max-w-lg space-y-5 text-fog">
              <p>
                Reckless Lab was born from two teenagers who had the world in their hands — opportunities,
                influence, the ability to inspire. Instead of the obvious path, they chose to move differently.
              </p>
              <p>
                They embraced uncertainty. They took risks. They made something authentic. That decision became
                the lab: a place for people who don&apos;t wear clothes because everyone else does.
              </p>
              <p className="text-bone-dim">The clothing speaks before the person wearing it does.</p>
            </div>
            <ButtonLink href="/about" variant="outline" cursor="read" className="mt-10">
              Read the Full Story
            </ButtonLink>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Parallax speed={0.12} className="aspect-[3/4] overflow-hidden bg-carbon">
            <div className="relative h-full w-full scale-110">
              <SmartImage src={BEHIND[0].src} alt={BEHIND[0].alt} fill sizes="30vw" className="object-cover" />
            </div>
          </Parallax>
          <Parallax speed={-0.12} className="mt-10 aspect-[3/4] overflow-hidden bg-carbon">
            <div className="relative h-full w-full scale-110">
              <SmartImage src={BEHIND[1].src} alt={BEHIND[1].alt} fill sizes="30vw" className="object-cover" />
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
