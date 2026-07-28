export type Role = "admin" | "customer";

export interface Address {
  fullName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  countryCode: string;
}

/** Full user record as stored (never sent to the client). */
export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  salt: string;
  address?: Address;
  createdAt: string;
}

/** Safe shape for the client / session. */
export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  address?: Address;
}

/** JWT session payload. */
export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}

export function toSafeUser(u: UserRecord): SafeUser {
  return { id: u.id, email: u.email, name: u.name, role: u.role, address: u.address };
}
