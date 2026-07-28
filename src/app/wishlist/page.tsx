import type { Metadata } from "next";
import { getAllProducts } from "@/lib/data";
import { PageHero } from "@/components/layout/page-hero";
import { WishlistView } from "@/components/product/wishlist-view";

export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const allProducts = await getAllProducts();

  return (
    <div className="min-h-[70vh]">
      <PageHero
        code="[ WISHLIST / THE WATCHLIST ]"
        title="Saved"
        tagline="The pieces you're circling. Move them to your bag when you're ready."
      />
      <WishlistView allProducts={allProducts} />
    </div>
  );
}
