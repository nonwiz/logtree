import { useState } from "react";
import { getSession } from "next-auth/react";
import { fetcher, getFieldsValues } from "lib/fetcher";
import { prisma } from "@/auth";

export default function Noter({ data }) {
  const parsedData = JSON.parse(data);
  const [categories, setCategories] = useState(parsedData["categories"]);

  const handleCreateNote = async (event) => {
    event.preventDefault();
    const data = getFieldsValues(event, ["description", "category"]);
    fetcher("/api/noter/create", data).then((d) => {
      const tmp = [...categories];
      tmp.filter((item) => item.cid == data.category)[0].notes.push(d.note);
      setCategories(tmp);
    });
  };

  const handleDeleteNote = async (nid, cid) => {
    fetcher("/api/noter/delete", { nid });
    let currentCategory = categories.filter((item) => item.cid == cid)[0];
    currentCategory.notes = currentCategory.notes.filter(
      (note) => note.nid != nid
    );
    setCategories(
      categories.map((item) => (item.cid == cid ? currentCategory : item))
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="w-auto sm:border-gray-800 sm:border-r-2 p-1 sm:h-screen sm:w-86 md:w-[60vw] lg:w-[40vw]">
        <details open>
          <summary>Manage Topic</summary>
          <div className="p-1 border border-gray-600 rounded-md pt-4 m-1">
            <form className="flex flex-col gap-2" onSubmit={handleCreateNote}>
              <select name="category">
                {categories.map((item, id) => (
                  <option key={id} value={item.cid}>
                    {item.label}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Write down your note here..."
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
        <h2>View List of Note </h2>
        {categories.map((item) => (
          <div key={item.cid}>
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
                        <div className="word-break">{note.description}</div>
                        <div className="flex flex-row justify-between py-1">
                          <a
                            className="cursor-pointer hover:underline"
                            onClick={() => {
                              navigator.clipboard.writeText(note.description);
                            }}
                          >
                            📋
                          </a>

                          <a
                            className="text-gray-500 hover:text-rose-400 hover:cursor-pointer"
                            onClick={() => {
                              handleDeleteNote(note.nid, item.cid);
                            }}
                          >
                            x
                          </a>
                        </div>
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
          cid: true,
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
