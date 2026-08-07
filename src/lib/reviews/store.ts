import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export type ReviewSort = "recent" | "highest" | "lowest" | "helpful";

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  fit: number; // -2..2
  recommend: boolean;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
}

/** Admin row — includes moderation fields. */
export interface AdminReview extends Review {
  authorEmail: string;
  status: "PUBLISHED" | "HIDDEN";
}

export interface ReviewStats {
  count: number;
  average: number; // 0 when none
  /** counts[i] = number of i+1-star reviews (index 0 = 1★ … 4 = 5★). */
  distribution: number[];
  recommendPct: number; // 0..100
  fitAvg: number; // -2..2, 0 = true to size
}

type Row = {
  id: string; productId: string; authorName: string; authorEmail: string; rating: number;
  title: string; body: string; fit: number; recommend: boolean; verified: boolean;
  status: "PUBLISHED" | "HIDDEN"; helpfulCount: number; createdAt: Date;
};

function toReview(r: Row): Review {
  return {
    id: r.id,
    productId: r.productId,
    authorName: r.authorName,
    rating: r.rating,
    title: r.title,
    body: r.body,
    fit: r.fit,
    recommend: r.recommend,
    verified: r.verified,
    helpfulCount: r.helpfulCount,
    createdAt: r.createdAt.toISOString(),
  };
}

const ORDER_BY: Record<ReviewSort, Prisma.ReviewOrderByWithRelationInput[]> = {
  recent: [{ createdAt: "desc" }],
  highest: [{ rating: "desc" }, { createdAt: "desc" }],
  lowest: [{ rating: "asc" }, { createdAt: "desc" }],
  helpful: [{ helpfulCount: "desc" }, { createdAt: "desc" }],
};

export async function listReviews(
  productId: string,
  opts: { sort?: ReviewSort; take?: number } = {},
): Promise<Review[]> {
  const rows = await db.review.findMany({
    where: { productId, status: "PUBLISHED" },
    orderBy: ORDER_BY[opts.sort ?? "recent"],
    take: opts.take ?? 100,
  });
  return rows.map(toReview);
}

export async function getReviewStats(productId: string): Promise<ReviewStats> {
  const rows = await db.review.findMany({
    where: { productId, status: "PUBLISHED" },
    select: { rating: true, fit: true, recommend: true },
  });
  const count = rows.length;
  if (count === 0) {
    return { count: 0, average: 0, distribution: [0, 0, 0, 0, 0], recommendPct: 0, fitAvg: 0 };
  }
  const distribution = [0, 0, 0, 0, 0];
  let sum = 0;
  let fitSum = 0;
  let rec = 0;
  for (const r of rows) {
    const idx = Math.min(5, Math.max(1, r.rating)) - 1;
    distribution[idx]++;
    sum += r.rating;
    fitSum += r.fit;
    if (r.recommend) rec++;
  }
  return {
    count,
    average: Math.round((sum / count) * 10) / 10,
    distribution,
    recommendPct: Math.round((rec / count) * 100),
    fitAvg: Math.round((fitSum / count) * 100) / 100,
  };
}

/** Average rating + count for many products at once (product cards / listings). */
export async function getReviewStatsMap(
  productIds: string[],
): Promise<Record<string, { average: number; count: number }>> {
  if (productIds.length === 0) return {};
  const grouped = await db.review.groupBy({
    by: ["productId"],
    where: { productId: { in: productIds }, status: "PUBLISHED" },
    _avg: { rating: true },
    _count: { _all: true },
  });
  const map: Record<string, { average: number; count: number }> = {};
  for (const g of grouped) {
    map[g.productId] = {
      average: Math.round((g._avg.rating ?? 0) * 10) / 10,
      count: g._count._all,
    };
  }
  return map;
}

export async function createReview(input: {
  productId: string;
  userId?: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  title: string;
  body: string;
  fit: number;
  recommend: boolean;
}): Promise<Review> {
  // Verified buyer = this email has an order containing this product.
  const priorOrders = await db.order.count({
    where: {
      customerEmail: { equals: input.authorEmail, mode: "insensitive" },
      items: { some: { productId: input.productId } },
    },
  });
  const row = await db.review.create({
    data: {
      productId: input.productId,
      userId: input.userId ?? null,
      authorName: input.authorName.trim(),
      authorEmail: input.authorEmail.trim().toLowerCase(),
      rating: Math.min(5, Math.max(1, Math.round(input.rating))),
      title: input.title.trim(),
      body: input.body.trim(),
      fit: Math.min(2, Math.max(-2, Math.round(input.fit))),
      recommend: input.recommend,
      verified: priorOrders > 0,
    },
  });
  return toReview(row);
}

export async function markHelpful(id: string): Promise<void> {
  await db.review.update({ where: { id }, data: { helpfulCount: { increment: 1 } } }).catch(() => {});
}

// ── Admin moderation ──
export async function listAllReviews(): Promise<AdminReview[]> {
  const rows = await db.review.findMany({ orderBy: { createdAt: "desc" }, take: 300 });
  return rows.map((r) => ({ ...toReview(r), authorEmail: r.authorEmail, status: r.status }));
}

export async function setReviewStatus(id: string, status: "PUBLISHED" | "HIDDEN"): Promise<void> {
  await db.review.update({ where: { id }, data: { status } });
}

export async function deleteReview(id: string): Promise<void> {
  await db.review.delete({ where: { id } }).catch(() => {});
}
