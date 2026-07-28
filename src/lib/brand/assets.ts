/**
 * BRAND MEDIA SYSTEM
 * ------------------
 * Single source of truth for every real Reckless Lab image on the site.
 * All 117 official photos live in `public/brand/<SET>/`. The UI references
 * images only through the semantic groups below — never by raw path — so the
 * team (or a future CMS/admin) can re-curate campaigns by editing this one file
 * without touching a single component.
 *
 * Photo sets (from the official photoshoot):
 *   T-1  — "I EXIST" tee · Washed Blue
 *   T-3  — "I EXIST" tee · Washed Grey (+ layered longsleeve styling)
 *   T-2  — R-Serpent graphic tee · White
 *   T-4  — R-Serpent graphic tee · Washed Black
 *   T-5  — R-Serpent graphic tee · Washed Brown
 *   T-6  — R-Serpent graphic tee · Washed Grey (contrast trim)
 *   T-Mix— Editorial / creative-direction / flat-lays (campaign moments)
 */

/** Build a public path for a shot: img("T-1", 3) -> /brand/T-1/t-1-03.jpg */
export function img(set: string, n: number): string {
  const s = set.toLowerCase();
  const nn = String(n).padStart(2, "0");
  return `/brand/${set}/${s}-${nn}.jpg`;
}

/** Landscape editorial plates (from T-Mix): 3 and 6 are wide. */
export const HERO_CANDIDATES = [
  { src: img("T-Mix", 2), alt: "Reckless Lab — reclining editorial", focus: "50% 40%" },
  { src: img("T-1", 3), alt: "Reckless Lab — I EXIST, arm raised", focus: "50% 30%" },
  { src: img("T-4", 3), alt: "Reckless Lab — washed black R-Serpent tee", focus: "50% 25%" },
];

/** The chosen homepage hero. */
export const HERO = { src: img("T-Mix", 5), alt: "Reckless Lab campaign — draped tee", focus: "55% 35%" };

/** Second campaign scene mid-page (full-bleed statement). */
export const CAMPAIGN = { src: img("T-Mix", 2), alt: "Reckless Lab campaign editorial", focus: "50% 45%" };

/** Behind-the-brand duo. */
export const BEHIND = [
  { src: img("T-Mix", 7), alt: "Draped tee — creative direction" },
  { src: img("T-4", 8), alt: "Studio detail — R-Serpent" },
];

/** Instagram / feed wall — a mix of lifestyle + editorial. */
export const FEED = [
  img("T-Mix", 3),
  img("T-1", 20),
  img("T-2", 7),
  img("T-Mix", 6),
  img("T-5", 4),
  img("T-Mix", 4),
];

/** Interactive "index" gallery rows on the homepage. */
export const INDEX_ROWS = [
  { label: "The ‘I Exist’ Series", meta: "SET//01", href: "/collections/i-exist", image: img("T-1", 14) },
  { label: "The ‘Identity’ Series", meta: "SET//02", href: "/collections/identity", image: img("T-2", 3) },
  { label: "The Reckless Series", meta: "SET//03", href: "/collections/reckless", image: img("T-4", 1) },
  { label: "Essentials", meta: "SET//04", href: "/collections/essentials", image: img("T-6", 3) },
];
