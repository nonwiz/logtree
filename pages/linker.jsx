import { useState } from "react";
import { getSession } from "next-auth/react";
import { fetcher, getFieldsValues } from "lib/fetcher";
import { prisma } from "@/auth";

export default function Linker({ data }) {
  const parsedData = JSON.parse(data);
  const { categories } = parsedData;
  const [links, setLinks] = useState(parsedData["links"]);
  const [toast, setToast] = useState({ open: false, text: "" });

  const handleCreateLink = async (event) => {
    event.preventDefault();
    const data = getFieldsValues(event, ["category", "refer", "label"]);
    console.log(data);
    if (data["label"].length < 1) {
      const splitRefer = data.refer.split(".")[0];
      data["label"] = splitRefer.substr(
        splitRefer.indexOf("http") > -1 ? "https://".length : 0
      );
    }
    fetcher("/api/linker/create", data).then((d) => {
      setLinks([...links, d.link]);
    });
  };

  const handleDeleteLink = async (lid) => {
    fetcher("/api/linker/delete", { lid });
    setLinks(links.filter((item) => item.lid !== lid));
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
              onSubmit={handleCreateLink}
            >
              <select name="category">
                {categories.map((item, id) => (
                  <option key={id} value={item.label}>
                    {" "}
                    {item.label}{" "}
                  </option>
                ))}
              </select>

              <div>
                <textarea name="refer" placeholder="Put your link here." />
              </div>
              <div>
                <input
                  type="text"
                  name="label"
                  placeholder="Label"
                  className="bg-gray-200 w-auto border border-gray-600 rounded-md p-1 mr-1"
                />
                <button className="w-1/4">Add</button>
              </div>
            </form>
          </div>
        </details>
      </div>
      <div className="w-1/2 px-2">
        <h2>View List of Link </h2>
        {categories.map((item) => (
          <div
            key={item.cid}
            className="p-1 m-1 rounded-md border border-gray-600"
          >
            <h3>{item.label}</h3>
            <ul className="p-1 list-none">
              {links.map(
                (link) =>
                  link.category == item.label && (
                    <li key={link.lid}>
                      <a
                        className="cursor-pointer hover:underline"
                        onClick={() => {
                          navigator.clipboard.writeText(link.refer);
                        }}
                      >
                        📋
                      </a>
                      <a
                        href={link.refer}
                        className="text-sky-700 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        {link.label}{" "}
                      </a>
                      <a
                        className="text-gray-500 hover:text-rose-400 hover:cursor-pointer"
                        onClick={() => {
                          handleDeleteLink(link.lid);
                        }}
                      >
                        x
                      </a>
                    </li>
                  )
              )}
            </ul>
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
      categories: true,
      links: true,
    },
  });

  const data =
    user && JSON.stringify({ categories: user.categories, links: user.links });

  return {
    props: {
      data,
    },
  };
};
