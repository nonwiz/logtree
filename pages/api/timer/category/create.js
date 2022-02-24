import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log("Create function trigger");
  const { label } = req.body;
  console.log(session.user.email, label);
  const result = await prisma.category.create({
    data: {
      label,
      user: { connect: { email: session.user.email } },
    },
  });
  res.status(200).json({ message: "creating" });
}
