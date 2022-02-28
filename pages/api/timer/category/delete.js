import { prisma } from "@/auth";

export default async function handler(req, res) {
  if (req.method != "POST") {
    return res.status(403).json({ message: "Request forbidden" });
  }
  const { deleteList } = req.body;
  const result = await prisma.category.deleteMany({
    where: {
      cid: { in: deleteList },
    },
  });
  res.status(200).json(result);
}
