import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method != "POST" || !session.user.email) {
    return res.status(403).json({ message: "Request forbidden" });
  }

  const { description, category } = req.body;
  try {
    const note = await prisma.note.create({
      data: {
        description,
        category: {
          connect: {
            categoryId: Number(category),
          },
        },
      },
    });
    res.status(200).json({ note });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
