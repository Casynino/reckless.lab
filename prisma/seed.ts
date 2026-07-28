import { PrismaClient, type Size } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";
import { products } from "../src/lib/data/products";
import { collections } from "../src/lib/data/collections";

const db = new PrismaClient();

function hash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, salt, 64).toString("hex");
  return { salt, passwordHash };
}

function code(len: number) {
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
}

async function main() {
  console.log("→ Seeding Reckless Laboratory…");

  // Warehouse
  await db.warehouse.upsert({
    where: { code: "DAR-MAIN" },
    update: {},
    create: { name: "Banjul HQ", code: "DAR-MAIN", location: "Banjul, The Gambia" },
  });

  // Collections
  for (const c of collections) {
    await db.collection.upsert({
      where: { slug: c.slug },
      update: { title: c.title, tagline: c.tagline, description: c.description, code: c.code, cover: c.cover.src, coverAlt: c.cover.alt },
      create: { slug: c.slug, title: c.title, tagline: c.tagline, description: c.description, code: c.code, cover: c.cover.src, coverAlt: c.cover.alt },
    });
  }

  // Products + variants + images + collection links
  for (const p of products) {
    const product = await db.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        subtitle: p.subtitle,
        story: p.story,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        gender: p.gender.toUpperCase() as "MEN" | "WOMEN" | "UNISEX",
        colorway: p.colorway,
        isNew: !!p.isNew,
        isBestSeller: !!p.isBestSeller,
        isLimited: !!p.isLimited,
        order: p.order ?? 0,
        details: p.details,
        materials: p.materials,
        care: p.care ?? [],
      },
      create: {
        slug: p.slug,
        name: p.name,
        subtitle: p.subtitle,
        story: p.story,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        gender: p.gender.toUpperCase() as "MEN" | "WOMEN" | "UNISEX",
        colorway: p.colorway,
        isNew: !!p.isNew,
        isBestSeller: !!p.isBestSeller,
        isLimited: !!p.isLimited,
        order: p.order ?? 0,
        details: p.details,
        materials: p.materials,
        care: p.care ?? [],
      },
    });

    // Variants
    for (const v of p.variants) {
      await db.productVariant.upsert({
        where: { sku: v.sku },
        update: { stock: v.stock },
        create: { productId: product.id, size: v.size as Size, sku: v.sku, stock: v.stock },
      });
    }

    // Images (reset then insert to keep order clean)
    await db.productImage.deleteMany({ where: { productId: product.id } });
    await db.productImage.createMany({
      data: p.media.map((m, i) => ({ productId: product.id, url: m.src, alt: m.alt, order: i })),
    });

    // Collection links
    for (const slug of p.collections) {
      const col = await db.collection.findUnique({ where: { slug } });
      if (col) {
        await db.productCollection.upsert({
          where: { productId_collectionId: { productId: product.id, collectionId: col.id } },
          update: {},
          create: { productId: product.id, collectionId: col.id },
        });
      }
    }
  }

  // Admin + demo customer
  const adminPw = hash(process.env.ADMIN_PASSWORD ?? "reckless2026");
  await db.user.upsert({
    where: { email: (process.env.ADMIN_EMAIL ?? "admin@recklesslab.com").toLowerCase() },
    update: { role: "ADMIN" },
    create: {
      email: (process.env.ADMIN_EMAIL ?? "admin@recklesslab.com").toLowerCase(),
      name: "Reckless Admin",
      role: "ADMIN",
      salt: adminPw.salt,
      passwordHash: adminPw.passwordHash,
    },
  });
  const custPw = hash("reckless123");
  await db.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: { email: "customer@example.com", name: "Test Customer", role: "CUSTOMER", salt: custPw.salt, passwordHash: custPw.passwordHash },
  });

  // Demo orders (only if none yet)
  const orderCount = await db.order.count();
  if (orderCount === 0) {
    const seeds = [
      { name: "Amie Njie", email: "amie.njie@example.com", phone: "+220 700 1121", country: "GM", state: "DELIVERED", daysAgo: 12, items: [{ slug: "identity-tee-white", size: "M", qty: 1 }, { slug: "i-exist-tee-washed-blue", size: "L", qty: 1 }] },
      { name: "Lamin Touray", email: "lamin.t@example.com", phone: "+220 700 4410", country: "GM", state: "IN_TRANSIT", daysAgo: 4, items: [{ slug: "reckless-tee-washed-black", size: "L", qty: 2 }] },
      { name: "Fatou Ceesay", email: "fatou.c@example.com", phone: "+220 700 8890", country: "GM", state: "PACKAGING", daysAgo: 1, items: [{ slug: "i-exist-tee-washed-grey", size: "S", qty: 1 }] },
      { name: "Omar Sané", email: "omar.sane@example.com", phone: "+221 77 555 2020", country: "SN", state: "NEW", daysAgo: 0, items: [{ slug: "identity-tee-washed-brown", size: "XL", qty: 1 }, { slug: "identity-tee-storm-grey", size: "M", qty: 1 }] },
      { name: "James Cole", email: "j.cole@example.com", phone: "+44 7700 900123", country: "GB", state: "DELIVERED", daysAgo: 20, items: [{ slug: "i-exist-tee-washed-blue", size: "M", qty: 1 }] },
      { name: "Aisha Bah", email: "aisha.bah@example.com", phone: "+220 700 3321", country: "GM", state: "DELIVERED", daysAgo: 15, items: [{ slug: "identity-tee-white", size: "S", qty: 1 }, { slug: "identity-tee-storm-grey", size: "L", qty: 2 }] },
      { name: "Marcus Reid", email: "m.reid@example.com", phone: "+1 202 555 0147", country: "US", state: "IN_TRANSIT", daysAgo: 6, items: [{ slug: "reckless-tee-washed-black", size: "M", qty: 1 }] },
      { name: "Binta Jallow", email: "binta.j@example.com", phone: "+220 700 6655", country: "GM", state: "PAYMENT_CONFIRMED", daysAgo: 0, items: [{ slug: "i-exist-tee-washed-grey", size: "L", qty: 1 }] },
      { name: "Kebba Manneh", email: "kebba.m@example.com", phone: "+220 700 1198", country: "GM", state: "READY_TO_SHIP", daysAgo: 2, items: [{ slug: "identity-tee-washed-brown", size: "M", qty: 1 }, { slug: "i-exist-tee-washed-blue", size: "M", qty: 1 }] },
      { name: "Isatou Drammeh", email: "isatou.d@example.com", phone: "+220 700 7742", country: "GM", state: "ISSUE", daysAgo: 8, items: [{ slug: "identity-tee-storm-grey", size: "XL", qty: 1 }] },
      { name: "Modou Faye", email: "modou.f@example.com", phone: "+220 700 9903", country: "GM", state: "DELIVERED", daysAgo: 18, items: [{ slug: "i-exist-tee-washed-grey", size: "M", qty: 2 }] },
      { name: "Grace Owens", email: "grace.o@example.com", phone: "+1 416 555 0199", country: "CA", state: "PACKAGING", daysAgo: 1, items: [{ slug: "identity-tee-white", size: "M", qty: 1 }, { slug: "identity-tee-washed-brown", size: "L", qty: 1 }] },
    ] as const;

    const STAGES = ["NEW", "PAYMENT_CONFIRMED", "PACKAGING", "READY_TO_SHIP", "IN_TRANSIT", "DELIVERED"];
    const ship = (country: string, sub: number) => (sub >= 90 ? 0 : country === "GM" ? 0 : ["SN", "NG", "GH"].includes(country) ? 18 : ["GB", "FR", "DE"].includes(country) ? 32 : ["US", "CA"].includes(country) ? 38 : 46);

    for (const s of seeds) {
      const placedAt = new Date(Date.now() - s.daysAgo * 864e5 - Math.floor(Math.random() * 6) * 36e5);
      const lines = s.items
        .map((it) => {
          const p = products.find((x) => x.slug === it.slug)!;
          const v = p.variants.find((x) => x.size === it.size) ?? p.variants[0];
          return { productSlug: p.slug, name: p.name, colorway: p.colorway, size: v.size, sku: v.sku, price: p.price, qty: it.qty, image: p.media[0].src };
        });
      const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
      const shipping = ship(s.country, subtotal);
      const idx = STAGES.indexOf(s.state);
      const events =
        idx >= 0
          ? STAGES.slice(0, idx + 1).map((st, i) => ({ state: st as never, at: new Date(placedAt.getTime() + i * 8 * 36e5) }))
          : [
              { state: "NEW" as never, at: placedAt },
              { state: s.state as never, at: new Date(placedAt.getTime() + 6 * 36e5) },
            ];

      await db.order.create({
        data: {
          reference: "RL-" + code(6),
          tracking: `RL-${code(4)}-${code(4)}`,
          customerName: s.name,
          customerEmail: s.email,
          customerPhone: s.phone,
          countryCode: s.country,
          subtotal,
          shipping,
          total: subtotal + shipping,
          state: s.state as never,
          createdAt: placedAt,
          items: { create: lines.map(({ productSlug, ...l }) => l) },
          events: { create: events },
        },
      });
    }
  }

  const [pc, cc, oc, uc] = await Promise.all([db.product.count(), db.collection.count(), db.order.count(), db.user.count()]);
  console.log(`✓ Seeded: ${pc} products · ${cc} collections · ${oc} orders · ${uc} users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
