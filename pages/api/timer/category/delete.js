import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { deleteList } = req.body;
  const result = await prisma.category.deleteMany({
    where: {
      cid: { in: deleteList },
    },
  });
  return res.status(200).json(result);
}
