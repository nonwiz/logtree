import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method != "POST" || !session.user.email) {
    return res.status(403).json({ message: "Request forbidden" });
  }
  try {
    const { nid } = req.body;
    await prisma.note.delete({
      where: {
        nid,
      },
    });
    res.status(200).json({ message: "delete completed" });
  } catch (error) {
    res.status(500).json({ error });
  }
}
