import { PrismaClient } from "@prisma/client";
let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;

console.log("prismalib", prisma, global);

export default prisma;
