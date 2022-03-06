import { prisma } from "@/auth";

export default async function handler(req, res) {
  if (req.method != "POST") {
    return res.status(403).json({ message: "Request forbidden" });
  }
  try {
    const { tid, duration, wid, end } = req.body;
    const updatedTracker = await prisma.tracker.update({
      where: { trackerId: tid },
      data: {
        status: "stop",
        duration,
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
