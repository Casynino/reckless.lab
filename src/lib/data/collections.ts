import type { Collection } from "@/lib/types";
import { img } from "@/lib/brand/assets";

/**
 * Real Reckless Lab collections. Covers pull from the official photoshoot via
 * the brand media system (`lib/brand/assets.ts`).
 */
export const collections: Collection[] = [
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    tagline: "The first drop. EST 2026.",
    description:
      "The pieces that opened the lab. Washed heavyweight tees, arched prints, and one serpent that started it all.",
    code: "LAB//NEW",
    cover: { src: img("T-1", 16), alt: "Reckless Lab new arrivals — washed blue tee" },
  },
  {
    slug: "i-exist",
    title: "The ‘I Exist’ Series",
    tagline: "Say it without saying it.",
    description:
      "The ‘I Exist’ Tee — washed heavyweight, an arched RECKLESS front and a quiet ‘I EXIST’ across the back. A statement for people who never have to make one.",
    code: "SET//01",
    cover: { src: img("T-1", 14), alt: "‘I Exist’ tee, washed blue, back print" },
  },
  {
    slug: "reckless",
    title: "The Reckless Series",
    tagline: "The mark of the lab.",
    description:
      "The ‘Reckless’ Tee — our stylised R and its serpent, printed big on the back and small on the chest. Four washed colourways of the same idea.",
    code: "SET//02",
    cover: { src: img("T-2", 3), alt: "‘Reckless’ tee, white, back print" },
  },
  {
    slug: "essentials",
    title: "Essentials",
    tagline: "The foundation formula.",
    description: "The core weights we return to. Washed, heavyweight, endlessly wearable.",
    code: "LAB//03",
    cover: { src: img("T-5", 7), alt: "Washed brown essential tee" },
  },
  {
    slug: "limited-drops",
    title: "Limited Drops",
    tagline: "Here, then gone.",
    description: "Numbered runs and one-off washes. When the counter hits zero the formula is retired.",
    code: "LAB//00",
    cover: { src: img("T-4", 2), alt: "Washed black ‘Reckless’ tee" },
  },
  {
    slug: "men",
    title: "Men",
    tagline: "Silent confidence, cut boxy.",
    description: "The full range, cut heavyweight and worn oversized.",
    code: "LAB//M",
    cover: { src: img("T-3", 6), alt: "Washed grey tee, menswear" },
  },
  {
    slug: "women",
    title: "Women",
    tagline: "Understated. Undeniable.",
    description: "Every piece is unisex — cut boxy, styled your way. Size down for a cropped fit.",
    code: "LAB//W",
    cover: { src: img("T-2", 13), alt: "White ‘Reckless’ tee, styled" },
  },
  {
    slug: "future",
    title: "Future Collections",
    tagline: "Not yet, but soon.",
    description: "A window into what the lab is testing next. Join the list and you'll know first.",
    code: "LAB//∞",
    cover: { src: img("T-Mix", 6), alt: "Reckless Lab creative direction" },
  },
];
