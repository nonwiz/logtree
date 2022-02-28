import { prisma } from "@/auth";

export default async function handler(req, res) {
  if (req.method != "POST") {
    return res.status(403).json({ message: "Request forbidden" });
  }
  const { tid, status } = req.body;
  try {
    if (status == "start") {
      const timer = await prisma.timer.findUnique({
        where: { timerId: tid },
        select: {
          watchers: true,
          duration: true,
        },
      });
      const lastWatchers = timer.watchers.pop();
      const tmp = (new Date() - new Date(lastWatchers.start)) / 1000;
      const updateTimer = await prisma.timer.update({
        where: { timerId: tid },
        data: {
          status: "stop",
          duration: Math.floor(timer.duration + tmp),
          watchers: {
            update: {
              where: { wid: lastWatchers.wid },
              data: { end: new Date() },
            },
          },
        },
      });
      console.log("Stop watcher, add duration completed");
      return res.status(200).json(JSON.stringify({ timer: updateTimer }));
    } else if (status == "stop") {
      const updateTimer = await prisma.timer.update({
        where: { timerId: tid },
        data: {
          status: "start",
          watchers: {
            create: {},
          },
        },
      });
      res.status(200).json({ timer: updateTimer });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
