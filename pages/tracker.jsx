import { fetcher, useCategories } from "lib/fetcher";
import { useSWRConfig } from "swr";
import { categorizeObj } from "lib/utils";
import ShowError from "@/components/showError";
import ShowLoading from "@/components/showLoading";

export default function Tracker() {
  const { data, isLoading, isError } = useCategories();
  const { mutate } = useSWRConfig();

  const handleUpdateWatcherStop = async (track) => {
    // This is for stopping timer, when status is start
    const lastWatcher = track.watchers.at(-1);
    fetcher("/api/tracker/watchers/end", {
      start: lastWatcher.start,
      tid: track.trackerId,
      duration: track.duration,
      wid: lastWatcher.wid,
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
      mutate("/api/logtree", { ...data, trackers: tmpTrackers }, false);
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
    fetcher("/api/tracker/create", { category, description }).then((d) => {
      const tmpTrackers = [...data.trackers, d.tracker];
      mutate("/api/logtree", { ...data, trackers: tmpTrackers }, false);
    });
    event.target.querySelector("[name=description]").value = "";
  };

  const handleDeleteTracker = async (trackerId) => {
    // const tmpTrackers = data.trackers.filter(
    //   (track) => track.trackerId != trackerId
    // );
    // mutate("/api/logtree", { ...data, trackers: tmpTrackers }, false);

    fetcher("/api/tracker/delete", { tid: trackerId }).then(() => {
      const tmpTrackers = data.trackers.filter(
        (track) => track.trackerId != trackerId
      );
      mutate("/api/logtree", { ...data, trackers: tmpTrackers }, false);
    });
  };

  if (isLoading) {
    return <ShowLoading />;
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
    <div className="flex flex-col">
      <div className="w-auto sm:w-80 sm:fixed w-auto z-10 left-0 top-0 overflow-hidden my-4 sm:mt-20">
        <div className="sm:ml-1 p-1 border border-gray-800 rounded-md">
          <details open>
            <summary>Create Tracker </summary>

            <div className="border border-gray-800 m-1 p-2 rounded-md">
              <form
                className="flex flex-col gap-2"
                onSubmit={handleCreateTracker}
              >
                <select name="selectCategory" required>
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
                  required
                  minLength="4"
                  maxLength="50"
                />

                <input
                  type="submit"
                  value="Create"
                  className="bg-gray-800 text-gray-50 rounded-md"
                />
              </form>
            </div>
          </details>
        </div>
        <div className="sm:ml-1 p-1 border border-gray-800 rounded-md mt-2">
          <details>
            <summary> Current Issues / Bugs </summary>

            <ul className="list-disc p-2 pl-4 ">
              <li>Resume / stop counter is quite slow.</li>
            </ul>
          </details>
          <details>
            <summary> To be implemented </summary>
            <ul className="list-disc p-2 pl-4 ">
              <li>
                {" "}
                When tracking begin, make the time dynamic or changing every
                second{" "}
              </li>
            </ul>
          </details>
        </div>
      </div>
      <div className="sm:ml-80 w-auto p-2 h-full">
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
                              <summary className="">
                                {track.description}
                                {track.trackerId && (
                                  <a
                                    className="text-gray-500 px-2 hover:text-rose-400 hover:cursor-pointer"
                                    onClick={(e) => {
                                      let confirmAgain = confirm(
                                        "Are you sure you want to delete this?"
                                      );
                                      if (confirmAgain) {
                                        e.target.parentElement.className +=
                                          " text-rose-500 ";
                                        handleDeleteTracker(track.trackerId);
                                      }
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
                                  <button
                                    className="w-6 h-6 rounded-full text-center p-1 mx-2 cursor-pointer disabled:opacity-50"
                                    onClick={(e) => {
                                      const pe = e.target.parentElement;
                                      const el = e.target;
                                      el.disabled = true;
                                      pe.childNodes[2].textContent =
                                        " | Reloading...";
                                      console.log(e.target, pe);
                                      track.status == "start"
                                        ? handleUpdateWatcherStop(track)
                                        : handleUpdateWatcherStart(track);
                                      setTimeout(
                                        () => (el.disabled = false),
                                        3000
                                      );
                                    }}
                                  >
                                    {track.status == "start" ? "⏸" : "▶"}
                                  </button>
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
