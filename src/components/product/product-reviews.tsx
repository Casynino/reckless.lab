"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Star, ShieldCheck, ThumbsUp, X, PenLine, Check } from "lucide-react";
import { submitReviewAction, helpfulReviewAction } from "@/lib/reviews/actions";
import type { Review, ReviewStats, ReviewSort } from "@/lib/reviews/store";
import { cn } from "@/lib/utils";

const FIT_OPTIONS = [
  { value: -1, label: "Runs small" },
  { value: 0, label: "True to size" },
  { value: 1, label: "Runs large" },
];
const SORTS: { value: ReviewSort; label: string }[] = [
  { value: "recent", label: "Most recent" },
  { value: "helpful", label: "Most helpful" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

export function ProductReviews({
  productId,
  productSlug,
  productName,
  reviews,
  stats,
}: {
  productId: string;
  productSlug: string;
  productName: string;
  reviews: Review[];
  stats: ReviewStats;
}) {
  // Who's posting — signed-in name comes from the session (server fills the
  // email + verified check); guests type their own name + email.
  const [me, setMe] = useState<{ name: string } | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => alive && d.user && setMe({ name: d.user.name }))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const [sort, setSort] = useState<ReviewSort>("recent");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [visible, setVisible] = useState(6);
  const [writing, setWriting] = useState(false);

  const [extraHelpful, setExtraHelpful] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let list = reviews.slice();
    if (starFilter) list = list.filter((r) => r.rating === starFilter);
    if (verifiedOnly) list = list.filter((r) => r.verified);
    const by: Record<ReviewSort, (a: Review, b: Review) => number> = {
      recent: (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
      helpful: (a, b) => helpfulOf(b) - helpfulOf(a),
      highest: (a, b) => b.rating - a.rating,
      lowest: (a, b) => a.rating - b.rating,
    };
    return list.sort(by[sort]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews, starFilter, verifiedOnly, sort, extraHelpful]);

  function helpfulOf(r: Review) {
    return r.helpfulCount + (extraHelpful[r.id] ?? 0);
  }

  function voteHelpful(id: string) {
    if (voted.has(id)) return;
    setVoted((s) => new Set(s).add(id));
    setExtraHelpful((m) => ({ ...m, [id]: (m[id] ?? 0) + 1 }));
    void helpfulReviewAction(id);
  }

  const maxBar = Math.max(1, ...stats.distribution);

  return (
    <section id="reviews" className="container-edge mt-24 scroll-mt-28 md:mt-32">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-smoke pb-6">
        <div>
          <p className="eyebrow">[ Community / Field Notes ]</p>
          <h2 className="mt-3 font-display display-lg text-bone">Reviews</h2>
        </div>
        <button
          onClick={() => setWriting(true)}
          className="inline-flex items-center gap-2 bg-acid px-6 py-3 text-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90"
        >
          <PenLine className="h-3.5 w-3.5" /> Write a review
        </button>
      </div>

      {stats.count === 0 ? (
        <div className="py-16 text-center">
          <Stars value={0} className="justify-center" />
          <p className="mt-5 font-display text-2xl text-bone">No reviews yet</p>
          <p className="mt-2 text-fog">Own this piece? Be the first to put it on record.</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid gap-10 py-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            {/* Score */}
            <div className="flex flex-col items-start">
              <div className="flex items-end gap-4">
                <span className="font-display text-7xl leading-none text-bone">{stats.average.toFixed(1)}</span>
                <div className="pb-1">
                  <Stars value={stats.average} />
                  <p className="mt-2 text-mono text-[0.65rem] uppercase tracking-[0.15em] text-ash">
                    {stats.count} review{stats.count === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm text-fog">
                <span className="font-semibold text-acid">{stats.recommendPct}%</span> would recommend this to a friend
              </p>

              {/* Fit meter */}
              <div className="mt-8 w-full max-w-sm">
                <p className="text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">How it fits</p>
                <div className="relative mt-4 h-px w-full bg-smoke">
                  <div
                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid ring-4 ring-acid/20"
                    style={{ left: `${((Math.max(-1, Math.min(1, stats.fitAvg)) + 1) / 2) * 100}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-mono text-[0.55rem] uppercase tracking-[0.12em] text-ash">
                  <span>Runs small</span>
                  <span>True to size</span>
                  <span>Runs large</span>
                </div>
              </div>
            </div>

            {/* Distribution */}
            <div className="flex flex-col justify-center gap-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const n = stats.distribution[star - 1];
                const active = starFilter === star;
                return (
                  <button
                    key={star}
                    onClick={() => setStarFilter(active ? null : star)}
                    className="group flex items-center gap-3 text-left"
                  >
                    <span className="flex w-10 shrink-0 items-center gap-1 text-mono text-[0.7rem] text-ash">
                      {star} <Star className="h-3 w-3 fill-ash text-ash group-hover:fill-acid group-hover:text-acid" />
                    </span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-smoke">
                      <span
                        className={cn("block h-full rounded-full transition-colors", active ? "bg-acid" : "bg-bone-dim group-hover:bg-acid")}
                        style={{ width: `${(n / maxBar) * 100}%` }}
                      />
                    </span>
                    <span className={cn("w-8 shrink-0 text-right text-mono text-[0.7rem]", active ? "text-acid" : "text-ash")}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-smoke py-4">
            <div className="flex flex-wrap items-center gap-2">
              {starFilter && (
                <button
                  onClick={() => setStarFilter(null)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-acid/40 bg-acid/10 px-3 py-1.5 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid"
                >
                  {starFilter}★ only <X className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={() => setVerifiedOnly((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-mono text-[0.6rem] uppercase tracking-[0.15em] transition-colors",
                  verifiedOnly ? "border-acid/40 bg-acid/10 text-acid" : "border-smoke text-bone-dim hover:border-bone hover:text-bone",
                )}
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Verified only
              </button>
            </div>
            <label className="flex items-center gap-2 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as ReviewSort)}
                className="border-b border-smoke bg-ink py-1.5 text-bone focus:border-bone focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-ink">{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          {/* List */}
          <div className="divide-y divide-smoke/70">
            {filtered.slice(0, visible).map((r) => (
              <ReviewCard key={r.id} r={r} helpful={helpfulOf(r)} voted={voted.has(r.id)} onVote={() => voteHelpful(r.id)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-fog">No reviews match that filter.</p>
          )}

          {visible < filtered.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisible((v) => v + 6)}
                className="border border-smoke px-8 py-3 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-bone hover:text-ink"
              >
                Load more reviews
              </button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {writing && (
          <WriteReview
            productId={productId}
            productSlug={productSlug}
            productName={productName}
            me={me}
            onClose={() => setWriting(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ReviewCard({ r, helpful, voted, onVote }: { r: Review; helpful: number; voted: boolean; onVote: () => void }) {
  return (
    <article className="py-7">
      <div className="flex flex-wrap items-center gap-3">
        <Stars value={r.rating} size="sm" />
        {r.recommend && (
          <span className="text-mono text-[0.55rem] uppercase tracking-[0.15em] text-acid">Recommends</span>
        )}
      </div>
      <h3 className="mt-3 font-display text-xl tracking-tight text-bone">{r.title}</h3>
      <p className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed text-fog">{r.body}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-mono text-[0.6rem] uppercase tracking-[0.12em] text-ash">
        <span className="text-bone-dim">{r.authorName}</span>
        {r.verified && (
          <span className="inline-flex items-center gap-1 text-acid">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Buyer
          </span>
        )}
        <span>{fitLabel(r.fit)}</span>
        <span>{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
      </div>

      <button
        onClick={onVote}
        disabled={voted}
        className={cn(
          "mt-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-mono text-[0.6rem] uppercase tracking-[0.15em] transition-colors",
          voted ? "border-acid/40 text-acid" : "border-smoke text-bone-dim hover:border-bone hover:text-bone",
        )}
      >
        <ThumbsUp className="h-3.5 w-3.5" /> Helpful{helpful > 0 ? ` · ${helpful}` : ""}
      </button>
    </article>
  );
}

function WriteReview({
  productId,
  productSlug,
  productName,
  me,
  onClose,
}: {
  productId: string;
  productSlug: string;
  productName: string;
  me?: { name: string } | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fit, setFit] = useState(0);
  const [recommend, setRecommend] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  function submit() {
    setErr("");
    start(async () => {
      const res = await submitReviewAction({
        productId,
        productSlug,
        rating,
        title,
        body,
        fit,
        recommend,
        name: me ? undefined : name,
        email: me ? undefined : email,
      });
      if (res?.error) return setErr(res.error);
      setDone(true);
      router.refresh();
      setTimeout(onClose, 1400);
    });
  }

  const input =
    "w-full border-b border-smoke bg-transparent py-2.5 text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none";

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/80 backdrop-blur-sm md:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto border border-smoke bg-ink-soft p-6 md:p-8"
      >
        {done ? (
          <div className="py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-acid/15 text-acid">
              <Check className="h-6 w-6" />
            </span>
            <p className="mt-5 font-display text-2xl text-bone">Thank you.</p>
            <p className="mt-2 text-fog">Your review is live on the field notes.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">[ Field Note ]</p>
                <h3 className="mt-2 font-display text-2xl text-bone">Review {productName}</h3>
              </div>
              <button onClick={onClose} aria-label="Close" className="text-ash hover:text-bone">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {/* Rating */}
              <div>
                <label className="mb-2 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">Your rating *</label>
                <div className="flex gap-1.5" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHover(s)}
                      onClick={() => setRating(s)}
                      aria-label={`${s} star${s > 1 ? "s" : ""}`}
                    >
                      <Star className={cn("h-7 w-7 transition-colors", (hover || rating) >= s ? "fill-acid text-acid" : "text-smoke hover:text-ash")} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">Headline *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sum it up in a few words" className={input} />
              </div>

              <div>
                <label className="mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">Your review *</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  placeholder="Fit, feel, quality — how does it wear?"
                  className={cn(input, "resize-none")}
                />
              </div>

              {/* Fit */}
              <div>
                <label className="mb-2 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">How does it fit?</label>
                <div className="grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-smoke bg-smoke">
                  {FIT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setFit(o.value)}
                      className={cn(
                        "bg-ink-soft py-2.5 text-mono text-[0.6rem] uppercase tracking-[0.12em] transition-colors",
                        fit === o.value ? "bg-acid/15 text-acid" : "text-bone-dim hover:text-bone",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommend */}
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fog">
                <input type="checkbox" checked={recommend} onChange={(e) => setRecommend(e.target.checked)} className="accent-acid" />
                I&apos;d recommend this to a friend
              </label>

              {/* Identity */}
              {me ? (
                <p className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
                  Posting as <span className="text-bone">{me.name}</span>
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">Name *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Displayed publicly" className={input} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">Email *</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Not shown" className={input} />
                  </div>
                </div>
              )}

              {err && <p className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">{err}</p>}

              <button
                onClick={submit}
                disabled={pending}
                className="w-full bg-acid py-3.5 text-mono text-xs font-bold uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {pending ? "Posting…" : "Post review"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function fitLabel(fit: number) {
  if (fit <= -1) return "Fit · Runs small";
  if (fit >= 1) return "Fit · Runs large";
  return "Fit · True to size";
}

/** Star row. `value` may be fractional for the summary; rounds to nearest half visually via fill. */
export function Stars({ value, size = "md", className }: { value: number; size?: "sm" | "md"; className?: string }) {
  const px = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={cn(px, value >= s - 0.25 ? "fill-acid text-acid" : "text-smoke")} />
      ))}
    </div>
  );
}
