import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useCategories, fetcher, getFieldsValues } from "lib/fetcher";
import { useSWRConfig } from "swr";
import { categorizeObj } from "lib/utils";
import ShowError from "@/components/showError";
import ShowLoading from "@/components/showLoading";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function Noter() {
  const { data, isLoading, isError } = useCategories();
  const inputList = ["description"];
  const { mutate } = useSWRConfig();
  const [description, setDescription] = useState("");
  const [editMode, setEdit] = useState(false);
  const styles = {
    createBox:
      "w-auto z-20 sm:w-100 sm:fixed z-10 left-0 top-0 overflow-hidden my-4 sm:mt-20 ease-in-out duration-700",
    listBox: "sm:ml-100 w-auto p-2 h-full ease-in-out duration-700",
  };

  const handleCreateNote = async (event) => {
    event.preventDefault();
    const formData = getFieldsValues(event, ["category"]);
    formData["description"] = description;
    // console.log(formData);
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
    return <ShowLoading />;
  }

  if (!isLoading && data.error) {
    return (
      <>
        <ShowError />
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <div id="create-note" className={styles.createBox}>
        <div className="sm:ml-1 p-1 border border-gray-800 rounded-md">
          <details open>
            <summary>Create Note</summary>
            <div className="text-right -mt-8">
              <button
                className="bg-gray-300 text-gray-800 hover:text-gray-300 hover:bg-gray-800"
                onClick={(e) => {
                  const createBox = document.querySelector("#create-note");
                  const listBox = document.querySelector("#list-note");
                  setTimeout(() => {
                    if (createBox.className != styles.createBox) {
                      createBox.className = styles.createBox;
                      listBox.className = styles.listBox;
                    } else {
                      createBox.classList.remove(
                        "sm:fixed",
                        "sm:w-100",
                        "sm:mt-20"
                      );
                      listBox.classList.remove("sm:ml-100");
                    }
                  }, 300);
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 9H3V7H7V3H9V9Z" fill="currentColor" />
                  <path d="M9 15H3V17H7V21H9V15Z" fill="currentColor" />
                  <path d="M21 15H15V21H17V17H21V15Z" fill="currentColor" />
                  <path
                    d="M15 9.00012H21V7.00012H17V3.00012H15V9.00012Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div className="p-1 m-1">
              <form className="flex flex-col gap-2" onSubmit={handleCreateNote}>
                <select name="category" required>
                  {data.categoriesList.map((item, id) => (
                    <option key={id} value={item.categoryId}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <div>
                  <MDEditor
                    value={description}
                    onChange={setDescription}
                    textareaProps={{
                      name: "description",
                      placeholder: "You can write your markdown here",
                      minLength: "5",
                    }}
                    placeholder="Write down your note here..."
                  />
                </div>

                <hr className="border-gray-800 mt-2" />
                <button
                  className="w-full bg-gray-800 text-gray-100 hover:bg-gray-700"
                  onClick={(e) => {
                    e.target.textContent = "Pinning...";
                    e.target.disabled = true;
                    setTimeout(() => {
                      e.target.textContent = "Pin Note";
                      e.target.disabled = false;
                    }, 2000);
                  }}
                >
                  Pin Note
                </button>
              </form>
            </div>
          </details>
        </div>
      </div>
      <div id="list-note" className={styles.listBox}>
        <div className="flex flex-row justify-between">
          <h2>View List of Note </h2>
          <a
            className="cursor-pointer hover:underline pr-1 text-sm"
            onClick={(e) => {
              setEdit(!editMode);
            }}
          >
            {!editMode ? "Edit 🖉" : "Preview 📖"}
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
                              rows="5"
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
