import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log("Create function trigger");
  const { request } = req.body;
  if (request == "watcher") {
    const { tid } = req.body;
    const timer = await prisma.timer.findUnique({ where: { tid } });
    if (timer.status == "start") {
      const watchers = await prisma.watcher.findMany({
        where: { timer: { tid } },
      });
      const lastWatchers = watchers.pop();
      const updateWatcher = await prisma.watcher.update({
        where: { wid: lastWatchers.wid },
        data: { end: new Date() },
      });
      const updateTimer = await prisma.timer.update({
        where: { tid },
        data: {
          status: "stop",
        },
      });
      res.status(200).json(JSON.stringify({ updateWatcher, updateTimer }));
    }
    console.log("hey", timer, watchers);
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
        timer: { connect: { tid: timer.tid } },
      },
    });
    res.status(200).json({ timer, watcher });
  }
  res.status(200).json({ message: "creating" });
}
