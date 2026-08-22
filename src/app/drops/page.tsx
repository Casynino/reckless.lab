import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedDrop } from "@/lib/drops/store";
import { DropExperience } from "@/components/drops/drop-experience";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "The Drop",
  description: "The next Reckless Laboratory drop. Countdown live. Be first through the door.",
};

// Countdown-sensitive + admin-editable — always render fresh.
export const dynamic = "force-dynamic";

export default async function DropsPage() {
  const drop = await getFeaturedDrop();

  if (!drop) {
    return (
      <div className="pb-24">
        <PageHero
          code="[ THE LAB / DROPS ]"
          title="No drop scheduled"
          tagline="Nothing queued right now — the next one won't be announced twice."
        />
        <div className="container-edge">
          <Link
            href="/collections"
            className="inline-block border border-bone px-10 py-4 text-mono text-xs uppercase tracking-[0.25em] text-bone transition-colors hover:bg-bone hover:text-ink"
          >
            Shop current collections
          </Link>
        </div>
      </div>
    );
  }

  return <DropExperience drop={drop} />;
}
