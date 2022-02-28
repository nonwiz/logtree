import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method != "POST" || !session.user.email) {
    return res.status(403).json({ message: "Request forbidden" });
  }
  const { label, refer, category } = req.body;
  try {
    const link = await prisma.link.create({
      data: {
        label,
        refer,
        category,
        user: { connect: { email: session.user.email } },
      },
    });
    res.status(200).json({ link });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}