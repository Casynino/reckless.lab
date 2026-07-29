"use client";

/**
 * Native scrolling. We previously ran Lenis inertial smoothing here, but it
 * hijacked the wheel across the whole document and broke scrolling inside
 * fixed overlays and height-changing pages. Native scroll is reliable
 * everywhere; smooth anchor jumps come from CSS `scroll-behavior: smooth`,
 * and all scroll-driven animations read native scroll via Framer's useScroll.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
