import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method != "POST" || !session.user.email) {
    return res.status(403).json({ message: "Request forbidden" });
  }
  console.log("Create function trigger", req.body, req.method);
  try {
    const { category, description } = req.body;
    const timer = await prisma.timer.create({
      data: {
        status: "start",
        category: {
          connect: {
            cid: Number(category),
          },
        },
        description,
        duration: 0,
        watchers: {
          create: {},
        },
      },
    });
    console.log("Timer creation", timer);
    return res.status(200).json({ timer });
  } catch (error) {
    res.status(500).json({ error });
  }
}
