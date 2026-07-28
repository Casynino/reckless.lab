"use client";

import React from "react";
import { PoemAnimation } from "@/components/ui/3d-animation";

// --- Data Configuration ---
const ANIMATION_DATA = {
  poemHTML: `
        <p>The <span>love</span> between Ayla and Leo ignited in the old courtyard, each morning their swords clashed under dawn’s glow, faces streaked with <span>dust</span> and sweat; they <span>danced</span> between parries, every laugh a spark of joy against uncertain hearts. She stepped forward with <span>courage</span>, he met her gaze with open warmth, two souls seeking a shared <span>triumph</span> in their vulnerability. When blades slipped and one <span>faltered</span>, the other caught them—forearms brushing, pulses aligned in a daring heartbeat. In failure they found grace; in triumph they discovered unity. Each moment spent <span>daring</span> to trust the other built a bond impervious to fear. At dusk, they sheathed their swords, stepping from the <span>arena</span> hand in hand, knowing love blooms not through perfection, but by <span>daring greatly</span> together.</p>
`,
  backgroundImageUrl: "https://i.ibb.co/q3XSxR9W/20250831-120144.jpg",
  boyImageUrl: "https://i.ibb.co/Y4FKvK38/20250831-113022.png",
};

/**
 * Demo composition for the provided 3D poem animation.
 * (Kept per integration instructions — not used on the storefront pages.)
 */
export default function PoemAnimationDemo() {
  return (
    <PoemAnimation
      poemHTML={ANIMATION_DATA.poemHTML}
      backgroundImageUrl={ANIMATION_DATA.backgroundImageUrl}
      boyImageUrl={ANIMATION_DATA.boyImageUrl}
    />
  );
}
