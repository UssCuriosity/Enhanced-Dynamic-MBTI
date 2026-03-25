import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    const httpUrl = tursoUrl.replace(/^libsql:\/\//, "https://");
    const adapter = new PrismaLibSql({ url: httpUrl, authToken: tursoToken });
    return new PrismaClient({ adapter });
  }

  const localUrl = `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
  const adapter = new PrismaLibSql({ url: localUrl });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
