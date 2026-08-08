"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { saveProductAction, deleteProductAction } from "@/lib/admin/product-actions";
import type { EditableProduct, EditableVariant, EditableImage } from "@/lib/admin/products";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const GENDERS = ["UNISEX", "MEN", "WOMEN"] as const;

type Form = Omit<EditableProduct, "details" | "materials" | "care"> & {
  details: string;
  materials: string;
  care: string;
};

function blank(): Form {
  return {
    slug: "", name: "", subtitle: "", story: "", price: 0, compareAtPrice: null,
    gender: "UNISEX", colorway: "", isNew: true, isBestSeller: false, isLimited: false,
    published: true, order: 0, details: "", materials: "", care: "",
    collectionSlugs: [], variants: [{ size: "M", sku: "", stock: 50 }], images: [{ url: "", alt: "" }],
  };
}

function toForm(p: EditableProduct): Form {
  return { ...p, details: p.details.join("\n"), materials: p.materials.join("\n"), care: p.care.join("\n") };
}

export function ProductEditor({
  product,
  collections,
}: {
  product?: EditableProduct;
  collections: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [f, setF] = useState<Form>(product ? toForm(product) : blank());
  const [err, setErr] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);
  const isEdit = !!product?.id;

  function up<K extends keyof Form>(key: K, value: Form[K]) {
    setF((s) => ({ ...s, [key]: value }));
  }

  function autoSlug() {
    if (!f.slug && f.name) up("slug", f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  }

  function save() {
    setErr("");
    const input: EditableProduct = {
      ...f,
      details: f.details.split("\n").map((s) => s.trim()).filter(Boolean),
      materials: f.materials.split("\n").map((s) => s.trim()).filter(Boolean),
      care: f.care.split("\n").map((s) => s.trim()).filter(Boolean),
      price: Number(f.price) || 0,
      compareAtPrice: f.compareAtPrice ? Number(f.compareAtPrice) : null,
      order: Number(f.order) || 0,
    };
    start(async () => {
      const res = await saveProductAction(input);
      if (res?.error) return setErr(res.error);
      router.push("/admin/products");
      router.refresh();
    });
  }

  function remove() {
    if (!product?.id) return;
    start(async () => {
      await deleteProductAction(product.id!);
      router.push("/admin/products");
      router.refresh();
    });
  }

  // Variants
  const addVariant = () => up("variants", [...f.variants, { size: "M", sku: "", stock: 50 } as EditableVariant]);
  const setVariant = (i: number, patch: Partial<EditableVariant>) =>
    up("variants", f.variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  const delVariant = (i: number) => up("variants", f.variants.filter((_, idx) => idx !== i));

  // Images
  const addImage = () => up("images", [...f.images, { url: "", alt: "" } as EditableImage]);
  const setImage = (i: number, patch: Partial<EditableImage>) =>
    up("images", f.images.map((im, idx) => (idx === i ? { ...im, ...patch } : im)));
  const delImage = (i: number) => up("images", f.images.filter((_, idx) => idx !== i));

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash hover:text-bone">
          <ArrowLeft className="h-3.5 w-3.5" /> All products
        </Link>
        <div className="flex items-center gap-2">
          {isEdit && (
            confirmDel ? (
              <div className="flex items-center gap-2">
                <span className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">Delete for good?</span>
                <button onClick={remove} disabled={pending} className="bg-acid px-3 py-1.5 text-mono text-[0.6rem] font-bold uppercase tracking-[0.15em] text-ink disabled:opacity-50">Yes, delete</button>
                <button onClick={() => setConfirmDel(false)} className="border border-smoke px-3 py-1.5 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash hover:text-bone">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDel(true)} className="inline-flex items-center gap-1.5 border border-smoke px-3 py-2 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash transition-colors hover:border-acid hover:text-acid">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            )
          )}
        </div>
      </div>

      <h1 className="mt-4 font-display text-4xl tracking-tight text-bone">{isEdit ? f.name || "Edit product" : "New product"}</h1>

      <div className="mt-8 space-y-8">
        {/* Basics */}
        <Section title="Basics">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" full={false}>
              <input value={f.name} onChange={(e) => up("name", e.target.value)} onBlur={autoSlug} placeholder="‘Identity’ Tee" className={input} />
            </Field>
            <Field label="URL slug"><input value={f.slug} onChange={(e) => up("slug", e.target.value.toLowerCase())} placeholder="identity-tee-white" className={input} /></Field>
            <Field label="Subtitle"><input value={f.subtitle} onChange={(e) => up("subtitle", e.target.value)} placeholder="Graphic heavyweight · front + back" className={input} /></Field>
            <Field label="Colourway"><input value={f.colorway} onChange={(e) => up("colorway", e.target.value)} placeholder="White" className={input} /></Field>
            <Field label="Price ($)"><input type="number" value={f.price} onChange={(e) => up("price", Number(e.target.value) as never)} className={input} /></Field>
            <Field label="Compare-at price ($) — optional"><input type="number" value={f.compareAtPrice ?? ""} onChange={(e) => up("compareAtPrice", (e.target.value ? Number(e.target.value) : null) as never)} placeholder="—" className={input} /></Field>
            <Field label="Gender">
              <select value={f.gender} onChange={(e) => up("gender", e.target.value as never)} className={input}>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Sort order (low = first)"><input type="number" value={f.order} onChange={(e) => up("order", Number(e.target.value) as never)} className={input} /></Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <Toggle label="Published" checked={f.published} onChange={(v) => up("published", v)} />
            <Toggle label="New" checked={f.isNew} onChange={(v) => up("isNew", v)} />
            <Toggle label="Best seller" checked={f.isBestSeller} onChange={(v) => up("isBestSeller", v)} />
            <Toggle label="Limited" checked={f.isLimited} onChange={(v) => up("isLimited", v)} />
          </div>
        </Section>

        {/* Story + lists */}
        <Section title="Story & specs">
          <Field label="Story (editorial paragraph)"><textarea value={f.story} onChange={(e) => up("story", e.target.value)} rows={4} className={cn(input, "resize-none")} /></Field>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="Details (one per line)"><textarea value={f.details} onChange={(e) => up("details", e.target.value)} rows={5} placeholder={"Boxy fit\nHeavyweight cotton"} className={cn(input, "resize-none")} /></Field>
            <Field label="Materials (one per line)"><textarea value={f.materials} onChange={(e) => up("materials", e.target.value)} rows={5} className={cn(input, "resize-none")} /></Field>
            <Field label="Care (one per line)"><textarea value={f.care} onChange={(e) => up("care", e.target.value)} rows={5} className={cn(input, "resize-none")} /></Field>
          </div>
        </Section>

        {/* Collections */}
        <Section title="Collections">
          <div className="flex flex-wrap gap-2">
            {collections.map((c) => {
              const on = f.collectionSlugs.includes(c.slug);
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => up("collectionSlugs", on ? f.collectionSlugs.filter((s) => s !== c.slug) : [...f.collectionSlugs, c.slug])}
                  className={cn("rounded-full border px-3 py-1.5 text-mono text-[0.6rem] uppercase tracking-[0.12em] transition-colors", on ? "border-acid/40 bg-acid/10 text-acid" : "border-smoke text-bone-dim hover:border-bone hover:text-bone")}
                >
                  {c.title}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Variants */}
        <Section title="Sizes & stock" action={<AddBtn onClick={addVariant} label="Add size" />}>
          <div className="space-y-2">
            {f.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[80px_1fr_100px_40px] items-center gap-3">
                <select value={v.size} onChange={(e) => setVariant(i, { size: e.target.value as EditableVariant["size"] })} className={input}>
                  {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input value={v.sku} onChange={(e) => setVariant(i, { sku: e.target.value.toUpperCase() })} placeholder="SKU e.g. IE-WHT-M" className={input} />
                <input type="number" value={v.stock} onChange={(e) => setVariant(i, { stock: Number(e.target.value) || 0 })} placeholder="Stock" className={input} />
                <button onClick={() => delVariant(i)} aria-label="Remove size" className="p-1.5 text-ash hover:text-acid"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </Section>

        {/* Images */}
        <Section title="Images (URLs)" action={<AddBtn onClick={addImage} label="Add image" />}>
          <p className="mb-3 text-[0.7rem] leading-relaxed text-ash">First image is the main one. Paste a hosted image URL (https://…). First shown big on the product page.</p>
          <div className="space-y-2">
            {f.images.map((im, i) => (
              <div key={i} className="grid grid-cols-[56px_1fr_1fr_40px] items-center gap-3">
                <div className="relative aspect-square overflow-hidden rounded-sm bg-carbon">
                  {im.url ? <SmartImage src={im.url} alt={im.alt || "preview"} fill sizes="56px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-[0.5rem] text-ash">no img</span>}
                </div>
                <input value={im.url} onChange={(e) => setImage(i, { url: e.target.value })} placeholder="https://…/photo.jpg" className={input} />
                <input value={im.alt} onChange={(e) => setImage(i, { alt: e.target.value })} placeholder="Alt text" className={input} />
                <button onClick={() => delImage(i)} aria-label="Remove image" className="p-1.5 text-ash hover:text-acid"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </Section>

        {err && <p className="text-mono text-[0.65rem] uppercase tracking-[0.15em] text-acid">{err}</p>}

        <div className="sticky bottom-0 -mx-1 flex items-center gap-3 border-t border-smoke bg-ink/90 px-1 py-4 backdrop-blur">
          <button onClick={save} disabled={pending} className="bg-acid px-8 py-3 text-mono text-xs font-bold uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50">
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
          <Link href="/admin/products" className="text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash hover:text-bone">Cancel</Link>
        </div>
      </div>
    </div>
  );
}

const input =
  "w-full border-b border-smoke bg-transparent py-2 text-sm text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none [&>option]:bg-ink";

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-smoke bg-ink-soft p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-mono text-xs uppercase tracking-[0.2em] text-bone">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-mono text-[0.55rem] uppercase tracking-[0.2em] text-ash">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-fog">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-acid" />
      {label}
    </label>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} type="button" className="inline-flex items-center gap-1.5 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid hover:underline">
      <Plus className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
