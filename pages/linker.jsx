import { useState } from "react";
import { getSession } from "next-auth/react";
import { fetcher, getFieldsValues } from "lib/fetcher";
import { prisma } from "@/auth";
import { useRouter } from "next/router";

export default function Linker({ data }) {
  const parsedData = JSON.parse(data);
  const [categories, setCategories] = useState(parsedData["categories"]);

  const router = useRouter();

  if (!categories.length) {
    alert("Please create Topic or category first before coming here");
    router.push("/");
  }
  const linkLen = categories.reduce(
    (len, cate) => (len += cate.links.length),
    0
  );
  const handleCreateLink = async (event) => {
    event.preventDefault();
    const data = getFieldsValues(event, ["category", "refer", "label"]);
    if (data["label"].length < 1) {
      const splitRefer = data.refer.split(".")[0];
      data["label"] = splitRefer.substr(
        splitRefer.indexOf("http") > -1 ? "https://".length : 0
      );
    }
    fetcher("/api/linker/create", data).then((d) => {
      const tmp = [...categories];
      tmp
        .filter((item) => item.categoryId == data.category)[0]
        .links.push(d.link);
      setCategories(tmp);
    });
  };

  const handleDeleteLink = async (lid, categoryId) => {
    fetcher("/api/linker/delete", { lid });
    let currentCategory = categories.filter(
      (item) => item.categoryId == categoryId
    )[0];
    currentCategory.links = currentCategory.links.filter(
      (link) => link.lid != lid
    );
    setCategories(
      categories.map((item) =>
        item.categoryId == categoryId ? currentCategory : item
      )
    );
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
            <form className="flex flex-col gap-2" onSubmit={handleCreateLink}>
              <select name="category">
                {categories.map((item, id) => (
                  <option key={id} value={item.categoryId}>
                    {item.label}
                  </option>
                ))}
              </select>
              <input
                type="url"
                name="refer"
                className="bg-gray-200 rounded-md p-1 mr-1"
                placeholder="Put your link here..."
              />

              <hr className="border-gray-800 mt-2" />
              <div className="flex flex-row px-1 py-1">
                <input
                  className="bg-gray-200 w-3/4 border border-gray-600 rounded-md p-1 mr-1"
                  type="text"
                  name="label"
                  placeholder="Label"
                />

                <button className="w-1/4 bg-gray-800 text-gray-100 hover:bg-gray-700">
                  Add
                </button>
              </div>
            </form>
          </div>
        </details>
      </div>

      <div className="w-full p-2">
        <h2>View List of Link </h2>
        {!linkLen && <p>You haven't add any link yet.</p>}
        {categories.map((item) => (
          <div key={item.categoryId}>
            {item.links.length ? (
              <div className="p-1 m-1 rounded-md border border-gray-600">
                <h3>{item.label}</h3>
                <ul className="p-1 list-none">
                  {item.links.map((link) => (
                    <li key={link.lid}>
                      <a
                        className="cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.target.text = "✓ Copied";
                          e.target.className +=
                            " text-gray-600 ease-in duration-300 ";
                          setTimeout(() => {
                            e.target.text = "📋";
                          }, 1000);
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
                          handleDeleteLink(link.lid, item.categoryId);
                        }}
                      >
                        x
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
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
          links: true,
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
