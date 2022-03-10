import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Head from "next/head";
import { useSWRConfig } from "swr";
import { createTopic } from "lib/utils";

const getLabel = (objArr, link) => {
  let label;
  try {
    label = objArr.filter((item) => item.link == link)[0].label;
  } catch (err) {
    label = link.substr(1);
  }
  return label;
};

function Header() {
  const router = useRouter();
  const [enterPress, setEnter] = useState(false);
  const { route } = router;
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const links = [
    { label: "Index", link: "/" },
    { label: "Tracker", link: "/tracker" },
    { label: "Links", link: "/linker" },
    { label: "Notes", link: "/noter" },
    // { label: "Activity", link: "/" },
    // { label: "URL Master", link: "/" },
    { label: "HF-AI", link: "/huggingface" },
  ];
  if (!session) {
    links.push({ label: "Login", link: "/login" });
  }

  const commands = {
    tracker: { fx: "open", link: "/tracker" },
    notes: { fx: "open", link: "/noter" },
    noter: { fx: "open", link: "/noter" },
    home: { fx: "open", link: "/" },
    links: { fx: "open", link: "/linker" },
    linker: { fx: "open", link: "/linker" },
    index: { fx: "open", link: "/" },
    login: { fx: "open", link: "/signin" },
    ct: {
      fx: "runM",
      runFx: function (temp) {
        if (temp.length == 2 && temp[1].length > 5) {
          const tmp = createTopic(temp[1]);
          console.log(tmp);
        }
      },
    },
    logout: {
      fx: "run",
      runFx: function (temp) {
        signOut();
        mutate("/api/logtree");
      },
    },
  };

  const runCommand = () => {
    const master = document.querySelector("#master");
    const splitMaster = master.value.split(" ");
    const operation = splitMaster[0];
    if (commands.hasOwnProperty(operation)) {
      if (commands[operation].fx == "open")
        router.push(commands[operation].link);
      else if (commands[operation].fx == "run") {
        commands[operation].runFx(splitMaster);
      } else if (commands[operation].fx == "runM") {
        commands[operation].runFx(splitMaster);
      }
    }
  };

  useEffect(() => {
    // This is for dynamic mapping the document title base on the url and setting the dropdown base on label
    const label = getLabel(links, route);
    document.title = `${label} | Logtree`;
    const menu = document.querySelector("[name=menu]");
    setTimeout(() => {
      menu.value = route;
    }, 500);
    const handleKeyUp = (e) => {
      const master = document.querySelector("#master");
      if (e.keyCode == "192") {
        master.value = "";
        master.focus();
      } else if (e.keyCode == "13") {
        if (master.value.length > 2) {
          runCommand();
          console.log("run command");
        }
      }
    };
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  });

  return (
    <>
      <Head>
        <meta name="title" content="Logtree | Apps" />
        <meta
          name="description"
          content="This is logtree, a platform compile a lot of useful productivity applications together in one bundle and learn users use it easely."
        />

        <link rel="icon" href="/logo.png" />
        <meta property="og:image" content="/media_card.png" />
        <meta property="twitter:card" content="/media_card.png" />
        <meta property="twitter:image" content="/media_card.png" />
      </Head>
      <div className="fixed top-0 w-screen bg-gray-200 z-20 pr-1 sm:pr-4">
        <div className="p-2 flex flex-wrap justify-between border border-b-gray-300">
          <div>
            <span className="bg-gray-800 text-gray-100 p-1 py-2 rounded-sm">
              <Link href="/">LOGTREE</Link>
            </span>
            <span>:-</span>
            <span className="space-x-2">
              <select
                name="menu"
                id="menu"
                onChange={(e) => router.push(e.target.value)}
              >
                {links.map((item, id) => (
                  <option value={item.link} key={id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </span>
          </div>
          <div className="flex flex-row gap-2">
            <div className="hidden sm:block">
              <input
                list="commands"
                id="master"
                placeholder="Press [`]"
                className="bg-gray-300 p-1 rounded-md text-gray-600 w-60"
              />
              <datalist id="commands">
                {Object.keys(commands).map((commandKey, id) => (
                  <option key={id}>{commandKey}</option>
                ))}
              </datalist>
            </div>
            {session?.user?.image && (
              <img
                src={session.user.image}
                className="w-8 h-8 rounded-full border border-gray-400"
                layout="fill"
              />
            )}

            {!session ? (
              <Link href="/signin">
                <button className="text-gray-600"> Sign in </button>
              </Link>
            ) : (
              <button
                onClick={() => {
                  signOut();
                  mutate("/api/logtree");
                }}
                className="bg-rose-500 text-red-50 hover:bg-rose-400"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
