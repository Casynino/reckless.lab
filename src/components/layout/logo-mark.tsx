import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official Reckless R-serpent mark. Its colours are dark, so it sits on a
 * small paper tile — that way it reads on the dark header, the light theme, or
 * over photography without needing a separate reversed artwork.
 */
export function LogoMark({ size = 30, className }: { size?: number; className?: string }) {
  const h = Math.round(size * 0.66);
  const w = Math.round((h * 207) / 267); // trimmed mark aspect ratio
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-[26%] bg-paper", className)}
      style={{ width: size, height: size }}
    >
      <Image src="/brand/logo/reckless-logo-mark.png" alt="Reckless" width={w} height={h} priority />
    </span>
  );
}
