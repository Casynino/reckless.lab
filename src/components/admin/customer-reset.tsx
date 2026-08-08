"use client";

import { useState, useTransition } from "react";
import { KeyRound } from "lucide-react";
import { adminResetPasswordAction } from "@/lib/auth/actions";

/** Admin control: reset a customer's password to a temp one and relay it. */
export function CustomerReset({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  const [temp, setTemp] = useState<string | null>(null);
  const [err, setErr] = useState("");

  function reset() {
    setErr("");
    start(async () => {
      const res = await adminResetPasswordAction(id);
      if (res?.error) return setErr(res.error);
      if ("tempPassword" in res && res.tempPassword) setTemp(res.tempPassword);
    });
  }

  if (temp) {
    const msg = `Hey ${name.split(" ")[0]}, your Reckless Lab password was reset. Temporary password: ${temp}\nLog in at https://recklesslab.shop/login and change it in your account settings.`;
    const wa = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="rounded bg-acid/10 px-2 py-1 text-mono text-[0.7rem] tracking-wide text-acid">{temp}</span>
        <a href={wa} target="_blank" rel="noreferrer" className="text-mono text-[0.5rem] uppercase tracking-[0.1em] text-ash hover:text-bone">
          Send via WhatsApp →
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={reset}
        disabled={pending}
        className="inline-flex items-center gap-1.5 border border-smoke px-2.5 py-1.5 text-mono text-[0.55rem] uppercase tracking-[0.12em] text-bone-dim transition-colors hover:border-bone hover:text-bone disabled:opacity-50"
      >
        <KeyRound className="h-3 w-3" /> {pending ? "…" : "Reset PW"}
      </button>
      {err && <span className="mt-1 text-mono text-[0.5rem] uppercase text-acid">{err}</span>}
    </div>
  );
}
