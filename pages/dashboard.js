import { useState, useEffect } from "react";
import { Category } from "@/components/category";
import { useCategories, fetcher } from "lib/fetcher";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";

import ShowLoading from "@/components/showLoading";
import ShowError from "@/components/showError";
// import useSWR from "swr";

export default function Dashboard() {
  const router = useRouter();
  const { data, isLoading } = useCategories();
  const quotesUrl =
    "https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json";
  try {
  } catch (error) {}
  const [quote, setQuote] = useState();

  useEffect(() => {
    let quotes;
    try {
      quotes = JSON.parse(localStorage.getItem("quotes"));

      if (!quotes || !quotes.length) {
        const query = fetcher("/api/quotes/", { url: quotesUrl });
        query.then((result) =>
          localStorage.setItem("quotes", JSON.stringify(result))
        );

        quotes = JSON.parse(localStorage.getItem("quotes"));
      }
      setQuote(quotes[Math.floor(Math.random() * quotes.length - 1)]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (isLoading) {
    return <ShowLoading />;
  }

  if (!isLoading && !data.login) {
    router.push("/");
  }

  return (
    <div className="">
      {data && data.categories && (
        <div className="flex flex-col">
          <div className="w-auto sm:w-100 sm:fixed w-auto z-10 left-0 top-0 overflow-hidden my-4 sm:mt-20">
            <div className="sm:ml-1 p-1 border border-gray-800 rounded-md">
              {data.categories && <Category data={data.categories} />}
            </div>

            <div className="border sm:ml-1 p-1 border-gray-800 mt-2 rounded-md p-2">
              <details open>
                <summary> Inspiration </summary>
                <div className="p-2 bg-gray-300 text-gray-600 m-2 min-h-fit ">
                  {quote && (
                    <div>
                      {quote.quoteText} <br />{" "}
                      <div className="text-right">- {quote.quoteAuthor}</div>
                    </div>
                  )}
                </div>
              </details>
            </div>
          </div>
          <div className="sm:ml-100 w-auto p-2 h-full">
            {/* This is the second column or the right column when width-sm */}
            <h2>Recent Tree </h2>
            {!data.categories.length && <p>Empty...</p>}
            {data.categories.map((item, id) => (
              <div key={id}>
                <div className="flex justify-between">
                  <h3>{item.label}</h3>
                  <p>
                    {Math.floor(
                      item.trackers.reduce(
                        (total, curr) => (total += curr.duration),
                        0
                      ) / 60
                    )}{" "}
                    mins
                  </p>
                </div>
                <div className="p-1 rounded-md border border-gray-600 my-1">
                  {!item.links.length && !item.notes.length && (
                    <div className=" text-gray-600 p-2">No links or notes</div>
                  )}
                  {item.links.length ? (
                    <details open>
                      <summary>Links:</summary>
                      <ul className="list-disc px-8">
                        {item.links.map((link, id) => (
                          <li key={id}>
                            <a
                              href={link.refer}
                              className="text-sky-700 hover:underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {link.label}{" "}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    ""
                  )}
                  {item.notes.length ? (
                    <details>
                      <summary>Notes</summary>
                      <div className="p-2">
                        {item.notes.map((note) => (
                          <div key={note.nid} className="break-all">
                            <ReactMarkdown>{note.description}</ReactMarkdown>
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : (
                    ""
                  )}
                  <ul className="p-1 list-none"></ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
