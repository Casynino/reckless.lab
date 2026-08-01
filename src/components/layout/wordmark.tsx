import { cn } from "@/lib/utils";

/**
 * The Reckless Laboratory wordmark lockup. "RECKLESS" leads in bone,
 * "LABORATORY" trails lighter — reads as a refined two-part mark and keeps the
 * long name legible at small sizes.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display uppercase leading-none tracking-tight", className)}>
      Reckless<span className="ml-[0.28em] hidden font-normal text-fog xs:inline">Laboratory</span>
    </span>
  );
}
