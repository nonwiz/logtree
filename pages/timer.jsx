import { useState } from "react";
import { useSession } from "next-auth/react";
import { fetcher } from "lib/fetcher";

export default function Timer({ users }) {
  const { data: session } = useSession();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const label = event.target.querySelector("[name=label]").value;

    // const newCategory = await prisma.category.create({ });
    console.log("submitted pressed", label);
    fetcher("/api/timer/category/create", { label });
    // const currentUser = await prisma.user.findUnique({
    //   where: { email: session.user.email, name: session.user.name },
    // });
  };
  console.log(session);
  const [isOpen, setOpen] = useState(true);
  const selection = ["Learning", "Working", "Project", "Exercise"];
  return (
    <div className="flex flex-wrap">
      <div className="w-1/2 border border-r-gray-800 h-[800px]">
        <div className="border border-gray-800 m-1 p-2 rounded-md">
          <h1>Create new timer </h1>
          <form className="flex flex-col gap-2">
            <select>
              <option> Choose one </option>
              {selection.map((item, id) => (
                <option key={id}> {item} </option>
              ))}
            </select>
            <textarea placeholder="Describe something about this timer..." />
          </form>
          <div className="mt-1 flex flex-row justify-between">
            <button>Start</button>
            <button>Stop</button>
          </div>
        </div>
        <details>
          <summary>Manage Category</summary>
          <div className="p-1 border border-gray-600 rounded-md pt-4 m-1">
            {selection.map((item, id) => (
              <span
                key={id}
                className="border border-gray-700 rounded-md p-1 m-1"
              >
                {item}
              </span>
            ))}
            <form className="flex py-2 px-1 flex-row" onSubmit={handleSubmit}>
              <input
                type="text"
                name="label"
                placeholder="Category"
                className="bg-gray-200 w-3/4 border border-gray-600 rounded-md p-1 mr-1"
              />
              <button className="w-1/4">Add</button>
            </form>
          </div>
        </details>
      </div>
      <div className="w-1/2 px-2">
        <h2>View List of timer </h2>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  // const users = await prisma.user.findMany();
  const users = {};
  return {
    props: { users },
  };
}
