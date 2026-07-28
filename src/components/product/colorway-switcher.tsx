import Link from "next/link";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Approximate swatch colour for each washed colorway. */
const SWATCH: Record<string, string> = {
  "Washed Blue": "#5c7d90",
  "Washed Grey": "#8b8b86",
  White: "#ece9e2",
  "Washed Black": "#2a2a2c",
  "Washed Brown": "#8a6f57",
  "Storm Grey": "#6b6e71",
};

function swatchColor(colorway: string): string {
  return SWATCH[colorway] ?? "#8b8b86";
}

/**
 * Colorway swatches for a product. Each links to that colorway's PDP; the
 * active one is ringed. Renders nothing if the design has a single colorway.
 */
export function ColorwaySwitcher({
  colorways,
  currentSlug,
}: {
  colorways: Product[];
  currentSlug: string;
}) {
  if (colorways.length < 2) return null;
  const current = colorways.find((c) => c.slug === currentSlug);

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-mono text-xs uppercase tracking-[0.25em] text-bone">Colour</span>
        <span className="text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash">
          — {current?.colorway}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {colorways.map((c) => {
          const active = c.slug === currentSlug;
          return (
            <Link
              key={c.id}
              href={`/products/${c.slug}`}
              scroll
              aria-label={c.colorway}
              aria-current={active}
              data-cursor={c.colorway}
              title={c.colorway}
              className={cn(
                "relative h-9 w-9 rounded-full border transition-transform hover:scale-110",
                active ? "border-acid" : "border-smoke",
              )}
            >
              <span
                className="absolute inset-1 rounded-full"
                style={{ backgroundColor: swatchColor(c.colorway) }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
