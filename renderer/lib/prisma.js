import { PrismaClient } from "@prisma/client";

const isDevelopmentEnv = process.env.NODE_ENV === "development";
// console.log({ isDevelopmentEnv });

// const loggingOptions = isDevelopmentEnv
//   ? ["query", "info", "warn", "error"]
//   : [];

const prisma = global.prisma || new PrismaClient();

// if (isDevelopmentEnv) {
//   prisma.$on("query", async (e) => {
//     console.log("PRISMA", `${e.query} ${e.params}`);
//   });
// }

if (isDevelopmentEnv) global.prisma = prisma;

export default prisma;
