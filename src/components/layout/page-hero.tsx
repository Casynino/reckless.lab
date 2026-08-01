import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { SmartImage } from "@/components/ui/smart-image";

/** Interior page header. Pass `image` for a cinematic full-bleed variant. */
export function PageHero({
  code,
  title,
  tagline,
  align = "left",
  image,
  focus = "50% 40%",
}: {
  code: string;
  title: string;
  tagline?: string;
  align?: "left" | "center";
  image?: string;
  focus?: string;
}) {
  if (image) {
    return (
      <header className="relative flex min-h-[70vh] flex-col justify-end overflow-hidden bg-ink pt-32">
        <Parallax speed={0.2} className="absolute inset-0 -top-[15%] h-[130%]">
          <SmartImage src={image} alt={title} fill priority sizes="100vw" className="object-cover" style={{ objectPosition: focus }} />
        </Parallax>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(10,10,11,0.94)_0%,rgba(10,10,11,0.15)_58%,rgba(10,10,11,0.45)_100%)]" />
        <div className="container-edge relative z-10 w-full pb-14 md:pb-20">
          <span className="eyebrow" style={{ color: "var(--color-onphoto-dim)" }}>{code}</span>
          <SplitText as="h1" text={title} className="mt-4 font-display display-xl text-onphoto" />
          {tagline && (
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-xl text-lg text-onphoto-dim">{tagline}</p>
            </Reveal>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className={`container-edge pt-36 pb-12 md:pt-44 md:pb-16 ${align === "center" ? "text-center" : ""}`}>
      <span className="eyebrow">{code}</span>
      <SplitText as="h1" text={title} className={`mt-4 font-display display-xl text-bone ${align === "center" ? "mx-auto" : ""}`} />
      {tagline && (
        <Reveal delay={0.15}>
          <p className={`mt-5 max-w-xl text-lg text-fog ${align === "center" ? "mx-auto" : ""}`}>{tagline}</p>
        </Reveal>
      )}
    </header>
  );
}
