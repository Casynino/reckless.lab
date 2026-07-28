"use client";

import { animate } from "framer-motion";
import { useEffect, useState } from "react";

/** Animated number that counts up from 0 on mount. */
export function CountUp({
  value,
  format,
  duration = 1.2,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, duration]);

  const n = Math.round(display);
  return <>{format ? format(n) : n.toLocaleString()}</>;
}
