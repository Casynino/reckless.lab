"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Star, Pencil, Trash2 } from "lucide-react";
import { saveAddressAction, deleteAddressAction, setDefaultAddressAction } from "@/lib/account/address-actions";
import { shippingCountries } from "@/lib/shop/shipping";
import type { SavedAddress } from "@/lib/account/addresses";

const EMPTY = { fullName: "", phone: "", line1: "", line2: "", city: "", region: "", postalCode: "", countryCode: "GM" };

export function AddressBook({ addresses }: { addresses: SavedAddress[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<null | (typeof EMPTY & { id?: string })>(null);
  const [err, setErr] = useState("");

  function save() {
    if (!editing) return;
    setErr("");
    start(async () => {
      const res = await saveAddressAction(editing);
      if (res?.error) return setErr(res.error);
      setEditing(null);
      router.refresh();
    });
  }

  const countryName = (c: string) => shippingCountries.find((x) => x.code === c)?.name ?? c;

  return (
    <div className="space-y-4">
      {/* Existing */}
      {addresses.map((a) => (
        <div key={a.id} className="flex items-start justify-between gap-4 rounded-sm border border-smoke bg-ink-soft p-5">
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <p className="font-medium text-bone">{a.fullName}</p>
              {a.isDefault && (
                <span className="rounded-full bg-acid/15 px-2 py-0.5 text-mono text-[0.5rem] uppercase tracking-[0.15em] text-acid">Default</span>
              )}
            </div>
            <p className="mt-1 text-fog">{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
            <p className="text-fog">{[a.city, a.region, a.postalCode].filter(Boolean).join(", ")}</p>
            <p className="text-fog">{countryName(a.countryCode)} · {a.phone}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2 text-mono text-[0.55rem] uppercase tracking-[0.15em]">
            {!a.isDefault && (
              <button onClick={() => start(async () => { await setDefaultAddressAction(a.id); router.refresh(); })} className="flex items-center gap-1 text-ash hover:text-acid">
                <Star className="h-3 w-3" /> Default
              </button>
            )}
            <button onClick={() => setEditing({ ...EMPTY, ...a, line2: a.line2 ?? "", region: a.region ?? "", postalCode: a.postalCode ?? "", id: a.id })} className="flex items-center gap-1 text-ash hover:text-bone">
              <Pencil className="h-3 w-3" /> Edit
            </button>
            <button onClick={() => start(async () => { await deleteAddressAction(a.id); router.refresh(); })} className="flex items-center gap-1 text-ash hover:text-acid">
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        </div>
      ))}

      {/* Add / Edit form */}
      {editing ? (
        <div className="rounded-sm border border-smoke bg-ink-soft p-5">
          <p className="mb-4 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-acid">{editing.id ? "Edit address" : "New address"}</p>
          <div className="grid grid-cols-2 gap-3">
            <In wide v={editing.fullName} set={(v) => setEditing({ ...editing, fullName: v })} ph="Full name" />
            <In wide v={editing.phone} set={(v) => setEditing({ ...editing, phone: v })} ph="Phone (WhatsApp)" />
            <In wide v={editing.line1} set={(v) => setEditing({ ...editing, line1: v })} ph="Address" />
            <In wide v={editing.line2} set={(v) => setEditing({ ...editing, line2: v })} ph="Apartment, suite (optional)" />
            <In v={editing.city} set={(v) => setEditing({ ...editing, city: v })} ph="City" />
            <In v={editing.region} set={(v) => setEditing({ ...editing, region: v })} ph="Region / State" />
            <In v={editing.postalCode} set={(v) => setEditing({ ...editing, postalCode: v })} ph="Postal code" />
            <select value={editing.countryCode} onChange={(e) => setEditing({ ...editing, countryCode: e.target.value })} className="col-span-1 border-b border-smoke bg-ink py-2 text-sm text-bone focus:border-bone focus:outline-none">
              {shippingCountries.map((c) => <option key={c.code} value={c.code} className="bg-ink">{c.name}</option>)}
            </select>
          </div>
          {err && <p className="mt-3 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">{err}</p>}
          <div className="mt-4 flex gap-3">
            <button onClick={save} disabled={pending} className="bg-acid px-6 py-2.5 text-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-ink disabled:opacity-50">{pending ? "Saving…" : "Save address"}</button>
            <button onClick={() => { setEditing(null); setErr(""); }} className="px-4 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash hover:text-bone">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setEditing({ ...EMPTY })} className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-smoke py-4 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash transition-colors hover:border-bone hover:text-bone">
          <Plus className="h-4 w-4" /> Add an address
        </button>
      )}
    </div>
  );
}

function In({ v, set, ph, wide }: { v: string; set: (v: string) => void; ph: string; wide?: boolean }) {
  return (
    <input
      value={v}
      onChange={(e) => set(e.target.value)}
      placeholder={ph}
      className={`${wide ? "col-span-2" : "col-span-1"} border-b border-smoke bg-transparent py-2 text-sm text-bone placeholder:text-ash/60 focus:border-bone focus:outline-none`}
    />
  );
}
