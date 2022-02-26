import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { label } = req.body;
  const category = await prisma.category.create({
    data: {
      label,
      user: { connect: { email: session.user.email } },
    },
  });
  return res.status(200).json({ category });
}
