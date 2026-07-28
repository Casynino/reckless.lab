"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * next/image with a graceful, on-brand fallback. If a (placeholder) remote
 * image ever fails to load, we render a subtle carbon gradient instead of a
 * broken-image icon — so the layout always looks intentional.
 */
export function SmartImage({ className, alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-label={alt}
        role="img"
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-carbon",
          className,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_30%_20%,#2a2a2e_0%,#121214_60%,#0a0a0b_100%)]" />
        <span className="text-mono relative z-10 text-[0.6rem] uppercase tracking-[0.3em] text-ash">
          Reckless Lab
        </span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
