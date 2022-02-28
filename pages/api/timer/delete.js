import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method != "POST" || !session.user.email) {
    return res.status(403).json({ message: "Request forbidden" });
  }
  console.log("Create function trigger", req.body, req.method);
  const { request } = req.body;
  if (request == "watcher") {
    const { tid } = req.body;
    const timer = await prisma.timer.findUnique({ where: { timerId: tid } });
    if (timer.status == "start") {
      const watchers = await prisma.watcher.findMany({
        where: { timer: { timerId: tid } },
      });
      const lastWatchers = watchers.pop();
      let end = new Date();
      let tmp = (end - new Date(lastWatchers.start)) / 1000;
      await prisma.watcher.update({
        where: { wid: lastWatchers.wid },
        data: { end },
      });
      const updateTimer = await prisma.timer.update({
        where: { timerId: tid },
        data: {
          status: "stop",
          duration: Math.floor(timer.duration + tmp),
        },
      });
      console.log("Stop watcher, add duration completed");
      return res.status(200).json(JSON.stringify({ timer: updateTimer }));
    } else if (timer.status == "stop") {
      await prisma.watcher.create({
        data: { timer: { connect: { timerId: timer.timerId } } },
      });
      const updateTimer = await prisma.timer.update({
        where: { timerId: tid },
        data: {
          status: "start",
        },
      });
      return res.status(200).json({ timer: updateTimer });
    }
  }

  if (request == "delete") {
    const { timerId } = req.body;
    await prisma.timer.delete({ where: { timerId } });
    return res.status(200).json({ message: "delete successfully" });
  }

  if (request == "create") {
    const { category, description } = req.body;
    const timer = await prisma.timer.create({
      data: {
        status: "start",
        category,
        description,
        duration: 0,
        user: { connect: { email: session.user.email } },
      },
    });
    const watcher = await prisma.watcher.create({
      data: {
        timer: { connect: { timerId: timer.timerId } },
      },
    });
    return res.status(200).json({ timer, watcher });
  }
  return res.status(200).json({ message: "unknown request" });
}
