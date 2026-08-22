import { PageTitle } from "@/components/admin/ui";
import { listAllDrops } from "@/lib/drops/store";
import { DropsManager, type DropRow } from "@/components/admin/drops-manager";

export const dynamic = "force-dynamic";

export default async function AdminDrops() {
  const drops = await listAllDrops();
  const rows: DropRow[] = drops.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    teaser: d.teaser,
    description: d.description,
    image: d.image,
    launchAt: d.launchAt,
    ctaHref: d.ctaHref,
    published: d.published,
    subscribers: d.subscribers,
  }));

  return (
    <div>
      <PageTitle title="Drops" subtitle="Schedule launches with a live countdown + notify list." />
      <div className="mt-8">
        <DropsManager drops={rows} />
      </div>
    </div>
  );
}
