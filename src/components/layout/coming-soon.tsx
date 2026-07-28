import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";

/** Elegant placeholder for features on the roadmap (accounts, wishlist). */
export function ComingSoon({
  code,
  title,
  blurb,
  roadmap,
}: {
  code: string;
  title: string;
  blurb: string;
  roadmap: string[];
}) {
  return (
    <div className="min-h-[70vh] pb-24">
      <PageHero code={code} title={title} tagline={blurb} />
      <div className="container-edge">
        <Reveal>
          <div className="max-w-xl border border-smoke bg-ink-soft p-8">
            <p className="text-mono text-[0.65rem] uppercase tracking-[0.25em] text-acid">On the roadmap</p>
            <ul className="mt-5 space-y-3">
              {roadmap.map((r) => (
                <li key={r} className="flex items-center gap-3 text-fog">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-acid" />
                  {r}
                </li>
              ))}
            </ul>
            <Link
              href="/collections"
              className="mt-8 inline-flex border border-bone px-8 py-3.5 text-mono text-xs uppercase tracking-[0.25em] text-bone transition-colors hover:bg-bone hover:text-ink"
            >
              Shop in the meantime
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
