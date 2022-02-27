import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method != "POST" || !session.user.email) {
    return res.status(403).json({ message: "Request forbidden" });
  }
  const { request } = req.body;
  if (request == "create") {
    const { label, refer, category } = req.body;
    const link = await prisma.link.create({
      data: {
        label,
        refer,
        category,
        user: { connect: { email: session.user.email } },
      },
    });
    return res.status(200).json({ link });
  }
  if (request == "delete") {
    const { lid } = req.body;
    await prisma.link.delete({
      where: {
        lid,
      },
    });
    return res.status(200).json({ message: "delete completed" });
  }
  return res.status(200).json({ message: "Invalid request" });
}
