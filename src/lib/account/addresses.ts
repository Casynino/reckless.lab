import "server-only";
import { db } from "@/lib/db";

export type AddressInput = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  countryCode: string;
};

export type SavedAddress = AddressInput & { id: string; isDefault: boolean };

function toAddr(a: {
  id: string; fullName: string; phone: string; line1: string; line2: string | null;
  city: string; region: string | null; postalCode: string | null; countryCode: string; isDefault: boolean;
}): SavedAddress {
  return {
    id: a.id,
    fullName: a.fullName,
    phone: a.phone,
    line1: a.line1,
    line2: a.line2 ?? undefined,
    city: a.city,
    region: a.region ?? undefined,
    postalCode: a.postalCode ?? undefined,
    countryCode: a.countryCode,
    isDefault: a.isDefault,
  };
}

export async function listAddresses(userId: string): Promise<SavedAddress[]> {
  const rows = await db.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toAddr);
}

export async function createAddress(userId: string, data: AddressInput) {
  const count = await db.address.count({ where: { userId } });
  const makeDefault = count === 0;
  return db.address.create({
    data: {
      userId,
      fullName: data.fullName,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2 || null,
      city: data.city,
      region: data.region || null,
      postalCode: data.postalCode || null,
      countryCode: data.countryCode,
      isDefault: makeDefault,
    },
  });
}

export async function updateAddress(userId: string, id: string, data: AddressInput) {
  await db.address.updateMany({
    where: { id, userId },
    data: {
      fullName: data.fullName,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2 || null,
      city: data.city,
      region: data.region || null,
      postalCode: data.postalCode || null,
      countryCode: data.countryCode,
    },
  });
}

export async function deleteAddress(userId: string, id: string) {
  const target = await db.address.findFirst({ where: { id, userId } });
  if (!target) return;
  await db.address.deleteMany({ where: { id, userId } });
  // If we removed the default, promote the newest remaining one.
  if (target.isDefault) {
    const next = await db.address.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
    if (next) await db.address.update({ where: { id: next.id }, data: { isDefault: true } });
  }
}

export async function setDefaultAddress(userId: string, id: string) {
  await db.$transaction([
    db.address.updateMany({ where: { userId }, data: { isDefault: false } }),
    db.address.updateMany({ where: { id, userId }, data: { isDefault: true } }),
  ]);
}
