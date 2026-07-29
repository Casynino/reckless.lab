import type { Metadata } from "next";
import { getAllProducts } from "@/lib/data";
import { PageHero } from "@/components/layout/page-hero";
import { SearchClient } from "@/components/shop/search-client";

export const metadata: Metadata = {
  title: "Search",
  description: "Search every piece from Reckless Laboratory.",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [products, { q }] = await Promise.all([getAllProducts(), searchParams]);
  return (
    <div>
      <PageHero code="[ SEARCH / THE ARCHIVE ]" title="Find it" />
      <SearchClient products={products} initialQuery={q ?? ""} />
    </div>
  );
}
