import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session && !session.user.email) {
    return res.status(403).json({ login: false });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        categories: {
          include: {
            links: true,
            trackers: {
              include: {
                watchers: true,
              },
            },
            notes: true,
          },
        },
      },
    });
    const data = {
      categories: user.categories,
      login: true,
    };
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
