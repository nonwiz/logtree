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
  const [timers, setTimers] = useState(parsedData["timers"]);
  const [notes, setnotes] = useState(parsedData["notes"]);
  const [toast, setToast] = useState({ open: false, text: "" });

  const handleCreateNote = async (event) => {
    event.preventDefault();
    const data = getFieldsValues(event, ["timerId", "description"]);
    fetcher("/api/noter/create", data).then((d) => {
      setTimers([
        ...timers.filter((item) => item.timerId != data.timerId),
        d.timer,
      ]);
    });
  };

  const handleDeleteNote = async (nid, timerId) => {
    fetcher("/api/noter/delete", { nid }).then((d) => {
      setTimers([
        ...timers.map((item) =>
          item.timerId == timerId
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
    <div className="flex flex-wrap">
      <div className="w-1/2 border border-r-gray-800 h-[800px]">
        <details open>
          <summary>Manage Topic</summary>
          <div className="p-1 border border-gray-600 rounded-md pt-4 m-1">
            <form
              className="flex py-2 px-1 flex-col"
              onSubmit={handleCreateNote}
            >
              <select name="timerId">
                {timers.map((item, id) => (
                  <option key={id} value={item.timerId}>
                    {" "}
                    {item.description}{" "}
                  </option>
                ))}
              </select>

              <div>
                <textarea
                  name="description"
                  placeholder="Put your Note here."
                />
              </div>
              <div>
                <button className="w-1/4">Add</button>
              </div>
            </form>
          </div>
        </details>
      </div>
      <div className="w-1/2 px-2">
        <h2>View List of Note </h2>
        {timers.map((item) => (
          <div
            key={item.timerId}
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
                        handleDeleteNote(note.nid, item.timerId);
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

  const timers = await prisma.timer.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    select: {
      timerId: true,
      description: true,
      category: true,
      notes: true,
    },
  });

  const data = timers && JSON.stringify({ timers });

  return {
    props: {
      data,
    },
  };
};
