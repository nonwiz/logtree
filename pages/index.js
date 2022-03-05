import Head from "next/head";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { prisma } from "@/auth";
import { Category } from "@/components/category";
import { fetcher } from "lib/fetcher";
import { Welcome } from "@/components/welcome";
import ReactMarkdown from "react-markdown";

export default function Home({ data }) {
  const quotesUrl =
    "https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json";
  let parsedData = {};
  try {
    parsedData = JSON.parse(data);
  } catch (error) {}
  const { categories } = parsedData;
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
      {!parsedData.login && <Welcome />}
      {parsedData.login && (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="w-auto sm:border-gray-800 sm:border-r-2 p-1 sm:h-screen sm:w-86 md:w-[60vw] lg:w-[40vw]">
            {/* THis is the first column */}
            {parsedData.categories && <Category data={parsedData.categories} />}
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
            {!categories.length && <p>Empty...</p>}
            {categories.map((item, id) => (
              <div key={id}>
                <h3>{item.label}</h3>
                <div className="p-1 rounded-md border border-gray-600 my-1">
                  {!item.links.length && !item.notes.length && (
                    <div className=" text-gray-600 p-2">No links or notes</div>
                  )}
                  {item.links.length ? (
                    <details open>
                      <summary>Links:</summary>
                      <span className="p-4">
                        <span className="pl-2">⤷</span>

                        {item.links.map((link, id) => (
                          <a
                            key={id}
                            href={link.refer}
                            className="text-sky-700 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {" "}
                            {link.label}
                          </a>
                        ))}
                      </span>
                    </details>
                  ) : (
                    ""
                  )}
                  {item.notes.length ? (
                    <details open>
                      <summary>Notes</summary>
                      <div className="">
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

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      props: {
        data: {
          login: false,
        },
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      categories: {
        include: {
          links: true,
          trackers: true,
          notes: true,
        },
      },
    },
  });
  const data =
    user &&
    JSON.stringify({
      categories: user.categories,
      login: true,
    });

  return {
    props: {
      data,
    },
  };
};
