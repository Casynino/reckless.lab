"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { setReviewStatusAction, deleteReviewAction } from "@/lib/reviews/actions";
import { cn } from "@/lib/utils";

export type AdminReviewRow = {
  id: string;
  product: string;
  rating: number;
  title: string;
  body: string;
  authorName: string;
  authorEmail: string;
  verified: boolean;
  status: "PUBLISHED" | "HIDDEN";
  createdAt: string;
};

export function ReviewsManager({ reviews }: { reviews: AdminReviewRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [filter, setFilter] = useState<"all" | "PUBLISHED" | "HIDDEN">("all");

  const rows = reviews.filter((r) => filter === "all" || r.status === filter);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", "PUBLISHED", "HIDDEN"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-mono text-[0.6rem] uppercase tracking-[0.15em] transition-colors",
              filter === f ? "border-acid/40 bg-acid/10 text-acid" : "border-smoke text-bone-dim hover:border-bone hover:text-bone",
            )}
          >
            {f === "all" ? "All" : f === "PUBLISHED" ? "Published" : "Hidden"}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-sm border border-smoke bg-ink-soft p-10 text-center">
          <p className="text-mono text-xs uppercase tracking-[0.15em] text-ash">No reviews here</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-sm border border-smoke bg-ink-soft p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn("h-3.5 w-3.5", r.rating >= s ? "fill-acid text-acid" : "text-smoke")} />
                      ))}
                    </span>
                    <span className="text-bone">{r.title}</span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-mono text-[0.5rem] uppercase tracking-[0.15em] text-acid">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-mono text-[0.5rem] uppercase tracking-[0.15em]",
                        r.status === "PUBLISHED" ? "bg-emerald-500/15 text-emerald-300" : "bg-smoke text-ash",
                      )}
                    >
                      {r.status === "PUBLISHED" ? "Live" : "Hidden"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-fog">{r.body}</p>
                  <p className="mt-2 text-mono text-[0.6rem] uppercase tracking-[0.12em] text-ash">
                    {r.product} · {r.authorName} ({r.authorEmail}) ·{" "}
                    {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() =>
                      start(async () => {
                        await setReviewStatusAction(r.id, r.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED");
                        router.refresh();
                      })
                    }
                    disabled={pending}
                    className="inline-flex items-center gap-1.5 border border-smoke px-3 py-1.5 text-mono text-[0.55rem] uppercase tracking-[0.15em] text-bone-dim transition-colors hover:border-bone hover:text-bone disabled:opacity-50"
                  >
                    {r.status === "PUBLISHED" ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Publish</>}
                  </button>
                  <button
                    onClick={() => start(async () => { await deleteReviewAction(r.id); router.refresh(); })}
                    disabled={pending}
                    aria-label="Delete review"
                    className="p-1.5 text-ash transition-colors hover:text-acid disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
