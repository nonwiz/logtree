import { fetcher } from "lib/fetcher";
import { useState } from "react";

export default function HuggingFace() {
  const apiURL = "https://api-inference.huggingface.co/models/";
  const option = {
    "Generate Text": `${apiURL}gpt2`,
    "Positive or Negative?": `${apiURL}distilbert-base-uncased-finetuned-sst-2-english`,
  };
  console.log(option);
  const [output, setOutput] = useState({
    type: "text",
    data: "Output show here",
  });
  const handleGPT2 = async (event) => {
    event.preventDefault();
    const url = event.target.querySelector("[name=url]").value;
    const data = event.target.querySelector("[name=sampleText]").value;
    const query = fetcher("/api/huggingface/", { data, url: option[url] });
    query.then(
      (r) => (
        console.log(r), setOutput({ type: "text", data: JSON.stringify(r) })
      )
    );
  };
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="w-auto sm:border-gray-800 sm:border-r-2 p-1 sm:h-screen sm:w-86 md:w-[60vw] lg:w-[40vw]">
        <div className="border border-gray-800 m-1 p-2 rounded-md">
          <h1>Hugging Face </h1>
          <form className="flex flex-col gap-2" onSubmit={handleGPT2}>
            <select name="url">
              {Object.keys(option).map((item, id) => (
                <option key={id}>{item}</option>
              ))}
            </select>
            <textarea
              name="sampleText"
              placeholder="Describe something about this timer..."
            />

            <input
              type="submit"
              value="Query"
              className="bg-gray-800 text-gray-50 rounded-md"
            />
          </form>
        </div>
        <hr className="border-1 border-solid border-gray-500 m-2" />
      </div>
      <div className="w-full p-2">
        <details open>
          <summary>Result</summary>
          <div className="border border-gray-800 m-1 p-2 rounded-md text-gray-500">
            {output.type == "text" && <p>{output.data}</p>}
          </div>
        </details>
      </div>
    </div>
  );
}
