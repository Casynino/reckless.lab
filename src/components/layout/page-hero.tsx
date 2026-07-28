import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";

/** Interior page header — sits under the fixed nav with breathing room. */
export function PageHero({
  code,
  title,
  tagline,
  align = "left",
}: {
  code: string;
  title: string;
  tagline?: string;
  align?: "left" | "center";
}) {
  return (
    <header
      className={`container-edge pt-36 pb-12 md:pt-44 md:pb-16 ${
        align === "center" ? "text-center" : ""
      }`}
    >
      <span className="eyebrow">{code}</span>
      <SplitText
        as="h1"
        text={title}
        className={`mt-4 font-display display-xl text-bone ${align === "center" ? "mx-auto" : ""}`}
      />
      {tagline && (
        <Reveal delay={0.15}>
          <p className={`mt-5 max-w-xl text-lg text-fog ${align === "center" ? "mx-auto" : ""}`}>
            {tagline}
          </p>
        </Reveal>
      )}
    </header>
  );
}
