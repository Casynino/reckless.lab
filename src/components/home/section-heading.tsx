import Link from "next/link";
import { SplitText } from "@/components/motion/split-text";
import { cn } from "@/lib/utils";

export function SectionHeading({
  code,
  title,
  link,
  linkLabel = "View all",
  className,
}: {
  code: string;
  title: string;
  link?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div>
        <span className="eyebrow">{code}</span>
        <SplitText as="h2" text={title} className="mt-3 font-display display-lg text-bone" />
      </div>
      {link && (
        <Link
          href={link}
          className="link-underline shrink-0 pb-2 text-mono text-xs uppercase tracking-[0.25em] text-bone-dim hover:text-bone"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
