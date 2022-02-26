import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { fetcher } from "lib/fetcher";
import { prisma } from "@/auth";

export default function Linker({ data }) {
  const parsedData = JSON.parse(data);
  const { categories } = parsedData;
  const [deleteStart, setDelete] = useState(false);
  const [deleteList, setDeleteList] = useState([]);

  return (
    <div className="flex flex-wrap">
      <div className="w-1/2 border border-r-gray-800 h-[800px]">
        <details open>
          <summary>Manage Topic</summary>
          <div className="p-1 border border-gray-600 rounded-md pt-4 m-1">
            <form className="flex py-2 px-1 flex-col">
              <select name="selectCategory">
                <option value="Uncategory"> Choose one </option>
                {categories.map((item, id) => (
                  <option key={id} value={item.label}>
                    {" "}
                    {item.label}{" "}
                  </option>
                ))}
              </select>

              <div>
                <textarea name="refer" placeholder="Put your link here." />
              </div>
              <div>
                <input
                  type="text"
                  name="label"
                  placeholder="Label"
                  className="bg-gray-200 w-auto border border-gray-600 rounded-md p-1 mr-1"
                />
                <button className="w-1/4">Add</button>
              </div>
            </form>
          </div>
        </details>
      </div>
      <div className="w-1/2 px-2">
        <h2>View List of Link </h2>
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      props: {
        data: {
          timers: [],
          categories: [],
          watchers: [],
        },
      },
    };
  }

  const categories = await prisma.category.findMany({
    where: {
      user: { email: session.user.email },
    },
  });

  const data = categories && JSON.stringify({ categories });

  return {
    props: {
      data,
    },
  };
};
