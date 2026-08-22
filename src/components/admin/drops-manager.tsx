"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, X, Users } from "lucide-react";
import { createDropAction, updateDropAction, deleteDropAction } from "@/lib/drops/actions";
import { cn } from "@/lib/utils";

export type DropRow = {
  id: string;
  slug: string;
  name: string;
  teaser: string;
  description: string;
  image: string;
  launchAt: string; // ISO
  ctaHref: string;
  published: boolean;
  subscribers: number;
};

type Form = {
  slug: string; name: string; teaser: string; description: string; image: string;
  launchAt: string; ctaHref: string; published: boolean;
};

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}
function defaultLaunch() {
  const d = new Date(Date.now() + 7 * 86400000);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}
function blank(): Form {
  return { slug: "", name: "", teaser: "", description: "", image: "", launchAt: defaultLaunch(), ctaHref: "/collections/new-arrivals", published: true };
}

export function DropsManager({ drops }: { drops: DropRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [f, setF] = useState<Form>(blank());
  const [err, setErr] = useState("");

  function reset() {
    setEditingId(null);
    setF(blank());
    setErr("");
  }
  function edit(d: DropRow) {
    setEditingId(d.id);
    setErr("");
    setF({ slug: d.slug, name: d.name, teaser: d.teaser, description: d.description, image: d.image, launchAt: toLocalInput(d.launchAt), ctaHref: d.ctaHref, published: d.published });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function save() {
    setErr("");
    start(async () => {
      const res = editingId ? await updateDropAction(editingId, f) : await createDropAction(f);
      if (res?.error) return setErr(res.error);
      reset();
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      {/* Form */}
      <div className="rounded-sm border border-smoke bg-ink-soft p-6 lg:sticky lg:top-24 lg:h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-mono text-xs uppercase tracking-[0.2em] text-bone">{editingId ? "Edit drop" : "New drop"}</h2>
          {editingId && (
            <button onClick={reset} className="flex items-center gap-1 text-mono text-[0.55rem] uppercase tracking-[0.15em] text-ash hover:text-bone">
              <X className="h-3 w-3" /> Cancel
            </button>
          )}
        </div>
        <div className="mt-5 space-y-4">
          <Field label="Drop name"><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="The ‘Reckless’ Series" className={input} /></Field>
          <Field label="URL slug"><input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value.toLowerCase() })} placeholder="reckless-series" className={input} /></Field>
          <Field label="Teaser (one line)"><input value={f.teaser} onChange={(e) => setF({ ...f, teaser: e.target.value })} placeholder="The serpent returns. Washed black. 100 pieces." className={input} /></Field>
          <Field label="Description (optional)"><textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} rows={3} className={cn(input, "resize-none")} /></Field>
          <Field label="Hero image URL"><input value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} placeholder="https://…/drop.jpg" className={input} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Launches at"><input type="datetime-local" value={f.launchAt} onChange={(e) => setF({ ...f, launchAt: e.target.value })} className={input} /></Field>
            <Field label="When live, link to"><input value={f.ctaHref} onChange={(e) => setF({ ...f, ctaHref: e.target.value })} placeholder="/collections/reckless" className={input} /></Field>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-fog">
            <input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} className="accent-acid" />
            Published (visible on /drops)
          </label>
          {err && <p className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">{err}</p>}
          <button onClick={save} disabled={pending || !f.name.trim()} className="w-full bg-acid py-3 text-mono text-xs font-bold uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50">
            {pending ? "Saving…" : editingId ? "Save changes" : "Schedule drop"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-sm border border-smoke bg-ink-soft">
        {drops.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-mono text-xs uppercase tracking-[0.15em] text-ash">No drops yet</p>
            <p className="mt-3 text-sm text-fog">Schedule your first drop — it appears at /drops with a live countdown.</p>
          </div>
        ) : (
          <ul className="divide-y divide-smoke">
            {drops.map((d) => {
              const live = new Date(d.launchAt).getTime() <= Date.now();
              return (
                <li key={d.id} className={cn("flex items-start justify-between gap-4 p-4", editingId === d.id && "bg-acid/5")}>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg tracking-tight text-bone">{d.name}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-mono text-[0.5rem] uppercase tracking-[0.15em]", live ? "bg-acid/15 text-acid" : "bg-emerald-500/15 text-emerald-300")}>
                        {live ? "Live" : "Upcoming"}
                      </span>
                      {!d.published && <span className="rounded-full border border-smoke px-2 py-0.5 text-mono text-[0.5rem] uppercase tracking-[0.15em] text-ash">Hidden</span>}
                    </div>
                    <p className="mt-1 text-mono text-[0.6rem] uppercase tracking-[0.12em] text-ash">
                      {new Date(d.launchAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-mono text-[0.6rem] uppercase tracking-[0.12em] text-fog">
                      <Users className="h-3 w-3" /> {d.subscribers} on the notify list
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button onClick={() => edit(d)} aria-label="Edit" className="p-1.5 text-ash hover:text-bone"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => start(async () => { await deleteDropAction(d.id); if (editingId === d.id) reset(); router.refresh(); })} aria-label="Delete" className="p-1.5 text-ash hover:text-acid"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

const input =
  "w-full border-b border-smoke bg-transparent py-2 text-sm text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none [color-scheme:dark]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-mono text-[0.55rem] uppercase tracking-[0.2em] text-ash">{label}</label>
      {children}
    </div>
  );
}
