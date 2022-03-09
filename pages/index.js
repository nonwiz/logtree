import Head from "next/head";
import { useState, useEffect } from "react";
import { Category } from "@/components/category";
import { useCategories, getFetcher, fetcher } from "lib/fetcher";
import { Welcome } from "@/components/welcome";
import ReactMarkdown from "react-markdown";

import ShowLoading from "@/components/showLoading";
// import useSWR from "swr";

export default function Home() {
  const { data, isLoading, isError } = useCategories();
  console.log(data, isLoading, isError);
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
  return (
    <div>
      <Head>
        <title>Logtree | by Nonwiz</title>
        <meta
          name="description"
          content="A small application created to improve users productivity."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!isLoading && data.error && <Welcome />}
      {data && data.categories && (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="w-auto sm:border-gray-800 sm:border-r-2 p-1 sm:h-screen sm:w-86 md:w-[60vw] lg:w-[40vw]">
            {/* THis is the first column */}
            {data.categories && <Category data={data.categories} />}
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
          <div className="w-full p-2">
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
                      <div className="p-4">
                        {item.links.map((link, id) => (
                          <a
                            key={id}
                            href={link.refer}
                            className="text-sky-700 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {link.label},{" "}
                          </a>
                        ))}
                      </div>
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
