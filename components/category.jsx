import { useState } from "react";
import { fetcher } from "lib/fetcher";

export const Category = (data) => {
  const { data: categoriesList } = data;
  const [categories, setCategories] = useState(categoriesList);
  const [deleteStart, setDelete] = useState(false);
  const [deleteList, setDeleteList] = useState([]);

  const handleDeleteCategories = async (event) => {
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
    <div>
      <details open>
        <summary>Manage Topic</summary>
        <div className="px-2 py-4 border border-gray-600 rounded-md m-1">
          <hr />
          {!categories.length && "Try create some topic!"}
          <div className="flex flex-wrap gap-2 m-1">
            {categories.map((item, id) => (
              <span key={id} className="border border-gray-700 rounded-md p-1">
                {item.label}{" "}
                <a
                  className="text-gray-500 hover:text-rose-400 hover:cursor-pointer"
                  onClick={() => {
                    setDeleteList([...deleteList, item.cid]);
                    setDelete(true);
                  }}
                >
                  x
                </a>
              </span>
            ))}
          </div>
          <hr className="border-gray-800 mt-2" />
          {deleteStart && (
            <div className="pt-2">
              <div>
                <div className="px-2">
                  Deleting:
                  <span className="text-gray-600">
                    {categories.map(
                      (item, id) =>
                        deleteList.indexOf(item.cid) > -1 && (
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
              <button className="w-1/4 bg-gray-800 text-gray-100 hover:bg-gray-700">
                Add
              </button>
            </form>
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
