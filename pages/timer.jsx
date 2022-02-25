import { useState } from "react";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { fetcher } from "lib/fetcher";
import { prisma } from "@/auth";

export default function Timer({ data }) {
  const { data: session } = useSession();
  const { categories, timers, watchers } = JSON.parse(data);
  console.log("data", timers, watchers);
  const [deleteStart, setDelete] = useState(false);
  const [deleteList, setDeleteList] = useState([]);

  const handleUpdateWatcher = async (tid) => {
    fetcher("/api/timer", { request: "watcher", tid });
  };

  const handleCreateTimer = async (event) => {
    event.preventDefault();
    const category = event.target.querySelector("[name=selectCategory]").value;
    const description = event.target.querySelector("[name=description]").value;
    console.log(category, description);
    fetcher("/api/timer", { request: "create", category, description });
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    fetcher("/api/timer/category/delete", { deleteList });
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    const label = event.target.querySelector("[name=label]").value;
    // const newCategory = await prisma.category.create({ });
    fetcher("/api/timer/category/create", { label });
    // const currentUser = await prisma.user.findUnique({
    //   where: { email: session.user.email, name: session.user.name },
    // });
  };
  return (
    <div className="flex flex-wrap">
      <div className="w-1/2 border border-r-gray-800 h-[800px]">
        <div className="border border-gray-800 m-1 p-2 rounded-md">
          <h1>Create new timer </h1>
          <form className="flex flex-col gap-2" onSubmit={handleCreateTimer}>
            <select name="selectCategory">
              <option value="Uncategory"> Choose one </option>
              {categories.map((item, id) => (
                <option key={id} value={item.label}>
                  {" "}
                  {item.label}{" "}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              placeholder="Describe something about this timer..."
            />

            <input
              type="submit"
              value="Create"
              className="bg-gray-800 text-gray-50 rounded-md"
            />
          </form>
          <div className="mt-1 flex flex-row justify-between"></div>
        </div>
        <details open>
          <summary>Manage Category</summary>
          <div className="p-1 border border-gray-600 rounded-md pt-4 m-1">
            <div className="m-1 space-x-1">
              <button> Delete Mode </button>
              <button onClick={handleDelete}> Apply </button>
            </div>
            <hr />
            {categories.map((item, id) => (
              <span
                key={id}
                className="border border-gray-700 rounded-md p-1 m-1"
              >
                {item.label}{" "}
                <a
                  className="text-gray-500 hover:text-rose-400 hover:cursor-pointer"
                  onClick={() => setDeleteList([...deleteList, item.cid])}
                >
                  {" "}
                  x{" "}
                </a>
              </span>
            ))}
            {!deleteStart && (
              <form
                className="flex py-2 px-1 flex-row"
                onSubmit={handleCreateCategory}
              >
                <input
                  type="text"
                  name="label"
                  placeholder="Category"
                  className="bg-gray-200 w-3/4 border border-gray-600 rounded-md p-1 mr-1"
                />
                <button className="w-1/4">Add</button>
              </form>
            )}
          </div>
        </details>
      </div>
      <div className="w-1/2 px-2">
        <h2>View List of timer </h2>

        <div className="p-1 space-x-1 gap-1">
          {timers.map((item, id) => (
            <details key={id}>
              <summary>{item.description}</summary>
              <button> Pause </button>
              <button onClick={() => handleUpdateWatcher(item.tid)}>
                {" "}
                Stop{" "}
              </button>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      props: {
        data: [],
      },
    };
  }
  const timers = await prisma.timer.findMany({
    where: {
      user: { email: session.user.email },
    },
  });

  const watchers = await prisma.watcher.findMany({
    where: {
      timer: { tid: { in: timers.map((item) => item.tid) } },
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      user: { email: session.user.email },
    },
  });

  const data = JSON.stringify({ categories, timers, watchers });

  return {
    props: {
      data,
    },
  };
};
