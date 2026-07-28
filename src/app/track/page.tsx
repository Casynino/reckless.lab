import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { TrackClient } from "@/components/track/track-client";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your Reckless Lab order with your order number and tracking number.",
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; trk?: string }>;
}) {
  const { ref, trk } = await searchParams;

  return (
    <div className="pb-8">
      <PageHero
        code="[ TRACK / YOUR ORDER ]"
        title="Track order"
        tagline="Enter your order number and tracking number to follow your pieces from the lab to your door."
      />
      <TrackClient initialRef={ref ?? ""} initialTrk={trk ?? ""} />
    </div>
  );
}
