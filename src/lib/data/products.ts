import type { Product, ProductVariant, Size } from "@/lib/types";
import { img } from "@/lib/brand/assets";

/**
 * Real Reckless Lab catalog — the EST 2026 first drop.
 * Two silhouettes, six washed colourways. Every image is an official
 * photoshoot frame served from `public/brand/` via the brand media system.
 */

/** Standard S–XL variant set with per-size stock + SKU. */
function variants(base: string, stock: Partial<Record<Size, number>> = {}): ProductVariant[] {
  const sizes: Size[] = ["S", "M", "L", "XL"];
  return sizes.map((size) => ({ size, stock: stock[size] ?? 12, sku: `${base}-${size}` }));
}

const iExistDetails = [
  "Boxy, dropped-shoulder fit",
  "Arched ‘RECKLESS’ print, front",
  "‘I EXIST’ + EST 2026 print, back",
  "‘555’ detail at the hem",
  "Garment-dyed washed finish",
];
const iExistMaterials = ["100% heavyweight cotton", "260gsm garment-dyed jersey"];
const serpentDetails = [
  "Boxy, dropped-shoulder fit",
  "Stylised R-Serpent chest mark",
  "Oversized R-Serpent back graphic",
  "‘RECKLESS · EST 2026’ lockup",
  "Washed, lived-in hand-feel",
];
const serpentMaterials = ["100% heavyweight cotton", "240gsm pigment-washed jersey"];
const care = ["Cold wash inside out", "Line dry", "Do not tumble", "Warm iron, avoid print"];

