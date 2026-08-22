import "server-only";
import { db } from "@/lib/db";

export interface Drop {
  id: string;
  slug: string;
  name: string;
  teaser: string;
  description: string;
  image: string;
  launchAt: string; // ISO
  ctaHref: string;
  published: boolean;
}

type Row = {
  id: string; slug: string; name: string; teaser: string; description: string;
  image: string; launchAt: Date; ctaHref: string; published: boolean;
};

function toDrop(r: Row): Drop {
  return {
    id: r.id, slug: r.slug, name: r.name, teaser: r.teaser, description: r.description,
    image: r.image, launchAt: r.launchAt.toISOString(), ctaHref: r.ctaHref, published: r.published,
  };
}

/** The drop to feature: the soonest one that hasn't launched yet; if none are
 *  upcoming, the most recently launched (so a fresh drop stays highlighted). */
export async function getFeaturedDrop(): Promise<Drop | null> {
  const now = new Date();
  const upcoming = await db.drop.findFirst({
    where: { published: true, launchAt: { gte: now } },
    orderBy: { launchAt: "asc" },
  });
  if (upcoming) return toDrop(upcoming);
  const latest = await db.drop.findFirst({ where: { published: true }, orderBy: { launchAt: "desc" } });
  return latest ? toDrop(latest) : null;
}

export async function listPublishedDrops(): Promise<Drop[]> {
  const rows = await db.drop.findMany({ where: { published: true }, orderBy: { launchAt: "asc" } });
  return rows.map(toDrop);
}

export async function notifyDrop(dropId: string, emailRaw: string): Promise<void> {
  const email = emailRaw.trim().toLowerCase();
  await db.dropSubscriber.upsert({
    where: { dropId_email: { dropId, email } },
    create: { dropId, email },
    update: {},
  });
}

// ── Admin ──
export interface DropAdminInput {
  slug: string;
  name: string;
  teaser: string;
  description: string;
  image: string;
  launchAt: string; // datetime-local or ISO
  ctaHref: string;
  published: boolean;
}

export async function listAllDrops() {
  const rows = await db.drop.findMany({
    include: { _count: { select: { subscribers: true } } },
    orderBy: { launchAt: "desc" },
  });
  return rows.map((r) => ({ ...toDrop(r), subscribers: r._count.subscribers }));
}

function normData(input: DropAdminInput) {
  return {
    slug: input.slug.trim().toLowerCase(),
    name: input.name.trim(),
    teaser: input.teaser.trim(),
    description: input.description.trim(),
    image: input.image.trim(),
    launchAt: new Date(input.launchAt),
    ctaHref: input.ctaHref.trim() || "/collections/new-arrivals",
    published: input.published,
  };
}

export async function createDrop(input: DropAdminInput) {
  await db.drop.create({ data: normData(input) });
}
export async function updateDrop(id: string, input: DropAdminInput) {
  await db.drop.update({ where: { id }, data: normData(input) });
}
export async function deleteDrop(id: string) {
  await db.drop.delete({ where: { id } });
}
export async function getDropSubscribers(id: string): Promise<string[]> {
  const rows = await db.dropSubscriber.findMany({ where: { dropId: id }, orderBy: { createdAt: "desc" }, select: { email: true } });
  return rows.map((r) => r.email);
}
