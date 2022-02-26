import { fetcher } from "lib/fetcher";

export default function Timer({ data }) {
  const handleGPT2 = async (event) => {
    event.preventDefault();
    const data = event.target.querySelector("[name=sampleText]").value;
    const url = "https://api-inference.huggingface.co/models/gpt2";
    const query = fetcher("/api/huggingface/", { data, url });
    query.then((r) => alert(r[0].generated_text));
  };
  return (
    <div className="flex flex-wrap">
      <div className="w-1/2 border border-r-gray-800 h-[800px]">
        <div className="border border-gray-800 m-1 p-2 rounded-md">
          <h1>Hugging Face </h1>
          <form className="flex flex-col gap-2" onSubmit={handleGPT2}>
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
      </div>
      <div>
        <h2> Hey </h2>
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  return {
    props: {},
  };
};
