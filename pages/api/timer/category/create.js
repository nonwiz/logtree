import { prisma } from "lib/prisma";

export default async function handler(req, res) {
  console.log(req);
  res.status(200);
}
