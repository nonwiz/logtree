import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session.user.email) {
    return res.status(403).json({ message: "Request forbidden" });
  }
  const result = await prisma.category.findMany({
    where: {
      user: { email: session.user.email },
    },
  });
  res.status(200).json(result);
}
