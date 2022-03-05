import { useState } from "react";
import { getSession } from "next-auth/react";
import { fetcher } from "lib/fetcher";
import { prisma } from "@/auth";

export default function Tracker({ data }) {
  const parsedData = JSON.parse(data);
  const [categories, setCategories] = useState(parsedData["categories"]);

  const handleUpdateWatcher = async (tid, status, categoryId) => {
    fetcher("/api/tracker", { tid, status }).then((d) => {
      const currentCategory = [...categories].filter(
        (category) => category.categoryId == categoryId
      )[0];
      currentCategory.trackers = currentCategory.trackers.map((track) =>
        track.trackerId == d.tracker.trackerId ? d.tracker : track
      );
      setCategories(
        categories.map((category) =>
          category.categoryId == categoryId ? currentCategory : category
        )
      );
    });
  };

  const handleCreateTracker = async (event) => {
    event.preventDefault();
    const category = event.target.querySelector("[name=selectCategory]").value;
    const description = event.target.querySelector("[name=description]").value;
    fetcher("/api/tracker/create", { category, description }).then((d) => {
      const tmp = [...categories];
      tmp
        .filter((item) => item.categoryId == category)[0]
        .trackers.push(d.tracker);
      setCategories(tmp);
    });
    event.target.querySelector("[name=description]").value = "";
  };

  const handleDeleteTracker = async (tid, categoryId) => {
    fetcher("/api/tracker/delete", { tid });
    const currentCategory = categories.filter(
      (item) => item.categoryId == categoryId
    )[0];
    currentCategory.trackers = currentCategory.trackers.filter(
      (track) => track.trackerId != tid
    );
    setCategories(
      categories.map((item) =>
        item.categoryId == categoryId ? currentCategory : item
      )
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="w-auto sm:border-gray-800 sm:border-r-2 p-1 sm:h-screen sm:w-86 md:w-[60vw] lg:w-[40vw]">
        <details open>
          <summary>Create Tracker </summary>

          <div className="border border-gray-800 m-1 p-2 rounded-md">
            <form
              className="flex flex-col gap-2"
              onSubmit={handleCreateTracker}
            >
              <select name="selectCategory">
                {categories.map((item, id) => (
                  <option key={id} value={item.categoryId}>
                    {" "}
                    {item.label}{" "}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Describe something about this tracker..."
              />

              <input
                type="submit"
                value="Create"
                className="bg-gray-800 text-gray-50 rounded-md"
              />
            </form>
          </div>
        </details>
        
      </div>
      <div className="w-full p-2">
        <h2>View List of Tracker </h2>

        <div className="p-1 space-x-1 gap-1">
          <div>
            {categories.map((item) => (
              <div key={item.categoryId}>
                {item.trackers.length ? (
                  <div className="p-1 m-1 rounded-md border border-gray-600">
                    <h3>{item.label}</h3>
                    <ul className="p-1 list-none">
                      {item.trackers.map((track, id) => (
                        <details key={id} open>
                          <summary>
                            {track.description}
                            <a
                              className="text-gray-500 px-2 hover:text-rose-400 hover:cursor-pointer"
                              onClick={() => {
                                confirm(
                                  "Are you sure you want to delete this?"
                                ) &&
                                  handleDeleteTracker(
                                    track.trackerId,
                                    item.categoryId
                                  );
                              }}
                            >
                              x
                            </a>
                          </summary>
                          <div>
                            <span className="pr-1">⤷</span>
                            {track.duration > 60
                              ? `${Math.floor(track.duration / 60)} min`
                              : `${track.duration} sec`}
                            {track.status == "start" ? " | Tracking..." : ""}
                            <a
                              className="w-6 h-6 rounded-full text-center p-1 mx-2 cursor-pointer"
                              onClick={() =>
                                handleUpdateWatcher(
                                  track.trackerId,
                                  track.status,
                                  item.categoryId
                                )
                              }
                            >
                              {track.status == "start" ? "⏸" : "▶"}
                            </a>
                          </div>
                        </details>
                      ))}
                    </ul>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      categories: {
        select: {
          categoryId: true,
          label: true,
          trackers: true,
        },
      },
    },
  });

  const data = user && JSON.stringify({ categories: user.categories });

  return {
    props: {
      data,
    },
  };
};
