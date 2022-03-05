import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const getLabel = (objArr, link) => {
  return objArr.filter((item) => item.link == link)[0].label;
};

function Header() {
  const router = useRouter();
  const { route } = router;
  const { data: session } = useSession();
  const links = [
    { label: "Index", link: "/" },
    { label: "Tracker", link: "/tracker" },
    { label: "Links", link: "/linker" },
    { label: "Notes", link: "/noter" },
    // { label: "Activity", link: "/" },
    // { label: "URL Master", link: "/" },
    { label: "HF-AI", link: "/huggingface" },
  ];

  const commands = {
    tracker: { fx: "open", link: "/tracker" },
    notes: { fx: "open", link: "/noter" },
    home: { fx: "open", link: "/" },
    links: { fx: "open", link: "/linker" },
    index: { fx: "open", link: "/" },
  };

  const runCommand = (e) => {
    const master = document.querySelector("#master");
    if (commands.hasOwnProperty(master.value)) {
      if (commands[master.value].fx == "open")
        router.push(commands[master.value].link);
      console.log(e, master, commands);
      setTimeout(() => (master.value = ""), 1000);
    }
  };

  useEffect(() => {
    // This is for dynamic mapping the document title base on the url and setting the dropdown base on label
    const label = getLabel(links, route);
    document.title = `${label} | Logtree`;
    document.querySelector("[name=url]").value = label;
    const handleKeyUp = (e) => {
      const master = document.querySelector("#master");
      if (e.keyCode == "192") {
        master.value = "";
        master.focus();
      }
    };
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  });

  return (
    <>
      <div className="p-2 flex flex-wrap justify-between border border-b-gray-300">
        <div>
          {" "}
          <span className="bg-gray-800 text-gray-100 p-1 rounded-md">
            <Link href="/">LOGTREE</Link>
          </span>
          <span>:-</span>
          <span className="space-x-2">
            <select name="url">
              {links.map((item, id) => (
                <Link
                  href={item.link}
                  className="hover:underline active:underline decoration-dashed"
                  key={id}
                >
                  <option>{item.label}</option>
                </Link>
              ))}
            </select>
          </span>
        </div>
        <div className="flex flex-row gap-2">
          <input
            list="commands"
            id="master"
            onKeyPress={runCommand}
            placeholder="Press [`]"
            className="bg-gray-300 p-1 rounded-md text-gray-600"
          />
          <datalist id="commands">
            {Object.keys(commands).map((commandKey, id) => (
              <option key={id}>{commandKey}</option>
            ))}
          </datalist>
          {session?.user?.image && (
            <img
              src={session.user.image}
              className="w-8 h-8 rounded-full border border-gray-400"
              layout="fill"
            />
          )}

          {!session ? (
            <Link href="/api/auth/signin"> Sign in </Link>
          ) : (
            <button
              onClick={() => signOut()}
              className="bg-rose-500 text-red-50"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
