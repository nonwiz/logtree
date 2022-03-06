import { prisma } from "@/auth";

export default async function handler(req, res) {
  if (req.method != "POST") {
    return res.status(403).json({ message: "Request forbidden" });
  }
  const { tid, status } = req.body;
  console.log({ tid, status });
  try {
    if (status == "start") {
      const tracker = await prisma.tracker.findUnique({
        where: { trackerId: tid },
        select: {
          watchers: true,
          duration: true,
        },
      });
      const lastWatchers = tracker.watchers.pop();
      const tmp = (new Date() - new Date(lastWatchers.start)) / 1000;
      const updatedTracker = await prisma.tracker.update({
        where: { trackerId: tid },
        data: {
          status: "stop",
          duration: Math.floor(tracker.duration + tmp),
          watchers: {
            update: {
              where: { wid: lastWatchers.wid },
              data: { end: new Date() },
            },
          },
        },
      });
      console.log("Stop watcher, add duration completed");
      return res.status(200).json({ tracker: updatedTracker });
    } else if (status == "stop") {
      const updatedTracker = await prisma.tracker.update({
        where: { trackerId: tid },
        data: {
          status: "start",
          watchers: {
            create: {},
          },
        },
      });
      res.status(200).json({ tracker: updatedTracker });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
