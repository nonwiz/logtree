import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { fetcher } from "lib/fetcher";
import { prisma } from "@/auth";

export default function Timer({ data }) {
  const parsedData = JSON.parse(data);
  const [timers, setTimers] = useState(parsedData["timers"]);
  const [categories, setCategories] = useState(parsedData["categories"]);
  const [deleteStart, setDelete] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  console.log(categories);

  const handleUpdateWatcher = async (tid) => {
    console.log("before update", timers);
    fetcher("/api/timer", { request: "watcher", tid }).then((d) => {
      setTimers(timers.map((item) => (item.timerId == tid ? d.timer : item)));
    });
    console.log("updated watchers", timers);
  };

  const handleCreateTimer = async (event) => {
    event.preventDefault();
    const category = event.target.querySelector("[name=selectCategory]").value;
    const description = event.target.querySelector("[name=description]").value;
    console.log(category, description);
    fetcher("/api/timer", { request: "create", category, description }).then(
      (d) => {
        setTimers([...timers, d.timer]);
      }
    );
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    fetcher("/api/timer/category/delete", { deleteList });
    setCategories(
      categories.filter((item) => !(deleteList.indexOf(item.cid) > -1))
    );
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    const label = event.target.querySelector("[name=label]").value;
    fetcher("/api/timer/category/create", { label }).then((d) => {
      setCategories([...categories, d.category]);
    });
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-1/2 border border-r-gray-800 h-[800px]">
        <div className="border border-gray-800 m-1 p-2 rounded-md">
          <h1>Create Tracker </h1>
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
          <summary>Manage Topic</summary>
          <div className="p-1 border border-gray-600 rounded-md pt-4 m-1">
            <div className="m-1 space-x-1">
              {deleteStart && <button onClick={handleDelete}> Apply </button>}
              {deleteStart && (
                <button
                  onClick={() => {
                    setDeleteList([]);
                    setDelete(false);
                  }}
                >
                  Cancel
                </button>
              )}
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
                  onClick={() => {
                    setDeleteList([...deleteList, item.cid]);
                    setDelete(true);
                  }}
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
                  placeholder="Topic"
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
            <details key={id} open>
              <summary>
                {item.description} |{" "}
                {item.duration > 60
                  ? `${Math.floor(item.duration / 60)} min`
                  : `${item.duration} sec`}
                {item.status == "start" ? " | Tracking..." : ""}
              </summary>
              <button onClick={() => handleUpdateWatcher(item.timerId)}>
                {item.status == "start" ? "Stop" : "Continue"}
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
        data: {
          timers: [],
          categories: [],
          watchers: [],
        },
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
      timer: { timerId: { in: timers.map((item) => item.tid) } },
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      user: { email: session.user.email },
    },
  });

  const data = categories && JSON.stringify({ categories, timers, watchers });

  return {
    props: {
      data,
    },
  };
};