export const products: Product[] = [
  // ── "I EXIST" SERIES ──────────────────────────────────────────────
  {
    id: "ie-blu",
    slug: "i-exist-tee-washed-blue",
    name: "‘I Exist’ Tee",
    subtitle: "Washed heavyweight · arched print",
    price: 35,
    gender: "unisex",
    collections: ["i-exist", "new-arrivals", "essentials", "men", "women"],
    colorway: "Washed Blue",
    isNew: true,
    isBestSeller: true,
    order: 1,
    media: [
      { src: img("T-1", 16), alt: "‘I Exist’ tee, washed blue — front RECKLESS print" },
      { src: img("T-1", 14), alt: "‘I Exist’ tee, washed blue — back I EXIST print" },
      { src: img("T-1", 2), alt: "‘I Exist’ tee, washed blue — full look" },
      { src: img("T-1", 12), alt: "‘I Exist’ tee — RECKLESS print detail" },
      { src: img("T-1", 6), alt: "‘I Exist’ tee — 555 hem detail" },
    ],
    variants: variants("IE-BLU", { S: 8, M: 20, L: 16, XL: 7 }),
    story:
      "The piece the lab was named for. We washed a heavyweight blue until it read like it had already lived a life, arched RECKLESS across the chest and left a quiet ‘I EXIST’ on the back. A statement for people who never have to make one.",
    details: iExistDetails,
    materials: iExistMaterials,
    care,
  },
  {
    id: "ie-gry",
    slug: "i-exist-tee-washed-grey",
    name: "‘I Exist’ Tee",
    subtitle: "Washed heavyweight · arched print",
    price: 35,
    gender: "unisex",
    collections: ["i-exist", "new-arrivals", "essentials", "men", "women"],
    colorway: "Washed Grey",
    isNew: true,
    isBestSeller: true,
    order: 2,
    media: [
      { src: img("T-3", 6), alt: "‘I Exist’ tee, washed grey — front RECKLESS print" },
      { src: img("T-3", 13), alt: "‘I Exist’ tee, washed grey — back I EXIST print" },
      { src: img("T-3", 22), alt: "‘I Exist’ tee, washed grey — layered longsleeve styling" },
      { src: img("T-3", 2), alt: "‘I Exist’ tee, washed grey — full look" },
      { src: img("T-3", 28), alt: "‘I Exist’ tee — waistline detail" },
    ],
    variants: variants("IE-GRY", { S: 6, M: 15, L: 15, XL: 6 }),
    story:
      "The same formula in a colder wash. Layer it over a longsleeve or wear it alone — the grey shifts with the light and never asks for attention. Silent confidence, cut boxy.",
    details: iExistDetails,
    materials: iExistMaterials,
    care,
  },

  // ── R-SERPENT SERIES ──────────────────────────────────────────────
  {
    id: "rs-wht",
    slug: "reckless-tee-white",
    name: "‘Reckless’ Tee",
    subtitle: "Graphic heavyweight · front + back",
    price: 35,
    gender: "unisex",
    collections: ["reckless", "new-arrivals", "essentials", "men", "women"],
    colorway: "White",
    isNew: true,
    isBestSeller: true,
    order: 3,
    media: [
      { src: img("T-2", 3), alt: "‘Reckless’ tee, white — back graphic" },
      { src: img("T-2", 13), alt: "‘Reckless’ tee, white — front chest mark" },
      { src: img("T-2", 1), alt: "‘Reckless’ tee, white — full look" },
      { src: img("T-2", 7), alt: "‘Reckless’ tee, white — layered styling" },
      { src: img("T-2", 10), alt: "‘Reckless’ tee, white — back detail" },
    ],
    variants: variants("RS-WHT", { S: 10, M: 18, L: 14, XL: 8 }),
    story:
      "Our mark, printed big. The stylised R and its serpent run the length of the back; a small mark sits on the chest. Clean white so the graphic does all the talking.",
    details: serpentDetails,
    materials: serpentMaterials,
    care,
  },
  {
    id: "rs-blk",
    slug: "reckless-tee-washed-black",
    name: "‘Reckless’ Tee",
    subtitle: "Graphic heavyweight · washed",
    price: 35,
    gender: "unisex",
    collections: ["reckless", "new-arrivals", "essentials", "limited-drops", "men", "women"],
    colorway: "Washed Black",
    isNew: true,
    isLimited: true,
    order: 4,
    media: [
      { src: img("T-4", 2), alt: "‘Reckless’ tee, washed black — front" },
      { src: img("T-4", 13), alt: "‘Reckless’ tee, washed black — print detail" },
      { src: img("T-4", 7), alt: "‘Reckless’ tee, washed black — full look with flannel" },
      { src: img("T-4", 10), alt: "‘Reckless’ tee, washed black — back" },
      { src: img("T-4", 16), alt: "‘Reckless’ tee, washed black — styled" },
    ],
    variants: variants("RS-BLK", { S: 4, M: 8, L: 7, XL: 3 }),
    story:
      "A washed black so deep it drinks the light, with the R-Serpent bled red across the front. A limited wash — when it's gone, it's gone. Styled here with a plaid tied low.",
    details: serpentDetails,
    materials: serpentMaterials,
    care,
  },
  {
    id: "rs-brn",
    slug: "reckless-tee-washed-brown",
    name: "‘Reckless’ Tee",
    subtitle: "Graphic heavyweight · washed",
    price: 35,
    gender: "unisex",
    collections: ["reckless", "new-arrivals", "essentials", "men", "women"],
    colorway: "Washed Brown",
    isNew: true,
    order: 5,
    media: [
      { src: img("T-5", 7), alt: "‘Reckless’ tee, washed brown — front" },
      { src: img("T-5", 5), alt: "‘Reckless’ tee, washed brown — back graphic" },
      { src: img("T-5", 6), alt: "‘Reckless’ tee, washed brown — print detail" },
      { src: img("T-5", 1), alt: "‘Reckless’ tee, washed brown — full look" },
      { src: img("T-5", 9), alt: "‘Reckless’ tee, washed brown — back" },
    ],
    variants: variants("RS-BRN", { S: 7, M: 11, L: 10, XL: 5 }),
    story:
      "An earthy mocha wash that sits somewhere between vintage and new. The serpent reads warm against it — the quietest, most wearable member of the series.",
    details: serpentDetails,
    materials: serpentMaterials,
    care,
  },
  {
    id: "rs-gry",
    slug: "reckless-tee-storm-grey",
    name: "‘Reckless’ Tee",
    subtitle: "Graphic heavyweight · contrast trim",
    price: 35,
    gender: "unisex",
    collections: ["reckless", "new-arrivals", "essentials", "men", "women"],
    colorway: "Storm Grey",
    isNew: true,
    order: 6,
    media: [
      { src: img("T-6", 3), alt: "‘Reckless’ tee, storm grey — front" },
      { src: img("T-6", 2), alt: "‘Reckless’ tee, storm grey — back graphic" },
      { src: img("T-6", 5), alt: "‘Reckless’ tee, storm grey — chest mark detail" },
      { src: img("T-6", 1), alt: "‘Reckless’ tee, storm grey — full look" },
      { src: img("T-6", 7), alt: "‘Reckless’ tee, storm grey — back" },
    ],
    variants: variants("RS-GRY", { S: 9, M: 13, L: 11, XL: 6 }),
    story:
      "Storm grey with contrast stitching at every seam — the most constructed piece in the drop. The trim frames the body and the serpent frames the back.",
    details: [...serpentDetails, "Contrast-stitched trim"],
    materials: serpentMaterials,
    care,
  },
];
