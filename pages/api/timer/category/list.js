import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log("list function trigger");
  const { label } = req.body;
  console.log(session.user.email, label);
  const result = await prisma.category.findMany({
    where: {
      user: { email: { contains: session.user.email } },
    },
  });
  res.status(200).json(result);
}
