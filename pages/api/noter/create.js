import { prisma } from "@/auth";

export default async function handler(req, res) {
  const { description, trackerId } = req.body;
  console.log({ trackerId, description });
  try {
    const tracker = await prisma.tracker.update({
      where: {
        trackerId: Number(trackerId),
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
    console.log(tracker);
    res.status(200).json({ tracker });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
