import { useState } from "react";
import { getSession } from "next-auth/react";
import { fetcher, getFieldsValues } from "lib/fetcher";
import { prisma } from "@/auth";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";

export default function Noter({ data }) {
  const router = useRouter();
  const inputList = ["description"];
  const parsedData = JSON.parse(data);
  const [categories, setCategories] = useState(parsedData["categories"]);
  const [editMode, setEdit] = useState(false);

  if (!categories.length) {
    alert("Please create Topic or category first before coming here");
    router.push("/");
  }

  const handleCreateNote = async (event) => {
    event.preventDefault();
    const data = getFieldsValues(event, [...inputList, "category"]);
    fetcher("/api/noter/create", data).then((d) => {
      const tmp = [...categories];
      tmp
        .filter((item) => item.categoryId == data.category)[0]
        .notes.push(d.note);
      setCategories(tmp);
    });
    [...event.target.children].forEach((item) => {
      if (inputList.indexOf(item.name) > -1) item.value = "";
    });
    console.log(event.target);
  };

  const handleUpdateNote = async (note, categoryId) => {
    const description = document.getElementById(`note-${note.nid}`);
    if (note.description != description.value) {
      console.log(note, description.value);
      fetcher("/api/noter/update", {
        note: note.nid,
        description: description.value,
        category: categoryId,
      }).then((d) => {
        let currentCategory = categories.filter(
          (item) => item.categoryId == categoryId
        )[0];
        currentCategory.notes = currentCategory.notes.filter(
          (item) => item.nid != note.nid
        );
        currentCategory.notes.unshift(d.note);
        setCategories(
          categories.map((item) =>
            item.categoryId == categoryId ? currentCategory : item
          )
        );
      });

      setEdit(false);
    } else {
      description.value = "No changes made...";
      setTimeout(() => (description.value = note.description), 1000);
    }
  };

  const handleDeleteNote = async (nid, categoryId) => {
    fetcher("/api/noter/delete", { nid });
    let currentCategory = categories.filter(
      (item) => item.categoryId == categoryId
    )[0];
    currentCategory.notes = currentCategory.notes.filter(
      (note) => note.nid != nid
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
          <summary>Create Note</summary>
          <div className="p-1 border border-gray-600 rounded-md pt-4 m-1">
            <form className="flex flex-col gap-2" onSubmit={handleCreateNote}>
              <select name="category">
                {categories.map((item, id) => (
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
        {categories.map((item) => (
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
                                handleUpdateNote(note, item.categoryId);
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
                                handleDeleteNote(note.nid, item.categoryId);
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
          notes: true,
        },
      },
    },
  });

  const data =
    user &&
    JSON.stringify({
      categories: user.categories,
    });

  return {
    props: {
      data,
    },
  };
};
