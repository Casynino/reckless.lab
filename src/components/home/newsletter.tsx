"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { SplitText } from "@/components/motion/split-text";
import { subscribeNewsletterAction } from "@/lib/newsletter/actions";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!email.includes("@")) return;
    start(async () => {
      const res = await subscribeNewsletterAction(email);
      if (res?.error) return setErr(res.error);
      setDone(true);
    });
  }

  return (
    <section className="relative overflow-hidden border-y border-smoke bg-ink-soft py-24 md:py-36">
      <div className="container-edge relative z-10 mx-auto max-w-3xl text-center">
        <span className="eyebrow">[ JOIN THE LAB ]</span>
        <SplitText
          as="h2"
          text="Be first through the door."
          className="mt-4 font-display display-lg text-bone"
        />
        <p className="mx-auto mt-6 max-w-md text-fog">
          Early access to drops, private previews, and the occasional experiment that never makes it to the site.
        </p>

        {done ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-mono text-sm uppercase tracking-[0.2em] text-acid"
          >
            ✳ You&apos;re on the list. Watch your inbox.
          </motion.p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-10 flex max-w-md items-center border-b border-bone">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-transparent py-3 text-bone placeholder:text-ash focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending}
              data-cursor="join"
              className="shrink-0 py-3 pl-4 text-mono text-xs font-bold uppercase tracking-[0.25em] text-acid hover:text-bone disabled:opacity-50"
            >
              {pending ? "…" : "Subscribe →"}
            </button>
          </form>
        )}
        {err && <p className="mt-4 text-mono text-xs uppercase tracking-[0.2em] text-acid">{err}</p>}
      </div>

      {/* faint oversized wordmark */}
      <span className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 font-display text-[26vw] leading-none text-carbon/60">
        RECKLESS
      </span>
    </section>
  );
}
