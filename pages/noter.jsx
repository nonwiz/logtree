import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useCategories, fetcher, getFieldsValues } from "lib/fetcher";
import { useSWRConfig } from "swr";
import { categorizeObj } from "lib/utils";
import ShowError from "@/components/showError";

export default function Noter() {
  const { data, isLoading, isError } = useCategories();
  const { mutate } = useSWRConfig();
  const inputList = ["description"];
  const [editMode, setEdit] = useState(false);

  const handleCreateNote = async (event) => {
    event.preventDefault();
    const formData = getFieldsValues(event, [...inputList, "category"]);
    fetcher("/api/noter/create", formData).then((d) => {
      const tmpNotes = [...data.notes, d.note];
      mutate("/api/logtree", { ...data, notes: tmpNotes }, false);
    });
    [...event.target.children].forEach((item) => {
      if (inputList.indexOf(item.name) > -1) item.value = "";
    });
  };

  const handleUpdateNote = async (note) => {
    const description = document.getElementById(`note-${note.nid}`);
    if (note.description != description.value) {
      // console.log(note, description.value);

      note.description = description.value;
      const tmpNotes = data.notes.map((noteItem) =>
        noteItem.nid == note.nid ? note : noteItem
      );
      mutate("/api/logtree", { ...data, notes: tmpNotes }, false);
      fetcher("/api/noter/update", {
        note: note.nid,
        description: description.value,
        category: note.categoryId,
      });

      setEdit(false);
    } else {
      description.value = "No changes made...";
      setTimeout(() => (description.value = note.description), 1000);
    }
  };

  const handleDeleteNote = async (nid) => {
    const tmpNotes = data.notes.filter((item) => item.nid != nid);
    mutate("/api/logtree", { ...data, notes: tmpNotes }, false);
    fetcher("/api/noter/delete", { nid });
  };

  if (isLoading) {
    return <div> Loading... </div>;
  }

  if (!isLoading && data.error) {
    return (
      <>
        <ShowError />
      </>
    );
  }

  console.log(data, categorizeObj(data.categoriesList, data.notes, "notes"));

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="w-auto sm:border-gray-800 sm:border-r-2 p-1 sm:h-screen sm:w-86 md:w-[60vw] lg:w-[40vw]">
        <details open>
          <summary>Create Note</summary>
          <div className="p-1 border border-gray-600 rounded-md pt-4 m-1">
            <form className="flex flex-col gap-2" onSubmit={handleCreateNote}>
              <select name="category">
                {data.categoriesList.map((item, id) => (
                  <option key={id} value={item.categoryId}>
                    {item.label}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Write down your note here..."
                rows="5"
              />

              <hr className="border-gray-800 mt-2" />
              <button className="w-full bg-gray-800 text-gray-100 hover:bg-gray-700">
                Pin Note
              </button>
            </form>
          </div>
        </details>
      </div>

      <div className="w-full p-2">
        <div className="flex flex-row justify-between">
          <h2>View List of Note </h2>
          <a
            className="cursor-pointer hover:underline pr-1 text-sm"
            onClick={(e) => {
              setEdit(!editMode);
            }}
          >
            {!editMode ? "🖉" : "📖"}
          </a>
        </div>
        {categorizeObj(data.categoriesList, data.notes, "notes").map((item) => (
          <div key={item.categoryId}>
            {item.notes.length ? (
              <details open>
                <summary> {item.label} </summary>
                <div className="p-1 m-1 rounded-md border border-gray-600">
                  <ul className="m-1 list-none">
                    {item.notes.map((note) => (
                      <li
                        key={note.nid}
                        className="p-2 bg-gray-300 rounded-md m-1"
                      >
                        <div className="word-break note-markdown">
                          {!editMode ? (
                            <ReactMarkdown>{note.description}</ReactMarkdown>
                          ) : (
                            <textarea
                              id={`note-${note.nid}`}
                              className="w-full bg-gray-300"
                              onChange={(e) => {
                                const height = e.target.scrollHeight;
                              }}
                              defaultValue={note.description}
                            />
                          )}
                        </div>
                        {editMode && (
                          <div className="flex flex-row justify-between mt-1">
                            <div>
                              <a
                                className="cursor-pointer hover:underline"
                                onClick={(e) => {
                                  e.target.text = "✓ Copied";
                                  e.target.className +=
                                    " text-gray-600 ease-in duration-300 ";
                                  navigator.clipboard.writeText(
                                    note.description
                                  );
                                  setTimeout(() => {
                                    e.target.text = "📋";
                                  }, 1000);
                                }}
                              >
                                📋
                              </a>
                            </div>
                            <a
                              className="text-gray-500 hover:text-rose-400 hover:cursor-pointer"
                              onClick={() => {
                                handleUpdateNote(note);
                              }}
                            >
                              Save
                            </a>
                          </div>
                        )}
                        {!editMode && (
                          <div className="flex flex-row justify-between mt-1">
                            <div>
                              <a
                                className="cursor-pointer hover:underline"
                                onClick={(e) => {
                                  e.target.text = "✓ Copied";
                                  e.target.className +=
                                    " text-gray-600 ease-in duration-300 ";
                                  navigator.clipboard.writeText(
                                    note.description
                                  );
                                  setTimeout(() => {
                                    e.target.text = "📋";
                                  }, 1000);
                                }}
                              >
                                📋
                              </a>
                            </div>
                            <a
                              className="text-gray-500 hover:text-rose-400 hover:cursor-pointer"
                              onClick={() => {
                                handleDeleteNote(note.nid);
                              }}
                            >
                              x
                            </a>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
