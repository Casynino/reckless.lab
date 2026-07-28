"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  /** seconds per loop */
  duration?: number;
  separator?: string;
  reverse?: boolean;
}

/** Infinite horizontal ticker. Duplicated track for a seamless -50% loop. */
export function Marquee({ items, className, duration = 40, separator = "✳", reverse }: MarqueeProps) {
  const track = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span>{item}</span>
          <span className="text-acid/80" aria-hidden>
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("flex overflow-hidden", className)}>
      <div
        className="flex animate-marquee"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {track}
        {track}
      </div>
    </div>
  );
}
