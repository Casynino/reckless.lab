import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton — avoids exhausting connections in dev (HMR) and is
 * safe on serverless. Point DATABASE_URL at local Postgres in dev, Neon in prod.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
