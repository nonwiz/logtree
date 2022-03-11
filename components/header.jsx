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
  const [openMenu, setMenu] = useState(false);
  const [enterPress, setEnter] = useState(false);
  const { route } = router;
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const links = [
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
    noter: { fx: "open", link: "/noter" },
    home: { fx: "open", link: "/dashboard" },
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
        master.value = "Loading...";
        setTimeout(() => {
          master.value = "";
          setEnter(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    // This is for dynamic mapping the document title base on the url and setting the dropdown base on label
    const label = getLabel(links, route);
    document.title = `${label ? label : "Apps"} | Logtree`;
    const menu = document.querySelector("[name=menu]");
    setTimeout(() => {
      menu.value = route;
    }, 500);
    const handleKeyUp = (e) => {
      const master = document.querySelector("#master");
      if (e.keyCode == "192") {
        master.value = "";
        master.focus();
      } else if (e.keyCode == "13" && enterPress) {
        if (master.value.length > 2) {
          runCommand();
          console.log("run command");
          mutate("/api/logtree");
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
        <title>Apps | Logtree </title>
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
                {session && <option value="/dashboard">Dashboard</option>}
                {!session && <option value="/signin">Login</option>}

                {session && session.user && (
                  <>
                    {links.map((item, id) => (
                      <option value={item.link} key={id}>
                        {item.label}
                      </option>
                    ))}
                  </>
                )}

                <option value="/">Index</option>
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
                onChange={() => {
                  setEnter(true);
                }}
              />
              <datalist id="commands">
                {Object.keys(commands).map((commandKey, id) => (
                  <option key={id}>{commandKey}</option>
                ))}
              </datalist>
            </div>

            {!session ? (
              <Link href="/signin">
                <button
                  className="text-gray-600"
                  onClick={(e) => {
                    e.target.textContent = "...";
                  }}
                >
                  Sign in
                </button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <button className="text-gray-100 bg-gray-600 h-8 hover:bg-gray-700">
                  Dashboard
                </button>
              </Link>
            )}
            {session?.user?.image && (
              <div>
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      type="button"
                      className="  flex items-center justify-center w-full rounded-md  p-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                      id="options-menu"
                      onClick={() => setMenu(!openMenu)}
                    >
                      <img
                        src={session.user.image}
                        className="w-6 h-6 rounded-full border border-gray-400"
                        layout="fill"
                      />
                    </button>
                  </div>
                  <div
                    className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                      openMenu ? "visible" : "invisible"
                    }`}
                    onMouseLeave={() =>
                      setTimeout(() => setMenu(!openMenu), 500)
                    }
                  >
                    <div
                      className="py-1 "
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://github.com/nonwiz/logtree#credits"
                        className="cursor-pointer block block px-4 py-2 text-md text-gray-600 hover:bg-gray-500 hover:text-gray-50 "
                        role="menuitem"
                      >
                        <span className="flex flex-col">
                          <span>Credits</span>
                        </span>
                      </a>
                      <a
                        className="cursor-pointer block block px-4 py-2 text-md text-rose-600 hover:bg-rose-500 hover:text-gray-50 "
                        role="menuitem"
                        onClick={(e) => {
                          e.target.textContent = "...";
                          signOut({ callbackUrl: `${window.location.origin}` });
                          mutate("/api/logtree");
                        }}
                      >
                        <span className="flex flex-col">
                          <span>Logout</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
