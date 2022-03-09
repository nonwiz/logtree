import { prisma } from "@/auth";

export default async function handler(req, res) {
  if (req.method != "POST") {
    return res.status(403).json({ message: "Request forbidden" });
  }
  try {
    const { tid, duration, start, wid } = req.body;
    const end = new Date();
    const tmp = (end - new Date(start)) / 1000;
    const updatedDuration = Math.floor(Number(duration) + tmp);

    const updatedTracker = await prisma.tracker.update({
      where: { trackerId: tid },
      data: {
        status: "stop",
        duration: updatedDuration,
        watchers: {
          update: {
            where: { wid },
            data: { end },
          },
        },
      },
    });
    console.log("Stop watcher, add duration completed");
    return res.status(200).json({ tracker: updatedTracker });
  } catch (error) {
    res.status(500).json({ error });
  }
}
