import "server-only";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Address, Role, UserRecord } from "./types";
import { hashPassword } from "./password";

/**
 * Simple file-backed user store — zero-setup, persists locally across restarts.
 * This is the ONLY module that touches user storage, so swapping it for
 * Postgres/Prisma later is a drop-in change (keep the exported function
 * signatures). Note: serverless hosts have a read-only FS — move to a DB
 * before deploying multi-instance.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "users.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf8");
}

function readAll(): UserRecord[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as UserRecord[];
  } catch {
    return [];
  }
}

function writeAll(users: UserRecord[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2), "utf8");
}

/** Create the seed admin the first time the store is empty. */
function ensureSeed(users: UserRecord[]): UserRecord[] {
  if (users.some((u) => u.role === "admin")) return users;
  const email = (process.env.ADMIN_EMAIL ?? "admin@recklesslab.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "reckless2026";
  const { salt, hash } = hashPassword(password);
  const admin: UserRecord = {
    id: randomUUID(),
    email,
    name: "Reckless Admin",
    role: "admin",
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  };
  const next = [admin, ...users];
  writeAll(next);
  return next;
}

export function getUsers(): UserRecord[] {
  return ensureSeed(readAll());
}

export function findByEmail(email: string): UserRecord | undefined {
  return getUsers().find((u) => u.email === email.toLowerCase());
}

export function findById(id: string): UserRecord | undefined {
  return getUsers().find((u) => u.id === id);
}

export function createUser(input: {
  email: string;
  name: string;
  password: string;
  role?: Role;
}): UserRecord {
  const users = getUsers();
  const email = input.email.toLowerCase().trim();
  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists.");
  }
  const { salt, hash } = hashPassword(input.password);
  const user: UserRecord = {
    id: randomUUID(),
    email,
    name: input.name.trim(),
    role: input.role ?? "customer",
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  };
  writeAll([...users, user]);
  return user;
}

export function updateUserAddress(id: string, address: Address): UserRecord | undefined {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], address };
  writeAll(users);
  return users[idx];
}

/** Admin: list customers (safe fields only). */
export function listCustomers() {
  return getUsers()
    .filter((u) => u.role === "customer")
    .map((u) => ({ id: u.id, email: u.email, name: u.name, createdAt: u.createdAt }));
}
