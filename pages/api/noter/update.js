import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method != "POST" || !session.user.email) {
    return res.status(403).json({ message: "Request forbidden" });
  }

  const { note, description } = req.body;
  try {
    const updatedNote = await prisma.note.update({
      where: {
        nid: note,
      },
      data: {
        description,
      },
    });
    res.status(200).json({ note: updatedNote });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
