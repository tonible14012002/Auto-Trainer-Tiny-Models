// ts-ignore 7017 is used to ignore the error that the global object is not
// defined in the global scope. This is because the global object is only
// defined in the global scope in Node.js and not in the browser.

import { Prisma, PrismaClient } from "../../../generated/prisma";
import { DefaultArgs } from "../../../generated/prisma/runtime/library";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const isProduction = process.env.NEXT_PUBLIC_RUNTIME_ENV === "production";
const logLevel: (Prisma.LogLevel | Prisma.LogDefinition)[] = isProduction
  ? ["error"]
  : ["query", "info", "warn", "error"];

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: logLevel });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
}

export type PrismaTx = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export default prisma;
