"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function greeting(h: number): string {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Still up";
}

/** Welcoming dashboard banner — animated ember gradient, live date + greeting. */
export function DashboardHero({ name }: { name: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const first = name.split(" ")[0];
  const hello = now ? greeting(now.getHours()) : "Welcome";
  const dateLabel = now
    ? now.toLocaleDateString("en-GB", { weekday: "long", month: "long", day: "numeric" })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="admin-hero-gradient relative overflow-hidden rounded-2xl p-8 md:p-10"
    >
      {/* texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.35) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-ink/10" />

      <div className="relative z-10" style={{ color: "var(--color-onphoto)" }}>
        <div className="flex items-center gap-3 text-mono text-[0.65rem] uppercase tracking-[0.25em] opacity-85">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          <span>{dateLabel}</span>
          <span className="rounded-full bg-black/25 px-2 py-0.5">Admin</span>
        </div>

        <h1 className="mt-4 font-display text-4xl md:text-5xl">
          {hello}, {first}. <span className="inline-block">👋</span>
        </h1>
        <p className="mt-2 opacity-85">Here&rsquo;s what&rsquo;s moving in the lab today.</p>
      </div>
    </motion.div>
  );
}
