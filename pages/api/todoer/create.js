import { prisma } from "@/auth";

export default async function handler(req, res) {
  const { description, timerId } = req.body;
  console.log({ timerId, description });
  try {
    const timer = await prisma.timer.update({
      where: {
        timerId: Number(timerId),
      },
      data: {
        notes: {
          create: {
            description,
          },
        },
      },
      include: {
        notes: true,
      },
    });
    console.log(timer);
    res.status(200).json({ timer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
