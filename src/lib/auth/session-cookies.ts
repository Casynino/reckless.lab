import "server-only";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifySessionToken,
} from "./session";
import { findById } from "./store";
import type { SessionPayload } from "./types";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
}

/** Server-only cookie helpers for the session (uses next/headers). */

export async function setSession(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Current session (verified) or null. Use in server components / actions. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * The signed-in user, loaded FRESH from the database — the single source of
 * truth for display (name / email). The JWT is only trusted for identity
 * (`sub`) + authorization (`role`); the name/email inside it can be stale
 * (changed on another device, edited in the DB, etc.), so never render those.
 * Returns null if signed out or the account no longer exists.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;
  const user = await findById(session.sub);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
