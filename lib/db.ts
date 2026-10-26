import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Si la instancia en caché de globalThis no tiene los modelos pageSection o docCategory (por recargas en caliente), regenerarla
if (
  globalForPrisma.prisma &&
  (!(globalForPrisma.prisma as any).pageSection || !(globalForPrisma.prisma as any).docCategory)
) {
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
