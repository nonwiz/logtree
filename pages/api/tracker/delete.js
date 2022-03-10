import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method != "POST" || !session.user.email) {
    return res.status(403).json({ message: "Request forbidden" });
  }
  try {
    const { tid } = req.body;
    await prisma.tracker.delete({ where: { trackerId: Number(tid) } });
    res.status(200).json({ delete: true, message: "delete successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
