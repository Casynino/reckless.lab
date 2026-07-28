"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createCouponAction, toggleCouponAction, deleteCouponAction } from "@/lib/promo/actions";
import { formatPrice } from "@/lib/shop/format";

export type CouponRow = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED" | "FREE_SHIPPING";
  value: number;
  description: string | null;
  minSubtotal: number;
  firstOrderOnly: boolean;
  active: boolean;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string | null;
};

const TYPE_LABEL: Record<CouponRow["type"], string> = {
  PERCENT: "% off",
  FIXED: "$ off",
  FREE_SHIPPING: "Free shipping",
};

export function PromotionsManager({ coupons }: { coupons: CouponRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  const [f, setF] = useState({
    code: "",
    type: "PERCENT" as CouponRow["type"],
    value: "",
    minSubtotal: "",
    firstOrderOnly: false,
    usageLimit: "",
    expiresAt: "",
  });

  function reset() {
    setF({ code: "", type: "PERCENT", value: "", minSubtotal: "", firstOrderOnly: false, usageLimit: "", expiresAt: "" });
  }

  function create() {
    setErr("");
    start(async () => {
      const res = await createCouponAction({
        code: f.code,
        type: f.type,
        value: Number(f.value) || 0,
        minSubtotal: Number(f.minSubtotal) || 0,
        firstOrderOnly: f.firstOrderOnly,
        usageLimit: f.usageLimit ? Number(f.usageLimit) : null,
        expiresAt: f.expiresAt || null,
      });
      if (res?.error) return setErr(res.error);
      reset();
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Create */}
      <div className="rounded-sm border border-smoke bg-ink-soft p-6">
        <h2 className="text-mono text-xs uppercase tracking-[0.2em] text-bone">New promotion</h2>
        <div className="mt-5 space-y-4">
          <Field label="Code">
            <input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" className={input} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as CouponRow["type"] })} className={input}>
                <option value="PERCENT">Percentage off</option>
                <option value="FIXED">Fixed amount off</option>
                <option value="FREE_SHIPPING">Free shipping</option>
              </select>
            </Field>
            <Field label={f.type === "PERCENT" ? "Percent (%)" : f.type === "FIXED" ? "Amount ($)" : "—"}>
              <input
                type="number"
                disabled={f.type === "FREE_SHIPPING"}
                value={f.value}
                onChange={(e) => setF({ ...f, value: e.target.value })}
                placeholder={f.type === "PERCENT" ? "10" : "5"}
                className={`${input} disabled:opacity-40`}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Min. spend ($)">
              <input type="number" value={f.minSubtotal} onChange={(e) => setF({ ...f, minSubtotal: e.target.value })} placeholder="0" className={input} />
            </Field>
            <Field label="Usage limit">
              <input type="number" value={f.usageLimit} onChange={(e) => setF({ ...f, usageLimit: e.target.value })} placeholder="∞" className={input} />
            </Field>
          </div>
          <Field label="Expires">
            <input type="date" value={f.expiresAt} onChange={(e) => setF({ ...f, expiresAt: e.target.value })} className={input} />
          </Field>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-fog">
            <input type="checkbox" checked={f.firstOrderOnly} onChange={(e) => setF({ ...f, firstOrderOnly: e.target.checked })} className="accent-acid" />
            First order only
          </label>
          {err && <p className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">{err}</p>}
          <button
            onClick={create}
            disabled={pending || !f.code.trim()}
            className="w-full bg-acid py-3 text-mono text-xs font-bold uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Create promotion"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-sm border border-smoke bg-ink-soft">
        {coupons.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-mono text-xs uppercase tracking-[0.15em] text-ash">No promotions yet</p>
            <p className="mt-3 text-sm text-fog">Create your first code to start running offers.</p>
          </div>
        ) : (
          <ul className="divide-y divide-smoke">
            {coupons.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg tracking-tight text-bone">{c.code}</span>
                    <span className={`rounded-full px-2 py-0.5 text-mono text-[0.5rem] uppercase tracking-[0.15em] ${c.active ? "bg-emerald-500/15 text-emerald-300" : "bg-smoke text-ash"}`}>
                      {c.active ? "Active" : "Off"}
                    </span>
                  </div>
                  <p className="mt-1 text-mono text-[0.6rem] uppercase tracking-[0.12em] text-ash">
                    {c.type === "PERCENT" ? `${c.value}% off` : c.type === "FIXED" ? `${formatPrice(c.value)} off` : "Free shipping"}
                    {c.minSubtotal > 0 && ` · min ${formatPrice(c.minSubtotal)}`}
                    {c.firstOrderOnly && " · 1st order"}
                    {` · used ${c.usedCount}${c.usageLimit != null ? `/${c.usageLimit}` : ""}`}
                    {c.expiresAt && ` · exp ${new Date(c.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => start(async () => { await toggleCouponAction(c.id); router.refresh(); })}
                    className="border border-smoke px-3 py-1.5 text-mono text-[0.55rem] uppercase tracking-[0.15em] text-bone-dim transition-colors hover:border-bone hover:text-bone"
                  >
                    {c.active ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => start(async () => { await deleteCouponAction(c.id); router.refresh(); })}
                    aria-label="Delete"
                    className="p-1.5 text-ash transition-colors hover:text-acid"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const input =
  "w-full border-b border-smoke bg-transparent py-2 text-sm text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-mono text-[0.55rem] uppercase tracking-[0.2em] text-ash">{label}</label>
      {children}
    </div>
  );
}
