import { getSession } from "next-auth/react";
import { prisma } from "@/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || !session.user.email) {
    return res
      .status(200)
      .json({ login: false, error: { message: "not logged in" } });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        categories: {
          include: {
            links: true,
            trackers: {
              include: {
                watchers: true,
              },
            },
            notes: true,
          },
        },
      },
    });
    const dataList = ["links", "notes", "trackers"];
    const data = user.categories.reduce(
      (obj, category) => {
        dataList.forEach((key) => {
          obj[key] = [...obj[key], ...category[key]];
        });
        return obj;
      },
      { links: [], notes: [], trackers: [] }
    );

    data["categories"] = user.categories;
    data["login"] = true;
    data["categoriesList"] = user.categories.map((cate) => ({
      categoryId: cate.categoryId,
      label: cate.label,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(200).json({ error });
  }
}
