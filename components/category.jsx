import { useState } from "react";
import { fetcher } from "lib/fetcher";
import { useSWRConfig } from "swr";

export const Category = (data) => {
  const { mutate } = useSWRConfig();

  const { data: categoriesList } = data;
  const [categories, setCategories] = useState(categoriesList);
  const [deleteStart, setDelete] = useState(false);
  const [deleteList, setDeleteList] = useState([]);

  const handleDeleteCategories = async (event) => {
    event.preventDefault();
    fetcher("/api/tracker/category/delete", { deleteList }).then(() => {
      mutate("/api/logtree");
    });
    setCategories(
      categories.filter((item) => !(deleteList.indexOf(item.categoryId) > -1))
    );
    setDelete(false);
  };

  const handleCreateCategory = async (label) => {
    if (label.length < 4) {
      console.log("invalid label");
      alert("Invalid label");
    } else {
      console.log("calling create topic");
      fetcher("/api/tracker/category/create", { label }).then((d) => {
        mutate("/api/logtree");
        setCategories([...categories, d.category]);
      });
    }
  };

  return (
    <div>
      <details open>
        <summary>Manage Topic</summary>
        <div className="p-1 m-1">
          <hr />
          {!categories.length && "Try create some topic!"}
          <div className="flex flex-wrap gap-2 m-1">
            {categories.map((item, id) => (
              <span key={id} className="border border-gray-700 rounded-md p-1">
                {item.label}{" "}
                <a
                  className="text-gray-500 hover:text-rose-400 hover:cursor-pointer"
                  onClick={() => {
                    setDeleteList([...deleteList, item.categoryId]);
                    setDelete(true);
                  }}
                >
                  x
                </a>
              </span>
            ))}
          </div>
          {deleteStart && (
            <p className="text-xs text-gray-600">
              Deleting topic will delete the links, notes, and trackers that are
              associated to it{" "}
            </p>
          )}
          <hr className="border-gray-800 mt-2" />
          {deleteStart && (
            <div className="pt-2">
              <div>
                <div className="px-2">
                  Deleting:
                  <span className="text-gray-600">
                    {categories.map(
                      (item, id) =>
                        deleteList.indexOf(item.categoryId) > -1 && (
                          <span className="px-1" key={id}>
                            {item.label}
                          </span>
                        )
                    )}
                  </span>
                </div>
              </div>
              <span className="pl-2">⤷</span>

              <button
                onClick={handleDeleteCategories}
                className="text-rose-600"
              >
                Apply
              </button>
              <span> | </span>

              <button
                onClick={() => {
                  setDeleteList([]);
                  setDelete(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {!deleteStart && (
            <div className="flex py-2 px-1 flex-row">
              <input
                type="text"
                name="label"
                placeholder="Topic"
                required
                minLength="4"
                maxLength="20"
                className="bg-gray-200 w-3/4 border border-gray-600 rounded-md p-1 mr-1"
              />
              <button
                className="w-1/4 bg-gray-800 text-gray-100 hover:bg-gray-600"
                onClick={(e) => {
                  const label = document.querySelector("[name=label]");
                  handleCreateCategory(label.value);
                  e.target.textContent = "...";
                  e.target.disabled = true;
                  setTimeout(() => {
                    label.value = "";
                    e.target.disabled = false;
                    e.target.textContent = "Add";
                  }, 2000);
                }}
              >
                Add
              </button>
            </div>
          )}
        </div>
      </details>
      <p className="m-1">
        <code>Topic</code> links up with the other model such as tracker, links,
        etc ...
      </p>
    </div>
  );
};
