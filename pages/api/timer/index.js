import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log("Create function trigger");
  const { request } = req.body;
  if (request == "watcher") {
    const { tid } = req.body;
    console.log("hey", tid);
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
