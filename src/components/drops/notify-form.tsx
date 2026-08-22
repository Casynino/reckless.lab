"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Bell, Check } from "lucide-react";
import { notifyDropAction } from "@/lib/drops/actions";

/** "Notify me" capture for a drop. */
export function NotifyForm({ dropId }: { dropId: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!email.includes("@")) return;
    start(async () => {
      const res = await notifyDropAction(dropId, email);
      if (res?.error) return setErr(res.error);
      setDone(true);
    });
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2.5 rounded-full border border-acid/40 bg-acid/10 px-5 py-3"
      >
        <Check className="h-4 w-4 text-acid" />
        <span className="text-mono text-[0.65rem] uppercase tracking-[0.15em] text-acid">
          You&rsquo;re on the list — we&rsquo;ll alert you the second it drops.
        </span>
      </motion.div>
    );
  }

  return (
    <div>
      <form onSubmit={submit} className="flex max-w-md items-center border-b border-bone">
        <Bell className="mr-3 h-4 w-4 shrink-0 text-acid" />
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
          className="shrink-0 py-3 pl-4 text-mono text-xs font-bold uppercase tracking-[0.2em] text-acid transition-colors hover:text-bone disabled:opacity-50"
        >
          {pending ? "…" : "Notify me →"}
        </button>
      </form>
      {err && <p className="mt-2 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">{err}</p>}
    </div>
  );
}
