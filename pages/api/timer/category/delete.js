import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log("delete function triggering");
  console.log(session.user.email, req.body);
  const { deleteList } = req.body;
  const result = await prisma.category.deleteMany({
    where: {
      cid: { in: deleteList },
    },
  });
  console.log(result);
  res.status(200).json(result);
}
