import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const getLabel = (objArr, link) => {
  return objArr.filter((item) => item.link == link)[0].label;
};

function Header() {
  const { route } = useRouter();
  const { data: session } = useSession();
  const links = [
    { label: "Index", link: "/" },
    { label: "Tracker", link: "/timer" },
    { label: "Links", link: "/linker" },
    { label: "Notes", link: "/noter" },
    // { label: "Activity", link: "/" },
    // { label: "URL Master", link: "/" },
    { label: "HF-AI", link: "/huggingface" },
  ];

  useEffect(() => {
    // This is for dynamic mapping the document title base on the url and setting the dropdown base on label
    const label = getLabel(links, route);
    document.title = `${label} | Logtree`;
    document.querySelector("[name=url]").value = label;
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
