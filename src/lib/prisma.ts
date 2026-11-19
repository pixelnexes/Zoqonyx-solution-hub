import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Shared hosting gives each database user only a few connections, and Prisma's default pool is sized by CPU
// count. Cap it so restarts and several Node apps on one account cannot exhaust the limit and hang every query.
function limitedUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  if (/[?&]connection_limit=/.test(url)) return url;
  return url + (url.includes("?") ? "&" : "?") + "connection_limit=4&pool_timeout=15&connect_timeout=10";
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: limitedUrl(),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

globalForPrisma.prisma = prisma;
