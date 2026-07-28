import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 text-mono text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 px-8 py-4";

const variants: Record<Variant, string> = {
  solid: "bg-acid text-ink hover:opacity-90",
  outline: "border border-bone text-bone hover:bg-bone hover:text-ink",
  ghost: "text-bone hover:text-acid",
};

export function ButtonLink({
  href,
  children,
  variant = "outline",
  className,
  cursor,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  cursor?: string;
}) {
  return (
    <Link href={href} data-cursor={cursor} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
