import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { ChapterRail } from "@/components/about/chapter-rail";
import { OriginChapter } from "@/components/about/origin-chapter";
import { MindsetChapter } from "@/components/about/mindset-chapter";
import { MovementGallery } from "@/components/about/movement-gallery";
import { LaboratoryChapter } from "@/components/about/laboratory-chapter";
import { ValuesChapter } from "@/components/about/values-chapter";
import { CommunityMoodboard } from "@/components/about/community-moodboard";
import { FutureChapter } from "@/components/about/future-chapter";

export const metadata: Metadata = {
  title: "The Lab",
  description:
    "An immersive story of Reckless Laboratory — the beginning, the mindset, the movement, and the future of an experimental fashion house born in Banjul.",
};

/**
 * "The Lab" — a scroll-driven brand exhibition. Seven chapters, each with its
 * own layout and motion language, told through the real campaign archive.
 */
export default function AboutPage() {
  return (
    <main className="relative bg-ink">
      <ChapterRail />
      <AboutHero />
      <OriginChapter />
      <MindsetChapter />
      <MovementGallery />
      <LaboratoryChapter />
      <ValuesChapter />
      <CommunityMoodboard />
      <FutureChapter />
    </main>
  );
}
