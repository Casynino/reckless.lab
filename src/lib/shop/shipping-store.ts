import "server-only";
import { db } from "@/lib/db";
import { DEFAULT_SHIPPING_REGIONS, type ShippingRegion } from "./shipping";

/** A live rate row (region shape + admin-only fields). */
export interface ShippingRateRecord extends ShippingRegion {
  active: boolean;
  sortOrder: number;
}

type Row = {
  id: string;
  label: string;
  countries: string;
  courier: string;
  eta: string;
  flatRate: number;
  freeThreshold: number;
  requiresQuote: boolean;
  isDefault: boolean;
  active: boolean;
  sortOrder: number;
};

function toRecord(r: Row): ShippingRateRecord {
  return {
    id: r.id,
    label: r.label,
    countries: r.countries ? r.countries.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean) : [],
    courier: r.courier,
    eta: r.eta,
    flatRate: r.flatRate,
    freeThreshold: r.freeThreshold,
    requiresQuote: r.requiresQuote,
    isDefault: r.isDefault,
    active: r.active,
    sortOrder: r.sortOrder,
  };
}

/** Live regions the checkout + orders quote against. Active only, ordered.
 *  Falls back to the code defaults until the table is seeded, so shipping never
 *  breaks on a fresh install. */
export async function getShippingRegions(): Promise<ShippingRegion[]> {
  const rows = await db.shippingRate.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  if (!rows.length) return DEFAULT_SHIPPING_REGIONS;
  return rows.map(toRecord);
}

/** Every row (including disabled) for the admin manager. */
export async function listShippingRates(): Promise<ShippingRateRecord[]> {
  const rows = await db.shippingRate.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(toRecord);
}

/** One-time: copy the code defaults into the DB if the table is empty. */
export async function seedDefaultShippingRates(): Promise<number> {
  const count = await db.shippingRate.count();
  if (count > 0) return 0;
  await db.shippingRate.createMany({
    data: DEFAULT_SHIPPING_REGIONS.map((r, i) => ({
      label: r.label,
      countries: r.countries.join(","),
      courier: r.courier,
      eta: r.eta,
      flatRate: r.flatRate,
      freeThreshold: r.freeThreshold,
      requiresQuote: r.requiresQuote ?? false,
      isDefault: r.isDefault ?? false,
      sortOrder: i,
    })),
  });
  return DEFAULT_SHIPPING_REGIONS.length;
}

export interface ShippingRateInput {
  label: string;
  countries: string; // comma-separated ISO codes
  courier: string;
  eta: string;
  flatRate: number;
  freeThreshold: number;
  requiresQuote: boolean;
  isDefault: boolean;
}

function normCountries(s: string) {
  return s.split(",").map((x) => x.trim().toUpperCase()).filter(Boolean).join(",");
}
function normData(input: ShippingRateInput) {
  return {
    label: input.label.trim(),
    countries: normCountries(input.countries),
    courier: input.courier.trim(),
    eta: input.eta.trim(),
    flatRate: Math.max(0, Math.round(Number(input.flatRate)) || 0),
    freeThreshold: Math.max(0, Math.round(Number(input.freeThreshold)) || 0),
    requiresQuote: !!input.requiresQuote,
    isDefault: !!input.isDefault,
  };
}

export async function createShippingRate(input: ShippingRateInput) {
  const max = await db.shippingRate.aggregate({ _max: { sortOrder: true } });
  await db.shippingRate.create({ data: { ...normData(input), sortOrder: (max._max.sortOrder ?? 0) + 1 } });
}

export async function updateShippingRate(id: string, input: ShippingRateInput) {
  await db.shippingRate.update({ where: { id }, data: normData(input) });
}

export async function toggleShippingRate(id: string) {
  const r = await db.shippingRate.findUnique({ where: { id } });
  if (!r) return;
  await db.shippingRate.update({ where: { id }, data: { active: !r.active } });
}

export async function deleteShippingRate(id: string) {
  await db.shippingRate.delete({ where: { id } });
}
