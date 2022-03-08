import { fetcher, useCategories } from "lib/fetcher";
import { useSWRConfig } from "swr";
import { categorizeObj } from "lib/utils";
import ShowError from "@/components/showError";

export default function Tracker() {
  const { data, isLoading, isError } = useCategories();
  const { mutate } = useSWRConfig();

  const handleUpdateWatcherStop = async (track) => {
    // This is for stopping timer, when status is start
    const lastWatcher = track.watchers.pop();
    const end = new Date();
    const tmp = (end - new Date(lastWatcher.start)) / 1000;
    const duration = Math.floor(track.duration + tmp);
    fetcher("/api/tracker/watchers/end", {
      tid: track.trackerId,
      duration,
      wid: lastWatcher.wid,
      end,
    }).then((d) => {
      const tmpTrackers = data.trackers.map((item) =>
        item.trackerId == track.trackerId ? d.tracker : item
      );

      mutate("/api/logtree", { ...data, trackers: tmpTrackers }, false);
    });
  };

  const handleUpdateWatcherStart = async (track) => {
    // This is for creating a new timer when status is stop
    fetcher("/api/tracker/watchers/continue", {
      tid: track.trackerId,
    }).then((d) => {
      const tmpTrackers = data.trackers.map((item) =>
        item.trackerId == track.trackerId ? d.tracker : item
      );
      mutate("/api/logtree", { ...data, trackers: tmpTrackers });
    });
  };

  const handleCreateTracker = async (event) => {
    event.preventDefault();
    const category = event.target.querySelector("[name=selectCategory]").value;
    const description = event.target.querySelector("[name=description]").value;
    const tmpTrackers = [
      ...data.trackers,
      {
        categoryId: category,
        description,
        startDate: new Date(),
        duration: 0,
        status: "start",
      },
    ];
    mutate("/api/logtree", { ...data, trackers: tmpTrackers }, false);
    fetcher("/api/tracker/create", { category, description }).then(() => {
      mutate("/api/logtree");
    });
    event.target.querySelector("[name=description]").value = "";
  };

  const handleDeleteTracker = async (trackerId) => {
    const tmpTrackers = data.trackers.filter(
      (track) => track.trackerId != trackerId
    );
    mutate("/api/logtree", { ...data, trackers: tmpTrackers }, false);
    fetcher("/api/tracker/delete", { tid: trackerId });
  };

  if (isLoading) {
    return <div> Loading... </div>;
  }

  if (!isLoading && data.error) {
    console.log(data);
    return (
      <>
        <ShowError />
      </>
    );
  }

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
                {data &&
                  data.categoriesList &&
                  data.categoriesList.map((item, id) => (
                    <option key={id} value={item.categoryId}>
                      {item.label}
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
            {data &&
              data.categoriesList &&
              categorizeObj(data.categoriesList, data.trackers, "trackers").map(
                (item) => (
                  <div key={item.categoryId}>
                    {item.trackers.length ? (
                      <div className="p-1 m-1 rounded-md border border-gray-600">
                        <h3>{item.label}</h3>
                        <ul className="p-1 list-none">
                          {item.trackers.map((track, id) => (
                            <details
                              key={id}
                              className={`${
                                !track.trackerId && "text-gray-600"
                              }`}
                              open
                            >
                              <summary>
                                {track.description}
                                {track.trackerId && (
                                  <a
                                    className="text-gray-500 px-2 hover:text-rose-400 hover:cursor-pointer"
                                    onClick={() => {
                                      confirm(
                                        "Are you sure you want to delete this?"
                                      ) && handleDeleteTracker(track.trackerId);
                                    }}
                                  >
                                    x
                                  </a>
                                )}
                              </summary>
                              <div>
                                <span className="pr-1">⤷</span>
                                {track.duration > 60
                                  ? `${Math.floor(track.duration / 60)} min, ${
                                      track.duration % 60
                                    } sec`
                                  : `${track.duration} sec`}
                                {track.status == "start"
                                  ? " | Tracking..."
                                  : ""}
                                {track.trackerId && (
                                  <a
                                    className="w-6 h-6 rounded-full text-center p-1 mx-2 cursor-pointer"
                                    onClick={() => {
                                      track.status == "start"
                                        ? handleUpdateWatcherStop(track)
                                        : handleUpdateWatcherStart(track);
                                    }}
                                  >
                                    {track.status == "start" ? "⏸" : "▶"}
                                  </a>
                                )}
                              </div>
                            </details>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
