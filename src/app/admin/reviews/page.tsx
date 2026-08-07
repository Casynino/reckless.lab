import { PageTitle } from "@/components/admin/ui";
import { listAllReviews } from "@/lib/reviews/store";
import { getAllProducts } from "@/lib/data";
import { ReviewsManager, type AdminReviewRow } from "@/components/admin/reviews-manager";

export const dynamic = "force-dynamic";

export default async function AdminReviews() {
  const [reviews, products] = await Promise.all([listAllReviews(), getAllProducts()]);
  const nameById = new Map(products.map((p) => [p.id, p.name]));
  const rows: AdminReviewRow[] = reviews.map((r) => ({
    id: r.id,
    product: nameById.get(r.productId) ?? "—",
    rating: r.rating,
    title: r.title,
    body: r.body,
    authorName: r.authorName,
    authorEmail: r.authorEmail,
    verified: r.verified,
    status: r.status,
    createdAt: r.createdAt,
  }));

  return (
    <div>
      <PageTitle
        title="Reviews"
        subtitle={`${rows.filter((r) => r.status === "PUBLISHED").length} published · ${rows.length} total`}
      />
      <div className="mt-8">
        <ReviewsManager reviews={rows} />
      </div>
    </div>
  );
}
