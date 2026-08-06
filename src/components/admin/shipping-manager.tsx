"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, X } from "lucide-react";
import {
  createShippingRateAction,
  updateShippingRateAction,
  toggleShippingRateAction,
  deleteShippingRateAction,
  seedShippingRatesAction,
} from "@/lib/shop/shipping-actions";
import { formatPrice } from "@/lib/shop/format";

export type ShippingRow = {
  id: string;
  label: string;
  countries: string[];
  courier: string;
  eta: string;
  flatRate: number;
  freeThreshold: number;
  requiresQuote: boolean;
  isDefault: boolean;
  active: boolean;
};

const EMPTY = {
  label: "",
  countries: "",
  courier: "",
  eta: "",
  flatRate: "",
  freeThreshold: "100",
  requiresQuote: false,
  isDefault: false,
};

export function ShippingManager({ rates }: { rates: ShippingRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [f, setF] = useState(EMPTY);

  function reset() {
    setEditingId(null);
    setF(EMPTY);
    setErr("");
  }

  function edit(r: ShippingRow) {
    setEditingId(r.id);
    setErr("");
    setF({
      label: r.label,
      countries: r.countries.join(", "),
      courier: r.courier,
      eta: r.eta,
      flatRate: String(r.flatRate),
      freeThreshold: String(r.freeThreshold),
      requiresQuote: r.requiresQuote,
      isDefault: r.isDefault,
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function save() {
    setErr("");
    const input = {
      label: f.label,
      countries: f.countries,
      courier: f.courier,
      eta: f.eta,
      flatRate: Number(f.flatRate) || 0,
      freeThreshold: Number(f.freeThreshold) || 0,
      requiresQuote: f.requiresQuote,
      isDefault: f.isDefault,
    };
    start(async () => {
      const res = editingId
        ? await updateShippingRateAction(editingId, input)
        : await createShippingRateAction(input);
      if (res?.error) return setErr(res.error);
      reset();
      router.refresh();
    });
  }

  function seed() {
    start(async () => {
      await seedShippingRatesAction();
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      {/* Create / edit */}
      <div className="rounded-sm border border-smoke bg-ink-soft p-6 lg:sticky lg:top-24 lg:h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-mono text-xs uppercase tracking-[0.2em] text-bone">
            {editingId ? "Edit rate" : "New shipping rate"}
          </h2>
          {editingId && (
            <button onClick={reset} className="flex items-center gap-1 text-mono text-[0.55rem] uppercase tracking-[0.15em] text-ash hover:text-bone">
              <X className="h-3 w-3" /> Cancel
            </button>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Region / market name">
            <input value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} placeholder="United States" className={input} />
          </Field>
          <Field label="Countries (ISO codes, comma-separated)">
            <input value={f.countries} onChange={(e) => setF({ ...f, countries: e.target.value.toUpperCase() })} placeholder="US, CA" className={input} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Courier / method">
              <input value={f.courier} onChange={(e) => setF({ ...f, courier: e.target.value })} placeholder="DHL Express" className={input} />
            </Field>
            <Field label="Estimated delivery">
              <input value={f.eta} onChange={(e) => setF({ ...f, eta: e.target.value })} placeholder="1–3 Business Days" className={input} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Shipping fee ($)">
              <input
                type="number"
                disabled={f.requiresQuote}
                value={f.flatRate}
                onChange={(e) => setF({ ...f, flatRate: e.target.value })}
                placeholder="15"
                className={`${input} disabled:opacity-40`}
              />
            </Field>
            <Field label="Free over ($) — 0 = always free">
              <input
                type="number"
                disabled={f.requiresQuote}
                value={f.freeThreshold}
                onChange={(e) => setF({ ...f, freeThreshold: e.target.value })}
                placeholder="100"
                className={`${input} disabled:opacity-40`}
              />
            </Field>
          </div>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-fog">
            <input type="checkbox" checked={f.requiresQuote} onChange={(e) => setF({ ...f, requiresQuote: e.target.checked })} className="mt-1 accent-acid" />
            <span>Quote after checkout — fee shown as “To be confirmed” (use for Rest of World)</span>
          </label>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-fog">
            <input type="checkbox" checked={f.isDefault} onChange={(e) => setF({ ...f, isDefault: e.target.checked })} className="mt-1 accent-acid" />
            <span>Catch-all — applies to any country not listed above</span>
          </label>

          {err && <p className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">{err}</p>}
          <button
            onClick={save}
            disabled={pending || !f.label.trim()}
            className="w-full bg-acid py-3 text-mono text-xs font-bold uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Saving…" : editingId ? "Save changes" : "Add rate"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-sm border border-smoke bg-ink-soft">
        {rates.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-mono text-xs uppercase tracking-[0.15em] text-ash">No rates yet</p>
            <p className="mt-3 text-sm text-fog">Load the standard rate card to get started, then edit any value.</p>
            <button
              onClick={seed}
              disabled={pending}
              className="mt-6 border border-bone px-6 py-2.5 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-bone hover:text-ink disabled:opacity-50"
            >
              {pending ? "Loading…" : "Load default rates"}
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-smoke">
            {rates.map((r) => (
              <li key={r.id} className={`flex items-start justify-between gap-4 p-4 ${editingId === r.id ? "bg-acid/5" : ""}`}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg tracking-tight text-bone">{r.label}</span>
                    {r.isDefault && <Tag>Catch-all</Tag>}
                    {r.requiresQuote && <Tag>Quoted</Tag>}
                    <span className={`rounded-full px-2 py-0.5 text-mono text-[0.5rem] uppercase tracking-[0.15em] ${r.active ? "bg-emerald-500/15 text-emerald-300" : "bg-smoke text-ash"}`}>
                      {r.active ? "Active" : "Off"}
                    </span>
                  </div>
                  <p className="mt-1 text-mono text-[0.6rem] uppercase tracking-[0.12em] text-ash">
                    {r.countries.length ? r.countries.join(", ") : "Any country"} · {r.courier || "—"}
                  </p>
                  <p className="mt-0.5 text-mono text-[0.6rem] uppercase tracking-[0.12em] text-fog">
                    {r.requiresQuote
                      ? "Fee quoted after checkout"
                      : r.freeThreshold === 0
                        ? "Always free"
                        : `${formatPrice(r.flatRate)} · free ≥ ${formatPrice(r.freeThreshold)}`}
                    {r.eta && ` · ${r.eta}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button onClick={() => edit(r)} aria-label="Edit" className="p-1.5 text-ash transition-colors hover:text-bone">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => start(async () => { await toggleShippingRateAction(r.id); router.refresh(); })}
                    className="border border-smoke px-3 py-1.5 text-mono text-[0.55rem] uppercase tracking-[0.15em] text-bone-dim transition-colors hover:border-bone hover:text-bone"
                  >
                    {r.active ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => start(async () => { await deleteShippingRateAction(r.id); if (editingId === r.id) reset(); router.refresh(); })}
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

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-smoke px-2 py-0.5 text-mono text-[0.5rem] uppercase tracking-[0.15em] text-ash">
      {children}
    </span>
  );
}
