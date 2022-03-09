import { useCategories, fetcher, getFieldsValues } from "lib/fetcher";
import { useSWRConfig } from "swr";
import { categorizeObj } from "lib/utils";
import ShowError from "@/components/showError";
import ShowLoading from "@/components/showLoading";

export default function Linker() {
  const { data, isLoading, isError } = useCategories();
  const { mutate } = useSWRConfig();
  let linkLen;

  const handleCreateLink = async (event) => {
    event.preventDefault();
    const formData = getFieldsValues(event, ["category", "refer", "label"]);
    if (formData["label"].length < 1) {
      const splitRefer = formData.refer.split(".")[0];
      formData["label"] = splitRefer.substr(
        splitRefer.indexOf("http") > -1 ? "https://".length : 0
      );
    }
    const tmpLinks = [
      ...data.links,
      {
        label: formData.label,
        refer: formData.refer,
        categoryId: formData.category,
      },
    ];

    mutate("/api/logtree", { ...data, links: tmpLinks }, false);
    fetcher("/api/linker/create", formData).then(() => {
      mutate("/api/logtree");
    });
    event.target.reset();
    event.target.querySelector("[name=category]").value = formData.category;
  };

  const handleDeleteLink = async (lid) => {
    const tmpLinks = data.links.filter((link) => link.lid != lid);

    mutate("/api/logtree", { ...data, links: tmpLinks }, false);
    fetcher("/api/linker/delete", { lid });
  };

  if (isLoading) {
    return <ShowLoading />;
  }

  if (!isLoading && data.error) {
    return (
      <>
        {" "}
        <ShowError />{" "}
      </>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="w-auto sm:border-gray-800 sm:border-r-2 p-1 sm:h-screen sm:w-86 md:w-[60vw] lg:w-[40vw]">
        <details open>
          <summary>Manage Topic</summary>
          <div className="p-1 border border-gray-600 rounded-md pt-4 m-1">
            <form className="flex flex-col gap-2" onSubmit={handleCreateLink}>
              <select name="category">
                {data &&
                  data.categories.map((item, id) => (
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
        <details>
          <summary>To be added</summary>
          <ul className="px-4 list-disc text-gray-600">
            <li> Add filtering and automatic sorting </li>
            <li> Check for existing link </li>
          </ul>
        </details>
      </div>

      <div className="w-full p-2">
        <h2>View List of Link </h2>
        <hr />
        {!linkLen && <p>You have not add any link yet.</p>}
        {categorizeObj(data.categoriesList, data.links, "links").map((item) => (
          <div key={item.categoryId}>
            {item.links.length ? (
              <div className="p-1 m-1 rounded-md border border-gray-600">
                <h3>{item.label}</h3>
                <ul className="p-1 list-none">
                  {item.links.map((link, id) => (
                    <li key={id}>
                      <a
                        className={`cursor-pointer hover:underline `}
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
                        className={`hover:underline ${
                          !link.lid ? "text-gray-600" : "text-sky-700"
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        {link.label}{" "}
                      </a>
                      {link.lid && (
                        <a
                          className="text-gray-500 hover:text-rose-400 hover:cursor-pointer"
                          onClick={() => {
                            handleDeleteLink(link.lid);
                          }}
                        >
                          x
                        </a>
                      )}
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
