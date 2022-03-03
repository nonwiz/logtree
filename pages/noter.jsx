import { useState } from "react";
import { getSession } from "next-auth/react";
import { fetcher, getFieldsValues } from "lib/fetcher";
import { prisma } from "@/auth";

const filterOutEle = (obj, field, nestedField, id) => {
  obj[field] = obj[field].filter((item) => item[nestedField] != id);
  return obj;
};

export default function Noter({ data }) {
  const parsedData = JSON.parse(data);
  const categories = parsedData["categories"];
  const topics = categories
    .map((item) => item.trackers)
    .reduce((obj, curr) => {
      return [...obj, ...curr];
    }, []);
  console.log(topics);
  const [trackers, setTrackers] = useState(topics);
  const [notes, setnotes] = useState(parsedData["notes"]);
  const [toast, setToast] = useState({ open: false, text: "" });

  const handleCreateNote = async (event) => {
    event.preventDefault();
    const data = getFieldsValues(event, ["trackerId", "description"]);
    fetcher("/api/noter/create", data).then((d) => {
      console.log(d);
    });
  };

  const handleDeleteNote = async (nid, trackerId) => {
    fetcher("/api/noter/delete", { nid }).then((d) => {
      setTrackers([
        ...trackers.map((item) =>
          item.trackerId == trackerId
            ? filterOutEle(item, "notes", "nid", nid)
            : item
        ),
      ]);
    });
  };

  const showToast = (text) => {
    setToast({ open: true, text });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="w-auto sm:border-gray-800 sm:border-r-2 p-1 sm:h-screen sm:w-86 md:w-[60vw] lg:w-[40vw]">
        <details open>
          <summary>Manage Topic</summary>
          <div className="p-1 border border-gray-600 rounded-md pt-4 m-1">
            <form className="flex flex-col gap-2" onSubmit={handleCreateNote}>
              <select name="trackerId">
                {trackers.map((item, id) => (
                  <option key={id} value={item.trackerId}>
                    {item.description}
                  </option>
                ))}
              </select>

              <textarea name="description" placeholder="Put your Note here." />
              <input
                type="submit"
                value="Pin Note"
                className="bg-gray-800 text-gray-50 rounded-md"
              />
            </form>
          </div>
        </details>
      </div>

      <div className="w-full p-2">
        <h2>View List of Note </h2>
        {trackers.map((item) => (
          <div
            key={item.trackerId}
            className="p-1 m-1 rounded-md border border-gray-600"
          >
            <h3>{item.description}</h3>
            <div className="flex flex-wrap">
              {item.notes.map((note) => (
                <div
                  key={note.nid}
                  className="p-1 m-1 bg-gray-300 rounded-md w-60"
                >
                  <div>{note.description}</div>
                  <div className="flex justify-between mt-1">
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
                        handleDeleteNote(note.nid, item.trackerId);
                      }}
                    >
                      🗑
                    </a>
                  </div>
                </div>
              ))}
            </div>
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
          trackers: {
            select: {
              trackerId: true,
              description: true,
              notes: true,
            },
          },
        },
      },
    },
  });

  const data = JSON.stringify({
    categories: user.categories,
  });

  return {
    props: {
      data,
    },
  };
};
