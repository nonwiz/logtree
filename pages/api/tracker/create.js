import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  // const session = await getSession({ req });
  // if (req.method != "POST" || !session.user.email) {
  //   return res.status(403).json({ message: "Request forbidden" });
  // }
  try {
    const { category, description } = req.body;
    const tracker = await prisma.tracker.create({
      data: {
        status: "start",
        category: {
          connect: {
            categoryId: Number(category),
          },
        },
        description,
        duration: 0,
        watchers: {
          create: {},
        },
      },
      include: {
        watchers: true,
      },
    });
    return res.status(200).json({ tracker });
  } catch (error) {
    res.status(500).json({ error });
  }
}
