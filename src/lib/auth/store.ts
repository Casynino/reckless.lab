import "server-only";
import { db } from "@/lib/db";
import type { Role as PrismaRole } from "@prisma/client";
import type { Address, Role, UserRecord } from "./types";
import { hashPassword, verifyPassword } from "./password";

/**
 * User store — Postgres (Prisma). Same function surface as before; the app's
 * two-role model (admin / customer) maps onto the DB Role enum.
 */

function toAppRole(r: PrismaRole): Role {
  return r === "ADMIN" ? "admin" : "customer";
}
function toDbRole(r: Role): PrismaRole {
  return r === "admin" ? "ADMIN" : "CUSTOMER";
}

type UserWithAddress = Awaited<ReturnType<typeof db.user.findFirst>> & {
  addresses?: {
    fullName: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    region: string | null;
    postalCode: string | null;
    countryCode: string;
  }[];
};

function toRecord(u: UserWithAddress): UserRecord {
  const a = u!.addresses?.[0];
  return {
    id: u!.id,
    email: u!.email,
    name: u!.name,
    role: toAppRole(u!.role),
    passwordHash: u!.passwordHash,
    salt: u!.salt,
    createdAt: u!.createdAt.toISOString(),
    address: a
      ? {
          fullName: a.fullName,
          phone: a.phone,
          address1: a.line1,
          address2: a.line2 ?? undefined,
          city: a.city,
          region: a.region ?? undefined,
          postalCode: a.postalCode ?? undefined,
          countryCode: a.countryCode,
        }
      : undefined,
  };
}

export async function findByEmail(email: string): Promise<UserRecord | undefined> {
  const u = await db.user.findUnique({ where: { email: email.toLowerCase() }, include: { addresses: { take: 1 } } });
  return u ? toRecord(u) : undefined;
}

export async function findById(id: string): Promise<UserRecord | undefined> {
  const u = await db.user.findUnique({ where: { id }, include: { addresses: { take: 1 } } });
  return u ? toRecord(u) : undefined;
}

export async function createUser(input: { email: string; name: string; password: string; role?: Role }): Promise<UserRecord> {
  const email = input.email.toLowerCase().trim();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new Error("An account with this email already exists.");
  const { salt, hash } = hashPassword(input.password);
  const u = await db.user.create({
    data: { email, name: input.name.trim(), role: toDbRole(input.role ?? "customer"), salt, passwordHash: hash },
    include: { addresses: true },
  });
  return toRecord(u);
}

export async function updateUserProfile(id: string, patch: { name?: string; email?: string }): Promise<UserRecord> {
  const nextEmail = patch.email?.toLowerCase().trim();
  if (nextEmail) {
    const clash = await db.user.findFirst({ where: { email: nextEmail, id: { not: id } } });
    if (clash) throw new Error("That email is already in use.");
  }
  const u = await db.user.update({
    where: { id },
    data: { ...(patch.name ? { name: patch.name.trim() } : {}), ...(nextEmail ? { email: nextEmail } : {}) },
    include: { addresses: { take: 1 } },
  });
  return toRecord(u);
}

export async function updateUserPassword(id: string, current: string, next: string): Promise<void> {
  const u = await db.user.findUnique({ where: { id } });
  if (!u) throw new Error("Account not found.");
  if (!verifyPassword(current, u.salt, u.passwordHash)) throw new Error("Current password is wrong.");
  const { salt, hash } = hashPassword(next);
  await db.user.update({ where: { id }, data: { salt, passwordHash: hash } });
}

/** Set a password directly (admin reset — no current-password check). */
export async function setUserPassword(id: string, next: string): Promise<{ name: string; email: string } | null> {
  const u = await db.user.findUnique({ where: { id } });
  if (!u) return null;
  const { salt, hash } = hashPassword(next);
  await db.user.update({ where: { id }, data: { salt, passwordHash: hash } });
  return { name: u.name, email: u.email };
}

export async function updateUserAddress(id: string, address: Address): Promise<void> {
  const existing = await db.address.findFirst({ where: { userId: id } });
  const data = {
    fullName: address.fullName,
    phone: address.phone,
    line1: address.address1,
    line2: address.address2 ?? null,
    city: address.city,
    region: address.region ?? null,
    postalCode: address.postalCode ?? null,
    countryCode: address.countryCode,
  };
  if (existing) await db.address.update({ where: { id: existing.id }, data });
  else await db.address.create({ data: { ...data, userId: id } });
}

export async function listCustomers(): Promise<{ id: string; email: string; name: string; createdAt: string }[]> {
  const rows = await db.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  return rows.map((u) => ({ id: u.id, email: u.email, name: u.name, createdAt: u.createdAt.toISOString() }));
}
