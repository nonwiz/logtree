import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { fetcher } from "lib/fetcher";
import { prisma } from "@/auth";

export default function Linker({ data }) {
  const parsedData = JSON.parse(data);
  const { categories } = parsedData;
  const [links, setLinks] = useState(parsedData["links"]);
  const [toast, setToast] = useState({ open: false, text: "" });
  console.log(links);

  const handleCreateLink = async (event) => {
    event.preventDefault();
    const category = event.target.querySelector("[name=category]").value;
    const refer = event.target.querySelector("[name=refer]").value;
    let label = event.target.querySelector("[name=label]").value;
    if (label.length < 1) {
      const splitRefer = refer.split(".")[0];
      label = splitRefer.substr(
        splitRefer.indexOf("http") > -1 ? "https://".length : 0
      );
    }
    const query = fetcher("/api/linker", {
      request: "create",
      category,
      refer,
      label,
    }).then((d) => {
      setLinks([...links, d.link]);
    });
  };

  const handleDeleteLink = async (lid) => {
    fetcher("/api/linker", { lid, request: "delete" });
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
                <option value="Uncategory"> Choose one </option>
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
      props: {
        data: {
          timers: [],
          categories: [],
          watchers: [],
        },
      },
    };
  }

  const categories = await prisma.category.findMany({
    where: {
      user: { email: session.user.email },
    },
  });

  const links = await prisma.link.findMany({
    where: {
      user: { email: session.user.email },
    },
  });

  const data = categories && JSON.stringify({ categories, links });

  return {
    props: {
      data,
    },
  };
};
