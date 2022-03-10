import { fetcher } from "lib/fetcher";
import { useState, useEffect } from "react";

function ShowLoading() {
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
    <div className="absolute inset-0 h-screen w-screen">
      <div className="p-2 mt-[10vh] sm:mt-[18vh]">
        <img
          src="/undraw_loading_re_5axr.svg"
          className="w-60 bg-gray-700 rounded-xl mx-auto"
        />
        <div className="flex justify-center items-center mt-4">
          <div
            className="spinner-border inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span className="visually-hidden text-xs">
              <i className="gg-loadbar-alt"></i>
            </span>
          </div>
        </div>

        <div className="p-1 text-center mx-auto w-96">
          <p className="break-word prose-md">{quote && quote.quoteText}</p>
          <p>
            {quote && (
              <span className="text-gray-600 mt-2">{`⤷ ${
                quote.quoteAuthor ? quote.quoteAuthor : "unknown"
              }`}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShowLoading;
